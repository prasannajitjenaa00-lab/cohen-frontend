import React, { useState, useEffect } from 'react';
import { Sparkles, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function WelcomeToast({ user }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Check if welcome flag is set
    const shouldShow = sessionStorage.getItem('showWelcome');
    if (shouldShow === 'true') {
      setVisible(true);
      // Clean up session flag so it only shows once on login
      sessionStorage.removeItem('showWelcome');

      // Auto dismiss after 6 seconds
      const timer = setTimeout(() => {
        dismiss();
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
    }, 400);
  };

  if (!visible) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-4 sm:p-5 text-white shadow-xl shadow-indigo-950/20 border border-indigo-700/50 transition-all duration-400 ease-out ${
        exiting ? 'opacity-0 -translate-y-4 scale-95' : 'animate-welcome-bounce'
      }`}
    >
      {/* Ambient background glow orbs */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex items-start sm:items-center justify-between gap-4">
        {/* Left icon and message */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-2xl shrink-0 shadow-inner">
            <span className="inline-block animate-wave origin-bottom-right">👋</span>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-blue-950">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5 font-sans">
                Welcome back, {user?.name || 'Administrator'}!
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-blue-200 border border-white/20 backdrop-blur-sm">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                {user?.designation ? `${user.designation} • ${user.role}` : user?.role || 'Staff'}
              </span>
            </div>
            <p className="text-xs text-blue-100/80">
              Successfully authenticated to <span className="font-semibold text-white">Cohen International School CRM</span>. Your dashboard is ready!
            </p>
          </div>
        </div>

        {/* Right close button */}
        <button
          onClick={dismiss}
          className="p-1.5 rounded-lg text-blue-200/70 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer focus:outline-none"
          title="Dismiss notification"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress countdown bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-shrink-width" />
      </div>
    </div>
  );
}
