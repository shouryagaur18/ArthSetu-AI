import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AISchemeAssistantPage from './pages/AISchemeAssistantPage';
import EligibilityFormPage from './pages/EligibilityFormPage';
import SchemeRecommendationsPage from './pages/SchemeRecommendationsPage';
import SchemeDetailsPage from './pages/SchemeDetailsPage';
import SchemeComparisonPage from './pages/SchemeComparisonPage';
import FinancialCalculatorPage from './pages/FinancialCalculatorPage';
import PartnerLocatorPage from './pages/PartnerLocatorPage';
import ApplicationRoutingPage from './pages/ApplicationRoutingPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import FinancialLiteracyPage from './pages/FinancialLiteracyPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/ai-assistant" element={<AISchemeAssistantPage />} />
              <Route path="/eligibility-form" element={<EligibilityFormPage />} />
              <Route path="/schemes" element={<SchemeRecommendationsPage />} />
              <Route path="/schemes/:id" element={<SchemeDetailsPage />} />
              <Route path="/compare" element={<SchemeComparisonPage />} />
              <Route path="/calculator" element={<FinancialCalculatorPage />} />
              <Route path="/partners" element={<PartnerLocatorPage />} />
              <Route path="/application-routing" element={<ApplicationRoutingPage />} />
              <Route path="/my-applications" element={<MyApplicationsPage />} />
              <Route path="/learn" element={<FinancialLiteracyPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}
