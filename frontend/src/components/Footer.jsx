import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, ExternalLink, HelpCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0B0E14] text-[#E6ECF1] border-t border-[#172B37] text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FF7328] flex items-center justify-center text-white font-black text-xs shadow-md">
                AS
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">ArthSetu AI</span>
            </div>
            <p className="text-[#FF7328] text-xs font-bold leading-relaxed tracking-wide">
              Right Scheme. Right Support. Right Path.
            </p>
            <p className="text-[#D9E2EC] text-xs leading-relaxed">
              AI-powered scheme discovery, financial planning, and intelligent channel partner routing for eligible beneficiaries.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Core Platform Features</h3>
            <ul className="space-y-2 text-xs text-[#D9E2EC]">
              <li><Link to="/schemes" className="hover:text-[#FF7328] transition-colors">Smart Scheme Matching</Link></li>
              <li><Link to="/calculator" className="hover:text-[#FF7328] transition-colors">Financial Calculator</Link></li>
              <li><Link to="/partners" className="hover:text-[#FF7328] transition-colors">Geo-Spatial Partner Router</Link></li>
              <li><Link to="/compare" className="hover:text-[#FF7328] transition-colors">Scheme Comparison Matrix</Link></li>
              <li><Link to="/ai-assistant" className="hover:text-[#FF7328] transition-colors">AI Scheme Assistant</Link></li>
            </ul>
          </div>

          {/* Col 3: Impact Goals */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Financial Literacy</h3>
            <ul className="space-y-2 text-xs text-[#D9E2EC]">
              <li><Link to="/learn" className="hover:text-[#FF7328] transition-colors">Concessional Lending Literacy</Link></li>
              <li><Link to="/admin" className="hover:text-[#FF7328] transition-colors">Ecosystem Transparency</Link></li>
              <li><Link to="/partners" className="hover:text-[#FF7328] transition-colors">NPA & Capacity Threshold Check</Link></li>
              <li><Link to="/learn" className="hover:text-[#FF7328] transition-colors">Moratorium & EMI Guides</Link></li>
            </ul>
          </div>

          {/* Col 4: Important Notice */}
          <div className="bg-[#223D4D] p-4 rounded-xl border border-[#172B37] space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-[#FF7328] font-bold">
              <ShieldCheck className="w-4 h-4" />
              Official Scheme Data Principle
            </div>
            <p className="text-white text-[11px] leading-relaxed">
              Government scheme information is managed via structured rules. Always verify current eligibility criteria and guidelines on official nodal portals.
            </p>
            <div className="pt-2">
              <span className="text-[10px] text-[#D9E2EC] font-mono block">ArthSetu AI Platform</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#172B37] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D9E2EC]">
          <p>© 2026 ArthSetu AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/learn" className="hover:text-[#FF7328]">Financial Literacy</Link>
            <Link to="/admin" className="hover:text-[#FF7328]">Partner Portal</Link>
            <span className="text-[#223D4D]">|</span>
            <span className="text-[#FF7328] font-bold">Status: Platform Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
