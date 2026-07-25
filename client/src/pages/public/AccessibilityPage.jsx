const AccessibilityPage = () => {
    return (
        <div className="pt-28 pb-16 bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 min-h-screen">
            <div className="max-w-4xl mx-auto px-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                    Accessibility Statement
                </span>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    Accessibility Details
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-semibold leading-relaxed text-sm">
                    FerryFlow is dedicated to ensuring that digital transit booking platforms and harbors are accessible for all passenger commuters.
                </p>
                <div className="space-y-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-4">1. Web Accessibility</h3>
                    <p className="leading-relaxed">
                        We aim for compliance with WCAG 2.1 Level AA parameters, featuring high-contrast theme toggles, clean font styling, and descriptive buttons for screen-readers.
                    </p>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-4">2. Fleet Accessibility</h3>
                    <p className="leading-relaxed">
                        All active catamaran vessels are optimized for smooth wheelchair boarding transitions and feature tactile deck markers.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AccessibilityPage;
