import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Request from '../../../../models/Request';
import User from '../../../../models/User';
import { authenticateUser } from '../../../../lib/auth';
import { sendRequestNotificationToAdmin } from '../../../../lib/email';
import { notifyAdminsNewRequest } from '../../../../lib/notifications';

export async function POST(request) {
  try {
    const auth = await authenticateUser(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { names, submissionType, fileName, categoryId } = await request.json();

    if (!names || !Array.isArray(names) || names.length === 0) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp danh sách tên' },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Vui lòng chọn danh mục' },
        { status: 400 }
      );
    }

    await connectDB();

    const newRequest = new Request({
      userId: auth.user._id,
      categoryId,
      names: names.map((name, index) => ({
        index: typeof name === 'object' ? name.index : index + 1,
        fullName: typeof name === 'object' ? name.fullName : name.trim()
      })),
      submissionType,
      fileName
    });

    await newRequest.save();

    // Gửi email và thông báo cho admin
    await sendRequestNotificationToAdmin(auth.user.fullName, newRequest._id);
    await notifyAdminsNewRequest(newRequest._id, auth.user.fullName);

    return NextResponse.json({
      message: 'Gửi yêu cầu thành công. Admin sẽ xử lý trong thời gian sớm nhất.',
      requestId: newRequest._id
    });

  } catch (error) {
    console.error('Create request error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const auth = await authenticateUser(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await connectDB();

    const requests = await Request.find({ userId: auth.user._id })
      .sort({ createdAt: -1 })
      .populate('processedBy', 'fullName')
      .populate('categoryId', 'name');

    return NextResponse.json({ requests });

  } catch (error) {
    console.error('Get requests error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}