'use client';

export default function SimpleCard({ children, className = '', ...props }) {
  return (
    <div
      className={`glass-card p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}