import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, DEFAULT_PROFILE } from '../context/AppContext';
import { ArrowLeft, ArrowRight, Check, User, DollarSign, GraduationCap, Target, Wallet, Briefcase, Zap } from 'lucide-react';

export default function EligibilityFormPage() {
  const navigate = useNavigate();
  const { userProfile, setUserProfile, loadPresetProfile } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(userProfile || DEFAULT_PROFILE);

  const totalSteps = 6;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      setUserProfile(formData);
      navigate('/schemes');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handlePrefill = () => {
    setFormData(DEFAULT_PROFILE);
    loadPresetProfile();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Beneficiary Eligibility Assessment</h1>
            <p className="text-xs text-slate-500">Structured parameters for scheme matching score calculation</p>
          </div>
          <button
            onClick={handlePrefill}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl border border-emerald-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-emerald-600" /> Auto-Fill Sample Profile
          </button>
        </div>

        {/* Progress Bar Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-indigo-600 uppercase tracking-wider">Step {currentStep} of {totalSteps}</span>
            <span className="text-slate-500">
              {currentStep === 1 && "Personal Details"}
              {currentStep === 2 && "Economic Parameters"}
              {currentStep === 3 && "Educational Status"}
              {currentStep === 4 && "Support Purpose"}
              {currentStep === 5 && "Financial Requirement"}
              {currentStep === 6 && "Business Profile"}
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          
          {/* Step 1: Personal */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <User className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Step 1 — Personal Background</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age (Years)</label>
                  <input
                    type="number"
                    value={formData.age || 29}
                    onChange={(e) => handleChange('age', parseInt(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Social Category</label>
                  <select
                    value={formData.social_category || 'SC'}
                    onChange={(e) => handleChange('social_category', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold"
                  >
                    <option value="SC">Scheduled Caste (SC)</option>
                    <option value="ST">Scheduled Tribe (ST)</option>
                    <option value="OBC">Other Backward Class (OBC)</option>
                    <option value="Minority">Minority Community</option>
                    <option value="General">General / Women</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender || 'Male'}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state || 'Uttar Pradesh'}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={formData.district || 'Lucknow'}
                    onChange={(e) => handleChange('district', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Economic */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Step 2 — Economic Profile</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Annual Family Income (₹)</label>
                  <input
                    type="number"
                    value={formData.annual_family_income || 320000}
                    onChange={(e) => handleChange('annual_family_income', parseFloat(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                  <span className="text-[10px] text-slate-400">Target income limits for concessional interest rates is typically ₹3 Lakh.</span>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Employment Status</label>
                  <select
                    value={formData.employment_status || 'Self-Employed'}
                    onChange={(e) => handleChange('employment_status', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold"
                  >
                    <option value="Self-Employed">Self-Employed / Artisan</option>
                    <option value="Unemployed">Unemployed Youth</option>
                    <option value="Student">Student</option>
                    <option value="Daily Wage">Daily Wage Worker</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Below Poverty Line (BPL) Status</label>
                  <select
                    value={formData.bpl_status || 'No'}
                    onChange={(e) => handleChange('bpl_status', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold"
                  >
                    <option value="No">No (Non-BPL)</option>
                    <option value="Yes">Yes (BPL Card Holder)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Education */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <GraduationCap className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-base">Step 3 — Education Status</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Highest Educational Level</label>
                  <select
                    value={formData.education_level || 'Graduate'}
                    onChange={(e) => handleChange('education_level', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold"
                  >
                    <option value="Graduate">Graduate / Degree Holder</option>
                    <option value="Class 12+">Class 12th Passed</option>
                    <option value="Class 10+">Class 10th Passed</option>
                    <option value="Class 8+">Class 8th Passed</option>
                    <option value="None">Non-Literate / Basic Literacy</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Currently a Student?</label>
                  <select
                    value={formData.current_student_status || 'No'}
                    onChange={(e) => handleChange('current_student_status', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes (Enrolled in College / ITI)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Requirement */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Target className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Step 4 — Support Purpose</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Goal</label>
                  <select
                    value={formData.purpose || 'Business'}
                    onChange={(e) => handleChange('purpose', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold"
                  >
                    <option value="Business">Business / Micro Enterprise</option>
                    <option value="Education">Education Loan</option>
                    <option value="Skill Development">Skill Development / ITI</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Financial Requirement */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Wallet className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-base">Step 5 — Financial Requirement</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Project Cost (₹)</label>
                  <input
                    type="number"
                    value={formData.project_cost || 400000}
                    onChange={(e) => handleChange('project_cost', parseFloat(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Required Loan / Sanction Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.loan_required || 300000}
                    onChange={(e) => handleChange('loan_required', parseFloat(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold text-indigo-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred Tenure (Years)</label>
                  <input
                    type="number"
                    value={formData.preferred_tenure_years || 5}
                    onChange={(e) => handleChange('preferred_tenure_years', parseInt(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Business */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Briefcase className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-base">Step 6 — Business / Enterprise Activity</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Stage</label>
                  <select
                    value={formData.business_stage || 'New Enterprise'}
                    onChange={(e) => handleChange('business_stage', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold"
                  >
                    <option value="New Enterprise">New Business Setup</option>
                    <option value="Existing Expansion">Existing Enterprise Expansion</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Activity Type</label>
                  <input
                    type="text"
                    value={formData.business_type || 'Tailoring'}
                    onChange={(e) => handleChange('business_type', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold"
                    placeholder="e.g. Tailoring, Retail Shop, Food Stall..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              {currentStep === totalSteps ? 'Analyze Matching Schemes →' : 'Continue Step →'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
