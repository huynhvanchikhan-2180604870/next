'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../../../components/ui/GlassCard';
import GlassButton from '../../../components/ui/GlassButton';
import DataTable from '../../../components/ui/DataTable';
import { useAutoRefresh } from '../../../hooks/useAutoRefresh';
import { useModal } from '../../../hooks/useModal';
import Modal from '../../../components/ui/Modal';
import { Clock, CheckCircle, AlertCircle, Eye, User, DollarSign, X } from 'lucide-react';

export default function AdminBalanceRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const { modal, showSuccess, showError, hideModal } = useModal();

  useEffect(() => {
    fetchRequests();
  }, []);

  // Auto refresh mỗi 30 giây - sử dụng callback
  useAutoRefresh(() => {
    fetchRequests();
  }, 30000);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/balance-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async (status) => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/balance-requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          requestId: selectedRequest._id,
          status,
          adminNotes
        })
      });

      if (response.ok) {
        showSuccess('Thành công', 'Cập nhật yêu cầu thành công!', () => {
          setShowModal(false);
          setAdminNotes('');
          fetchRequests();
          hideModal();
        });
      }
    } catch (error) {
      showError('Lỗi', 'Không thể cập nhật yêu cầu. Vui lòng thử lại.');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const columns = [
    {
      header: 'Người dùng',
      accessor: 'userId',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-800">{row.userId?.fullName}</p>
            <p className="text-sm text-gray-600">{row.userId?.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Số tiền',
      accessor: 'requestedAmount',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="font-medium text-gray-800">
            {row.requestedAmount?.toLocaleString()} VNĐ
          </span>
        </div>
      )
    },
    {
      header: 'Trạng thái',
      accessor: 'status',
      render: (row) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(row.status)}
          <span className={`text-sm font-medium px-3 py-1 rounded-full status-${row.status}`}>
            {row.status === 'pending' ? 'Chờ xác minh' : 
             row.status === 'verified' ? 'Đã xác minh' : 'Từ chối'}
          </span>
        </div>
      )
    },
    {
      header: 'Ngày tạo',
      accessor: 'createdAt',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {new Date(row.createdAt).toLocaleDateString('vi-VN')}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Yêu cầu xác minh số dư</h1>
      </div>

      <GlassCard>
        <DataTable
          data={requests}
          columns={columns}
          loading={loading}
          actions={(row) => (
            <GlassButton
              variant="secondary"
              onClick={() => {
                setSelectedRequest(row);
                setShowModal(true);
              }}
              className="p-2"
            >
              <Eye className="w-4 h-4" />
            </GlassButton>
          )}
        />
      </GlassCard>

      {/* Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Chi tiết yêu cầu</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Người dùng:</span>
                  <span className="font-medium">{selectedRequest.userId?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-medium text-green-600">
                    {selectedRequest.requestedAmount?.toLocaleString()} VNĐ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedRequest.status)}
                    <span className={`text-sm font-medium px-2 py-1 rounded-full status-${selectedRequest.status}`}>
                      {selectedRequest.status === 'pending' ? 'Chờ xác minh' : 
                       selectedRequest.status === 'verified' ? 'Đã xác minh' : 'Từ chối'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú admin
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full glass-input resize-none"
                  rows={3}
                  placeholder="Nhập ghi chú..."
                />
              </div>

              {selectedRequest.status === 'pending' && (
                <div className="flex space-x-3">
                  <GlassButton
                    variant="danger"
                    onClick={() => handleUpdateRequest('rejected')}
                    disabled={processing}
                    className="flex-1"
                  >
                    Từ chối
                  </GlassButton>
                  <GlassButton
                    variant="success"
                    onClick={() => handleUpdateRequest('verified')}
                    disabled={processing}
                    className="flex-1"
                  >
                    {processing ? 'Đang xử lý...' : 'Xác minh'}
                  </GlassButton>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

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