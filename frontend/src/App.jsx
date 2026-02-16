import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import VerificationCode from './pages/VerificationCode';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import LeadList from './pages/LeadList';
import LeadDetails from './pages/LeadDetails';
import ChatHistory from './pages/ChatHistory';
import LeadCreate from './pages/LeadCreate';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verification-code" element={<VerificationCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['ROLE_HO']}>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/leads" element={
            <PrivateRoute allowedRoles={['ROLE_HO', 'ROLE_DA']}>
              <LeadList />
            </PrivateRoute>
          } />
          <Route path="/leads/new" element={
            <PrivateRoute allowedRoles={['ROLE_HO', 'ROLE_DA']}>
              <LeadCreate />
            </PrivateRoute>
          } />
          <Route path="/leads/:id" element={
            <PrivateRoute allowedRoles={['ROLE_HO', 'ROLE_DA']}>
              <LeadDetails />
            </PrivateRoute>
          } />
          <Route path="/chat" element={
            <PrivateRoute allowedRoles={['ROLE_HO', 'ROLE_DA']}>
              <ChatHistory />
            </PrivateRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/leads" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
