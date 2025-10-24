'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApi } from '../../hooks/useApi';
import GlassCard from '../../components/ui/GlassCard';
import GlassButton from '../../components/ui/GlassButton';
import GlassInput from '../../components/ui/GlassInput';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  
  const { post, loading, error } = useApi();
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
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
      await post('/api/auth/register', {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });
      
      setSuccess(true);
      setTimeout(() => {
        router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
      }, 2000);
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <GlassCard className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Mail className="w-8 h-8 text-green-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Đăng ký thành công!
            </h2>
            <p className="text-gray-600 mb-4">
              Chúng tôi đã gửi mã xác thực đến email của bạn.
            </p>
            <p className="text-sm text-gray-500">
              Đang chuyển hướng đến trang xác thực...
            </p>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <GlassCard>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Đăng ký
            </h1>
            <p className="text-gray-600">
              Tạo tài khoản mới tại BankThue.com
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <GlassInput
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                value={formData.fullName}
                onChange={handleChange}
                className="pl-12"
                required
                error={errors.fullName}
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <GlassInput
                type="email"
                name="email"
                placeholder="Email của bạn"
                value={formData.email}
                onChange={handleChange}
                className="pl-12"
                required
                error={errors.email}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <GlassInput
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                className="pl-12 pr-12"
                required
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <GlassInput
                type="password"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-12"
                required
                error={errors.confirmPassword}
              />
            </div>

            {(error || errors.general) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-100/80 border border-red-200 text-red-700 px-4 py-3 rounded-xl backdrop-blur-sm"
              >
                {error || errors.general}
              </motion.div>
            )}

            <GlassButton
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </GlassButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}