'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import { ArrowRight, Shield, Zap, Users } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  const features = [
    {
      icon: Shield,
      title: 'Bảo mật cao',
      description: 'Hệ thống xác thực 2 lớp với email verification'
    },
    {
      icon: Zap,
      title: 'Xử lý nhanh',
      description: 'Admin được thông báo ngay lập tức qua email'
    },
    {
      icon: Users,
      title: 'Quản lý dễ dàng',
      description: 'Giao diện thân thiện với liquid glass effects'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
          <span className="text-primary-300">Provider</span>
        </h1>
        <p className="text-xl text-white/80 mb-8">
          Hệ thống quản lý yêu cầu và rút gạch hiện đại
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <GlassCard className="text-center h-full">
              <feature.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <GlassButton
          onClick={() => router.push('/login')}
          className="flex items-center gap-2"
        >
          Đăng nhập
          <ArrowRight className="w-4 h-4" />
        </GlassButton>
        
        <GlassButton
          variant="secondary"
          onClick={() => router.push('/register')}
        >
          Đăng ký ngay
        </GlassButton>
      </motion.div>
    </div>
  );
}