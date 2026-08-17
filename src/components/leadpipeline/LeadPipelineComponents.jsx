import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  ArrowRight,
  FolderOpen
} from 'lucide-react';

export function PipelineCard({ lead, draggingId, handleDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, lead._id)}
      className={`p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-md cursor-grab active:cursor-grabbing transition-all ${
        draggingId === lead._id ? 'opacity-40 border-dashed' : ''
      }`}
    >
      <div className="space-y-2">
        {/* Top row */}
        <div className="flex justify-between items-start gap-1">
          <span className="text-[9px] font-bold bg-gray-100 px-1 py-0.5 rounded text-slate-500 font-mono">
            {lead.leadId}
          </span>
          <span className={`priority-badge text-[8px] font-extrabold priority-${lead.priority.toLowerCase()}`}>
            {lead.priority}
          </span>
        </div>

        {/* Student Name */}
        <div>
          <p className="text-xs font-bold text-slate-200 truncate">{lead.studentName}</p>
          <p className="text-[10px] text-slate-500">Parent: {lead.parentName}</p>
        </div>

        {/* Details Row */}
        <div className="flex items-center justify-between text-[9px] text-slate-450 border-t border-gray-200 pt-2">
          <span className="font-semibold text-slate-400">{lead.classInterested}</span>
          <span className="px-1.5 py-0.5 rounded bg-gray-50 text-slate-500 font-medium">
            {lead.leadSource}
          </span>
        </div>

        {/* Counsellor Footer */}
        <div className="flex items-center justify-between text-[9px] text-slate-500 pt-0.5">
          <div className="flex items-center gap-1 truncate max-w-[150px]">
            <User className="w-3 h-3 text-slate-600" />
            <span className="truncate">
              {lead.assignedCounsellor ? lead.assignedCounsellor.name : 'Unassigned'}
            </span>
          </div>
          <Link
            to={`/leads/${lead._id}`}
            className="text-brand-400 hover:text-brand-300 flex items-center gap-0.5 font-bold"
          >
            Profile <ArrowRight className="w-2.5 h-2.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PipelineColumn({
  status,
  columnLeads,
  draggingId,
  handleDragStart,
  handleDragOver,
  handleDrop
}) {
  return (
    <div
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, status)}
      className="w-72 bg-white border border-gray-200 rounded-xl flex flex-col max-h-[80vh] flex-shrink-0"
    >
      {/* Column Title Header */}
      <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full status-${status.toLowerCase().replace(/\s/g, '')} bg-current`}></span>
          <span className="text-xs font-bold text-slate-700">{status}</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-bold text-slate-500 border border-gray-200">
          {columnLeads.length}
        </span>
      </div>

      {/* Column Cards List */}
      <div className="p-2 flex-1 overflow-y-auto space-y-2 select-none min-h-[300px]">
        {columnLeads.length === 0 ? (
          <div className="h-32 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-[10px] text-slate-600 gap-1.5">
            <FolderOpen className="w-5 h-5 text-slate-800" />
            <span>Drag cards here</span>
          </div>
        ) : (
          columnLeads.map((lead) => (
            <PipelineCard
              key={lead._id}
              lead={lead}
              draggingId={draggingId}
              handleDragStart={handleDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
}
