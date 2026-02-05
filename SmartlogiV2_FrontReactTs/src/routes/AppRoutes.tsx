import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '../features/home/pages/HomePage';
import VerificationPage from '../features/auth/pages/VerificationPage';

import ClientRegisterPage from '../features/auth/pages/ClientRegisterPage';
import StaffLoginPage from '../features/auth/pages/StaffLoginPage';
import AdminLoginPage from '../features/auth/pages/AdminLoginPage';
import DashboardStats from '../features/dashboard/components/DashboardStats';
import ParcelList from '../features/parcels/components/ParcelList';
import UserProfile from '../features/users/components/UserProfile';

// Placeholder components - Replace with actual features later
const Dashboard = () => (
    <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <DashboardStats />
    </div>
);

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<HomePage />} />
                <Route path="/register" element={<ClientRegisterPage />} />
                <Route path="/verify-email" element={<VerificationPage />} />
                <Route path="/staff-login" element={<StaffLoginPage />} />
                <Route path="/admin-login" element={<AdminLoginPage />} />

                {/* Protected Routes */}
                 <Route element={<ProtectedRoute allowedRoles={['CLINET']} />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/parcels" element={<ParcelList />} />
                    <Route path="/profile" element={<UserProfile />} />
                </Route>
                
                {/* Manager Routes */}
                 <Route element={<ProtectedRoute allowedRoles={['MANAGER']} />}>
                    <Route path="/manager-dashboard" element={<div className="p-4 text-white">Manager Dashboard Placeholder</div>} />
                </Route>

                {/* Driver Routes */}
                 <Route element={<ProtectedRoute allowedRoles={['LIVREUR']} />}>
                    <Route path="/livreur-dashboard" element={<div className="p-4 text-white">Livreur Dashboard Placeholder</div>} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                    <Route path="/admin-dashboard" element={<div className="p-4 text-white">Admin Dashboard Placeholder</div>} />
                </Route>

                {/* Catch All */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
