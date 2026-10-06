import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GitCompare, Calculator, ArrowRight, Check, X, Sparkles, MapPin } from 'lucide-react';

export default function SchemeComparisonPage() {
  const navigate = useNavigate();
  const { comparisonSchemes, toggleCompareScheme } = useApp();

  if (comparisonSchemes.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center font-bold">
            <GitCompare className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">No Schemes Selected for Comparison</h2>
          <p className="text-xs text-slate-500">
            Select up to 3 schemes from the Recommendations page to evaluate interest rates, tenure, moratorium, and document requirements side by side.
          </p>
          <Link
            to="/schemes"
            className="inline-flex items-center gap-1.5 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
          >
            Browse & Select Schemes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-extrabold uppercase tracking-wider mb-1">
              <GitCompare className="w-4 h-4" /> Decision Matrix
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Scheme Comparison Matrix</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Comparing {comparisonSchemes.length} schemes side-by-side to understand financial trade-offs
            </p>
          </div>

          <Link
            to="/schemes"
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
          >
            + Add/Change Schemes
          </Link>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
                  <th className="p-4 sm:p-6 w-1/4">Feature / Criterion</th>
                  {comparisonSchemes.map((scheme) => (
                    <th key={scheme.id} className="p-4 sm:p-6 w-1/4 border-l border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-slate-400">{scheme.code}</span>
                        <button
                          onClick={() => toggleCompareScheme(scheme)}
                          className="text-slate-400 hover:text-red-600 text-xs font-bold"
                          title="Remove from comparison"
                        >
                          ✕
                        </button>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{scheme.name}</h3>
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block">
                        {scheme.match_score}% Match
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                
                {/* Row 1: Purpose */}
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-slate-900 bg-slate-50/50">Primary Purpose</td>
                  {comparisonSchemes.map(s => (
                    <td key={s.id} className="p-4 sm:p-6 border-l border-slate-100 font-medium">{s.purpose} ({s.category_type})</td>
                  ))}
                </tr>

                {/* Row 2: Maximum Loan */}
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-slate-900 bg-slate-50/50">Maximum Loan Amount</td>
                  {comparisonSchemes.map(s => (
                    <td key={s.id} className="p-4 sm:p-6 border-l border-slate-100 font-extrabold text-slate-900 text-sm">
                      ₹{(s.max_loan / 100000).toFixed(1)} Lakh
                    </td>
                  ))}
                </tr>

                {/* Row 3: Interest Rate */}
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-slate-900 bg-slate-50/50">Concessional Interest Rate</td>
                  {comparisonSchemes.map(s => (
                    <td key={s.id} className="p-4 sm:p-6 border-l border-slate-100 font-extrabold text-indigo-700 text-sm">
                      {s.interest_rate}% p.a.
                    </td>
                  ))}
                </tr>

                {/* Row 4: Moratorium */}
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-slate-900 bg-slate-50/50">Moratorium Period</td>
                  {comparisonSchemes.map(s => (
                    <td key={s.id} className="p-4 sm:p-6 border-l border-slate-100 font-bold text-slate-800">
                      {s.moratorium_months} Months Grace Period
                    </td>
                  ))}
                </tr>

                {/* Row 5: Repayment Tenure */}
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-slate-900 bg-slate-50/50">Total Tenure</td>
                  {comparisonSchemes.map(s => (
                    <td key={s.id} className="p-4 sm:p-6 border-l border-slate-100 font-medium">{s.tenure_years} Years</td>
                  ))}
                </tr>

                {/* Row 6: Required Documents */}
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-slate-900 bg-slate-50/50">Required Documents</td>
                  {comparisonSchemes.map(s => (
                    <td key={s.id} className="p-4 sm:p-6 border-l border-slate-100 space-y-1">
                      {s.required_documents.slice(0, 3).map((doc, idx) => (
                        <span key={idx} className="block text-[11px] text-slate-600">• {doc}</span>
                      ))}
                    </td>
                  ))}
                </tr>

                {/* Row 7: Channel Partner Types */}
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-slate-900 bg-slate-50/50">Channel Partner Types</td>
                  {comparisonSchemes.map(s => (
                    <td key={s.id} className="p-4 sm:p-6 border-l border-slate-100">
                      <div className="flex flex-wrap gap-1">
                        {s.partner_types.map((pt, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
                            {pt}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Row 8: Action Buttons */}
                <tr className="bg-slate-50/80">
                  <td className="p-4 sm:p-6 font-bold text-slate-900">Next Step Action</td>
                  {comparisonSchemes.map(s => (
                    <td key={s.id} className="p-4 sm:p-6 border-l border-slate-200">
                      <Link
                        to={`/calculator?scheme_id=${s.id}`}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs transition-colors"
                      >
                        <Calculator className="w-3.5 h-3.5" /> Calculate EMI →
                      </Link>
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
