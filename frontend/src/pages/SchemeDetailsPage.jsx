import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Calculator, 
  MapPin, 
  ExternalLink, 
  ArrowLeft, 
  ShieldCheck, 
  FileText,
  Building,
  Clock,
  Percent,
  Coins
} from 'lucide-react';

export default function SchemeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile, setSelectedScheme } = useApp();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchInfo, setMatchInfo] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/schemes/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setScheme(data.scheme);
          setSelectedScheme(data.scheme);

          // Calculate match score
          fetch('/api/schemes/match', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userProfile || {})
          })
            .then(r => r.json())
            .then(m => {
              const matched = m.schemes.find(s => s.id === id);
              if (matched) setMatchInfo(matched);
            });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, userProfile]);

  if (loading || !scheme) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back Link */}
        <Link to="/schemes" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" /> Back to All Schemes
        </Link>

        {/* Scheme Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-slate-700 text-xs font-mono font-bold px-2.5 py-0.5 rounded-md border border-slate-200">
                  {scheme.code}
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{scheme.category_type}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">{scheme.name}</h1>
            </div>

            {matchInfo && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center shrink-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">Your Profile Match</span>
                <span className="text-3xl font-black text-emerald-700">{matchInfo.match_score}%</span>
              </div>
            )}
          </div>

          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            {scheme.description}
          </p>

          {/* Core Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200/80 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-indigo-600" /> Loan Limit
              </span>
              <span className="text-base font-extrabold text-slate-900">₹{(scheme.max_loan / 100000).toFixed(1)} Lakh</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-emerald-600" /> Interest Rate
              </span>
              <span className="text-base font-extrabold text-indigo-700">{scheme.interest_rate}% p.a.</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Moratorium
              </span>
              <span className="text-base font-extrabold text-slate-900">{scheme.moratorium_months} Months</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-600" /> Max Tenure
              </span>
              <span className="text-base font-extrabold text-slate-900">{scheme.tenure_years} Years</span>
            </div>
          </div>
        </div>

        {/* Prominent Section: Why this scheme appeared for you */}
        {matchInfo && (
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-indigo-300 font-extrabold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Transparency Breakdown
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">Why This Scheme Appeared For You</h2>

            <div className="space-y-2 pt-2">
              {matchInfo.satisfied_conditions.map((cond, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-white/10 p-3 rounded-xl border border-white/10 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-indigo-100 leading-snug">{cond}</span>
                </div>
              ))}
            </div>

            {matchInfo.needs_verification && matchInfo.needs_verification.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-bold text-amber-300 block mb-2">Conditions Requiring Verification:</span>
                {matchInfo.needs_verification.map((warn, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/30 text-xs text-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{warn}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Required Documents & Partner Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Required Documents Checklist</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {scheme.required_documents.map((doc, idx) => (
                <li key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">Channel Partner Types</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Applications under this scheme are processed through the following government-supported channelizing institutions:
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {scheme.partner_types.map((pt, idx) => (
                <span key={idx} className="bg-emerald-50 text-emerald-800 text-xs font-extrabold px-3 py-1.5 rounded-xl border border-emerald-200">
                  {pt}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Official Application Portal Link Placeholder & CTAs */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
            <span className="font-bold text-slate-700">Official Portal Configuration</span>
            <span className="text-[11px] font-mono">Status: Verified URL</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-slate-900 text-sm">Official Portal Link</h4>
              <p className="text-xs text-slate-500">
                {scheme.official_application_url 
                  ? `Verified Portal: ${scheme.official_application_url}`
                  : "Official application link to be configured for production environment."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Link
                to={`/calculator?scheme_id=${scheme.id}`}
                className="flex-1 sm:flex-none px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Calculator className="w-4 h-4 text-indigo-600" /> Calculate EMI
              </Link>

              <Link
                to={`/partners?scheme_id=${scheme.id}`}
                className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors"
              >
                <MapPin className="w-4 h-4" /> Find Eligible Partner →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
