import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Globe,
  Key,
  Copy,
  Check,
  RefreshCw,
  Send,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  Code2,
  ExternalLink,
  HelpCircle,
  Clock,
  Layers,
  Zap,
  Repeat,
  Info
} from 'lucide-react';
import config from '../../config';

export default function GoogleAdsIntegration() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'simulator', 'logs', 'conversions', 'guide'
  const [loading, setLoading] = useState(true);
  const [configData, setConfigData] = useState(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Settings form state
  const [formConfig, setFormConfig] = useState({
    googleCustomerId: '',
    googleConversionAction: 'School Admission',
    googleConversionValue: 5000,
    googleConversionCurrency: 'INR'
  });

  // Simulator State
  const [simScenario, setSimScenario] = useState('success');
  const [simForm, setSimForm] = useState({
    studentName: 'Aarav Sharma',
    parentName: 'Ramesh Sharma',
    phone: '9876543210',
    email: 'aarav.sharma@example.com',
    classInterested: 'Class 11 Science',
    campaignName: 'School Admission 2026 - Search Ads',
    campaignId: '987654321',
    formId: 'form_123456',
    gclid: 'Cj0KCQjwgJv4BRCrARIsAB1vvuN0_mock' + Math.floor(Math.random() * 10000),
    gbraid: '',
    wbraid: '',
    customKey: ''
  });
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  // Logs State
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logStatusFilter, setLogStatusFilter] = useState('All');
  const [logSearch, setLogSearch] = useState('');
  const [selectedPayload, setSelectedPayload] = useState(null);
  const [retryingLogId, setRetryingLogId] = useState(null);

  // Conversions State
  const [conversions, setConversions] = useState([]);
  const [conversionsLoading, setConversionsLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [apiUploadResult, setApiUploadResult] = useState(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/google/config');
      if (res.data.success) {
        setConfigData(res.data.data);
        setFormConfig({
          googleCustomerId: res.data.data.googleCustomerId || '',
          googleConversionAction: res.data.data.googleConversionAction || 'School Admission',
          googleConversionValue: res.data.data.googleConversionValue || 5000,
          googleConversionCurrency: res.data.data.googleConversionCurrency || 'INR'
        });
      }
    } catch (err) {
      console.error('Error fetching Google config:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      setLogsLoading(true);
      const res = await axios.get('/api/google/webhook-logs', {
        params: { status: logStatusFilter, search: logSearch }
      });
      if (res.data.success) {
        setLogs(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  const fetchConversions = async () => {
    try {
      setConversionsLoading(true);
      const res = await axios.get('/api/google/conversions');
      if (res.data.success) {
        setConversions(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching conversions:', err);
    } finally {
      setConversionsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    if (activeTab === 'logs') fetchLogs();
    if (activeTab === 'conversions') fetchConversions();
  }, [activeTab, logStatusFilter]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      setSaveLoading(true);
      const res = await axios.put('/api/google/config', formConfig);
      if (res.data.success) {
        alert('Google Ads settings updated successfully');
        fetchConfig();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save config');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleRegenerateKey = async () => {
    if (
      !window.confirm(
        'Are you sure you want to regenerate the Google Webhook Key? You will need to update the key in your Google Ads Lead Form Asset to continue receiving leads.'
      )
    ) {
      return;
    }

    try {
      const res = await axios.post('/api/google/regenerate-key');
      if (res.data.success) {
        alert('New Google Ads Webhook Key generated!');
        fetchConfig();
      }
    } catch (err) {
      alert('Error regenerating key');
    }
  };

  const handleRunSimulation = async (e) => {
    e.preventDefault();
    try {
      setSimLoading(true);
      setSimResult(null);

      const payload = {
        scenario: simScenario,
        ...simForm
      };

      const res = await axios.post('/api/google/simulate-webhook', payload);
      setSimResult(res.data);
      fetchConfig();
    } catch (err) {
      setSimResult({
        success: false,
        status: 'Failed',
        message: err.response?.data?.message || 'Simulation error'
      });
    } finally {
      setSimLoading(false);
    }
  };

  const handleRetryLog = async (logId) => {
    try {
      setRetryingLogId(logId);
      const res = await axios.post(`/api/google/webhook-logs/${logId}/retry`);
      if (res.data.success) {
        alert(res.data.message);
        fetchLogs();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Retry failed');
    } finally {
      setRetryingLogId(null);
    }
  };

  const handleDownloadCsv = async () => {
    try {
      setExportLoading(true);
      const res = await axios.get('/api/google/conversions/export', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `google_ads_conversions_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Error generating conversions CSV');
    } finally {
      setExportLoading(false);
    }
  };

  const handleApiDirectUpload = async () => {
    try {
      const res = await axios.post('/api/google/conversions/upload-api');
      setApiUploadResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'API upload error');
    }
  };

  const webhookPublicUrl = configData?.webhookUrl || `${window.location.origin}/api/webhooks/google`;

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-slate-800">
      {/* Header Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/10 text-white font-bold flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-400" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Google Ads Integration & Setup</h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Real-time Lead Form Webhook Ingestion, GCLID Attribution & Smart Bidding Offline Conversions
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Webhook Operational
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Source: "Google Ads"
          </span>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 border-l-4 border-l-blue-500">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Google Leads</p>
          <p className="text-2xl font-black text-slate-800 mt-1">{configData?.stats?.googleLeadsCount || 0}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Ingested with channel attribution</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Confirmed Admissions</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{configData?.stats?.conversionsCount || 0}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Eligible for Offline Conversion upload</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-purple-500">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Webhooks Processed</p>
          <p className="text-2xl font-black text-purple-600 mt-1">{configData?.stats?.successCount || 0}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Idempotent success deliveries</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-amber-500">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Duplicate Handled</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{configData?.stats?.duplicateCount || 0}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Idempotency deduplication check</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 gap-2 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'overview', label: 'Connection & Credentials', icon: Key },
          { id: 'simulator', label: 'Webhook Simulator (Test QA)', icon: Zap },
          { id: 'logs', label: 'Live Webhook Logs', icon: Clock },
          { id: 'conversions', label: 'Offline Conversions (CSV / API)', icon: FileSpreadsheet },
          { id: 'guide', label: 'Google Ads Setup Guide', icon: HelpCircle }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-brand-600 text-brand-600 bg-brand-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & CREDENTIALS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Webhook Configuration Card */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <Key className="w-4.5 h-4.5 text-blue-500" />
                  <h3 className="text-sm font-bold text-slate-700">Webhook Connection Endpoints</h3>
                </div>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded">
                  HTTP POST
                </span>
              </div>

              {/* Webhook URL */}
              <div className="space-y-1.5 text-xs">
                <label className="text-slate-500 font-semibold flex items-center justify-between">
                  <span>Google Ads Webhook Delivery URL</span>
                  <span className="text-[10px] text-emerald-600 font-normal">Supports standard Google Ads schema</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={webhookPublicUrl}
                    className="flex-1 glass-input bg-gray-50 text-slate-600 font-mono text-[11px]"
                  />
                  <button
                    onClick={() => copyToClipboard(webhookPublicUrl, 'url')}
                    className="px-3 py-2 border border-gray-200 bg-white rounded-lg text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1 text-xs"
                  >
                    {copiedUrl ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Google Webhook Key */}
              <div className="space-y-1.5 text-xs">
                <label className="text-slate-500 font-semibold flex items-center justify-between">
                  <span>Google Webhook Verification Key (`google_key`)</span>
                  <span className="text-[10px] text-indigo-600 font-normal">Cryptographically Secure Random Token</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={configData?.googleWebhookKey || 'Generating key...'}
                    className="flex-1 glass-input bg-gray-50 text-slate-600 font-mono text-[11px]"
                  />
                  <button
                    onClick={() => copyToClipboard(configData?.googleWebhookKey, 'key')}
                    className="px-3 py-2 border border-gray-200 bg-white rounded-lg text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1 text-xs"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleRegenerateKey}
                    className="glass-btn-secondary px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700"
                  >
                    Regenerate Key
                  </button>
                </div>
              </div>

              {/* Security Badges */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-[10px] font-medium text-slate-500">
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Timing-Safe Key Validation</span>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Dedicated Rate Limiter Active</span>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>IP & User-Agent Auditing</span>
                </div>
              </div>
            </div>

            {/* Campaign & Conversion Tracking Settings */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b border-gray-200 pb-3 flex items-center gap-2">
                <Globe className="w-4.5 h-4.5 text-indigo-500" />
                <span>Google Ads Account & Conversion Tracking</span>
              </h3>

              <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-500 font-semibold">Google Ads Customer ID (Account ID)</label>
                    <input
                      type="text"
                      placeholder="e.g. 123-456-7890"
                      value={formConfig.googleCustomerId}
                      onChange={(e) => setFormConfig({ ...formConfig, googleCustomerId: e.target.value })}
                      className="w-full glass-input"
                    />
                    <span className="text-[10px] text-slate-400">Found in top-right of your Google Ads dashboard</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500 font-semibold">Conversion Action Name</label>
                    <input
                      type="text"
                      placeholder="e.g. School Admission"
                      value={formConfig.googleConversionAction}
                      onChange={(e) => setFormConfig({ ...formConfig, googleConversionAction: e.target.value })}
                      className="w-full glass-input"
                    />
                    <span className="text-[10px] text-slate-400">Exact name of conversion goal in Google Ads</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-500 font-semibold">Default Conversion Value</label>
                    <input
                      type="number"
                      value={formConfig.googleConversionValue}
                      onChange={(e) => setFormConfig({ ...formConfig, googleConversionValue: e.target.value })}
                      className="w-full glass-input"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500 font-semibold">Currency Code</label>
                    <input
                      type="text"
                      value={formConfig.googleConversionCurrency}
                      onChange={(e) => setFormConfig({ ...formConfig, googleConversionCurrency: e.target.value })}
                      className="w-full glass-input"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="glass-btn-primary px-5 py-2 font-semibold text-xs"
                  >
                    {saveLoading ? 'Saving...' : 'Save Configuration'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Quick Info & Quick Start Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-5 space-y-3.5 text-xs">
              <h4 className="font-bold text-slate-700 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                <Info className="w-4 h-4 text-blue-500" />
                <span>How It Works</span>
              </h4>
              <p className="text-slate-500 leading-relaxed">
                When a prospective student or parent completes a Google Lead Form on Search, YouTube, or Discovery ads,
                Google instantly delivers the lead data to this CRM endpoint.
              </p>
              <div className="space-y-2 text-slate-600">
                <div className="p-2.5 rounded bg-blue-50/60 border border-blue-100 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span><strong>Instant Round Robin:</strong> Automatically assigned to counselors in real time.</span>
                </div>
                <div className="p-2.5 rounded bg-emerald-50/60 border border-emerald-100 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Idempotency:</strong> Duplicate form clicks are automatically recognized without spamming.</span>
                </div>
                <div className="p-2.5 rounded bg-purple-50/60 border border-purple-100 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                  <span><strong>Full Click Tracking:</strong> GCLID, GBRAID, and WBRAID attribution recorded for smart bidding.</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-5 space-y-3 text-xs bg-gradient-to-br from-indigo-50/50 to-white">
              <h4 className="font-bold text-slate-700">Quick Test</h4>
              <p className="text-slate-500">
                Want to test the connection without running live ads? Use our interactive Webhook Simulator.
              </p>
              <button
                onClick={() => setActiveTab('simulator')}
                className="w-full glass-btn-secondary py-2 text-xs font-semibold text-brand-600 flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-brand-500" />
                <span>Open Lead Simulator</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SIMULATOR (WITH ALL PRODUCTION-READY TEST SCENARIOS) */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4.5 h-4.5 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-700">Google Ads Webhook Simulation Lab</h3>
                </div>
                <span className="text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded">
                  QA & Validation Hub
                </span>
              </div>

              {/* Scenario Selector */}
              <div className="space-y-1.5 text-xs">
                <label className="text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  Select Test Scenario
                </label>
                <select
                  value={simScenario}
                  onChange={(e) => setSimScenario(e.target.value)}
                  className="w-full glass-input text-xs font-semibold py-2 bg-white"
                >
                  <option value="success">✅ Scenario 1: Valid Lead Form Submission (Success)</option>
                  <option value="test_ping">🧪 Scenario 2: Google Ads "Send Test Data" Ping (is_test: true)</option>
                  <option value="duplicate">🔄 Scenario 3: Duplicate Submission (Idempotency Check)</option>
                  <option value="unauthorized">🔒 Scenario 4: Unauthorized / Invalid Webhook Key (401 Error)</option>
                  <option value="missing_fields">⚠️ Scenario 5: Missing Required Fields (Validation Failure)</option>
                  <option value="server_error">💥 Scenario 6: Simulated Server Error (Exponential Backoff Trigger)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  {simScenario === 'success' && 'Fires a complete, valid Google Ads Lead Form payload. Verifies lead creation, counselor assignment, and GCLID attribution.'}
                  {simScenario === 'test_ping' && 'Emulates Google Ads "Send test data" button click. Tests HTTP 200 verification response without cluttering CRM leads.'}
                  {simScenario === 'duplicate' && 'Reuses an existing Google Lead ID to test idempotency and duplicate deduplication prevention.'}
                  {simScenario === 'unauthorized' && 'Sends payload with an invalid or tampered google_key to verify constant-time key rejection and security audit logging.'}
                  {simScenario === 'missing_fields' && 'Omits student name and contact information to verify validation logic and error reporting.'}
                  {simScenario === 'server_error' && 'Simulates downstream processing exception and verifies automatic exponential backoff retry scheduling.'}
                </p>
              </div>

              {/* Simulation Form Data */}
              <form onSubmit={handleRunSimulation} className="space-y-4 text-xs pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-500 font-semibold">Student Name</label>
                    <input
                      type="text"
                      value={simForm.studentName}
                      onChange={(e) => setSimForm({ ...simForm, studentName: e.target.value })}
                      className="w-full glass-input"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500 font-semibold">Parent / Guardian Name</label>
                    <input
                      type="text"
                      value={simForm.parentName}
                      onChange={(e) => setSimForm({ ...simForm, parentName: e.target.value })}
                      className="w-full glass-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-500 font-semibold">Contact Mobile</label>
                    <input
                      type="tel"
                      value={simForm.phone}
                      onChange={(e) => setSimForm({ ...simForm, phone: e.target.value })}
                      className="w-full glass-input"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500 font-semibold">Email Address</label>
                    <input
                      type="email"
                      value={simForm.email}
                      onChange={(e) => setSimForm({ ...simForm, email: e.target.value })}
                      className="w-full glass-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-500 font-semibold">Class Interested</label>
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
                      <option>Class 11 Science</option>
                      <option>Class 11 Commerce</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500 font-semibold">Campaign Name</label>
                    <input
                      type="text"
                      value={simForm.campaignName}
                      onChange={(e) => setSimForm({ ...simForm, campaignName: e.target.value })}
                      className="w-full glass-input"
                    />
                  </div>
                </div>

                {/* Attribution Click IDs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">GCLID (Web Click)</label>
                    <input
                      type="text"
                      value={simForm.gclid}
                      onChange={(e) => setSimForm({ ...simForm, gclid: e.target.value })}
                      className="w-full glass-input text-[10px] font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">GBRAID (iOS Web)</label>
                    <input
                      type="text"
                      placeholder="Optional"
                      value={simForm.gbraid}
                      onChange={(e) => setSimForm({ ...simForm, gbraid: e.target.value })}
                      className="w-full glass-input text-[10px] font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">WBRAID (iOS App)</label>
                    <input
                      type="text"
                      placeholder="Optional"
                      value={simForm.wbraid}
                      onChange={(e) => setSimForm({ ...simForm, wbraid: e.target.value })}
                      className="w-full glass-input text-[10px] font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={simLoading}
                    className="glass-btn-primary px-6 py-2.5 font-bold flex items-center gap-2"
                  >
                    {simLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Execute Simulated Webhook</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Simulation Output Card */}
          <div className="space-y-6">
            <div className="glass-card p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 border-b border-gray-200 pb-2 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-indigo-500" />
                <span>Simulation Result</span>
              </h4>

              {simResult ? (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-3 ${
                    simResult.status === 'Success' || simResult.status === 'Test'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : simResult.status === 'Duplicate'
                      ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                      : 'bg-rose-50/70 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {simResult.status === 'Success' || simResult.status === 'Test' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : simResult.status === 'Duplicate' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    )}
                    <span>Status: {simResult.status}</span>
                  </div>

                  <p className="text-[11px] leading-relaxed">{simResult.message}</p>

                  {simResult.lead && (
                    <div className="pt-2 border-t border-gray-200/60 space-y-1.5 text-[11px]">
                      <p>
                        <span className="font-semibold">CRM Lead ID:</span>{' '}
                        <span className="font-mono font-bold">{simResult.lead.leadId}</span>
                      </p>
                      <p>
                        <span className="font-semibold">Student:</span> {simResult.lead.studentName}
                      </p>
                      <p>
                        <span className="font-semibold">Assigned Advisor:</span>{' '}
                        {simResult.lead.assignedCounsellor?.name || 'Auto-Assigned via Round Robin'}
                      </p>
                      <p>
                        <span className="font-semibold">Origin Source:</span>{' '}
                        <span className="font-bold text-blue-600">{simResult.lead.leadSource}</span>
                      </p>
                    </div>
                  )}

                  {simResult.logEntry && (
                    <div className="pt-1 text-[10px] text-slate-500 font-mono">
                      Log Record ID: {simResult.logEntry._id}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Run a simulation to view live payload parsing, duplicate check, and counselor routing.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE WEBHOOK AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="glass-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-700">Google Ads Webhook Audit Logs</h3>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Status Filter */}
              <select
                value={logStatusFilter}
                onChange={(e) => setLogStatusFilter(e.target.value)}
                className="glass-input text-xs py-1.5"
              >
                <option value="All">All Statuses</option>
                <option value="Success">Success</option>
                <option value="Duplicate">Duplicate</option>
                <option value="Test">Test Ping</option>
                <option value="Failed">Failed</option>
                <option value="Unauthorized">Unauthorized</option>
                <option value="Processing">Processing</option>
              </select>

              <button
                onClick={fetchLogs}
                disabled={logsLoading}
                className="p-2 border border-gray-200 bg-white rounded-lg text-slate-600 hover:text-slate-900 cursor-pointer"
                title="Refresh Logs"
              >
                <RefreshCw className={`w-4 h-4 ${logsLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Google Lead ID</th>
                  <th className="py-2.5 px-3">Campaign / Form</th>
                  <th className="py-2.5 px-3">GCLID</th>
                  <th className="py-2.5 px-3">IP / Timestamp</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-slate-400 text-xs">
                      {logsLoading ? 'Loading audit logs...' : 'No webhook logs found'}
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50/60">
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            log.status === 'Success'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : log.status === 'Test'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : log.status === 'Duplicate'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : log.status === 'Unauthorized'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">
                        {log.leadId || log.eventId || 'N/A'}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        <p className="font-semibold truncate max-w-[160px]">{log.campaignName || 'Campaign'}</p>
                        <p className="text-[10px] text-slate-400">Form: {log.formId || 'N/A'}</p>
                      </td>
                      <td className="py-3 px-3 font-mono text-[10px] text-slate-500 truncate max-w-[120px]" title={log.gclid}>
                        {log.gclid || '—'}
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[10px]">
                        <p>{new Date(log.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                        <p className="font-mono text-slate-400">{log.ipAddress || 'unknown'}</p>
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          onClick={() => setSelectedPayload(log.rawPayload)}
                          className="px-2.5 py-1 border border-gray-200 rounded text-[11px] font-semibold text-slate-600 hover:bg-gray-100 cursor-pointer"
                        >
                          Payload
                        </button>
                        {log.status === 'Failed' && (
                          <button
                            onClick={() => handleRetryLog(log._id)}
                            disabled={retryingLogId === log._id}
                            className="px-2.5 py-1 bg-rose-50 border border-rose-200 rounded text-[11px] font-semibold text-rose-600 hover:bg-rose-100 cursor-pointer"
                          >
                            {retryingLogId === log._id ? 'Retrying...' : 'Retry'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: OFFLINE CONVERSIONS (SMART BIDDING OPTIMIZATION) */}
      {activeTab === 'conversions' && (
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <FileSpreadsheet className="w-4.5 h-4.5 text-emerald-600" />
                  <span>Google Ads Smart Bidding Offline Conversions</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Export confirmed student admissions to Google Ads to optimize smart bidding (tCPA/tROAS) on real student enrollments.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadCsv}
                  disabled={exportLoading || conversions.length === 0}
                  className="glass-btn-primary px-4 py-2 font-bold text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{exportLoading ? 'Generating CSV...' : 'Download Google Ads CSV'}</span>
                </button>
              </div>
            </div>

            {/* Conversions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Student / Lead ID</th>
                    <th className="py-2.5 px-3">Conversion Action</th>
                    <th className="py-2.5 px-3">Google Click ID (GCLID)</th>
                    <th className="py-2.5 px-3">Confirmed Date</th>
                    <th className="py-2.5 px-3">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {conversions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-slate-400 text-xs">
                        {conversionsLoading
                          ? 'Checking converted leads...'
                          : 'No confirmed admissions with Google Click ID found yet. Once leads from Google Ads reach "Admission Confirmed", they will appear here.'}
                      </td>
                    </tr>
                  ) : (
                    conversions.map((conv) => (
                      <tr key={conv._id} className="hover:bg-gray-50/60">
                        <td className="py-3 px-3">
                          <p className="font-bold text-slate-800">{conv.studentName}</p>
                          <p className="text-[10px] font-mono text-slate-400">{conv.leadId}</p>
                        </td>
                        <td className="py-3 px-3 font-semibold text-indigo-600">
                          {configData?.googleConversionAction || 'School Admission'}
                        </td>
                        <td className="py-3 px-3 font-mono text-[10px] text-slate-600 truncate max-w-[180px]" title={conv.gclid}>
                          {conv.gclid || conv.wbraid || conv.gbraid}
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-[11px]">
                          {new Date(conv.updatedAt).toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' })}
                        </td>
                        <td className="py-3 px-3 font-bold text-emerald-600">
                          ₹{configData?.googleConversionValue || 5000} {configData?.googleConversionCurrency || 'INR'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Direct API Upload Card (Modular Future Interface) */}
          <div className="glass-card p-6 space-y-3 bg-gradient-to-br from-gray-50 to-white border border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>Google Ads API Direct Sync</span>
              </h4>
              <span className="text-[10px] font-semibold bg-gray-100 text-slate-600 px-2 py-0.5 rounded border border-gray-200">
                Modular REST / Client Service
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              When Google Ads Developer Token and OAuth credentials are saved in your settings, Cohen CRM can sync conversions automatically via Google Ads REST API `ConversionUploadService`.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleApiDirectUpload}
                className="glass-btn-secondary px-3 py-1.5 text-xs font-semibold text-slate-700"
              >
                Test Direct API Sync
              </button>
            </div>
            {apiUploadResult && (
              <div className="p-3 rounded bg-blue-50 border border-blue-200 text-xs text-blue-900 mt-2">
                <p className="font-bold">{apiUploadResult.message}</p>
                {apiUploadResult.instructions && (
                  <ul className="mt-1 space-y-0.5 text-[11px] text-blue-800">
                    {apiUploadResult.instructions.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: STEP-BY-STEP SETUP GUIDE */}
      {activeTab === 'guide' && (
        <div className="glass-card p-6 space-y-6 text-xs text-slate-600">
          <h3 className="text-sm font-bold text-slate-800 border-b border-gray-200 pb-3 flex items-center gap-2">
            <HelpCircle className="w-4.5 h-4.5 text-blue-500" />
            <span>How to Configure Google Ads Lead Form Asset Webhook</span>
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                1
              </span>
              <div className="space-y-1">
                <p className="font-bold text-slate-800 text-sm">Create or Edit a Lead Form Asset</p>
                <p className="text-slate-500">
                  In Google Ads, navigate to <strong>Campaigns</strong> &gt; <strong>Assets</strong> &gt; <strong>Lead Form</strong>.
                  Add fields like Full Name, Phone Number, Email, and custom questions like "Which Class are you interested in?".
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                2
              </span>
              <div className="space-y-1">
                <p className="font-bold text-slate-800 text-sm">Enter Webhook Delivery Options</p>
                <p className="text-slate-500">
                  Scroll to the <strong>Lead delivery option</strong> section at the bottom of the lead form creation window.
                  Select <strong>"Manage your leads with a webhook"</strong>.
                </p>
                <div className="p-3 bg-white rounded border border-gray-200 space-y-1.5 mt-2">
                  <p>• <strong>Webhook URL:</strong> <code className="text-[11px] font-mono bg-gray-100 px-1 py-0.5 rounded text-blue-600">{webhookPublicUrl}</code></p>
                  <p>• <strong>Key:</strong> <code className="text-[11px] font-mono bg-gray-100 px-1 py-0.5 rounded text-blue-600">{configData?.googleWebhookKey}</code></p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                3
              </span>
              <div className="space-y-1">
                <p className="font-bold text-slate-800 text-sm">Click "Send test data"</p>
                <p className="text-slate-500">
                  Click the <strong>Send test data</strong> button in Google Ads. Google will send an HTTP POST request with <code className="font-mono text-slate-700">is_test: true</code>.
                  Cohen CRM will return <code className="font-mono text-emerald-600 font-bold">200 OK</code> and Google Ads will display a green checkmark indicating successful verification!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                4
              </span>
              <div className="space-y-1">
                <p className="font-bold text-slate-800 text-sm">Save and Start Receiving Inbound Leads</p>
                <p className="text-slate-500">
                  Save your Lead Form Asset and attach it to your Search, Video, or Demand Gen campaigns. All inbound leads will be created with source <strong>"Google Ads"</strong> and routed via your school's assignment rules.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Raw Payload Modal */}
      {selectedPayload && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-white p-6 max-w-2xl w-full space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-blue-500" />
                <span>Raw Webhook Payload (JSON)</span>
              </h4>
              <button
                onClick={() => setSelectedPayload(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-[11px] leading-relaxed">
              <pre>{JSON.stringify(selectedPayload, null, 2)}</pre>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedPayload(null)}
                className="glass-btn-secondary px-4 py-1.5 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
