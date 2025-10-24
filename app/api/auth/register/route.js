import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import User from '../../../../models/User';
import { generateVerificationCode } from '../../../../lib/auth';
import { sendVerificationEmail } from '../../../../lib/email';

export async function POST(request) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email đã được sử dụng' },
        { status: 400 }
      );
    }

    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = new User({
      email,
      password,
      fullName,
      verificationCode,
      verificationExpires
    });

    await user.save();
    
    // Try to send email, but don't fail if it doesn't work
    await sendVerificationEmail(email, verificationCode, fullName);

    return NextResponse.json({
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
      userId: user._id
    });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}