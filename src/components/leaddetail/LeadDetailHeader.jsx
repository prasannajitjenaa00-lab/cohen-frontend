import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function LeadDetailHeader({
  lead,
  actionLoading,
  initiateAdmission
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
      <div className="flex items-center gap-3">
        <Link
          to="/leads"
          className="p-1.5 border border-gray-200 bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-all"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800">{lead.studentName}</h2>
            <span className="text-[10px] font-bold bg-gray-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">
              {lead.leadId}
            </span>
          </div>
          <p className="text-xs text-slate-400">Class {lead.classInterested} • Session {lead.academicYear}</p>
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
  );
}
