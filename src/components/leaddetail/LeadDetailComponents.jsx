import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  User,
  Loader2,
  PhoneCall,
  ClipboardList
} from 'lucide-react';

export function StageTracker({
  pipelineStatuses,
  currentStatusIndex,
  handleStatusChange
}) {
  return (
    <div className="glass-card p-5">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Admissions Stage Tracker</h4>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 overflow-x-auto pb-2">
        {pipelineStatuses.map((status, index) => {
          const isCompleted = index < currentStatusIndex;
          const isActive = index === currentStatusIndex;

          return (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`flex items-center gap-2 text-left md:text-center md:flex-col md:flex-1 p-2 rounded-lg transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-500/10 border border-brand-500/20 text-brand-400'
                  : isCompleted
                  ? 'text-slate-300'
                  : 'text-slate-600 hover:text-slate-400'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                isActive
                  ? 'border-brand-500 bg-brand-550 text-white'
                  : isCompleted
                  ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400'
                  : 'border-gray-300 bg-gray-100 text-slate-500'
              }`}>
                {index + 1}
              </div>
              <span className="text-[10px] font-semibold tracking-wide whitespace-nowrap">{status}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LeadProfileCards({ lead }) {
  return (
    <div className="space-y-6">
      {/* Student Profile Card */}
      <div className="glass-card p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-700 border-b border-gray-200 pb-2 uppercase tracking-wider">
          Student Info
        </h3>
        
        <div className="space-y-3.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Student Name</span>
            <span className="text-slate-600 font-medium">{lead.studentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Parent Name</span>
            <span className="text-slate-600 font-medium">{lead.parentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Priority Level</span>
            <span className={`priority-badge priority-${lead.priority.toLowerCase()}`}>
              {lead.priority}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Origin Channel</span>
            <span className="text-slate-600 font-medium">{lead.leadSource}</span>
          </div>
          {lead.campaign && (
            <div className="flex justify-between">
              <span className="text-slate-500">Campaign</span>
              <span className="text-slate-600 font-medium truncate max-w-[120px]" title={lead.campaign}>
                {lead.campaign}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-500">Assigned Advisor</span>
            <span className="text-slate-600 font-medium">
              {lead.assignedCounsellor ? lead.assignedCounsellor.name : 'Unassigned'}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Details Card */}
      <div className="glass-card p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-700 border-b border-gray-200 pb-2 uppercase tracking-wider">
          Contact Details
        </h3>

        <div className="space-y-3.5 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-slate-500">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500">Primary Phone</p>
              <p className="text-slate-700 font-medium font-mono">{lead.phone}</p>
            </div>
          </div>

          {lead.alternatePhone && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-slate-500">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500">Alternate Phone</p>
                <p className="text-slate-700 font-medium font-mono">{lead.alternatePhone}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500">Email Address</p>
              <p className="text-slate-700 font-medium truncate" title={lead.email}>{lead.email || 'No email registered'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-slate-500">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500">Location Address</p>
              <p className="text-slate-700 font-medium">
                {lead.address ? `${lead.address}, ${lead.city}, ${lead.state}` : 'No address registered'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EngagementLogger({
  activeTab,
  setActiveTab,
  actionLoading,
  handleAddNote,
  noteContent,
  setNoteContent,
  handleLogCall,
  callForm,
  setCallForm,
  handleScheduleFollowUp,
  followUpForm,
  setFollowUpForm
}) {
  return (
    <div className="glass-card overflow-hidden">
      {/* Tab selector */}
      <div className="flex border-b border-slate-800/80 bg-gray-50/50">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'notes' ? 'text-brand-400 border-b-2 border-brand-500 bg-gray-50' : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Write Note</span>
        </button>
        <button
          onClick={() => setActiveTab('calls')}
          className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'calls' ? 'text-brand-400 border-b-2 border-brand-500 bg-gray-50' : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>Log Call</span>
        </button>
        <button
          onClick={() => setActiveTab('followups')}
          className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'followups' ? 'text-brand-400 border-b-2 border-brand-500 bg-gray-50' : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Schedule Follow-up</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-5">
        {/* Tab 1: Write Note */}
        {activeTab === 'notes' && (
          <form onSubmit={handleAddNote} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Internal Comment / Note</label>
              <textarea
                rows={3}
                required
                placeholder="Enter specific comments from interaction or additional observations..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full glass-input text-xs"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={actionLoading}
                className="glass-btn-primary px-4 py-1.5 text-xs font-semibold flex items-center gap-2"
              >
                {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Note</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Log Call */}
        {activeTab === 'calls' && (
          <form onSubmit={handleLogCall} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Call Outcome</label>
                <select
                  value={callForm.outcome}
                  onChange={(e) => setCallForm({ ...callForm, outcome: e.target.value })}
                  className="w-full glass-input text-xs"
                >
                  <option>Connected</option>
                  <option>Busy</option>
                  <option>Switch Off</option>
                  <option>Not Reachable</option>
                  <option>RNR (Ring No Response)</option>
                  <option>Call Back</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Call Duration (seconds)</label>
                <input
                  type="number"
                  placeholder="e.g. 120"
                  value={callForm.duration}
                  onChange={(e) => setCallForm({ ...callForm, duration: e.target.value })}
                  className="w-full glass-input text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Conversation Details</label>
              <textarea
                rows={3}
                required
                placeholder="Summarize details discussed, parent concerns, fee queries, etc..."
                value={callForm.summary}
                onChange={(e) => setCallForm({ ...callForm, summary: e.target.value })}
                className="w-full glass-input text-xs"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={actionLoading}
                className="glass-btn-primary px-4 py-1.5 text-xs font-semibold flex items-center gap-2"
              >
                {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Log Call Details</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Schedule Follow-up */}
        {activeTab === 'followups' && (
          <form onSubmit={handleScheduleFollowUp} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Follow-up Date</label>
                <input
                  type="date"
                  required
                  value={followUpForm.date}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, date: e.target.value })}
                  className="w-full glass-input text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Follow-up Time</label>
                <input
                  type="time"
                  required
                  value={followUpForm.time}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, time: e.target.value })}
                  className="w-full glass-input text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Interaction Type</label>
                <select
                  value={followUpForm.type}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, type: e.target.value })}
                  className="w-full glass-input text-xs"
                >
                  <option>Call</option>
                  <option>WhatsApp</option>
                  <option>SMS</option>
                  <option>School Visit</option>
                  <option>Meeting</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Task / Remarks</label>
              <textarea
                rows={2}
                placeholder="Remarks for next interaction (e.g. parents will visit to submit documents)..."
                value={followUpForm.notes}
                onChange={(e) => setFollowUpForm({ ...followUpForm, notes: e.target.value })}
                className="w-full glass-input text-xs"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={actionLoading}
                className="glass-btn-primary px-4 py-1.5 text-xs font-semibold flex items-center gap-2"
              >
                {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Set Follow-up Task</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function ActivityTimeline({ timeline }) {
  return (
    <div className="glass-card p-5 space-y-4">
      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-gray-200 pb-2">
        Lead Activity Timeline
      </h3>

      {timeline.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-500">No activity logged yet</div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
          {timeline.map((item, index) => {
            let badgeColor = 'bg-gray-100 text-slate-500 border-gray-200';
            
            if (item.eventType === 'Created') badgeColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
            if (item.eventType === 'Assigned') badgeColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
            if (item.eventType === 'StatusChange') badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            if (item.eventType === 'CallLogged') badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            if (item.eventType === 'NoteAdded') badgeColor = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            if (item.eventType === 'FollowUpCreated') badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';

            return (
              <div key={item._id || index} className="relative flex gap-4 text-xs">
                {/* Timeline dot */}
                <span className={`absolute -left-[20px] top-1.5 h-3.5 w-3.5 rounded-full border-2 bg-white flex items-center justify-center ${
                  item.eventType === 'CallLogged' ? 'border-emerald-500' :
                  item.eventType === 'StatusChange' ? 'border-amber-500' :
                  item.eventType === 'NoteAdded' ? 'border-purple-500' :
                  'border-slate-700'
                }`}></span>

                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className={`status-pill ${badgeColor}`}>
                      {item.eventType}
                    </span>
                    <span className="text-[10px] text-slate-550 font-mono">
                      {new Date(item.createdAt).toLocaleDateString()} at{' '}
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 font-medium">{item.message}</p>
                  
                  {item.user && (
                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-655" />
                      <span>Action by: {item.user.name} ({item.user.role})</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
