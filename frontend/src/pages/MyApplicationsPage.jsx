import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FileText, Clock, CheckCircle2, ArrowRight, Building, MapPin } from 'lucide-react';

export default function MyApplicationsPage() {
  const { user } = useApp();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/applications?user_id=${user?.id || 'user-demo-rahul'}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setApplications(data.applications);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">Application Dossier Tracker</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Applications</h1>
          </div>
          <Link to="/schemes" className="bg-indigo-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs hover:bg-indigo-700">
            + New Scheme Routing
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading applications...
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-mono font-bold px-2.5 py-0.5 rounded-md border border-indigo-200">
                        {app.id}
                      </span>
                      <span className="text-xs font-bold text-slate-400 font-mono">Created {app.created_at?.split(' ')[0]}</span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-lg mt-1">{app.scheme_name}</h3>
                  </div>

                  <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1.5 rounded-full border border-emerald-200 shrink-0 self-start sm:self-center">
                    🟢 Status: {app.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Selected Partner</span>
                    <span className="font-bold text-slate-800">{app.partner_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Sanction Requested</span>
                    <span className="font-extrabold text-indigo-700">₹{app.loan_amount?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Interest Rate</span>
                    <span className="font-bold text-slate-800">{app.interest_rate}% p.a.</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Purpose</span>
                    <span className="font-bold text-slate-800">{app.business_type || app.purpose}</span>
                  </div>
                </div>

                {/* Live Timeline Steps */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Routing Journey Timeline:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                    {[
                      "Profile Submitted",
                      "Scheme Matched",
                      "Financial Plan Created",
                      "Partner Identified",
                      "Routing Completed"
                    ].map((step, idx) => (
                      <div key={idx} className="bg-emerald-50/80 border border-emerald-200 p-2.5 rounded-xl text-center space-y-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                        <span className="font-bold text-emerald-950 text-[11px] block">{step}</span>
                        <span className="text-[9px] text-emerald-700 block">Step {idx + 1} ✓</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
