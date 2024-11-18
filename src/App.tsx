import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataModeProvider } from './contexts/DataModeContext';
import { ErrorProvider } from './contexts/ErrorContext';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserManagement } from './pages/UserManagement';
import { PrototypeManagement } from './pages/PrototypeManagement';
import { PMFAnalysis } from './pages/PMFAnalysis';
import { PrivateRoute } from './components/PrivateRoute';
import { DataModeSelector } from './components/DataModeSelector';
import { ErrorDisplay } from './components/ErrorDisplay';
import { useError } from './contexts/ErrorContext';
import { LoginPage } from './pages/LoginPage';

function ErrorHandler() {
  const { error, clearError } = useError();
  
  if (!error) return null;
  
  return (
    <ErrorDisplay
      userMessage={error.userMessage}
      technicalDetails={error.technicalDetails}
      onDismiss={clearError}
    />
  );
}

export default function App() {
  return (
    <ErrorProvider>
      <DataModeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </PrivateRoute>
                } />
                <Route path="/admin/users" element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </PrivateRoute>
                } />
                <Route path="/admin/prototypes" element={
                  <PrivateRoute allowedRoles={['admin', 'member']}>
                    <PrototypeManagement />
                  </PrivateRoute>
                } />
                <Route path="/admin/pmf/:id" element={
                  <PrivateRoute allowedRoles={['admin', 'member']}>
                    <PMFAnalysis />
                  </PrivateRoute>
                } />
              </Routes>
              <DataModeSelector />
              <ErrorHandler />
            </div>
          </Router>
        </AuthProvider>
      </DataModeProvider>
    </ErrorProvider>
  );
}