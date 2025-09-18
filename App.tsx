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
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const getBasename = (): string => {
  const match = window.location.pathname.match(/^(\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
  return match ? match[1] : '/';
};

const AppRoutes: React.FC = () => {
    const location = useLocation();

    if (location.pathname === '/') {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <Routes>
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

const AuthRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};


const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Router basename={getBasename()}>
      {isAuthenticated ? (
        <div className="flex h-screen bg-slate-100 font-sans">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6">
              <AppRoutes />
            </main>
          </div>
        </div>
      ) : (
        <AuthRoutes />
      )}
    </Router>
  );
};

export default App;