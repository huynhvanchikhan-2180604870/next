import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import BalanceRequest from '../../../../models/BalanceRequest';
import { authenticateUser } from '../../../../lib/auth';
import { sendBalanceRequestToAdmin } from '../../../../lib/email';

export async function POST(request) {
  try {
    const auth = await authenticateUser(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { requestedAmount } = await request.json();

    if (!requestedAmount || requestedAmount <= 0) {
      return NextResponse.json(
        { error: 'Số tiền không hợp lệ' },
        { status: 400 }
      );
    }

    await connectDB();

    const balanceRequest = new BalanceRequest({
      userId: auth.user._id,
      requestedAmount
    });

    await balanceRequest.save();

    // Gửi email cho admin
    await sendBalanceRequestToAdmin(auth.user.fullName, requestedAmount, balanceRequest._id);

    return NextResponse.json({
      message: 'Gửi yêu cầu xác minh số dư thành công',
      requestId: balanceRequest._id
    });

  } catch (error) {
    console.error('Balance request error:', error);
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

    const requests = await BalanceRequest.find({ userId: auth.user._id })
      .sort({ createdAt: -1 })
      .populate('processedBy', 'fullName');

    return NextResponse.json({ requests });

  } catch (error) {
    console.error('Get balance requests error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}