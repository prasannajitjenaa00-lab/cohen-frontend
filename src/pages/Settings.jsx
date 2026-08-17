import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Settings as SettingsIcon,
  Link2,
  RefreshCw,
  Copy,
  Check,
  Send,
  Loader2,
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import config from '../config';

export default function Settings() {
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
        // Refetch logs list
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      {/* 2-column structure: Left configs, Right Webhook simulator & logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Hand: School & Meta Forms */}
        <div className="space-y-8">
          {/* Section 1: School settings */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-gray-200 pb-2">
              <SettingsIcon className="w-4.5 h-4.5 text-brand-400" />
              <span>School Identity & Routing</span>
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">School Name</label>
                <input
                  type="text"
                  value={schoolSettings.schoolName}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, schoolName: e.target.value })}
                  className="w-full glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Support Email</label>
                  <input
                    type="email"
                    value={schoolSettings.schoolEmail}
                    onChange={(e) => setSchoolSettings({ ...schoolSettings, schoolEmail: e.target.value })}
                    className="w-full glass-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Support Phone</label>
                  <input
                    type="text"
                    value={schoolSettings.schoolPhone}
                    onChange={(e) => setSchoolSettings({ ...schoolSettings, schoolPhone: e.target.value })}
                    className="w-full glass-input"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Lead Router Mode</label>
                <select
                  value={schoolSettings.assignmentMethod}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, assignmentMethod: e.target.value })}
                  className="w-full glass-input"
                >
                  <option>Round Robin</option>
                  <option>Campaign-based</option>
                  <option>Class-based</option>
                  <option>Manual Only</option>
                </select>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="glass-btn-primary px-4 py-1.5 text-xs font-semibold"
                >
                  {saveLoading ? 'Saving...' : 'Save School Info'}
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Website Ingestion */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-gray-200 pb-2">
              <Link2 className="w-4.5 h-4.5 text-indigo-400" />
              <span>Public Website Ingestion</span>
            </h3>
            
            <p className="text-xs text-slate-400">
              Integrate public website registration forms securely. Submit HTTP POST requests to:
              <code className="block mt-2 bg-gray-100 p-2 rounded text-[10px] font-mono text-slate-600 border border-gray-200 truncate">
                POST {config.apiServerUrl || window.location.origin}/api/webhooks/website
              </code>
            </p>

            <div className="space-y-2 text-xs">
              <label className="text-slate-400 font-semibold">Web Ingestion API Key</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={apiKey || 'Generate API Key First...'}
                  className="flex-1 glass-input bg-gray-50 text-slate-500 font-mono text-[10px]"
                />
                <button
                  onClick={() => copyToClipboard(apiKey)}
                  disabled={!apiKey}
                  className="p-2 border border-gray-200 bg-white rounded-lg text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  {apiKeyCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleRegenApiKey}
                  className="glass-btn-secondary px-3 py-1.5 font-semibold text-xs"
                >
                  Regenerate
                </button>
              </div>
            </div>
          </div>


        </div>

        {/* Right Hand: Webhook simulator & logs */}
        <div className="space-y-8">
          {/* Section 4: Webhook Simulator */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-gray-200 pb-2">
              <Play className="w-4 h-4 text-emerald-400" />
              <span>Facebook Webhook Simulator</span>
            </h3>
            
            <p className="text-xs text-slate-450">
              Mock Meta's Lead Ads JSON payload to test deduplication, rule routing, and advisor assignments.
            </p>

            <form onSubmit={handleSimulateWebhook} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Mock Student Name</label>
                  <input
                    type="text"
                    required
                    value={simForm.name}
                    onChange={(e) => setSimForm({ ...simForm, name: e.target.value })}
                    className="w-full glass-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Mock Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={simForm.phone}
                    onChange={(e) => setSimForm({ ...simForm, phone: e.target.value })}
                    className="w-full glass-input"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Mock Email</label>
                  <input
                    type="email"
                    required
                    value={simForm.email}
                    onChange={(e) => setSimForm({ ...simForm, email: e.target.value })}
                    className="w-full glass-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Class Interested</label>
                  <select
                    value={simForm.classInterested}
                    onChange={(e) => setSimForm({ ...simForm, classInterested: e.target.value })}
                    className="w-full glass-input"
                  >
                    <option>Class 6</option>
                    <option>Class 7</option>
                    <option>Class 8</option>
                    <option>Class 9</option>
                    <option>Class 10</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Facebook Ad Campaign</label>
                <input
                  type="text"
                  value={simForm.campaignName}
                  onChange={(e) => setSimForm({ ...simForm, campaignName: e.target.value })}
                  className="w-full glass-input"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={simLoading}
                  className="glass-btn-primary px-4 py-2 font-semibold flex items-center gap-1.5"
                >
                  {simLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Fire Simulated Lead Event</span>
                </button>
              </div>
            </form>

            {/* Simulation Response Printout */}
            {simResult && (
              <div className={`p-4 rounded-lg border text-xs space-y-2 ${
                simResult.success
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-450'
                  : 'bg-rose-500/5 border-rose-500/20 text-rose-455'
              }`}>
                <p className="font-bold flex items-center gap-1.5">
                  <span>●</span> Ingestion Response: {simResult.message}
                </p>
                {simResult.lead && (
                  <div className="space-y-1 text-slate-300 pt-1 text-[10px]">
                    <p>• Lead Created: <span className="font-bold font-mono text-slate-200">{simResult.lead.studentName} ({simResult.lead.leadId})</span></p>
                    <p>• Duplicate State: <span className="font-bold text-indigo-400">{simResult.duplicate}</span></p>
                    <p>• Allocated Advisor: <span className="font-bold text-amber-400">{simResult.assigned?.name || 'Unassigned'}</span></p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 5: Webhook logs */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <RotateCcw className="w-4.5 h-4.5 text-indigo-400" />
                <span>Meta Webhook Logs</span>
              </h3>
              <button
                onClick={fetchWebhookLogs}
                disabled={logsLoading}
                className="p-1 text-slate-500 hover:text-slate-800 rounded transition-all cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${logsLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {webhookLogs.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-550">No webhook logs recorded</div>
              ) : (
                webhookLogs.map((log) => (
                  <div key={log._id} className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-[10px] space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-700 font-mono">ID: {log.leadId}</span>
                        <p className="text-slate-500">Received: {new Date(log.createdAt).toLocaleString()}</p>
                      </div>
                      <span className={`status-pill ${
                        log.status === 'Processed'
                          ? 'status-confirmed'
                          : log.status === 'Pending'
                          ? 'status-followup'
                          : 'status-lost'
                      }`}>
                        {log.status}
                      </span>
                    </div>

                    {log.error && (
                      <p className="text-rose-400 font-mono bg-rose-950/20 p-1.5 rounded border border-rose-900/30">
                        Error: {log.error}
                      </p>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-mono">Platform: {log.platform}</span>
                      {log.status === 'Failed' && (
                        <button
                          onClick={() => handleRetryLog(log._id)}
                          className="px-2 py-0.5 border border-rose-800 bg-rose-950/30 text-rose-400 hover:bg-rose-900 hover:text-white rounded transition-colors text-[9px] font-bold cursor-pointer"
                        >
                          Retry Ingest
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
