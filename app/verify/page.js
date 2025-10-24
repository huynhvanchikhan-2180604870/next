'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApi } from '../../hooks/useApi';
import GlassCard from '../../components/ui/GlassCard';
import GlassButton from '../../components/ui/GlassButton';
import { Mail, CheckCircle } from 'lucide-react';

export default function VerifyPage() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { post, loading, error } = useApi();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setErrors({ code: 'Vui lòng nhập đầy đủ mã xác thực' });
      return;
    }

    try {
      await post('/api/auth/verify', {
        email,
        code: verificationCode,
      });
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setErrors({ general: err.message });
    }
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
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Xác thực thành công!
            </h2>
            <p className="text-gray-600 mb-4">
              Tài khoản của bạn đã được kích hoạt.
            </p>
            <p className="text-sm text-gray-500">
              Đang chuyển hướng đến trang đăng nhập...
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
            <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Xác thực email
            </h1>
            <p className="text-gray-600">
              Nhập mã 6 số đã được gửi đến
            </p>
            <p className="text-primary-600 font-medium">
              {email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <motion.input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold glass-input"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                />
              ))}
            </div>

            {errors.code && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-600 text-sm text-center"
              >
                {errors.code}
              </motion.p>
            )}

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
              {loading ? 'Đang xác thực...' : 'Xác thực'}
            </GlassButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Không nhận được mã?{' '}
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                Gửi lại
              </button>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}