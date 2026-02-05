import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
    // TODO: Connect to actual auth state
    const isAuthenticated = !!localStorage.getItem('token') || true; // Temporary mock

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
