import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Calculator, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Bot, 
  Building2,
  BadgePercent,
  Check,
  Zap,
  BookOpen
} from 'lucide-react';

export default function LandingPage() {
  const { t } = useApp();

  return (
    <div className="min-h-screen bg-[#F0F3F6] flex flex-col text-[#0B0E14] relative overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-[#D9E2EC] bg-gradient-to-b from-[#F0F3F6] via-white to-[#F0F3F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0E8] border border-[#FFC6A8] text-[#FF7328] text-xs font-bold tracking-wide shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#FF7328]" />
                AI-Powered Scheme Discovery & Partner Routing
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B0E14] tracking-tight leading-[1.15]">
                {t.heroTitle}
              </h1>

              <p className="text-lg text-[#223D4D] font-medium leading-relaxed max-w-2xl">
                {t.heroSubtitle}
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/schemes"
                  className="bg-[#FF7328] hover:bg-[#E85E15] text-white text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 group"
                >
                  {t.findMyScheme}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/ai-assistant"
                  className="bg-[#223D4D] hover:bg-[#172B37] text-white text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <Bot className="w-4 h-4 text-[#FF7328]" />
                  {t.talkToAI}
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-[#D9E2EC] flex flex-wrap items-center gap-6 text-xs text-[#223D4D] font-bold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FF7328]" /> 100% Rule Engine Accuracy
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FF7328]" /> Moratorium & EMI Calculator
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FF7328]" /> Intelligent Capacity Router
                </span>
              </div>
            </div>

            {/* Right Hero Visual Dashboard Card */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-[#D9E2EC] space-y-5 relative z-10 card-hover aspect-[4/3] flex flex-col justify-between">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#D9E2EC]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#223D4D] text-[#FF7328] font-bold flex items-center justify-center text-sm shadow-xs border border-[#172B37]">
                      RS
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-[#0B0E14]">Rahul Sharma</h4>
                      <p className="text-xs text-[#223D4D] font-medium">SC Entrepreneur • Lucknow, UP</p>
                    </div>
                  </div>
                  <span className="bg-[#FFF0E8] text-[#FF7328] text-xs font-extrabold px-2.5 py-1 rounded-full border border-[#FFC6A8] flex items-center gap-1">
                    <Check className="w-3 h-3" /> Profile 80% Complete
                  </span>
                </div>

                {/* Match Card Preview */}
                <div className="bg-[#223D4D] text-white p-5 rounded-2xl space-y-3 shadow-md border border-[#172B37]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF7328]">Top Scheme Match</span>
                    <span className="bg-[#FF7328] text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                      92% Profile Match
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white">NSFDC Term Loan & Micro Credit Scheme</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#172B37] text-[#D9E2EC]">
                    <div>
                      <span className="text-[#D9E2EC] text-[10px] block font-semibold">Interest Rate</span>
                      <span className="font-extrabold text-[#FF7328] text-sm">6.0% p.a.</span>
                    </div>
                    <div>
                      <span className="text-[#D9E2EC] text-[10px] block font-semibold">Moratorium</span>
                      <span className="font-extrabold text-white text-sm">6 Months</span>
                    </div>
                  </div>
                </div>

                {/* EMI & Location Mini Widgets */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#F0F3F6] p-3.5 rounded-xl border border-[#D9E2EC] flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-[#223D4D] uppercase block">Estimated EMI</span>
                    <span className="text-base font-extrabold text-[#0B0E14]">₹5,799 / mo</span>
                    <span className="text-[10px] text-[#FF7328] font-bold block mt-0.5">₹3 Lakh @ 5 Yrs</span>
                  </div>
                  <div className="bg-[#F0F3F6] p-3.5 rounded-xl border border-[#D9E2EC] flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-[#223D4D] uppercase block">Matched Partner</span>
                    <span className="text-xs font-extrabold text-[#0B0E14] truncate block">Public Sector Bank</span>
                    <span className="text-[10px] text-[#223D4D] font-bold flex items-center gap-0.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#FF7328]" /> 2.4 km • Eligible
                    </span>
                  </div>
                </div>

              </div>

              {/* Decorative Accent Glow */}
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-[#FF7328]/10 rounded-full blur-3xl pointer-events-none"></div>
            </div>

          </div>
        </div>
      </section>

      {/* Three Core Solution Features */}
      <section className="relative z-10 py-16 border-b border-[#D9E2EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl font-extrabold text-[#0B0E14] tracking-tight">
              Three Mandatory Solution Components
            </h2>
            <p className="text-[#223D4D] text-sm font-medium leading-relaxed">
              ArthSetu AI integrates transparent rule-based scheme recommendation, financial loan planning, and capacity-aware geo-spatial channel routing into a seamless user journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Card 1: Scheme Recommender */}
            <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#D9E2EC] hover:border-[#FF7328] transition-all card-hover h-full flex flex-col justify-between space-y-6 shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF0E8] text-[#FF7328] flex items-center justify-center font-bold border border-[#FFC6A8]">
                  <Sparkles className="w-6 h-6 text-[#FF7328]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#0B0E14]">{t.smartMatching}</h3>
                <p className="text-xs text-[#223D4D] leading-relaxed font-semibold">
                  {t.smartMatchingDesc} Evaluates social category, annual family income, requested loan ceiling, state, and business sector using a transparent 100-point scoring algorithm.
                </p>
              </div>

              <Link to="/schemes" className="text-xs font-extrabold text-[#FF7328] hover:text-[#E85E15] inline-flex items-center gap-1.5 pt-2 border-t border-[#D9E2EC]">
                Explore Matching Engine <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 2: Financial Calculator */}
            <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#D9E2EC] hover:border-[#FF7328] transition-all card-hover h-full flex flex-col justify-between space-y-6 shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#223D4D] text-white flex items-center justify-center font-bold border border-[#172B37]">
                  <Calculator className="w-6 h-6 text-[#FF7328]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#0B0E14]">{t.finCalc}</h3>
                <p className="text-xs text-[#223D4D] leading-relaxed font-semibold">
                  {t.finCalcDesc} Interactive EMI schedule builder with strict loan ceiling checks, moratorium period visualization, and principal vs interest chart breakdown.
                </p>
              </div>

              <Link to="/calculator" className="text-xs font-extrabold text-[#FF7328] hover:text-[#E85E15] inline-flex items-center gap-1.5 pt-2 border-t border-[#D9E2EC]">
                Calculate Repayments <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 3: Geo-Spatial Partner Locator */}
            <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#D9E2EC] hover:border-[#FF7328] transition-all card-hover h-full flex flex-col justify-between space-y-6 shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0B0E14] text-white flex items-center justify-center font-bold">
                  <MapPin className="w-6 h-6 text-[#FF7328]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#0B0E14]">{t.partnerLocator}</h3>
                <p className="text-xs text-[#223D4D] leading-relaxed font-semibold">
                  {t.partnerLocatorDesc} OpenStreetMap interactive locator that filters SCAs, Banks, and MFIs by scheme support, fund utilization capacity, and NPA ratio compliance.
                </p>
              </div>

              <Link to="/partners" className="text-xs font-extrabold text-[#FF7328] hover:text-[#E85E15] inline-flex items-center gap-1.5 pt-2 border-t border-[#D9E2EC]">
                Locate Nearby Partners <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="relative z-10 py-16 border-b border-[#D9E2EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-[#0B0E14] tracking-tight">End-to-End User Journey</h2>
            <p className="text-[#223D4D] text-sm font-semibold mt-2">Simple 6-step path from requirement discovery to application routing</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-stretch">
            {[
              { step: "1", title: "Tell Us About Yourself", desc: "Share your business or education requirement" },
              { step: "2", title: "Get Matched", desc: "Transparent 100-point profile matching engine" },
              { step: "3", title: "Compare Schemes", desc: "Side-by-side comparison matrix of interest & terms" },
              { step: "4", title: "Calculate Repayment", desc: "Understand EMI, loan limits & moratorium period" },
              { step: "5", title: "Find Eligible Partner", desc: "Locate nearby SCAs/Banks with active fund capacity" },
              { step: "6", title: "Route Application", desc: "Generate tracking ID and send to partner branch" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-[#D9E2EC] space-y-2 h-full flex flex-col justify-between shadow-2xs">
                <div className="space-y-2">
                  <span className="w-7 h-7 rounded-lg bg-[#FF7328] text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                    {item.step}
                  </span>
                  <h4 className="font-extrabold text-[#0B0E14] text-xs">{item.title}</h4>
                </div>
                <p className="text-[11px] text-[#223D4D] font-medium leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Impact Goals Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0B0E14]/95 backdrop-blur-md text-white rounded-3xl p-8 lg:p-12 shadow-xl space-y-8 border border-[#172B37]">
            <div className="max-w-3xl space-y-3">
              <span className="text-[#FF7328] text-xs font-extrabold uppercase tracking-widest">Enterprise Platform Goals</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white">Addressing Key National Impact Goals</h2>
              <p className="text-[#D9E2EC] text-sm leading-relaxed font-medium">
                ArthSetu AI directly resolves information asymmetry and channel inefficiencies in concessional credit distribution for marginalized entrepreneurs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-[#172B37] items-stretch">
              <div className="bg-[#223D4D] p-5 rounded-2xl border border-[#172B37] space-y-2 flex flex-col justify-between">
                <div>
                  <div className="text-2xl font-black text-[#FF7328]">100%</div>
                  <h4 className="font-extrabold text-xs text-white">Financial Literacy</h4>
                </div>
                <p className="text-[11px] text-[#D9E2EC] leading-relaxed">Simplifies concessional lending, interest subvention, and moratorium concepts.</p>
              </div>

              <div className="bg-[#223D4D] p-5 rounded-2xl border border-[#172B37] space-y-2 flex flex-col justify-between">
                <div>
                  <div className="text-2xl font-black text-white">Transparent</div>
                  <h4 className="font-extrabold text-xs text-white">Rule Engine</h4>
                </div>
                <p className="text-[11px] text-[#D9E2EC] leading-relaxed">Database as single source of truth prevents fabricated scheme details.</p>
              </div>

              <div className="bg-[#223D4D] p-5 rounded-2xl border border-[#172B37] space-y-2 flex flex-col justify-between">
                <div>
                  <div className="text-2xl font-black text-[#FF7328]">Smart</div>
                  <h4 className="font-extrabold text-xs text-white">NPA Check Router</h4>
                </div>
                <p className="text-[11px] text-[#D9E2EC] leading-relaxed">Routes applicants away from restricted branches with high overdues.</p>
              </div>

              <div className="bg-[#223D4D] p-5 rounded-2xl border border-[#172B37] space-y-2 flex flex-col justify-between">
                <div>
                  <div className="text-2xl font-black text-white">End-to-End</div>
                  <h4 className="font-extrabold text-xs text-white">Application Tracking</h4>
                </div>
                <p className="text-[11px] text-[#D9E2EC] leading-relaxed">Generates unique tracking ID (AS-XXXX) for stage-by-stage status.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
