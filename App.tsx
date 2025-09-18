import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/PatientsPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { EMRPage } from './pages/EMRPage';
import { BillingPage } from './pages/BillingPage';
import { SettingsPage } from './pages/SettingsPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import ContentDisplay from './components/ContentDisplay';
import { PLAN_DATA } from './data/hmsPlanData';

// Dynamically determine the basename from the URL pathname.
// This is necessary because the app is often served under a dynamic, UUID-based path.
const getBasename = (): string => {
  // The path is expected to be in the format: /<uuid>/<route> or just /<uuid>
  // This regex extracts the initial UUID segment to use as the base path.
  const match = window.location.pathname.match(/^(\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
  
  // If a UUID path is found, use it as the basename.
  if (match) {
    return match[1];
  }

  // Fallback for environments where there is no UUID path (e.g., local development).
  return '/';
};

const AppRoutes: React.FC = () => {
    const location = useLocation();

    // When the user navigates to the base path (e.g., /<uuid>/), the location.pathname
    // inside the router context will be just "/". We redirect this to the dashboard.
    if (location.pathname === '/') {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <Routes>
            {/* The root path is handled above, so we don't need a route for "/" here. */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'nurse', 'receptionist', 'patient']}><DashboardPage /></ProtectedRoute>} />
            <Route path="/patients" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'nurse', 'receptionist']}><PatientsPage /></ProtectedRoute>} />
            <Route path="/doctors" element={<ProtectedRoute allowedRoles={['admin', 'receptionist']}><DoctorsPage /></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'nurse', 'receptionist', 'patient']}><AppointmentsPage /></ProtectedRoute>} />
            <Route path="/emr" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'nurse']}><EMRPage /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute allowedRoles={['admin', 'receptionist']}><BillingPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute allowedRoles={['admin']}><SettingsPage /></ProtectedRoute>} />
            <Route path="/plan" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'nurse', 'receptionist', 'patient']}><ContentDisplay sections={PLAN_DATA} /></ProtectedRoute>} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
    );
};


const App: React.FC = () => {
  return (
    <Router basename={getBasename()}>
      <div className="flex h-screen bg-slate-100 font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6">
            <AppRoutes />
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
