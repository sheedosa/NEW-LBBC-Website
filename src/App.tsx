import React, { Suspense, Component, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';

// Lazy load pages for performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const EventsPage = React.lazy(() => import('./pages/EventsPage'));
const DirectoryPage = React.lazy(() => import('./pages/DirectoryPage'));
const ResourcesPage = React.lazy(() => import('./pages/ResourcesPage'));
const MembershipPage = React.lazy(() => import('./pages/MembershipPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const SpotlightPage = React.lazy(() => import('./pages/SpotlightPage'));
const NewsDetailPage = React.lazy(() => import('./pages/NewsDetailPage'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-12 h-12 border-4 border-lbbc-green/20 border-t-lbbc-green rounded-full animate-spin"></div>
  </div>
);

const ErrorFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4 px-4 text-center">
    <p className="text-slate-700 font-semibold text-lg">Something went wrong loading this page.</p>
    <button
      onClick={() => window.location.reload()}
      className="bg-lbbc-green text-white px-6 py-2 rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-lbbc-red transition-colors"
    >
      Retry
    </button>
  </div>
);

interface ErrorBoundaryState { hasError: boolean }
class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) { console.error('ErrorBoundary:', error, info); }
  render() {
    return this.state.hasError ? <ErrorFallback /> : this.props.children;
  }
}

const AppContent = () => {
  useLanguage(); // ensures RTL dir is applied on language change

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <Navbar />
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/members" element={<DirectoryPage />} />
              <Route path="/directory" element={<Navigate to="/members" replace />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/membership" element={<MembershipPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/spotlight/capterio" element={<SpotlightPage />} />
              <Route path="/news/:id" element={<NewsDetailPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </div>
    </Router>
  );
};

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
