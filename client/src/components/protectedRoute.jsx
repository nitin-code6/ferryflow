import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

// Utility to read cookie value
const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return null;
};

/**
 * ProtectedRoute component
 * Props:
 *   children - the protected component tree
 *   requiredRoles (optional) - array of roles allowed to access the route (e.g., ['admin'])
 */
const ProtectedRoute = ({ children, requiredRoles }) => {
    const { loading, isAuthenticated, user } = useAuth();
    const location = useLocation();

    // Show loader while auth state is being resolved
    if (loading) {
        return <div>Loading...</div>;
    }

    // If no auth state but a JWT cookie exists, treat as authenticated (fallback)
    const hasAccessToken = !!getCookie("accessToken");
    const authenticated = isAuthenticated || hasAccessToken;

    if (!authenticated) {
        // Not logged in – redirect to login preserving intended destination
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    // Role based guard – if requiredRoles supplied, enforce role check
    if (requiredRoles && requiredRoles.length > 0) {
        const userRole = user?.role || "";
        if (!requiredRoles.includes(userRole)) {
            return <Navigate to="/403" replace />;
        }
    }

    // All checks passed – render protected content
    return children;
};

export default ProtectedRoute;