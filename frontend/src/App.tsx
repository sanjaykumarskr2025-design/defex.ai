import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppStateProvider } from './context/AppContext';

import { TopAppBar } from './components/TopAppBar';
import { BottomNav } from './components/BottomNav';
import { MobileMenuDrawer } from './components/MobileMenuDrawer';
import { ScreenSwitcherBar } from './components/ScreenSwitcherBar';

import { DashboardPage } from './pages/DashboardPage';
import { InspectionPage } from './pages/InspectionPage';
import { ReviewQueuePage } from './pages/ReviewQueuePage';
import { MachinesPage } from './pages/MachinesPage';
import { PartDetailsPage } from './pages/PartDetailsPage';
import { AlertsPage } from './pages/AlertsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ReportsPage } from './pages/ReportsPage';
import { LoginPage } from './pages/LoginPage';

function AppLayout() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isLoginPage = location.pathname === '/login' || location.pathname === '/register';

  // Get screen titles and back button configurations
  const getPageConfig = () => {
    switch (location.pathname) {
      case '/inspection':
        return { title: 'Inspection', showBack: true, backTo: '/' };
      case '/queue':
        return { title: 'Review Queue', showBack: true, backTo: '/' };
      case '/machines':
        return { title: 'Machines', showBack: true, backTo: '/' };
      case '/part-details':
        return { title: 'Part Details', showBack: true, backTo: '/inspection' };
      case '/alerts':
        return { title: 'Alerts', showBack: true, backTo: '/' };
      case '/settings':
        return { title: 'Settings', showBack: true, backTo: '/' };
      case '/reports':
        return { title: 'Reports', showBack: true, backTo: '/' };
      default:
        return { title: undefined, showBack: false };
    }
  };

  const { title, showBack, backTo } = getPageConfig();

  // If on login page, render login experience
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <ScreenSwitcherBar onToggleDrawer={() => setIsDrawerOpen(true)} />
        <div className="flex-1 flex items-center justify-center p-4">
          <LoginPage />
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900">
      <ScreenSwitcherBar onToggleDrawer={() => setIsDrawerOpen(true)} />

      <div className="w-full max-w-5xl mx-auto shadow-xl min-h-screen bg-slate-50 flex flex-col font-sans">
        <TopAppBar title={title} showBack={showBack} backTo={backTo} />

        <main className="flex-1 w-full mx-auto px-4 pt-3">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/inspection" element={<InspectionPage />} />
            <Route path="/queue" element={<ReviewQueuePage />} />
            <Route path="/machines" element={<MachinesPage />} />
            <Route path="/part-details" element={<PartDetailsPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <BottomNav onOpenMore={() => setIsDrawerOpen(true)} />

        <MobileMenuDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppStateProvider>
          <AppLayout />
        </AppStateProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
