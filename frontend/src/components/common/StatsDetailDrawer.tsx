import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, CategoryBadge, GOBadge } from './Badge';
import { Button } from './Button';
import { EmptyState } from './EmptyState';
import {
  X, Search, ChevronDown, ChevronUp, Download, Eye, CheckCircle,
  XCircle, FileText, ChevronLeft, ChevronRight, SortAsc, SortDesc,
  Filter, User, Calendar, Hash, Building2, ArrowLeft, MessageSquare
} from 'lucide-react';

interface StatsDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  achievements: Achievement[];
  filterStatus?: 'pending' | 'verified' | 'rejected' | null;
  filterCategory?: string | null;
  showActions?: boolean; // for faculty/admin
}

type SortField = 'studentName' | 'date' | 'category' | 'status';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 8;

export const StatsDetailDrawer: React.FC<StatsDetailDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  achievements,
  filterStatus,
  filterCategory,
  showActions = false,
}) => {
  const { user, verifyAchievement } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [selectedAch, setSelectedAch] = useState<Achievement | null>(null);
  const [rejectComment, setRejectComment] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  // Reset when opened
  React.useEffect(() => {
    if (isOpen) {
      setSearch('');
      setStatusFilter(filterStatus || 'all');
      setCategoryFilter(filterCategory || 'all');
      setSortField('date');
      setSortDir('desc');
      setPage(1);
      setSelectedAch(null);
      setShowRejectInput(false);
      setRejectComment('');
    }
  }, [isOpen, filterStatus, filterCategory]);

  const canTakeAction = showActions && (user?.role === 'faculty' || user?.role === 'admin' || user?.role === 'hod');

  const filtered = useMemo(() => {
    let data = [...achievements];

    // Pre-filter by drawer context
    if (filterStatus) data = data.filter(a => a.status === filterStatus);
    if (filterCategory) data = data.filter(a => a.category === filterCategory);

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(a =>
        a.studentName.toLowerCase().includes(q) ||
        a.studentRegNo.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.issuer.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    }

    // Additional filters from UI
    if (statusFilter !== 'all') data = data.filter(a => a.status === statusFilter);
    if (categoryFilter !== 'all') data = data.filter(a => a.category === categoryFilter);

    // Sort
    data.sort((a, b) => {
      let aVal: string = '';
      let bVal: string = '';
      if (sortField === 'studentName') { aVal = a.studentName; bVal = b.studentName; }
      else if (sortField === 'date') { aVal = a.date; bVal = b.date; }
      else if (sortField === 'category') { aVal = a.category; bVal = b.category; }
      else if (sortField === 'status') { aVal = a.status; bVal = b.status; }
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    return data;
  }, [achievements, search, statusFilter, categoryFilter, sortField, sortDir, filterStatus, filterCategory]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
    setPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleApprove = (id: string) => {
    verifyAchievement(id, 'verified');
    if (selectedAch?.id === id) setSelectedAch(prev => prev ? { ...prev, status: 'verified' } : null);
  };

  const handleReject = () => {
    if (!selectedAch || !rejectComment.trim()) return;
    verifyAchievement(selectedAch.id, 'rejected', rejectComment);
    setSelectedAch(prev => prev ? { ...prev, status: 'rejected', comments: rejectComment } : null);
    setShowRejectInput(false);
    setRejectComment('');
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <SortAsc size={12} className="text-[#CCBEB1]" />;
    return sortDir === 'asc' ? <SortAsc size={12} className="text-[#664930]" /> : <SortDesc size={12} className="text-[#664930]" />;
  };

  const categoryLabels: Record<string, string> = {
    certification: 'Certification', internship: 'Internship',
    placement: 'Placement', publication: 'Publication', higher_studies: 'Higher Studies'
  };

  // ---- RECORD DETAIL VIEW ----
  const RecordDetail = ({ ach }: { ach: Achievement }) => (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center space-x-3 mb-5 pb-4 border-b border-[#CCBEB1]/20">
        <button
          onClick={() => { setSelectedAch(null); setShowRejectInput(false); }}
          className="p-1.5 rounded-lg hover:bg-[#FFDBBB]/30 text-[#997E67] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h3 className="text-sm font-bold text-[#2F2A26] font-heading">{ach.title}</h3>
          <p className="text-xs text-[#6B7280]">{ach.studentName} · {ach.studentRegNo}</p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={ach.status} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* Key Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Student', value: ach.studentName, icon: <User size={13} /> },
            { label: 'Reg. Number', value: ach.studentRegNo, icon: <Hash size={13} /> },
            { label: 'Department', value: ach.department, icon: <Building2 size={13} /> },
            { label: 'Upload Date', value: new Date(ach.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), icon: <Calendar size={13} /> },
          ].map(item => (
            <div key={item.label} className="p-3 bg-[#FAF8F5] rounded-xl border border-[#CCBEB1]/20">
              <div className="flex items-center space-x-1.5 text-[#997E67] mb-1">
                {item.icon}
                <span className="text-[10px] font-semibold uppercase tracking-wider">{item.label}</span>
              </div>
              <p className="text-xs font-bold text-[#2F2A26] truncate">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Category & Issuer */}
        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#CCBEB1]/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#997E67]">Category & Issuer</p>
            <CategoryBadge category={ach.category} />
          </div>
          <p className="text-xs font-bold text-[#2F2A26]">{ach.issuer}</p>
        </div>

        {/* GO Mappings */}
        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#CCBEB1]/20">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#997E67] mb-2">GO Mappings</p>
          <div className="flex flex-wrap gap-1.5">
            {ach.goMapping.length > 0
              ? ach.goMapping.map(go => <GOBadge key={go} code={go} />)
              : <span className="text-xs text-[#6B7280]">No mappings specified</span>
            }
          </div>
        </div>

        {/* Extra Details */}
        {ach.details && Object.keys(ach.details).length > 0 && (
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#CCBEB1]/20">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#997E67] mb-2">Additional Details</p>
            <div className="space-y-1.5">
              {Object.entries(ach.details).map(([key, val]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-[#6B7280] font-medium">{key}</span>
                  <span className="text-[#2F2A26] font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Document */}
        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#CCBEB1]/20">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#997E67] mb-2">Uploaded Document</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-lg bg-[#FFDBBB]/40 flex items-center justify-center">
                <FileText size={16} className="text-[#664930]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#2F2A26]">{ach.fileName}</p>
                <p className="text-[10px] text-[#6B7280]">{ach.fileSize}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-1.5 rounded-lg bg-[#FFDBBB]/40 hover:bg-[#FFDBBB] text-[#664930] transition-colors cursor-pointer" title="Preview">
                <Eye size={14} />
              </button>
              <button className="p-1.5 rounded-lg bg-[#FFDBBB]/40 hover:bg-[#FFDBBB] text-[#664930] transition-colors cursor-pointer" title="Download">
                <Download size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Verification Info */}
        {(ach.verifiedBy || ach.comments) && (
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#CCBEB1]/20">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#997E67] mb-2">Verification Info</p>
            {ach.verifiedBy && <p className="text-xs text-[#2F2A26]"><span className="font-medium text-[#6B7280]">By: </span>{ach.verifiedBy}</p>}
            {ach.verificationDate && <p className="text-xs text-[#2F2A26] mt-1"><span className="font-medium text-[#6B7280]">On: </span>{new Date(ach.verificationDate).toLocaleDateString('en-IN')}</p>}
            {ach.comments && (
              <div className="mt-2 p-2 bg-[#FDF4F4] rounded-lg border border-red-100">
                <p className="text-[10px] font-semibold text-red-600 mb-0.5">Rejection Reason</p>
                <p className="text-xs text-[#2F2A26]">{ach.comments}</p>
              </div>
            )}
          </div>
        )}

        {/* Actions for Faculty/Admin */}
        {canTakeAction && ach.status === 'pending' && (
          <div className="space-y-2 pt-2">
            {showRejectInput ? (
              <div className="space-y-2">
                <textarea
                  className="w-full text-xs border border-[#CCBEB1] rounded-xl p-3 bg-white resize-none focus:outline-none focus:border-[#997E67] placeholder:text-[#CCBEB1]"
                  rows={3}
                  placeholder="Enter rejection reason..."
                  value={rejectComment}
                  onChange={e => setRejectComment(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button variant="danger" className="flex-1 text-xs py-2" onClick={handleReject}>
                    Confirm Reject
                  </Button>
                  <Button variant="ghost" className="flex-1 text-xs py-2" onClick={() => setShowRejectInput(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="primary"
                  className="flex-1 text-xs py-2"
                  icon={<CheckCircle size={14} />}
                  onClick={() => handleApprove(ach.id)}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  className="flex-1 text-xs py-2"
                  icon={<XCircle size={14} />}
                  onClick={() => setShowRejectInput(true)}
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );

  // ---- LIST VIEW ----
  const ListView = () => (
    <div className="flex flex-col h-full">
      {/* Search & Filters */}
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#CCBEB1]" />
          <input
            type="text"
            placeholder="Search by student, title, issuer..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#FAF8F5] border border-[#CCBEB1]/30 rounded-xl text-[#2F2A26] placeholder:text-[#CCBEB1] focus:outline-none focus:border-[#997E67] transition-colors"
          />
        </div>

        <div className="flex space-x-2">
          {!filterStatus && (
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="flex-1 text-xs border border-[#CCBEB1]/30 rounded-lg px-2.5 py-2 bg-[#FAF8F5] text-[#2F2A26] focus:outline-none focus:border-[#997E67] cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          )}
          {!filterCategory && (
            <select
              value={categoryFilter}
              onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
              className="flex-1 text-xs border border-[#CCBEB1]/30 rounded-lg px-2.5 py-2 bg-[#FAF8F5] text-[#2F2A26] focus:outline-none focus:border-[#997E67] cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="certification">Certification</option>
              <option value="internship">Internship</option>
              <option value="placement">Placement</option>
              <option value="publication">Publication</option>
              <option value="higher_studies">Higher Studies</option>
            </select>
          )}
        </div>
      </div>

      {/* Sort bar + results count */}
      <div className="flex items-center justify-between mb-3 text-[10px] font-semibold text-[#6B7280]">
        <span>{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
        <div className="flex items-center space-x-2">
          <span>Sort:</span>
          {([['studentName', 'Name'], ['date', 'Date'], ['category', 'Type'], ['status', 'Status']] as [SortField, string][]).map(([field, label]) => (
            <button
              key={field}
              onClick={() => toggleSort(field)}
              className={`flex items-center space-x-0.5 px-2 py-1 rounded-md transition-colors cursor-pointer ${sortField === field ? 'bg-[#FFDBBB] text-[#664930]' : 'hover:bg-[#FAF8F5] text-[#CCBEB1]'}`}
            >
              <span>{label}</span>
              <SortIcon field={field} />
            </button>
          ))}
        </div>
      </div>

      {/* Records List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {paginated.length === 0 ? (
          <EmptyState
            icon={<Search size={28} />}
            title="No records found"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        ) : (
          paginated.map((ach) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedAch(ach)}
              className="p-3 bg-white rounded-xl border border-[#CCBEB1]/20 hover:border-[#997E67]/30 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#2F2A26] truncate group-hover:text-[#664930] transition-colors">
                    {ach.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[10px] text-[#6B7280]">{ach.studentName}</span>
                    <span className="text-[#CCBEB1]">·</span>
                    <span className="text-[10px] text-[#997E67] font-semibold">{ach.studentRegNo}</span>
                  </div>
                </div>
                <StatusBadge status={ach.status} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CategoryBadge category={ach.category} />
                  <div className="flex space-x-1">
                    {ach.goMapping.slice(0, 3).map(go => (
                      <span key={go} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#FFDBBB] text-[#664930] border border-[#664930]/15">
                        {go}
                      </span>
                    ))}
                    {ach.goMapping.length > 3 && (
                      <span className="text-[9px] text-[#997E67] font-semibold">+{ach.goMapping.length - 3}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-[#6B7280]">{new Date(ach.date).toLocaleDateString('en-IN')}</span>
                  {canTakeAction && ach.status === 'pending' && (
                    <div className="flex space-x-1" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleApprove(ach.id)}
                        className="p-1 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors cursor-pointer"
                        title="Approve"
                      >
                        <CheckCircle size={13} />
                      </button>
                      <button
                        onClick={() => { setSelectedAch(ach); setShowRejectInput(true); }}
                        className="p-1 rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
                        title="Reject"
                      >
                        <XCircle size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 border-t border-[#CCBEB1]/20 mt-2">
          <span className="text-[10px] text-[#6B7280]">
            Page {page} of {totalPages}
          </span>
          <div className="flex space-x-1">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-1.5 rounded-lg border border-[#CCBEB1]/30 text-[#997E67] disabled:opacity-30 hover:bg-[#FAF8F5] transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-7 h-7 text-[10px] font-bold rounded-lg border transition-colors cursor-pointer ${
                    page === pageNum
                      ? 'bg-[#664930] text-white border-[#664930]'
                      : 'border-[#CCBEB1]/30 text-[#6B7280] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="p-1.5 rounded-lg border border-[#CCBEB1]/30 text-[#997E67] disabled:opacity-30 hover:bg-[#FAF8F5] transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#2F2A26]/30 backdrop-blur-sm z-40"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-[#CCBEB1]/20 bg-[#FAF8F5]">
              <div>
                <h2 className="text-base font-extrabold text-[#2F2A26] font-heading">{title}</h2>
                {subtitle && <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-[#FFDBBB]/40 text-[#997E67] hover:text-[#664930] transition-colors cursor-pointer ml-4 flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden p-5">
              <AnimatePresence mode="wait">
                {selectedAch ? (
                  <RecordDetail key="detail" ach={selectedAch} />
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col"
                  >
                    <ListView />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StatsDetailDrawer;
