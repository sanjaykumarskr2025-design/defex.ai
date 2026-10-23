import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppStateProvider, useAppState } from './context/AppContext';

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
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { deviceView } = useAppState();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isLoginPage = location.pathname === '/login' || location.pathname === '/register';
  const isMenuRoute = location.pathname === '/menu';

  // Open drawer if on /menu
  useEffect(() => {
    if (isMenuRoute) {
      setIsDrawerOpen(true);
    }
  }, [isMenuRoute]);

  const handleToggleDrawer = () => {
    if (isDrawerOpen) {
      setIsDrawerOpen(false);
      if (isMenuRoute) navigate('/');
    } else {
      setIsDrawerOpen(true);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    if (isMenuRoute) {
      navigate('/');
    }
  };

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
      case '/menu':
        return { title: 'Menu', showBack: true, backTo: '/' };
      default:
        return { title: undefined, showBack: false };
    }
  };

  const { title, showBack, backTo } = getPageConfig();

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col">
      {/* Global Screen Switcher Banner with Web View and Mobile View */}
      <ScreenSwitcherBar onToggleDrawer={handleToggleDrawer} />

      {/* Global Mobile Menu Drawer - Works from ANY screen */}
      <MobileMenuDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} />

      {/* Main Content Area */}
      {isLoginPage ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <LoginPage />
        </div>
      ) : !isAuthenticated ? (
        <Navigate to="/login" replace />
      ) : (
        <div
          className={`w-full mx-auto shadow-xl min-h-screen bg-slate-50 flex flex-col font-sans transition-all duration-200 ${
            deviceView === 'mobile'
              ? 'max-w-[420px] my-4 rounded-[28px] border border-slate-200/90 shadow-2xl overflow-hidden'
              : 'max-w-5xl'
          }`}
        >
          <TopAppBar title={title} showBack={showBack} backTo={backTo} />

          <main className="flex-1 w-full mx-auto px-4 pt-3">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/menu" element={<DashboardPage />} />
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

          <BottomNav onOpenMore={handleToggleDrawer} />
        </div>
      )}
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
