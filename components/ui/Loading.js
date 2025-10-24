'use client';
import { motion } from 'framer-motion';

export default function Loading({ size = 'md', text = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className={`border-4 border-primary-500/30 border-t-primary-500 rounded-full ${sizes[size]}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 text-sm"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}