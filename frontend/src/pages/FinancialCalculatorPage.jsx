import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Calculator, AlertCircle, Info, Clock, DollarSign, Percent, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

export default function FinancialCalculatorPage() {
  const [searchParams] = useSearchParams();
  const schemeIdFromQuery = searchParams.get('scheme_id');
  const { selectedScheme } = useApp();

  const [schemes, setSchemes] = useState([]);
  const [activeScheme, setActiveScheme] = useState(null);

  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(6.0);
  const [tenureYears, setTenureYears] = useState(5);
  const [moratoriumMonths, setMoratoriumMonths] = useState(6);

  const [calcResult, setCalcResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/schemes')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSchemes(data.schemes);
          let target = data.schemes.find(s => s.id === schemeIdFromQuery) || selectedScheme || data.schemes[0];
          if (target) {
            setActiveScheme(target);
            setInterestRate(target.interest_rate);
            setMoratoriumMonths(target.moratorium_months);
            setLoanAmount(Math.min(target.max_loan, 300000));
          }
        }
      });
  }, [schemeIdFromQuery]);

  const handleSchemeChange = (schemeId) => {
    const found = schemes.find(s => s.id === schemeId);
    if (found) {
      setActiveScheme(found);
      setInterestRate(found.interest_rate);
      setMoratoriumMonths(found.moratorium_months);
      if (loanAmount > found.max_loan) {
        setLoanAmount(found.max_loan);
      }
    }
  };

  useEffect(() => {
    if (activeScheme && loanAmount > activeScheme.max_loan) {
      setErrorMsg(`Amount (₹${loanAmount.toLocaleString()}) exceeds the maximum scheme limit of ₹${activeScheme.max_loan.toLocaleString()}`);
      setCalcResult(null);
      return;
    }

    setErrorMsg('');

    fetch('/api/calculator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        loan_amount: loanAmount,
        interest_rate: interestRate,
        tenure_years: tenureYears,
        moratorium_months: moratoriumMonths,
        scheme_max_loan: activeScheme?.max_loan
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && !data.data.error) {
          setCalcResult(data.data);
        } else if (data.data && data.data.error) {
          setErrorMsg(data.data.message);
          setCalcResult(null);
        }
      });
  }, [loanAmount, interestRate, tenureYears, moratoriumMonths, activeScheme]);

  const pieData = calcResult ? [
    { name: 'Principal Amount', value: calcResult.loan_amount, fill: '#4F46E5' },
    { name: 'Total Interest', value: calcResult.total_interest, fill: '#F59E0B' }
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-extrabold uppercase tracking-wider mb-1">
              <Calculator className="w-4 h-4" /> Interactive Loan Planner
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Financial Repayment Calculator</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Calculate estimated EMI, moratorium benefits, and principal vs interest schedule
            </p>
          </div>

          {activeScheme && (
            <div className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-2xl text-xs font-bold text-indigo-700">
              Active Scheme: {activeScheme.name}
            </div>
          )}
        </div>

        {/* Scheme Selector Dropdown */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <label className="font-bold text-slate-700 whitespace-nowrap">Selected Scheme Context:</label>
          <select
            value={activeScheme?.id || ''}
            onChange={(e) => handleSchemeChange(e.target.value)}
            className="w-full sm:w-auto flex-1 bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {schemes.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} (Max: ₹{(s.max_loan / 100000).toFixed(1)}L, Rate: {s.interest_rate}%, Moratorium: {s.moratorium_months}m)
              </option>
            ))}
          </select>
        </div>

        {/* Scheme Loan Limit Warning Banner */}
        {errorMsg && (
          <div className="bg-red-50 border-2 border-red-200 p-4 rounded-2xl flex items-center gap-3 text-xs text-red-900 font-bold">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
            <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">
              Loan Inputs
            </h3>

            {/* Slider 1: Loan Amount */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Required Loan Amount</span>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">₹</span>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-28 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-extrabold text-indigo-700 text-right"
                  />
                </div>
              </div>

              <input
                type="range"
                min="10000"
                max={activeScheme ? activeScheme.max_loan : 1000000}
                step="5000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Min: ₹10,000</span>
                <span>Scheme Ceiling: ₹{activeScheme?.max_loan?.toLocaleString()}</span>
              </div>
            </div>

            {/* Field 2: Interest Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Concessional Interest Rate (% p.a.)</span>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-20 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-extrabold text-indigo-700 text-right"
                />
              </div>
              <p className="text-[10px] text-slate-400">Populated automatically from selected concessional scheme terms.</p>
            </div>

            {/* Slider 3: Loan Tenure */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Repayment Tenure (Years)</span>
                <span className="text-indigo-700 font-extrabold">{tenureYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1 Year</span>
                <span>10 Years</span>
              </div>
            </div>

            {/* Moratorium Select */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Moratorium Period (Months)</span>
                <select
                  value={moratoriumMonths}
                  onChange={(e) => setMoratoriumMonths(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-bold text-slate-900"
                >
                  <option value={0}>0 Months (Immediate EMI)</option>
                  <option value={3}>3 Months Grace</option>
                  <option value={6}>6 Months Grace</option>
                  <option value={12}>12 Months Grace</option>
                </select>
              </div>

              {/* Moratorium Notice Box */}
              <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 text-[11px] text-indigo-950 space-y-1">
                <span className="font-bold flex items-center gap-1 text-indigo-700">
                  <Clock className="w-3.5 h-3.5" /> Moratorium Explanation:
                </span>
                <p className="leading-snug text-slate-700">
                  During the {moratoriumMonths}-month moratorium, regular principal repayment is paused. This allows micro-entrepreneurs and students to generate initial cashflow before full EMI payments begin.
                </p>
              </div>
            </div>

          </div>

          {/* Output & Chart Column */}
          <div className="lg:col-span-7 space-y-6">
            {calcResult && (
              <>
                {/* Result KPI Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-3xl space-y-1 shadow-md">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">Estimated Monthly EMI</span>
                    <span className="text-2xl font-black text-white">₹{calcResult.estimated_emi.toLocaleString()}</span>
                    <span className="text-[10px] text-indigo-200 block">After {moratoriumMonths}m moratorium</span>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-slate-200/80 space-y-1 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Interest Payable</span>
                    <span className="text-2xl font-black text-amber-600">₹{calcResult.total_interest.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 block">Over {tenureYears} Years</span>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-slate-200/80 space-y-1 shadow-sm col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Repayment Amount</span>
                    <span className="text-2xl font-black text-slate-900">₹{calcResult.total_repayment.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 block">Principal + Interest</span>
                  </div>
                </div>

                {/* Yearly Breakdown Chart */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
                  <h4 className="font-extrabold text-slate-900 text-sm">Amortization Progression (Year-by-Year)</h4>
                  
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={calcResult.yearly_schedule}>
                        <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                        <Legend />
                        <Bar dataKey="principal" name="Cumulative Principal Repaid" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="interest" name="Cumulative Interest Paid" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Calculator Disclaimer */}
                <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                  <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p>{calcResult.disclaimer}</p>
                </div>

                {/* Next Step Action */}
                <div className="flex justify-end">
                  <Link
                    to={`/partners?scheme_id=${activeScheme?.id}`}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs shadow-md flex items-center gap-2 transition-colors"
                  >
                    Find Eligible Partner Branch →
                  </Link>
                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
