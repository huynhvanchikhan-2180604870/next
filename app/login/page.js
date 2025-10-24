'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import GlassCard from '../../components/ui/GlassCard';
import GlassButton from '../../components/ui/GlassButton';
import GlassInput from '../../components/ui/GlassInput';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login } = useAuth();
  const { post, loading, error } = useApi();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const response = await post('/api/auth/login', formData);
      login(response.token, response.user);
      
      if (response.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
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
              Đăng nhập
            </h1>
            <p className="text-gray-600">
              Chào mừng trở lại với BankThue.com
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </GlassButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}