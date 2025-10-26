import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import BalanceRequest from '../../../../models/BalanceRequest';
import User from '../../../../models/User';
import { requireAdmin } from '../../../../lib/auth';
import { sendBalanceRequestUpdateToUser } from '../../../../lib/email';

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
    
    const requests = await BalanceRequest.find(filter)
      .populate('userId', 'fullName email')
      .populate('processedBy', 'fullName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await BalanceRequest.countDocuments(filter);

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
    console.error('Get admin balance requests error:', error);
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

    const { requestId, status, adminNotes } = await request.json();

    if (!requestId || !status) {
      return NextResponse.json(
        { error: 'Thiếu thông tin yêu cầu' },
        { status: 400 }
      );
    }

    await connectDB();

    const balanceRequest = await BalanceRequest.findById(requestId).populate('userId');
    if (!balanceRequest) {
      return NextResponse.json(
        { error: 'Không tìm thấy yêu cầu' },
        { status: 404 }
      );
    }

    balanceRequest.status = status;
    balanceRequest.processedBy = auth.user._id;
    balanceRequest.processedAt = new Date();
    
    if (adminNotes) {
      balanceRequest.adminNotes = adminNotes;
    }

    // Nếu admin duyệt, cộng tiền vào balance của user
    if (status === 'verified') {
      await User.findByIdAndUpdate(
        balanceRequest.userId._id,
        { $inc: { balance: balanceRequest.requestedAmount } }
      );
    }

    await balanceRequest.save();

    // Gửi email cho user
    await sendBalanceRequestUpdateToUser(
      balanceRequest.userId.email,
      balanceRequest.userId.fullName,
      status,
      balanceRequest.requestedAmount
    );

    return NextResponse.json({
      message: 'Cập nhật yêu cầu thành công',
      request: balanceRequest
    });

  } catch (error) {
    console.error('Update balance request error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}