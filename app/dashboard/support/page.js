'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../../../components/ui/GlassCard';
import GlassButton from '../../../components/ui/GlassButton';
import GlassInput from '../../../components/ui/GlassInput';
import { 
  HelpCircle, 
  Mail, 
  Phone, 
  MessageCircle, 
  Send
} from 'lucide-react';

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState('contact');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [loading, setLoading] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Tin nhắn đã được gửi thành công! Chúng tôi sẽ phản hồi trong vòng 24h.');
      setContactForm({ subject: '', message: '', priority: 'normal' });
      setLoading(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const faqItems = [
    {
      question: 'Làm thế nào để tải lên file danh sách tên?',
      answer: 'Bạn có thể tải lên file .txt, .json, .xlsx hoặc .xls tại trang Quản lý. File phải chứa danh sách tên tiếng Việt, mỗi tên trên một dòng.'
    },
    {
      question: 'Thời gian xử lý yêu cầu là bao lâu?',
      answer: 'Thông thường yêu cầu sẽ được xử lý trong vòng 24-48 giờ làm việc. Admin sẽ nhận email thông báo ngay khi bạn gửi yêu cầu.'
    },
    {
      question: 'Làm sao để rút gạch?',
      answer: 'Truy cập trang Rút gạch, nhập số gạch và thông tin tài khoản ngân hàng. Số gạch rút tối thiểu là 100 gạch và không được vượt quá số gạch hiện tại.'
    },
    {
      question: 'Tại sao yêu cầu của tôi bị từ chối?',
      answer: 'Yêu cầu có thể bị từ chối nếu danh sách tên không hợp lệ, trùng lặp với yêu cầu trước đó, hoặc vi phạm quy định. Kiểm tra email để xem lý do cụ thể.'
    },
    {
      question: 'Làm thế nào để thay đổi thông tin tài khoản?',
      answer: 'Hiện tại bạn có thể cập nhật tên và avatar thông qua API. Để thay đổi email hoặc mật khẩu, vui lòng liên hệ hỗ trợ.'
    }
  ];

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'Telegram',
      value: '@nextgenhvck',
      description: 'Hỗ trợ nhanh nhất'
    },
    {
      icon: Mail,
      title: 'Email hỗ trợ',
      value: 'dprovider489@gmail.com',
      description: 'Phản hồi trong vòng 24 giờ'
    }
  ];

  const tabs = [
    { id: 'contact', label: 'Liên hệ', icon: Mail },
    { id: 'faq', label: 'FAQ', icon: HelpCircle }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Hỗ trợ</h1>
        <p className="text-white/80">Liên hệ với chúng tôi khi cần hỗ trợ</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-2xl p-1 mb-8 max-w-md">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <GlassCard>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Gửi tin nhắn</h2>
              
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <GlassInput
                  type="text"
                  name="subject"
                  label="Tiêu đề"
                  placeholder="Nhập tiêu đề tin nhắn"
                  value={contactForm.subject}
                  onChange={handleChange}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mức độ ưu tiên
                  </label>
                  <select
                    name="priority"
                    value={contactForm.priority}
                    onChange={handleChange}
                    className="w-full glass-input"
                  >
                    <option value="low">Thấp</option>
                    <option value="normal">Bình thường</option>
                    <option value="high">Cao</option>
                    <option value="urgent">Khẩn cấp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung
                  </label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleChange}
                    placeholder="Mô tả chi tiết vấn đề của bạn..."
                    rows={6}
                    className="w-full glass-input resize-none"
                    required
                  />
                </div>

                <GlassButton
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Đang gửi...' : 'Gửi tin nhắn'}</span>
                </GlassButton>
              </form>
            </GlassCard>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <GlassCard>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin liên hệ</h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="p-3 bg-primary-500/20 rounded-xl">
                      <method.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{method.title}</h4>
                      <p className="text-primary-600 font-medium">{method.value}</p>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Giờ làm việc</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Thứ 2 - Thứ 6:</span>
                  <span className="font-medium">8:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thứ 7:</span>
                  <span className="font-medium">8:00 - 12:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chủ nhật:</span>
                  <span className="font-medium">Nghỉ</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}

      {activeTab === 'faq' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-4xl"
        >
          <GlassCard>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Câu hỏi thường gặp</h2>
            
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-start space-x-2">
                    <HelpCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span>{item.question}</span>
                  </h3>
                  <p className="text-gray-600 ml-7">{item.answer}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-primary-50/20 rounded-xl border border-primary-200/30">
              <p className="text-gray-700">
                <strong>Không tìm thấy câu trả lời?</strong> Hãy liên hệ với chúng tôi qua Telegram 
                <span className="text-primary-600 font-medium">@nextgenhvck</span> hoặc email <span className="text-primary-600 font-medium">dprovider489@gmail.com</span>
              </p>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}