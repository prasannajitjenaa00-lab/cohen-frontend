import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Award,
  TrendingUp,
  UserPlus,
  Clock,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export function KPICards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Leads */}
      <div className="glass-card p-5 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enquiries</p>
          <h3 className="text-3xl font-extrabold font-sans text-slate-800">{stats?.totalLeads}</h3>
          <p className="text-[10px] text-brand-400 font-medium">All recorded leads</p>
        </div>
        <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl border border-brand-500/20">
          <Users className="w-6 h-6" />
        </div>
      </div>

      {/* New Leads */}
      <div className="glass-card p-5 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New Leads</p>
          <h3 className="text-3xl font-extrabold font-sans text-slate-800">{stats?.newLeads}</h3>
          <p className="text-[10px] text-cyan-400 font-medium">{stats?.leadsToday} received today</p>
        </div>
        <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
          <UserPlus className="w-6 h-6" />
        </div>
      </div>

      {/* Admissions */}
      <div className="glass-card p-5 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Admissions</p>
          <h3 className="text-3xl font-extrabold font-sans text-slate-800">{stats?.confirmedAdmissions}</h3>
          <p className="text-[10px] text-emerald-400 font-medium">{stats?.applications} applications started</p>
        </div>
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
          <Award className="w-6 h-6" />
        </div>
      </div>

      {/* Conversion Rate */}
      <div className="glass-card p-5 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Conversion</p>
          <h3 className="text-3xl font-extrabold font-sans text-slate-800">{stats?.conversionRate}%</h3>
          <p className="text-[10px] text-indigo-400 font-medium">Admission / Total Leads</p>
        </div>
        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export function DashboardCharts({ chartData }) {
  const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#64748b'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Leads by Day Area Chart */}
      <div className="glass-card p-5 lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-bold text-slate-700">Enquiries Over Time</h4>
          <span className="text-[10px] text-slate-500 font-medium">Daily submission trend</span>
        </div>
        <div className="h-64 w-full">
          {chartData?.leadsByDay && chartData.leadsByDay.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.leadsByDay} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="leads" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">No trend data available</div>
          )}
        </div>
      </div>

      {/* Leads by Source Pie Chart */}
      <div className="glass-card p-5 space-y-4">
        <h4 className="text-sm font-bold text-slate-700">Leads by Channel Source</h4>
        <div className="h-64 w-full flex items-center justify-center">
          {chartData?.leadsBySource && chartData.leadsBySource.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.leadsBySource}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.leadsBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '10px' }} />
                <Legend verticalAlign="bottom" height={36} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '10px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-xs text-slate-500">No source data available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SubPanels({
  recentLeads,
  todayFollowups,
  chartData,
  completeFollowUp
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Inquiries Panel */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-700">Recent Inquiries</h4>
          <Link to="/leads" className="text-[10px] text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentLeads.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">No inquiries found</div>
          ) : (
            recentLeads.map((lead) => (
              <div key={lead._id} className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between hover:bg-gray-100 transition-colors">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700">{lead.studentName}</p>
                  <p className="text-[10px] text-slate-500">
                    Class {lead.classInterested} • {lead.leadSource}
                  </p>
                </div>
                <Link to={`/leads/${lead._id}`} className="text-xs text-brand-500 hover:text-brand-600 font-medium">
                  Details
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Today's Follow-ups Checklist Panel */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-700">Today's Reminders</h4>
          <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
            {todayFollowups.length} Pending
          </span>
        </div>
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {todayFollowups.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 flex flex-col items-center gap-2">
              <Clock className="w-8 h-8 text-slate-600" />
              <span>All caught up for today!</span>
            </div>
          ) : (
            todayFollowups.map((f) => (
              <div key={f._id} className="p-3 rounded-lg bg-gray-50 border border-gray-100 space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-slate-700">{f.lead?.studentName}</p>
                    <p className="text-[10px] text-slate-500">Time: {f.time} • Type: {f.type}</p>
                  </div>
                  <button
                    onClick={() => completeFollowUp(f._id, f.lead?._id)}
                    className="px-2 py-1 bg-brand-500/10 border border-brand-500/20 hover:bg-brand-600 hover:text-white rounded text-[10px] font-medium text-brand-400 transition-all cursor-pointer"
                  >
                    Complete
                  </button>
                </div>
                {f.notes && <p className="text-[10px] text-slate-400 italic">"{f.notes}"</p>}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Leads by Status distribution */}
      <div className="glass-card p-5 space-y-4">
        <h4 className="text-sm font-bold text-slate-700">Leads by Status Stage</h4>
        <div className="h-64 w-full">
          {chartData?.leadsByStatus && chartData.leadsByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.leadsByStatus} layout="vertical" margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" fontSize={9} allowDecimals={false} />
                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={9} width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '10px' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">No status data available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PerformanceGrids({ chartData }) {
  if (!chartData?.counsellorPerformance || chartData.counsellorPerformance.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Counsellor performance */}
      <div className="glass-card p-5 space-y-4">
        <h4 className="text-sm font-bold text-slate-700 font-sans">Counsellor Lead Distributions</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-2.5">Counsellor</th>
                <th className="py-2.5 text-center">Assigned</th>
                <th className="py-2.5 text-center">Contacted</th>
                <th className="py-2.5 text-center">Admissions</th>
                <th className="py-2.5 text-right">Conversion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {chartData.counsellorPerformance.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 font-medium text-slate-700">{c.counsellor}</td>
                  <td className="py-3 text-center text-slate-500">{c.assigned}</td>
                  <td className="py-3 text-center text-slate-500">{c.contacted}</td>
                  <td className="py-3 text-center text-slate-700 font-semibold">{c.admissions}</td>
                  <td className="py-3 text-right text-brand-400 font-bold">{c.conversionRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Performance */}
      <div className="glass-card p-5 space-y-4">
        <h4 className="text-sm font-bold text-slate-700 font-sans">Ad Campaigns Conversions</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-2.5">Campaign Name</th>
                <th className="py-2.5 text-center">Leads</th>
                <th className="py-2.5 text-center">Qualified</th>
                <th className="py-2.5 text-center">Admissions</th>
                <th className="py-2.5 text-right">Conv. Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {chartData.campaignPerformance.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-500">No active campaign leads found</td>
                </tr>
              ) : (
                chartData.campaignPerformance.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-medium text-slate-700 truncate max-w-[150px]" title={c.campaign}>{c.campaign}</td>
                    <td className="py-3 text-center text-slate-500">{c.leads}</td>
                    <td className="py-3 text-center text-slate-500">{c.qualified}</td>
                    <td className="py-3 text-center text-slate-700 font-semibold">{c.admissions}</td>
                    <td className="py-3 text-right text-indigo-400 font-bold">{c.conversionRate}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
