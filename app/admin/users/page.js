"use client";
import { motion } from "framer-motion";
import {
  Activity,
  Ban,
  Calendar,
  CheckCircle,
  DollarSign,
  FileText,
  Mail,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import DataTable from "../../../components/ui/DataTable";
import GlassButton from "../../../components/ui/GlassButton";
import GlassCard from "../../../components/ui/GlassCard";
import { useApi } from "../../../hooks/useApi";

export default function AdminUsersPage() {
  const { get, put } = useApi();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await get(
        `/api/admin/users?page=${pagination.page}&limit=${pagination.limit}`
      );
      setUsers(response.users || []);
      setPagination(response.pagination || pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleUpdateUser = async (userId, updates) => {
    setProcessing(true);
    try {
      await put("/api/admin/users", {
        userId,
        ...updates,
      });

      alert("Cập nhật người dùng thành công!");
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      alert(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const columns = [
    {
      header: "Người dùng",
      accessor: "fullName",
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-800">{row.fullName}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="w-3 h-3" />
              <span>{row.email}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Trạng thái",
      accessor: "isActive",
      render: (row) => (
        <div className="flex items-center space-x-2">
          {row.isActive ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">
                Hoạt động
              </span>
            </>
          ) : (
            <>
              <Ban className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-600">Bị khóa</span>
            </>
          )}
        </div>
      ),
    },
    {
      header: "Số gạch",
      accessor: "balance",
      render: (row) => (
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="font-medium text-gray-800">
            {row.balance?.toLocaleString() || 0} GẠCH
          </span>
        </div>
      ),
    },
    {
      header: "Yêu cầu",
      accessor: "stats",
      render: (row) => (
        <div className="text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <FileText className="w-3 h-3" />
            <span>{row.stats?.totalRequests || 0} tổng</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-3 h-3 text-green-600" />
            <span>{row.stats?.completedRequests || 0} hoàn thành</span>
          </div>
        </div>
      ),
    },
    {
      header: "Ngày tham gia",
      accessor: "createdAt",
      render: (row) => (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{new Date(row.createdAt).toLocaleDateString("vi-VN")}</span>
        </div>
      ),
    },
  ];

  const actions = (row) => [
    <GlassButton
      key="view"
      variant="secondary"
      onClick={() => handleViewUser(row)}
      className="p-2"
    >
      <Activity className="w-4 h-4" />
    </GlassButton>,
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Quản lý người dùng
        </h1>
        <p className="text-white/80">Xem và quản lý tài khoản người dùng</p>
      </motion.div>

      <DataTable
        data={users}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        searchable={true}
        actions={actions}
      />

      {/* User Detail Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Chi tiết người dùng
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* User Info */}
                <GlassCard>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {selectedUser.fullName}
                      </h3>
                      <p className="text-gray-600">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Trạng thái:</span>
                      <div className="flex items-center space-x-2 mt-1">
                        {selectedUser.isActive ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-600">
                              Hoạt động
                            </span>
                          </>
                        ) : (
                          <>
                            <Ban className="w-4 h-4 text-red-600" />
                            <span className="font-medium text-red-600">
                              Bị khóa
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Xác thực email:</span>
                      <p className="font-medium mt-1">
                        {selectedUser.isVerified
                          ? "Đã xác thực"
                          : "Chưa xác thực"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Số gạch:</span>
                      <p className="font-medium mt-1 text-green-600">
                        {selectedUser.balance?.toLocaleString() || 0} GẠCH
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Ngày tham gia:</span>
                      <p className="font-medium mt-1">
                        {new Date(selectedUser.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  </div>
                </GlassCard>

                {/* Statistics */}
                <GlassCard>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Thống kê hoạt động
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white/10 rounded-lg">
                      <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-800">
                        {selectedUser.stats?.totalRequests || 0}
                      </p>
                      <p className="text-sm text-gray-600">Tổng yêu cầu</p>
                    </div>
                    <div className="text-center p-4 bg-white/10 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-800">
                        {selectedUser.stats?.completedRequests || 0}
                      </p>
                      <p className="text-sm text-gray-600">Đã hoàn thành</p>
                    </div>
                  </div>
                </GlassCard>

                {/* Balance Update */}
                <GlassCard>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Cập nhật Số gạch
                  </h4>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      placeholder="Số gạch mới"
                      defaultValue={selectedUser.balance || 0}
                      className="flex-1 glass-input"
                      id="newBalance"
                    />
                    <GlassButton
                      onClick={() => {
                        const newBalance =
                          document.getElementById("newBalance").value;
                        handleUpdateUser(selectedUser._id, {
                          balance: parseInt(newBalance),
                        });
                      }}
                      disabled={processing}
                    >
                      Cập nhật
                    </GlassButton>
                  </div>
                </GlassCard>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-4">
                  <GlassButton
                    variant={selectedUser.isActive ? "danger" : "success"}
                    onClick={() =>
                      handleUpdateUser(selectedUser._id, {
                        isActive: !selectedUser.isActive,
                      })
                    }
                    disabled={processing}
                  >
                    {processing
                      ? "Đang xử lý..."
                      : selectedUser.isActive
                      ? "Khóa tài khoản"
                      : "Kích hoạt tài khoản"}
                  </GlassButton>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
