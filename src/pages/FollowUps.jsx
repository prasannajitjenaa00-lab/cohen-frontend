import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Check,
  X,
  Phone,
  MessageSquare,
  AlertTriangle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function FollowUps() {
  const { user } = useAuth();
  
  // State variables
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('today'); // today, overdue, pending, completed
  
  // Reschedule Modal controls
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '', notes: '' });
  const [modalLoading, setModalLoading] = useState(false);

  const fetchFollowUps = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/followups?filter=${filter}`);
      if (res.data.success) {
        setFollowUps(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, [filter]);

  // Handle Quick Complete
  const handleQuickComplete = async (id) => {
    if (!window.confirm('Mark this follow-up as Completed?')) return;
    try {
      const res = await axios.put(`/api/followups/${id}`, { status: 'Completed' });
      if (res.data.success) {
        fetchFollowUps();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Reschedule submit
  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleForm.date || !rescheduleForm.time) return;

    try {
      setModalLoading(true);
      const res = await axios.put(`/api/followups/${selectedFollowUp._id}`, {
        status: 'Rescheduled',
        date: rescheduleForm.date,
        time: rescheduleForm.time,
        notes: rescheduleForm.notes || 'Rescheduled follow-up'
      });
      if (res.data.success) {
        setShowRescheduleModal(false);
        setSelectedFollowUp(null);
        setRescheduleForm({ date: '', time: '', notes: '' });
        fetchFollowUps();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-sans">Scheduled Follow-ups</h2>
          <p className="text-xs text-slate-400">Track and update active callback reminders and visits.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchFollowUps}
            className="p-2 border border-gray-200 bg-white rounded-lg text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50 p-1 rounded-lg gap-1.5 w-full max-w-lg">
        {[
          { key: 'today', name: 'Today\'s' },
          { key: 'overdue', name: 'Overdue' },
          { key: 'pending', name: 'All Pending' },
          { key: 'completed', name: 'Completed' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              filter === tab.key
                ? 'bg-brand-600 text-white shadow shadow-brand-500/10'
                : 'text-slate-450 hover:bg-gray-100 hover:text-slate-700'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Main List Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          </div>
        ) : followUps.length === 0 ? (
          <div className="text-center py-20 text-xs text-slate-500">No scheduled reminders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[10px] text-slate-500 font-semibold uppercase tracking-wider bg-gray-50/80">
                  <th className="py-3 px-5">Student Name</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Time</th>
                  <th className="py-3 px-3">Contact Method</th>
                  <th className="py-3 px-3">Counsellor</th>
                  <th className="py-3 px-3">Follow-up Notes / Goal</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {followUps.map((item) => {
                  const lead = item.lead || {};
                  const isOverdueItem = filter === 'overdue' || (item.status === 'Pending' && new Date(item.date) < new Date().setHours(0,0,0,0));

                  return (
                    <tr key={item._id} className="hover:bg-gray-50 transition-all">
                      {/* Name with link */}
                      <td className="py-3.5 px-5">
                        <div className="space-y-0.5">
                          <Link to={`/leads/${lead._id}`} className="font-bold text-slate-700 hover:text-brand-400">
                            {lead.studentName || 'Deleted Lead'}
                          </Link>
                          <p className="text-[10px] text-slate-500">Phone: {lead.phone} • Class: {lead.classInterested}</p>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1">
                          <span className={`font-medium ${isOverdueItem ? 'text-rose-400' : 'text-slate-300'}`}>
                            {new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          {isOverdueItem && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />}
                        </div>
                      </td>

                      {/* Time */}
                      <td className="py-3.5 px-3 font-mono text-slate-600">
                        {item.time}
                      </td>

                      {/* Interaction type */}
                      <td className="py-3.5 px-3 text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-semibold border border-gray-200">
                          {item.type}
                        </span>
                      </td>

                      {/* Counsellor */}
                      <td className="py-3.5 px-3 text-slate-400">
                        {item.counsellor?.name || 'System'}
                      </td>

                      {/* Remarks */}
                      <td className="py-3.5 px-3 text-slate-400 max-w-xs truncate" title={item.notes}>
                        {item.notes}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span className={`status-pill ${item.status === 'Completed' ? 'status-confirmed' : 'status-followup'}`}>
                          {item.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        {item.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleQuickComplete(item._id)}
                              title="Mark Complete"
                              className="p-1 text-emerald-400 hover:bg-emerald-950/20 rounded cursor-pointer"
                            >
                              <Check className="w-4.5 h-4.5" />
                            </button>
                            <button
                              onClick={() => { setSelectedFollowUp(item); setShowRescheduleModal(true); }}
                              title="Reschedule"
                              className="p-1 text-brand-400 hover:bg-brand-955/20 rounded cursor-pointer"
                            >
                              <Calendar className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-600 italic">No Action</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="glass-card bg-white w-full max-w-md border border-gray-200 p-6 animate-fade-in relative">
            <button
              onClick={() => { setShowRescheduleModal(false); setSelectedFollowUp(null); }}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-700 mb-2">Reschedule Appointment</h3>
            <p className="text-xs text-slate-450 mb-4">
              Reschedule task for student: <span className="font-bold text-slate-700">{selectedFollowUp?.lead?.studentName}</span>
            </p>
            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">New Date *</label>
                  <input
                    type="date"
                    required
                    value={rescheduleForm.date}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                    className="w-full glass-input text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">New Time *</label>
                  <input
                    type="time"
                    required
                    value={rescheduleForm.time}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, time: e.target.value })}
                    className="w-full glass-input text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Reason / Update Notes</label>
                <textarea
                  rows={2}
                  value={rescheduleForm.notes}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, notes: e.target.value })}
                  placeholder="Reason for rescheduling (e.g. parents busy, asked to call on sunday)..."
                  className="w-full glass-input text-xs"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => { setShowRescheduleModal(false); setSelectedFollowUp(null); }}
                  className="glass-btn-secondary px-3 py-1.5 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="glass-btn-primary px-4 py-1.5 text-xs"
                >
                  {modalLoading ? 'Saving...' : 'Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
