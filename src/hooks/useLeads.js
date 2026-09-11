import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function useLeads() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // State Variables
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [source, setSource] = useState('');
  const [priority, setPriority] = useState('');
  const [counsellor, setCounsellor] = useState('');
  const [classInt, setClassInt] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Dropdown Options
  const [counsellors, setCounsellors] = useState([]);
  const [settings, setSettings] = useState(null);

  // Modal Controls
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [targetCounsellor, setTargetCounsellor] = useState('');

  // Bulk Allocation Controls
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);
  const [bulkStaffId, setBulkStaffId] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState('');

  // Form State
  const [newLeadForm, setNewLeadForm] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    alternatePhone: '',
    email: '',
    classInterested: 'Class 8',
    academicYear: '2026-2027',
    leadSource: 'Manual',
    priority: 'Medium',
    address: '',
    city: '',
    state: ''
  });

  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Fetch Settings (counsellors & filters list)
  const fetchFilterOptions = async () => {
    try {
      const [usersRes, settingsRes] = await Promise.all([
        axios.get('/api/settings/users'),
        axios.get('/api/settings')
      ]);
      if (usersRes.data.success) {
        // Permitted staff for lead allocation: Counsellors, Admission Staff, Senior Zonal Managers, Admissions Officers
        const permittedStaff = (usersRes.data.data || []).filter(
          u => u.status === 'Active' && u.role !== 'SUPER_USER' && u.role !== 'CGO'
        );
        setCounsellors(permittedStaff);
      }
      if (settingsRes.data.success) {
        setSettings(settingsRes.data.data.settings);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch Leads List
  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams();
      queryParams.set('page', page);
      queryParams.set('limit', limit);
      
      if (search) queryParams.set('search', search);
      if (status) queryParams.set('status', status);
      if (source) queryParams.set('leadSource', source);
      if (priority) queryParams.set('priority', priority);
      if (counsellor) queryParams.set('assignedCounsellor', counsellor);
      if (classInt) queryParams.set('classInterested', classInt);
      if (startDate) queryParams.set('startDate', startDate);
      if (endDate) queryParams.set('endDate', endDate);

      const res = await axios.get(`/api/leads?${queryParams.toString()}`);
      if (res.data.success) {
        setLeads(res.data.data);
        setTotal(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    // Read query param from search url
    const qSearch = searchParams.get('search') || '';
    const qStatus = searchParams.get('status') || '';
    setSearch(qSearch);
    setStatus(qStatus);
  }, [searchParams]);

  useEffect(() => {
    fetchLeads();
  }, [page, status, source, priority, counsellor, classInt, startDate, endDate]);

  // Handle manual submit trigger
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLeads();
  };

  // Handle Add Lead Form Submission
  const handleAddLead = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!newLeadForm.studentName || !newLeadForm.parentName || !newLeadForm.phone) {
      setFormError('Please fill in required fields: Student Name, Parent Name, and Phone');
      return;
    }

    try {
      setFormLoading(true);
      const res = await axios.post('/api/leads', newLeadForm);
      if (res.data.success) {
        setShowAddModal(false);
        setNewLeadForm({
          studentName: '',
          parentName: '',
          phone: '',
          alternatePhone: '',
          email: '',
          classInterested: 'Class 8',
          academicYear: '2026-2027',
          leadSource: 'Manual',
          priority: 'Medium',
          address: '',
          city: '',
          state: ''
        });
        setPage(1);
        fetchLeads();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create lead');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Staff Assignment Submit (Single Lead)
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!targetCounsellor) return;

    try {
      const res = await axios.post(`/api/leads/${selectedLead._id}/assign`, {
        targetStaffId: targetCounsellor,
        counsellorId: targetCounsellor
      });
      if (res.data.success) {
        setShowAssignModal(false);
        setSelectedLead(null);
        setTargetCounsellor('');
        fetchLeads();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle selection for a single lead checkbox
  const toggleSelectLead = (id) => {
    setSelectedLeadIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Select all leads on the current page
  const selectAllLeads = () => {
    if (selectedLeadIds.length === leads.length && leads.length > 0) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(leads.map(l => l._id));
    }
  };

  // Clear all selections
  const clearSelectedLeads = () => {
    setSelectedLeadIds([]);
  };

  // Handle Bulk Lead Allocation Submit
  const handleBulkAssignSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!bulkStaffId || selectedLeadIds.length === 0) return;

    try {
      setBulkLoading(true);
      setBulkError('');
      const res = await axios.post('/api/leads/bulk-assign', {
        leadIds: selectedLeadIds,
        targetStaffId: bulkStaffId
      });

      if (res.data.success) {
        setShowBulkAssignModal(false);
        setSelectedLeadIds([]);
        setBulkStaffId('');
        fetchLeads();
      }
    } catch (err) {
      console.error(err);
      setBulkError(err.response?.data?.message || 'Failed to bulk allocate leads');
    } finally {
      setBulkLoading(false);
    }
  };

  // Handle Lead Deletion
  const handleDeleteLead = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete lead: ${name}?`)) return;

    try {
      const res = await axios.delete(`/api/leads/${id}`);
      if (res.data.success) {
        fetchLeads();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Clear all filters
  const resetFilters = () => {
    setSearch('');
    setStatus('');
    setSource('');
    setPriority('');
    setCounsellor('');
    setClassInt('');
    setStartDate('');
    setEndDate('');
    setSearchParams({});
    setPage(1);
  };

  return {
    user,
    leads,
    loading,
    total,
    page,
    limit,
    totalPages,
    search,
    setSearch,
    status,
    setStatus,
    source,
    setSource,
    priority,
    setPriority,
    counsellor,
    setCounsellor,
    classInt,
    setClassInt,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    counsellors,
    settings,
    showAddModal,
    setShowAddModal,
    showAssignModal,
    setShowAssignModal,
    selectedLead,
    setSelectedLead,
    targetCounsellor,
    setTargetCounsellor,
    selectedLeadIds,
    setSelectedLeadIds,
    showBulkAssignModal,
    setShowBulkAssignModal,
    bulkStaffId,
    setBulkStaffId,
    bulkLoading,
    bulkError,
    toggleSelectLead,
    selectAllLeads,
    clearSelectedLeads,
    handleBulkAssignSubmit,
    newLeadForm,
    setNewLeadForm,
    formError,
    formLoading,
    handleSearchSubmit,
    handleAddLead,
    handleAssignSubmit,
    handleDeleteLead,
    resetFilters,
    setPage
  };
}
