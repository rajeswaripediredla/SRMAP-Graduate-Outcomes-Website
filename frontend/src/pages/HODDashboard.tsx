import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Table } from '../components/common/Table';
import { Button } from '../components/common/Button';
import { 
  mockGraduateOutcomes, 
  mockDepartments,
  placementStats,
  mockAchievements
} from '../utils/mockData';
import { 
  TrendingUp, Award, Users, FileText, AlertTriangle, 
  BarChart3, Compass, CheckCircle2, FileSpreadsheet, Sparkles
} from 'lucide-react';

interface HODDashboardProps {
  defaultTab: 'overview' | 'analytics' | 'comparison';
}

export const HODDashboard: React.FC<HODDashboardProps> = ({ defaultTab }) => {
  const { user, achievements, users } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'comparison'>(defaultTab);

  // Sync tab state when route changes
  React.useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const hodDept = user?.department || 'Computer Science & Engineering';
  const deptCode = hodDept.includes('Electronics') ? 'ECE' : hodDept.includes('Mechanical') ? 'ME' : 'CSE';

  // Metrics calculation
  const deptStudents = users.filter(u => u.role === 'student' && u.department === hodDept);
  const deptAchs = achievements.filter(a => a.department === hodDept);
  const verifiedCount = deptAchs.filter(a => a.status === 'verified').length;
  
  const selectedDeptObj = mockDepartments.find(d => d.code === deptCode) || mockDepartments[0];
  const avgAttainment = selectedDeptObj.avgAttainment;

  // Chart colors matching Neutral Elegance palette
  const COLORS = ['#664930', '#997E67', '#CCBEB1', '#FFDBBB', '#2F2A26'];

  const customTooltipStyle = {
    contentStyle: { 
      backgroundColor: 'rgba(47, 42, 38, 0.95)', 
      border: 'none', 
      borderRadius: '8px', 
      color: '#FFFFFF',
      fontSize: '11px',
      fontFamily: 'Inter, sans-serif'
    },
    labelStyle: { fontWeight: 'bold', color: '#FFDBBB', marginBottom: '4px' }
  };

  // Compile Early Warning indicators: students who have uploaded <= 1 verified achievements
  const earlyWarnings = deptStudents.map(stud => {
    const studAchs = achievements.filter(a => a.studentId === stud.id && a.status === 'verified');
    return {
      id: stud.id,
      name: stud.name,
      regNo: stud.regNo || 'N/A',
      verifiedCount: studAchs.length,
      status: studAchs.length === 0 ? 'Critical' : 'Warning'
    };
  }).filter(item => item.verifiedCount <= 1);

  // Certifications distribution data
  const certData = [
    { name: 'AWS Cloud', count: 48 },
    { name: 'Google Cloud', count: 32 },
    { name: 'Microsoft Azure', count: 28 },
    { name: 'Oracle Java', count: 18 },
    { name: 'Cisco Networking', count: 14 }
  ];

  // Placements sectors data
  const sectorData = [
    { name: 'Software Product', value: 45 },
    { name: 'Fintech', value: 25 },
    { name: 'Cloud Infrastructure', value: 15 },
    { name: 'Core VLSI/VLSI', value: 10 },
    { name: 'Consulting', value: 5 }
  ];

  // Research outputs trends
  const researchData = [
    { year: '2023', journals: 14, patents: 2 },
    { year: '2024', journals: 19, patents: 4 },
    { year: '2025', journals: 28, patents: 5 },
    { year: '2026', journals: 34, patents: 8 }
  ];

  // Batch comparison data
  const batchData = [
    { batch: 'Class of 2023', attainment: 74 },
    { batch: 'Class of 2024', attainment: 78 },
    { batch: 'Class of 2025', attainment: 80 },
    { batch: 'Class of 2026', attainment: 81.3 }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <h2 className="text-xl font-bold font-heading text-primary-text flex items-center">
            Welcome back, {user?.name}! <Sparkles size={16} className="text-walnut ml-1.5" />
          </h2>
          <p className="text-xs text-secondary-text mt-1 font-medium">
            Designation: <span className="font-bold text-primary-text">{user?.designation}</span> • Department: <span className="font-bold text-primary-text">{hodDept}</span>
          </p>
        </div>

        <Button
          variant="outline"
          icon={<FileSpreadsheet size={14} />}
          onClick={() => {
            alert(`[Mock Export] Generating NBA Graduate Outcome Report for ${hodDept}. File ready: CSE_GO_Attainment_Report_2026.xlsx`);
          }}
        >
          Export Attainment Report
        </Button>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Average Attainment', value: `${avgAttainment}%`, icon: <TrendingUp size={20} className="text-walnut" />, bg: 'bg-[#FAF8F5] border border-walnut/20' },
          { label: 'Enrolled Students', value: selectedDeptObj.studentCount, icon: <Users size={20} className="text-mocha" />, bg: 'bg-white' },
          { label: 'Department Verifiers', value: selectedDeptObj.facultyCount, icon: <Compass size={20} className="text-taupe" />, bg: 'bg-white' },
          { label: 'Verified Achievements', value: verifiedCount, icon: <Award size={20} className="text-success" />, bg: 'bg-white' }
        ].map((w, index) => (
          <div key={index} className={`p-4 rounded-xl border border-taupe/20 shadow-sm flex items-center justify-between text-left ${w.bg}`}>
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart: GO Attainment Trends */}
          <div className="bg-white p-6 rounded-xl border border-taupe/20 shadow-sm lg:col-span-2 flex flex-col justify-between text-left">
            <div>
              <h3 className="text-sm font-bold text-primary-text flex items-center">
                <BarChart3 size={16} className="text-walnut mr-2" /> batch-wise Attainment Trends
              </h3>
              <p className="text-[10px] text-secondary-text mt-0.5">Average overall Graduate Outcome score evolution across consecutive years.</p>
            </div>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={batchData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAttain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#664930" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#664930" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="batch" tick={{ fontSize: 10 }} stroke="#997E67" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#997E67" unit="%" />
                  <Tooltip {...customTooltipStyle} />
                  <Area type="monotone" dataKey="attainment" stroke="#664930" fillOpacity={1} fill="url(#colorAttain)" name="Avg Outcome Score (%)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* List: Early Warning Indicators */}
          <div className="bg-white p-6 rounded-xl border border-taupe/20 shadow-sm flex flex-col justify-between text-left">
            <div>
              <h3 className="text-sm font-bold text-primary-text flex items-center">
                <AlertTriangle size={16} className="text-rejected mr-2" /> Early Warning Indicators
              </h3>
              <p className="text-[10px] text-secondary-text mt-0.5">Students flagging low verified achievements (Risk of outcomes deficit).</p>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto max-h-[220px] space-y-3.5 pr-1">
              {earlyWarnings.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2.5 bg-rejected-light border border-rejected/15 rounded-lg text-xs">
                  <div className="text-left">
                    <p className="font-bold text-primary-text">{item.name}</p>
                    <p className="text-[10px] text-secondary-text">{item.regNo}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-rejected/10 text-rejected font-extrabold text-[9px] uppercase">
                      {item.status}
                    </span>
                    <p className="text-[9px] text-secondary-text mt-1">{item.verifiedCount} Verified Record</p>
                  </div>
                </div>
              ))}
              {earlyWarnings.length === 0 && (
                <div className="py-12 text-center text-xs text-secondary-text font-medium">
                  No early warnings. All students are hitting verified benchmarks!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          {/* Placements package distribution */}
          <div className="bg-white p-6 rounded-xl border border-taupe/20 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-primary-text">Placement CTC Packages distribution</h3>
              <p className="text-[10px] text-secondary-text mt-0.5">Salary packages spread (LPA) for department students.</p>
            </div>
            <div className="h-60 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={placementStats.packagesRange} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="range" tick={{ fontSize: 9 }} stroke="#997E67" />
                  <YAxis tick={{ fontSize: 9 }} stroke="#997E67" />
                  <Tooltip {...customTooltipStyle} />
                  <Bar dataKey="count" fill="#664930" name="Students" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Certifications providers analysis */}
          <div className="bg-white p-6 rounded-xl border border-taupe/20 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-primary-text">Popular Certification Tracks</h3>
              <p className="text-[10px] text-secondary-text mt-0.5">Top technical credentials acquired by students.</p>
            </div>
            <div className="h-60 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={certData} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 9 }} stroke="#997E67" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 8 }} stroke="#997E67" width={75} />
                  <Tooltip {...customTooltipStyle} />
                  <Bar dataKey="count" fill="#997E67" name="Certifications" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Research Publications output */}
          <div className="bg-white p-6 rounded-xl border border-taupe/20 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-primary-text">Research Publications Trends</h3>
              <p className="text-[10px] text-secondary-text mt-0.5">IEEE/Springer journal publications & patents verified.</p>
            </div>
            <div className="h-60 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={researchData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 9 }} stroke="#997E67" />
                  <YAxis tick={{ fontSize: 9 }} stroke="#997E67" />
                  <Tooltip {...customTooltipStyle} />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="journals" fill="#664930" name="Journals" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="patents" fill="#CCBEB1" name="Patents" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Tab */}
      {activeTab === 'comparison' && (
        <div className="bg-white p-6 rounded-xl border border-taupe/20 shadow-sm text-left">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-primary-text flex items-center">
              <Compass size={16} className="text-walnut mr-2" /> Inter-Departmental Attainment Comparison
            </h3>
            <p className="text-[10px] text-secondary-text mt-0.5">Benchmarking graduate outcomes progress between Computer Science, Electronics, and Mechanical Engineering.</p>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockGraduateOutcomes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="code" tick={{ fontSize: 10 }} stroke="#997E67" />
                <YAxis tick={{ fontSize: 10 }} stroke="#997E67" unit="%" />
                <Tooltip {...customTooltipStyle} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="attainmentCSE" fill="#664930" name="CSE Attainment" radius={[3, 3, 0, 0]} />
                <Bar dataKey="attainmentECE" fill="#997E67" name="ECE Attainment" radius={[3, 3, 0, 0]} />
                <Bar dataKey="attainmentME" fill="#CCBEB1" name="ME Attainment" radius={[3, 3, 0, 0]} />
                <Bar dataKey="threshold" fill="#2F2A26" name="Target Threshold" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default HODDashboard;
