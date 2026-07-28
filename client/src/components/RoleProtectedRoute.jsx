import React from 'react';
import { Navigate } from 'react-router';
import { usePermission } from '../hooks/usePermission';
import toast from 'react-hot-toast';

const RoleProtectedRoute = ({ children, permission }) => {
    const { can } = usePermission();

    if (!can(permission)) {
        toast.error("Access Denied: You do not have permission to view this page.", { id: "access_denied" });
        return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
};

export default RoleProtectedRoute;
