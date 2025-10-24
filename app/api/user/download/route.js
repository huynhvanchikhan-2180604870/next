import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import connectDB from '../../../../lib/db';
import Request from '../../../../models/Request';
import { authenticateUser } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const auth = await authenticateUser(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('requestId');

    if (!requestId) {
      return NextResponse.json({ error: 'Request ID required' }, { status: 400 });
    }

    await connectDB();
    const userRequest = await Request.findOne({ 
      _id: requestId, 
      userId: auth.user._id,
      status: 'completed'
    });

    if (!userRequest) {
      return NextResponse.json({ error: 'Request not found or not completed' }, { status: 404 });
    }

    // Create Excel data
    const data = userRequest.names.map(name => ({
      'STT': name.index,
      'Họ và tên': name.fullName,
      'Số phiên': name.sessionNumber || 'Chưa có'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Kết quả');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="ket-qua-${requestId}.xlsx"`
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}