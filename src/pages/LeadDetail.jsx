import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  User,
  Plus,
  Loader2,
  PhoneCall,
  FileEdit,
  ClipboardList,
  ChevronRight,
  TrendingUp,
  MessageCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State Variables
  const [lead, setLead] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notes'); // notes, calls, followups

  // Form States
  const [noteContent, setNoteContent] = useState('');
  const [callForm, setCallForm] = useState({ outcome: 'Connected', duration: '', summary: '' });
  const [followUpForm, setFollowUpForm] = useState({ date: '', time: '', type: 'Call', notes: '' });
  
  const [actionLoading, setActionLoading] = useState(false);
  const [settings, setSettings] = useState(null);

  const fetchLeadDetails = async () => {
    try {
      setLoading(true);
      const [leadRes, settingsRes] = await Promise.all([
        axios.get(`/api/leads/${id}`),
        axios.get('/api/settings')
      ]);

      if (leadRes.data.success) {
        setLead(leadRes.data.data.lead);
        setTimeline(leadRes.data.data.timeline || []);
      }
      if (settingsRes.data.success) {
        setSettings(settingsRes.data.data.settings);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  // Handle lead status updates via stepper clicks or drop selection
  const handleStatusChange = async (newStatus) => {
    if (newStatus === lead.status) return;

    try {
      const res = await axios.put(`/api/leads/${id}`, { status: newStatus });
      if (res.data.success) {
        // Refetch to get updated logs/timeline
        fetchLeadDetails();
      }
    } catch (e) {
      console.error('Failed to change status:', e);
    }
  };

  // Submit Note Activity
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    try {
      setActionLoading(true);
      const res = await axios.post(`/api/leads/${id}/notes`, { content: noteContent });
      if (res.data.success) {
        setNoteContent('');
        fetchLeadDetails();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Call Log Activity
  const handleLogCall = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await axios.post(`/api/leads/${id}/calls`, callForm);
      if (res.data.success) {
        setCallForm({ outcome: 'Connected', duration: '', summary: '' });
        fetchLeadDetails();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Follow-up Scheduler Activity
  const handleScheduleFollowUp = async (e) => {
    e.preventDefault();
    if (!followUpForm.date || !followUpForm.time) {
      alert('Please select date and time');
      return;
    }

    try {
      setActionLoading(true);
      const res = await axios.post(`/api/leads/${id}/followups`, followUpForm);
      if (res.data.success) {
        setFollowUpForm({ date: '', time: '', type: 'Call', notes: '' });
        fetchLeadDetails();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // Trigger admission onboarding manually
  const initiateAdmission = async () => {
    if (!window.confirm('Do you want to create an official Admission Application for this lead?')) return;
    try {
      setActionLoading(true);
      const res = await axios.post('/api/admissions', { leadId: lead._id });
      if (res.data.success) {
        navigate('/admissions');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start application');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-20 text-xs text-slate-500">
        Lead not found. <Link to="/leads" className="text-brand-400">Go back</Link>
      </div>
    );
  }

  const pipelineStatuses = [
    'New',
    'Contacted',
    'Interested',
    'Follow-up',
    'Visit Scheduled',
    'Application Started',
    'Application Submitted',
    'Admission Confirmed'
  ];

  const currentStatusIndex = pipelineStatuses.indexOf(lead.status);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Detail header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/leads"
            className="p-1.5 border border-slate-800 bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100">{lead.studentName}</h2>
              <span className="text-[10px] font-bold bg-slate-850 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                {lead.leadId}
              </span>
            </div>
            <p className="text-xs text-slate-450">Class {lead.classInterested} • Session {lead.academicYear}</p>
          </div>
        </div>

        {/* Quick action button for qualified leads */}
        {!['Application Started', 'Application Submitted', 'Admission Confirmed'].includes(lead.status) && (
          <button
            onClick={initiateAdmission}
            disabled={actionLoading}
            className="glass-btn-primary px-4 py-2 text-xs font-semibold"
          >
            Initiate Admission
          </button>
        )}
      </div>

      {/* Interactive Pipeline Stepper */}
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
                    : 'border-slate-800 bg-slate-950/40 text-slate-500'
                }`}>
                  {index + 1}
                </div>
                <span className="text-[10px] font-semibold tracking-wide whitespace-nowrap">{status}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Info Cards Left, Activity Logs Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details Cards */}
        <div className="space-y-6">
          {/* Student Profile Card */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2 uppercase tracking-wider">
              Student Info
            </h3>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name</span>
                <span className="text-slate-300 font-medium">{lead.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Parent Name</span>
                <span className="text-slate-300 font-medium">{lead.parentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Priority Level</span>
                <span className={`priority-badge priority-${lead.priority.toLowerCase()}`}>
                  {lead.priority}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Origin Channel</span>
                <span className="text-slate-300 font-medium">{lead.leadSource}</span>
              </div>
              {lead.campaign && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Campaign</span>
                  <span className="text-slate-300 font-medium truncate max-w-[120px]" title={lead.campaign}>
                    {lead.campaign}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Advisor</span>
                <span className="text-slate-300 font-medium">
                  {lead.assignedCounsellor ? lead.assignedCounsellor.name : 'Unassigned'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2 uppercase tracking-wider">
              Contact Details
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Primary Phone</p>
                  <p className="text-slate-200 font-medium font-mono">{lead.phone}</p>
                </div>
              </div>

              {lead.alternatePhone && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Alternate Phone</p>
                    <p className="text-slate-200 font-medium font-mono">{lead.alternatePhone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500">Email Address</p>
                  <p className="text-slate-200 font-medium truncate" title={lead.email}>{lead.email || 'No email registered'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Location Address</p>
                  <p className="text-slate-200 font-medium">
                    {lead.address ? `${lead.address}, ${lead.city}, ${lead.state}` : 'No address registered'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Engagements and Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Action Engagement Logger tabs */}
          <div className="glass-card overflow-hidden">
            {/* Tab selector */}
            <div className="flex border-b border-slate-800/80 bg-slate-950/20">
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'notes' ? 'text-brand-400 border-b-2 border-brand-500 bg-slate-900/30' : 'text-slate-500 hover:text-slate-350'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>Write Note</span>
              </button>
              <button
                onClick={() => setActiveTab('calls')}
                className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'calls' ? 'text-brand-400 border-b-2 border-brand-500 bg-slate-900/30' : 'text-slate-500 hover:text-slate-350'
                }`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>Log Call</span>
              </button>
              <button
                onClick={() => setActiveTab('followups')}
                className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'followups' ? 'text-brand-400 border-b-2 border-brand-500 bg-slate-900/30' : 'text-slate-500 hover:text-slate-350'
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

          {/* Activity Logs Timeline */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
              Lead Activity Timeline
            </h3>

            {timeline.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">No activity logged yet</div>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {timeline.map((item, index) => {
                  let badgeColor = 'bg-slate-800 text-slate-400 border-slate-700';
                  
                  if (item.eventType === 'Created') badgeColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
                  if (item.eventType === 'Assigned') badgeColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
                  if (item.eventType === 'StatusChange') badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                  if (item.eventType === 'CallLogged') badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                  if (item.eventType === 'NoteAdded') badgeColor = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
                  if (item.eventType === 'FollowUpCreated') badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';

                  return (
                    <div key={item._id || index} className="relative flex gap-4 text-xs">
                      {/* Timeline dot */}
                      <span className={`absolute -left-[20px] top-1.5 h-3.5 w-3.5 rounded-full border-2 bg-slate-950 flex items-center justify-center ${
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
                        
                        <p className="text-slate-300 font-medium">{item.message}</p>
                        
                        {item.user && (
                          <p className="text-[10px] text-slate-500 flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-650" />
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

        </div>
      </div>
    </div>
  );
}
