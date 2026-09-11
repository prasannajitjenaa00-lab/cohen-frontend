import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';
import LeadPipeline from './pages/LeadPipeline';
import FollowUps from './pages/FollowUps';
import Admissions from './pages/Admissions';
import Students from './pages/Students';
import StaffUsers from './pages/StaffUsers';
import Settings from './pages/Settings';
import GoogleAdsIntegration from './pages/marketing/GoogleAdsIntegration';
import { MetaAdsIntegration, CampaignPerformance, LeadSources } from './pages/marketing/MarketingPages';

// Layout Components
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

// Private Route Guard Component
const PrivateRoute = ({ children, roles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-xs text-slate-500 font-medium">
        Loading Portal Session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Force password change guard
  if (user?.mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  // Check role authorization (SUPER_USER has complete CRM access)
  if (roles && !roles.includes(user?.role) && user?.role !== 'SUPER_USER') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Guard component specifically for Change Password route
const ChangePasswordRoute = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-xs text-slate-500 font-medium">
        Loading Portal Session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If password change is not required, redirect directly to dashboard
  if (!user?.mustChangePassword) {
    return <Navigate to="/dashboard" replace />;
  }

  return <ChangePassword />;
};

// Main Layout Wrapper
const DashboardLayout = () => {
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white text-slate-800 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Main Panel Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header */}
        <Topbar setMobileOpen={setMobileSidebarOpen} />

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/:id" element={<LeadDetail />} />
            <Route path="/pipeline" element={<LeadPipeline />} />
            <Route path="/followups" element={<FollowUps />} />
            <Route path="/admissions" element={
              <PrivateRoute roles={['Super Admin', 'Admin', 'Admission Staff', 'CGO']}>
                <Admissions />
              </PrivateRoute>
            } />
            <Route path="/students" element={
              <PrivateRoute roles={['Super Admin', 'Admin', 'Admission Staff', 'CGO']}>
                <Students />
              </PrivateRoute>
            } />
            
            {/* Marketing & Ad Integrations */}
            <Route path="/marketing/google" element={
              <PrivateRoute roles={['Super Admin', 'Admin']}>
                <GoogleAdsIntegration />
              </PrivateRoute>
            } />
            <Route path="/marketing/meta" element={
              <PrivateRoute roles={['Super Admin', 'Admin']}>
                <MetaAdsIntegration />
              </PrivateRoute>
            } />
            <Route path="/marketing/campaigns" element={
              <PrivateRoute roles={['Super Admin', 'Admin', 'CGO']}>
                <CampaignPerformance />
              </PrivateRoute>
            } />
            <Route path="/marketing/sources" element={
              <PrivateRoute roles={['Super Admin', 'Admin', 'CGO']}>
                <LeadSources />
              </PrivateRoute>
            } />
            <Route path="/marketing" element={<Navigate to={user?.role === 'CGO' ? '/marketing/campaigns' : '/marketing/google'} replace />} />
            <Route path="/reports" element={<Navigate to="/dashboard" replace />} />

            <Route path="/users" element={
              <PrivateRoute roles={['Super Admin']}>
                <StaffUsers />
              </PrivateRoute>
            } />
            <Route path="/settings" element={
              <PrivateRoute roles={['Super Admin', 'Admin']}>
                <Settings />
              </PrivateRoute>
            } />
            {/* Catch-all dashboard fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Mandatory Change Password Route */}
          <Route path="/change-password" element={<ChangePasswordRoute />} />

          {/* Protected Dashboard Workspace */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
