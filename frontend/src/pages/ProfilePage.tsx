import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, Building2, GraduationCap, Hash, Calendar,
  Camera, Trash2, Edit3, Save, X, CheckCircle, ShieldCheck,
  Lock, Eye, EyeOff, RefreshCw, AlertCircle, Upload, BadgeCheck
} from 'lucide-react';

type ProfileTab = 'info' | 'security' | 'phone';

export const ProfilePage: React.FC = () => {
  const { user, updateUserProfile, changePassword, verifyPhoneOTP } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [department] = useState(user?.department || '');
  const [batch] = useState(user?.batch || '');
  const [program] = useState(user?.program || '');
  const [gradYear] = useState(user?.gradYear || '');
  const [regNo] = useState(user?.regNo || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);

  // Security tab
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  // Phone OTP tab
  const [newPhone, setNewPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpError, setOtpError] = useState('');
  const [phoneSuccess, setPhoneSuccess] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const breadcrumbItems = [
    { label: 'Dashboard', path: `/${user?.role}/dashboard` },
    { label: 'My Profile' }
  ];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    updateUserProfile({ name, phone, email, avatar: avatarPreview || undefined });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancelEdit = () => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setEmail(user?.email || '');
    setAvatarPreview(user?.avatar || null);
    setIsEditing(false);
  };

  const handleDeleteAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    if (newPwd.length < 8) { setPwdError('New password must be at least 8 characters.'); return; }
    if (newPwd !== confirmPwd) { setPwdError('Passwords do not match.'); return; }
    setPwdLoading(true);
    const ok = await changePassword(currentPwd, newPwd);
    setPwdLoading(false);
    if (ok) {
      setPwdSuccess(true);
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
      setTimeout(() => setPwdSuccess(false), 3000);
    } else {
      setPwdError('Current password is incorrect. Please try again.');
    }
  };

  const handleSendOTP = () => {
    if (!newPhone.match(/^\+?[0-9]{10,13}$/)) { setOtpError('Enter a valid phone number.'); return; }
    setOtpError('');
    setOtpSent(true);
    setOtpTimer(60);
    const interval = setInterval(() => {
      setOtpTimer(t => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (otp.length !== 6) { setOtpError('Please enter the 6-digit OTP.'); return; }
    setOtpLoading(true);
    const ok = await verifyPhoneOTP(otp);
    setOtpLoading(false);
    if (ok) {
      updateUserProfile({ phone: newPhone, phoneVerified: true });
      setPhoneSuccess(true);
      setOtpSent(false);
      setOtp('');
      setNewPhone('');
    } else {
      setOtpError('Invalid OTP. Please try again. (Hint: use 123456)');
    }
  };

  const tabConfig: { id: ProfileTab; label: string; icon: React.ReactNode }[] = [
    { id: 'info', label: 'Profile Info', icon: <User size={15} /> },
    { id: 'security', label: 'Security', icon: <Lock size={15} /> },
    { id: 'phone', label: 'Phone Verification', icon: <Phone size={15} /> },
  ];

  const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value?: string; verified?: boolean }> = ({
    icon, label, value, verified
  }) => (
    <div className="flex items-center space-x-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#CCBEB1]/20">
      <div className="w-8 h-8 rounded-lg bg-[#FFDBBB]/50 flex items-center justify-center text-[#997E67] flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">{label}</p>
        <p className="text-sm font-bold text-[#2F2A26] truncate">{value || '—'}</p>
      </div>
      {verified !== undefined && (
        <span className={`flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${verified ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
          {verified ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
          <span>{verified ? 'Verified' : 'Unverified'}</span>
        </span>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[#2F2A26]">My Profile</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Manage your account details and security settings</p>
        </div>
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-semibold"
            >
              <CheckCircle size={14} />
              <span>Profile updated!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile Card with Avatar */}
      <div className="bg-white rounded-2xl border border-[#CCBEB1]/20 shadow-sm overflow-hidden mb-5">
        {/* Cover */}
        <div className="h-24 bg-gradient-to-r from-[#664930] via-[#997E67] to-[#CCBEB1] relative" />

        <div className="px-6 pb-5 relative">
          {/* Avatar */}
          <div className="relative -mt-12 mb-4 inline-block">
            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-[#FFDBBB]">
              {avatarPreview ? (
                <img src={avatarPreview} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl font-extrabold text-[#664930]">{user?.name?.charAt(0)}</span>
                </div>
              )}
            </div>
            {isEditing && (
              <div className="absolute -bottom-1 -right-1 flex space-x-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-7 h-7 bg-[#664930] rounded-lg flex items-center justify-center text-white hover:bg-[#997E67] transition-colors cursor-pointer shadow-md"
                  title="Upload photo"
                >
                  <Camera size={13} />
                </button>
                {avatarPreview && (
                  <button
                    onClick={handleDeleteAvatar}
                    className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center text-white hover:bg-red-600 transition-colors cursor-pointer shadow-md"
                    title="Remove photo"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-extrabold font-heading text-[#2F2A26]">{user?.name}</h2>
              <p className="text-sm text-[#6B7280] mt-0.5 capitalize">{user?.role} · {user?.department?.split(' ')[0]}</p>
              <div className="flex items-center space-x-2 mt-2">
                {user?.emailVerified && (
                  <span className="flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 bg-green-50 text-green-600 rounded-full border border-green-100">
                    <BadgeCheck size={10} /><span>Email Verified</span>
                  </span>
                )}
                {user?.phoneVerified && (
                  <span className="flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                    <ShieldCheck size={10} /><span>Phone Verified</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button variant="primary" icon={<Save size={14} />} onClick={handleSaveProfile} className="text-xs py-2">
                    Save
                  </Button>
                  <Button variant="ghost" icon={<X size={14} />} onClick={handleCancelEdit} className="text-xs py-2">
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="outline" icon={<Edit3 size={14} />} onClick={() => setIsEditing(true)} className="text-xs py-2">
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-[#FAF8F5] border border-[#CCBEB1]/20 rounded-xl p-1 mb-5">
        {tabConfig.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-[#664930] shadow-sm border border-[#CCBEB1]/20'
                : 'text-[#6B7280] hover:text-[#2F2A26]'
            }`}
          >
            {tab.icon}<span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* PROFILE INFO TAB */}
        {activeTab === 'info' && (
          <motion.div
            key="info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl border border-[#CCBEB1]/20 shadow-sm p-6 space-y-4"
          >
            <h3 className="text-sm font-extrabold font-heading text-[#2F2A26] mb-4">Personal Information</h3>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} icon={<User size={15} />} />
                  <Input label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} icon={<Phone size={15} />} />
                </div>
                <Input label="Email Address" value={email} onChange={e => setEmail(e.target.value)} icon={<Mail size={15} />} type="email" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Department" value={department} disabled icon={<Building2 size={15} />} />
                  <Input label="Program" value={program || 'B.Tech'} disabled icon={<GraduationCap size={15} />} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Registration No." value={regNo} disabled icon={<Hash size={15} />} />
                  <Input label="Batch / Year" value={batch} disabled icon={<Calendar size={15} />} />
                </div>
                <p className="text-[10px] text-[#6B7280] bg-[#FAF8F5] border border-[#CCBEB1]/20 rounded-lg p-3">
                  <AlertCircle size={10} className="inline mr-1.5 text-[#997E67]" />
                  Registration Number, Department, Program, and Batch are managed by the SRM registrar and cannot be edited here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <InfoRow icon={<User size={15} />} label="Full Name" value={user?.name} />
                  <InfoRow icon={<Hash size={15} />} label="Reg. Number" value={user?.regNo} />
                  <InfoRow icon={<Mail size={15} />} label="Email" value={user?.email} verified={user?.emailVerified} />
                  <InfoRow icon={<Phone size={15} />} label="Phone" value={user?.phone} verified={user?.phoneVerified} />
                  <InfoRow icon={<Building2 size={15} />} label="Department" value={user?.department} />
                  <InfoRow icon={<GraduationCap size={15} />} label="Program" value={user?.program || 'B.Tech'} />
                  <InfoRow icon={<Calendar size={15} />} label="Batch" value={user?.batch} />
                  <InfoRow icon={<Calendar size={15} />} label="Graduation Year" value={user?.gradYear} />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl border border-[#CCBEB1]/20 shadow-sm p-6"
          >
            <h3 className="text-sm font-extrabold font-heading text-[#2F2A26] mb-1">Change Password</h3>
            <p className="text-xs text-[#6B7280] mb-5">Use a strong, unique password with at least 8 characters.</p>

            <AnimatePresence>
              {pwdSuccess && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center space-x-2 p-3 mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-semibold">
                  <CheckCircle size={14} /><span>Password updated successfully!</span>
                </motion.div>
              )}
              {pwdError && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center space-x-2 p-3 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                  <AlertCircle size={14} /><span>{pwdError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* Current Password */}
              <div className="relative">
                <Input
                  label="Current Password"
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPwd}
                  onChange={e => setCurrentPwd(e.target.value)}
                  icon={<Lock size={15} />}
                  placeholder="Enter current password"
                />
                <button type="button" onClick={() => setShowCurrent(v => !v)}
                  className="absolute right-3 top-9 text-[#997E67] hover:text-[#664930] transition-colors cursor-pointer">
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* New Password */}
              <div className="relative">
                <Input
                  label="New Password"
                  type={showNew ? 'text' : 'password'}
                  value={newPwd}
                  onChange={e => setNewPwd(e.target.value)}
                  icon={<Lock size={15} />}
                  placeholder="At least 8 characters"
                />
                <button type="button" onClick={() => setShowNew(v => !v)}
                  className="absolute right-3 top-9 text-[#997E67] hover:text-[#664930] transition-colors cursor-pointer">
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Password strength */}
              {newPwd.length > 0 && (
                <div className="space-y-1">
                  <div className="flex space-x-1">
                    {[newPwd.length >= 8, /[A-Z]/.test(newPwd), /[0-9]/.test(newPwd), /[^a-zA-Z0-9]/.test(newPwd)].map((met, i) => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${met ? 'bg-[#664930]' : 'bg-[#CCBEB1]/30'}`} />
                    ))}
                  </div>
                  <p className="text-[10px] text-[#6B7280]">
                    {[newPwd.length >= 8, /[A-Z]/.test(newPwd), /[0-9]/.test(newPwd), /[^a-zA-Z0-9]/.test(newPwd)].filter(Boolean).length} / 4 strength requirements met
                  </p>
                </div>
              )}

              {/* Confirm Password */}
              <div className="relative">
                <Input
                  label="Confirm New Password"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPwd}
                  onChange={e => setConfirmPwd(e.target.value)}
                  icon={<Lock size={15} />}
                  placeholder="Repeat new password"
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-9 text-[#997E67] hover:text-[#664930] transition-colors cursor-pointer">
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                {confirmPwd && newPwd && (
                  <p className={`text-[10px] mt-1 font-semibold ${newPwd === confirmPwd ? 'text-green-600' : 'text-red-500'}`}>
                    {newPwd === confirmPwd ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              <Button type="submit" isLoading={pwdLoading} icon={<ShieldCheck size={14} />}>
                Update Password
              </Button>
            </form>
          </motion.div>
        )}

        {/* PHONE VERIFICATION TAB */}
        {activeTab === 'phone' && (
          <motion.div
            key="phone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl border border-[#CCBEB1]/20 shadow-sm p-6"
          >
            <h3 className="text-sm font-extrabold font-heading text-[#2F2A26] mb-1">Phone Number Verification</h3>
            <p className="text-xs text-[#6B7280] mb-5">Verify your phone number for enhanced account security and notifications.</p>

            {/* Current Status */}
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#CCBEB1]/20 mb-5 flex items-center space-x-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${user?.phoneVerified ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                {user?.phoneVerified ? <CheckCircle size={17} /> : <AlertCircle size={17} />}
              </div>
              <div>
                <p className="text-xs font-bold text-[#2F2A26]">{user?.phone || 'No phone registered'}</p>
                <p className={`text-[10px] font-semibold ${user?.phoneVerified ? 'text-green-600' : 'text-amber-600'}`}>
                  {user?.phoneVerified ? 'Phone number is verified' : 'Phone number is not verified'}
                </p>
              </div>
            </div>

            <AnimatePresence>
              {phoneSuccess && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center space-x-2 p-3 mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-semibold">
                  <CheckCircle size={14} /><span>Phone number verified successfully!</span>
                </motion.div>
              )}
              {otpError && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center space-x-2 p-3 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                  <AlertCircle size={14} /><span>{otpError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {!otpSent ? (
                <>
                  <Input
                    label="New Phone Number"
                    placeholder="+91 98765 43210"
                    value={newPhone}
                    onChange={e => { setNewPhone(e.target.value); setOtpError(''); }}
                    icon={<Phone size={15} />}
                    type="tel"
                  />
                  <Button onClick={handleSendOTP} icon={<Phone size={14} />}>
                    Send OTP
                  </Button>
                </>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 font-medium">
                    A 6-digit OTP has been sent to <strong>{newPhone}</strong>.
                    {' '}(Demo: use <strong>123456</strong>)
                  </div>

                  {/* OTP Input boxes */}
                  <div>
                    <label className="block text-xs font-semibold text-[#2F2A26] mb-2">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                      className="w-full text-center text-2xl font-extrabold tracking-[0.5em] border-2 border-[#CCBEB1] rounded-xl py-3 bg-[#FAF8F5] focus:outline-none focus:border-[#664930] text-[#2F2A26]"
                      placeholder="——————"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" isLoading={otpLoading} className="flex-1" icon={<CheckCircle size={14} />}>
                      Verify OTP
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={otpTimer > 0}
                      onClick={handleSendOTP}
                      icon={<RefreshCw size={14} />}
                      className="flex-1"
                    >
                      {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend OTP'}
                    </Button>
                  </div>
                  <button type="button" onClick={() => { setOtpSent(false); setOtp(''); setOtpError(''); }}
                    className="text-xs text-[#997E67] hover:text-[#664930] transition-colors cursor-pointer font-semibold">
                    ← Change phone number
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
