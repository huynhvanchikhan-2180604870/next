import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Withdraw from '../../../../models/Withdraw';
import User from '../../../../models/User';
import { requireAdmin } from '../../../../lib/auth';
import { sendWithdrawUpdateToUser } from '../../../../lib/email';

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
    
    const withdraws = await Withdraw.find(filter)
      .populate('userId', 'fullName email balance')
      .populate('processedBy', 'fullName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Withdraw.countDocuments(filter);

    return NextResponse.json({
      withdraws,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get admin withdraws error:', error);
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

    const { withdrawId, status, notes, proofImage, failureReason } = await request.json();

    if (!withdrawId || !status) {
      return NextResponse.json(
        { error: 'Thiếu thông tin yêu cầu' },
        { status: 400 }
      );
    }

    await connectDB();

    const withdraw = await Withdraw.findById(withdrawId).populate('userId');
    if (!withdraw) {
      return NextResponse.json(
        { error: 'Không tìm thấy lệnh rút tiền' },
        { status: 404 }
      );
    }

    withdraw.status = status;
    withdraw.processedBy = auth.user._id;
    withdraw.processedAt = new Date();
    
    if (notes) withdraw.notes = notes;
    if (proofImage) withdraw.proofImage = proofImage;
    if (failureReason) withdraw.failureReason = failureReason;

    // Nếu thất bại, hoàn tiền về balance
    if (status === 'failed') {
      await User.findByIdAndUpdate(
        withdraw.userId._id,
        { $inc: { balance: withdraw.amount } }
      );
    }

    await withdraw.save();

    // Gửi email cho user
    await sendWithdrawUpdateToUser(
      withdraw.userId.email,
      withdraw.userId.fullName,
      status,
      withdraw.amount,
      proofImage,
      failureReason
    );

    return NextResponse.json({
      message: 'Cập nhật lệnh rút tiền thành công',
      withdraw
    });

  } catch (error) {
    console.error('Update withdraw error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}