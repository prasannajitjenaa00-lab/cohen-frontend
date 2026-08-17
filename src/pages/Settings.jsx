import React from 'react';
import { Loader2 } from 'lucide-react';
import useSettings from '../hooks/useSettings';
import { SchoolIdentity, WebsiteIngestion, WebhookSimulator, WebhookLogs } from '../components/settings/SettingsComponents';

export default function Settings() {
  const {
    user,
    schoolSettings,
    setSchoolSettings,
    apiKey,
    apiKeyCopied,
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
    handleSimulateWebhook,
    fetchWebhookLogs,
    handleRetryLog,
    copyToClipboard
  } = useSettings();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <SchoolIdentity
            schoolSettings={schoolSettings}
            setSchoolSettings={setSchoolSettings}
            handleSaveSettings={handleSaveSettings}
            saveLoading={saveLoading}
          />
          <WebsiteIngestion
            apiKey={apiKey}
            apiKeyCopied={apiKeyCopied}
            copyToClipboard={copyToClipboard}
            handleRegenApiKey={handleRegenApiKey}
          />
        </div>
        <div className="space-y-8">
          <WebhookSimulator
            simForm={simForm}
            setSimForm={setSimForm}
            handleSimulateWebhook={handleSimulateWebhook}
            simLoading={simLoading}
            simResult={simResult}
          />
          <WebhookLogs
            webhookLogs={webhookLogs}
            logsLoading={logsLoading}
            fetchWebhookLogs={fetchWebhookLogs}
            handleRetryLog={handleRetryLog}
          />
        </div>
      </div>
    </div>
  );
}

