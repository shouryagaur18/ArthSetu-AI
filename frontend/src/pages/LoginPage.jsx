import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, DEFAULT_PROFILE } from '../context/AppContext';
import { Lock, Mail, UserCheck, Shield, Building, User } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setUserProfile } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('Beneficiary');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('rahul.sharma@arthsetu.ai');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedName = name.trim() || (email.includes('@') ? email.split('@')[0].split('.')[0].replace(/^\w/, c => c.toUpperCase()) : 'Rahul');
    
    if (userType === 'Beneficiary') {
      const userObj = {
        ...DEFAULT_PROFILE,
        name: formattedName === 'Rahul' ? DEFAULT_PROFILE.name : formattedName,
        email: email
      };
      setUser(userObj);
      setUserProfile(userObj);
      navigate('/dashboard');
    } else if (userType === 'Partner') {
      setUser({
        id: "user-partner-manager",
        name: formattedName !== 'Rahul' ? formattedName : "Suresh Gupta (Branch Manager)",
        email: email,
        user_type: "Partner",
        partner_id: "partner-bank-01"
      });
      navigate('/admin');
    } else {
      setUser({
        id: "user-admin",
        name: formattedName !== 'Rahul' ? formattedName : "Nodal Administrator",
        email: email,
        user_type: "Admin"
      });
      navigate('/admin');
    }
  };

  const handleQuickLogin = (type) => {
    setUserType(type);
    if (type === 'Beneficiary') {
      setEmail('rahul.sharma@arthsetu.ai');
      setUser(DEFAULT_PROFILE);
      setUserProfile(DEFAULT_PROFILE);
      navigate('/dashboard');
    } else if (type === 'Partner') {
      setEmail('partner@psbank.co.in');
      setUser({
        id: "user-partner-manager",
        name: "Suresh Gupta (Branch Manager)",
        email: "partner@psbank.co.in",
        user_type: "Partner",
        partner_id: "partner-bank-01"
      });
      navigate('/admin');
    } else {
      setEmail('admin@arthsetu.ai');
      setUser({
        id: "user-admin",
        name: "Nodal Administrator",
        email: "admin@arthsetu.ai",
        user_type: "Admin"
      });
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F3F6] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-[#D9E2EC] space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#223D4D] rounded-2xl mx-auto flex items-center justify-center text-[#FF7328] font-black text-xl shadow-md border border-[#172B37]">
            AS
          </div>
          <h2 className="text-2xl font-black text-[#0B0E14] tracking-tight">
            {isLogin ? 'Welcome Back to ArthSetu' : 'Create Beneficiary Account'}
          </h2>
          <p className="text-xs font-semibold text-[#223D4D]">
            AI-Powered Scheme Discovery & Partner Routing
          </p>
        </div>

        {/* User Type Selector */}
        <div className="grid grid-cols-3 gap-2 bg-[#F0F3F6] p-1 rounded-xl border border-[#D9E2EC] text-xs font-bold text-[#223D4D]">
          <button
            onClick={() => setUserType('Beneficiary')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              userType === 'Beneficiary' ? 'bg-[#223D4D] text-white shadow-xs font-extrabold' : 'hover:text-[#0B0E14]'
            }`}
          >
            <User className="w-3.5 h-3.5 text-[#FF7328]" /> Beneficiary
          </button>
          <button
            onClick={() => setUserType('Partner')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              userType === 'Partner' ? 'bg-[#223D4D] text-white shadow-xs font-extrabold' : 'hover:text-[#0B0E14]'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-[#FF7328]" /> Partner Bank
          </button>
          <button
            onClick={() => setUserType('Admin')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              userType === 'Admin' ? 'bg-[#223D4D] text-white shadow-xs font-extrabold' : 'hover:text-[#0B0E14]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#FF7328]" /> Admin
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-[#0B0E14] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#223D4D] absolute left-3 top-3" />
                <input
                  type="text"
                  required={!isLogin}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#F0F3F6] border border-[#D9E2EC] rounded-xl text-xs text-[#0B0E14] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF7328]"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#0B0E14] mb-1">Email / Phone</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#223D4D] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#F0F3F6] border border-[#D9E2EC] rounded-xl text-xs text-[#0B0E14] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF7328]"
                placeholder="email@arthsetu.ai"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B0E14] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#223D4D] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#F0F3F6] border border-[#D9E2EC] rounded-xl text-xs text-[#0B0E14] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF7328]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#FF7328] hover:bg-[#E85E15] text-white font-extrabold rounded-xl text-xs shadow-md transition-colors cursor-pointer"
          >
            {isLogin ? 'Sign In' : 'Register Now'}
          </button>
        </form>

        {/* Preset Accounts for Quick Access */}
        <div className="bg-[#F0F3F6] p-4 rounded-2xl border border-[#D9E2EC] space-y-2 text-xs">
          <span className="font-extrabold text-[#0B0E14] text-[11px] block uppercase tracking-wider">Preset Accounts for Quick Access:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleQuickLogin('Beneficiary')}
              className="bg-white border border-[#D9E2EC] hover:bg-[#E6ECF1] text-[#0B0E14] text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <UserCheck className="w-3 h-3 text-[#FF7328]" /> Beneficiary (Rahul)
            </button>
            <button
              onClick={() => handleQuickLogin('Partner')}
              className="bg-white border border-[#D9E2EC] hover:bg-[#E6ECF1] text-[#0B0E14] text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Building className="w-3 h-3 text-[#223D4D]" /> Partner Bank
            </button>
            <button
              onClick={() => handleQuickLogin('Admin')}
              className="bg-white border border-[#D9E2EC] hover:bg-[#E6ECF1] text-[#0B0E14] text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Shield className="w-3 h-3 text-[#0B0E14]" /> Nodal Admin
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-bold text-[#FF7328] hover:underline cursor-pointer"
          >
            {isLogin ? "Don't have an account? Register here" : "Already registered? Login here"}
          </button>
        </div>

      </div>
    </div>
  );
}
