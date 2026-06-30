import React, { useState, useRef, useEffect } from 'react';
import { Bell, BellOff, Check, Menu, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ProfileDropdown } from './ProfileDropdown';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface TopbarProps {
  onToggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const { user, notifications, markNotificationAsRead, clearNotifications } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  // Filter notifications relevant to this specific user role or specifically addressed to this user id
  const userNotifications = notifications.filter(not => 
    not.recipientRole === 'all' || 
    not.recipientRole === user.role || 
    (not.recipientId && not.recipientId === user.id)
  );

  const unreadCount = userNotifications.filter(not => !not.isRead).length;

  // Calculate friendly header title based on location
  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path.includes('/student/dashboard')) return 'Student Attainment Dashboard';
    if (path.includes('/student/achievements')) return 'My Achievement Records';
    if (path.includes('/student/attainment')) return 'Graduate Outcomes Attainment Status';
    
    if (path.includes('/faculty/dashboard')) return 'Faculty Verification Overview';
    if (path.includes('/faculty/queue')) return 'Pending Verifications Queue';
    if (path.includes('/faculty/history')) return 'Verification Action History';
    
    if (path.includes('/hod/dashboard')) return 'Departmental Analytics Dashboard';
    if (path.includes('/hod/analytics')) return 'GO Metric Attainment Deep Dive';
    if (path.includes('/hod/departments')) return 'Inter-Department Benchmarking';
    
    if (path.includes('/admin/dashboard')) return 'System Administration Portal';
    if (path.includes('/admin/users')) return 'System User Directory';
    if (path.includes('/admin/outcomes')) return 'Graduate Outcome Configurations';
    if (path.includes('/admin/logs')) return 'System Activity Audit Logs';
    
    return 'Graduate Outcomes Portal';
  };

  const formatTimestamp = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <header className="h-16 border-b border-taupe/20 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-6 shadow-sm select-none">
      {/* Title & Mobile Toggle */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg hover:bg-taupe/15 text-primary-text block cursor-pointer"
        >
          <Menu size={18} />
        </button>
        
        <h1 className="text-sm md:text-base font-bold text-primary-text font-heading leading-tight truncate">
          {getHeaderTitle()}
        </h1>
      </div>

      {/* Quick Controls & User Profile */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-secondary-text hover:bg-taupe/15 hover:text-primary-text transition-colors relative cursor-pointer"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 block h-4 w-4 rounded-full bg-rejected text-[9px] font-bold text-white flex items-center justify-center border-2 border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Menu */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2.5 w-80 md:w-96 rounded-xl glass-panel shadow-xl py-2 z-30 flex flex-col max-h-[480px]"
              >
                {/* Header */}
                <div className="px-4 py-2.5 border-b border-taupe/15 flex items-center justify-between">
                  <span className="text-xs font-bold text-primary-text flex items-center">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-1.5 bg-cream text-walnut px-2 py-0.5 rounded-full text-[9px] font-bold">
                        {unreadCount} New
                      </span>
                    )}
                  </span>
                  
                  {unreadCount > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[10px] text-walnut font-bold hover:underline flex items-center cursor-pointer"
                    >
                      <Check size={12} className="mr-1" /> Mark all read
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="overflow-y-auto flex-1 divide-y divide-taupe/10">
                  {userNotifications.length > 0 ? (
                    userNotifications.map((not) => (
                      <div 
                        key={not.id}
                        onClick={() => markNotificationAsRead(not.id)}
                        className={`
                          p-4 text-left transition-colors cursor-pointer text-xs
                          ${not.isRead ? 'hover:bg-bg-base/40' : 'bg-cream/10 hover:bg-cream/15 font-medium'}
                        `}
                      >
                        <div className="flex justify-between items-start space-x-2">
                          <span className={`font-semibold ${not.isRead ? 'text-primary-text' : 'text-walnut'}`}>
                            {not.title}
                          </span>
                          <span className="text-[9px] text-secondary-text whitespace-nowrap">
                            {formatTimestamp(not.timestamp)}
                          </span>
                        </div>
                        <p className="text-secondary-text mt-1 leading-normal text-[11px]">
                          {not.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-secondary-text flex flex-col items-center justify-center">
                      <BellOff size={24} className="text-taupe/60 mb-2" />
                      <p className="text-xs font-medium">Your inbox is clear</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-taupe/20" />

        {/* User Profile dropdown */}
        <ProfileDropdown />
      </div>
    </header>
  );
};
export default Topbar;
