import { FiSettings, FiSliders, FiActivity, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router";

const SettingsPage = () => {
    return (
        <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center gap-4 text-left">
                <Link
                    to="/admin/dashboard"
                    className="btn btn-ghost btn-circle bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 shadow-sm transition-all"
                    title="Back to dashboard"
                >
                    <FiArrowLeft size={20} />
                </Link>
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Harbor Command Center</p>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
                        Console Settings
                    </h1>
                </div>
            </div>

            {/* Coming Soon Panel */}
            <div className="bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 rounded-3xl p-10 sm:p-16 text-center shadow-xl space-y-6 flex flex-col items-center max-w-2xl mx-auto relative overflow-hidden">
                {/* Visual Glow */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="h-20 w-20 bg-primary/10 dark:bg-primary/5 text-primary dark:text-[#00A8FF] rounded-2xl flex items-center justify-center text-4xl shadow-inner animate-pulse shrink-0">
                    <FiSettings />
                </div>
                
                <div className="space-y-3">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                        Feature Pipeline
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        Settings & Preferences
                    </h2>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-450 leading-relaxed max-w-md mx-auto">
                        We are currently optimizing the harbor console configurations. Soon, you will be able to customize terminal connections, dispatch rules, staff roles, and system integrations here.
                    </p>
                </div>

                <div className="w-full pt-8 border-t border-slate-200/60 dark:border-sky-950/40 grid grid-cols-2 gap-4 max-w-sm text-left text-xs font-bold text-slate-450 dark:text-slate-550">
                    <div className="flex items-center gap-2">
                        <FiSliders className="text-primary shrink-0" size={14} />
                        <span>Dispatch Rules</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FiActivity className="text-primary shrink-0" size={14} />
                        <span>Live Analytics</span>
                    </div>
                </div>

                <Link
                    to="/admin/dashboard"
                    className="btn btn-primary text-white border-0 bg-gradient-to-r from-blue-600 to-sky-500 rounded-xl px-8 h-11 font-bold text-sm shadow-md shadow-blue-500/10 hover:scale-[1.01] hover:shadow-lg transition-all"
                >
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default SettingsPage;
