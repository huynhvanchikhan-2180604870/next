import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import User from '../../../../models/User';
import { authenticateUser } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const auth = await authenticateUser(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    return NextResponse.json({
      user: {
        id: auth.user._id,
        email: auth.user.email,
        fullName: auth.user.fullName,
        role: auth.user.role,
        avatar: auth.user.avatar,
        balance: auth.user.balance,
        isVerified: auth.user.isVerified,
        createdAt: auth.user.createdAt
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const auth = await authenticateUser(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { fullName, avatar } = await request.json();

    await connectDB();

    const user = await User.findById(auth.user._id);
    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy user' },
        { status: 404 }
      );
    }

    if (fullName) user.fullName = fullName;
    if (avatar) user.avatar = avatar;

    await user.save();

    return NextResponse.json({
      message: 'Cập nhật thông tin thành công',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
        balance: user.balance
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}