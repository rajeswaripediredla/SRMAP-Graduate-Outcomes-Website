import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 text-sm py-2.5 px-5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-walnut text-white hover:bg-mocha focus:ring-mocha shadow-md shadow-walnut/10',
    secondary: 'bg-taupe text-primary-text hover:bg-mocha hover:text-white focus:ring-mocha',
    outline: 'bg-transparent text-walnut border border-walnut/30 hover:bg-cream/20 focus:ring-walnut',
    danger: 'bg-rejected text-white hover:bg-red-600 focus:ring-red-500 shadow-md shadow-rejected/10',
    ghost: 'bg-transparent text-secondary-text hover:bg-taupe/10 hover:text-primary-text focus:ring-taupe'
  };

  const currentVariantClass = variants[variant];

  return (
    <motion.button
      whileHover={disabled || isLoading ? {} : { scale: 1.01, y: -1 }}
      whileTap={disabled || isLoading ? {} : { scale: 0.99, y: 0 }}
      className={`${baseStyles} ${currentVariantClass} ${className}`}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
};
