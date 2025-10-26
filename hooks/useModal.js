import { useState } from 'react';

export const useModal = () => {
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
    showCancel: false,
    confirmText: 'OK',
    cancelText: 'Hủy'
  });

  const showModal = ({
    title,
    message,
    type = 'info',
    onConfirm = null,
    showCancel = false,
    confirmText = 'OK',
    cancelText = 'Hủy'
  }) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
      showCancel,
      confirmText,
      cancelText
    });
  };

  const hideModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const showSuccess = (title, message, onConfirm = null) => {
    showModal({ title, message, type: 'success', onConfirm });
  };

  const showError = (title, message, onConfirm = null) => {
    showModal({ title, message, type: 'error', onConfirm });
  };

  const showWarning = (title, message, onConfirm = null) => {
    showModal({ title, message, type: 'warning', onConfirm });
  };

  const showInfo = (title, message, onConfirm = null) => {
    showModal({ title, message, type: 'info', onConfirm });
  };

  const showConfirm = (title, message, onConfirm, onCancel = null) => {
    showModal({
      title,
      message,
      type: 'warning',
      onConfirm,
      showCancel: true,
      confirmText: 'Xác nhận',
      cancelText: 'Hủy'
    });
  };

  return {
    modal,
    showModal,
    hideModal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm
  };
};