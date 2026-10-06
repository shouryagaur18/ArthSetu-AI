import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ShieldCheck, ArrowRight, Building, User, Wallet, FileText, Check } from 'lucide-react';

export default function ApplicationRoutingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userProfile, selectedScheme } = useApp();

  const schemeId = searchParams.get('scheme_id') || 'nsfdc-sdis';
  const partnerId = searchParams.get('partner_id') || 'partner-bank-01';

  const [partner, setPartner] = useState(null);
  const [scheme, setScheme] = useState(selectedScheme);
  const [submittedApp, setSubmittedApp] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/partners/${partnerId}?scheme_id=${schemeId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setPartner(data.partner);
      });

    if (!scheme) {
      fetch(`/api/schemes/${schemeId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setScheme(data.scheme);
        });
    }
  }, [partnerId, schemeId]);

  const handleConfirmRouting = () => {
    setSubmitting(true);
    fetch('/api/applications/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userProfile?.id || 'user-rahul-sharma',
        scheme_id: schemeId,
        partner_id: partnerId,
        applicant_name: userProfile?.name || 'Rahul Sharma',
        applicant_phone: '+91 9876543210',
        purpose: userProfile?.business_type || 'Tailoring Business',
        business_type: userProfile?.business_type || 'Tailoring',
        project_cost: userProfile?.project_cost || 400000,
        loan_amount: userProfile?.loan_required || 300000,
        interest_rate: scheme?.interest_rate || 6.0
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSubmittedApp(data);
        }
      })
      .catch(() => {})
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">Intelligent Application Routing</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {submittedApp ? 'Application Routing Initiated 🎉' : 'Confirm Application Routing'}
            </h1>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200">
            {submittedApp ? 'Routed' : 'Status: Ready'}
          </span>
        </div>

        {/* If Application Submitted -> Show Success Details & Timeline */}
        {submittedApp ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/80 space-y-8">
            
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-full mx-auto flex items-center justify-center font-bold text-2xl shadow-md">
                ✓
              </div>
              <h2 className="text-2xl font-black text-emerald-950 tracking-tight">Application Successfully Routed!</h2>
              <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-xl border border-emerald-300 font-mono font-bold text-indigo-700 text-sm">
                Application ID: {submittedApp.application_id}
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed max-w-lg mx-auto">
                Your dossier has been routed to <strong>{submittedApp.partner_name}</strong> under the {submittedApp.scheme_name}.
              </p>
            </div>

            {/* Interactive Timeline */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2">
                Dossier Journey Timeline
              </h3>

              <div className="space-y-3">
                {[
                  { step: "Profile Completed", detail: "Beneficiary SC category profile verified" },
                  { step: "Scheme Matched", detail: "92% profile match score calculated by rule engine" },
                  { step: "Financial Plan Created", detail: "EMI & 6-month moratorium schedule established" },
                  { step: "Partner Selected", detail: `${submittedApp.partner_name} selected based on capacity & NPA status` },
                  { step: "Application Routed", detail: "Routed to channel partner portal" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                      ✓
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 block">{item.step}</span>
                      <span className="text-slate-500 text-[11px]">{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3 justify-between items-center border-t border-slate-100">
              <Link to="/my-applications" className="px-6 py-3 bg-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-indigo-700 transition-colors">
                View My Applications Tracker →
              </Link>
              <Link to="/dashboard" className="px-5 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200">
                Back to Dashboard
              </Link>
            </div>

          </div>
        ) : (
          /* Confirmation Screen */
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Application Dossier Summary
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Selected Scheme</span>
                <span className="font-extrabold text-slate-900 text-sm block">{scheme?.name || 'NSFDC Micro Credit'}</span>
                <span className="text-indigo-600 font-bold">{scheme?.interest_rate || 6.0}% Interest • {scheme?.moratorium_months || 6}m Moratorium</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Applicant Name</span>
                <span className="font-extrabold text-slate-900 text-sm block">{userProfile?.name || 'Rahul Sharma'}</span>
                <span className="text-slate-500">{userProfile?.social_category} Category • {userProfile?.district}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Enterprise Goal / Purpose</span>
                <span className="font-bold text-slate-800">{userProfile?.business_type || 'Tailoring Business'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Financing Required</span>
                <span className="font-extrabold text-indigo-700 text-sm">₹{(userProfile?.loan_required || 300000).toLocaleString()}</span>
                <span className="text-slate-400 block text-[10px]">Project Cost: ₹{(userProfile?.project_cost || 400000).toLocaleString()}</span>
              </div>
            </div>

            {/* Selected Partner Routing Status */}
            <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 space-y-2 text-xs text-emerald-950">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-800">Target Channel Partner</span>
                <span className="bg-emerald-600 text-white font-extrabold px-2.5 py-0.5 rounded-full text-[10px]">
                  ✓ Routing Status: Eligible
                </span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">{partner?.name || 'Public Sector Bank'}</h4>
              <p className="text-slate-600 text-xs">{partner?.address}</p>
              <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-slate-700">
                <span>• Distance: <strong>{partner?.distance_km || 2.4} km</strong></span>
                <span>• Fund Utilization: <strong>{partner?.fund_utilization_percentage || 62}% (Available)</strong></span>
                <span>• NPA Ratio: <strong>{partner?.overdue_percentage || 3.8}% (Within Threshold)</strong></span>
              </div>
            </div>

            <button
              onClick={handleConfirmRouting}
              disabled={submitting}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Initiating Intelligent Routing...' : 'Confirm & Route Application Now →'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
