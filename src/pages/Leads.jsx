import React from 'react';
import useLeads from '../hooks/useLeads';
import LeadsHeader from '../components/leads/LeadsHeader';
import { LeadsFilters, LeadsTable, AddLeadModal, AssignCounsellorModal } from '../components/leads/LeadsComponents';

export default function Leads() {
  const {
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
  } = useLeads();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top action header */}
      <LeadsHeader
        search={search}
        status={status}
        source={source}
        priority={priority}
        counsellor={counsellor}
        classInt={classInt}
        startDate={startDate}
        endDate={endDate}
        setShowAddModal={setShowAddModal}
      />

      {/* Filter and Search Box */}
      <LeadsFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        source={source}
        setSource={setSource}
        priority={priority}
        setPriority={setPriority}
        classInt={classInt}
        setClassInt={setClassInt}
        counsellor={counsellor}
        setCounsellor={setCounsellor}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        settings={settings}
        counsellors={counsellors}
        user={user}
        handleSearchSubmit={handleSearchSubmit}
        resetFilters={resetFilters}
        setPage={setPage}
      />

      {/* Leads Directory Table */}
      <div className="glass-card overflow-hidden">
        <LeadsTable
          loading={loading}
          leads={leads}
          user={user}
          setSelectedLead={setSelectedLead}
          setShowAssignModal={setShowAssignModal}
          handleDeleteLead={handleDeleteLead}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          setPage={setPage}
        />
      </div>

      {/* 1. Modal: Add Lead Form */}
      <AddLeadModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        formError={formError}
        newLeadForm={newLeadForm}
        setNewLeadForm={setNewLeadForm}
        handleAddLead={handleAddLead}
        formLoading={formLoading}
        settings={settings}
      />

      {/* 2. Modal: Assign Counsellor */}
      <AssignCounsellorModal
        showAssignModal={showAssignModal}
        setShowAssignModal={setShowAssignModal}
        selectedLead={selectedLead}
        setSelectedLead={setSelectedLead}
        targetCounsellor={targetCounsellor}
        setTargetCounsellor={setTargetCounsellor}
        counsellors={counsellors}
        handleAssignSubmit={handleAssignSubmit}
      />
    </div>
  );
}

