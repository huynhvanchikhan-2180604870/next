"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  CreditCard,
  HelpCircle,
  LogOut,
  Settings,
  User,
  Wrench,
  Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Navigation() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user, logout } = useAuth();
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      fetchNotifications();
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const userMenuItems = [
    { icon: Settings, label: "Quản lý", href: "/dashboard/manage" },
    { icon: CreditCard, label: "Rút gạch", href: "/dashboard/withdraw" },
    { icon: Wrench, label: "Tool", href: "/dashboard/tool" },
    { icon: HelpCircle, label: "Hỗ trợ", href: "/dashboard/support" },
  ];

  const adminMenuItems = [
    { icon: Settings, label: "Quản lý yêu cầu", href: "/admin/requests" },
    { icon: User, label: "Quản lý users", href: "/admin/users" },
    { icon: Tag, label: "Quản lý danh mục", href: "/admin/categories" },
  ];

  return (
    <nav className="glass-nav px-6 py-4 ms-3 me-3 mt-3 rounded-[13px]">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <h1 className="text-2xl font-bold text-white">
            <span className="text-primary-300">Provider</span>
          </h1>
        </motion.div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              onClick={handleNotificationClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-white/80 hover:text-white transition-colors"
            >
              <Bell className="w-6 h-6" />
              {notifications.filter((n) => !n.isRead).length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 100, y: -10 }}
                  animate={{ opacity: 100, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-96 glass-card border border-white/20 rounded-2xl shadow-2xl max-h-[500px] overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-primary-500/20 to-primary-600/20">
                    <h3 className="font-bold text-white text-lg flex items-center">
                      <Bell className="w-5 h-5 mr-2" />
                      Thông báo
                    </h3>
                  </div>

                  <div className="overflow-y-auto max-h-80  ">
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => {
                        const getIcon = (type) => {
                          switch (type) {
                            case "request":
                              return <User className="w-5 h-5 text-white" />;
                            case "update":
                              return (
                                <Settings className="w-5 h-5 text-white" />
                              );
                            case "tool":
                              return <Wrench className="w-5 h-5 text-white" />;
                            default:
                              return <Bell className="w-5 h-5 text-white" />;
                          }
                        };

                        const getBgColor = (type) => {
                          switch (type) {
                            case "request":
                              return "bg-green-500";
                            case "update":
                              return "bg-blue-500";
                            case "tool":
                              return "bg-yellow-500";
                            default:
                              return "bg-gray-500";
                          }
                        };

                        return (
                          <div
                            key={notification._id}
                            className={`p-4 border-b border-white/10 hover:bg-white/10 transition-colors cursor-pointer ${
                              !notification.isRead ? "bg-white/15" : ""
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`w-10 h-10 ${getBgColor(
                                  notification.type
                                )} rounded-full flex items-center justify-center flex-shrink-0`}
                              >
                                {getIcon(notification.type)}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-white text-sm">
                                  {notification.title}
                                </p>
                                <p className="text-white/70 text-xs mt-1">
                                  {notification.message}
                                </p>
                                <span className="text-white/50 text-xs">
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleString("vi-VN")}
                                </span>
                              </div>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-white/30 mx-auto mb-3" />
                        <p className="text-white/60 text-sm">
                          Chưa có thông báo nào
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-4 border-t border-white/20 bg-white/5">
                    <button className="text-sm text-primary-300 hover:text-primary-200 font-medium">
                      Xem tất cả thông báo →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative">
            <motion.button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium text-sm">
                  {user?.fullName}
                </p>
                <p className="text-white/60 text-xs">
                  {user?.role === "admin" ? "Quản trị viên" : "Người dùng"}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-white/60" />
            </motion.button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 glass-card border border-white/20 py-2"
                >
                  {user?.role === "user" &&
                    userMenuItems.map((item, index) => (
                      <motion.button
                        key={index}
                        onClick={() => {
                          router.push(item.href);
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-white/20 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </motion.button>
                    ))}

                  {user?.role === "admin" &&
                    adminMenuItems.map((item, index) => (
                      <motion.button
                        key={index}
                        onClick={() => {
                          router.push(item.href);
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-white/20 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </motion.button>
                    ))}

                  <hr className="my-2 border-white/20" />

                  <motion.button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50/20 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
