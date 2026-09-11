import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, Menu, Check } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Topbar({ setMobileOpen }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchVal, setSearchVal] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/settings/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (e) {
      console.error('Failed to load notifications:', e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    try {
      const res = await axios.put('/api/settings/notifications/read', {});
      if (res.data.success) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleNotificationClick = async (notif) => {
    try {
      await axios.put('/api/settings/notifications/read', { notificationId: notif._id });
      setNotifications(notifications.map(n => n._id === notif._id ? { ...n, read: true } : n));
      setShowNotifications(false);
      if (notif.lead) {
        navigate(`/leads/${notif.lead}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/leads?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  // Get Page Title from Location Path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/leads/')) return 'Lead Profile';
    if (path === '/leads') return 'Leads Directory';
    if (path === '/pipeline') return 'Lead Pipeline Board';
    if (path === '/followups') return 'Today\'s Follow-ups';
    if (path === '/admissions') return 'Applications & Admissions';
    if (path === '/students') return 'Student Enrolments';
    if (path.startsWith('/marketing/meta')) return 'Meta Lead Ads';
    if (path.startsWith('/marketing/campaigns')) return 'Marketing Campaigns';
    if (path.startsWith('/marketing/sources')) return 'Traffic & Lead Sources';
    if (path === '/reports') return 'Analytics Reports';
    if (path === '/users') return 'Staff & Counsellors';
    if (path === '/settings') return 'CRM System Settings';
    return 'School CRM';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="relative z-40 flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white backdrop-blur-xl shrink-0">
      {/* Left title / mobile trigger */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1 rounded-md text-slate-500 hover:text-slate-800 lg:hidden focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 font-sans tracking-wide">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right Search, Notification & Profile */}
      <div className="flex items-center gap-4">
        {/* Global Search Bar */}
        {['/leads', '/pipeline', '/dashboard', '/students', '/admissions'].includes(location.pathname) && (
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search leads, parents, phone..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="pl-9 pr-3 py-1.5 w-64 text-xs bg-gray-50 border border-gray-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 focus:w-80 transition-all duration-300"
            />
          </form>
        )}

        {/* Notifications Dropdown */}
        <div className="relative z-50" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 rounded-lg border border-gray-200 bg-gray-50 text-slate-500 hover:text-slate-800 hover:bg-gray-100 transition-all cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-xl p-2 z-50 animate-fade-in shadow-2xl">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 mb-2">
                <span className="text-xs font-bold text-slate-700">Alerts & Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">No notifications yet</div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notif) => (
                    <button
                      key={notif._id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex flex-col gap-1 hover:bg-gray-50 ${!notif.read ? 'bg-brand-50 border-l-2 border-brand-500' : 'bg-transparent'
                        }`}
                    >
                      <p className="font-medium text-slate-700">{notif.message}</p>
                      <span className="text-[10px] text-slate-500">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="hidden sm:inline-flex items-center px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-xs text-slate-700 gap-2 shadow-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
          <span className="font-bold text-slate-800">{user?.name || sessionStorage.getItem('welcomeName') || 'User'}</span>
          <span className="text-[11px] text-slate-500 border-l border-gray-200 pl-2">
            {user?.designation ? `${user.designation}` : (sessionStorage.getItem('welcomeRole') || user?.role || '')}
          </span>
        </div>
      </div>
    </header>
  );
}
