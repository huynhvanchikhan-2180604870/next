"use client";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Building,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  User,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import GlassButton from "../../../components/ui/GlassButton";
import GlassCard from "../../../components/ui/GlassCard";
import GlassInput from "../../../components/ui/GlassInput";
import { useAuth } from "../../../context/AuthContext";
import { useApi } from "../../../hooks/useApi";
import { useAutoRefresh } from "../../../hooks/useAutoRefresh";
import { useModal } from "../../../hooks/useModal";
import BalanceRequest from "../../../components/user/BalanceRequest";
import Modal from "../../../components/ui/Modal";

export default function WithdrawPage() {
  const { user, refreshUser } = useAuth();
  const { post, get, loading } = useApi();
  const [formData, setFormData] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  const [errors, setErrors] = useState({});
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [balanceRequests, setBalanceRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('balance-request');
  const { modal, showSuccess, showError, hideModal } = useModal();

  useEffect(() => {
    fetchWithdrawHistory();
    fetchBalanceRequests();
    if (refreshUser) refreshUser();
  }, []);

  // Auto refresh mỗi 30 giây
  useAutoRefresh(() => {
    fetchWithdrawHistory();
    fetchBalanceRequests();
    if (refreshUser) refreshUser();
  }, 30000);

  const fetchBalanceRequests = async () => {
    try {
      const response = await get("/api/user/balance-request");
      setBalanceRequests(response.requests || []);
    } catch (error) {
      console.error("Error fetching balance requests:", error);
    }
  };

  const fetchWithdrawHistory = async () => {
    try {
      const response = await get("/api/user/withdraw");
      setWithdrawHistory(response.withdraws || []);
    } catch (error) {
      console.error("Error fetching withdraw history:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) < 10000) {
      newErrors.amount = "Số tiền rút tối thiểu là 10,000 VNĐ";
    }

    if (parseFloat(formData.amount) > (user?.balance || 0)) {
      newErrors.amount = "Số dư không đủ";
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = "Vui lòng nhập tên ngân hàng";
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Vui lòng nhập số tài khoản";
    }

    if (!formData.accountName.trim()) {
      newErrors.accountName = "Vui lòng nhập tên chủ tài khoản";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await post("/api/user/withdraw", {
        amount: parseInt(formData.amount),
        bankInfo: {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          accountName: formData.accountName,
        },
      });

      showSuccess('Thành công', 'Tạo lệnh rút tiền thành công!', () => {
        setFormData({
          amount: "",
          bankName: "",
          accountNumber: "",
          accountName: "",
        });
        fetchWithdrawHistory();
        if (refreshUser) refreshUser();
        hideModal();
      });
    } catch (error) {
      showError('Lỗi', error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "processing":
        return (
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        );
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
        <h1 className="text-3xl font-bold text-white mb-2">Rút gạch</h1>
        <p className="text-white/80">
          Tạo yêu cầu rút gạch về tài khoản ngân hàng
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-2xl p-1 mb-8">
        <button
          onClick={() => setActiveTab('balance-request')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'balance-request'
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          Xác minh số dư
        </button>
        <button
          onClick={() => setActiveTab('withdraw')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'withdraw'
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          Rút tiền
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {activeTab === 'balance-request' ? (
            <BalanceRequest onRequestSubmitted={fetchBalanceRequests} />
          ) : (
          <GlassCard>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Tạo yêu cầu rút gạch
                </h2>
                <p className="text-sm text-gray-600">
                  Số dư hiện tại:{" "}
                  <span className="font-medium text-green-600">
                    {user?.balance?.toLocaleString() || 0} VNĐ
                  </span>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <GlassInput
                  type="number"
                  name="amount"
                  label="Số tiền rút (VNĐ)"
                  placeholder="Nhập số tiền muốn rút"
                  value={formData.amount}
                  onChange={handleChange}
                  className="pl-12"
                  min="10000"
                  error={errors.amount}
                />
              </div>

              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <GlassInput
                  type="text"
                  name="bankName"
                  label="Tên ngân hàng"
                  placeholder="Ví dụ: Vietcombank, BIDV, Techcombank..."
                  value={formData.bankName}
                  onChange={handleChange}
                  className="pl-12"
                  error={errors.bankName}
                />
              </div>

              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <GlassInput
                  type="text"
                  name="accountNumber"
                  label="Số tài khoản"
                  placeholder="Nhập số tài khoản ngân hàng"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="pl-12"
                  error={errors.accountNumber}
                />
              </div>

              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <GlassInput
                  type="text"
                  name="accountName"
                  label="Tên chủ tài khoản"
                  placeholder="Tên chủ tài khoản (phải trùng với tên đăng ký)"
                  value={formData.accountName}
                  onChange={handleChange}
                  className="pl-12"
                  error={errors.accountName}
                />
              </div>

              {errors.general && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-100/80 border border-red-200 text-red-700 px-4 py-3 rounded-xl backdrop-blur-sm"
                >
                  {errors.general}
                </motion.div>
              )}

              <GlassButton type="submit" disabled={loading} className="w-full">
                {loading ? "Đang gửi yêu cầu..." : "Gửi yêu cầu rút tiền"}
              </GlassButton>
            </form>
          </GlassCard>
          )}
        </div>

        {/* History */}
        <div>
          <GlassCard>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              {activeTab === 'balance-request' ? 'Lịch sử xác minh số dư' : 'Lịch sử rút tiền'}
            </h3>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activeTab === 'balance-request' ? (
                balanceRequests.map((request) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(request.status)}
                        <span className={`text-sm font-medium px-3 py-1 rounded-full status-${request.status}`}>
                          {request.status === 'pending' ? 'Chờ xác minh' : 
                           request.status === 'verified' ? 'Đã xác minh' : 'Từ chối'}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-800">
                        {request.requestedAmount.toLocaleString()} VNĐ
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Ngày tạo: {new Date(request.createdAt).toLocaleString('vi-VN')}</p>
                      {request.adminNotes && (
                        <div className="mt-2 p-2 bg-yellow-50/20 rounded-lg">
                          <span className="font-medium">Ghi chú:</span>
                          <p>{request.adminNotes}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                withdrawHistory.map((withdraw) => (
                <motion.div
                  key={withdraw._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(withdraw.status)}
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-full status-${withdraw.status}`}
                      >
                        {getStatusText(withdraw.status)}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-800">
                      {withdraw.amount.toLocaleString()} VNĐ
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Ngân hàng:</span>
                      <p>{withdraw.bankInfo.bankName}</p>
                    </div>
                    <div>
                      <span className="font-medium">Số TK:</span>
                      <p className="font-mono">
                        {withdraw.bankInfo.accountNumber}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Chủ TK:</span>
                      <p>{withdraw.bankInfo.accountName}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Ngày tạo:</span>
                      <p>
                        {new Date(withdraw.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>

                  {withdraw.notes && (
                    <div className="mt-3 p-2 bg-yellow-50/20 rounded-lg">
                      <span className="text-sm font-medium text-yellow-800">
                        Ghi chú:
                      </span>
                      <p className="text-sm text-yellow-700">
                        {withdraw.notes}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))
              )}

              {(activeTab === 'balance-request' ? balanceRequests.length === 0 : withdrawHistory.length === 0) && (
                <div className="text-center py-8 text-gray-600">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>{activeTab === 'balance-request' ? 'Chưa có yêu cầu xác minh nào' : 'Chưa có lệnh rút tiền nào'}</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={hideModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        showCancel={modal.showCancel}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
      />
    </div>
  );
}
