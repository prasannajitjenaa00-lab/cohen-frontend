import React from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  Loader2,
  X
} from 'lucide-react';

export function AdmissionsTable({
  loading,
  admissions,
  handleUpdatePayment,
  handleUpdateStatus,
  setSelectedApp,
  setShowDocModal
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (admissions.length === 0) {
    return <div className="text-center py-20 text-xs text-slate-500">No admission applications found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 text-[10px] text-slate-500 font-semibold uppercase tracking-wider bg-gray-50/80">
            <th className="py-3 px-5">App ID</th>
            <th className="py-3 px-3">Student Name</th>
            <th className="py-3 px-3">Class & Year</th>
            <th className="py-3 px-3 text-center">Payment Status</th>
            <th className="py-3 px-3">Documents Check</th>
            <th className="py-3 px-3">Advisor</th>
            <th className="py-3 px-3">App Status</th>
            <th className="py-3 px-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {admissions.map((app) => (
            <tr key={app._id} className="hover:bg-gray-50 transition-all">
              {/* App number */}
              <td className="py-3.5 px-5 font-mono font-bold text-brand-400">
                {app.applicationNumber}
              </td>

              {/* Student Name */}
              <td className="py-3.5 px-3">
                <div className="space-y-0.5">
                  <Link to={`/leads/${app.lead?._id}`} className="font-bold text-slate-700 hover:text-brand-400">
                    {app.studentName}
                  </Link>
                  <p className="text-[10px] text-slate-500">Parent: {app.parentName}</p>
                </div>
              </td>

              {/* Class & session */}
              <td className="py-3.5 px-3">
                <div className="space-y-0.5">
                  <span className="text-slate-600 font-medium">{app.classInterested}</span>
                  <p className="text-[9px] text-slate-500">{app.academicYear}</p>
                </div>
              </td>

              {/* Payment Status */}
              <td className="py-3.5 px-3">
                <div className="flex justify-center">
                  <select
                    value={app.paymentStatus}
                    onChange={(e) => handleUpdatePayment(app._id, e.target.value)}
                    className={`text-[10px] font-bold py-1 px-2 rounded-full border bg-transparent cursor-pointer ${
                      app.paymentStatus === 'Paid'
                        ? 'text-green-400 border-green-500/20 bg-green-500/5'
                        : app.paymentStatus === 'Pending'
                        ? 'text-amber-400 border-amber-500/20 bg-amber-500/5'
                        : 'text-rose-400 border-rose-500/20 bg-rose-500/5'
                    }`}
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </td>

              {/* Documents checklist */}
              <td className="py-3.5 px-3">
                <div className="flex items-center gap-1.5 max-w-[150px] overflow-x-auto">
                  {app.documents?.length === 0 ? (
                    <span className="text-[10px] text-slate-650 italic">No files</span>
                  ) : (
                    app.documents.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        title={doc.name}
                        className="px-1.5 py-0.5 rounded bg-gray-50 border border-gray-200 text-slate-500 hover:text-slate-800 text-[9px] font-medium"
                      >
                        {doc.name.charAt(0).toUpperCase() + doc.name.slice(1, 4)}..
                      </a>
                    ))
                  )}
                </div>
              </td>

              {/* Advisor */}
              <td className="py-3.5 px-3 text-slate-400">
                {app.counsellor?.name || 'System'}
              </td>

              {/* Application Status drop */}
              <td className="py-3.5 px-3">
                <select
                  value={app.status}
                  onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                  className={`text-[10px] font-semibold py-1 px-2 rounded-full border bg-white border-gray-200 text-slate-300 cursor-pointer focus:outline-none`}
                >
                  <option>Application Started</option>
                  <option>Application Submitted</option>
                  <option>Documents Pending</option>
                  <option>Verification</option>
                  <option>Approved</option>
                  <option>Admission Confirmed</option>
                  <option>Rejected</option>
                </select>
              </td>

              {/* Actions */}
              <td className="py-3.5 px-5 text-right">
                <button
                  onClick={() => { setSelectedApp(app); setShowDocModal(true); }}
                  title="Upload Document Metadata"
                  className="p-1.5 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-slate-500 hover:text-slate-800 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 text-[10px] font-semibold"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Add File</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function UploadDocModal({
  showDocModal,
  setShowDocModal,
  selectedApp,
  setSelectedApp,
  docForm,
  setDocForm,
  handleUploadDoc,
  modalLoading
}) {
  if (!showDocModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="glass-card bg-white w-full max-w-md border border-gray-200 p-6 animate-fade-in relative">
        <button
          onClick={() => { setShowDocModal(false); setSelectedApp(null); }}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-slate-700 mb-2">Upload Document Metadata</h3>
        <p className="text-xs text-slate-450 mb-4">
          Add verification record for <span className="font-bold text-slate-700">{selectedApp?.studentName}</span>
        </p>
        <form onSubmit={handleUploadDoc} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Document Type / Name *</label>
            <select
              value={docForm.name}
              onChange={(e) => setDocForm({ ...docForm, name: e.target.value })}
              className="w-full glass-input text-xs"
            >
              <option>Birth Certificate</option>
              <option>Previous School Marksheet</option>
              <option>Transfer Certificate (TC)</option>
              <option>Parent Aadhaar/ID Proof</option>
              <option>Passport Photograph</option>
              <option>Medical Fitness Report</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Document URL / File Location *</label>
            <input
              type="text"
              required
              value={docForm.fileUrl}
              onChange={(e) => setDocForm({ ...docForm, fileUrl: e.target.value })}
              className="w-full glass-input text-xs"
              placeholder="https://example.com/docs/birth.pdf"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => { setShowDocModal(false); setSelectedApp(null); }}
              className="glass-btn-secondary px-3 py-1.5 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={modalLoading}
              className="glass-btn-primary px-4 py-1.5 text-xs flex items-center gap-1"
            >
              {modalLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Attach Document</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
