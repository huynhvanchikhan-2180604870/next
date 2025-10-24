"use client";
import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import GlassCard from "../../components/ui/GlassCard";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { get } = useApi();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    totalWithdraws: 0,
    pendingWithdraws: 0,
  });
  const [urgentRequests, setUrgentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await get("/api/admin/dashboard");
      setStats(response.overview);
      setUrgentRequests(response.urgentRequests || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Tổng người dùng",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Người dùng hoạt động",
      value: stats.activeUsers,
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Tổng yêu cầu",
      value: stats.totalRequests,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-500/20",
    },
    {
      title: "Chờ xử lý",
      value: stats.pendingRequests,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-500/20",
    },
    {
      title: "Đã hoàn thành",
      value: stats.completedRequests,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Yêu cầu Lấy gạch về",
      value: stats.totalWithdraws,
      icon: DollarSign,
      color: "text-indigo-600",
      bgColor: "bg-indigo-500/20",
    },
  ];

  const quickActions = [
    {
      title: "Quản lý yêu cầu",
      description: "Xem và xử lý yêu cầu từ người dùng",
      href: "/admin/requests",
      icon: FileText,
      color: "bg-blue-500/20 text-blue-600",
    },
    {
      title: "Quản lý người dùng",
      description: "Xem danh sách và quản lý tài khoản",
      href: "/admin/users",
      icon: Users,
      color: "bg-green-500/20 text-green-600",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Admin</h1>
        <p className="text-white/80">
          Chào mừng, {user?.fullName}! Tổng quan hệ thống
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="text-center">
              <div
                className={`inline-flex p-3 rounded-xl ${stat.bgColor} mb-4`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">
            Thao tác nhanh
          </h2>
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={action.href}>
                  <GlassCard className="hover:scale-105 transition-transform cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${action.color}`}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {action.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Urgent Requests */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">
            Yêu cầu cần xử lý
          </h2>
          <GlassCard>
            {urgentRequests.length > 0 ? (
              <div className="space-y-4">
                {urgentRequests.map((request, index) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/10 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {request.userId?.fullName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {request.names?.length || 0} tên •{" "}
                        {new Date(request.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <Link href={`/admin/requests`}>
                        <button className="text-xs bg-primary-500/20 text-primary-600 px-3 py-1 rounded-full hover:bg-primary-500/30 transition-colors">
                          Xử lý
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500 opacity-50" />
                <p className="text-gray-600">Không có yêu cầu nào cần xử lý</p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Trạng thái hệ thống
              </h3>
              <p className="text-gray-600">
                Tất cả dịch vụ đang hoạt động bình thường
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 font-medium">Online</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
