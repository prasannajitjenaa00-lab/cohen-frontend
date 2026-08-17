import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AdmissionsTable, UploadDocModal } from '../components/admissions/AdmissionsComponents';

export default function Admissions() {
  const { user } = useAuth();
  
  // State variables
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Document Upload Modal state
  const [showDocModal, setShowDocModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [docForm, setDocForm] = useState({ name: 'Birth Certificate', fileUrl: config.mockDocUrl, fileType: 'PDF' });
  const [modalLoading, setModalLoading] = useState(false);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (statusFilter) queryParams.set('status', statusFilter);
      if (search) queryParams.set('search', search);

      const res = await axios.get(`/api/admissions?${queryParams.toString()}`);
      if (res.data.success) {
        setAdmissions(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, [statusFilter, search]);

  // Update Status Inline
  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await axios.put(`/api/admissions/${id}`, { status });
      if (res.data.success) {
        fetchAdmissions();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  // Update Payment Status Inline
  const handleUpdatePayment = async (id, paymentStatus) => {
    try {
      const res = await axios.put(`/api/admissions/${id}`, { paymentStatus });
      if (res.data.success) {
        fetchAdmissions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Document Upload
  const handleUploadDoc = async (e) => {
    e.preventDefault();
    if (!docForm.name || !docForm.fileUrl) return;

    try {
      setModalLoading(true);
      const res = await axios.put(`/api/admissions/${selectedApp._id}`, {
        document: docForm
      });
      if (res.data.success) {
        setShowDocModal(false);
        setSelectedApp(null);
        setDocForm({ name: 'Birth Certificate', fileUrl: config.mockDocUrl, fileType: 'PDF' });
        fetchAdmissions();
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
          <h2 className="text-xl font-bold text-slate-800 font-sans">Applications & Admissions</h2>
          <p className="text-xs text-slate-400">Track and manage student applications, documentation, and fee clearances.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchAdmissions}
            className="p-2 border border-gray-200 bg-white rounded-lg text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by student name, parent name or app number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full glass-input text-xs"
          />
        </div>
        <div className="w-full md:w-64">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full glass-input text-xs"
          >
            <option value="">All App Stages</option>
            <option>Application Started</option>
            <option>Application Submitted</option>
            <option>Documents Pending</option>
            <option>Verification</option>
            <option>Approved</option>
            <option>Admission Confirmed</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Directory Table */}
      <div className="glass-card overflow-hidden">
        <AdmissionsTable
          loading={loading}
          admissions={admissions}
          handleUpdatePayment={handleUpdatePayment}
          handleUpdateStatus={handleUpdateStatus}
          setSelectedApp={setSelectedApp}
          setShowDocModal={setShowDocModal}
        />
      </div>

      {/* Document Upload Modal */}
      <UploadDocModal
        showDocModal={showDocModal}
        setShowDocModal={setShowDocModal}
        selectedApp={selectedApp}
        setSelectedApp={setSelectedApp}
        docForm={docForm}
        setDocForm={setDocForm}
        handleUploadDoc={handleUploadDoc}
        modalLoading={modalLoading}
      />
    </div>
  );
}
