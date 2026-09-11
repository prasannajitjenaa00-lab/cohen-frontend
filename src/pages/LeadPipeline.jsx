import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PipelineColumn } from '../components/leadpipeline/LeadPipelineComponents';

export default function LeadPipeline() {
  const { user } = useAuth();
  const isCounsellorRole = user?.role === 'Counsellor';
  const [leads, setLeads] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [selectedCounsellor, setSelectedCounsellor] = useState('');
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
      let url = '/api/leads?limit=100';
      if (selectedCounsellor) {
        url += `&assignedCounsellor=${selectedCounsellor}`;
      }
      const res = await axios.get(url);
      if (res.data.success) {
        setLeads(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const [usersRes, settingsRes] = await Promise.all([
        axios.get('/api/settings/users'),
        axios.get('/api/settings')
      ]);
      if (usersRes.data.success) {
        setCounsellors((usersRes.data.data || []).filter(u => u.status === 'Active' && u.role !== 'SUPER_USER' && u.role !== 'CGO'));
      }
      if (settingsRes.data.success) {
        setSettings(settingsRes.data.data.settings);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchPipelineLeads();
  }, [selectedCounsellor]);

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
          <h2 className="text-xl font-bold text-slate-800">Lead Pipeline Board</h2>
          <p className="text-xs text-slate-400">
            Drag and drop enquiry cards to advance lead status stages.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {!isCounsellorRole && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter by Counselor:</span>
              <select
                value={selectedCounsellor}
                onChange={(e) => setSelectedCounsellor(e.target.value)}
                className="glass-input text-xs py-1.5 px-3 bg-white border-gray-200"
              >
                <option value="">All Counselors</option>
                {counsellors.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

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
            className="p-2 border border-gray-200 bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
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
          {pipelineStatuses.map((status) => (
            <PipelineColumn
              key={status}
              status={status}
              columnLeads={getLeadsByStatus(status)}
              draggingId={draggingId}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
}
