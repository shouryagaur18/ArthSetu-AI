import React, { createContext, useContext, useState } from 'react';
import { translations } from '../utils/translations';

const AppContext = createContext();

export const DEFAULT_PROFILE = {
  id: "user-rahul-sharma",
  name: "Rahul Sharma",
  email: "rahul.sharma@arthsetu.ai",
  age: 29,
  gender: "Male",
  state: "Uttar Pradesh",
  district: "Lucknow",
  social_category: "SC",
  annual_family_income: 320000,
  education_level: "Graduate",
  current_student_status: "No",
  bpl_status: "No",
  purpose: "Business",
  business_type: "Tailoring",
  project_cost: 400000,
  loan_required: 300000,
  preferred_tenure_years: 5,
  profile_completion: 80,
  user_type: "Beneficiary"
};

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  const [user, setUser] = useState(DEFAULT_PROFILE);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [comparisonSchemes, setComparisonSchemes] = useState([]);
  const [userProfile, setUserProfile] = useState(DEFAULT_PROFILE);

  const t = translations[lang] || translations.en;

  const toggleLang = (newLang) => {
    setLang(newLang);
  };

  const loadPresetProfile = () => {
    setUser(DEFAULT_PROFILE);
    setUserProfile(DEFAULT_PROFILE);
  };

  const toggleCompareScheme = (scheme) => {
    setComparisonSchemes(prev => {
      const exists = prev.some(s => s.id === scheme.id);
      if (exists) {
        return prev.filter(s => s.id !== scheme.id);
      } else {
        if (prev.length >= 3) {
          alert("You can compare up to 3 schemes simultaneously.");
          return prev;
        }
        return [...prev, scheme];
      }
    });
  };

  return (
    <AppContext.Provider value={{
      lang,
      toggleLang,
      t,
      user,
      setUser,
      userProfile,
      setUserProfile,
      loadPresetProfile,
      loadDemoProfile: loadPresetProfile, // alias for backwards compatibility
      selectedScheme,
      setSelectedScheme,
      comparisonSchemes,
      setComparisonSchemes,
      toggleCompareScheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
