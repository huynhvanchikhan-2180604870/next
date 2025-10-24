"use client";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  HelpCircle,
  Settings,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import GlassCard from "../../components/ui/GlassCard";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";

export default function UserDashboard() {
  const { user } = useAuth();
  const { get } = useApi();
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    balance: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [requestsRes, profileRes] = await Promise.all([
        get("/api/user/requests"),
        get("/api/user/profile"),
      ]);

      const requests = requestsRes.requests || [];
      setRecentRequests(requests.slice(0, 5));

      setStats({
        totalRequests: requests.length,
        pendingRequests: requests.filter((r) => r.status === "pending").length,
        completedRequests: requests.filter((r) => r.status === "completed")
          .length,
        balance: profileRes.user.balance || 0,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const menuItems = [
    {
      icon: Settings,
      title: "Quản lý",
      description: "Tải lên file hoặc nhập danh sách tên",
      href: "/dashboard/manage",
      color: "bg-blue-500/20 text-blue-600",
    },
    {
      icon: CreditCard,
      title: "Lấy gạch về",
      description: "Tạo yêu cầu Lấy gạch về về tài khoản",
      href: "/dashboard/withdraw",
      color: "bg-green-500/20 text-green-600",
    },
    {
      icon: HelpCircle,
      title: "Hỗ trợ",
      description: "Liên hệ hỗ trợ kỹ thuật",
      href: "/dashboard/support",
      color: "bg-purple-500/20 text-purple-600",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "processing":
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: "Chờ xử lý",
      processing: "Đang xử lý",
      completed: "Hoàn thành",
      rejected: "Từ chối",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Chào mừng, {user?.fullName}!
        </h1>
        <p className="text-white/80">Quản lý yêu cầu và Lấy gạch về của bạn</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Tổng yêu cầu",
            value: stats.totalRequests,
            color: "text-blue-600",
          },
          {
            label: "Chờ xử lý",
            value: stats.pendingRequests,
            color: "text-yellow-600",
          },
          {
            label: "Hoàn thành",
            value: stats.completedRequests,
            color: "text-green-600",
          },
          {
            label: "Số gạch",
            value: `${stats.balance.toLocaleString()} GẠCH`,
            color: "text-purple-600",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="text-center">
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Menu Items */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">Chức năng</h2>
          <div className="space-y-4">
            {menuItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={item.href}>
                  <GlassCard className="hover:scale-105 transition-transform cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${item.color}`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Requests */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">
            Yêu cầu gần đây
          </h2>
          <GlassCard>
            {recentRequests.length > 0 ? (
              <div className="space-y-4">
                {recentRequests.map((request, index) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/10 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {request.names?.length || 0} tên
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(request.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(request.status)}
                      <span
                        className={`text-sm font-medium status-${request.status} px-2 py-1 rounded-full`}
                      >
                        {getStatusText(request.status)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Chưa có yêu cầu nào</p>
                <Link href="/dashboard/manage">
                  <button className="mt-4 text-primary-600 hover:text-primary-700 font-medium">
                    Tạo yêu cầu đầu tiên
                  </button>
                </Link>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
