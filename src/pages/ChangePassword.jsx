import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, KeyRound, Loader2, Eye, EyeOff, LogOut, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function ChangePassword() {
  const { user, changePassword, logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation password do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from the current password.');
      return;
    }

    if (user?.mobile && newPassword.trim() === user.mobile.trim()) {
      setError('New password must be different from your initial mobile-number password.');
      return;
    }

    setLoading(true);
    const result = await changePassword(currentPassword, newPassword, confirmPassword);
    setLoading(false);

    if (result.success) {
      sessionStorage.setItem('showWelcome', 'true');
      sessionStorage.setItem('welcomeName', result.user?.name || user?.name || '');
      sessionStorage.setItem('welcomeRole', result.user?.designation ? `${result.user.designation} • ${result.user.role}` : (user?.designation ? `${user.designation} • ${user.role}` : 'SUPER_USER'));
      setSuccess('Password updated successfully! Redirecting to CRM dashboard...');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1000);
    } else {
      setError(result.message || 'Failed to update password.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const displayName = user?.name || sessionStorage.getItem('welcomeName') || 'Administrator';
  const displayRole = user?.designation ? `${user.designation}` : (sessionStorage.getItem('welcomeRole') || user?.role || '');

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Background glowing ambient light */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md z-10 animate-fade-in py-8">
        {/* Brand Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="bg-white p-3 rounded-2xl shadow-2xl border border-white/20 inline-block mb-3 max-w-[280px]">
            <img src="/logo.png" alt="Cohen International School" className="h-14 w-auto object-contain mx-auto" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-200 text-xs font-semibold mb-3 animate-welcome-bounce shadow-lg">
            <span className="text-sm inline-block animate-wave origin-bottom-right">👋</span>
            <span>Welcome, <strong className="text-yellow-300 font-bold">{displayName}</strong></span>
            {displayRole && <span className="text-blue-300/80 font-normal">({displayRole})</span>}
          </div>

          <h2 className="text-xl font-bold text-slate-100">Set Permanent Password</h2>
          <p className="text-xs text-slate-400 mt-1">
            Please choose a secure personal password for your first login.
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-card bg-slate-900/70 p-8 border border-slate-800/80 shadow-2xl relative rounded-2xl">
          {/* Security Notice Banner */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 mb-6">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Initial Password Change Required</p>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                For security reasons, please change your initial temporary password before continuing to the CRM portal.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-semibold">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">
                Current Password <span className="text-slate-500 font-normal">(Initial Mobile Number)</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-10 glass-input"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label={showCurrent ? 'Hide password' : 'Show password'}
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">New Password</label>
              <div className="relative flex items-center">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-10 glass-input"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label={showNew ? 'Hide password' : 'Show password'}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Confirm New Password</label>
              <div className="relative flex items-center">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-10 glass-input"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 mt-6 glass-btn-primary py-2.5 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Save Password & Access CRM</span>
              )}
            </button>

            {/* Logout Option */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 pt-3 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out of this session</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
