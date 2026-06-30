import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Shield, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const ProfileDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-taupe/15 transition-all text-left cursor-pointer"
      >
        <img
          src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'}
          alt={user.name}
          className="w-8.5 h-8.5 rounded-full object-cover border border-taupe/30"
        />
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-semibold text-primary-text leading-none truncate">
            {user.name}
          </span>
          <span className="text-[10px] text-secondary-text font-semibold capitalize mt-0.5">
            {user.role}
          </span>
        </div>
        <ChevronDown size={14} className={`text-secondary-text transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2.5 w-64 rounded-xl glass-panel shadow-xl py-2 z-30"
          >
            {/* Header info */}
            <div className="px-4 py-3 border-b border-taupe/15 text-left">
              <p className="text-xs font-bold text-primary-text">{user.name}</p>
              <p className="text-[10px] text-secondary-text truncate mt-0.5">{user.email}</p>
              
              {user.department && (
                <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded bg-cream/30 border border-cream text-walnut font-bold text-[9px] uppercase tracking-wide">
                  {user.department.split(' ')[0]}
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="py-1 text-left">
              {user.regNo && (
                <div className="px-4 py-2 text-[10px] text-secondary-text flex justify-between font-semibold border-b border-taupe/10">
                  <span>Reg No:</span>
                  <span className="font-bold text-primary-text">{user.regNo}</span>
                </div>
              )}
              {user.designation && (
                <div className="px-4 py-2 text-[10px] text-secondary-text flex justify-between font-semibold border-b border-taupe/10">
                  <span>Designation:</span>
                  <span className="font-bold text-primary-text">{user.designation}</span>
                </div>
              )}

              <div className="px-1 py-1">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to dashboard based on role
                    navigate(`/${user.role}/dashboard`);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-primary-text hover:bg-taupe/10 transition-colors cursor-pointer"
                >
                  <Shield size={14} className="text-mocha" />
                  <span>My Portal Home</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-rejected-light transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ProfileDropdown;
