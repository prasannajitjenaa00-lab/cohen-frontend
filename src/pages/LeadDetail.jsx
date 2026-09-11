import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useLeadDetail from '../hooks/useLeadDetail';
import LeadDetailHeader from '../components/leaddetail/LeadDetailHeader';
import { StageTracker, LeadProfileCards, EngagementLogger, ActivityTimeline } from '../components/leaddetail/LeadDetailComponents';

export default function LeadDetail() {
  const {
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
  } = useLeadDetail();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-20 text-xs text-slate-500">
        Lead not found. <Link to="/leads" className="text-brand-400">Go back</Link>
      </div>
    );
  }

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

  const currentStatusIndex = pipelineStatuses.indexOf(lead.status);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Detail header */}
      <LeadDetailHeader
        lead={lead}
        actionLoading={actionLoading}
        initiateAdmission={initiateAdmission}
      />

      <StageTracker
        user={user}
        pipelineStatuses={pipelineStatuses}
        currentStatusIndex={currentStatusIndex}
        handleStatusChange={handleStatusChange}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LeadProfileCards lead={lead} />

        <div className="lg:col-span-2 space-y-6">
          <EngagementLogger
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            actionLoading={actionLoading}
            handleAddNote={handleAddNote}
            noteContent={noteContent}
            setNoteContent={setNoteContent}
            handleLogCall={handleLogCall}
            callForm={callForm}
            setCallForm={setCallForm}
            handleScheduleFollowUp={handleScheduleFollowUp}
            followUpForm={followUpForm}
            setFollowUpForm={setFollowUpForm}
          />

          <ActivityTimeline timeline={timeline} />
        </div>
      </div>
    </div>
  );
}

