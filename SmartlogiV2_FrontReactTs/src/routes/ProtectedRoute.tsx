import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated, selectUser } from '../features/auth/authSlice';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);
    const location = useLocation();

    if (!isAuthenticated) {
        
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role.name)) {
        
        
        
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
