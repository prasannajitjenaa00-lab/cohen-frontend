import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Megaphone, BarChart3, PieChart, Layers, RefreshCw, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MetaAdsIntegration() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetaLogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/meta/webhook-logs');
        if (res.data.success) {
          setLogs(res.data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMetaLogs();
  }, []);

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-slate-800">
      <div className="glass-card p-6 bg-gradient-to-r from-blue-600 via-indigo-700 to-slate-900 text-white flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Meta (Facebook & Instagram) Ads Integration</h1>
          <p className="text-xs text-slate-200 mt-1">
            Real-time webhook delivery for Facebook and Instagram Lead Ads forms.
          </p>
        </div>
        <Link
          to="/marketing/google"
          className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold backdrop-blur-sm transition-all"
        >
          Switch to Google Ads →
        </Link>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-700">Recent Meta Lead Ad Webhook Events</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Lead ID</th>
                <th className="py-2.5 px-3">Page ID</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Received At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-slate-400">
                    {loading ? 'Loading Meta logs...' : 'No Meta logs recorded yet.'}
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50/60">
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{log.leadId}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{log.pageId || 'N/A'}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {new Date(log.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
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

export function CampaignPerformance() {
  return (
    <div className="space-y-6 pb-12 animate-fade-in text-slate-800">
      <div className="glass-card p-6 bg-gradient-to-r from-indigo-900 to-purple-900 text-white flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Ad Campaign Performance</h1>
          <p className="text-xs text-slate-200 mt-1">Multi-channel cross-comparison of admission acquisition campaigns.</p>
        </div>
        <Link
          to="/marketing/google"
          className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold backdrop-blur-sm transition-all"
        >
          Google Ads Setup →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5 space-y-2 border-t-4 border-t-blue-500">
          <p className="text-xs font-bold text-slate-400 uppercase">Google Ads Search</p>
          <p className="text-xl font-black text-slate-800">High Intent Admissions</p>
          <p className="text-xs text-slate-500">Direct search inquiries with verified GCLID click tracking.</p>
        </div>
        <div className="glass-card p-5 space-y-2 border-t-4 border-t-indigo-500">
          <p className="text-xs font-bold text-slate-400 uppercase">Meta (Facebook & IG)</p>
          <p className="text-xl font-black text-slate-800">Brand Awareness & Reach</p>
          <p className="text-xs text-slate-500">Direct lead ads with parent demographic targeting.</p>
        </div>
        <div className="glass-card p-5 space-y-2 border-t-4 border-t-emerald-500">
          <p className="text-xs font-bold text-slate-400 uppercase">Organic Website Inbound</p>
          <p className="text-xl font-black text-slate-800">Direct School Portal</p>
          <p className="text-xs text-slate-500">Website inquiries submitted through public inquiry forms.</p>
        </div>
      </div>
    </div>
  );
}

export function LeadSources() {
  return (
    <div className="space-y-6 pb-12 animate-fade-in text-slate-800">
      <div className="glass-card p-6 bg-gradient-to-r from-slate-900 to-indigo-900 text-white flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Lead Acquisition Sources</h1>
          <p className="text-xs text-slate-200 mt-1">Channel distribution, attribution rates, and conversion health.</p>
        </div>
        <Link
          to="/marketing/google"
          className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold backdrop-blur-sm transition-all"
        >
          Google Ads Dashboard →
        </Link>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-700">Supported Inbound Channels</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          {['Google Ads', 'Facebook', 'Instagram', 'Website', 'WhatsApp', 'Manual', 'Referral'].map((source) => (
            <div key={source} className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="font-bold text-slate-800">{source}</span>
              <p className="text-[10px] text-emerald-600 font-semibold">Active Pipeline</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
