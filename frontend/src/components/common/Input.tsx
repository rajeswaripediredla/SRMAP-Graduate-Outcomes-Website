import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  type = 'text',
  className = '',
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="w-full text-left mb-4">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-primary-text/80 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary-text">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={isPassword && showPassword ? 'text' : type}
          className={`
            block w-full rounded-lg border text-sm transition-all duration-200 bg-white text-primary-text
            ${icon ? 'pl-10' : 'pl-3.5'}
            ${isPassword ? 'pr-10' : 'pr-3.5'}
            py-2.5
            ${error 
              ? 'border-rejected focus:border-rejected focus:ring-rejected/25 focus:ring-3' 
              : 'border-taupe/40 focus:border-mocha focus:ring-mocha/25 focus:ring-3'}
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-rejected font-medium flex items-center">
          <span className="inline-block w-1 h-1 rounded-full bg-rejected mr-1"></span>
          {error}
        </p>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  icon,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="w-full text-left mb-4">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-primary-text/80 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary-text">
            {icon}
          </div>
        )}
        <select
          id={id}
          className={`
            block w-full rounded-lg border text-sm transition-all duration-200 bg-white text-primary-text appearance-none
            ${icon ? 'pl-10' : 'pl-3.5'}
            pr-10 py-2.5
            ${error 
              ? 'border-rejected focus:border-rejected focus:ring-rejected/25 focus:ring-3' 
              : 'border-taupe/40 focus:border-mocha focus:ring-mocha/25 focus:ring-3'}
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-secondary-text">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-rejected font-medium flex items-center">
          <span className="inline-block w-1 h-1 rounded-full bg-rejected mr-1"></span>
          {error}
        </p>
      )}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  className = '',
  id,
  rows = 3,
  ...props
}) => {
  return (
    <div className="w-full text-left mb-4">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-primary-text/80 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`
          block w-full rounded-lg border text-sm transition-all duration-200 bg-white text-primary-text px-3.5 py-2.5
          ${error 
            ? 'border-rejected focus:border-rejected focus:ring-rejected/25 focus:ring-3' 
            : 'border-taupe/40 focus:border-mocha focus:ring-mocha/25 focus:ring-3'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-rejected font-medium flex items-center">
          <span className="inline-block w-1 h-1 rounded-full bg-rejected mr-1"></span>
          {error}
        </p>
      )}
    </div>
  );
};
