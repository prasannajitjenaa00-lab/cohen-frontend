import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UserPlus,
  Mail,
  Shield,
  Loader2,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  UserCheck,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function StaffUsers() {
  const { user } = useAuth();
  
  // State variables
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form modal controls
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: 'password123', role: 'Counsellor' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/settings/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'Super Admin') {
      fetchUsers();
    }
  }, [user]);

  // Toggle user status
  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await axios.put(`/api/settings/users/${id}`, { status: nextStatus });
      if (res.data.success) {
        setUsers(users.map(u => u._id === id ? { ...u, status: nextStatus } : u));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit User Account
  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!addForm.name || !addForm.email || !addForm.password) {
      setFormError('Please fill in all required fields');
      return;
    }

    try {
      setFormLoading(true);
      const res = await axios.post('/api/settings/users', addForm);
      if (res.data.success) {
        setShowAddModal(false);
        setAddForm({ name: '', email: '', password: 'password123', role: 'Counsellor' });
        fetchUsers();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create user account');
    } finally {
      setFormLoading(false);
    }
  };

  if (user?.role !== 'Super Admin') {
    return (
      <div className="text-center py-20 text-xs text-slate-500">
        Access Denied. Only Super Admins can manage staff credentials.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 font-sans">Staff & Counsellors</h2>
          <p className="text-xs text-slate-400">Administer backend portal accounts, permissions, and monitor advisor conversion rates.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            className="p-2 border border-slate-800 bg-slate-900 rounded-lg text-slate-450 hover:text-white cursor-pointer"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 glass-btn-primary px-3 py-2 text-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Staff Account</span>
          </button>
        </div>
      </div>

      {/* Staff list cards/table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-400 font-semibold uppercase tracking-wider bg-slate-950/40">
                  <th className="py-3 px-5">Staff Member</th>
                  <th className="py-3 px-3">Portal Role</th>
                  <th className="py-3 px-3 text-center">Assigned Leads</th>
                  <th className="py-3 px-3 text-center">Admissions</th>
                  <th className="py-3 px-3 text-center">Conv. Rate</th>
                  <th className="py-3 px-3 text-center">Status Toggle</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-xs">
                {users.map((staff) => (
                  <tr key={staff._id} className="hover:bg-slate-900/20 transition-all">
                    {/* Name & email */}
                    <td className="py-3.5 px-5">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-200">{staff.name}</span>
                        <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{staff.email}</span>
                        </p>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-850 text-[10px] font-semibold text-slate-350 flex items-center gap-1.5 w-fit">
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
        )}
      </div>

      {/* Create Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="glass-card bg-slate-900 w-full max-w-md border border-slate-800 p-6 animate-fade-in relative">
            <button
              onClick={() => { setShowAddModal(false); setFormError(''); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Create Portal Account</h3>
            <p className="text-xs text-slate-450 mb-4">Provision credentials for new academic counsellors or administrative office staff.</p>
            
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

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
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
      )}
    </div>
  );
}
