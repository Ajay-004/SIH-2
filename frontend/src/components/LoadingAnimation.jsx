import React from 'react';
import { motion } from 'framer-motion';

const LoadingAnimation = () => {
  // Geometric shapes for the kinetic morphing effect
  const shapes = [
    { type: "circle", color: "bg-orange-500" },
    { type: "square", color: "bg-green-600" },
    { type: "triangle", color: "bg-yellow-400" }
  ];

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999]">
      <div className="flex gap-4 mb-8">
        {shapes.map((shape, i) => (
          <motion.div
            key={i}
            className={`w-12 h-12 ${shape.color} ${shape.type === 'circle' ? 'rounded-full' : ''}`}
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
              borderRadius: shape.type === 'square' ? ["0%", "50%", "0%"] : "none"
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-700 bg-clip-text text-transparent uppercase tracking-widest"
      >
        Loading TN Flow
      </motion.h2>
    </div>
  );
};

export default LoadingAnimation;