import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Award, 
  GraduationCap, 
  CheckSquare, 
  History, 
  BarChart3, 
  Users, 
  Settings, 
  ScrollText, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  FileClock,
  Compass
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  // Determine navigation items based on user role
  const getNavItems = () => {
    switch (user.role) {
      case 'student':
        return [
          { path: '/student/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
          { path: '/student/achievements', name: 'My Submissions', icon: <Award size={20} /> },
          { path: '/student/attainment', name: 'GO Attainment', icon: <TrendingUp size={20} /> },
        ];
      case 'faculty':
        return [
          { path: '/faculty/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
          { path: '/faculty/queue', name: 'Pending Queue', icon: <CheckSquare size={20} /> },
          { path: '/faculty/history', name: 'Verification History', icon: <History size={20} /> },
        ];
      case 'hod':
        return [
          { path: '/hod/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
          { path: '/hod/analytics', name: 'Outcome Analytics', icon: <BarChart3 size={20} /> },
          { path: '/hod/departments', name: 'Department Comparison', icon: <Compass size={20} /> },
        ];
      case 'admin':
        return [
          { path: '/admin/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
          { path: '/admin/users', name: 'User Directory', icon: <Users size={20} /> },
          { path: '/admin/outcomes', name: 'GO Config', icon: <Settings size={20} /> },
          { path: '/admin/logs', name: 'Audit Logs', icon: <ScrollText size={20} /> },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen sticky top-0 bg-[#2F2A26] text-white flex flex-col justify-between z-20 shadow-xl select-none"
    >
      <div>
        {/* Branding Area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center text-[#2F2A26] font-bold text-base shrink-0">
              SRM
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col min-w-0"
              >
                <span className="font-heading font-bold text-sm tracking-tight text-cream leading-tight">
                  GO Portal
                </span>
                <span className="text-[9px] text-white/50 tracking-wider">
                  SRM University AP
                </span>
              </motion.div>
            )}
          </div>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* User Mini-Card */}
        {!isCollapsed && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="m-4 p-3 bg-white/5 rounded-lg border border-white/10 text-left"
          >
            <p className="text-xs font-bold text-cream truncate">
              {user.name}
            </p>
            <p className="text-[10px] text-white/60 capitalize mt-0.5 font-medium">
              {user.role} • {user.department ? user.department.split(' ')[0] : 'Admin'}
            </p>
          </motion.div>
        )}

        {/* Navigation links */}
        <nav className="mt-4 px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all text-xs font-semibold tracking-wide relative group
                ${isActive 
                  ? 'bg-cream text-walnut font-bold shadow-md shadow-cream/5' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'}
              `}
            >
              <span className="shrink-0">{item.icon}</span>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-primary-text text-white text-[10px] rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Area */}
      <div className="p-2 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer"
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};
