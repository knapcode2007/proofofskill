import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ReactiveCursor } from './components/ReactiveCursor';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SkillSelectionPage } from './pages/SkillSelectionPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { DefensePage } from './pages/DefensePage';
import { ProofPage } from './pages/ProofPage';
import { VerifyPage } from './pages/VerifyPage';
import { RecruiterPage } from './pages/RecruiterPage';
import { SettingsPage } from './pages/SettingsPage';

function MainApp() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [activeAssessmentId, setActiveAssessmentId] = useState<string | null>(null);
  const [activeCredentialId, setActiveCredentialId] = useState<string | null>(null);

  // Check URL pathname for direct verification routing (e.g. /verify/POS-2026-...)
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname.startsWith('/verify/')) {
      const idFromUrl = pathname.replace('/verify/', '').trim();
      if (idFromUrl) {
        setActiveCredentialId(idFromUrl);
        setCurrentTab('verify');
      }
    } else if (pathname.startsWith('/proof/')) {
      const idFromUrl = pathname.replace('/proof/', '').trim();
      if (idFromUrl) {
        setActiveCredentialId(idFromUrl);
        setCurrentTab('proof');
      }
    }
  }, []);

  // Update browser history title or URL smoothly
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartAssessment = () => {
    handleTabChange('new-assessment');
  };

  const handleAssessmentStarted = (assessmentId: string) => {
    setActiveAssessmentId(assessmentId);
    handleTabChange('workspace');
  };

  const handleProceedToDefense = (assessmentId: string) => {
    setActiveAssessmentId(assessmentId);
    handleTabChange('defense');
  };

  const handleProceedToProof = (credentialId: string) => {
    setActiveCredentialId(credentialId);
    handleTabChange('proof');
  };

  const handleOpenVerify = (credentialId?: string) => {
    if (credentialId) {
      setActiveCredentialId(credentialId);
    }
    handleTabChange('verify');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#05070a] text-zinc-100 selection:bg-amber-500 selection:text-zinc-950">
      <ReactiveCursor />
      <Navbar currentTab={currentTab} setCurrentTab={handleTabChange} />

      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onStartAssessment={handleStartAssessment}
            onVerifyCredential={() => handleOpenVerify()}
            onOpenRecruiter={() => handleTabChange('recruiter')}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            onStartNewAssessment={handleStartAssessment}
            onOpenAssessment={(id) => {
              setActiveAssessmentId(id);
              handleTabChange('workspace');
            }}
            onOpenProof={(id) => {
              setActiveCredentialId(id);
              handleTabChange('proof');
            }}
          />
        )}

        {currentTab === 'new-assessment' && (
          <SkillSelectionPage
            onAssessmentStarted={handleAssessmentStarted}
            onCancel={() => handleTabChange('dashboard')}
          />
        )}

        {currentTab === 'workspace' && activeAssessmentId && (
          <WorkspacePage
            assessmentId={activeAssessmentId}
            onProceedToResults={(id) => handleProceedToDefense(id)}
            onProceedToDefense={(id) => handleProceedToDefense(id)}
          />
        )}

        {currentTab === 'defense' && activeAssessmentId && (
          <DefensePage
            assessmentId={activeAssessmentId}
            onProceedToProof={handleProceedToProof}
            onBackToWorkspace={(id) => {
              setActiveAssessmentId(id);
              handleTabChange('workspace');
            }}
          />
        )}

        {currentTab === 'proof' && activeCredentialId && (
          <ProofPage
            credentialId={activeCredentialId}
            onBackToDashboard={() => handleTabChange('dashboard')}
            onOpenVerify={handleOpenVerify}
          />
        )}

        {currentTab === 'verify' && (
          <VerifyPage
            initialCredentialId={activeCredentialId || undefined}
            onOpenRecruiter={() => handleTabChange('recruiter')}
          />
        )}

        {currentTab === 'recruiter' && (
          <RecruiterPage
            onOpenProof={(id) => {
              setActiveCredentialId(id);
              handleTabChange('proof');
            }}
            onOpenVerify={handleOpenVerify}
          />
        )}

        {currentTab === 'settings' && <SettingsPage />}
      </main>

      <Footer />
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
