import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Request from '../../../../models/Request';
import { requireAdmin } from '../../../../lib/auth';

export async function PUT(request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { requestId, sessionNumbers } = await request.json();

    if (!requestId || !sessionNumbers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const requestDoc = await Request.findById(requestId);
    if (!requestDoc) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Parse session numbers (comma separated or line separated)
    const numbers = sessionNumbers.split(/[,\n]/).map(s => s.trim()).filter(s => s);

    // Update names with session numbers in order
    requestDoc.names.forEach((name, index) => {
      if (numbers[index]) {
        name.sessionNumber = numbers[index];
      }
    });

    requestDoc.status = 'completed';
    requestDoc.processedBy = auth.user._id;
    requestDoc.processedAt = new Date();

    await requestDoc.save();

    return NextResponse.json({
      message: 'Batch update successful',
      request: requestDoc
    });

  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}