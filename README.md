# BankThue.com - Hệ thống quản lý yêu cầu

Hệ thống quản lý yêu cầu và Lấy gạch về hiện đại với NextJS 15, MongoDB, và Liquid Glass UI.

## ✨ Tính năng

### 🔐 Authentication & Authorization

- Đăng ký/Đăng nhập với JWT
- Email verification với mã 6 số
- Role-based access (User/Admin)
- Session management

### 👤 User Features

- **Quản lý yêu cầu**: Upload file (TXT, JSON, Excel) hoặc nhập tay danh sách tên
- **Lấy gạch về**: Tạo yêu cầu Lấy gạch về với thông tin ngân hàng
- **Hỗ trợ**: Contact form và FAQ
- **Dashboard**: Thống kê cá nhân và lịch sử

### 👨‍💼 Admin Features

- **Dashboard**: Thống kê tổng quan hệ thống
- **Quản lý yêu cầu**: Xem, xử lý và cập nhật yêu cầu từ user
- **Quản lý người dùng**: Xem danh sách, khóa/mở khóa tài khoản
- **Email notifications**: Tự động gửi email khi có yêu cầu mới

### 🎨 UI/UX Features

- **Liquid Glass Effects**: Glass morphism với floating bubbles
- **Responsive Design**: Tối ưu cho mọi thiết bị
- **Smooth Animations**: Framer Motion animations
- **Modern Icons**: Lucide React icons
- **Dark/Light Theme**: Adaptive color scheme

## 🛠 Tech Stack

### Backend

- **NextJS 15**: Full-stack React framework
- **MongoDB**: NoSQL database với Mongoose
- **JWT**: Authentication tokens
- **Nodemailer**: Email service
- **Multer**: File upload handling
- **XLSX**: Excel file processing

### Frontend

- **React 18**: UI library
- **TailwindCSS**: Utility-first CSS
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **Context API**: State management

## 🚀 Installation

1. **Clone repository**

```bash
git clone <repository-url>
cd bankthue.com
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env.local
```

Cập nhật các biến môi trường:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key cho JWT
- `SMTP_*`: Cấu hình email SMTP
- `ADMIN_EMAIL`: Email admin nhận thông báo

4. **Run development server**

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📁 Project Structure

```
bankthue.com/
├── app/                    # NextJS 15 App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── layout/           # Layout components
│   ├── auth/             # Auth components
│   ├── user/             # User components
│   ├── admin/            # Admin components
│   └── effects/          # Visual effects
├── context/              # React Context
├── hooks/                # Custom hooks
├── lib/                  # Utilities
├── models/               # MongoDB models
└── middleware.js         # NextJS middleware
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - Đăng ký user
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/verify` - Xác thực email

### User APIs

- `GET/POST /api/user/requests` - Quản lý yêu cầu
- `GET/PUT /api/user/profile` - Profile user
- `GET/POST /api/user/withdraw` - Lấy gạch về

### Admin APIs

- `GET/PUT /api/admin/requests` - Quản lý yêu cầu
- `GET/PUT /api/admin/users` - Quản lý users
- `GET /api/admin/dashboard` - Dashboard stats

### Utilities

- `POST /api/upload` - Upload và parse file
- `GET/PUT /api/notifications` - Thông báo

## 🎨 Liquid Glass Effects

Dự án sử dụng Liquid Glass design system với:

- **Glass Morphism**: Backdrop blur với transparency
- **Floating Bubbles**: Animated background elements
- **Smooth Transitions**: Framer Motion animations
- **Responsive Design**: Mobile-first approach
- **Color Gradients**: Dynamic liquid backgrounds

## 📧 Email Templates

Hệ thống email tự động:

- **Verification Email**: Mã xác thực 6 số
- **Request Notification**: Thông báo admin có yêu cầu mới
- **Status Update**: Thông báo user khi admin cập nhật

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs encryption
- **Input Validation**: Server-side validation
- **File Type Validation**: Secure file upload
- **Rate Limiting**: API protection
- **CORS Protection**: Cross-origin security

## 📱 Responsive Design

- **Mobile First**: Tối ưu cho mobile
- **Tablet Support**: Layout responsive
- **Desktop Enhanced**: Full features
- **Touch Friendly**: Mobile interactions

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel --prod
```

### Docker

```bash
docker build -t bankthue-app .
docker run -p 3000:3000 bankthue-app
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 📞 Support

- Telegram: @nextgenhvck
- Email: dprovider489@gmail.com
- GitHub Issues: [Create Issue](https://github.com/your-repo/issues)

---

Made with ❤️ using NextJS 15 & Liquid Glass UI
