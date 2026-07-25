import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { deleteAccountAPI } from "../../services/authService";
import { FiUser, FiMail, FiCalendar, FiShield, FiSave, FiLock, FiAlertTriangle } from "react-icons/fi";
import toast from "react-hot-toast";

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [isSaving, setIsSaving] = useState(false);
    
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isChangingPass, setIsChangingPass] = useState(false);

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) {
            toast.error("Name and Email are required");
            return;
        }
        setIsSaving(true);
        setTimeout(() => {
            // Update auth context state to simulate success
            const updated = { ...user, name, email };
            setUser(updated);
            setIsSaving(false);
            toast.success("Profile updated successfully!");
        }, 1000);
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            toast.error("Please fill in all password fields");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            toast.error("New passwords do not match");
            return;
        }
        setIsChangingPass(true);
        setTimeout(() => {
            setIsChangingPass(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            toast.success("Password changed successfully!");
        }, 1000);
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.");
        if (!confirmDelete) return;

        try {
            const response = await deleteAccountAPI();
            if (response.success) {
                toast.success("Account deleted successfully");
                setUser(null);
                navigate("/register");
            } else {
                toast.error(response.message || "Failed to delete account");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete account");
        }
    };


    return (
        <div className="max-w-4xl mx-auto py-8 px-4 text-base-content space-y-8 animate-in fade-in">
            {/* Header */}
            <div>
                <p className="text-xs text-base-content/60 font-medium">Passenger Terminal</p>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-0.5">
                    Account Profile
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Overview card */}
                <div className="md:col-span-1 bg-base-100/90 dark:bg-slate-900/90 border border-base-300/30 dark:border-white/5 rounded-3xl p-6 shadow-lg backdrop-blur-xl flex flex-col items-center text-center space-y-4">
                    <div className="avatar border border-primary/20 p-1 rounded-full">
                        <div className="w-24 rounded-full">
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Passenger")}&background=0EA5E9&color=fff&size=128`}
                                alt={user?.name}
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-extrabold text-lg leading-snug">{user?.name}</h3>
                        <p className="text-xs text-base-content/50 truncate mt-0.5">{user?.email}</p>
                    </div>

                    <div className="w-full pt-4 border-t border-base-300/20 text-left text-xs font-semibold text-base-content/70 space-y-3">
                        <div className="flex items-center gap-2.5">
                            <FiShield className="text-primary shrink-0" />
                            <span>Role: <strong className="text-base-content uppercase font-bold">{user?.role || "Passenger"}</strong></span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <FiCalendar className="text-primary shrink-0" />
                            <span>Joined: <strong className="text-base-content">July 2026</strong></span>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="md:col-span-2 space-y-6">
                    {/* General profile info */}
                    <form onSubmit={handleUpdateProfile} className="bg-base-100/90 dark:bg-slate-900/90 border border-base-300/30 dark:border-white/5 rounded-3xl p-6 shadow-lg backdrop-blur-xl space-y-5">
                        <div className="flex items-center gap-3 pb-3 border-b border-base-300/20 mb-2">
                            <FiUser className="text-primary" />
                            <h3 className="font-extrabold text-base">General Information</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-[11px] font-bold uppercase text-base-content/60 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input input-bordered rounded-xl h-11 text-sm font-semibold"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[11px] font-bold uppercase text-base-content/60 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input input-bordered rounded-xl h-11 text-sm font-semibold"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="btn btn-primary btn-sm rounded-xl text-white font-bold h-10 px-5 flex gap-2 items-center"
                            >
                                {isSaving ? <span className="loading loading-spinner loading-xs" /> : <FiSave />}
                                Save Changes
                            </button>
                        </div>
                    </form>

                    {/* Change password */}
                    <form onSubmit={handleChangePassword} className="bg-base-100/90 dark:bg-slate-900/90 border border-base-300/30 dark:border-white/5 rounded-3xl p-6 shadow-lg backdrop-blur-xl space-y-5">
                        <div className="flex items-center gap-3 pb-3 border-b border-base-300/20 mb-2">
                            <FiLock className="text-primary" />
                            <h3 className="font-extrabold text-base">Change Password</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label className="text-[11px] font-bold uppercase text-base-content/60 mb-2">Current Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter current password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="input input-bordered rounded-xl h-11 text-sm font-semibold"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-[11px] font-bold uppercase text-base-content/60 mb-2">New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="input input-bordered rounded-xl h-11 text-sm font-semibold"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[11px] font-bold uppercase text-base-content/60 mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        className="input input-bordered rounded-xl h-11 text-sm font-semibold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={isChangingPass}
                                className="btn btn-primary btn-sm rounded-xl text-white font-bold h-10 px-5 flex gap-2 items-center"
                            >
                                {isChangingPass ? <span className="loading loading-spinner loading-xs" /> : <FiLock />}
                                Update Password
                            </button>
                        </div>
                    </form>

                    {/* Danger Zone */}
                    <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/50 rounded-3xl p-6 shadow-lg backdrop-blur-xl space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-red-200 dark:border-red-900/40">
                            <FiAlertTriangle className="text-red-500" size={18} />
                            <h3 className="font-extrabold text-base text-red-600 dark:text-red-400">Danger Zone</h3>
                        </div>
                        <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-semibold">
                            Permanently delete your profile account and all booking records. This action cannot be undone.
                        </p>
                        <button
                            onClick={handleDeleteAccount}
                            className="btn btn-error btn-sm text-white font-bold h-10 px-5 rounded-xl flex gap-2 items-center hover:scale-[1.01] transition-transform"
                        >
                            Delete My Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
