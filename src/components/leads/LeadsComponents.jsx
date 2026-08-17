import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Eye,
  UserCheck,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

export function LeadsFilters({
  search,
  setSearch,
  status,
  setStatus,
  source,
  setSource,
  priority,
  setPriority,
  classInt,
  setClassInt,
  counsellor,
  setCounsellor,
  startDate,
  setStartDate,
  settings,
  counsellors,
  user,
  handleSearchSubmit,
  resetFilters,
  setPage
}) {
  return (
    <div className="glass-card p-5 space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative flex items-center">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by student name, parent name, phone, email or L-ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 glass-input text-xs"
          />
        </div>
        <button type="submit" className="glass-btn-primary px-4 text-xs font-semibold py-2">
          Search
        </button>
        <button
          type="button"
          onClick={resetFilters}
          className="glass-btn-secondary px-4 text-xs font-semibold py-2"
        >
          Reset
        </button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
        {/* Status Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="w-full glass-input text-xs py-1.5"
          >
            <option value="">All Statuses</option>
            {settings?.leadStatuses?.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Source Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Channel</label>
          <select
            value={source}
            onChange={(e) => { setSource(e.target.value); setPage(1); }}
            className="w-full glass-input text-xs py-1.5"
          >
            <option value="">All Sources</option>
            {settings?.leadSources?.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Priority</label>
          <select
            value={priority}
            onChange={(e) => { setPriority(e.target.value); setPage(1); }}
            className="w-full glass-input text-xs py-1.5"
          >
            <option value="">All Priorities</option>
            {settings?.leadPriorities?.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Class Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Class</label>
          <select
            value={classInt}
            onChange={(e) => { setClassInt(e.target.value); setPage(1); }}
            className="w-full glass-input text-xs py-1.5"
          >
            <option value="">All Classes</option>
            {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']?.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Counsellor Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Advisor</label>
          <select
            value={counsellor}
            disabled={user?.role === 'Counsellor'}
            onChange={(e) => { setCounsellor(e.target.value); setPage(1); }}
            className="w-full glass-input text-xs py-1.5 disabled:opacity-50"
          >
            <option value="">All Advisors</option>
            {counsellors.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        {/* Start Date */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">From Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            className="w-full glass-input text-xs py-1"
          />
        </div>
      </div>
    </div>
  );
}

export function LeadsTable({
  loading,
  leads,
  user,
  setSelectedLead,
  setShowAssignModal,
  handleDeleteLead,
  page,
  limit,
  total,
  totalPages,
  setPage
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (leads.length === 0) {
    return <div className="text-center py-20 text-xs text-slate-500">No leads matched filters</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 text-[10px] text-slate-500 font-semibold uppercase tracking-wider bg-gray-50/80">
            <th className="py-3 px-5">Lead & Contact</th>
            <th className="py-3 px-3">Class</th>
            <th className="py-3 px-3">Source Channel</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-3">Priority</th>
            <th className="py-3 px-3">Counsellor</th>
            <th className="py-3 px-3">Next Follow-up</th>
            <th className="py-3 px-3">Created</th>
            <th className="py-3 px-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-gray-50 transition-all">
              {/* Name & ID & Phone */}
              <td className="py-3.5 px-5">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-700">{lead.studentName}</span>
                    <span className="text-[9px] text-slate-500 font-bold bg-gray-100 px-1 rounded">
                      {lead.leadId}
                    </span>
                    {lead.duplicateStatus === 'Possible Duplicate' && (
                      <span className="text-[9px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1 rounded">
                        Dup?
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">Parent: {lead.parentName}</p>
                  <p className="text-[10px] text-slate-405 font-mono">{lead.phone}</p>
                </div>
              </td>
              
              {/* Class */}
              <td className="py-3.5 px-3 text-slate-600 font-medium">
                {lead.classInterested}
              </td>

              {/* Source */}
              <td className="py-3.5 px-3">
                <div className="space-y-0.5">
                  <span className="text-slate-600 font-medium">{lead.leadSource}</span>
                  {lead.campaign && (
                    <p className="text-[9px] text-slate-500 truncate max-w-[120px]" title={lead.campaign}>
                      {lead.campaign}
                    </p>
                  )}
                </div>
              </td>

              {/* Status badge */}
              <td className="py-3.5 px-3">
                <span className={`status-pill status-${lead.status ? lead.status.toLowerCase().replace(/\s/g, '') : 'new'}`}>
                  {lead.status || 'New'}
                </span>
              </td>

              {/* Priority */}
              <td className="py-3.5 px-3">
                <span className={`priority-badge priority-${lead.priority ? lead.priority.toLowerCase() : 'medium'}`}>
                  {lead.priority || 'Medium'}
                </span>
              </td>

              {/* Counsellor */}
              <td className="py-3.5 px-3 text-slate-400">
                {lead.assignedCounsellor ? (
                  <span className="font-medium text-slate-600">{lead.assignedCounsellor.name}</span>
                ) : (
                  <span className="text-slate-650 italic">Unassigned</span>
                )}
              </td>

              {/* Next Followup */}
              <td className="py-3.5 px-3 text-slate-450 font-mono">
                {lead.nextFollowUp ? (
                  new Date(lead.nextFollowUp).toLocaleDateString([], { month: 'short', day: '2-digit' })
                ) : (
                  <span className="text-slate-600">—</span>
                )}
              </td>

              {/* Created Date */}
              <td className="py-3.5 px-3 text-slate-500 font-mono">
                {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString([], { month: 'short', day: '2-digit' }) : '—'}
              </td>

              {/* Actions dropdown/buttons */}
              <td className="py-3.5 px-5 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Link
                    to={`/leads/${lead._id}`}
                    title="View Details"
                    className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-gray-100 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  {user?.role !== 'Counsellor' && (
                    <button
                      title="Assign Counsellor"
                      onClick={() => { setSelectedLead(lead); setShowAssignModal(true); }}
                      className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4" />
                    </button>
                  )}
                  {user?.role === 'Super Admin' && (
                    <button
                      title="Delete"
                      onClick={() => handleDeleteLead(lead._id, lead.studentName)}
                      className="p-1 text-rose-500 hover:bg-rose-955/20 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Table Footer with Pagination Controls */}
      {!loading && leads.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
          <span className="text-xs text-slate-500 font-medium">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} leads
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-1 border border-gray-200 rounded bg-white text-slate-500 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-400 font-bold px-2">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="p-1 border border-gray-200 rounded bg-white text-slate-500 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AddLeadModal({
  showAddModal,
  setShowAddModal,
  formError,
  newLeadForm,
  setNewLeadForm,
  handleAddLead,
  formLoading,
  settings
}) {
  if (!showAddModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="glass-card bg-white w-full max-w-2xl border border-gray-200 p-6 animate-fade-in relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setShowAddModal(false)}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
          <span>🎓</span> Log New Student Inquiry
        </h3>

        {formError && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-bold">
            {formError}
          </div>
        )}

        <form onSubmit={handleAddLead} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-450">Student Full Name *</label>
              <input
                type="text"
                required
                value={newLeadForm.studentName}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, studentName: e.target.value })}
                className="w-full glass-input"
                placeholder="Aditya Dash"
              />
            </div>

            {/* Parent Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-455">Parent/Guardian Name *</label>
              <input
                type="text"
                required
                value={newLeadForm.parentName}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, parentName: e.target.value })}
                className="w-full glass-input"
                placeholder="Ranjan Dash"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-450">Mobile Number *</label>
              <input
                type="tel"
                required
                value={newLeadForm.phone}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                className="w-full glass-input"
                placeholder="9876543210"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-455">Email Address</label>
              <input
                type="email"
                value={newLeadForm.email}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                className="w-full glass-input"
                placeholder="parent@example.com"
              />
            </div>

            {/* Class */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-450">Class Interested *</label>
              <select
                value={newLeadForm.classInterested}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, classInterested: e.target.value })}
                className="w-full glass-input"
              >
                {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-450">Academic Session *</label>
              <select
                value={newLeadForm.academicYear}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, academicYear: e.target.value })}
                className="w-full glass-input"
              >
                <option>2026-2027</option>
                <option>2027-2028</option>
              </select>
            </div>

            {/* Lead Source */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-450">Lead Origin Source *</label>
              <select
                value={newLeadForm.leadSource}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, leadSource: e.target.value })}
                className="w-full glass-input"
              >
                {settings?.leadSources?.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-450">Priority Level *</label>
              <select
                value={newLeadForm.priority}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, priority: e.target.value })}
                className="w-full glass-input"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>
          </div>

          {/* Address details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1 md:col-span-3">
              <label className="text-xs font-semibold text-slate-450">Address</label>
              <input
                type="text"
                value={newLeadForm.address}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, address: e.target.value })}
                className="w-full glass-input"
                placeholder="Plot 10, Forest Park"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-455">City</label>
              <input
                type="text"
                value={newLeadForm.city}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                className="w-full glass-input"
                placeholder="Bhubaneswar"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-450">State</label>
              <input
                type="text"
                value={newLeadForm.state}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, state: e.target.value })}
                className="w-full glass-input"
                placeholder="Odisha"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="glass-btn-secondary px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="glass-btn-primary px-6 py-2 flex items-center gap-2"
            >
              {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save Enquiry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AssignCounsellorModal({
  showAssignModal,
  setShowAssignModal,
  selectedLead,
  setSelectedLead,
  targetCounsellor,
  setTargetCounsellor,
  counsellors,
  handleAssignSubmit
}) {
  if (!showAssignModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="glass-card bg-white w-full max-w-md border border-gray-200 p-6 animate-fade-in relative">
        <button
          onClick={() => { setShowAssignModal(false); setSelectedLead(null); }}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-slate-700 mb-2">Assign Academic Advisor</h3>
        <p className="text-xs text-slate-450 mb-4">
          Allocate Lead <span className="font-bold text-slate-700">{selectedLead?.studentName} ({selectedLead?.leadId})</span> to an active advisor.
        </p>
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-450 font-sans">Advisor Dropdown</label>
            <select
              required
              value={targetCounsellor}
              onChange={(e) => setTargetCounsellor(e.target.value)}
              className="w-full glass-input text-xs"
            >
              <option value="">Select Advisor...</option>
              {counsellors.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => { setShowAssignModal(false); setSelectedLead(null); }}
              className="glass-btn-secondary px-3 py-1.5 text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="glass-btn-primary px-4 py-1.5 text-xs">
              Re-assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
