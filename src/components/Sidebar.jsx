import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users2,
  KanbanSquare,
  Clock,
  FileText,
  GraduationCap,
  Megaphone,
  BarChart3,
  UserCog,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [marketingOpen, setMarketingOpen] = useState(false);
  const [leadsOpen, setLeadsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const isSubActive = (path) => location.pathname.startsWith(path);

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      roles: ['Super Admin', 'Admin', 'Counsellor', 'Admission Staff']
    },
    {
      name: 'Leads',
      icon: Users2,
      path: '/leads',
      roles: ['Super Admin', 'Admin', 'Counsellor'],
      submenu: [
        { name: 'All Leads', path: '/leads' },
        { name: 'New Leads', path: '/leads?status=New' },
        { name: 'Lead Pipeline', path: '/pipeline' }
      ]
    },
    {
      name: 'Follow-ups',
      icon: Clock,
      path: '/followups',
      roles: ['Super Admin', 'Admin', 'Counsellor']
    },
    {
      name: 'Admissions',
      icon: FileText,
      path: '/admissions',
      roles: ['Super Admin', 'Admin', 'Admission Staff']
    },
    {
      name: 'Students',
      icon: GraduationCap,
      path: '/students',
      roles: ['Super Admin', 'Admin', 'Admission Staff']
    },
    {
      name: 'Marketing',
      icon: Megaphone,
      path: '/marketing',
      roles: ['Super Admin', 'Admin'],
      submenu: [
        { name: 'Meta Ads Integration', path: '/marketing/meta' },
        { name: 'Campaign Performance', path: '/marketing/campaigns' },
        { name: 'Lead Sources', path: '/marketing/sources' }
      ]
    },
    {
      name: 'Reports',
      icon: BarChart3,
      path: '/reports',
      roles: ['Super Admin', 'Admin']
    },
    {
      name: 'Staff Users',
      icon: UserCog,
      path: '/users',
      roles: ['Super Admin']
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/settings',
      roles: ['Super Admin', 'Admin']
    }
  ];

  const filteredItems = menuItems.filter((item) => !item.roles || item.roles.includes(user?.role));

  const renderLink = (item) => {
    const Icon = item.icon;
    const hasSubmenu = !!item.submenu;

    if (hasSubmenu) {
      const open = item.name === 'Leads' ? leadsOpen : marketingOpen;
      const setOpen = item.name === 'Leads' ? setLeadsOpen : setMarketingOpen;

      return (
        <div key={item.name} className="space-y-1">
          <button
            onClick={() => setOpen(!open)}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${isSubActive(item.path)
                ? 'bg-brand-600 text-white'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              }`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </div>
            {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {open && (
            <div className="pl-11 space-y-1 mt-1">
              {item.submenu.map((sub) => (
                <Link
                  key={sub.name}
                  to={sub.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 ${isActive(sub.path)
                      ? 'text-brand-400 bg-brand-500/10'
                      : 'text-slate-400 hover:bg-slate-800/30 hover:text-slate-200'
                    }`}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        to={item.path}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive(item.path)
            ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-600/10'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
          }`}
      >
        <Icon className="w-5 h-5" />
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r border-slate-800/80 bg-slate-950 transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800/80">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-100 to-brand-400 bg-clip-text text-transparent font-sans">
              Cohen CRM
            </span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {filteredItems.map(renderLink)}
        </nav>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-500/10 text-brand-400 font-bold border border-brand-500/20">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 font-medium truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-slate-800 rounded-lg text-xs font-medium text-slate-400 hover:bg-rose-950/30 hover:border-rose-900/30 hover:text-rose-400 transition-all duration-150 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
