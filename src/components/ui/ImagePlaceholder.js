'use client';
import { motion } from 'framer-motion';

export default function ImagePlaceholder({ className }) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
      className={`bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg ${className}`}
    />
  );
} 