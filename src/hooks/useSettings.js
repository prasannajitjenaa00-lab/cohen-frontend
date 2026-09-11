import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function useSettings() {
  const { user } = useAuth();

  // Settings State
  const [schoolSettings, setSchoolSettings] = useState({
    schoolName: '',
    schoolPhone: '',
    schoolEmail: '',
    schoolAddress: '',
    schoolWebsite: '',
    assignmentMethod: 'Round Robin'
  });

  const [apiKey, setApiKey] = useState('');
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [googleKey, setGoogleKey] = useState('');
  const [googleKeyCopied, setGoogleKeyCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  // Webhook Simulator State
  const [simForm, setSimForm] = useState({
    name: 'Suresh Kumar',
    email: 'suresh@example.com',
    phone: '9876543230',
    classInterested: 'Class 8',
    campaignName: 'Secondary School Campaign',
    platform: 'facebook'
  });
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  // Webhook Logs State
  const [webhookLogs, setWebhookLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const fetchSettingsData = async () => {
    try {
      setLoading(true);
      const [settingsRes, logsRes] = await Promise.all([
        axios.get('/api/settings'),
        axios.get('/api/meta/webhook-logs')
      ]);

      if (settingsRes.data.success) {
        const { settings } = settingsRes.data.data;
        setSchoolSettings({
          schoolName: settings.schoolName || '',
          schoolPhone: settings.schoolPhone || '',
          schoolEmail: settings.schoolEmail || '',
          schoolAddress: settings.schoolAddress || '',
          schoolWebsite: settings.schoolWebsite || '',
          assignmentMethod: settings.assignmentMethod || 'Round Robin'
        });
        setApiKey(settings.websiteApiKey || '');
        setGoogleKey(settings.googleWebhookKey || '');
      }

      if (logsRes.data.success) {
        setWebhookLogs(logsRes.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsData();
  }, []);

  // Save CRM Global settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSaveLoading(true);
      const res = await axios.put('/api/settings', schoolSettings);
      if (res.data.success) {
        alert('Global settings saved successfully');
      }
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaveLoading(false);
    }
  };

  // Regenerate public API key
  const handleRegenApiKey = async () => {
    if (!window.confirm('Regenerating the API Key will break existing website form submissions until updated. Continue?')) return;
    try {
      const res = await axios.post('/api/settings/regenerate-api-key');
      if (res.data.success) {
        setApiKey(res.data.apiKey);
        alert('New API Key Generated');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Run Simulation webhook
  const handleSimulateWebhook = async (e) => {
    e.preventDefault();
    try {
      setSimLoading(true);
      setSimResult(null);
      
      const payload = {
        leadId: `mock_lead_${Date.now()}`,
        formId: 'mock_form_id',
        pageId: 'mock_page_id',
        studentName: simForm.name,
        parentName: 'Simulated Parent',
        phone: simForm.phone,
        email: simForm.email,
        classInterested: simForm.classInterested,
        campaignName: simForm.campaignName,
        platform: simForm.platform
      };

      const res = await axios.post('/api/meta/simulate-webhook', payload);
      if (res.data.success) {
        setSimResult({
          success: true,
          message: res.data.message,
          lead: res.data.lead,
          duplicate: res.data.duplicateStatus,
          assigned: res.data.assignedCounsellor
        });
        fetchWebhookLogs();
      }
    } catch (err) {
      setSimResult({
        success: false,
        message: err.response?.data?.message || 'Simulation ingestion failed'
      });
    } finally {
      setSimLoading(false);
    }
  };

  const fetchWebhookLogs = async () => {
    try {
      setLogsLoading(true);
      const res = await axios.get('/api/meta/webhook-logs');
      if (res.data.success) {
        setWebhookLogs(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLogsLoading(false);
    }
  };

  // Retry ingestion logic
  const handleRetryLog = async (id) => {
    try {
      const res = await axios.post(`/api/meta/webhook-logs/${id}/retry`);
      if (res.data.success) {
        alert(res.data.message);
        fetchWebhookLogs();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Retry failed');
    }
  };

  const handleRegenGoogleKey = async () => {
    if (!window.confirm('Regenerating the Google Webhook Key will require updating the key in Google Ads Lead Form Asset. Continue?')) return;
    try {
      const res = await axios.post('/api/google/regenerate-key');
      if (res.data.success) {
        setGoogleKey(res.data.googleWebhookKey);
        alert('New Google Ads Webhook Key Generated');
      }
    } catch (e) {
      console.error(e);
      alert('Error regenerating key');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const copyGoogleKey = (text) => {
    navigator.clipboard.writeText(text);
    setGoogleKeyCopied(true);
    setTimeout(() => setGoogleKeyCopied(false), 2000);
  };

  return {
    user,
    schoolSettings,
    setSchoolSettings,
    apiKey,
    apiKeyCopied,
    googleKey,
    googleKeyCopied,
    loading,
    saveLoading,
    simForm,
    setSimForm,
    simResult,
    simLoading,
    webhookLogs,
    logsLoading,
    handleSaveSettings,
    handleRegenApiKey,
    handleRegenGoogleKey,
    handleSimulateWebhook,
    fetchWebhookLogs,
    handleRetryLog,
    copyToClipboard,
    copyGoogleKey
  };
}
