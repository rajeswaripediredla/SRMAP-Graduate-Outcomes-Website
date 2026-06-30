import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="mb-5">
        {icon ? (
          <div className="w-16 h-16 rounded-2xl bg-[#FFDBBB]/30 flex items-center justify-center text-[#997E67] mx-auto">
            {icon}
          </div>
        ) : (
          <svg className="w-20 h-20 mx-auto text-[#CCBEB1]" fill="none" viewBox="0 0 80 80">
            <rect x="10" y="20" width="60" height="50" rx="8" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M25 35h30M25 45h20M25 55h15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="60" cy="18" r="10" fill="#FFDBBB" stroke="#997E67" strokeWidth="1.5"/>
            <path d="M57 18h6M60 15v6" stroke="#997E67" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </div>
      <h3 className="text-base font-bold text-[#2F2A26] font-heading mb-1.5">{title}</h3>
      {description && <p className="text-xs text-[#6B7280] max-w-xs leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
