import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Search,
  Loader2,
  Calendar,
  User,
  ArrowRight,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LeadPipeline() {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [settings, setSettings] = useState(null);
  const [draggingId, setDraggingId] = useState(null);

  // Column Status list
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

  // Fetch Leads for Pipeline (non-paginated)
  const fetchPipelineLeads = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/leads?limit=100'); // Load top 100 leads
      if (res.data.success) {
        setLeads(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/settings');
      if (res.data.success) {
        setSettings(res.data.data.settings);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPipelineLeads();
    fetchSettings();
  }, []);

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggingId(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggingId;
    if (!id) return;

    // Find the lead to update client-side immediately for responsiveness
    const leadToUpdate = leads.find(l => l._id === id);
    if (!leadToUpdate || leadToUpdate.status === targetStatus) return;

    const oldStatus = leadToUpdate.status;

    // Optimistic UI Update
    setLeads(leads.map(l => l._id === id ? { ...l, status: targetStatus } : l));
    setDraggingId(null);

    try {
      // Put request to modify status
      const res = await axios.put(`/api/leads/${id}`, { status: targetStatus });
      if (!res.data.success) {
        // Rollback on failure
        setLeads(leads.map(l => l._id === id ? { ...l, status: oldStatus } : l));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      // Rollback
      setLeads(leads.map(l => l._id === id ? { ...l, status: oldStatus } : l));
    }
  };

  // Filter leads based on Search input
  const filteredLeads = leads.filter((lead) => {
    const searchString = search.toLowerCase();
    return (
      lead.studentName.toLowerCase().includes(searchString) ||
      lead.leadId.toLowerCase().includes(searchString) ||
      (lead.phone && lead.phone.includes(searchString)) ||
      (lead.parentName && lead.parentName.toLowerCase().includes(searchString))
    );
  });

  // Group leads by status
  const getLeadsByStatus = (status) => {
    return filteredLeads.filter((l) => l.status === status);
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-100px)] overflow-hidden animate-fade-in">
      {/* Board Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Lead Pipeline Board</h2>
          <p className="text-xs text-slate-400">
            Drag and drop enquiry cards to advance lead status stages.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter board cards..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 glass-input text-xs w-48 focus:w-64 transition-all duration-300 py-1.5"
            />
          </div>
          <button
            onClick={fetchPipelineLeads}
            title="Refresh Board"
            className="p-2 border border-slate-800 bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Kanban Scrollable Area */}
      {loading && leads.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto pb-4 flex items-start gap-4 h-full">
          {pipelineStatuses.map((status) => {
            const columnLeads = getLeadsByStatus(status);
            return (
              <div
                key={status}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
                className="w-72 bg-slate-950/40 border border-slate-900 rounded-xl flex flex-col max-h-[80vh] flex-shrink-0"
              >
                {/* Column Title Header */}
                <div className="p-3 border-b border-slate-900/60 flex items-center justify-between bg-slate-950/20">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full status-${status.toLowerCase().replace(/\s/g, '')} bg-current`}></span>
                    <span className="text-xs font-bold text-slate-200">{status}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-900 text-[10px] font-bold text-slate-400 border border-slate-800">
                    {columnLeads.length}
                  </span>
                </div>

                {/* Column Cards List */}
                <div className="p-2 flex-1 overflow-y-auto space-y-2 select-none min-h-[300px]">
                  {columnLeads.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-slate-900/40 rounded-lg flex flex-col items-center justify-center text-[10px] text-slate-600 gap-1.5">
                      <FolderOpen className="w-5 h-5 text-slate-800" />
                      <span>Drag cards here</span>
                    </div>
                  ) : (
                    columnLeads.map((lead) => (
                      <div
                        key={lead._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead._id)}
                        className={`p-3 rounded-lg border border-slate-800/80 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700/80 shadow-md cursor-grab active:cursor-grabbing transition-all ${
                          draggingId === lead._id ? 'opacity-40 border-dashed' : ''
                        }`}
                      >
                        <div className="space-y-2">
                          {/* Top row */}
                          <div className="flex justify-between items-start gap-1">
                            <span className="text-[9px] font-bold bg-slate-800 px-1 py-0.5 rounded text-slate-400 font-mono">
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
                          <div className="flex items-center justify-between text-[9px] text-slate-450 border-t border-slate-850 pt-2">
                            <span className="font-semibold text-slate-400">{lead.classInterested}</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 font-medium">
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
                    ))
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
