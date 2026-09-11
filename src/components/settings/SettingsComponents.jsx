import React from 'react';
import {
  Settings as SettingsIcon,
  Link2,
  RefreshCw,
  Copy,
  Check,
  Send,
  Loader2,
  RotateCcw
} from 'lucide-react';
import config from '../../config';

export function SchoolIdentity({
  schoolSettings,
  setSchoolSettings,
  handleSaveSettings,
  saveLoading
}) {
  return (
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
  );
}

export function WebsiteIngestion({
  apiKey,
  apiKeyCopied,
  copyToClipboard,
  handleRegenApiKey
}) {
  return (
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
  );
}

export function GoogleAdsIngestion({
  googleKey,
  googleKeyCopied,
  copyGoogleKey,
  handleRegenGoogleKey
}) {
  const webhookUrl = `${config.apiServerUrl || window.location.origin}/api/webhooks/google`;

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <Link2 className="w-4.5 h-4.5 text-blue-500" />
          <span>Google Ads Lead Delivery Webhook</span>
        </h3>
        <a
          href="/marketing/google"
          className="text-[11px] font-bold text-brand-600 hover:text-brand-700"
        >
          Open Google Hub →
        </a>
      </div>

      <p className="text-xs text-slate-400">
        Deliver leads directly from Google Ads Lead Form extension:
        <code className="block mt-2 bg-gray-100 p-2 rounded text-[10px] font-mono text-slate-600 border border-gray-200 truncate">
          POST {webhookUrl}
        </code>
      </p>

      <div className="space-y-2 text-xs">
        <label className="text-slate-400 font-semibold">Google Webhook Key (`google_key`)</label>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={googleKey || 'Generating Key...'}
            className="flex-1 glass-input bg-gray-50 text-slate-500 font-mono text-[10px]"
          />
          <button
            onClick={() => copyGoogleKey(googleKey)}
            disabled={!googleKey}
            className="p-2 border border-gray-200 bg-white rounded-lg text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            {googleKeyCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleRegenGoogleKey}
            className="glass-btn-secondary px-3 py-1.5 font-semibold text-xs text-rose-600 hover:text-rose-700"
          >
            Regenerate
          </button>
        </div>
      </div>
    </div>
  );
}

export function WebhookSimulator({
  simForm,
  setSimForm,
  handleSimulateWebhook,
  simLoading,
  simResult
}) {
  return (
    <div className="glass-card p-6 space-y-4">
      <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-gray-200 pb-2">
        <Send className="w-4 h-4 text-emerald-400" />
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
            <div className="space-y-1 text-slate-350 pt-1 text-[10px]">
              <p>• Lead Created: <span className="font-bold font-mono text-slate-700">{simResult.lead.studentName} ({simResult.lead.leadId})</span></p>
              <p>• Duplicate State: <span className="font-bold text-indigo-400">{simResult.duplicate}</span></p>
              <p>• Allocated Advisor: <span className="font-bold text-amber-400">{simResult.assigned?.name || 'Unassigned'}</span></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function WebhookLogs({
  webhookLogs,
  logsLoading,
  fetchWebhookLogs,
  handleRetryLog
}) {
  return (
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
                  <p className="text-slate-555">Received: {new Date(log.createdAt).toLocaleString()}</p>
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
  );
}
