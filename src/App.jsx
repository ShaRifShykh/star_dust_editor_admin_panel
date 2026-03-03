import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import AdminLogin from './components/auth/Login'; // Assuming you have a login page component

function App() {
  // Check if user is authenticated by checking token in localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('admin_token')));

  useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(Boolean(localStorage.getItem('admin_token')));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogin = useCallback(() => setIsAuthenticated(true), []);
  const handleLogout = useCallback(() => setIsAuthenticated(false), []);

  return (
    <Router>
      <Routes>
        {/* If not authenticated, redirect to login */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        
        {/* Login route */}
        <Route path="/login" element={<AdminLogin onLogin={handleLogin} />} />

        {/* Default route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
