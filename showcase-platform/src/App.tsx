import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastContainer } from './components/common/Toast';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AdminSidebar } from './components/layout/AdminSidebar';
import { AdminHeader } from './components/layout/AdminHeader';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ProjectsPage } from './pages/public/ProjectsPage';
import { ProjectDetailPage } from './pages/public/ProjectDetailPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminProjectEditPage } from './pages/admin/AdminProjectEditPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminCodePage } from './pages/admin/AdminCodePage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Layout wrapper for Public Website
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Layout wrapper for Admin Dashboard
const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Admin Auth */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Dashboard Protected Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="projects" element={<AdminProjectsPage />} />
            <Route path="projects/new" element={<AdminProjectEditPage />} />
            <Route path="projects/:id/edit" element={<AdminProjectEditPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="code" element={<AdminCodePage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Action Toasts */}
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
