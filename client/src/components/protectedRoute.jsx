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
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-100">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!isAuthenticated) {
        // If requesting admin route, redirect to admin login; otherwise passenger login
        const isAdminRoute = requiredRoles?.includes("admin") || requiredRoles?.includes("staff");
        const loginPath = isAdminRoute ? "/admin/login" : "/login";
        return (
            <Navigate
                to={loginPath}
                replace
                state={{ from: location }}
            />
        );
    }

    // Role based guard
    if (requiredRoles && requiredRoles.length > 0) {
        const userRole = user?.role || "citizen";
        if (!requiredRoles.includes(userRole)) {
            // Redirect user to their appropriate portal dashboard
            if (userRole === "admin" || userRole === "staff") {
                return <Navigate to="/admin/dashboard" replace />;
            }
            return <Navigate to="/dashboard" replace />;
        }
    }

    // All checks passed – render protected content
    return children;
};

export default ProtectedRoute;