'use client';
import { motion } from 'framer-motion';

export default function GlassButton({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  className = '',
  ...props 
}) {
  const variants = {
    primary: 'glass-button bg-primary-500/20 hover:bg-primary-500/30 text-primary-700',
    secondary: 'glass-button bg-gray-500/20 hover:bg-gray-500/30 text-gray-700',
    success: 'glass-button bg-green-500/20 hover:bg-green-500/30 text-green-700',
    danger: 'glass-button bg-red-500/20 hover:bg-red-500/30 text-red-700',
  };

  return (
    <motion.button
      className={`${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}