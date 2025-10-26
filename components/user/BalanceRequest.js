'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassButton from '../ui/GlassButton';
import GlassInput from '../ui/GlassInput';
import Modal from '../ui/Modal';
import { useModal } from '../../hooks/useModal';
import { DollarSign, Send } from 'lucide-react';

export default function BalanceRequest({ onRequestSubmitted }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { modal, showSuccess, showError, hideModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      showError('Lỗi nhập liệu', 'Vui lòng nhập số tiền hợp lệ');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/balance-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          requestedAmount: parseFloat(amount)
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        showSuccess('Thành công', data.message, () => {
          setAmount('');
          if (onRequestSubmitted) onRequestSubmitted();
          hideModal();
        });
      } else {
        showError('Lỗi', data.error);
      }
    } catch (error) {
      showError('Lỗi kết nối', 'Không thể kết nối đến server. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/30"
    >
      <div className="flex items-center space-x-3 mb-4">
        <DollarSign className="w-6 h-6 text-primary-500" />
        <h3 className="text-lg font-semibold text-gray-800">Yêu cầu xác minh số dư</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Nhập số tiền bạn muốn rút để admin xác minh và cộng vào số dư tài khoản.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <GlassInput
          type="number"
          label="Số tiền (VNĐ)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Nhập số tiền..."
          min="1"
          required
        />

        <GlassButton
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2"
        >
          <Send className="w-4 h-4" />
          <span>{loading ? 'Đang gửi...' : 'Gửi yêu cầu'}</span>
        </GlassButton>
      </form>

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
    </motion.div>
  );
}