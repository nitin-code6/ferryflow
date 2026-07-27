import { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from "react-icons/fi";
import toast from "react-hot-toast";
import { sendSupportInquiry } from "../../services/supportService";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "general",
        message: ""
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await sendSupportInquiry(formData);
            if (res.success) {
                toast.success("Thank you! Your message has been sent to our harbor support operations team.");
                setFormData({ name: "", email: "", subject: "general", message: "" });
            } else {
                toast.error(res.message || "Failed to send inquiry.");
            }
        } catch (error) {
            console.error("Support submission error:", error);
            toast.error("Failed to send inquiry. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 pb-16 min-h-screen bg-transparent">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-6">
                
                {/* Left Side: Contact Information */}
                <div className="lg:col-span-5 space-y-8">
                    <div>
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                            Contact Support
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-black mt-3 tracking-tight">
                            Need Help With Your Journey?
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-3 font-semibold leading-relaxed text-sm">
                            Our support team is available to help with ferry schedules, bookings, route information, and service updates.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Email Card */}
                        <div className="flex gap-4 p-4 rounded-2xl bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 shadow-sm hover:shadow-md hover:-translate-y-1 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300">
                            <div className="p-3 bg-sky-500/10 text-sky-500 rounded-xl w-fit shrink-0">
                                <FiMail size={20} />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Email Address</h4>
                                <a href="mailto:ferryflow.team@gmail.com" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                                    ferryflow.team@gmail.com
                                </a>
                            </div>
                        </div>

                        {/* Phone Card */}
                        <div className="flex gap-4 p-4 rounded-2xl bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 shadow-sm hover:shadow-md hover:-translate-y-1 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300">
                            <div className="p-3 bg-success/10 text-success rounded-xl w-fit shrink-0">
                                <FiPhone size={20} />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Phone Support</h4>
                                <a href="tel:+9118001234567" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                                    +91 1800 123 4567
                                </a>
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="flex gap-4 p-4 rounded-2xl bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 shadow-sm hover:shadow-md hover:-translate-y-1 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300">
                            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl w-fit shrink-0">
                                <FiMapPin size={20} />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Ferry Operations Center</h4>
                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                    Kochi, Kerala, India
                                </p>
                            </div>
                        </div>

                        {/* Support Hours Card */}
                        <div className="flex gap-4 p-4 rounded-2xl bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 shadow-sm hover:shadow-md hover:-translate-y-1 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300">
                            <div className="p-3 bg-warning/10 text-warning rounded-xl w-fit shrink-0">
                                <FiClock size={20} />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Support Hours</h4>
                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                    24/7 Customer Support
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Contact Form */}
                <div className="lg:col-span-7 bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <h3 className="font-black text-xl text-slate-900 dark:text-white mb-6">Send an Inquiry</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Your Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter your full name"
                                className="input input-bordered w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 text-sm font-semibold"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Enter your email address"
                                className="input input-bordered w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 text-sm font-semibold"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Inquiry Type</label>
                            <select
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="select select-bordered w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 text-sm font-semibold"
                            >
                                <option value="general">Passenger Assistance</option>
                                <option value="booking">Booking Query</option>
                                <option value="schedule">Ferry Schedule Information</option>
                                <option value="routes">Route Information</option>
                                <option value="updates">Service Updates</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Message</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Describe your issue or query..."
                                className="textarea textarea-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 text-sm font-semibold"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn w-full h-11 border-0 text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.01] transition-all shadow-md shadow-sky-500/10"
                        >
                            <FiSend size={16} />
                            {loading ? "Sending Message..." : "Contact Support"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
