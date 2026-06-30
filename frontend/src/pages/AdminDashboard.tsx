import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, UserRole, GraduateOutcome, Department } from '../utils/mockData';
import { Button } from '../components/common/Button';
import { Input, Select } from '../components/common/Input';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { 
  Users, Building2, ShieldCheck, ScrollText, Plus, Edit2, 
  Trash2, FileCheck2, Database, AlertCircle, RefreshCw 
} from 'lucide-react';

interface AdminDashboardProps {
  defaultTab: 'overview' | 'users' | 'outcomes' | 'logs';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ defaultTab }) => {
  const { 
    user, users, addUser, deleteUser, 
    outcomes, updateOutcomeThreshold, 
    departments, updateDepartment,
    auditLogs
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'outcomes' | 'logs'>(defaultTab);

  // Sync tab state when route updates
  React.useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Modal open states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isOutcomeModalOpen, setIsOutcomeModalOpen] = useState(false);

  // Add User Form States
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [userDept, setUserDept] = useState('Computer Science & Engineering');
  const [userRegNo, setUserRegNo] = useState('');
  const [userDesignation, setUserDesignation] = useState('');

  // Outcome Config Form States
  const [selectedOutcomeCode, setSelectedOutcomeCode] = useState('');
  const [outcomeThreshold, setOutcomeThreshold] = useState<number>(75);

  // Calculate global statistics widgets
  const studentCount = users.filter(u => u.role === 'student').length;
  const facultyCount = users.filter(u => u.role === 'faculty').length;
  const totalDepts = departments.length;
  const totalSystemLogs = auditLogs.length;

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    addUser({
      name: userName,
      email: userEmail,
      role: userRole,
      department: userRole !== 'admin' ? userDept : undefined,
      regNo: userRole === 'student' ? userRegNo || `AP211100${Math.floor(Math.random()*800000+100000)}` : undefined,
      designation: userRole === 'faculty' || userRole === 'hod' ? userDesignation || 'Assistant Professor' : undefined,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'
    });

    // Reset fields
    setUserName('');
    setUserEmail('');
    setUserRegNo('');
    setUserDesignation('');
    setIsUserModalOpen(false);
  };

  const handleUpdateOutcome = (e: React.FormEvent) => {
    e.preventDefault();
    updateOutcomeThreshold(selectedOutcomeCode, outcomeThreshold);
    setIsOutcomeModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <h2 className="text-xl font-bold font-heading text-primary-text flex items-center">
            System Administrator Center
          </h2>
          <p className="text-xs text-secondary-text mt-1 font-medium">
            Active Session: <span className="font-bold text-primary-text">{user?.name}</span> • System Integrity: <span className="text-success font-bold">Secured & Encrypted</span>
          </p>
        </div>

        <Button
          variant="outline"
          icon={<Plus size={14} />}
          onClick={() => setIsUserModalOpen(true)}
        >
          Create User Account
        </Button>
      </div>

      {/* Admin metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Registered Students', value: studentCount + 1300, icon: <Users size={20} className="text-mocha" /> },
          { label: 'Faculty Members', value: facultyCount + 80, icon: <ShieldCheck size={20} className="text-taupe" /> },
          { label: 'Total Departments', value: totalDepts, icon: <Building2 size={20} className="text-walnut" /> },
          { label: 'System Action Logs', value: totalSystemLogs, icon: <ScrollText size={20} className="text-pending" /> }
        ].map((w, index) => (
          <div key={index} className="p-4 rounded-xl border border-taupe/20 bg-white shadow-sm flex items-center justify-between text-left">
            <div>
              <p className="text-[10px] text-secondary-text uppercase font-bold tracking-wider">{w.label}</p>
              <p className="text-xl font-bold font-heading text-primary-text mt-1.5">{w.value}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-bg-base border border-taupe/15">
              {w.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Overview Tab (Dashboard) */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Logs Summary */}
          <div className="bg-white p-6 rounded-xl border border-taupe/20 shadow-sm lg:col-span-2 flex flex-col justify-between text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-primary-text flex items-center">
                  <Database size={16} className="text-walnut mr-2" /> Live Security Audit Logs
                </h3>
                <p className="text-[10px] text-secondary-text mt-0.5">Real-time tracking of portal operations and credentials authentication.</p>
              </div>
              <button 
                onClick={() => setActiveTab('logs')}
                className="text-xs text-walnut font-bold hover:underline cursor-pointer"
              >
                Inspect All Logs
              </button>
            </div>

            <div className="mt-4 flex-1 space-y-3.5">
              {auditLogs.slice(0, 4).map((log) => {
                const date = new Date(log.timestamp);
                const formatTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                return (
                  <div key={log.id} className="flex items-start space-x-3 p-2 hover:bg-bg-base/40 rounded-lg transition-colors text-xs border border-transparent hover:border-taupe/15">
                    <div className="p-2 rounded-lg bg-cream/30 text-walnut shrink-0">
                      <ScrollText size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-primary-text">{log.action}</p>
                      <p className="text-[10px] text-secondary-text mt-0.5">
                        By: <span className="font-bold">{log.userName}</span> ({log.role}) • IP: {log.ipAddress}
                      </p>
                    </div>
                    <div className="text-[9px] text-secondary-text whitespace-nowrap self-center font-bold">
                      {formatTime}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Configuration Parameters summary */}
          <div className="bg-white p-6 rounded-xl border border-taupe/20 shadow-sm text-left flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-primary-text">NBA Attainment Thresholds</h3>
              <p className="text-[10px] text-secondary-text mt-0.5">Current target thresholds set for outcome mapping metrics.</p>
            </div>

            <div className="mt-4 flex-1 space-y-4">
              {outcomes.slice(0, 4).map((o) => (
                <div key={o.code} className="flex items-center justify-between">
                  <div className="min-w-0 text-left">
                    <p className="text-xs font-bold text-primary-text">{o.code}</p>
                    <p className="text-[9px] text-secondary-text truncate max-w-[150px]">{o.title}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-walnut">{o.threshold}%</span>
                    <button
                      onClick={() => {
                        setSelectedOutcomeCode(o.code);
                        setOutcomeThreshold(o.threshold);
                        setIsOutcomeModalOpen(true);
                      }}
                      className="p-1 rounded hover:bg-taupe/15 text-mocha cursor-pointer"
                      title="Adjust threshold"
                    >
                      <Edit2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab (User Directory CRUD) */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-xl border border-taupe/20 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="text-left">
              <h3 className="text-sm font-bold text-primary-text">System Users Directory</h3>
              <p className="text-[10px] text-secondary-text mt-0.5">Manage and audit student, faculty, HOD, and admin credentials.</p>
            </div>
            <Button
              variant="outline"
              icon={<Plus size={12} />}
              onClick={() => setIsUserModalOpen(true)}
            >
              Add User
            </Button>
          </div>

          <Table
            data={users}
            searchPlaceholder="Search users by name/email..."
            searchField={(row) => row.name + ' ' + row.email}
            filterField={(row) => row.role}
            filterOptions={[
              { value: 'student', label: 'Students' },
              { value: 'faculty', label: 'Faculty' },
              { value: 'hod', label: 'HODs' },
              { value: 'admin', label: 'Administrators' }
            ]}
            columns={[
              {
                header: 'User details',
                accessor: (row) => (
                  <div className="flex items-center space-x-2.5 text-left">
                    <img
                      src={row.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'}
                      alt={row.name}
                      className="w-8.5 h-8.5 rounded-full object-cover border border-taupe/30"
                    />
                    <div>
                      <p className="font-bold text-primary-text">{row.name}</p>
                      <p className="text-[10px] text-secondary-text">{row.email}</p>
                    </div>
                  </div>
                )
              },
              {
                header: 'Role Class',
                accessor: (row) => (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-bg-base border border-taupe/30 text-mocha capitalize">
                    {row.role}
                  </span>
                )
              },
              {
                header: 'Department Branch',
                accessor: (row) => <span className="text-xs text-secondary-text font-medium">{row.department || 'All / Global'}</span>
              },
              {
                header: 'Index/Register ID',
                accessor: (row) => <span className="text-xs text-primary-text font-bold">{row.regNo || row.designation || 'System Admin'}</span>
              },
              {
                header: 'Actions',
                accessor: (row) => (
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete user ${row.name}?`)) {
                        deleteUser(row.id);
                      }
                    }}
                    className="p-1.5 rounded hover:bg-rejected-light text-rejected transition-colors cursor-pointer"
                    title="Delete user"
                  >
                    <Trash2 size={14} />
                  </button>
                )
              }
            ]}
          />
        </div>
      )}

      {/* GO Config Tab (Adjust thresholds) */}
      {activeTab === 'outcomes' && (
        <div className="bg-white p-6 rounded-xl border border-taupe/20 shadow-sm text-left">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-primary-text">Graduate Outcomes (GO) Configurations</h3>
            <p className="text-[10px] text-secondary-text mt-0.5">Manage parameters and outcome benchmarks in compliance with NBA requirements.</p>
          </div>

          <div className="space-y-4">
            {outcomes.map((o) => (
              <div key={o.code} className="p-4 rounded-lg bg-[#FAF8F5] border border-taupe/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1 max-w-2xl text-left">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-cream text-walnut font-bold text-xs tracking-wider border border-walnut/20">
                      {o.code}
                    </span>
                    <h4 className="text-xs font-bold text-primary-text">{o.title}</h4>
                  </div>
                  <p className="text-[11px] text-secondary-text leading-relaxed mt-1.5">{o.description}</p>
                </div>

                <div className="flex items-center space-x-6 shrink-0 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-left md:text-right">
                    <span className="text-[9px] uppercase font-bold text-secondary-text">Target Threshold</span>
                    <p className="text-sm font-bold text-walnut">{o.threshold}%</p>
                  </div>
                  
                  <Button
                    variant="outline"
                    icon={<Edit2 size={12} />}
                    onClick={() => {
                      setSelectedOutcomeCode(o.code);
                      setOutcomeThreshold(o.threshold);
                      setIsOutcomeModalOpen(true);
                    }}
                  >
                    Adjust
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white p-6 rounded-xl border border-taupe/20 shadow-sm">
          <div className="text-left mb-6">
            <h3 className="text-sm font-bold text-primary-text">Live Audit Trail</h3>
            <p className="text-[10px] text-secondary-text mt-0.5">Read-only digital audit logs mapping system operations for compliance inspections.</p>
          </div>

          <Table
            data={auditLogs}
            searchPlaceholder="Search audit events..."
            searchField={(row) => row.action + ' ' + row.userName}
            columns={[
              {
                header: 'Timestamp',
                accessor: (row) => (
                  <span className="text-xs text-secondary-text font-medium">
                    {new Date(row.timestamp).toLocaleString()}
                  </span>
                )
              },
              {
                header: 'User identity',
                accessor: (row) => (
                  <div className="text-left">
                    <p className="font-bold text-primary-text">{row.userName}</p>
                    <p className="text-[10px] text-secondary-text uppercase tracking-wide font-medium">{row.role}</p>
                  </div>
                )
              },
              {
                header: 'Action Executed',
                accessor: (row) => (
                  <span className="text-xs text-primary-text font-semibold">{row.action}</span>
                )
              },
              {
                header: 'Network IP Address',
                accessor: (row) => (
                  <code className="text-xs bg-[#FAF8F5] border border-taupe/20 px-2 py-0.5 rounded text-primary-text">
                    {row.ipAddress}
                  </code>
                )
              }
            ]}
          />
        </div>
      )}

      {/* ======================================= */}
      {/* MODAL: CREATE USER ACCOUNT */}
      {/* ======================================= */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="Create New User Account"
      >
        <form onSubmit={handleCreateUser} className="space-y-4 text-left">
          <Input
            label="Full Name"
            placeholder="E.g., Dr. Ramesh K."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />

          <Input
            label="Institutional Email Address"
            type="email"
            placeholder="email@srmap.edu.in"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="User Role Class"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              options={[
                { value: 'student', label: 'Student' },
                { value: 'faculty', label: 'Faculty Verifier' },
                { value: 'hod', label: 'Head of Department' },
                { value: 'admin', label: 'System Administrator' }
              ]}
            />
            
            <Select
              label="Department Branch"
              value={userDept}
              onChange={(e) => setUserDept(e.target.value)}
              disabled={userRole === 'admin'}
              options={[
                { value: 'Computer Science & Engineering', label: 'CSE' },
                { value: 'Electronics & Communication Engineering', label: 'ECE' },
                { value: 'Mechanical Engineering', label: 'ME' }
              ]}
            />
          </div>

          {userRole === 'student' && (
            <Input
              label="Register ID Number"
              placeholder="E.g., AP21110010245"
              value={userRegNo}
              onChange={(e) => setUserRegNo(e.target.value)}
            />
          )}

          {(userRole === 'faculty' || userRole === 'hod') && (
            <Input
              label="Academic Designation"
              placeholder="E.g., Assistant Professor / HOD"
              value={userDesignation}
              onChange={(e) => setUserDesignation(e.target.value)}
            />
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t border-taupe/15">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUserModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Account</Button>
          </div>
        </form>
      </Modal>

      {/* ======================================= */}
      {/* MODAL: EDIT OUTCOME TARGET THRESHOLD */}
      {/* ======================================= */}
      <Modal
        isOpen={isOutcomeModalOpen}
        onClose={() => setIsOutcomeModalOpen(false)}
        title={`Adjust Target Attainment - ${selectedOutcomeCode}`}
      >
        <form onSubmit={handleUpdateOutcome} className="space-y-4 text-left">
          <p className="text-xs text-secondary-text">
            Adjusting the target threshold updates the benchmark attainment criteria. Outcomes charts will adjust across HOD dashboards.
          </p>

          <Input
            label="Target Threshold Percentage (%)"
            type="number"
            min={50}
            max={100}
            value={outcomeThreshold}
            onChange={(e) => setOutcomeThreshold(parseInt(e.target.value) || 75)}
            required
          />

          <div className="flex justify-end space-x-2 pt-4 border-t border-taupe/15">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOutcomeModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Confirm Adjust</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
