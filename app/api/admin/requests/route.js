import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Request from '../../../../models/Request';
import User from '../../../../models/User';
import { requireAdmin } from '../../../../lib/auth';
import { sendRequestUpdateToUser } from '../../../../lib/email';
import { notifyUserRequestUpdate } from '../../../../lib/notifications';

export async function GET(request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    const filter = status ? { status } : {};
    
    const requests = await Request.find(filter)
      .populate('userId', 'fullName email')
      .populate('processedBy', 'fullName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Request.countDocuments(filter);

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get admin requests error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { requestId, status, names, adminNotes } = await request.json();

    if (!requestId || !status) {
      return NextResponse.json(
        { error: 'Thiếu thông tin yêu cầu' },
        { status: 400 }
      );
    }

    await connectDB();

    const requestDoc = await Request.findById(requestId).populate('userId', 'fullName email');
    if (!requestDoc) {
      return NextResponse.json(
        { error: 'Không tìm thấy yêu cầu' },
        { status: 404 }
      );
    }

    requestDoc.status = status;
    requestDoc.processedBy = auth.user._id;
    requestDoc.processedAt = new Date();
    
    if (adminNotes) {
      requestDoc.adminNotes = adminNotes;
    }

    if (names && Array.isArray(names)) {
      requestDoc.names = names;
    }

    await requestDoc.save();

    // Gửi email và thông báo cho user
    await sendRequestUpdateToUser(
      requestDoc.userId.email,
      requestDoc.userId.fullName,
      status,
      requestId
    );
    await notifyUserRequestUpdate(requestDoc.userId._id, status, requestId);

    return NextResponse.json({
      message: 'Cập nhật yêu cầu thành công',
      request: requestDoc
    });

  } catch (error) {
    console.error('Update request error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}