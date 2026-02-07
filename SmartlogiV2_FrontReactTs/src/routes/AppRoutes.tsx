import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '../features/home/pages/HomePage';
import VerificationPage from '../features/auth/pages/VerificationPage';

import ClientRegisterPage from '../features/auth/pages/ClientRegisterPage';
import StaffLoginPage from '../features/auth/pages/StaffLoginPage';
import AdminLoginPage from '../features/auth/pages/AdminLoginPage';
import ClientDashboard from '../features/dashboard/pages/ClientDashboard';
import DashboardLayout from '../components/layout/DashboardLayout';

import AdminDashboard from '../features/admin/pages/AdminDashboard';
import ManagerDashboard from '../features/dashboard/pages/ManagerDashboard';
import LivreurDashboard from '../features/dashboard/pages/LivreurDashboard';

// Placeholder components - Replace with actual features later


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
                 <Route element={<ProtectedRoute allowedRoles={['CLIENT']} />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<ClientDashboard />} />
                    </Route>
                </Route>
                
                {/* Manager Routes */}
                 <Route element={<ProtectedRoute allowedRoles={['MANAGER']} />}>
                    <Route path="/manager-dashboard" element={<ManagerDashboard />} />
                </Route>

                {/* Driver Routes */}
                 <Route element={<ProtectedRoute allowedRoles={['LIVREUR']} />}>
                    <Route path="/livreur-dashboard" element={<LivreurDashboard />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                </Route>

                {/* Catch All */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
