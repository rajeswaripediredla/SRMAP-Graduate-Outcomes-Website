import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Achievement } from '../utils/mockData';
import { Button } from '../components/common/Button';
import { TextArea } from '../components/common/Input';
import { StatusBadge, CategoryBadge, GOBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { StatsDetailDrawer } from '../components/common/StatsDetailDrawer';
import { GOProgressBars } from '../components/common/GOProgressBars';
import { mockGraduateOutcomes } from '../utils/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, XCircle, Clock, FileText, Search, UserCheck,
  Users, Eye, ChevronRight, Activity, BarChart3, TrendingUp, Award
} from 'lucide-react';

interface FacultyDashboardProps {
  defaultTab: 'overview' | 'queue' | 'history';
}

type DrawerType = 'pending' | 'verified' | 'rejected' | 'all' | null;

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ defaultTab }) => {
  const { user, achievements, verifyAchievement, users } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'queue' | 'history'>(defaultTab);
  React.useEffect(() => { setActiveTab(defaultTab); }, [defaultTab]);

  const [selectedAch, setSelectedAch] = useState<Achievement | null>(null);
  const [rejectComment, setRejectComment] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [drawerType, setDrawerType] = useState<DrawerType>(null);
  const [searchQ, setSearchQ] = useState('');

  const facultyDept = user?.department || 'Computer Science & Engineering';
  const deptAchievements = achievements.filter(a => a.department === facultyDept);
  const pendingQueue = deptAchievements.filter(a => a.status === 'pending');
  const actionHistory = deptAchievements.filter(a => a.status !== 'pending');
  const verifiedCount = deptAchievements.filter(a => a.status === 'verified').length;
  const rejectedCount = deptAchievements.filter(a => a.status === 'rejected').length;

  const handleApprove = (id: string) => {
    verifyAchievement(id, 'verified');
    if (selectedAch?.id === id) setSelectedAch(null);
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAch || !rejectComment.trim()) return;
    verifyAchievement(selectedAch.id, 'rejected', rejectComment);
    setSelectedAch(null);
    setRejectComment('');
    setShowRejectInput(false);
  };

  // Student monitoring
  const studentsList = users.filter(u => u.role === 'student' && u.department === facultyDept);
  const studentProgressData = studentsList.map(s => {
    const achs = achievements.filter(a => a.studentId === s.id);
    return { ...s, total: achs.length, verified: achs.filter(a => a.status === 'verified').length, pending: achs.filter(a => a.status === 'pending').length };
  });

  // GO scores for department
  const goScores = mockGraduateOutcomes.map(go => ({
    code: go.code,
    title: go.title.split(':')[0].trim(),
    score: go.attainmentCSE,
    threshold: go.threshold,
  }));

  const filteredQueue = pendingQueue.filter(a =>
    !searchQ || a.studentName.toLowerCase().includes(searchQ.toLowerCase()) ||
    a.title.toLowerCase().includes(searchQ.toLowerCase()) ||
    a.studentRegNo.toLowerCase().includes(searchQ.toLowerCase())
  );

  const drawerConfig: Record<NonNullable<DrawerType>, { title: string; subtitle: string; status?: 'pending' | 'verified' | 'rejected' }> = {
    all:      { title: 'All Department Records', subtitle: `All submissions from ${facultyDept}` },
    pending:  { title: 'Pending Verification Queue', subtitle: 'Awaiting your review and approval', status: 'pending' },
    verified: { title: 'Verified Achievements', subtitle: 'Documents you have approved', status: 'verified' },
    rejected: { title: 'Returned / Rejected', subtitle: 'Documents returned for revision', status: 'rejected' },
  };

  const StatCard: React.FC<{
    label: string; value: number; icon: React.ReactNode;
    color: string; bgColor: string; borderColor: string; type: DrawerType;
  }> = ({ label, value, icon, color, bgColor, borderColor, type }) => (
    <motion.button
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setDrawerType(type)}
      className="p-4 bg-white rounded-2xl border text-left w-full cursor-pointer transition-all duration-200 hover:shadow-lg group"
      style={{ borderColor }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bgColor }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <ChevronRight size={14} className="text-[#CCBEB1] group-hover:text-[#997E67] transition-colors mt-1" />
      </div>
      <p className="text-2xl font-extrabold font-heading" style={{ color }}>{value}</p>
      <p className="text-xs font-semibold text-[#6B7280] mt-0.5">{label}</p>
    </motion.button>
  );

  const breadcrumbItems = [
    { label: 'Faculty', path: '/faculty/dashboard' },
    { label: activeTab === 'overview' ? 'Dashboard' : activeTab === 'queue' ? 'Verification Queue' : 'History' }
  ];

  return (
    <div className="p-6">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[#2F2A26]">Faculty Dashboard</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">{user?.name} · {facultyDept}</p>
        </div>
        <div className="flex items-center space-x-2">
          {pendingQueue.length > 0 && (
            <span className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-bold">
              <Clock size={13} /><span>{pendingQueue.length} pending review</span>
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-[#FAF8F5] border border-[#CCBEB1]/20 rounded-xl p-1 mb-6 w-fit">
        {([
          { id: 'overview', label: 'Overview', icon: <Activity size={14} /> },
          { id: 'queue', label: 'Pending Queue', icon: <Clock size={14} /> },
          { id: 'history', label: 'History', icon: <BarChart3 size={14} /> },
        ] as { id: typeof activeTab; label: string; icon: React.ReactNode }[]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-[#664930] shadow-sm border border-[#CCBEB1]/20'
                : 'text-[#6B7280] hover:text-[#2F2A26]'
            }`}
          >
            {tab.icon}<span>{tab.label}</span>
            {tab.id === 'queue' && pendingQueue.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-extrabold flex items-center justify-center">{pendingQueue.length}</span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard label="Total Submissions" value={deptAchievements.length} icon={<FileText size={20} />} color="#664930" bgColor="#FFDBBB50" borderColor="#FFDBBB" type="all" />
              <StatCard label="Pending Review" value={pendingQueue.length} icon={<Clock size={20} />} color="#D97706" bgColor="#FEFAF2" borderColor="#F59E0B40" type="pending" />
              <StatCard label="Verified" value={verifiedCount} icon={<CheckCircle size={20} />} color="#059669" bgColor="#EFFAF5" borderColor="#10B98140" type="verified" />
              <StatCard label="Returned" value={rejectedCount} icon={<XCircle size={20} />} color="#DC2626" bgColor="#FDF4F4" borderColor="#EF444440" type="rejected" />
            </div>

            {/* GO Attainment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
              <div className="bg-white rounded-2xl border border-[#CCBEB1]/20 shadow-sm p-5">
                <GOProgressBars scores={goScores} title={`${facultyDept.split(' ')[0]} GO Attainment`} />
              </div>

              {/* Student monitoring */}
              <div className="bg-white rounded-2xl border border-[#CCBEB1]/20 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-extrabold font-heading text-[#2F2A26]">Student Monitor</h2>
                  <span className="text-[10px] font-semibold text-[#6B7280] bg-[#FAF8F5] px-2 py-1 rounded-lg">{studentsList.length} students</span>
                </div>
                {studentProgressData.length === 0 ? (
                  <EmptyState icon={<Users size={24} />} title="No students found" description="No students assigned to your department yet." />
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {studentProgressData.map(s => (
                      <div key={s.id} className="p-2.5 rounded-xl border border-[#CCBEB1]/20 bg-[#FAF8F5]">
                        <div className="flex items-center justify-between mb-1.5">
                          <div>
                            <p className="text-xs font-bold text-[#2F2A26]">{s.name}</p>
                            <p className="text-[10px] text-[#6B7280]">{s.regNo}</p>
                          </div>
                          <div className="flex space-x-2 text-[10px] font-semibold">
                            <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{s.verified}✓</span>
                            <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">{s.pending}⏳</span>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-[#CCBEB1]/20 rounded-full">
                          <div className="h-full bg-[#664930] rounded-full transition-all" style={{ width: `${s.total > 0 ? (s.verified / s.total) * 100 : 0}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* QUEUE */}
        {activeTab === 'queue' && (
          <motion.div key="queue" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white rounded-2xl border border-[#CCBEB1]/20 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-extrabold font-heading text-[#2F2A26]">Pending Verification Queue</h2>
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#CCBEB1]" />
                  <input
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    placeholder="Search..."
                    className="pl-8 pr-3 py-2 text-xs border border-[#CCBEB1]/30 rounded-xl bg-[#FAF8F5] focus:outline-none focus:border-[#997E67]"
                  />
                </div>
              </div>

              {filteredQueue.length === 0 ? (
                <EmptyState
                  icon={<CheckCircle size={28} />}
                  title={searchQ ? 'No results found' : 'Queue is clear!'}
                  description={searchQ ? 'Try different search terms.' : 'All submitted achievements have been reviewed. Great work!'}
                />
              ) : (
                <div className="space-y-3">
                  {filteredQueue.map(ach => (
                    <motion.div
                      key={ach.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl border border-[#CCBEB1]/20 hover:border-amber-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#2F2A26]">{ach.title}</p>
                          <p className="text-xs text-[#6B7280] mt-0.5">{ach.studentName} · {ach.studentRegNo}</p>
                          <p className="text-xs text-[#997E67] mt-0.5">{ach.issuer} · {new Date(ach.date).toLocaleDateString('en-IN')}</p>
                        </div>
                        <CategoryBadge category={ach.category} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-1">
                          {ach.goMapping.map(go => <GOBadge key={go} code={go} showTooltip={false} />)}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedAch(ach)}
                            className="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#CCBEB1]/30 text-[#997E67] hover:bg-[#FFDBBB]/30 transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleApprove(ach.id)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors cursor-pointer"
                          >
                            <CheckCircle size={13} /><span>Approve</span>
                          </button>
                          <button
                            onClick={() => { setSelectedAch(ach); setShowRejectInput(true); }}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer"
                          >
                            <XCircle size={13} /><span>Return</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* HISTORY */}
        {activeTab === 'history' && (
          <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white rounded-2xl border border-[#CCBEB1]/20 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-extrabold font-heading text-[#2F2A26]">Verification History</h2>
                <button onClick={() => setDrawerType('all')} className="text-xs font-semibold text-[#664930] hover:underline flex items-center space-x-1 cursor-pointer">
                  <span>Open in drawer</span><ChevronRight size={12} />
                </button>
              </div>
              {actionHistory.length === 0 ? (
                <EmptyState icon={<FileText size={28} />} title="No history yet" description="Verification actions will appear here once you approve or return submissions." />
              ) : (
                <div className="space-y-3">
                  {actionHistory.slice(0, 10).map(ach => (
                    <div key={ach.id} className="flex items-center justify-between p-3 rounded-xl border border-[#CCBEB1]/15 bg-[#FAF8F5]">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#2F2A26] truncate">{ach.title}</p>
                        <p className="text-[10px] text-[#6B7280]">{ach.studentName} · {new Date(ach.date).toLocaleDateString('en-IN')}</p>
                      </div>
                      <StatusBadge status={ach.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Detail Drawer */}
      <StatsDetailDrawer
        isOpen={drawerType !== null}
        onClose={() => setDrawerType(null)}
        title={drawerType ? drawerConfig[drawerType].title : ''}
        subtitle={drawerType ? drawerConfig[drawerType].subtitle : ''}
        achievements={deptAchievements}
        filterStatus={drawerType ? (drawerConfig[drawerType].status || null) : null}
        showActions={true}
      />

      {/* Achievement Detail / Reject Modal */}
      <AnimatePresence>
        {selectedAch && (
          <Modal isOpen={!!selectedAch} onClose={() => { setSelectedAch(null); setShowRejectInput(false); }} title="Achievement Details">
            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              <div className="flex items-center justify-between">
                <CategoryBadge category={selectedAch.category} />
                <StatusBadge status={selectedAch.status} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-[#FAF8F5] rounded-lg"><span className="text-[#6B7280]">Student: </span><span className="font-bold text-[#2F2A26]">{selectedAch.studentName}</span></div>
                <div className="p-2.5 bg-[#FAF8F5] rounded-lg"><span className="text-[#6B7280]">Reg No: </span><span className="font-bold text-[#2F2A26]">{selectedAch.studentRegNo}</span></div>
                <div className="p-2.5 bg-[#FAF8F5] rounded-lg"><span className="text-[#6B7280]">Issuer: </span><span className="font-bold text-[#2F2A26]">{selectedAch.issuer}</span></div>
                <div className="p-2.5 bg-[#FAF8F5] rounded-lg"><span className="text-[#6B7280]">Date: </span><span className="font-bold text-[#2F2A26]">{new Date(selectedAch.date).toLocaleDateString('en-IN')}</span></div>
              </div>
              <div className="p-2.5 bg-[#FAF8F5] rounded-lg">
                <p className="text-[10px] text-[#6B7280] font-semibold mb-1.5">GO Mappings</p>
                <div className="flex flex-wrap gap-1.5">{selectedAch.goMapping.map(go => <GOBadge key={go} code={go} />)}</div>
              </div>

              {selectedAch.status === 'pending' && !showRejectInput && (
                <div className="flex space-x-2 pt-2">
                  <Button variant="primary" icon={<CheckCircle size={14} />} className="flex-1" onClick={() => handleApprove(selectedAch.id)}>Approve</Button>
                  <Button variant="danger" icon={<XCircle size={14} />} className="flex-1" onClick={() => setShowRejectInput(true)}>Return</Button>
                </div>
              )}

              {showRejectInput && (
                <form onSubmit={handleReject} className="space-y-3 pt-2">
                  <TextArea label="Rejection Reason (required)" value={rejectComment} onChange={e => setRejectComment(e.target.value)} placeholder="Explain why this is being returned..." rows={3} />
                  <div className="flex space-x-2">
                    <Button type="submit" variant="danger" icon={<XCircle size={14} />} className="flex-1">Confirm Return</Button>
                    <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowRejectInput(false)}>Cancel</Button>
                  </div>
                </form>
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FacultyDashboard;
