import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Placeholder components - Replace with actual features later
const Login = () => <div className="p-4">Login Page</div>;
const Dashboard = () => <div className="p-4">Dashboard</div>;
const Parcels = () => <div className="p-4">Parcels</div>;

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
             <Route path="/" element={<Navigate to="/dashboard" replace />} />
             <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/parcels" element={<Parcels />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
