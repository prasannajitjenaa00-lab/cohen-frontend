import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function useLeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State Variables
  const [lead, setLead] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notes'); // notes, calls, followups

  // Form States
  const [noteContent, setNoteContent] = useState('');
  const [callForm, setCallForm] = useState({ outcome: 'Connected', duration: '', summary: '' });
  const [followUpForm, setFollowUpForm] = useState({ date: '', time: '', type: 'Call', notes: '' });
  
  const [actionLoading, setActionLoading] = useState(false);
  const [settings, setSettings] = useState(null);

  const fetchLeadDetails = async () => {
    try {
      setLoading(true);
      const [leadRes, settingsRes] = await Promise.all([
        axios.get(`/api/leads/${id}`),
        axios.get('/api/settings')
      ]);

      if (leadRes.data.success) {
        setLead(leadRes.data.data.lead);
        setTimeline(leadRes.data.data.timeline || []);
      }
      if (settingsRes.data.success) {
        setSettings(settingsRes.data.data.settings);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  // Handle lead status updates via stepper clicks or drop selection
  const handleStatusChange = async (newStatus) => {
    if (newStatus === lead.status) return;

    try {
      const res = await axios.put(`/api/leads/${id}`, { status: newStatus });
      if (res.data.success) {
        fetchLeadDetails();
      }
    } catch (e) {
      console.error('Failed to change status:', e);
    }
  };

  // Submit Note Activity
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    try {
      setActionLoading(true);
      const res = await axios.post(`/api/leads/${id}/notes`, { content: noteContent });
      if (res.data.success) {
        setNoteContent('');
        fetchLeadDetails();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Call Log Activity
  const handleLogCall = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await axios.post(`/api/leads/${id}/calls`, callForm);
      if (res.data.success) {
        setCallForm({ outcome: 'Connected', duration: '', summary: '' });
        fetchLeadDetails();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Follow-up Scheduler Activity
  const handleScheduleFollowUp = async (e) => {
    e.preventDefault();
    if (!followUpForm.date || !followUpForm.time) {
      alert('Please select date and time');
      return;
    }

    try {
      setActionLoading(true);
      const res = await axios.post(`/api/leads/${id}/followups`, followUpForm);
      if (res.data.success) {
        setFollowUpForm({ date: '', time: '', type: 'Call', notes: '' });
        fetchLeadDetails();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // Trigger admission onboarding manually
  const initiateAdmission = async () => {
    if (!window.confirm('Do you want to create an official Admission Application for this lead?')) return;
    try {
      setActionLoading(true);
      const res = await axios.post('/api/admissions', { leadId: lead._id });
      if (res.data.success) {
        navigate('/admissions');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start application');
    } finally {
      setActionLoading(false);
    }
  };

  return {
    user,
    lead,
    timeline,
    loading,
    activeTab,
    setActiveTab,
    noteContent,
    setNoteContent,
    callForm,
    setCallForm,
    followUpForm,
    setFollowUpForm,
    actionLoading,
    settings,
    handleStatusChange,
    handleAddNote,
    handleLogCall,
    handleScheduleFollowUp,
    initiateAdmission
  };
}
