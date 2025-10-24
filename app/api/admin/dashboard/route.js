import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import User from '../../../../models/User';
import Request from '../../../../models/Request';
import Withdraw from '../../../../models/Withdraw';
import { requireAdmin } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await connectDB();

    // Thống kê tổng quan
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', isActive: true });
    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const completedRequests = await Request.countDocuments({ status: 'completed' });
    const totalWithdraws = await Withdraw.countDocuments();
    const pendingWithdraws = await Withdraw.countDocuments({ status: 'pending' });

    // Thống kê theo thời gian (7 ngày gần nhất)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentRequests = await Request.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
      role: 'user'
    });

    // Requests gần đây cần xử lý
    const urgentRequests = await Request.find({ status: 'pending' })
      .populate('userId', 'fullName email')
      .sort({ createdAt: 1 })
      .limit(5);

    // Thống kê theo trạng thái
    const requestsByStatus = await Request.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers,
        totalRequests,
        pendingRequests,
        completedRequests,
        totalWithdraws,
        pendingWithdraws
      },
      recent: {
        requests: recentRequests,
        users: recentUsers
      },
      urgentRequests,
      requestsByStatus: requestsByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}