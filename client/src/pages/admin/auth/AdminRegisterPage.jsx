import { useState } from "react";
import toast from "react-hot-toast";
import { adminCreateUserAPI } from "../../../services/adminService";
import { ShieldAlert, Mail, User, Lock, UserPlus } from "lucide-react";
import AdminPageHeader from "../../../components/ui/AdminPageHeader";

const AdminRegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "admin"
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

        const fieldErrors = {};
        if (!formData.name.trim() || formData.name.length < 3) {
            fieldErrors.name = "Name must be at least 3 characters";
        }
        if (!formData.email.includes("@")) {
            fieldErrors.email = "Please enter a valid email address";
        }
        if (formData.password.length < 8) {
            fieldErrors.password = "Password must be at least 8 characters";
        }
        if (formData.password !== formData.confirmPassword) {
            fieldErrors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const response = await adminCreateUserAPI({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });

            if (response.success || response.statusCode === 201) {
                toast.success("Account created successfully!");
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    role: "admin"
                });
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to create account.";
            setErrors({ server: message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <AdminPageHeader 
                title="Register Personnel" 
                subtitle="Create and authorize new administrative credentials." 
            />

            {/* Form Card Wrapper */}
            <div className="max-w-3xl bg-base-100/90 backdrop-blur-xl rounded-[28px] border border-base-300/30 shadow-[0_25px_80px_rgba(0,0,0,0.08)] p-6 md:p-8">
                <div className="flex items-center gap-4 pb-6 border-b border-base-300/40 mb-8">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] flex items-center justify-center text-white shadow-md">
                        <UserPlus size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-base-content">Account Credentials</h2>
                        <p className="text-xs text-base-content/50">Register a new Administrator or Operations Staff member.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-base-content/80 uppercase tracking-wider">Full Legal Name</label>
                        <div className="relative w-full">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                            <input
                                type="text"
                                name="name"
                                placeholder="Jane Doe"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full h-11 pl-10 pr-4 bg-base-200 border border-base-300 rounded-xl text-base-content placeholder:text-base-content/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                            />
                        </div>
                        {errors.name && <p className="text-xs font-semibold text-error mt-0.5">⚠ {errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-base-content/80 uppercase tracking-wider">Official Email Address</label>
                        <div className="relative w-full">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                            <input
                                type="email"
                                name="email"
                                placeholder="j.doe@ferryflow.gov"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full h-11 pl-10 pr-4 bg-base-200 border border-base-300 rounded-xl text-base-content placeholder:text-base-content/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                            />
                        </div>
                        {errors.email && <p className="text-xs font-semibold text-error mt-0.5">⚠ {errors.email}</p>}
                    </div>

                    {/* Role Select & Security Clearance Token */}
                    {/* Role Select */}
                    <div className="w-full space-y-1.5">
                        <label className="text-xs font-bold text-base-content/80 uppercase tracking-wider">Requested Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full h-11 px-3 bg-base-200 border border-base-300 rounded-xl text-base-content focus:border-primary focus:outline-none text-sm"
                        >
                            <option value="admin">System Administrator</option>
                            <option value="staff">Ferry Operational Staff</option>
                        </select>
                    </div>

                    {/* Passwords */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-base-content/80 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" size={16} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full h-11 pl-9 pr-3 bg-base-200 border border-base-300 rounded-xl text-base-content text-sm focus:border-primary focus:outline-none"
                                />
                            </div>
                            {errors.password && <p className="text-[11px] font-semibold text-error">⚠ {errors.password}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-base-content/80 uppercase tracking-wider">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" size={16} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full h-11 pl-9 pr-3 bg-base-200 border border-base-300 rounded-xl text-base-content text-sm focus:border-primary focus:outline-none"
                                />
                            </div>
                            {errors.confirmPassword && <p className="text-[11px] font-semibold text-error">⚠ {errors.confirmPassword}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full">
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                            className="checkbox checkbox-xs checkbox-primary"
                        />
                        <label htmlFor="showPassword" className="text-xs font-semibold text-base-content/75 cursor-pointer select-none">
                            Show Passwords
                        </label>
                    </div>

                    {/* Server Error */}
                    {errors.server && (
                        <div className="p-3.5 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-semibold w-full">
                            ⚠ {errors.server}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-base-300/40 w-full">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? "Registering..." : "Create Account"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminRegisterPage;
