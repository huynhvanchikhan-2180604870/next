'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../../hooks/useApi';
import { useModal } from '../../hooks/useModal';
import GlassButton from '../ui/GlassButton';
import Modal from '../ui/Modal';
import { Upload, File, X, CheckCircle } from 'lucide-react';

export default function FileUpload({ onFileProcessed }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const { uploadFile } = useApi();
  const { modal, showError, hideModal } = useModal();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    const allowedTypes = ['text/plain', 'application/json', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    const allowedExtensions = ['.txt', '.json', '.xlsx', '.xls'];
    
    const fileExtension = '.' + selectedFile.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(selectedFile.type) && !allowedExtensions.includes(fileExtension)) {
      showError('Lỗi file', 'Chỉ hỗ trợ file .txt, .json, .xlsx, .xls');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      showError('Lỗi kích thước', 'File không được vượt quá 10MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setProcessing(true);
    try {
      const result = await uploadFile('/api/upload', file);
      onFileProcessed(result.names, file.name);
      setFile(null);
    } catch (error) {
      showError('Lỗi', error.message);
    } finally {
      setProcessing(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-primary-400 bg-primary-50/50' 
            : 'border-white/30 bg-white/10'
        } backdrop-blur-sm`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.json,.xlsx,.xls"
          onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <Upload className="w-12 h-12 text-primary-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Tải lên file danh sách
        </h3>
        <p className="text-gray-600 mb-4">
          Kéo thả file hoặc click để chọn
        </p>
        <p className="text-sm text-gray-500">
          Hỗ trợ: .txt, .json, .xlsx, .xls (tối đa 10MB)
        </p>
      </motion.div>

      {file && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="w-8 h-8 text-primary-500" />
              <div>
                <p className="font-medium text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-600">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <GlassButton
                onClick={handleUpload}
                disabled={processing}
                variant="success"
                className="text-sm"
              >
                {processing ? 'Đang xử lý...' : 'Xử lý file'}
              </GlassButton>
              <button
                onClick={removeFile}
                className="p-2 text-red-500 hover:bg-red-100/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
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