import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Achievement, 
  GraduateOutcome, 
  Department, 
  AuditLog, 
  Notification,
  mockUsers,
  mockAchievements,
  mockGraduateOutcomes,
  mockDepartments,
  mockAuditLogs,
  mockNotifications
} from '../utils/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole, keepMeSignedIn?: boolean) => Promise<boolean>;
  logout: () => void;
  
  // Profile Update Operations
  updateUserProfile: (updates: Partial<User>) => void;
  changePassword: (current: string, newPass: string) => Promise<boolean>;
  triggerPasswordRecovery: (email: string) => Promise<boolean>;
  verifyEmailCode: (code: string) => Promise<boolean>;
  verifyPhoneOTP: (otp: string) => Promise<boolean>;

  // Achievement Management
  achievements: Achievement[];
  addAchievement: (achievementData: {
    category: Achievement['category'];
    title: string;
    issuer: string;
    date: string;
    fileName: string;
    fileSize: string;
    goMapping: string[];
    details?: Record<string, string>;
  }) => void;
  verifyAchievement: (id: string, action: 'verified' | 'rejected', comments?: string) => void;
  
  // Notifications
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Admin Operations (CRUD Users)
  users: User[];
  addUser: (userData: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // Outcome Threshold Editor
  outcomes: GraduateOutcome[];
  updateOutcomeThreshold: (code: string, threshold: number) => void;
  
  // Department Management
  departments: Department[];
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  
  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (action: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session Recovery
  const [user, setUser] = useState<User | null>(() => {
    const localSaved = localStorage.getItem('go_user');
    const sessionSaved = sessionStorage.getItem('go_user');
    return localSaved ? JSON.parse(localSaved) : sessionSaved ? JSON.parse(sessionSaved) : null;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('go_achievements');
    return saved ? JSON.parse(saved) : mockAchievements;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('go_notifications');
    return saved ? JSON.parse(saved) : mockNotifications;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('go_users');
    return saved ? JSON.parse(saved) : mockUsers;
  });

  const [outcomes, setOutcomes] = useState<GraduateOutcome[]>(() => {
    const saved = localStorage.getItem('go_outcomes');
    return saved ? JSON.parse(saved) : mockGraduateOutcomes;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('go_departments');
    return saved ? JSON.parse(saved) : mockDepartments;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('go_audit_logs');
    return saved ? JSON.parse(saved) : mockAuditLogs;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('go_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('go_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('go_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('go_outcomes', JSON.stringify(outcomes));
  }, [outcomes]);

  useEffect(() => {
    localStorage.setItem('go_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('go_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Keep active user synchronized with active storage
  useEffect(() => {
    if (user) {
      if (localStorage.getItem('go_user')) {
        localStorage.setItem('go_user', JSON.stringify(user));
      } else {
        sessionStorage.setItem('go_user', JSON.stringify(user));
      }
    }
  }, [user]);

  const addAuditLog = (action: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: user?.id || 'public',
      userName: user?.name || 'Public Visitor',
      role: user?.role || 'public',
      action,
      ipAddress: '172.16.42.' + Math.floor(Math.random() * 254 + 1)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const login = async (email: string, password: string, role: UserRole, keepMeSignedIn = false): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
        
        if (foundUser || password === 'password123') {
          const activeUser: User = foundUser || {
            id: `usr_${role}_${Date.now()}`,
            name: role === 'student' ? 'Aarav Pediredla' : 
                  role === 'faculty' ? 'Dr. Rajeshwari K.' : 
                  role === 'hod' ? 'Dr. Murali Krishna S.' : 'Srikanth T.',
            email,
            role,
            department: role !== 'admin' ? 'Computer Science & Engineering' : undefined,
            regNo: role === 'student' ? 'AP21110010245' : undefined,
            designation: role === 'faculty' ? 'Associate Professor' : role === 'hod' ? 'Head of Department' : undefined,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
            phone: '+91 98765 43210',
            program: role === 'student' ? 'Bachelor of Technology (B.Tech)' : undefined,
            gradYear: role === 'student' ? '2026' : undefined,
            phoneVerified: false,
            emailVerified: true
          };
          
          setUser(activeUser);
          
          // Persist appropriately based on remember me checkbox selection
          if (keepMeSignedIn) {
            localStorage.setItem('go_user', JSON.stringify(activeUser));
            sessionStorage.removeItem('go_user');
          } else {
            sessionStorage.setItem('go_user', JSON.stringify(activeUser));
            localStorage.removeItem('go_user');
          }
          
          // Add Audit entry
          const newLog: AuditLog = {
            id: `log_${Date.now()}`,
            timestamp: new Date().toISOString(),
            userId: activeUser.id,
            userName: activeUser.name,
            role: activeUser.role,
            action: `Logged into the system (${keepMeSignedIn ? 'Persistent Session' : 'Temporary Session'})`,
            ipAddress: '172.16.42.' + Math.floor(Math.random() * 254 + 1)
          };
          setAuditLogs(prev => [newLog, ...prev]);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 600);
    });
  };

  const logout = () => {
    if (user) {
      addAuditLog('Logged out of the system');
    }
    setUser(null);
    localStorage.removeItem('go_user');
    sessionStorage.removeItem('go_user');
  };

  // Profile management updates
  const updateUserProfile = (updates: Partial<User>) => {
    if (!user) return;
    
    // Update local user state
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);

    // Update inside overall user list to maintain statistics and global consistency
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...updates } : u));
    addAuditLog(`Updated profile information (Fields: ${Object.keys(updates).join(', ')})`);
  };

  const changePassword = async (current: string, newPass: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        addAuditLog('Modified account password credentials');
        resolve(true);
      }, 500);
    });
  };

  const triggerPasswordRecovery = async (email: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        const targetName = foundUser ? foundUser.name : 'Unknown User';
        
        // Log recover action
        const recoverLog: AuditLog = {
          id: `log_${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: foundUser?.id || 'guest',
          userName: targetName,
          role: foundUser?.role || 'public',
          action: `Triggered password recovery recovery email to ${email}`,
          ipAddress: '172.16.42.' + Math.floor(Math.random() * 254 + 1)
        };
        setAuditLogs(prev => [recoverLog, ...prev]);
        resolve(true);
      }, 600);
    });
  };

  const verifyEmailCode = async (code: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (code === '123456' || code.length === 6) {
          updateUserProfile({ emailVerified: true });
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  };

  const verifyPhoneOTP = async (otp: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (otp === '123456' || otp.length === 6) {
          updateUserProfile({ phoneVerified: true });
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  };

  // Achievement Management
  const addAchievement = (achievementData: {
    category: Achievement['category'];
    title: string;
    issuer: string;
    date: string;
    fileName: string;
    fileSize: string;
    goMapping: string[];
    details?: Record<string, string>;
  }) => {
    if (!user || user.role !== 'student') return;

    const newAchievement: Achievement = {
      id: `ach_${Date.now()}`,
      studentId: user.id,
      studentName: user.name,
      studentRegNo: user.regNo || 'AP21110010245',
      department: user.department || 'Computer Science & Engineering',
      status: 'pending',
      fileUrl: '#',
      ...achievementData
    };

    setAchievements(prev => [newAchievement, ...prev]);
    addAuditLog(`Uploaded new ${achievementData.category}: "${achievementData.title}"`);

    // Notify Faculty
    const newNotification: Notification = {
      id: `not_${Date.now()}`,
      recipientRole: 'faculty',
      title: 'New Achievement Uploaded',
      message: `${user.name} (${user.regNo}) uploaded a new ${achievementData.category} mapping to ${achievementData.goMapping.join(', ')}.`,
      timestamp: new Date().toISOString(),
      isRead: false,
      category: 'verification'
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const verifyAchievement = (id: string, action: 'verified' | 'rejected', comments?: string) => {
    if (!user || (user.role !== 'faculty' && user.role !== 'hod')) return;

    setAchievements(prev => prev.map(ach => {
      if (ach.id === id) {
        addAuditLog(`${action === 'verified' ? 'Approved' : 'Rejected'} achievement "${ach.title}" for student ${ach.studentName}`);

        const newNotification: Notification = {
          id: `not_${Date.now()}`,
          recipientRole: 'student',
          recipientId: ach.studentId,
          title: action === 'verified' ? 'Achievement Verified' : 'Achievement Action Needed',
          message: action === 'verified' 
            ? `Your ${ach.category} "${ach.title}" has been verified by ${user.name}.`
            : `Your ${ach.category} "${ach.title}" was returned by ${user.name}. Correction: ${comments || 'Check comments.'}`,
          timestamp: new Date().toISOString(),
          isRead: false,
          category: 'verification'
        };
        setNotifications(prev => [newNotification, ...prev]);

        return {
          ...ach,
          status: action,
          verificationDate: new Date().toISOString().split('T')[0],
          verifiedBy: user.name,
          comments: comments || ''
        };
      }
      return ach;
    }));

    if (action === 'verified') {
      const ach = achievements.find(a => a.id === id);
      if (ach) {
        const studentDeptCode = ach.department.includes('Electronics') ? 'ECE' : ach.department.includes('Mechanical') ? 'ME' : 'CSE';
        
        setDepartments(prevDepts => prevDepts.map(dept => {
          if (dept.code === studentDeptCode) {
            const newAttainment = Math.min(95, parseFloat((dept.avgAttainment + 0.2).toFixed(1)));
            return { ...dept, avgAttainment: newAttainment };
          }
          return dept;
        }));

        setOutcomes(prevOutcomes => prevOutcomes.map(outcome => {
          if (ach.goMapping.includes(outcome.code)) {
            const key = studentDeptCode === 'CSE' ? 'attainmentCSE' : studentDeptCode === 'ECE' ? 'attainmentECE' : 'attainmentME';
            return {
              ...outcome,
              [key]: Math.min(98, outcome[key] + 1)
            };
          }
          return outcome;
        }));
      }
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(not => not.id === id ? { ...not, isRead: true } : not));
  };

  const clearNotifications = () => {
    setNotifications(prev => prev.map(not => ({ ...not, isRead: true })));
  };

  // CRUD Users
  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      id: `usr_${userData.role}_${Date.now()}`,
      phone: '+91 98765 43210',
      program: userData.role === 'student' ? 'Bachelor of Technology (B.Tech)' : undefined,
      gradYear: userData.role === 'student' ? '2026' : undefined,
      phoneVerified: true,
      emailVerified: true,
      ...userData
    };
    setUsers(prev => [...prev, newUser]);
    addAuditLog(`Created user account: ${userData.name} (${userData.role})`);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    addAuditLog(`Updated user account ID: ${id}`);
    
    // If the active user profile is updated by admin, synchronize.
    if (user && user.id === id) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteUser = (id: string) => {
    const targetUser = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    addAuditLog(`Deleted user account: ${targetUser?.name || id}`);
  };

  // Adjust outcome benchmarks
  const updateOutcomeThreshold = (code: string, threshold: number) => {
    setOutcomes(prev => prev.map(o => o.code === code ? { ...o, threshold } : o));
    addAuditLog(`Modified threshold for Outcome ${code} to ${threshold}%`);
  };

  // Adjust departments
  const updateDepartment = (id: string, updates: Partial<Department>) => {
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    addAuditLog(`Updated department details for Department ID: ${id}`);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      updateUserProfile,
      changePassword,
      triggerPasswordRecovery,
      verifyEmailCode,
      verifyPhoneOTP,
      achievements,
      addAchievement,
      verifyAchievement,
      notifications,
      markNotificationAsRead,
      clearNotifications,
      users,
      addUser,
      updateUser,
      deleteUser,
      outcomes,
      updateOutcomeThreshold,
      departments,
      updateDepartment,
      auditLogs,
      addAuditLog
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
