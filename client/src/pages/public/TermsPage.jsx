const TermsPage = () => {
    return (
        <div className="pt-28 pb-16 bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 min-h-screen">
            <div className="max-w-4xl mx-auto px-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                    Terms of Service
                </span>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    Terms & Conditions
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-semibold leading-relaxed text-sm">
                    Please read these terms carefully before utilizing the FerryFlow booking network or harbor operations scheduling dashboard.
                </p>
                <div className="space-y-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-4">1. Passenger Tickets</h3>
                    <p className="leading-relaxed">
                        Tickets booked through this platform represent valid boarding authorization clearance for the specific scheduled vessel crossing.
                    </p>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-4">2. Cancellations</h3>
                    <p className="leading-relaxed">
                        Voyages are subject to cancellations or modifications based on weather alerts, mechanical maintenance, or harbor operations control directives.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
