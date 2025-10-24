import { Inter } from "next/font/google";
import LiquidBackground from "../components/effects/LiquidBackground";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BankThue.com - Hệ thống quản lý",
  description: "Hệ thống quản lý yêu cầu và Lấy gạch về",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthProvider>
          <LiquidBackground />
          <div className="relative z-10">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
