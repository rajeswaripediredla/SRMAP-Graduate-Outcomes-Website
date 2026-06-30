import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  placementStats, 
  successStories, 
  mockGraduateOutcomes 
} from '../utils/mockData';
import { 
  ArrowRight, 
  GraduationCap, 
  Award, 
  TrendingUp, 
  BookOpen, 
  Building2, 
  CheckCircle,
  Briefcase,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PublicPortal: React.FC = () => {
  const navigate = useNavigate();
  const [activeStory, setActiveStory] = useState(0);

  // Formatting chart tooltips
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

  const handleNextStory = () => {
    setActiveStory((prev) => (prev + 1) % successStories.length);
  };

  const handlePrevStory = () => {
    setActiveStory((prev) => (prev - 1 + successStories.length) % successStories.length);
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col font-sans">
      {/* Top Navigation */}
      <nav className="h-16 border-b border-taupe/20 bg-white/70 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-walnut flex items-center justify-center text-white font-bold text-base">
            SRM
          </div>
          <div className="flex flex-col text-left">
            <span className="font-heading font-bold text-sm text-walnut tracking-tight leading-none">
              GO Portal
            </span>
            <span className="text-[9px] text-secondary-text font-semibold tracking-wider">
              SRM UNIVERSITY AP
            </span>
          </div>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center justify-center font-semibold rounded-lg bg-walnut text-white hover:bg-mocha transition-all duration-200 text-xs py-2 px-4.5 cursor-pointer shadow-md shadow-walnut/10"
        >
          Portal Login <ArrowRight size={14} className="ml-1.5" />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-6 md:px-12 text-center bg-gradient-to-b from-cream/20 to-transparent overflow-hidden">
        {/* Decorative backdrop shapes */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-cream/10 blur-3xl -z-10" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-taupe/10 blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-cream text-walnut font-bold text-[10px] uppercase tracking-wider mb-6 border border-walnut/15">
            <GraduationCap size={12} className="mr-1.5" /> Graduate Outcomes Management
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary-text leading-tight font-heading mb-6">
            Empowering Success, <br className="hidden md:inline" />
            <span className="text-walnut bg-clip-text">Verifying Academic Attainment</span>
          </h1>
          <p className="text-sm md:text-lg text-secondary-text max-w-2xl mx-auto leading-relaxed mb-8">
            Explore verified graduate outcome attainment statistics, placement trends, and success stories at SRM University AP. Providing transparent data for NBA & NAAC compliance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                const element = document.getElementById('analytics');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="py-3 px-6 rounded-lg bg-walnut text-white text-xs font-bold hover:bg-mocha hover:scale-[1.01] active:scale-100 transition-all shadow-md shadow-walnut/10 cursor-pointer"
            >
              Explore University Analytics
            </button>
            <button
              onClick={() => navigate('/login')}
              className="py-3 px-6 rounded-lg bg-white border border-taupe/40 text-walnut text-xs font-bold hover:bg-bg-base hover:scale-[1.01] active:scale-100 transition-all shadow-sm cursor-pointer"
            >
              Access Secure Portal
            </button>
          </div>
        </div>
      </section>

      {/* Quick Metrics */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto w-full -mt-4 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-xl border border-taupe/20 shadow-premium">
          <div className="text-center p-3">
            <p className="text-2xl md:text-3xl font-extrabold text-walnut font-heading">{placementStats.placementPercentage}</p>
            <p className="text-xs text-secondary-text mt-1 font-medium">Placement Rate</p>
          </div>
          <div className="text-center p-3 border-l border-taupe/15">
            <p className="text-2xl md:text-3xl font-extrabold text-walnut font-heading">{placementStats.averagePackage}</p>
            <p className="text-xs text-secondary-text mt-1 font-medium">Average package</p>
          </div>
          <div className="text-center p-3 border-l border-taupe/15">
            <p className="text-2xl md:text-3xl font-extrabold text-walnut font-heading">{placementStats.highestPackage}</p>
            <p className="text-xs text-secondary-text mt-1 font-medium">Highest Package</p>
          </div>
          <div className="text-center p-3 border-l border-taupe/15">
            <p className="text-2xl md:text-3xl font-extrabold text-walnut font-heading">81.3%</p>
            <p className="text-xs text-secondary-text mt-1 font-medium">Average GO Attainment</p>
          </div>
        </div>
      </section>

      {/* Interactive Analytics Dashboard */}
      <section id="analytics" className="px-6 md:px-12 max-w-7xl mx-auto w-full mb-16 scroll-mt-20">
        <div className="text-left mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-text font-heading">University Attainment Analytics</h2>
          <p className="text-xs md:text-sm text-secondary-text mt-1">Live metrics driving institutional excellence, placements distributions, and outcome performance.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: Placement Salary Package Distribution */}
          <div className="bg-white p-6 rounded-xl border border-taupe/20 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div className="text-left">
                <h3 className="text-sm font-bold text-primary-text flex items-center">
                  <Briefcase size={16} className="text-walnut mr-2" /> Placement Package Spread (2026 Batch)
                </h3>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={placementStats.packagesRange} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="range" tick={{ fontSize: 10 }} stroke="#997E67" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#997E67" />
                  <Tooltip {...customTooltipStyle} />
                  <Bar dataKey="count" fill="#664930" radius={[4, 4, 0, 0]} name="No. of Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Year-wise Average & Highest Packages */}
          <div className="bg-white p-6 rounded-xl border border-taupe/20 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div className="text-left">
                <h3 className="text-sm font-bold text-primary-text flex items-center">
                  <TrendingUp size={16} className="text-walnut mr-2" /> Five-Year Placement Trends (LPA)
                </h3>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={placementStats.yearWiseTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#CCBEB1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#CCBEB1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#664930" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#664930" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="#997E67" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#997E67" />
                  <Tooltip {...customTooltipStyle} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="average" stroke="#CCBEB1" fillOpacity={1} fill="url(#colorAvg)" name="Average Package (LPA)" />
                  <Area type="monotone" dataKey="highest" stroke="#664930" fillOpacity={1} fill="url(#colorHigh)" name="Highest Package (LPA)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Outcome Attainment by Department */}
          <div className="bg-white p-6 rounded-xl border border-taupe/20 shadow-sm lg:col-span-2 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div className="text-left">
                <h3 className="text-sm font-bold text-primary-text flex items-center">
                  <BookOpen size={16} className="text-walnut mr-2" /> Graduate Outcome (GO-1 to GO-6) Department Comparison
                </h3>
              </div>
            </div>
            <div className="h-72">
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
            <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-2 bg-[#FAF8F5] p-3 rounded-lg border border-taupe/15">
              {mockGraduateOutcomes.map((o) => (
                <div key={o.code} className="text-left p-1">
                  <p className="text-[10px] font-bold text-primary-text">{o.code}</p>
                  <p className="text-[9px] text-secondary-text truncate" title={o.title}>{o.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Carousel */}
      <section className="bg-[#FAF8F5] border-y border-taupe/20 py-16 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-text font-heading mb-10">Graduate Success Stories</h2>
          
          <div className="relative bg-white rounded-xl border border-taupe/20 shadow-premium p-6 md:p-10 min-h-[300px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row items-center md:items-start text-left gap-6 md:gap-8"
              >
                <img
                  src={successStories[activeStory].image}
                  alt={successStories[activeStory].name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover shadow-md border border-taupe/20"
                />
                <div className="flex-1 flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[9px] font-bold tracking-wider uppercase text-walnut bg-cream/35 px-2 py-0.5 rounded border border-walnut/15 inline-block mb-3">
                      {successStories[activeStory].department} • {successStories[activeStory].batch}
                    </span>
                    <h3 className="text-base md:text-lg font-bold text-primary-text">
                      {successStories[activeStory].name}
                    </h3>
                    <p className="text-xs font-semibold text-secondary-text mt-0.5">
                      {successStories[activeStory].destination}
                    </p>
                    <p className="text-xs text-primary-text/90 italic leading-relaxed mt-4 bg-bg-base/40 p-3 rounded-lg border border-taupe/10">
                      "{successStories[activeStory].achievement}"
                    </p>
                  </div>
                  
                  <div className="mt-4 flex items-center space-x-2">
                    <span className="text-[10px] text-secondary-text font-medium">Verified Outcomes:</span>
                    <div className="flex space-x-1">
                      {successStories[activeStory].outcomes.map((code) => (
                        <span key={code} className="px-1.5 py-0.5 bg-cream text-walnut font-bold text-[9px] rounded border border-walnut/20">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Navigation buttons */}
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={handlePrevStory}
                className="p-1.5 rounded-full border border-taupe/30 hover:bg-bg-base hover:text-walnut text-secondary-text transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNextStory}
                className="p-1.5 rounded-full border border-taupe/30 hover:bg-bg-base hover:text-walnut text-secondary-text transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recruiter Showcase / NBA Compliance Callout */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-left space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-text font-heading">Accreditation Ready Portal</h2>
            <p className="text-xs md:text-sm text-secondary-text leading-relaxed">
              Our outcomes mapping processes conform to standard National Board of Accreditation (NBA) and National Assessment and Accreditation Council (NAAC) templates. With tamper-proof digital audits and outcome-based analysis, SRM University AP ensures direct attainment metric visibility at any level.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-xs font-semibold text-primary-text">
                <CheckCircle size={14} className="text-success mr-2 shrink-0" /> Dynamic GO attainment calculations
              </div>
              <div className="flex items-center text-xs font-semibold text-primary-text">
                <CheckCircle size={14} className="text-success mr-2 shrink-0" /> Full verification history with auditor comments
              </div>
              <div className="flex items-center text-xs font-semibold text-primary-text">
                <CheckCircle size={14} className="text-success mr-2 shrink-0" /> Document logs exportable for mock NBA visits
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-taupe/20 shadow-sm text-left">
            <h3 className="text-sm font-bold text-primary-text mb-4">Prominent Placements Partners</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              {['Microsoft', 'Google Cloud', 'Amazon AWS', 'TATA Motors', 'Intel', 'Microsoft'].map((item, index) => (
                <div key={index} className="p-3 bg-[#FAF8F5] border border-taupe/15 rounded-lg text-[10px] font-bold text-secondary-text tracking-wide uppercase select-none">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-taupe/20 bg-white py-8 px-6 text-center text-xs text-secondary-text">
        <p>© 2026 SRM University AP, Andhra Pradesh. Graduate Outcomes Portal. All rights reserved.</p>
        <p className="mt-1">Developed for NBA/NAAC Attainment Audit Systems.</p>
      </footer>
    </div>
  );
};

export default PublicPortal;
