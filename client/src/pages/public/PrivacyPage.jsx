const PrivacyPage = () => {
    return (
        <div className="pt-28 pb-16 min-h-screen bg-transparent">
            <div className="max-w-4xl mx-auto px-6 bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                    Privacy Policy
                </span>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    Privacy Statement
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-semibold leading-relaxed text-sm">
                    FerryFlow is committed to protecting your privacy. This policy outlines how we handle personal data, location dispatch data, and passenger ticket transaction information.
                </p>
                <div className="space-y-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-4">1. Information We Collect</h3>
                    <p className="leading-relaxed">
                        We collect your name, email address, password hash, and transaction payloads during user signup and Stripe checkouts to manage ticket confirmation.
                    </p>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-4">2. Dispatch Data</h3>
                    <p className="leading-relaxed">
                        We utilize live vessel tracking and schedule alerts to coordinate boarding services, which do not monitor personal travel locations.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;
