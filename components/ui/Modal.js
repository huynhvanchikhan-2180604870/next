'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import GlassButton from './GlassButton';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info', // 'success', 'error', 'info', 'warning'
  confirmText = 'OK',
  cancelText = 'Hủy',
  onConfirm,
  showCancel = false
}) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-8 h-8 text-yellow-500" />;
      default:
        return <Info className="w-8 h-8 text-blue-500" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50/20';
      case 'error':
        return 'border-red-200 bg-red-50/20';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50/20';
      default:
        return 'border-blue-200 bg-blue-50/20';
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 max-w-md w-full shadow-2xl"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getIcon()}
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors text-gray-600 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`p-4 rounded-xl ${getColors()} mb-6`}>
              <p className="text-gray-700 leading-relaxed">{message}</p>
            </div>

            <div className="flex space-x-3">
              {showCancel && (
                <GlassButton
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                >
                  {cancelText}
                </GlassButton>
              )}
              <GlassButton
                variant={type === 'error' ? 'danger' : 'primary'}
                onClick={handleConfirm}
                className="flex-1"
              >
                {confirmText}
              </GlassButton>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}