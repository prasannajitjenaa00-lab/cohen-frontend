import axios from 'axios';

export const handleExportCSV = async (search, status, source, priority, counsellor, classInt, startDate, endDate) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.set('export', 'true');
    if (search) queryParams.set('search', search);
    if (status) queryParams.set('status', status);
    if (source) queryParams.set('leadSource', source);
    if (priority) queryParams.set('priority', priority);
    if (counsellor) queryParams.set('assignedCounsellor', counsellor);
    if (classInt) queryParams.set('classInterested', classInt);
    if (startDate) queryParams.set('startDate', startDate);
    if (endDate) queryParams.set('endDate', endDate);

    const res = await axios.get(`/api/leads?${queryParams.toString()}`);
    if (res.data.success && res.data.data.length > 0) {
      const headers = ['Lead ID', 'Student Name', 'Parent Name', 'Phone', 'Email', 'Class', 'Source', 'Status', 'Priority', 'Counsellor', 'Created At'];
      const csvRows = res.data.data.map(l => [
        l.leadId,
        l.studentName,
        l.parentName,
        l.phone,
        l.email || '',
        l.classInterested,
        l.leadSource,
        l.status,
        l.priority,
        l.assignedCounsellor?.name || 'Unassigned',
        new Date(l.createdAt).toLocaleDateString()
      ]);

      const csvContent = [headers.join(','), ...csvRows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Cohen_CRM_Leads_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (e) {
    console.error(e);
  }
};
