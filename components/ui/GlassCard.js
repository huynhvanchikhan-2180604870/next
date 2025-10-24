'use client';
import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', ...props }) {
  return (
    <motion.div
      className={`glass-card p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}