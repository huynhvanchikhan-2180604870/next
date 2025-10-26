'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../../../hooks/useApi';
import GlassCard from '../../../components/ui/GlassCard';
import GlassButton from '../../../components/ui/GlassButton';
import DataTable from '../../../components/ui/DataTable';
import BatchUpdate from '../../../components/admin/BatchUpdate';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  User,
  Calendar,
  FileText,
  X
} from 'lucide-react';

export default function AdminRequestsPage() {
  const { get, put } = useApi();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [pagination.page]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await get(`/api/admin/requests?page=${pagination.page}&limit=${pagination.limit}`);
      setRequests(response.requests || []);
      setPagination(response.pagination || pagination);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleUpdateRequest = async (requestId, status, updatedNames = null, notes = '') => {
    setProcessing(true);
    try {
      await put('/api/admin/requests', {
        requestId,
        status,
        names: updatedNames,
        adminNotes: notes
      });
      
      alert('Cập nhật yêu cầu thành công!');
      setShowModal(false);
      fetchRequests(); // Tự động refresh data
    } catch (error) {
      alert(error.message);
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
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      completed: 'Hoàn thành',
      rejected: 'Từ chối'
    };
    return statusMap[status] || status;
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
      header: 'Số lượng',
      accessor: 'names',
      render: (row) => (
        <span className="font-medium text-gray-800">
          {row.names?.length || 0} tên
        </span>
      )
    },
    {
      header: 'Danh mục',
      accessor: 'categoryId',
      render: (row) => (
        <span className="text-sm bg-primary-100 text-primary-800 px-2 py-1 rounded">
          {row.categoryId?.name || 'Không có'}
        </span>
      )
    },
    {
      header: 'Loại',
      accessor: 'submissionType',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.submissionType === 'file' ? 'File' : 'Nhập tay'}
        </span>
      )
    },
    {
      header: 'Trạng thái',
      accessor: 'status',
      render: (row) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(row.status)}
          <span className={`text-sm font-medium px-3 py-1 rounded-full status-${row.status}`}>
            {getStatusText(row.status)}
          </span>
        </div>
      )
    },
    {
      header: 'Ngày tạo',
      accessor: 'createdAt',
      render: (row) => (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{new Date(row.createdAt).toLocaleDateString('vi-VN')}</span>
        </div>
      )
    }
  ];

  const actions = (row) => [
    <GlassButton
      key="view"
      variant="secondary"
      onClick={() => handleViewRequest(row)}
      className="p-2"
    >
      <Eye className="w-4 h-4" />
    </GlassButton>
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Quản lý yêu cầu</h1>
        <p className="text-white/80">Xem và xử lý yêu cầu từ người dùng</p>
      </motion.div>

      <DataTable
        data={requests}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        searchable={true}
        actions={actions}
      />

      {/* Request Detail Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Chi tiết yêu cầu</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors text-gray-600 hover:text-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Request Info */}
                <GlassCard>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin yêu cầu</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Người gửi:</span>
                      <span className="font-medium">{selectedRequest.userId?.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedRequest.userId?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Danh mục:</span>
                      <span className="font-medium bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs">
                        {selectedRequest.categoryId?.name || 'Không có'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loại:</span>
                      <span className="font-medium">
                        {selectedRequest.submissionType === 'file' ? 'File' : 'Nhập tay'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày tạo:</span>
                      <span className="font-medium">
                        {new Date(selectedRequest.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(selectedRequest.status)}
                        <span className={`text-sm font-medium px-3 py-1 rounded-full status-${selectedRequest.status}`}>
                          {getStatusText(selectedRequest.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Batch Update */}
                <div className="lg:col-span-2">
                  <BatchUpdate 
                    request={selectedRequest} 
                    onUpdate={() => {
                      fetchRequests();
                      setShowModal(false);
                    }} 
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-end space-x-4">
                {selectedRequest.status === 'pending' && (
                  <>
                    <GlassButton
                      variant="danger"
                      onClick={() => handleUpdateRequest(selectedRequest._id, 'rejected')}
                      disabled={processing}
                    >
                      Từ chối
                    </GlassButton>
                    <GlassButton
                      variant="secondary"
                      onClick={() => handleUpdateRequest(selectedRequest._id, 'processing')}
                      disabled={processing}
                    >
                      Đang xử lý
                    </GlassButton>
                  </>
                )}
                
                {(selectedRequest.status === 'pending' || selectedRequest.status === 'processing') && (
                  <GlassButton
                    variant="success"
                    onClick={() => handleUpdateRequest(
                      selectedRequest._id, 
                      'completed', 
                      selectedRequest.names
                    )}
                    disabled={processing}
                  >
                    {processing ? 'Đang xử lý...' : 'Hoàn thành'}
                  </GlassButton>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}