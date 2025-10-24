'use client';
import { motion } from 'framer-motion';

export default function GlassInput({ 
  label, 
  error, 
  className = '', 
  ...props 
}) {
  return (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`glass-input w-full ${error ? 'border-red-300 focus:border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && (
        <motion.p 
          className="text-sm text-red-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}