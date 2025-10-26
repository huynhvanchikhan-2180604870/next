'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApi } from '../../../hooks/useApi';
import GlassCard from '../../../components/ui/GlassCard';
import GlassButton from '../../../components/ui/GlassButton';
import FileUpload from '../../../components/user/FileUpload';
import ManualInput from '../../../components/user/ManualInput';
import CategorySelector from '../../../components/user/CategorySelector';
import { 
  Upload, 
  Edit, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Eye,
  FileText
} from 'lucide-react';

export default function ManagePage() {
  const [activeTab, setActiveTab] = useState('upload');
  const [processedNames, setProcessedNames] = useState([]);
  const [submissionType, setSubmissionType] = useState('');
  const [fileName, setFileName] = useState('');
  const [requests, setRequests] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const { post, get, loading } = useApi();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await get('/api/user/requests');
      setRequests(response.requests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleFileProcessed = (names, filename) => {
    setProcessedNames(names);
    setSubmissionType('file');
    setFileName(filename);
    setShowPreview(true);
  };

  const handleNamesProcessed = (names, type) => {
    setProcessedNames(names);
    setSubmissionType(type);
    setFileName('');
    setShowPreview(true);
  };

  const handleSubmitRequest = async () => {
    if (processedNames.length === 0) {
      alert('Vui lòng xử lý danh sách tên trước');
      return;
    }

    if (!selectedCategory) {
      alert('Vui lòng chọn danh mục');
      return;
    }

    try {
      await post('/api/user/requests', {
        names: processedNames,
        submissionType,
        fileName,
        categoryId: selectedCategory
      });
      
      alert('Gửi yêu cầu thành công!');
      setProcessedNames([]);
      setShowPreview(false);
      setSelectedCategory('');
      fetchRequests();
    } catch (error) {
      alert(error.message);
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

  const tabs = [
    { id: 'upload', label: 'Tải file', icon: Upload },
    { id: 'manual', label: 'Nhập tay', icon: Edit },
    { id: 'history', label: 'Lịch sử', icon: FileText }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Quản lý yêu cầu</h1>
        <p className="text-white/80">Tải lên file hoặc nhập danh sách tên để gửi yêu cầu</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-2xl p-1 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <GlassCard>
            <AnimatePresence mode="wait">
              {activeTab === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Tải lên file danh sách
                  </h2>
                  <FileUpload onFileProcessed={handleFileProcessed} />
                </motion.div>
              )}

              {activeTab === 'manual' && (
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Nhập danh sách tên
                  </h2>
                  <ManualInput onNamesProcessed={handleNamesProcessed} />
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Lịch sử yêu cầu
                  </h2>
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div
                        key={request._id}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(request.status)}
                            <span className={`text-sm font-medium px-3 py-1 rounded-full status-${request.status}`}>
                              {getStatusText(request.status)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {new Date(request.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Số lượng tên:</span>
                            <span className="ml-2 font-medium">{request.names?.length || 0}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Loại:</span>
                            <span className="ml-2 font-medium">
                              {request.submissionType === 'file' ? 'File' : 'Nhập tay'}
                            </span>
                          </div>
                        </div>
                        
                        {request.categoryId && (
                          <div className="mt-2">
                            <span className="text-gray-600 text-sm">Danh mục:</span>
                            <span className="ml-2 font-medium text-sm bg-primary-100 text-primary-800 px-2 py-1 rounded">
                              {request.categoryId.name}
                            </span>
                          </div>
                        )}
                        
                        <div className="hidden">
                        </div>

                        {request.status === 'completed' && request.names?.length > 0 && (
                          <div className="mt-4 p-3 bg-green-50/20 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-green-800">Kết quả xử lý:</h4>
                              <GlassButton
                                onClick={async () => {
                                  const token = localStorage.getItem('token');
                                  const link = document.createElement('a');
                                  link.href = `/api/user/download?requestId=${request._id}`;
                                  link.download = `ket-qua-${request._id}.xlsx`;
                                  
                                  // Add auth header by fetching first
                                  try {
                                    const response = await fetch(`/api/user/download?requestId=${request._id}`, {
                                      headers: { 'Authorization': `Bearer ${token}` }
                                    });
                                    if (response.ok) {
                                      const blob = await response.blob();
                                      const url = window.URL.createObjectURL(blob);
                                      link.href = url;
                                      link.click();
                                      window.URL.revokeObjectURL(url);
                                    }
                                  } catch (error) {
                                    alert('Lỗi tải file');
                                  }
                                }}
                                variant="success"
                                className="text-xs px-3 py-1"
                              >
                                Tải Excel
                              </GlassButton>
                            </div>
                            <div className="max-h-32 overflow-y-auto space-y-1">
                              {request.names.map((nameObj, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{nameObj.index}. {nameObj.fullName}</span>
                                  <span className="font-mono text-green-600">
                                    {nameObj.sessionNumber || 'Chưa có'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {requests.length === 0 && (
                      <div className="text-center py-8 text-gray-600">
                        Chưa có yêu cầu nào
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <CategorySelector 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          
          <GlassCard>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Xem trước</span>
            </h3>
            
            {showPreview && processedNames.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Tổng số tên:</span>
                    <span className="font-medium">{processedNames.length}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Loại:</span>
                    <span className="font-medium">
                      {submissionType === 'file' ? 'File' : 'Nhập tay'}
                    </span>
                  </div>
                  {fileName && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">File:</span>
                      <span className="font-medium text-xs">{fileName}</span>
                    </div>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1">
                  {processedNames.map((name, index) => {
                    const displayName = typeof name === 'object' ? name.fullName : name;
                    const displayIndex = typeof name === 'object' ? name.index : index + 1;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white/5 rounded text-sm"
                      >
                        <span>{displayName}</span>
                        <span className="text-gray-500">#{displayIndex}</span>
                      </div>
                    );
                  })}
                </div>

                <GlassButton
                  onClick={handleSubmitRequest}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Đang gửi...' : 'Gửi yêu cầu'}</span>
                </GlassButton>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Xử lý danh sách để xem trước</p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}