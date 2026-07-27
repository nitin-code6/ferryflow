import { Navigate, useLocation, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ShieldAlert } from "lucide-react";

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
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F5F9] dark:bg-[#071426] p-6 text-center text-slate-800 dark:text-white transition-all duration-300">
                    <div className="max-w-md w-full bg-white dark:bg-[#0F1D36] border border-slate-200 dark:border-sky-950/80 rounded-3xl p-8 shadow-xl space-y-6">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                            <ShieldAlert size={36} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black tracking-tight">Access Denied</h2>
                            <p className="text-xs text-slate-400 font-semibold leading-relaxed mt-2">
                                Your account role (<span className="text-rose-500 font-bold uppercase">{userRole}</span>) is not permitted to access this portal page.
                            </p>
                        </div>
                        <div className="pt-2">
                            {userRole === "admin" || userRole === "staff" ? (
                                <Link
                                    to="/admin/dashboard"
                                    className="btn btn-primary w-full rounded-xl font-bold bg-[#2563EB] hover:bg-[#2563EB]/95 border-0 text-white shadow-md shadow-[#2563EB]/10 py-3 block text-center"
                                >
                                    Go to Admin Dashboard
                                </Link>
                            ) : (
                                <Link
                                    to="/dashboard"
                                    className="btn btn-primary w-full rounded-xl font-bold bg-[#2563EB] hover:bg-[#2563EB]/95 border-0 text-white shadow-md shadow-[#2563EB]/10 py-3 block text-center"
                                >
                                    Go to Passenger Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
    }

    // All checks passed – render protected content
    return children;
};

export default ProtectedRoute;