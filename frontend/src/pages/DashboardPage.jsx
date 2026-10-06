import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Calculator, 
  MapPin, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Briefcase, 
  GraduationCap, 
  Award, 
  TrendingUp, 
  Bot,
  ExternalLink
} from 'lucide-react';

export default function DashboardPage() {
  const { user, setSelectedScheme } = useApp();
  const [matchedSchemes, setMatchedSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/schemes/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user || {})
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMatchedSchemes(data.schemes.slice(0, 4));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header & Profile Status */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Good morning, {user?.name || 'Beneficiary'} 👋
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {user?.social_category} Category Entrepreneur • {user?.district}, {user?.state}
            </p>
          </div>

          {/* Profile Completion Bar */}
          <div className="w-full md:w-72 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Profile Completion</span>
              <span className="text-indigo-600 font-black">{user?.profile_completion || 80}% Complete</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${user?.profile_completion || 80}%` }}
              ></div>
            </div>
            <Link to="/eligibility-form" className="text-[11px] font-bold text-indigo-600 hover:underline block text-right">
              Update Profile Info →
            </Link>
          </div>
        </div>

        {/* Main Card: Find support for your goal */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-300">Goal Selector</span>
            <h2 className="text-2xl font-black tracking-tight">Find Concessional Support for Your Next Step</h2>
            <p className="text-xs text-indigo-100 leading-relaxed">
              Select your primary goal to discover tailored government financial schemes and calculate interest rates.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-stretch">
            <Link
              to="/schemes?purpose=Business"
              className="bg-white/10 hover:bg-white/20 border border-white/20 p-4 rounded-2xl text-center transition-all card-hover h-full flex flex-col justify-between items-center space-y-2"
            >
              <Briefcase className="w-6 h-6 text-indigo-300" />
              <span className="block text-xs font-bold text-white">Start Business</span>
            </Link>
            <Link
              to="/schemes?purpose=Business"
              className="bg-white/10 hover:bg-white/20 border border-white/20 p-4 rounded-2xl text-center transition-all card-hover h-full flex flex-col justify-between items-center space-y-2"
            >
              <TrendingUp className="w-6 h-6 text-emerald-300" />
              <span className="block text-xs font-bold text-white">Expand Enterprise</span>
            </Link>
            <Link
              to="/schemes?purpose=Education"
              className="bg-white/10 hover:bg-white/20 border border-white/20 p-4 rounded-2xl text-center transition-all card-hover h-full flex flex-col justify-between items-center space-y-2"
            >
              <GraduationCap className="w-6 h-6 text-sky-300" />
              <span className="block text-xs font-bold text-white">Education Loan</span>
            </Link>
            <Link
              to="/schemes?purpose=Business"
              className="bg-white/10 hover:bg-white/20 border border-white/20 p-4 rounded-2xl text-center transition-all card-hover h-full flex flex-col justify-between items-center space-y-2"
            >
              <Award className="w-6 h-6 text-amber-300" />
              <span className="block text-xs font-bold text-white">Skill Development</span>
            </Link>
          </div>
        </div>

        {/* Live Application Status Banner */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
              <h3 className="text-sm font-bold text-slate-900">Active Application #AS-1024</h3>
            </div>
            <Link to="/my-applications" className="text-xs font-bold text-indigo-600 hover:underline">
              View All Applications →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs items-stretch">
            <div className="flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold block">Scheme</span>
              <span className="font-bold text-slate-800">NSFDC Micro Credit</span>
            </div>
            <div className="flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold block">Selected Partner</span>
              <span className="font-bold text-slate-800">Public Sector Bank</span>
            </div>
            <div className="flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold block">Sanction Requested</span>
              <span className="font-bold text-slate-800">₹3,00,000 @ 6%</span>
            </div>
            <div className="flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold block">Current Status</span>
              <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 w-fit">
                Routed to Partner Branch
              </span>
            </div>
          </div>
        </div>

        {/* Scheme Matches Grid with Equal Heights & Aspect Ratios */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Your Recommended Scheme Matches</h2>
              <p className="text-xs text-slate-500">Matched against your SC category profile & ₹3.2L income</p>
            </div>
            <Link to="/schemes" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
              View All Schemes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {matchedSchemes.map((scheme) => (
              <div key={scheme.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:border-indigo-300 transition-all card-hover h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{scheme.category_type}</span>
                      <h3 className="font-bold text-slate-900 text-base">{scheme.name}</h3>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200 shrink-0">
                      {scheme.match_score}% Profile Match
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {scheme.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Interest Rate</span>
                      <span className="font-bold text-slate-900">{scheme.interest_rate}% p.a.</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Moratorium</span>
                      <span className="font-bold text-slate-900">{scheme.moratorium_months} Months</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Max Limit</span>
                      <span className="font-bold text-slate-900">₹{(scheme.max_loan / 100000).toFixed(1)} Lakh</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/schemes/${scheme.id}`}
                    onClick={() => setSelectedScheme(scheme)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    View Breakdown →
                  </Link>
                  <Link
                    to={`/calculator?scheme_id=${scheme.id}`}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-indigo-200"
                  >
                    Calculate EMI
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Grid with Equal Height Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-stretch">
          <Link to="/schemes" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 text-center space-y-2 card-hover h-full flex flex-col justify-between items-center">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <span className="block font-bold text-xs text-slate-900">Find Schemes</span>
          </Link>
          <Link to="/calculator" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 text-center space-y-2 card-hover h-full flex flex-col justify-between items-center">
            <Calculator className="w-6 h-6 text-emerald-600" />
            <span className="block font-bold text-xs text-slate-900">Calculate EMI</span>
          </Link>
          <Link to="/partners" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 text-center space-y-2 card-hover h-full flex flex-col justify-between items-center">
            <MapPin className="w-6 h-6 text-blue-600" />
            <span className="block font-bold text-xs text-slate-900">Find Partner</span>
          </Link>
          <Link to="/learn" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 text-center space-y-2 card-hover h-full flex flex-col justify-between items-center">
            <BookOpen className="w-6 h-6 text-amber-600" />
            <span className="block font-bold text-xs text-slate-900">Learn About Loans</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
