import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface GOScore {
  code: string;
  title: string;
  score: number; // 0-100
  threshold?: number; // target, e.g. 75
}

interface GOProgressBarsProps {
  scores: GOScore[];
  title?: string;
}

const getScoreColor = (score: number, threshold: number = 75) => {
  if (score >= threshold + 10) return { bar: '#10B981', bg: '#EFFAF5', text: '#059669', label: 'Excellent' };
  if (score >= threshold) return { bar: '#664930', bg: '#FFDBBB', text: '#664930', label: 'Attained' };
  if (score >= threshold - 10) return { bar: '#F59E0B', bg: '#FEFAF2', text: '#D97706', label: 'Near Target' };
  return { bar: '#EF4444', bg: '#FDF4F4', text: '#DC2626', label: 'Below Target' };
};

const goDescriptions: Record<string, string> = {
  'GO-1': 'Engineering Knowledge: Core science & engineering fundamentals.',
  'GO-2': 'Problem Analysis: Analyze and substantiate complex engineering problems.',
  'GO-3': 'Design & Development: Create solutions with public health & safety considerations.',
  'GO-4': 'Conduct Investigations: Use research-based design and experiments.',
  'GO-5': 'Modern Tool Usage: Apply predictions and modeling via engineering/IT software.',
  'GO-6': 'Engineer & Society: Analyze societal, health, and legal contexts.',
};

export const GOProgressBars: React.FC<GOProgressBarsProps> = ({ scores, title = 'Graduate Outcome Attainment' }) => {
  const [hoveredGO, setHoveredGO] = React.useState<string | null>(null);

  return (
    <div className="space-y-1">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#2F2A26] font-heading">{title}</h3>
          <div className="flex items-center space-x-3 text-[10px] font-semibold">
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-[#10B981] inline-block" /><span className="text-[#6B7280]">Excellent</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-[#664930] inline-block" /><span className="text-[#6B7280]">Attained</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-[#F59E0B] inline-block" /><span className="text-[#6B7280]">Near</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-[#EF4444] inline-block" /><span className="text-[#6B7280]">Below</span></span>
          </div>
        </div>
      )}

      {scores.map((go, index) => {
        const colors = getScoreColor(go.score, go.threshold);
        const isHovered = hoveredGO === go.code;
        return (
          <motion.div
            key={go.code}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06 }}
            className="relative group"
            onMouseEnter={() => setHoveredGO(go.code)}
            onMouseLeave={() => setHoveredGO(null)}
          >
            <div
              className="p-3 rounded-xl border transition-all duration-200 cursor-default"
              style={{
                backgroundColor: isHovered ? colors.bg : 'white',
                borderColor: isHovered ? colors.bar + '40' : '#CCBEB130',
                boxShadow: isHovered ? `0 4px 16px ${colors.bar}18` : 'none',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded-md tracking-wider"
                    style={{ backgroundColor: colors.bg, color: colors.bar }}
                  >
                    {go.code}
                  </span>
                  <span className="text-xs font-semibold text-[#2F2A26] truncate max-w-[180px]">{go.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: colors.bg, color: colors.text }}
                  >
                    {colors.label}
                  </span>
                  <span className="text-base font-extrabold font-heading" style={{ color: colors.bar }}>
                    {go.score}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative w-full h-2.5 bg-[#F5F0EB] rounded-full overflow-hidden">
                {/* Target line */}
                {go.threshold && (
                  <div
                    className="absolute top-0 bottom-0 w-px bg-[#6B7280] opacity-40 z-10"
                    style={{ left: `${go.threshold}%` }}
                  />
                )}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${go.score}%` }}
                  transition={{ duration: 0.8, delay: index * 0.06 + 0.2, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: colors.bar }}
                />
              </div>

              {/* Tooltip on hover */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-[10px] text-[#6B7280] leading-relaxed"
                >
                  <span className="font-medium text-[#2F2A26]">Definition: </span>
                  {goDescriptions[go.code] || go.title}
                  {go.threshold && (
                    <span className="ml-2 text-[#997E67] font-semibold">(Target: {go.threshold}%)</span>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Radial / Circular version for compact display
interface GORadialGridProps {
  scores: GOScore[];
}

export const GORadialGrid: React.FC<GORadialGridProps> = ({ scores }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {scores.map((go, index) => {
        const colors = getScoreColor(go.score, go.threshold);
        const circumference = 2 * Math.PI * 28;
        const dashOffset = circumference - (go.score / 100) * circumference;

        return (
          <motion.div
            key={go.code}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.07 }}
            className="flex flex-col items-center p-3 rounded-xl border border-[#CCBEB1]/20 bg-white hover:border-[#997E67]/30 hover:shadow-md transition-all duration-200 cursor-default group"
            title={goDescriptions[go.code]}
          >
            <div className="relative w-16 h-16 mb-2">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#F5F0EB" strokeWidth="6" />
                <motion.circle
                  cx="32" cy="32" r="28"
                  fill="none"
                  stroke={colors.bar}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ duration: 0.9, delay: index * 0.07 + 0.1, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-extrabold font-heading" style={{ color: colors.bar }}>
                  {go.score}%
                </span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: colors.bg, color: colors.bar }}>
              {go.code}
            </span>
            <span className="text-[9px] text-[#6B7280] text-center mt-1 leading-tight font-medium">{go.title}</span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default GOProgressBars;
