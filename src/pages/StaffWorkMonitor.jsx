import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  UserCheck,
  RefreshCw,
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
  Calendar,
  CheckSquare,
  PhoneCall,
  FileText,
  Eye,
  User,
  Mail,
  Phone,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';

export default function StaffWorkMonitor() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [monitorData, setMonitorData] = useState(null);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('leads'); // 'leads', 'activities', 'followups'

  // Fetch monitorable staff list on mount
  useEffect(() => {
    fetchStaffList();
  }, []);

  // Fetch overview when selected staff changes
  useEffect(() => {
    if (selectedStaffId) {
      fetchStaffOverview(selectedStaffId);
    }
  }, [selectedStaffId]);

  const fetchStaffList = async () => {
    setLoadingStaff(true);
    setError('');
    try {
      const res = await axios.get('/api/dashboard/staff-work/staff');
      if (res.data.success) {
        const staff = res.data.data || [];
        setStaffList(staff);
        if (staff.length > 0) {
          setSelectedStaffId(staff[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch monitorable staff:', err);
      setError(err.response?.data?.message || 'Failed to load staff list.');
    } finally {
      setLoadingStaff(false);
    }
  };

  const fetchStaffOverview = async (staffId) => {
    setLoadingOverview(true);
    setError('');
    try {
      const res = await axios.get(`/api/dashboard/staff-work/${staffId}`);
      if (res.data.success) {
        setMonitorData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch staff overview:', err);
      setError(err.response?.data?.message || 'Failed to load staff work monitor payload.');
    } finally {
      setLoadingOverview(false);
    }
  };

  const handleRefresh = () => {
    if (selectedStaffId) {
      fetchStaffOverview(selectedStaffId);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Admission Confirmed': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Application Submitted':
      case 'Application Started': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Visit Scheduled':
      case 'Interested': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Contacted':
      case 'Follow-up': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'New': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'Not Interested':
      case 'Lost': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'Medium': return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'Low': return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const { staff, statistics, assignedLeads = [], activities = [], followUps = { today: [], upcoming: [], pending: [], completed: [] } } = monitorData || {};

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Topbar />

      <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl text-indigo-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 font-sans tracking-tight">Staff Work Monitor</h1>
              <p className="text-xs text-slate-400">
                Inspect assigned leads, call logs, activity timelines, and follow-up schedules across staff.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Employee Selector Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:inline">Select Employee:</span>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                disabled={loadingStaff}
                className="glass-input text-xs font-medium py-2 px-3 bg-slate-900 border border-slate-700 text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 min-w-[240px]"
              >
                {loadingStaff ? (
                  <option value="">Loading Staff...</option>
                ) : (
                  staffList.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.designation || s.role})
                    </option>
                  ))
                )}
              </select>
            </div>

            <button
              onClick={handleRefresh}
              disabled={loadingOverview}
              className="glass-btn-secondary p-2.5 rounded-xl text-slate-300 hover:text-white transition-all flex items-center justify-center border border-slate-700"
              title="Refresh Monitor Data"
            >
              <RefreshCw className={`w-4 h-4 ${loadingOverview ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Spinner for overview */}
        {loadingOverview && !monitorData && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
            <p className="text-xs font-medium">Loading staff work data...</p>
          </div>
        )}

        {monitorData && (
          <>
            {/* Employee Profile Header Card */}
            <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-indigo-950/40 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center text-xl font-bold font-mono shadow-inner">
                  {staff?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-100">{staff?.name}</h2>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${staff?.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'}`}>
                      {staff?.status || 'Active'}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-300 font-medium flex items-center gap-1.5 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                    {staff?.designation || staff?.role} &bull; <span className="text-slate-400">{staff?.role}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-500" /> {staff?.email}
                    </span>
                    {staff?.mobile && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" /> {staff?.mobile}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              <div className="glass-panel p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Assigned Leads</span>
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="text-xl font-bold text-slate-100">{statistics?.totalAssigned || 0}</div>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider">In Progress</span>
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-xl font-bold text-amber-300">{statistics?.inProgress || 0}</div>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Admissions</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-xl font-bold text-emerald-300">{statistics?.confirmedAdmissions || 0}</div>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Conversion</span>
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-xl font-bold text-cyan-300">{statistics?.conversionRate || 0}%</div>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Pending Tasks</span>
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-xl font-bold text-sky-300">{statistics?.pendingFollowups || 0}</div>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Completed Tasks</span>
                  <CheckSquare className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="text-xl font-bold text-purple-300">{statistics?.completedFollowups || 0}</div>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Calls Logged</span>
                  <PhoneCall className="w-3.5 h-3.5 text-pink-400" />
                </div>
                <div className="text-xl font-bold text-pink-300">{statistics?.callsLogged || 0}</div>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Notes Added</span>
                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                </div>
                <div className="text-xl font-bold text-teal-300">{statistics?.notesAdded || 0}</div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-slate-800 flex items-center gap-6 text-sm font-medium">
              <button
                onClick={() => setActiveTab('leads')}
                className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${activeTab === 'leads' ? 'border-indigo-500 text-indigo-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                <Users className="w-4 h-4" />
                <span>Assigned Leads ({assignedLeads.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('activities')}
                className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${activeTab === 'activities' ? 'border-indigo-500 text-indigo-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                <FileText className="w-4 h-4" />
                <span>Call Activity & Notes ({activities.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('followups')}
                className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${activeTab === 'followups' ? 'border-indigo-500 text-indigo-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                <Calendar className="w-4 h-4" />
                <span>Follow-Up Schedule ({followUps.today.length + followUps.pending.length + followUps.upcoming.length})</span>
              </button>
            </div>

            {/* TAB 1: ASSIGNED LEADS */}
            {activeTab === 'leads' && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                {assignedLeads.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-xs">
                    No leads currently assigned to {staff?.name}.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Student / Parent</th>
                          <th className="p-3.5">Contact</th>
                          <th className="p-3.5">Class Interested</th>
                          <th className="p-3.5">Source</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5">Priority</th>
                          <th className="p-3.5">Created Date</th>
                          <th className="p-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {assignedLeads.map((l) => (
                          <tr key={l._id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-3.5 font-medium text-slate-200">
                              <div>{l.studentName}</div>
                              <div className="text-[10px] text-slate-400 font-normal">Parent: {l.parentName}</div>
                            </td>
                            <td className="p-3.5 text-slate-300">
                              <div>{l.phone}</div>
                              {l.email && <div className="text-[10px] text-slate-500">{l.email}</div>}
                            </td>
                            <td className="p-3.5 text-slate-300">{l.classInterested}</td>
                            <td className="p-3.5 text-slate-400">{l.leadSource}</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getStatusBadgeClass(l.status)}`}>
                                {l.status}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getPriorityBadgeClass(l.priority)}`}>
                                {l.priority}
                              </span>
                            </td>
                            <td className="p-3.5 text-slate-400">
                              {new Date(l.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => navigate(`/leads/${l._id}`)}
                                className="px-2.5 py-1 text-[11px] font-medium text-indigo-300 hover:text-indigo-100 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg transition-all flex items-center gap-1 ml-auto"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View Lead</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: CALL ACTIVITY & NOTES */}
            {activeTab === 'activities' && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                {activities.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-xs">
                    No recent call activity or notes recorded by {staff?.name}.
                  </div>
                ) : (
                  <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
                    {activities.map((act) => (
                      <div key={act._id} className="relative flex items-start gap-4 pl-8 group">
                        <div className={`absolute left-1 top-1.5 w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center ${act.type === 'Call' ? 'bg-pink-500/20 text-pink-400 border-pink-500/30' : act.type === 'Note' ? 'bg-teal-500/20 text-teal-400 border-teal-500/30' : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'}`}>
                          {act.type === 'Call' ? <PhoneCall className="w-2.5 h-2.5" /> : <FileText className="w-2.5 h-2.5" />}
                        </div>
                        <div className="flex-1 bg-slate-900 border border-slate-800/80 p-3.5 rounded-xl shadow-sm">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                              <span>{act.summary}</span>
                              {act.lead && (
                                <span className="text-[10px] font-normal text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                                  Lead: {act.lead.studentName} ({act.lead.classInterested})
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(act.timestamp).toLocaleString()}
                            </span>
                          </div>
                          {act.details && (
                            <p className="text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50 mt-2 font-mono text-[11px] whitespace-pre-wrap">
                              {act.details}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: FOLLOW-UP WORK SCHEDULE */}
            {activeTab === 'followups' && (
              <div className="space-y-6">
                {/* Today's Follow-ups */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                  <h3 className="text-xs font-bold uppercase text-amber-400 tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Today's Follow-ups ({followUps.today.length})</span>
                  </h3>
                  {followUps.today.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No follow-ups scheduled for today.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {followUps.today.map((f) => (
                        <div key={f._id} className="bg-slate-900 border border-amber-500/30 p-3.5 rounded-xl shadow-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200">{f.lead?.studentName || 'Student'}</span>
                            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">{f.time} &bull; {f.type}</span>
                          </div>
                          {f.notes && <p className="text-xs text-slate-400 font-mono text-[11px]">{f.notes}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Overdue / Pending Follow-ups */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                  <h3 className="text-xs font-bold uppercase text-rose-400 tracking-wider flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Overdue / Pending Tasks ({followUps.pending.length})</span>
                  </h3>
                  {followUps.pending.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No overdue pending tasks.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {followUps.pending.map((f) => (
                        <div key={f._id} className="bg-slate-900 border border-rose-500/30 p-3.5 rounded-xl shadow-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200">{f.lead?.studentName || 'Student'}</span>
                            <span className="text-[10px] font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">{new Date(f.date).toLocaleDateString()} {f.time}</span>
                          </div>
                          {f.notes && <p className="text-xs text-slate-400 font-mono text-[11px]">{f.notes}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upcoming Follow-ups */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                  <h3 className="text-xs font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Upcoming Follow-ups ({followUps.upcoming.length})</span>
                  </h3>
                  {followUps.upcoming.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No upcoming follow-ups scheduled.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {followUps.upcoming.map((f) => (
                        <div key={f._id} className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200">{f.lead?.studentName || 'Student'}</span>
                            <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">{new Date(f.date).toLocaleDateString()} {f.time}</span>
                          </div>
                          {f.notes && <p className="text-xs text-slate-400 font-mono text-[11px]">{f.notes}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
