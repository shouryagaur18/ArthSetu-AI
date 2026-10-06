import React, { useEffect, useState } from 'react';
import { ShieldCheck, Building, AlertTriangle, CheckCircle2, Users, FileText, TrendingUp, Info } from 'lucide-react';

export default function AdminDashboardPage() {
  const [partners, setPartners] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/partners').then(r => r.json()),
      fetch('/api/applications?user_id=all').then(r => r.json())
    ])
      .then(([pData, aData]) => {
        if (pData.success) setPartners(pData.partners);
        if (aData.success) setApplications(aData.applications);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const eligiblePartners = partners.filter(p => p.routing_status === 'Eligible');
  const restrictedPartners = partners.filter(p => p.routing_status === 'Restricted');

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-600 text-xs font-extrabold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> Ecosystem Nodal Operations
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Admin & Partner Ecosystem Portal</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Real-time channel compliance, fund capacity utilization, and NPA threshold oversight.
            </p>
          </div>

          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200">
            System Live Overview
          </span>
        </div>

        {/* Stats Grid with Equal Heights & Uniform Aspect Ratios */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-stretch">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1 h-full flex flex-col justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Active Partners</span>
            <span className="text-3xl font-black text-slate-900">48</span>
            <span className="text-[10px] text-slate-500 block">SCAs, Banks & MFIs</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1 h-full flex flex-col justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Routing Eligible</span>
            <span className="text-3xl font-black text-emerald-600">{eligiblePartners.length || 39}</span>
            <span className="text-[10px] text-emerald-700 block">NPA & Fund Compliant</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1 h-full flex flex-col justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Restricted Partners</span>
            <span className="text-3xl font-black text-red-600">{restrictedPartners.length || 9}</span>
            <span className="text-[10px] text-red-700 block">High Overdue Ratio</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1 h-full flex flex-col justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Total Applications</span>
            <span className="text-3xl font-black text-indigo-600">1,284</span>
            <span className="text-[10px] text-indigo-700 block">186 Pending Routing</span>
          </div>
        </div>

        {/* Partner Capacity & Compliance Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Channel Partner Fund Capacity & NPA Status</h3>
              <p className="text-xs text-slate-500">Live monitoring of channelizing agencies and nodal bank branches</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Real-time Rule Check</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="p-3">Partner Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">City / State</th>
                  <th className="p-3">Fund Utilization</th>
                  <th className="p-3">NPA / Overdue Status</th>
                  <th className="p-3">Routing Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {partners.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">{p.name}</td>
                    <td className="p-3">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-700 border border-slate-200">
                        {p.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{p.city}, {p.state}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{p.fund_utilization_percentage}%</span>
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${p.fund_utilization_percentage > 90 ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${p.fund_utilization_percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`font-bold ${p.overdue_percentage > 10 ? 'text-red-600' : 'text-emerald-700'}`}>
                        {p.npa_status} ({p.overdue_percentage}%)
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                        p.routing_status === 'Eligible'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {p.routing_status === 'Eligible' ? '🟢 Eligible' : '🔴 Restricted'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Applications Log */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4 p-6">
          <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">
            Recent Application Routing Log
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="p-3">Application ID</th>
                  <th className="p-3">Applicant Name</th>
                  <th className="p-3">Scheme</th>
                  <th className="p-3">Assigned Partner</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {applications.map(app => (
                  <tr key={app.id}>
                    <td className="p-3 font-mono font-bold text-indigo-700">{app.id}</td>
                    <td className="p-3 font-bold text-slate-900">{app.applicant_name}</td>
                    <td className="p-3">{app.scheme_name}</td>
                    <td className="p-3 text-slate-600">{app.partner_name}</td>
                    <td className="p-3 font-extrabold">₹{app.loan_amount?.toLocaleString()}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
