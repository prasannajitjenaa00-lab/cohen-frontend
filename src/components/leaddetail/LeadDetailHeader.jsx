import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Phone,
  Mail,
  Copy,
  CheckCircle2,
  Sparkles,
  Loader2
} from 'lucide-react';

export default function LeadDetailHeader({
  lead,
  actionLoading,
  initiateAdmission
}) {
  const initials = lead.studentName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const [copied, setCopied] = React.useState(null);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 1500);
  };

  const priorityConfig = {
    Low: { bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400' },
    Medium: { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500' },
    High: { bg: 'bg-orange-50', text: 'text-orange-600', dot: 'bg-orange-500' },
    Urgent: { bg: 'bg-rose-50', text: 'text-rose-600', dot: 'bg-rose-500 animate-pulse' }
  };

  const pConfig = priorityConfig[lead.priority] || priorityConfig.Medium;

  const showAdmissionBtn = !['Application Started', 'Application Submitted', 'Admission Confirmed'].includes(lead.status);

  return (
    <div className="glass-card overflow-hidden">
      {/* Gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-500" />

      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Left: Back + Avatar + Info */}
          <div className="flex items-start gap-4">
            <Link
              to="/leads"
              className="mt-1 p-2 border border-gray-200 bg-white rounded-xl text-slate-400 hover:text-brand-500 hover:border-brand-200 hover:shadow-sm transition-all duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </Link>

            {/* Avatar */}
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <span className="text-lg font-bold text-white tracking-wide">{initials}</span>
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                <div className={`w-2.5 h-2.5 rounded-full ${pConfig.dot}`} />
              </div>
            </div>

            {/* Name + Meta */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">{lead.studentName}</h1>
                <span className="text-[10px] font-bold bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200/60 px-2 py-0.5 rounded-md text-brand-600 font-mono">
                  {lead.leadId}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${pConfig.bg} ${pConfig.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${pConfig.dot}`} />
                  {lead.priority}
                </span>
              </div>

              {/* Meta chips */}
              <div className="flex items-center gap-2 flex-wrap text-[11px]">
                <span className="inline-flex items-center gap-1 text-slate-500">
                  <GraduationCap className="w-3.5 h-3.5 text-brand-400" />
                  <span className="font-medium text-slate-600">{lead.classInterested}</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-medium">{lead.academicYear}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">
                  Source: <span className="font-semibold text-slate-600">{lead.leadSource}</span>
                </span>
                {lead.assignedCounsellor && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">
                      Advisor: <span className="font-semibold text-indigo-600">{lead.assignedCounsellor.name}</span>
                    </span>
                  </>
                )}
              </div>

              {/* Quick contact chips */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => copyToClipboard(lead.phone, 'phone')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-[11px] text-slate-600 font-mono hover:bg-brand-50 hover:border-brand-200 hover:text-brand-600 transition-all duration-200 cursor-pointer group"
                >
                  <Phone className="w-3 h-3 text-slate-400 group-hover:text-brand-500" />
                  {lead.phone}
                  {copied === 'phone' ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-300 group-hover:text-brand-400" />
                  )}
                </button>
                {lead.email && (
                  <button
                    onClick={() => copyToClipboard(lead.email, 'email')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-[11px] text-slate-600 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-600 transition-all duration-200 cursor-pointer group"
                  >
                    <Mail className="w-3 h-3 text-slate-400 group-hover:text-brand-500" />
                    <span className="truncate max-w-[140px]">{lead.email}</span>
                    {copied === 'email' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-300 group-hover:text-brand-400" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Admission CTA */}
          {showAdmissionBtn && (
            <button
              onClick={initiateAdmission}
              disabled={actionLoading}
              className="self-start flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 active:scale-[0.97] transition-all duration-200 cursor-pointer group disabled:opacity-60"
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>Initiate Admission</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
