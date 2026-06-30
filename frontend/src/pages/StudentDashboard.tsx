import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Achievement, AchievementCategory, mockGraduateOutcomes } from '../utils/mockData';
import { Button } from '../components/common/Button';
import { Input, Select, TextArea } from '../components/common/Input';
import { FileUpload } from '../components/common/FileUpload';
import { StatusBadge, CategoryBadge, GOBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { StatsDetailDrawer } from '../components/common/StatsDetailDrawer';
import { GOProgressBars, GORadialGrid } from '../components/common/GOProgressBars';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Award, AlertCircle, Plus, CheckCircle, Clock, XCircle,
  UploadCloud, Activity, TrendingUp, BarChart3, ChevronRight
} from 'lucide-react';

interface StudentDashboardProps {
  defaultTab: 'overview' | 'achievements' | 'attainment';
}

type DrawerType = 'all' | 'pending' | 'verified' | 'rejected' | 'certification' | 'internship' | 'placement' | 'publication' | 'higher_studies' | null;

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ defaultTab }) => {
  const { user, achievements, addAchievement } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'attainment'>(defaultTab);
  React.useEffect(() => { setActiveTab(defaultTab); }, [defaultTab]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAch, setSelectedAch] = useState<Achievement | null>(null);
  const [drawerType, setDrawerType] = useState<DrawerType>(null);

  // Form states
  const [category, setCategory] = useState<AchievementCategory>('certification');
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [goMapping, setGoMapping] = useState<string[]>([]);
  const [fileData, setFileData] = useState<{ name: string; size: string } | null>(null);
  const [extraField1, setExtraField1] = useState('');
  const [extraField2, setExtraField2] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const studentAchievements = achievements.filter(a => a.studentId === user?.id);
  const totalCount = studentAchievements.length;
  const verifiedCount = studentAchievements.filter(a => a.status === 'verified').length;
  const pendingCount = studentAchievements.filter(a => a.status === 'pending').length;
  const rejectedCount = studentAchievements.filter(a => a.status === 'rejected').length;
  const certCount = studentAchievements.filter(a => a.category === 'certification').length;
  const internCount = studentAchievements.filter(a => a.category === 'internship').length;
  const placementCount = studentAchievements.filter(a => a.category === 'placement').length;

  // GO scores
  const goCoverage: Record<string, number> = { 'GO-1': 0, 'GO-2': 0, 'GO-3': 0, 'GO-4': 0, 'GO-5': 0, 'GO-6': 0 };
  studentAchievements.filter(a => a.status === 'verified').forEach(a => {
    a.goMapping.forEach(go => { if (go in goCoverage) goCoverage[go] = Math.min(100, goCoverage[go] + 20); });
  });

  const goScores = mockGraduateOutcomes.map(go => ({
    code: go.code,
    title: go.title.split(':')[0].trim(),
    score: goCoverage[go.code] || 0,
    threshold: go.threshold,
  }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!issuer.trim()) e.issuer = 'Issuer is required';
    if (!date) e.date = 'Date is required';
    if (goMapping.length === 0) e.goMapping = 'Select at least one GO';
    if (!fileData) e.file = 'Please upload a document';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const details: Record<string, string> = {};
    if (category === 'placement' && extraField1) details['Package (LPA)'] = extraField1;
    if (category === 'placement' && extraField2) details['Designation'] = extraField2;
    if (category === 'publication' && extraField1) details['Journal/Conference'] = extraField1;
    if (category === 'publication' && extraField2) details['Authors'] = extraField2;
    if (category === 'internship' && extraField1) details['Duration'] = extraField1;
    if (category === 'internship' && extraField2) details['Stipend'] = extraField2;
    if (category === 'higher_studies' && extraField1) details['University'] = extraField1;
    if (category === 'higher_studies' && extraField2) details['Program Admitted'] = extraField2;
    addAchievement({ category, title, issuer, date, fileName: fileData!.name, fileSize: fileData!.size, goMapping, details });
    setIsModalOpen(false);
    setTitle(''); setIssuer(''); setDate(''); setGoMapping([]); setFileData(null); setExtraField1(''); setExtraField2('');
    setErrors({});
  };

  const toggleGO = (go: string) => setGoMapping(prev => prev.includes(go) ? prev.filter(g => g !== go) : [...prev, go]);

  const drawerConfig: Record<NonNullable<DrawerType>, { title: string; subtitle: string; status?: 'pending' | 'verified' | 'rejected'; category?: string }> = {
    all:          { title: 'All Submissions', subtitle: 'Complete list of your achievement submissions' },
    pending:      { title: 'Pending Documents', subtitle: 'Awaiting faculty verification', status: 'pending' },
    verified:     { title: 'Verified Documents', subtitle: 'Faculty-approved achievements', status: 'verified' },
    rejected:     { title: 'Returned / Rejected', subtitle: 'Needs revision or re-submission', status: 'rejected' },
    certification:{ title: 'Certifications', subtitle: 'Professional & academic certifications', category: 'certification' },
    internship:   { title: 'Internships', subtitle: 'Internship records and offer letters', category: 'internship' },
    placement:    { title: 'Placements', subtitle: 'Campus placement & offer records', category: 'placement' },
    publication:  { title: 'Publications', subtitle: 'Research papers and journals', category: 'publication' },
    higher_studies:{ title: 'Higher Studies', subtitle: 'University admissions and accepts', category: 'higher_studies' },
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
    { label: 'Student', path: '/student/dashboard' },
    { label: activeTab === 'overview' ? 'Dashboard' : activeTab === 'achievements' ? 'My Submissions' : 'GO Attainment' }
  ];

  return (
    <div className="p-6">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[#2F2A26]">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-[#6B7280] mt-0.5">{user?.regNo} · {user?.department}</p>
        </div>
        <Button icon={<Plus size={15} />} onClick={() => setIsModalOpen(true)}>
          Submit Achievement
        </Button>
      </div>

      {/* Tab Nav */}
      <div className="flex space-x-1 bg-[#FAF8F5] border border-[#CCBEB1]/20 rounded-xl p-1 mb-6 w-fit">
        {([
          { id: 'overview', label: 'Overview', icon: <Activity size={14} /> },
          { id: 'achievements', label: 'Submissions', icon: <Award size={14} /> },
          { id: 'attainment', label: 'GO Attainment', icon: <TrendingUp size={14} /> },
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
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard label="Total Submissions" value={totalCount} icon={<FileText size={20} />} color="#664930" bgColor="#FFDBBB50" borderColor="#FFDBBB" type="all" />
              <StatCard label="Pending Review" value={pendingCount} icon={<Clock size={20} />} color="#D97706" bgColor="#FEFAF2" borderColor="#F59E0B40" type="pending" />
              <StatCard label="Verified" value={verifiedCount} icon={<CheckCircle size={20} />} color="#059669" bgColor="#EFFAF5" borderColor="#10B98140" type="verified" />
              <StatCard label="Returned" value={rejectedCount} icon={<XCircle size={20} />} color="#DC2626" bgColor="#FDF4F4" borderColor="#EF444440" type="rejected" />
            </div>

            {/* Category cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatCard label="Certifications" value={certCount} icon={<Award size={20} />} color="#4F46E5" bgColor="#EEF2FF" borderColor="#4F46E540" type="certification" />
              <StatCard label="Internships" value={internCount} icon={<Activity size={20} />} color="#0891B2" bgColor="#F0F9FF" borderColor="#0891B240" type="internship" />
              <StatCard label="Placements" value={placementCount} icon={<TrendingUp size={20} />} color="#059669" bgColor="#EFFAF5" borderColor="#10B98140" type="placement" />
            </div>

            {/* Recent Submissions */}
            <div className="bg-white rounded-2xl border border-[#CCBEB1]/20 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-extrabold font-heading text-[#2F2A26]">Recent Submissions</h2>
                <button onClick={() => setDrawerType('all')} className="text-xs font-semibold text-[#664930] hover:underline flex items-center space-x-1 cursor-pointer">
                  <span>View all</span><ChevronRight size={12} />
                </button>
              </div>
              {studentAchievements.length === 0 ? (
                <EmptyState
                  icon={<UploadCloud size={28} />}
                  title="No submissions yet"
                  description="Click 'Submit Achievement' to upload your first certification, internship, or placement record."
                  action={<Button icon={<Plus size={14} />} onClick={() => setIsModalOpen(true)}>Submit Achievement</Button>}
                />
              ) : (
                <div className="space-y-3">
                  {studentAchievements.slice(0, 5).map(ach => (
                    <div
                      key={ach.id}
                      onClick={() => { setDrawerType('all'); }}
                      className="flex items-center justify-between p-3 rounded-xl border border-[#CCBEB1]/15 hover:border-[#997E67]/30 hover:bg-[#FAF8F5] transition-all cursor-pointer group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#2F2A26] truncate group-hover:text-[#664930] transition-colors">{ach.title}</p>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <CategoryBadge category={ach.category} />
                          <span className="text-[10px] text-[#6B7280]">{new Date(ach.date).toLocaleDateString('en-IN')}</span>
                        </div>
                      </div>
                      <StatusBadge status={ach.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ACHIEVEMENTS TAB */}
        {activeTab === 'achievements' && (
          <motion.div key="achievements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white rounded-2xl border border-[#CCBEB1]/20 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-extrabold font-heading text-[#2F2A26]">All Submissions</h2>
                <Button icon={<Plus size={14} />} onClick={() => setIsModalOpen(true)} className="text-xs py-2">New Submission</Button>
              </div>
              {studentAchievements.length === 0 ? (
                <EmptyState
                  icon={<Award size={28} />}
                  title="No achievements submitted"
                  description="Start building your portfolio by submitting certifications, internships, and placements."
                  action={<Button icon={<Plus size={14} />} onClick={() => setIsModalOpen(true)}>Submit Your First Achievement</Button>}
                />
              ) : (
                <div className="space-y-3">
                  {studentAchievements.map(ach => (
                    <motion.div
                      key={ach.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => { setSelectedAch(ach); }}
                      className="p-4 rounded-xl border border-[#CCBEB1]/20 hover:border-[#997E67]/30 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#2F2A26] group-hover:text-[#664930] transition-colors">{ach.title}</p>
                          <p className="text-xs text-[#6B7280] mt-0.5">{ach.issuer} · {new Date(ach.date).toLocaleDateString('en-IN')}</p>
                        </div>
                        <StatusBadge status={ach.status} />
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <CategoryBadge category={ach.category} />
                        <div className="flex space-x-1">
                          {ach.goMapping.map(go => <GOBadge key={go} code={go} showTooltip={false} />)}
                        </div>
                      </div>
                      {ach.comments && (
                        <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-100 text-[10px] text-red-600">
                          <span className="font-semibold">Rejection reason: </span>{ach.comments}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ATTAINMENT TAB */}
        {activeTab === 'attainment' && (
          <motion.div key="attainment" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Main progress bars */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-[#CCBEB1]/20 shadow-sm p-5">
                <GOProgressBars scores={goScores} title="Your GO Attainment Progress" />
                {verifiedCount === 0 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-medium">
                    <AlertCircle size={12} className="inline mr-1.5" />
                    Scores update automatically once faculty verifies your submissions.
                  </div>
                )}
              </div>
              {/* Radial grid */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#CCBEB1]/20 shadow-sm p-5">
                <h3 className="text-sm font-extrabold font-heading text-[#2F2A26] mb-4">Outcome Snapshot</h3>
                <GORadialGrid scores={goScores} />
                <div className="mt-4 p-3 bg-[#FAF8F5] rounded-xl border border-[#CCBEB1]/20">
                  <p className="text-[10px] font-semibold text-[#6B7280] mb-1">Overall Attainment</p>
                  <p className="text-2xl font-extrabold font-heading text-[#664930]">
                    {Math.round(Object.values(goCoverage).reduce((a, b) => a + b, 0) / 6)}%
                  </p>
                  <p className="text-[10px] text-[#997E67]">Across all 6 Graduate Outcomes</p>
                </div>
              </div>
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
        achievements={studentAchievements}
        filterStatus={drawerType ? (drawerConfig[drawerType].status || null) : null}
        filterCategory={drawerType ? (drawerConfig[drawerType].category || null) : null}
        showActions={false}
      />

      {/* Submit Achievement Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit New Achievement">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <Select
            label="Achievement Category"
            value={category}
            onChange={e => setCategory(e.target.value as AchievementCategory)}
            options={[
              { value: 'certification', label: 'Professional Certification' },
              { value: 'internship', label: 'Internship' },
              { value: 'placement', label: 'Placement / Job Offer' },
              { value: 'publication', label: 'Research Publication' },
              { value: 'higher_studies', label: 'Higher Studies Admit' },
            ]}
          />
          <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} error={errors.title} placeholder="e.g. AWS Solutions Architect" />
          <Input label="Issuing Organization" value={issuer} onChange={e => setIssuer(e.target.value)} error={errors.issuer} placeholder="e.g. Amazon Web Services" />
          <Input label="Achievement Date" type="date" value={date} onChange={e => setDate(e.target.value)} error={errors.date} />
          {category === 'placement' && (
            <div className="grid grid-cols-2 gap-3">
              <Input label="Package (LPA)" value={extraField1} onChange={e => setExtraField1(e.target.value)} placeholder="e.g. 12.5" />
              <Input label="Designation" value={extraField2} onChange={e => setExtraField2(e.target.value)} placeholder="e.g. SDE" />
            </div>
          )}
          {category === 'publication' && (
            <div className="grid grid-cols-2 gap-3">
              <Input label="Journal/Conference" value={extraField1} onChange={e => setExtraField1(e.target.value)} placeholder="e.g. IEEE ICIT" />
              <Input label="Co-Authors" value={extraField2} onChange={e => setExtraField2(e.target.value)} placeholder="e.g. Prof. Sharma" />
            </div>
          )}
          {category === 'internship' && (
            <div className="grid grid-cols-2 gap-3">
              <Input label="Duration" value={extraField1} onChange={e => setExtraField1(e.target.value)} placeholder="e.g. 2 months" />
              <Input label="Stipend (₹/month)" value={extraField2} onChange={e => setExtraField2(e.target.value)} placeholder="e.g. 15000" />
            </div>
          )}
          {category === 'higher_studies' && (
            <div className="grid grid-cols-2 gap-3">
              <Input label="University" value={extraField1} onChange={e => setExtraField1(e.target.value)} placeholder="e.g. IIT Bombay" />
              <Input label="Program" value={extraField2} onChange={e => setExtraField2(e.target.value)} placeholder="e.g. M.Tech AI" />
            </div>
          )}
          {/* GO Mapping */}
          <div>
            <label className="block text-xs font-semibold text-[#2F2A26] mb-2">Map to Graduate Outcomes</label>
            <div className="flex flex-wrap gap-2">
              {['GO-1','GO-2','GO-3','GO-4','GO-5','GO-6'].map(go => (
                <button
                  key={go} type="button" onClick={() => toggleGO(go)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    goMapping.includes(go)
                      ? 'bg-[#664930] text-white border-[#664930]'
                      : 'border-[#CCBEB1]/40 text-[#6B7280] hover:border-[#997E67]'
                  }`}
                >
                  {go}
                </button>
              ))}
            </div>
            {errors.goMapping && <p className="text-xs text-red-500 mt-1">{errors.goMapping}</p>}
          </div>
          <FileUpload
            label="Upload Document / Certificate"
            onFileSelect={(name, size) => setFileData({ name, size })}
            selectedFile={fileData}
            error={errors.file}
          />
          <div className="flex space-x-3 pt-2 sticky bottom-0 bg-white pb-1">
            <Button type="submit" className="flex-1">Submit for Verification</Button>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>

      {/* Individual record view modal */}
      <AnimatePresence>
        {selectedAch && (
          <Modal isOpen={!!selectedAch} onClose={() => setSelectedAch(null)} title={selectedAch.title}>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div className="flex items-center justify-between">
                <CategoryBadge category={selectedAch.category} />
                <StatusBadge status={selectedAch.status} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-[#FAF8F5] rounded-lg"><span className="text-[#6B7280]">Issuer: </span><span className="font-bold text-[#2F2A26]">{selectedAch.issuer}</span></div>
                <div className="p-2.5 bg-[#FAF8F5] rounded-lg"><span className="text-[#6B7280]">Date: </span><span className="font-bold text-[#2F2A26]">{new Date(selectedAch.date).toLocaleDateString('en-IN')}</span></div>
              </div>
              <div className="p-2.5 bg-[#FAF8F5] rounded-lg">
                <p className="text-[10px] text-[#6B7280] font-semibold mb-1.5">GO Mappings</p>
                <div className="flex flex-wrap gap-1.5">{selectedAch.goMapping.map(go => <GOBadge key={go} code={go} />)}</div>
              </div>
              {selectedAch.details && Object.keys(selectedAch.details).length > 0 && (
                <div className="p-2.5 bg-[#FAF8F5] rounded-lg">
                  <p className="text-[10px] text-[#6B7280] font-semibold mb-1.5">Additional Details</p>
                  {Object.entries(selectedAch.details).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs"><span className="text-[#6B7280]">{k}</span><span className="font-bold text-[#2F2A26]">{v}</span></div>
                  ))}
                </div>
              )}
              {selectedAch.comments && (
                <div className="p-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
                  <span className="font-semibold">Rejection reason: </span>{selectedAch.comments}
                </div>
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentDashboard;
