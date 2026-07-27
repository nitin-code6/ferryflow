import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import toast from "react-hot-toast";
import { loginSchema } from "../../../Validations/authValidation";
import { loginAPI, logoutAPI, getCurrentUser } from "../../../services/authService";
import { useAuth } from "../../../context/AuthContext";
import { ShieldCheck, Lock, Mail, ArrowRight } from "lucide-react";
import logo from "../../../assets/ferry-logo2.png";

const AdminLoginPage = () => {
    const { checkAuth, isAuthenticated, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            if (user?.role === "admin" || user?.role === "staff") {
                const target = location.state?.from?.pathname
                    ? (location.state.from.pathname + (location.state.from.search || ""))
                    : "/admin";
                navigate(target, { replace: true });
            } else {
                navigate("/dashboard", { replace: true });
            }
        }
    }, [isAuthenticated, user, location, navigate]);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors((prev) => ({
            ...prev,
            [e.target.name]: "",
            server: ""
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = loginSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            await loginAPI(formData);
            
            // Validate the user's role before granting admin access
            const profileRes = await getCurrentUser();
            const loggedInUser = profileRes.user || profileRes;
            
            if (loggedInUser?.role !== "admin" && loggedInUser?.role !== "staff") {
                await logoutAPI();
                setErrors({ server: "Unauthorized access. This portal is reserved for administrative users only." });
                toast.error("Unauthorized access. Administrative portal only.");
                return;
            }

            await checkAuth();
            toast.success("Admin Authorization Granted");
            navigate("/admin", { replace: true });
        } catch (error) {
            const message = error.response?.data?.message || "Admin login failed";
            setErrors({ server: message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
            {/* Background glowing effects */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10 space-y-6">
                {/* Brand / Title */}
                <div className="text-center space-y-3">
                    <Link to="/" className="inline-flex items-center gap-2 mb-2">
                        <img src={logo} alt="FerryFlow" className="h-10 w-auto" />
                        <span className="text-2xl font-black tracking-tight text-white">
                            Ferry<span className="text-sky-400">Flow</span>
                        </span>
                    </Link>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider">
                        <ShieldCheck size={14} /> Administration & Control Portal
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white">System Admin Login</h1>
                    <p className="text-xs text-slate-400">Sign in with official credentials to access operational controls.</p>
                </div>

                {/* Main Card */}
                <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Official Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="admin@ferryflow.gov"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full h-12 pl-10 pr-4 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/15 text-sm transition-all"
                                />
                            </div>
                            {errors.email && <p className="text-xs font-semibold text-rose-400 mt-1">⚠ {errors.email}</p>}
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full h-12 pl-10 pr-16 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/15 text-sm transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-sky-400 font-semibold hover:text-sky-300"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs font-semibold text-rose-400 mt-1">⚠ {errors.password}</p>}
                        </div>

                        {/* Server Error Message */}
                        {errors.server && (
                            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                                ⚠ {errors.server}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-500/20 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? "Verifying Authorization..." : "Authenticate Admin Access"} <ArrowRight size={16} />
                        </button>
                    </form>

                    <div className="pt-4 border-t border-slate-800/80 text-center">
                        <p className="text-[11px] text-slate-500">
                            Passenger? <Link to="/login" className="text-slate-300 hover:underline">Return to Citizen Portal</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
