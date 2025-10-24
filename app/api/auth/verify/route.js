import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import User from '../../../../models/User';

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Vui lòng nhập email và mã xác thực' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      email,
      verificationCode: code,
      verificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Mã xác thực không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationExpires = undefined;
    await user.save();

    return NextResponse.json({
      message: 'Xác thực thành công! Bạn có thể đăng nhập ngay bây giờ.'
    });

  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}