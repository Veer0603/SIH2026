import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/useApp';
import Navigation from './components/Navigation';
import OverviewPage from './pages/OverviewPage';
import AiAdvisorPage from './pages/AiAdvisorPage';
import AiLabPage from './pages/AiLabPage';
import ForecastPage from './pages/ForecastPage';
import InversionPhysicsPage from './pages/InversionPhysicsPage';
import LaymanGuidePage from './pages/LaymanGuidePage';
import RoutePlannerPage from './pages/RoutePlannerPage';
import BlockchainPage from './pages/BlockchainPage';
import MapStationPage from './pages/MapStationPage';
import ChatbotPage from './pages/ChatbotPage';
import AIAQIChatbot from './components/AIAQIChatbot';
import Footer from './components/Footer';
import TermsPrivacyModal from './components/TermsPrivacyModal';
import AddStationModal from './components/AddStationModal';
import StationCompareModal from './components/StationCompareModal';
import NavigationFlowGuideModal from './components/NavigationFlowGuideModal';
import QuickJumpModal from './components/QuickJumpModal';
import FlowNavigator from './components/FlowNavigator';
import ToastContainer from './components/ToastContainer';
import ErrorBoundary from './components/ErrorBoundary';

function MainApp() {
  const [currentPage, setCurrentPage] = useState('overview');
  const [modalMode, setModalMode] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFlowGuideOpen, setIsFlowGuideOpen] = useState(false);
  const [isQuickJumpOpen, setIsQuickJumpOpen] = useState(false);

  const { addStation, comparisonList, setIsCompareModalOpen, clearComparison, language } = useApp();

  const handleAddStation = (newStation) => {
    addStation(newStation);
    setCurrentPage('map');
  };

  // Smooth scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Global keyboard shortcut: Ctrl+K / Cmd+K to open Quick Jump palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsQuickJumpOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Header with Categorized Hubs & Flow Guide Triggers */}
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenFlowGuide={() => setIsFlowGuideOpen(true)}
        onOpenQuickJump={() => setIsQuickJumpOpen(true)}
      />

      <main className="container" style={{ paddingTop: '20px', flex: 1 }}>
        <div key={currentPage} className="page-enter">
          {currentPage === 'overview' && (
            <OverviewPage onNavigate={setCurrentPage} />
          )}

          {currentPage === 'ai-advisor' && (
            <AiAdvisorPage onNavigate={setCurrentPage} />
          )}

          {currentPage === 'ai-lab' && (
            <AiLabPage onNavigate={setCurrentPage} />
          )}

          {currentPage === 'forecast' && (
            <ForecastPage onNavigate={setCurrentPage} />
          )}

          {currentPage === 'inversion' && (
            <InversionPhysicsPage onNavigate={setCurrentPage} />
          )}

          {currentPage === 'layman' && (
            <LaymanGuidePage onNavigate={setCurrentPage} />
          )}

          {currentPage === 'route-planner' && (
            <RoutePlannerPage onNavigate={setCurrentPage} />
          )}

          {currentPage === 'blockchain' && (
            <BlockchainPage onNavigate={setCurrentPage} />
          )}

          {currentPage === 'map' && (
            <MapStationPage
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'chatbot' && (
            <ChatbotPage onNavigate={setCurrentPage} />
          )}

          {currentPage === 'compare' && (
            <MapStationPage
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onNavigate={setCurrentPage}
            />
          )}
        </div>

        {/* Dynamic Contextual Flow Stepper & Recommended Next Step Banner on Every Page */}
        <FlowNavigator
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onOpenFlowGuide={() => setIsFlowGuideOpen(true)}
        />
      </main>

      {/* Floating Comparison Quick Dock Pill */}
      {comparisonList.length > 0 && currentPage !== 'compare' && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9980,
            backgroundColor: 'var(--bg-panel)',
            border: '2px solid var(--accent-primary)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
            borderRadius: '30px',
            padding: '8px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backdropFilter: 'blur(8px)',
            animation: 'fadeInUp 0.25s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800 }}>
            <span style={{ fontSize: '16px' }}>⚖️</span>
            <span>
              {language === 'hi'
                ? `${comparisonList.length}/4 स्टेशन तुलना में`
                : `${comparisonList.length}/4 Stations Selected`}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="btn btn-sm"
              style={{ fontSize: '12px', padding: '4px 14px', borderRadius: '20px', fontWeight: 700 }}
            >
              {language === 'hi' ? 'तुलना देखें' : 'View Comparison'}
            </button>
            <button
              onClick={clearComparison}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '20px' }}
              title={language === 'hi' ? 'सूची साफ़ करें' : 'Clear selection'}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Footer with Master Flow Guide Trigger */}
      <Footer
        onOpenModal={(mode) => setModalMode(mode)}
        onOpenFlowGuide={() => setIsFlowGuideOpen(true)}
      />

      {/* Floating Toast Notification Stack */}
      <ToastContainer />

      {/* Side-by-Side Station Comparison Modal */}
      <StationCompareModal />

      {/* Terms & Privacy Modal */}
      <TermsPrivacyModal
        mode={modalMode}
        onClose={() => setModalMode(null)}
      />

      {/* Add Custom Station Modal */}
      <AddStationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStation={handleAddStation}
      />

      {/* Master Navigation & Flow Roadmap Modal */}
      <NavigationFlowGuideModal
        isOpen={isFlowGuideOpen}
        onClose={() => setIsFlowGuideOpen(false)}
        onNavigate={setCurrentPage}
      />

      {/* Ctrl+K Quick Jump Command Palette */}
      <QuickJumpModal
        isOpen={isQuickJumpOpen}
        onClose={() => setIsQuickJumpOpen(false)}
        onNavigate={setCurrentPage}
      />

      {/* Floating AERIS AI Chatbot Widget (Only rendered on non-chatbot pages) */}
      {currentPage !== 'chatbot' && (
        <AIAQIChatbot isFloating={true} onNavigate={setCurrentPage} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </ErrorBoundary>
  );
}
