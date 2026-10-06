import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  GitCompare, 
  Calculator, 
  MapPin, 
  ArrowRight, 
  ShieldAlert,
  Info,
  ExternalLink
} from 'lucide-react';

export default function SchemeRecommendationsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userProfile, setSelectedScheme, comparisonSchemes, toggleCompareScheme } = useApp();
  
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('purpose') || 'All');

  useEffect(() => {
    setLoading(true);
    fetch('/api/schemes/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userProfile || {})
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSchemes(data.schemes);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userProfile]);

  const filteredSchemes = activeCategory === 'All' 
    ? schemes 
    : schemes.filter(s => s.category_type.toLowerCase() === activeCategory.toLowerCase() || s.purpose.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-extrabold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" /> Transparent Rule-Engine Evaluation
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Potentially Relevant Government Schemes
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Showing scores for {userProfile?.name} ({userProfile?.social_category} Category, ₹{userProfile?.annual_family_income?.toLocaleString()} Annual Income)
            </p>
          </div>

          {comparisonSchemes.length > 0 && (
            <button
              onClick={() => navigate('/compare')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <GitCompare className="w-4 h-4" />
              Compare Selected ({comparisonSchemes.length}/3) →
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['All', 'Business', 'Education', 'Skill Development'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat} Schemes
            </button>
          ))}
        </div>

        {/* Notice */}
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Important:</strong> The match score is a transparent recommendation score based on structured rules, <em>not</em> a final government loan sanction. Always verify criteria with nodal partner channels.
          </p>
        </div>

        {/* Scheme Cards Grid with Equal Heights & Uniform Aspect Ratios */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Evaluating 100-point eligibility rules...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {filteredSchemes.map((scheme) => {
              const isSelectedForCompare = comparisonSchemes.some(s => s.id === scheme.id);
              return (
                <div 
                  key={scheme.id}
                  className={`bg-white rounded-3xl p-6 border shadow-sm transition-all card-hover h-full flex flex-col justify-between space-y-5 ${
                    isSelectedForCompare ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Card Top */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                          {scheme.code} • {scheme.category_type}
                        </span>
                        <h3 className="font-extrabold text-slate-900 text-lg leading-snug">{scheme.name}</h3>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1.5 rounded-full border border-emerald-200 inline-block shadow-2xs">
                          {scheme.match_score}% Profile Match
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {scheme.description}
                    </p>

                    {/* Financial Parameters Pill Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">Interest Rate</span>
                        <span className="font-extrabold text-slate-900 text-sm">{scheme.interest_rate}% p.a.</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">Moratorium</span>
                        <span className="font-extrabold text-slate-900 text-sm">{scheme.moratorium_months} Months</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">Max Loan</span>
                        <span className="font-extrabold text-slate-900 text-sm">₹{(scheme.max_loan / 100000).toFixed(1)} Lakh</span>
                      </div>
                    </div>

                    {/* Why it matches list */}
                    <div className="space-y-2 text-xs">
                      <span className="font-bold text-slate-700 text-[11px] block uppercase tracking-wider">Why it matches your profile:</span>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {scheme.satisfied_conditions.slice(0, 3).map((cond, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-emerald-800 bg-emerald-50/60 p-2 rounded-xl border border-emerald-100/80">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-tight">{cond}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Needs verification */}
                    {scheme.needs_verification && scheme.needs_verification.length > 0 && (
                      <div className="space-y-1 text-[11px] bg-amber-50/60 p-2.5 rounded-xl border border-amber-100 text-amber-900">
                        <span className="font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Needs Verification:
                        </span>
                        <p className="text-[11px] text-amber-800 leading-tight">{scheme.needs_verification[0]}</p>
                      </div>
                    )}
                  </div>

                  {/* Card Actions Aligned to Bottom */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelectedForCompare}
                        onChange={() => toggleCompareScheme(scheme)}
                        className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span>Select to Compare</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/calculator?scheme_id=${scheme.id}`}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                      >
                        EMI Calc
                      </Link>
                      
                      <Link
                        to={`/schemes/${scheme.id}`}
                        onClick={() => setSelectedScheme(scheme)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1"
                      >
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
