import React from 'react';

interface StatusBadgeProps {
  status: 'pending' | 'verified' | 'rejected';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    pending: 'bg-pending-light text-pending border border-pending/20',
    verified: 'bg-success-light text-success border border-success/20',
    rejected: 'bg-rejected-light text-rejected border border-rejected/20'
  };

  const labels = {
    pending: 'Pending Verification',
    verified: 'Verified',
    rejected: 'Returned / Rejected'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === 'pending' ? 'bg-pending' : status === 'verified' ? 'bg-success' : 'bg-rejected'
      }`}></span>
      {labels[status]}
    </span>
  );
};

interface CategoryBadgeProps {
  category: 'certification' | 'internship' | 'placement' | 'publication' | 'higher_studies';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const styles = {
    certification: 'bg-blue-50 text-blue-700 border border-blue-100',
    internship: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
    placement: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    publication: 'bg-purple-50 text-purple-700 border border-purple-100',
    higher_studies: 'bg-amber-50 text-amber-700 border border-amber-100'
  };

  const labels = {
    certification: 'Certification',
    internship: 'Internship',
    placement: 'Placement Offer',
    publication: 'Research Publication',
    higher_studies: 'Higher Studies Admit'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[category]}`}>
      {labels[category]}
    </span>
  );
};

interface GOBadgeProps {
  code: string;
  showTooltip?: boolean;
}

const outcomeTooltips: Record<string, string> = {
  'GO-1': 'Engineering Knowledge: Core science & engineering fundamentals.',
  'GO-2': 'Problem Analysis: Analyze and substantiate complex problems.',
  'GO-3': 'Design & Development: Create solutions with public health & safety considerations.',
  'GO-4': 'Conduct Investigations: Use research-based design and experiments.',
  'GO-5': 'Modern Tool Usage: Apply predictions and modeling via engineering/IT software.',
  'GO-6': 'Engineer & Society: Analyze societal, health, and legal contexts.'
};

export const GOBadge: React.FC<GOBadgeProps> = ({ code, showTooltip = true }) => {
  return (
    <div className="relative group inline-block">
      <span className="inline-flex items-center px-2 py-0.5 rounded bg-cream text-walnut font-bold text-xs tracking-wider border border-walnut/20 select-none">
        {code}
      </span>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 p-2 bg-[#2F2A26] text-white text-[10px] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none text-center">
          {outcomeTooltips[code] || 'Graduate Outcome Mapping'}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#2F2A26]" />
        </div>
      )}
    </div>
  );
};
