'use client';
import { motion } from 'framer-motion';

export default function LiquidBackground() {
  const bubbles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 200 + 50,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="liquid-bg absolute inset-0" />
      
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="liquid-bubble"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
          }}
          animate={{
            y: [-20, -40, -20],
            x: [-10, 10, -10],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8 + bubble.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: bubble.delay,
          }}
        />
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
    </div>
  );
}