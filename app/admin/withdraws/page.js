'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../../../components/ui/GlassCard';
import GlassButton from '../../../components/ui/GlassButton';
import DataTable from '../../../components/ui/DataTable';
import { useAutoRefresh } from '../../../hooks/useAutoRefresh';
import { useModal } from '../../../hooks/useModal';
import Modal from '../../../components/ui/Modal';
import { Clock, CheckCircle, AlertCircle, Eye, User, DollarSign, X, Upload } from 'lucide-react';

export default function AdminWithdrawsPage() {
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWithdraw, setSelectedWithdraw] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [notes, setNotes] = useState('');
  const [proofImage, setProofImage] = useState('');
  const [failureReason, setFailureReason] = useState('');
  const { modal, showSuccess, showError, hideModal } = useModal();

  useEffect(() => {
    fetchWithdraws();
  }, []);

  // Auto refresh mỗi 30 giây - sử dụng callback
  useAutoRefresh(() => {
    fetchWithdraws();
  }, 30000);

  const fetchWithdraws = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/withdraws', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setWithdraws(data.withdraws || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWithdraw = async (status) => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/withdraws', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          withdrawId: selectedWithdraw._id,
          status,
          notes,
          proofImage,
          failureReason
        })
      });

      if (response.ok) {
        showSuccess('Thành công', 'Cập nhật lệnh rút tiền thành công!', () => {
          setShowModal(false);
          setNotes('');
          setProofImage('');
          setFailureReason('');
          fetchWithdraws();
          hideModal();
        });
      }
    } catch (error) {
      showError('Lỗi', 'Không thể cập nhật lệnh rút tiền. Vui lòng thử lại.');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'processing':
        return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
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
      accessor: 'amount',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="font-medium text-gray-800">
            {row.amount?.toLocaleString()} VNĐ
          </span>
        </div>
      )
    },
    {
      header: 'Ngân hàng',
      accessor: 'bankInfo',
      render: (row) => (
        <div className="text-sm">
          <p className="font-medium">{row.bankInfo?.bankName}</p>
          <p className="text-gray-600">{row.bankInfo?.accountNumber}</p>
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
            {row.status === 'pending' ? 'Chờ xử lý' : 
             row.status === 'processing' ? 'Đang xử lý' : 
             row.status === 'completed' ? 'Hoàn thành' : 'Thất bại'}
          </span>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý rút tiền</h1>
      </div>

      <GlassCard>
        <DataTable
          data={withdraws}
          columns={columns}
          loading={loading}
          actions={(row) => (
            <GlassButton
              variant="secondary"
              onClick={() => {
                setSelectedWithdraw(row);
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
      {showModal && selectedWithdraw && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Chi tiết lệnh rút tiền</h3>
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
                  <span className="font-medium">{selectedWithdraw.userId?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-medium text-green-600">
                    {selectedWithdraw.amount?.toLocaleString()} VNĐ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngân hàng:</span>
                  <span className="font-medium">{selectedWithdraw.bankInfo?.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số TK:</span>
                  <span className="font-mono text-sm">{selectedWithdraw.bankInfo?.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chủ TK:</span>
                  <span className="font-medium">{selectedWithdraw.bankInfo?.accountName}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full glass-input resize-none"
                    rows={2}
                    placeholder="Nhập ghi chú..."
                  />
                </div>

                {selectedWithdraw.status !== 'failed' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link ảnh chứng từ
                    </label>
                    <input
                      type="url"
                      value={proofImage}
                      onChange={(e) => setProofImage(e.target.value)}
                      className="w-full glass-input"
                      placeholder="https://example.com/proof.jpg"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lý do thất bại (nếu có)
                  </label>
                  <textarea
                    value={failureReason}
                    onChange={(e) => setFailureReason(e.target.value)}
                    className="w-full glass-input resize-none"
                    rows={2}
                    placeholder="Nhập lý do thất bại..."
                  />
                </div>
              </div>

              {selectedWithdraw.status === 'pending' && (
                <div className="flex space-x-3 mb-4">
                  <GlassButton
                    variant="secondary"
                    onClick={() => handleUpdateWithdraw('processing')}
                    disabled={processing}
                    className="flex-1"
                  >
                    Đang xử lý
                  </GlassButton>
                </div>
              )}

              {(selectedWithdraw.status === 'pending' || selectedWithdraw.status === 'processing') && (
                <div className="flex space-x-3">
                  <GlassButton
                    variant="danger"
                    onClick={() => handleUpdateWithdraw('failed')}
                    disabled={processing}
                    className="flex-1"
                  >
                    Thất bại
                  </GlassButton>
                  <GlassButton
                    variant="success"
                    onClick={() => handleUpdateWithdraw('completed')}
                    disabled={processing}
                    className="flex-1"
                  >
                    {processing ? 'Đang xử lý...' : 'Hoàn thành'}
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