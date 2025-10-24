import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import User from '../../../../models/User';
import Request from '../../../../models/Request';
import { requireAdmin } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role');

    await connectDB();

    const filter = { role: { $ne: 'admin' } };
    
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role && role !== 'all') {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select('-password -verificationCode')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(filter);

    // Thống kê cho mỗi user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const requestCount = await Request.countDocuments({ userId: user._id });
        const completedRequests = await Request.countDocuments({ 
          userId: user._id, 
          status: 'completed' 
        });
        
        return {
          ...user.toObject(),
          stats: {
            totalRequests: requestCount,
            completedRequests
          }
        };
      })
    );

    return NextResponse.json({
      users: usersWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
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

    const { userId, isActive, balance } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Thiếu ID user' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy user' },
        { status: 404 }
      );
    }

    if (typeof isActive === 'boolean') {
      user.isActive = isActive;
    }

    if (typeof balance === 'number' && balance >= 0) {
      user.balance = balance;
    }

    await user.save();

    return NextResponse.json({
      message: 'Cập nhật user thành công',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isActive: user.isActive,
        balance: user.balance
      }
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}