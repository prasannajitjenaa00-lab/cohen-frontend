import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StaffTable, AddStaffModal } from '../components/staffusers/StaffUsersComponents';

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
    if (user?.role === 'Super Admin' || user?.role === 'SUPER_USER') {
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

  if (user?.role !== 'Super Admin' && user?.role !== 'SUPER_USER') {
    return (
      <div className="text-center py-20 text-xs text-slate-500">
        Access Denied. Only Super Admins and Super Users can manage staff credentials.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-sans">Staff & Counsellors</h2>
          <p className="text-xs text-slate-400">Administer portal credentials, permissions, and monitor advisor conversion rates.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            className="p-2 border border-gray-200 bg-white rounded-lg text-slate-500 hover:text-slate-800 cursor-pointer"
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
        <StaffTable
          loading={loading}
          users={users}
          handleToggleStatus={handleToggleStatus}
        />
      </div>

      {/* Create Account Modal */}
      <AddStaffModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        addForm={addForm}
        setAddForm={setAddForm}
        formError={formError}
        setFormError={setFormError}
        formLoading={formLoading}
        handleAddUser={handleAddUser}
      />
    </div>
  );
}
