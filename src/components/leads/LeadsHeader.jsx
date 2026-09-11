import React from 'react';
import { Plus, Download } from 'lucide-react';
import { handleExportCSV } from '../../utils/csvExport';
import { useAuth } from '../../context/AuthContext';

export default function LeadsHeader({
  search,
  status,
  source,
  priority,
  counsellor,
  classInt,
  startDate,
  endDate,
  setShowAddModal
}) {
  const { user } = useAuth();
  const isCounsellor = ['Counsellor', 'Admissions Officer', 'Senior Zonal Manager'].includes(user?.role);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          {isCounsellor ? 'My Assigned Leads' : 'Leads Directory'}
        </h2>
        <p className="text-xs text-slate-400">
          {isCounsellor
            ? 'Leads assigned to you by the admin. Track and follow up on each enquiry.'
            : 'Manage, sort, filters, and allocate student admissions enquiries.'}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleExportCSV(search, status, source, priority, counsellor, classInt, startDate, endDate)}
          className="flex items-center gap-1.5 glass-btn-secondary px-3 py-2 animate-pulse-subtle"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 glass-btn-primary px-3 py-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Enquiry</span>
        </button>
      </div>
    </div>
  );
}
