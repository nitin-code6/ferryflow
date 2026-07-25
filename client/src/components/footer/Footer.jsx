import { Link } from "react-router";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import logo from "../../assets/ferry-logo2.png";

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 py-12 md:py-16 px-6 relative overflow-hidden">
            {/* Ambient glows inside footer */}
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 relative z-10">
                {/* Column 1: Brand & Logo */}
                <div className="lg:col-span-4 space-y-4">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="FerryFlow" className="h-9 w-auto" />
                        <span className="text-xl font-black text-white">
                            Ferry<span className="text-sky-400">Flow</span>
                        </span>
                    </Link>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                        Real-Time Ferry Operations & Passenger Management System. Dedicated to providing smooth journeys across Kochi's waterways.
                    </p>
                </div>

                {/* Column 2: Quick Links */}
                <div className="lg:col-span-2 space-y-3">
                    <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Quick Links</h4>
                    <ul className="space-y-2 text-sm font-semibold">
                        <li>
                            <Link to="/" className="hover:text-sky-400 transition-colors">Home</Link>
                        </li>
                        <li>
                            <Link to="/ferries" className="hover:text-sky-400 transition-colors">Ferry & Transportation</Link>
                        </li>
                        <li>
                            <Link to="/routes" className="hover:text-sky-400 transition-colors">Routes</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-sky-400 transition-colors">Contact</Link>
                        </li>
                    </ul>
                </div>

                {/* Column 3: Services */}
                <div className="lg:col-span-3 space-y-3">
                    <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Services</h4>
                    <ul className="space-y-2 text-sm font-semibold">
                        <li>
                            <Link to="/ferries" className="hover:text-sky-400 transition-colors">Ferry Schedules</Link>
                        </li>
                        <li>
                            <Link to="/routes" className="hover:text-sky-400 transition-colors">Route Information</Link>
                        </li>
                        <li>
                            <Link to="/login" className="hover:text-sky-400 transition-colors">Booking Portal</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-sky-400 transition-colors">Alerts & Updates</Link>
                        </li>
                    </ul>
                </div>

                {/* Column 4: Contact */}
                <div className="lg:col-span-3 space-y-3">
                    <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Contact Info</h4>
                    <ul className="space-y-2.5 text-sm font-semibold text-slate-400">
                        <li className="flex items-center gap-2">
                            <FiMail className="text-sky-400 shrink-0" size={16} />
                            <a href="mailto:ferryflow.team@gmail.com" className="hover:text-sky-400 transition-colors truncate">
                                ferryflow.team@gmail.com
                            </a>
                        </li>
                        <li className="flex items-center gap-2">
                            <FiPhone className="text-sky-400 shrink-0" size={16} />
                            <a href="tel:+9118001234567" className="hover:text-sky-400 transition-colors">
                                +91 1800 123 4567
                            </a>
                        </li>
                        <li className="flex items-start gap-2">
                            <FiMapPin className="text-sky-400 mt-0.5 shrink-0" size={16} />
                            <span>
                                Ferry Operations Center,<br />
                                Kochi, Kerala, India
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Copyright & Footer Policy Links */}
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500 relative z-10">
                <p>© 2026 FerryFlow. All Rights Reserved.</p>
                <div className="flex gap-5">
                    <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
                    <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
                    <Link to="/accessibility" className="hover:text-slate-400 transition-colors">Accessibility Statement</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
