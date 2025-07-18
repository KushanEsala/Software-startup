import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const SmoothScroll = ({ children }) => {
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      controls.start({
        y: -window.scrollY * 0.3,
        transition: { type: 'spring', stiffness: 300, damping: 30 }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls]);

  return (
    <motion.div animate={controls}>
      {children}
    </motion.div>
  );
};

export default SmoothScroll;