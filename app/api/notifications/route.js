import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Notification from '../../../models/Notification';
import { authenticateUser } from '../../../lib/auth';

export async function GET(request) {
  try {
    const auth = await authenticateUser(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await connectDB();
    
    const notifications = await Notification.find({ userId: auth.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ notifications });

  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const auth = await authenticateUser(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { notificationId } = await request.json();

    await connectDB();
    
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });

    return NextResponse.json({ message: 'Notification marked as read' });

  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}