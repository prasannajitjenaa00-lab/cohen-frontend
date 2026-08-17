import React from 'react';
import {
  Mail,
  Shield,
  Loader2,
  TrendingUp,
  X
} from 'lucide-react';

export function StaffTable({ loading, users, handleToggleStatus }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 text-[10px] text-slate-500 font-semibold uppercase tracking-wider bg-gray-50/80">
            <th className="py-3 px-5">Staff Member</th>
            <th className="py-3 px-3">Portal Role</th>
            <th className="py-3 px-3 text-center">Assigned Leads</th>
            <th className="py-3 px-3 text-center">Admissions</th>
            <th className="py-3 px-3 text-center">Conv. Rate</th>
            <th className="py-3 px-3 text-center">Status Toggle</th>
            <th className="py-3 px-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {users.map((staff) => (
            <tr key={staff._id} className="hover:bg-gray-50 transition-all">
              {/* Name & email */}
              <td className="py-3.5 px-5">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-700">{staff.name}</span>
                  <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{staff.email}</span>
                  </p>
                </div>
              </td>

              {/* Role */}
              <td className="py-3.5 px-3">
                <span className="px-2.5 py-0.5 rounded bg-gray-55 border border-gray-205 text-[10px] font-semibold text-slate-350 flex items-center gap-1.5 w-fit">
                  <Shield className="w-3 h-3 text-slate-500" />
                  <span>{staff.role}</span>
                </span>
              </td>

              {/* Assigned Leads count */}
              <td className="py-3.5 px-3 text-center text-slate-400 font-semibold">
                {staff.stats?.assignedLeads !== undefined ? staff.stats.assignedLeads : '—'}
              </td>

              {/* Admissions count */}
              <td className="py-3.5 px-3 text-center text-slate-300 font-bold">
                {staff.stats?.confirmedAdmissions !== undefined ? staff.stats.confirmedAdmissions : '—'}
              </td>

              {/* Conversion rate */}
              <td className="py-3.5 px-3 text-center text-brand-400 font-extrabold font-mono">
                {staff.stats?.conversionRate !== undefined ? (
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{staff.stats.conversionRate}%</span>
                  </div>
                ) : '—'}
              </td>

              {/* Status */}
              <td className="py-3.5 px-3">
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => handleToggleStatus(staff._id, staff.status)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {staff.status === 'Active' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                        Active
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        Inactive
                      </span>
                    )}
                  </button>
                </div>
              </td>

              {/* Actions */}
              <td className="py-3.5 px-5 text-right text-slate-500 italic">
                Admin Locked
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AddStaffModal({
  showAddModal,
  setShowAddModal,
  addForm,
  setAddForm,
  formError,
  setFormError,
  formLoading,
  handleAddUser
}) {
  if (!showAddModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="glass-card bg-white w-full max-w-md border border-gray-200 p-6 animate-fade-in relative">
        <button
          onClick={() => { setShowAddModal(false); setFormError(''); }}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-slate-700 mb-2">Create Portal Account</h3>
        <p className="text-xs text-slate-455 mb-4">Provision credentials for new academic counsellors or administrative office staff.</p>
        
        {formError && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-bold">
            {formError}
          </div>
        )}

        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Full Name *</label>
            <input
              type="text"
              required
              placeholder="Rahul Kumar"
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              className="w-full glass-input text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Email Address *</label>
            <input
              type="email"
              required
              placeholder="rahul@cohenschool.com"
              value={addForm.email}
              onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
              className="w-full glass-input text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Initial Password *</label>
            <input
              type="password"
              required
              placeholder="password123"
              value={addForm.password}
              onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
              className="w-full glass-input text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">System Role *</label>
            <select
              value={addForm.role}
              onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
              className="w-full glass-input text-xs"
            >
              <option>Counsellor</option>
              <option>Admin</option>
              <option>Admission Staff</option>
              <option>Super Admin</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => { setShowAddModal(false); setFormError(''); }}
              className="glass-btn-secondary px-3 py-1.5 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="glass-btn-primary px-4 py-1.5 text-xs flex items-center gap-1"
            >
              {formLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Provision Account</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
