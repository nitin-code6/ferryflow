import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { registerSchema } from "../../Validations/authValidation";
import { registerAPI, googleLoginAPI } from "../../services/authService";
import AuthLayout from "../../components/layout/AuthLayout";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const RegisterPage = () => {
    const navigate = useNavigate();
    const { checkAuth, isAuthenticated, user } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
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

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const result = await googleLoginAPI(credentialResponse.credential);
            if (result.success) {
                await checkAuth();
                toast.success("Welcome to FerryFlow!");
                // Let a similar logic to LoginPage or a top-level route guard handle the redirect, or manually navigate
                navigate("/dashboard");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Google login failed");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = registerSchema.safeParse({
            name: formData.name,
            email: formData.email,
            password: formData.password
        });

        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            if (formData.password !== formData.confirmPassword) {
                fieldErrors.confirmPassword = "Passwords do not match";
            }
            setErrors(fieldErrors);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrors({ confirmPassword: "Passwords do not match" });
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            await registerAPI({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            navigate("/verify-otp", {
                state: {
                    email: formData.email,
                    purpose: "verify-email"
                }
            });
        } catch (error) {
            const message = !error.response
                ? "Unable to connect to server. Please try again."
                : error.response?.data?.message || "Registration failed";
            setErrors({ server: message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="bg-white dark:bg-[#0F1D36] border border-slate-200 dark:border-sky-950/80 shadow-[0_25px_80px_rgba(0,0,0,0.18)] overflow-hidden">
                <div className="p-6 lg:p-8">
                    {/* Heading */}
                    <div className="text-center">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                            Passenger Portal
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                            Create Your <span className="bg-gradient-to-r from-[#2563EB] to-[#00A8FF] bg-clip-text text-transparent">Account</span>
                        </h2>
                        <p className="mt-2 text-[15px] font-medium text-slate-500 dark:text-slate-400">
                            Create your passenger account to book tickets and track ferries in real time.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block mb-2 font-semibold text-[#071426]/80 dark:text-slate-200">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input input-bordered w-full h-12 rounded-xl bg-white dark:bg-[#071426] text-[#071426] dark:text-[#F8FAFC] placeholder:text-slate-400 border-slate-200 dark:border-sky-950 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all"
                            />
                            {errors.name && <p className="mt-1 text-sm font-medium text-red-500">⚠ {errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-2 font-semibold text-[#071426]/80 dark:text-slate-200">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={handleChange}
                                className="input input-bordered w-full h-12 rounded-xl bg-white dark:bg-[#071426] text-[#071426] dark:text-[#F8FAFC] placeholder:text-slate-400 border-slate-200 dark:border-sky-950 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all"
                            />
                            {errors.email && <p className="mt-1 text-sm font-medium text-red-500">⚠ {errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block mb-2 font-semibold text-[#071426]/80 dark:text-slate-200">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input input-bordered w-full h-12 rounded-xl bg-white dark:bg-[#071426] text-[#071426] dark:text-[#F8FAFC] placeholder:text-slate-400 pr-20 border-slate-200 dark:border-sky-950 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#2563EB] dark:text-[#00A8FF]"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-sm font-medium text-red-500">⚠ {errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block mb-2 font-semibold text-[#071426]/80 dark:text-slate-200">Confirm Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Re-enter your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="input input-bordered w-full h-12 rounded-xl bg-white dark:bg-[#071426] text-[#071426] dark:text-[#F8FAFC] placeholder:text-slate-400 border-slate-200 dark:border-sky-950 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all"
                            />
                            {errors.confirmPassword && <p className="mt-1 text-sm font-medium text-red-500">⚠ {errors.confirmPassword}</p>}
                        </div>

                        {/* Server Error */}
                        {errors.server && (
                            <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-500/10 px-4 py-3">
                                <p className="text-sm font-medium text-red-500">⚠ {errors.server}</p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn w-full h-12 border-0 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#00A8FF] text-white hover:scale-[1.01] transition-all duration-300 font-bold shadow-lg shadow-[#2563EB]/15"
                        >
                            {loading ? "Creating Passenger Account..." : "Create Passenger Account"}
                        </button>

                        {/* Login Link */}
                        <div className="text-center pt-1">
                            <p className="text-slate-550 dark:text-slate-400">
                                Already have an account?
                                <Link to="/login" className="ml-2 font-semibold text-[#0EA5E9] hover:text-[#2563EB] transition-colors">
                                    Login here
                                </Link>
                            </p>
                        </div>

                        {/* Social Registration */}
                        <div className="pt-3">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-px flex-1 bg-slate-600/40" />
                                <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Or continue with</span>
                                <div className="h-px flex-1 bg-slate-600/40" />
                            </div>
                            <div className="flex justify-center">
                                <GoogleLogin
                                    theme="filled_black"
                                    size="large"
                                    text="signup_with"
                                    shape="pill"
                                    width="280"
                                    onSuccess={handleGoogleLogin}
                                    onError={() => toast.error("Google signup failed")}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthLayout>
    );
};

export default RegisterPage;
