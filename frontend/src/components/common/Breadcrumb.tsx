import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-1 text-xs text-[#6B7280] mb-4" aria-label="Breadcrumb">
      <Link to="/" className="flex items-center text-[#997E67] hover:text-[#664930] transition-colors">
        <Home size={12} />
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={12} className="text-[#CCBEB1] flex-shrink-0" />
          {item.path && index < items.length - 1 ? (
            <Link
              to={item.path}
              className="hover:text-[#664930] text-[#997E67] transition-colors font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-[#2F2A26]">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
