import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Sparkles, 
  Calculator, 
  MapPin, 
  BookOpen, 
  GitCompare, 
  LayoutDashboard,
  ShieldCheck,
  Bot
} from 'lucide-react';

export default function Navbar() {
  const { t, user, setUser } = useApp();
  const location = useLocation();

  const dashboardLabel = user && user.name ? user.name.split(' ')[0] : t.navDashboard;

  const navItems = [
    { path: '/', label: t.navHome, icon: Building2 },
    { path: '/schemes', label: t.navFindSchemes, icon: Sparkles },
    { path: '/compare', label: t.navCompare, icon: GitCompare },
    { path: '/calculator', label: t.navCalculator, icon: Calculator },
    { path: '/partners', label: t.navPartners, icon: MapPin },
    { path: '/learn', label: t.navLearn, icon: BookOpen },
    { path: '/dashboard', label: dashboardLabel, icon: LayoutDashboard },
    { path: '/admin', label: t.navAdmin, icon: ShieldCheck },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#F0F3F6]/95 backdrop-blur-md border-b border-[#D9E2EC] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo with bridge/financial support visual metaphor */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0 py-1">
            <div className="w-10 h-10 rounded-xl bg-[#223D4D] flex items-center justify-center text-[#FF7328] shadow-sm group-hover:scale-105 transition-transform border border-[#172B37]">
              <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 17C6 14 9 12 12 12C15 12 18 14 21 17" />
                <path d="M12 4V12" />
                <path d="M8 8L12 4L16 8" />
                <line x1="3" y1="20" x2="21" y2="20" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xl font-extrabold tracking-tight text-[#0B0E14] font-sans">ArthSetu</span>
                <span className="bg-[#FF7328] text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-2xs">AI</span>
              </div>
              <span className="text-[10px] font-bold text-[#223D4D] tracking-wide mt-0.5">Civic Credit Platform</span>
            </div>
          </Link>

          {/* Desktop Nav links with equal gap and consistent height */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`h-9 flex items-center gap-1.5 px-3 rounded-lg text-xs font-bold transition-all border ${
                    active 
                      ? 'bg-[#FFF0E8] text-[#FF7328] border-[#FFC6A8] shadow-2xs' 
                      : 'text-[#223D4D] hover:text-[#0B0E14] hover:bg-[#E6ECF1] border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#FF7328]' : 'text-[#223D4D]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons with equal height and uniform spacing */}
          <div className="flex items-center gap-2 shrink-0">
            {/* AI Assistant Quick Link */}
            <Link
              to="/ai-assistant"
              className="hidden md:inline-flex h-9 items-center gap-1.5 px-3 rounded-lg text-xs font-extrabold bg-[#223D4D] text-white hover:bg-[#172B37] border border-[#172B37] shadow-2xs transition-colors"
            >
              <Bot className="w-3.5 h-3.5 text-[#FF7328]" />
              <span>{t.talkToAI}</span>
            </Link>

            {!user ? (
              <Link
                to="/login"
                className="h-9 inline-flex items-center justify-center px-4 text-xs font-extrabold bg-[#FF7328] hover:bg-[#E85E15] text-white rounded-lg transition-colors shadow-2xs"
              >
                {t.login}
              </Link>
            ) : (
              <button
                onClick={() => setUser(null)}
                className="h-9 inline-flex items-center justify-center px-3.5 text-xs font-extrabold bg-white hover:bg-[#E6ECF1] text-[#0B0E14] rounded-lg transition-colors border border-[#D9E2EC] cursor-pointer shadow-2xs"
                title="Logout"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden border-t border-[#D9E2EC] py-2 flex items-center justify-between overflow-x-auto gap-1 text-xs scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-1.5 px-2.5 rounded-lg transition-colors whitespace-nowrap border ${
                  active ? 'text-[#FF7328] font-bold bg-[#FFF0E8] border-[#FFC6A8]' : 'text-[#223D4D] border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="text-[10px] font-bold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
