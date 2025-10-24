'use client';
import { motion } from 'framer-motion';
import GlassCard from '../../../components/ui/GlassCard';
import GlassButton from '../../../components/ui/GlassButton';
import { Wrench, Star, Shield, Zap, Download, CheckCircle } from 'lucide-react';

export default function ToolPage() {
  const features = [
    { icon: Zap, title: 'Tốc độ cao', desc: 'Xử lý nhanh chóng, hiệu quả' },
    { icon: Shield, title: 'Bảo mật tuyệt đối', desc: 'Mã hóa dữ liệu an toàn' },
    { icon: Star, title: 'Giao diện đẹp', desc: 'Thiết kế hiện đại, dễ sử dụng' },
    { icon: CheckCircle, title: 'Cập nhật liên tục', desc: 'Luôn có phiên bản mới nhất' }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center mb-4">
          <Wrench className="w-12 h-12 text-primary-400 mr-3" />
          <h1 className="text-4xl font-bold text-white">DomiBet Tool</h1>
        </div>
        <p className="text-xl text-white/80 mb-2">Tool chuyên nghiệp - Crack full chức năng</p>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-3xl font-bold text-yellow-400">999 gạch</span>
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">Bảo hành trọn đời</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard>
            <div className="text-center p-8">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Wrench className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">DomiBet Tool Pro</h2>
              <p className="text-gray-600 mb-6">
                Tool chuyên nghiệp với đầy đủ tính năng crack, hỗ trợ mọi phiên bản DomiBet. 
                Giao diện thân thiện, dễ sử dụng cho mọi đối tượng.
              </p>
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-primary-600">999</span>
                <span className="text-xl text-gray-600 ml-2">gạch</span>
              </div>
              <GlassButton className="w-full mb-4">
                <Download className="w-5 h-5 mr-2" />
                Mua ngay
              </GlassButton>
              <p className="text-sm text-green-600 font-medium">✓ Bảo hành trọn đời</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Tính năng nổi bật</h3>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start space-x-4 p-4 bg-white/10 rounded-xl"
                >
                  <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <GlassCard>
          <div className="text-center p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Tại sao chọn DomiBet Tool?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Crack hoàn toàn</h4>
                <p className="text-sm text-gray-600">Mở khóa tất cả tính năng premium</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">An toàn tuyệt đối</h4>
                <p className="text-sm text-gray-600">Không virus, không malware</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Hỗ trợ 24/7</h4>
                <p className="text-sm text-gray-600">Hỗ trợ kỹ thuật mọi lúc</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
              <h4 className="text-xl font-bold mb-2">Ưu đãi đặc biệt!</h4>
              <p className="mb-4">Mua ngay hôm nay chỉ với 999 gạch - Bảo hành trọn đời</p>
              <GlassButton variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
                <Download className="w-5 h-5 mr-2" />
                Liên hệ mua ngay
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}