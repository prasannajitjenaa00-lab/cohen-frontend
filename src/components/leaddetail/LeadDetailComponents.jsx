import React, { useState } from 'react';
import {
  Phone, Mail, MapPin, Clock, User, Loader2, PhoneCall,
  ClipboardList, Eye, CheckCircle2, AlertCircle, Calendar,
  MessageSquare, ArrowUpRight, Filter, Hash, Briefcase, Zap
} from 'lucide-react';

/* ─── Stage Tracker (Redesigned Horizontal Stepper) ─── */
export function StageTracker({ user, pipelineStatuses, currentStatusIndex, handleStatusChange }) {
  const canUpdateStatus = ['Counsellor', 'Senior Zonal Manager'].includes(user?.role);

  return (
    <div className="glass-card p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-brand-400" />
          Admissions Pipeline
          {!canUpdateStatus && (
            <span className="text-[9px] font-normal text-slate-400 normal-case bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
              Read-Only
            </span>
          )}
        </h4>
        <span className="text-[10px] font-bold text-brand-500 bg-brand-50 border border-brand-200/50 px-2.5 py-0.5 rounded-full">
          Step {currentStatusIndex + 1} of {pipelineStatuses.length}
        </span>
      </div>

      {/* Progress bar background */}
      <div className="relative mb-6">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 rounded-full" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${(currentStatusIndex / (pipelineStatuses.length - 1)) * 100}%` }}
        />

        <div className="relative flex justify-between">
          {pipelineStatuses.map((status, index) => {
            const isCompleted = index < currentStatusIndex;
            const isActive = index === currentStatusIndex;

            return (
              <button
                key={status}
                disabled={!canUpdateStatus}
                onClick={() => canUpdateStatus && handleStatusChange(status)}
                className={`flex flex-col items-center gap-1.5 group ${canUpdateStatus ? 'cursor-pointer' : 'cursor-default'}`}
                title={canUpdateStatus ? `Change status to ${status}` : `${status} (Read-only)`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all duration-300 ${
                  isActive
                    ? 'border-brand-500 bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-lg shadow-brand-500/30 scale-110'
                    : isCompleted
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-500'
                    : 'border-gray-200 bg-white text-slate-400 group-hover:border-brand-300 group-hover:text-brand-400'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : index + 1}
                </div>
                <span className={`text-[9px] font-semibold tracking-wide whitespace-nowrap max-w-[70px] text-center leading-tight ${
                  isActive ? 'text-brand-600' : isCompleted ? 'text-indigo-500' : 'text-slate-400'
                }`}>
                  {status}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Lead Profile Cards (Redesigned Left Sidebar) ─── */
export function LeadProfileCards({ lead }) {
  return (
    <div className="space-y-5">
      {/* Student Information Card */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <h3 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-brand-400" />
            Student Information
          </h3>
        </div>
        <div className="p-5 space-y-0">
          {[
            { label: 'Student Name', value: lead.studentName, icon: '🎓' },
            { label: 'Parent / Guardian', value: lead.parentName, icon: '👤' },
            { label: 'Class Interested', value: lead.classInterested, icon: '📚' },
            { label: 'Academic Year', value: lead.academicYear, icon: '📅' },
            { label: 'Origin Channel', value: lead.leadSource, icon: '📡' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
              <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span className="text-xs">{item.icon}</span>
                {item.label}
              </span>
              <span className="text-[11px] font-semibold text-slate-700 text-right max-w-[130px] truncate">{item.value}</span>
            </div>
          ))}

          {/* Priority */}
          <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
            <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <span className="text-xs">⚡</span> Priority
            </span>
            <span className={`priority-badge priority-${lead.priority?.toLowerCase()}`}>{lead.priority}</span>
          </div>

          {/* Advisor */}
          <div className="flex items-center justify-between py-2.5">
            <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <span className="text-xs">🧑‍💼</span> Advisor
            </span>
            <span className="text-[11px] font-semibold text-indigo-600">
              {lead.assignedCounsellor?.name || <span className="text-slate-400 italic">Unassigned</span>}
            </span>
          </div>

          {lead.campaign && (
            <div className="flex items-center justify-between py-2.5 border-t border-gray-100">
              <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span className="text-xs">📢</span> Campaign
              </span>
              <span className="text-[11px] font-semibold text-slate-600 truncate max-w-[120px]" title={lead.campaign}>
                {lead.campaign}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Google Ads Attribution Card (if applicable) */}
      {(lead.leadSource === 'Google Ads' || lead.leadSource === 'Google' || lead.gclid || lead.googleLeadId) && (
        <div className="glass-card overflow-hidden border border-blue-100">
          <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-blue-900 uppercase tracking-widest flex items-center gap-1.5">
              <span>🎯</span> Google Ads Attribution
            </h3>
            <span className="text-[9px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
              Live Click
            </span>
          </div>
          <div className="p-4 space-y-2 text-xs">
            {lead.gclid && (
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Google Click ID (GCLID)</span>
                <p className="font-mono text-[10px] text-slate-700 bg-gray-50 p-1.5 rounded border border-gray-200 truncate" title={lead.gclid}>
                  {lead.gclid}
                </p>
              </div>
            )}
            {lead.googleLeadId && (
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-[10px] text-slate-500">Google Lead ID:</span>
                <span className="font-mono text-[10px] font-bold text-slate-700">{lead.googleLeadId}</span>
              </div>
            )}
            {lead.googleFormId && (
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-[10px] text-slate-500">Lead Form ID:</span>
                <span className="font-mono text-[10px] text-slate-600">{lead.googleFormId}</span>
              </div>
            )}
            {lead.googleCampaignId && (
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-[10px] text-slate-500">Campaign ID:</span>
                <span className="font-mono text-[10px] text-slate-600">{lead.googleCampaignId}</span>
              </div>
            )}
            {lead.utmMedium && (
              <div className="flex justify-between items-center py-1">
                <span className="text-[10px] text-slate-500">UTM Medium:</span>
                <span className="text-[10px] font-semibold text-slate-600">{lead.utmMedium}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact Card */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <h3 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-emerald-500" />
            Contact Details
          </h3>
        </div>
        <div className="p-5 space-y-3.5">
          <ContactRow icon={<Phone className="w-4 h-4" />} label="Primary Phone" value={lead.phone} mono color="emerald" />
          {lead.alternatePhone && (
            <ContactRow icon={<Phone className="w-4 h-4" />} label="Alternate Phone" value={lead.alternatePhone} mono color="emerald" />
          )}
          <ContactRow icon={<Mail className="w-4 h-4" />} label="Email Address" value={lead.email || 'Not provided'} color="blue" />
          <ContactRow
            icon={<MapPin className="w-4 h-4" />}
            label="Location"
            value={lead.address ? `${lead.address}, ${lead.city || ''}, ${lead.state || ''}` : 'Not provided'}
            color="orange"
          />
        </div>
      </div>

      {/* Quick Stats Mini Card */}
      <div className="glass-card p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-brand-50/50 rounded-xl border border-brand-100">
            <p className="text-lg font-extrabold text-brand-600">{lead.status || 'New'}</p>
            <p className="text-[9px] text-brand-400 font-bold uppercase tracking-wider mt-0.5">Current Stage</p>
          </div>
          <div className="text-center p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
            <p className="text-lg font-extrabold text-indigo-600">
              {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString([], { month: 'short', day: '2-digit' }) : '—'}
            </p>
            <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider mt-0.5">Created On</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactRow({ icon, label, value, mono, color = 'slate' }) {
  const colorMap = {
    emerald: 'bg-emerald-50 border-emerald-200/50 text-emerald-500',
    blue: 'bg-blue-50 border-blue-200/50 text-blue-500',
    orange: 'bg-orange-50 border-orange-200/50 text-orange-500',
    slate: 'bg-gray-50 border-gray-200 text-slate-500',
  };

  return (
    <div className="flex items-center gap-3 group">
      <div className={`p-2 rounded-xl border ${colorMap[color]} transition-all`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-slate-400 font-medium">{label}</p>
        <p className={`text-[12px] text-slate-700 font-semibold truncate ${mono ? 'font-mono' : ''}`}>{value}</p>
      </div>
    </div>
  );
}

/* ─── Engagement Logger (Redesigned Tab Panel) ─── */
export function EngagementLogger({
  user, activeTab, setActiveTab, actionLoading,
  handleAddNote, noteContent, setNoteContent,
  handleLogCall, callForm, setCallForm,
  handleScheduleFollowUp, followUpForm, setFollowUpForm
}) {
  const canLogEngagement = ['Counsellor', 'Senior Zonal Manager'].includes(user?.role);

  const tabs = [
    { id: 'notes', label: 'Write Note', icon: MessageSquare, color: 'purple' },
    { id: 'calls', label: 'Log Call', icon: PhoneCall, color: 'emerald' },
    { id: 'followups', label: 'Follow-up', icon: Calendar, color: 'blue' },
  ];

  // Admin read-only view
  if (!canLogEngagement) {
    return (
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <ClipboardList className="w-3.5 h-3.5 text-slate-400" /> Engagement Logger
          </span>
        </div>
        <div className="p-8 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 mb-2">
            <Eye className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm font-bold text-slate-600">View-Only Access</p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Only assigned staff and counsellors can add notes, log calls, and schedule follow-ups. Review activity in the timeline below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Tab buttons */}
      <div className="flex border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3.5 text-[11px] font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer relative ${
                isActive ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      <div className="p-5">
        {activeTab === 'notes' && (
          <form onSubmit={handleAddNote} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Internal Note</label>
              <textarea
                rows={3} required placeholder="Enter specific comments from interaction or observations..."
                value={noteContent} onChange={(e) => setNoteContent(e.target.value)}
                className="w-full glass-input text-xs resize-none"
              />
            </div>
            <div className="flex justify-end">
              <SubmitBtn loading={actionLoading} label="Save Note" icon={<MessageSquare className="w-3.5 h-3.5" />} />
            </div>
          </form>
        )}

        {activeTab === 'calls' && (
          <form onSubmit={handleLogCall} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Call Outcome">
                <select value={callForm.outcome} onChange={(e) => setCallForm({ ...callForm, outcome: e.target.value })} className="w-full glass-input text-xs">
                  {['Connected', 'Busy', 'Switch Off', 'Not Reachable', 'RNR (Ring No Response)', 'Call Back'].map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Duration (seconds)">
                <input type="number" placeholder="e.g. 120" value={callForm.duration}
                  onChange={(e) => setCallForm({ ...callForm, duration: e.target.value })}
                  className="w-full glass-input text-xs" />
              </FormField>
            </div>
            <FormField label="Conversation Summary">
              <textarea rows={3} required placeholder="Summarize details discussed, parent concerns, fee queries..."
                value={callForm.summary} onChange={(e) => setCallForm({ ...callForm, summary: e.target.value })}
                className="w-full glass-input text-xs resize-none" />
            </FormField>
            <div className="flex justify-end">
              <SubmitBtn loading={actionLoading} label="Log Call" icon={<PhoneCall className="w-3.5 h-3.5" />} />
            </div>
          </form>
        )}

        {activeTab === 'followups' && (
          <form onSubmit={handleScheduleFollowUp} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField label="Date">
                <input type="date" required value={followUpForm.date}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, date: e.target.value })}
                  className="w-full glass-input text-xs" />
              </FormField>
              <FormField label="Time">
                <input type="time" required value={followUpForm.time}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, time: e.target.value })}
                  className="w-full glass-input text-xs" />
              </FormField>
              <FormField label="Type">
                <select value={followUpForm.type} onChange={(e) => setFollowUpForm({ ...followUpForm, type: e.target.value })}
                  className="w-full glass-input text-xs">
                  {['Call', 'WhatsApp', 'SMS', 'School Visit', 'Meeting'].map(t => <option key={t}>{t}</option>)}
                </select>
              </FormField>
            </div>
            <FormField label="Remarks">
              <textarea rows={2} placeholder="Notes for next interaction..."
                value={followUpForm.notes} onChange={(e) => setFollowUpForm({ ...followUpForm, notes: e.target.value })}
                className="w-full glass-input text-xs resize-none" />
            </FormField>
            <div className="flex justify-end">
              <SubmitBtn loading={actionLoading} label="Schedule Task" icon={<Calendar className="w-3.5 h-3.5" />} />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function SubmitBtn({ loading, label, icon }) {
  return (
    <button type="submit" disabled={loading}
      className="glass-btn-primary px-5 py-2 text-xs font-bold flex items-center gap-2 rounded-xl shadow-md shadow-brand-500/10 disabled:opacity-60">
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : icon}
      <span>{label}</span>
    </button>
  );
}

/* ─── Activity Timeline (Redesigned) ─── */
export function ActivityTimeline({ timeline }) {
  const [filter, setFilter] = useState('All');

  const eventConfig = {
    Created: { color: 'cyan', icon: Zap, label: 'Created' },
    Assigned: { color: 'indigo', icon: ArrowUpRight, label: 'Assigned' },
    StatusChange: { color: 'amber', icon: AlertCircle, label: 'Status Change' },
    CallLogged: { color: 'emerald', icon: PhoneCall, label: 'Call Logged' },
    NoteAdded: { color: 'purple', icon: MessageSquare, label: 'Note Added' },
    FollowUpCreated: { color: 'blue', icon: Calendar, label: 'Follow-up' },
    DuplicateCheck: { color: 'rose', icon: Hash, label: 'Duplicate' },
  };

  const colorStyles = {
    cyan:    { dot: 'border-cyan-400 bg-cyan-50', badge: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
    indigo:  { dot: 'border-indigo-400 bg-indigo-50', badge: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    amber:   { dot: 'border-amber-400 bg-amber-50', badge: 'bg-amber-50 text-amber-600 border-amber-200' },
    emerald: { dot: 'border-emerald-400 bg-emerald-50', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    purple:  { dot: 'border-purple-400 bg-purple-50', badge: 'bg-purple-50 text-purple-600 border-purple-200' },
    blue:    { dot: 'border-blue-400 bg-blue-50', badge: 'bg-blue-50 text-blue-600 border-blue-200' },
    rose:    { dot: 'border-rose-400 bg-rose-50', badge: 'bg-rose-50 text-rose-600 border-rose-200' },
  };

  const filteredTimeline = filter === 'All'
    ? timeline
    : timeline.filter(item => item.eventType === filter);

  const filterOptions = ['All', ...Object.keys(eventConfig)];

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 py-3.5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-brand-400" />
          Activity Timeline
        </h3>
        <div className="flex items-center gap-1.5">
          <Filter className="w-3 h-3 text-slate-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-[10px] font-semibold text-slate-500 bg-transparent border-0 focus:outline-none cursor-pointer pr-4"
          >
            {filterOptions.map(f => (
              <option key={f} value={f}>{f === 'All' ? 'All Activity' : eventConfig[f]?.label || f}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-5">
        {filteredTimeline.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400 space-y-2">
            <Clock className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-medium">No activity logged yet</p>
          </div>
        ) : (
          <div className="relative pl-7 space-y-5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-brand-200 before:via-gray-200 before:to-transparent">
            {filteredTimeline.map((item, index) => {
              const config = eventConfig[item.eventType] || { color: 'slate', icon: AlertCircle, label: item.eventType };
              const styles = colorStyles[config.color] || colorStyles.amber;
              const Icon = config.icon;

              return (
                <div key={item._id || index} className="relative group">
                  {/* Timeline dot */}
                  <span className={`absolute -left-[22px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${styles.dot} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-2 h-2" />
                  </span>

                  <div className="p-3 rounded-xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-200 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${styles.badge}`}>
                        {config.label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' })}
                        {' · '}
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-700 font-medium leading-relaxed">{item.message}</p>

                    {item.user && (
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {item.user.name} · {item.user.role}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
