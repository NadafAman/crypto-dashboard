import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
  className?: string;
}

interface CardContentProps extends HTMLMotionProps<"div"> {
  className?: string;
  children?: React.ReactNode;
}

export function Card({ className, ...props }: CardProps) {
  return (
    <motion.div
      className={`rounded-xl border border-gray-800 bg-gray-900 shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut"
      }}
      {...props}
    />
  );
}

export function CardContent({ 
  className, 
  children,
  ...props 
}: CardContentProps) {
  return (
    <motion.div
      className={`p-6 pt-4 bg-cyan-600 rounded-lg text-white ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: 0.1,
        duration: 0.3
      }}
      {...props}
    >
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 0.2,
          duration: 0.4
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default Card;