'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <GlassCard className="max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-8xl font-bold text-primary-500 mb-4"
          >
            404
          </motion.div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Trang không tồn tại
          </h1>
          
          <p className="text-gray-600 mb-6">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/">
              <GlassButton className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                <span>Trang chủ</span>
              </GlassButton>
            </Link>
            
            <GlassButton
              variant="secondary"
              onClick={() => window.history.back()}
              className="flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </GlassButton>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}