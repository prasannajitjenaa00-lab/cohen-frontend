import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { KPICards, DashboardCharts, SubPanels, PerformanceGrids } from '../components/dashboard/DashboardComponents';

export default function Dashboard() {
  const { user } = useAuth();
  const isCounsellor = user?.role === 'Counsellor';
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [range, setRange] = useState('Last 30 Days');
  const [recentLeads, setRecentLeads] = useState([]);
  const [todayFollowups, setTodayFollowups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, chartsRes, leadsRes, followupsRes] = await Promise.all([
        axios.get('/api/dashboard/stats'),
        axios.get(`/api/dashboard/leads?range=${encodeURIComponent(range)}`),
        axios.get('/api/leads?limit=5'),
        axios.get('/api/followups?filter=today')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (chartsRes.data.success) setChartData(chartsRes.data.data);
      if (leadsRes.data.success) setRecentLeads(leadsRes.data.data);
      if (followupsRes.data.success) setTodayFollowups(followupsRes.data.data);
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [range]);

  // Handle follow up quick completion
  const completeFollowUp = async (id, leadId) => {
    try {
      const res = await axios.put(`/api/followups/${id}`, {
        status: 'Completed',
        notes: 'Quick completed from dashboard checklist.'
      });
      if (res.data.success) {
        // Refresh
        setTodayFollowups(todayFollowups.filter(f => f._id !== id));
      }
    } catch (e) {
      console.error('Error completing follow up:', e);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Welcome Back{user?.name ? `, ${user.name}` : ''}</h2>
          <p className="text-xs text-slate-500">
            {isCounsellor
              ? 'Here are the leads assigned to you and your activity summary.'
              : 'Here is the school admissions and leads summary.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">View Data:</span>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="text-xs glass-input bg-white border-gray-200"
          >
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
          </select>
        </div>
      </div>

      <KPICards stats={stats} isCounsellor={isCounsellor} />

      <DashboardCharts chartData={chartData} />

      {/* Sub-panels and Lists Row */}
      <SubPanels
        recentLeads={recentLeads}
        todayFollowups={todayFollowups}
        chartData={chartData}
        completeFollowUp={completeFollowUp}
      />

      {/* Campaigns and Counsellor grids (Super Admins and Admins only) */}
      {!isCounsellor && <PerformanceGrids chartData={chartData} />}
    </div>
  );
}
