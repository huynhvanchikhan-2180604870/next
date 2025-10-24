'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navigation from '../../components/layout/Navigation';
import { motion } from 'framer-motion';

export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
    if (!loading && isAuthenticated && user?.role === 'admin') {
      router.push('/admin');
    }
  }, [isAuthenticated, loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role === 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
}