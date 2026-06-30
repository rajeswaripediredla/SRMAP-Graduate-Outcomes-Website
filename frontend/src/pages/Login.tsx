import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../utils/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Mail, Eye, EyeOff, ArrowRight, ArrowLeft,
  GraduationCap, BookOpen, ShieldCheck, UserSquare,
  Globe, Award, CheckCircle, AlertCircle, RefreshCw,
  Fingerprint, KeyRound, RotateCcw, Sparkles
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────
type ForgotStep = 'email' | 'otp' | 'reset' | 'success';

// ─── Preset credentials per role ───────────────────────────────────────────────
const ROLE_PRESETS: Record<string, { email: string; password: string; label: string; sub: string }> = {
  student:  { email: 'student@srmap.edu.in',  password: 'password123', label: 'Student',       sub: 'B.Tech · CSE · 2026' },
  faculty:  { email: 'faculty@srmap.edu.in',  password: 'password123', label: 'Faculty',       sub: 'Assoc. Professor · CSE' },
  hod:      { email: 'hod@srmap.edu.in',       password: 'password123', label: 'HOD',           sub: 'Head of Dept · CSE' },
  admin:    { email: 'admin@srmap.edu.in',     password: 'password123', label: 'Admin',         sub: 'System Administrator' },
};

const ROLE_ICONS: Record<string, React.ReactNode> = {
  student: <GraduationCap size={18} />,
  faculty: <BookOpen size={18} />,
  hod:     <UserSquare size={18} />,
  admin:   <ShieldCheck size={18} />,
};

const ROLE_DASHBOARD: Record<string, string> = {
  student: '/student/dashboard',
  faculty: '/faculty/dashboard',
  hod:     '/hod/dashboard',
  admin:   '/admin/dashboard',
};

// ─── Graduate Outcome data for the left panel ──────────────────────────────────
const GO_ITEMS = [
  { code: 'GO-1', score: 82, label: 'Engineering Knowledge' },
  { code: 'GO-2', score: 75, label: 'Problem Analysis' },
  { code: 'GO-3', score: 88, label: 'Design & Development' },
  { code: 'GO-4', score: 79, label: 'Research & Investigation' },
  { code: 'GO-5', score: 91, label: 'Modern Tool Usage' },
  { code: 'GO-6', score: 84, label: 'Engineer & Society' },
];

// ─── Reusable field wrapper ─────────────────────────────────────────────────────
const Field: React.FC<{
  label: string;
  error?: string;
  children: React.ReactNode;
}> = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-[#2F2A26]">{label}</label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-[11px] text-red-500 font-medium flex items-center gap-1"
        >
          <AlertCircle size={11} />{error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

// ─── Password input with toggle ─────────────────────────────────────────────────
const PasswordInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}> = ({ value, onChange, placeholder = '••••••••', disabled }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#997E67]">
        <Lock size={15} />
      </div>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full pl-10 pr-10 py-3 text-sm bg-white border border-[#CCBEB1]/40 rounded-xl text-[#2F2A26] placeholder:text-[#CCBEB1] focus:outline-none focus:border-[#664930] focus:ring-2 focus:ring-[#664930]/10 transition-all disabled:opacity-50"
      />
      <button
        type="button"
        onClick={() => setShow(v => !v)}
        tabIndex={-1}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#997E67] hover:text-[#664930] transition-colors cursor-pointer"
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
};

// ─── OTP input (6 boxes) ───────────────────────────────────────────────────────
const OTPInput: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const inputs = Array.from({ length: 6 });
  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      (document.getElementById(`otp-${i - 1}`) as HTMLInputElement)?.focus();
    }
  };
  const handleChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, '').slice(-1);
    const arr = value.split('');
    arr[i] = digit;
    const next = arr.join('').padEnd(6, '').slice(0, 6);
    onChange(next.trimEnd ? next.replace(/\s/g, '') : next);
    if (digit && i < 5) (document.getElementById(`otp-${i + 1}`) as HTMLInputElement)?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {inputs.map((_, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          className={`w-11 h-12 text-center text-lg font-extrabold border-2 rounded-xl bg-[#FAF8F5] text-[#2F2A26] focus:outline-none transition-all ${
            value[i]
              ? 'border-[#664930] bg-[#FFDBBB]/20'
              : 'border-[#CCBEB1]/40 focus:border-[#664930]'
          }`}
        />
      ))}
    </div>
  );
};

// ─── Password strength meter ───────────────────────────────────────────────────
const StrengthMeter: React.FC<{ password: string }> = ({ password }) => {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ];
  const strength = checks.filter(Boolean).length;
  const colors = ['bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-emerald-500'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < strength ? colors[strength - 1] : 'bg-[#CCBEB1]/30'}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
          />
        ))}
      </div>
      <p className="text-[11px] text-[#6B7280]">
        Password strength: <span className={`font-bold ${strength >= 3 ? 'text-emerald-600' : strength >= 2 ? 'text-amber-600' : 'text-red-500'}`}>{labels[strength - 1] || 'Too short'}</span>
      </p>
    </div>
  );
};

// ─── Forgot Password Modal ─────────────────────────────────────────────────────
const ForgotPasswordModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState<ForgotStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const startTimer = useCallback(() => {
    setTimer(60);
    const id = setInterval(() => setTimer(t => { if (t <= 1) { clearInterval(id); return 0; } return t - 1; }), 1000);
  }, []);

  const simulate = (fn: () => void, ms = 900) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); fn(); }, ms);
  };

  const handleEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address.'); return; }
    simulate(() => { setStep('otp'); startTimer(); });
  };

  const handleOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp.replace(/\s/g, '').length < 6) { setError('Enter all 6 digits of your OTP.'); return; }
    if (otp !== '123456') { setError('Incorrect OTP. (Demo: use 1 2 3 4 5 6)'); return; }
    simulate(() => setStep('reset'));
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPwd.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (newPwd !== confirmPwd) { setError('Passwords do not match.'); return; }
    simulate(() => setStep('success'));
  };

  const stepTitles: Record<ForgotStep, string> = {
    email:   'Forgot Password?',
    otp:     'Verify Your Identity',
    reset:   'Set New Password',
    success: 'Password Reset!',
  };

  const stepSubs: Record<ForgotStep, string> = {
    email:   'Enter your registered SRM email address.',
    otp:     `A 6-digit OTP was sent to ${email}. (Demo: 1 2 3 4 5 6)`,
    reset:   'Choose a strong, unique password for your account.',
    success: 'Your password has been reset. You can now sign in.',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2F2A26]/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 24 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl border border-[#CCBEB1]/20 w-full max-w-sm p-6"
      >
        {/* Step progress */}
        {step !== 'success' && (
          <div className="flex gap-1.5 mb-5">
            {(['email', 'otp', 'reset'] as ForgotStep[]).map((s, i) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all duration-400 ${
                  ['email', 'otp', 'reset', 'success'].indexOf(step) >= i ? 'bg-[#664930]' : 'bg-[#CCBEB1]/30'
                }`}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22 }}
          >
            {/* Icon */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
              step === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-[#FFDBBB]/50 text-[#664930]'
            }`}>
              {step === 'email'   && <Mail size={22} />}
              {step === 'otp'     && <Fingerprint size={22} />}
              {step === 'reset'   && <KeyRound size={22} />}
              {step === 'success' && <CheckCircle size={22} />}
            </div>

            <h3 className="text-lg font-extrabold font-heading text-[#2F2A26] mb-1">{stepTitles[step]}</h3>
            <p className="text-xs text-[#6B7280] mb-5 leading-relaxed">{stepSubs[step]}</p>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold"
                >
                  <AlertCircle size={13} />{error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step: Email */}
            {step === 'email' && (
              <form onSubmit={handleEmail} className="space-y-4">
                <Field label="SRM Email Address">
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#997E67]" />
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="email@srmap.edu.in"
                      className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-[#CCBEB1]/40 rounded-xl text-[#2F2A26] placeholder:text-[#CCBEB1] focus:outline-none focus:border-[#664930] focus:ring-2 focus:ring-[#664930]/10 transition-all"
                    />
                  </div>
                </Field>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#664930] hover:bg-[#997E67] text-white font-bold rounded-xl text-sm transition-all disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? <RefreshCw size={15} className="animate-spin" /> : <><span>Send OTP</span><ArrowRight size={15} /></>}
                </button>
                <button type="button" onClick={onClose} className="w-full text-xs text-[#997E67] hover:text-[#664930] transition-colors cursor-pointer font-semibold flex items-center justify-center gap-1 mt-1">
                  <ArrowLeft size={12} /> Back to Login
                </button>
              </form>
            )}

            {/* Step: OTP */}
            {step === 'otp' && (
              <form onSubmit={handleOTP} className="space-y-4">
                <OTPInput value={otp} onChange={setOtp} />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#664930] hover:bg-[#997E67] text-white font-bold rounded-xl text-sm transition-all disabled:opacity-60 cursor-pointer"
                >
                  {loading ? <RefreshCw size={15} className="animate-spin" /> : <><span>Verify OTP</span><ArrowRight size={15} /></>}
                </button>
                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    disabled={timer > 0}
                    onClick={() => { setOtp(''); simulate(() => startTimer()); }}
                    className="text-[#997E67] hover:text-[#664930] disabled:opacity-40 flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed font-semibold transition-colors"
                  >
                    <RefreshCw size={11} />{timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                  </button>
                  <button type="button" onClick={() => setStep('email')} className="text-[#6B7280] hover:text-[#2F2A26] cursor-pointer font-semibold">
                    Change email
                  </button>
                </div>
              </form>
            )}

            {/* Step: Reset */}
            {step === 'reset' && (
              <form onSubmit={handleReset} className="space-y-4">
                <Field label="New Password">
                  <PasswordInput value={newPwd} onChange={setNewPwd} placeholder="At least 8 characters" />
                </Field>
                <StrengthMeter password={newPwd} />
                <Field label="Confirm Password">
                  <PasswordInput value={confirmPwd} onChange={setConfirmPwd} placeholder="Repeat new password" />
                </Field>
                {confirmPwd && (
                  <p className={`text-xs font-semibold flex items-center gap-1 ${newPwd === confirmPwd ? 'text-emerald-600' : 'text-red-500'}`}>
                    {newPwd === confirmPwd ? <><CheckCircle size={12} /> Passwords match</> : <><AlertCircle size={12} /> Passwords do not match</>}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#664930] hover:bg-[#997E67] text-white font-bold rounded-xl text-sm transition-all disabled:opacity-60 cursor-pointer"
                >
                  {loading ? <RefreshCw size={15} className="animate-spin" /> : <><span>Reset Password</span><ArrowRight size={15} /></>}
                </button>
              </form>
            )}

            {/* Step: Success */}
            {step === 'success' && (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium">
                  Your account password has been successfully updated. Please sign in with your new credentials.
                </div>
                <button
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#664930] hover:bg-[#997E67] text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
                >
                  <span>Back to Login</span><ArrowRight size={15} />
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// ─── LEFT PANEL — Branding + GO stats ─────────────────────────────────────────
const LeftPanel: React.FC = () => {
  return (
    <div className="hidden lg:flex w-[45%] flex-shrink-0 bg-[#2F2A26] flex-col justify-between p-10 xl:p-14 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#FFDBBB]/6 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-20 w-[400px] h-[400px] rounded-full bg-[#664930]/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#997E67]/5 blur-2xl pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFDBBB] flex items-center justify-center">
            <span className="text-[#2F2A26] font-extrabold text-base font-heading">GO</span>
          </div>
          <div>
            <p className="text-white font-extrabold text-sm font-heading tracking-tight">Graduate Outcomes Portal</p>
            <p className="text-white/40 text-[10px] tracking-widest uppercase">SRM University AP</p>
          </div>
        </div>
      </div>

      {/* Hero Text */}
      <div className="relative z-10 space-y-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[#FFDBBB] border border-[#FFDBBB]/20 px-3 py-1 rounded-full bg-white/5 mb-4">
            <Sparkles size={9} /> NBA · NAAC · Accreditation Ready
          </span>
          <h1 className="text-3xl xl:text-4xl font-extrabold font-heading text-white leading-tight mt-3">
            Transforming<br />
            Achievements into<br />
            <span className="text-[#FFDBBB]">Verified Success.</span>
          </h1>
          <p className="text-sm text-white/55 leading-relaxed mt-4 max-w-sm">
            A unified academic platform to track, verify, and report graduate outcome milestones across all departments.
          </p>
        </div>

        {/* GO Attainment Bars */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-3">Current Avg. GO Attainment</p>
          {GO_ITEMS.map((go, i) => (
            <motion.div
              key={go.code}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 + 0.3 }}
              className="flex items-center gap-3"
            >
              <span className="text-[10px] font-extrabold text-[#FFDBBB] w-10 flex-shrink-0">{go.code}</span>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#FFDBBB] to-[#997E67]"
                  initial={{ width: 0 }}
                  animate={{ width: `${go.score}%` }}
                  transition={{ delay: i * 0.08 + 0.5, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <span className="text-[10px] font-bold text-white/60 w-8 text-right">{go.score}%</span>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Students', value: '3,200+' },
            { label: 'Verified', value: '1,200+' },
            { label: 'Avg. Package', value: '8.4 LPA' },
          ].map(stat => (
            <div key={stat.label} className="p-3 rounded-xl bg-white/5 border border-white/8 text-center">
              <p className="text-base font-extrabold font-heading text-white">{stat.value}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between text-[10px] text-white/25">
        <span>Secured with JWT · Role-based Access</span>
        <span>© 2026 SRM University AP</span>
      </div>
    </div>
  );
};

// ─── MAIN LOGIN PAGE ───────────────────────────────────────────────────────────
export const Login: React.FC = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [rememberMe, setRememberMe]     = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [errors, setErrors]   = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(ROLE_DASHBOARD[user.role] || '/public', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Auto-fill credentials when role changes
  const selectRole = (role: UserRole) => {
    setSelectedRole(role);
    setErrors({});
    if (role === 'public') { navigate('/public'); return; }
    setEmail(ROLE_PRESETS[role].email);
    setPassword(ROLE_PRESETS[role].password);
  };

  // Auto-fill on mount
  useEffect(() => { selectRole('student'); }, []);

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!email)                            e.email    = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email    = 'Enter a valid email address.';
    if (!password)                         e.password = 'Password is required.';
    else if (password.length < 6)          e.password = 'Password must be at least 6 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;
    setLoading(true);
    try {
      const ok = await login(email, password, selectedRole, keepSignedIn || rememberMe);
      if (ok) {
        navigate(ROLE_DASHBOARD[selectedRole] || '/public');
      } else {
        setErrors({ general: 'Invalid credentials for this role. Use the preset email / password123.' });
      }
    } catch {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const roles = Object.entries(ROLE_PRESETS) as [UserRole, typeof ROLE_PRESETS[string]][];

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      <LeftPanel />

      {/* ── RIGHT: Login form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 overflow-y-auto">

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-[#664930] flex items-center justify-center">
            <span className="text-white font-extrabold text-sm font-heading">GO</span>
          </div>
          <div>
            <p className="font-extrabold text-sm text-[#664930] font-heading">Graduate Outcomes Portal</p>
            <p className="text-[10px] text-[#6B7280] tracking-widest uppercase">SRM University AP</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white rounded-2xl border border-[#CCBEB1]/20 shadow-xl shadow-[#664930]/5 p-7 md:p-8">

            {/* Heading */}
            <div className="mb-6">
              <h2 className="text-xl font-extrabold font-heading text-[#2F2A26]">Sign In</h2>
              <p className="text-xs text-[#6B7280] mt-1">Select your role, then enter your credentials.</p>
            </div>

            {/* Role Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {roles.map(([role, info]) => {
                const active = selectedRole === role;
                return (
                  <motion.button
                    key={role}
                    type="button"
                    onClick={() => selectRole(role)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative p-3 rounded-xl border text-center flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 ${
                      active
                        ? 'border-[#664930] bg-[#664930]/5 shadow-sm'
                        : 'border-[#CCBEB1]/30 bg-white hover:border-[#997E67]/50 hover:bg-[#FAF8F5]'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="role-indicator"
                        className="absolute inset-0 rounded-xl border-2 border-[#664930] pointer-events-none"
                        transition={{ type: 'spring', damping: 28, stiffness: 380 }}
                      />
                    )}
                    <span className={active ? 'text-[#664930]' : 'text-[#6B7280]'}>
                      {ROLE_ICONS[role]}
                    </span>
                    <span className={`text-[10px] font-extrabold tracking-wide ${active ? 'text-[#664930]' : 'text-[#6B7280]'}`}>
                      {info.label}
                    </span>
                    <span className="text-[8.5px] text-[#CCBEB1] font-medium leading-tight text-center hidden sm:block">
                      {info.sub}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>

              {/* General error */}
              <AnimatePresence>
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold"
                  >
                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                    <span>{errors.general}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <Field label="Academic Email" error={errors.email}>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#997E67]" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '', general: '' })); }}
                    placeholder="email@srmap.edu.in"
                    disabled={loading}
                    className={`w-full pl-10 pr-4 py-3 text-sm bg-white border rounded-xl text-[#2F2A26] placeholder:text-[#CCBEB1] focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${
                      errors.email
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-[#CCBEB1]/40 focus:border-[#664930] focus:ring-[#664930]/10'
                    }`}
                  />
                </div>
              </Field>

              {/* Password */}
              <Field label="Password" error={errors.password}>
                <PasswordInput
                  value={password}
                  onChange={v => { setPassword(v); setErrors(p => ({ ...p, password: '', general: '' })); }}
                  disabled={loading}
                />
              </Field>

              {/* Remember Me + Forgot */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none group">
                    <div
                      onClick={() => setRememberMe(v => !v)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                        rememberMe ? 'bg-[#664930] border-[#664930]' : 'border-[#CCBEB1] group-hover:border-[#997E67]'
                      }`}
                    >
                      {rememberMe && <CheckCircle size={10} className="text-white" />}
                    </div>
                    <span className="text-xs text-[#6B7280] font-medium">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-xs font-bold text-[#664930] hover:text-[#997E67] transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <div
                    onClick={() => setKeepSignedIn(v => !v)}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                      keepSignedIn ? 'bg-[#664930] border-[#664930]' : 'border-[#CCBEB1] group-hover:border-[#997E67]'
                    }`}
                  >
                    {keepSignedIn && <CheckCircle size={10} className="text-white" />}
                  </div>
                  <span className="text-xs text-[#6B7280] font-medium">Keep me signed in on this device <span className="text-[#CCBEB1]">(30 days)</span></span>
                </label>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={loading ? {} : { scale: 1.01, y: -1 }}
                whileTap={loading ? {} : { scale: 0.99 }}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#664930] hover:bg-[#7a5a3a] text-white font-extrabold rounded-xl text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-[#664930]/20"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Authenticating…</span>
                  </>
                ) : (
                  <>
                    <span>Sign in as {ROLE_PRESETS[selectedRole]?.label}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#CCBEB1]/20" />
              <span className="text-[10px] text-[#CCBEB1] font-semibold uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-[#CCBEB1]/20" />
            </div>

            {/* Public portal button */}
            <button
              onClick={() => navigate('/public')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#CCBEB1]/30 bg-[#FAF8F5] text-xs font-bold text-[#6B7280] hover:border-[#997E67]/40 hover:text-[#2F2A26] transition-all cursor-pointer"
            >
              <Globe size={14} />
              <span>Browse Public Statistics Portal</span>
            </button>
          </div>

          {/* Demo hint */}
          <div className="mt-4 p-3 rounded-xl bg-amber-50/80 border border-amber-200/60 text-xs text-amber-700">
            <p className="font-bold mb-1 flex items-center gap-1.5"><Award size={12} /> Demo Mode — Quick Login</p>
            <p className="text-amber-600/80">Click any role card above to auto-fill credentials. Password is <strong>password123</strong> for all roles.</p>
          </div>

          <p className="text-center text-[10px] text-[#CCBEB1] mt-4">
            SRM University AP · Graduate Outcomes Portal · Secured with JWT
          </p>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Login;
