'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassButton from '../ui/GlassButton';
import { Hash, Download } from 'lucide-react';

export default function BatchUpdate({ request, onUpdate }) {
  const [sessionNumbers, setSessionNumbers] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBatchUpdate = async () => {
    if (!sessionNumbers.trim()) {
      alert('Vui lòng nhập số phiên');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/batch-update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          requestId: request._id,
          sessionNumbers
        })
      });

      if (response.ok) {
        onUpdate();
        setSessionNumbers('');
        alert('Cập nhật thành công!');
      } else {
        throw new Error('Cập nhật thất bại');
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 space-y-4"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Hash className="w-5 h-5 text-primary-500" />
        <h3 className="text-lg font-semibold">Nhập số phiên hàng loạt</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Danh sách tên ({request.names.length})</h4>
          <div className="max-h-60 overflow-y-auto space-y-1 bg-gray-50 p-3 rounded-lg">
            {request.names.map((name, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>{name.index}. {name.fullName}</span>
                <span className="text-gray-500">
                  {name.sessionNumber || 'Chưa có'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Số phiên (theo thứ tự)</h4>
          <textarea
            value={sessionNumbers}
            onChange={(e) => setSessionNumbers(e.target.value)}
            placeholder="Nhập số phiên, mỗi số một dòng hoặc cách nhau bằng dấu phẩy..."
            rows={10}
            className="w-full glass-input resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Ví dụ: 123456, 789012 hoặc mỗi số một dòng
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <GlassButton
          onClick={handleBatchUpdate}
          disabled={loading}
          className="flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>{loading ? 'Đang xử lý...' : 'Cập nhật hàng loạt'}</span>
        </GlassButton>
      </div>
    </motion.div>
  );
}