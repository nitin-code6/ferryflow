import { Link } from "react-router";
import { Ship, Map, Calendar, Ticket, Bell, Users, Settings, ArrowRight, ShieldCheck, TrendingUp } from "lucide-react";
import StatsCard from "../../../components/ui/StatsCard";

const DashboardPage = () => {
    // Current date formatted beautifully
    const formattedDate = new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header section */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-base-content">
                        Overview
                    </h1>
                    <p className="text-sm text-base-content/60 font-medium">
                        {formattedDate}
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-success/10 text-success border border-success/20 w-fit">
                    <ShieldCheck size={14} />
                    System Active & Secure
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Active Fleet"
                    value="12 Ferries"
                    icon={<Ship size={24} />}
                    color="bg-primary"
                />
                <StatsCard
                    title="Configured Routes"
                    value="8 Routes"
                    icon={<Map size={24} />}
                    color="bg-success"
                />
                <StatsCard
                    title="Total Bookings"
                    value="1,429"
                    icon={<Ticket size={24} />}
                    color="bg-warning"
                />
                <StatsCard
                    title="Active Alerts"
                    value="3 Alerts"
                    icon={<Bell size={24} />}
                    color="bg-error"
                />
            </div>

            {/* Management Modules Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Fleet Card */}
                <div className="bg-base-100/90 backdrop-blur-xl rounded-[28px] border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.18)] p-6 md:p-8 flex flex-col justify-between hover:scale-[1.01] transition-all duration-300">
                    <div>
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] flex items-center justify-center text-white mb-6 shadow-md">
                            <Ship size={22} />
                        </div>
                        <h2 className="text-xl font-bold text-base-content">Fleet Operations</h2>
                        <p className="text-sm text-base-content/60 mt-2 leading-relaxed">
                            Monitor vessel capacities, registration details, and real-time operational status. Perform additions, edits, or deallocations easily.
                        </p>
                    </div>
                    <div className="mt-8 pt-4 border-t border-base-300/30 flex items-center justify-between">
                        <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                            <TrendingUp size={14} /> 94% Fleet Efficiency
                        </span>
                        <Link
                            to="/admin/ferries"
                            className="btn border-0 rounded-xl px-5 text-white bg-gradient-to-r from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] hover:shadow-lg transition-all duration-300 flex items-center gap-1.5 h-11"
                        >
                            Manage Ferries <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* Routes & Transit */}
                <div className="bg-base-100/90 backdrop-blur-xl rounded-[28px] border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.18)] p-6 md:p-8 flex flex-col justify-between hover:scale-[1.01] transition-all duration-300">
                    <div>
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] flex items-center justify-center text-white mb-6 shadow-md">
                            <Map size={22} />
                        </div>
                        <h2 className="text-xl font-bold text-base-content">Routes & Terminals</h2>
                        <p className="text-sm text-base-content/60 mt-2 leading-relaxed">
                            Configure geographical paths, harbor details, port stops, and passenger transit lanes. Analyze navigation route timelines.
                        </p>
                    </div>
                    <div className="mt-8 pt-4 border-t border-base-300/30 flex items-center justify-between">
                        <span className="text-xs font-semibold text-success">
                            All routes online
                        </span>
                        <Link
                            to="/admin/routes"
                            className="btn border-0 rounded-xl px-5 text-white bg-gradient-to-r from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] hover:shadow-lg transition-all duration-300 flex items-center gap-1.5 h-11"
                        >
                            Configure Routes <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* Schedules & Bookings */}
                <div className="bg-base-100/90 backdrop-blur-xl rounded-[28px] border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.18)] p-6 md:p-8 flex flex-col justify-between hover:scale-[1.01] transition-all duration-300">
                    <div>
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] flex items-center justify-center text-white mb-6 shadow-md">
                            <Calendar size={22} />
                        </div>
                        <h2 className="text-xl font-bold text-base-content">Schedules & Trips</h2>
                        <p className="text-sm text-base-content/60 mt-2 leading-relaxed">
                            Set vessel timing structures, frequency intervals, seasonal pricing rules, and track ticket bookings mapped to specific departures.
                        </p>
                    </div>
                    <div className="mt-8 pt-4 border-t border-base-300/30 flex items-center justify-between">
                        <span className="text-xs font-semibold text-base-content/60">
                            12 trips scheduled today
                        </span>
                        <Link
                            to="/admin/schedules"
                            className="btn border-0 rounded-xl px-5 text-white bg-gradient-to-r from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] hover:shadow-lg transition-all duration-300 flex items-center gap-1.5 h-11"
                        >
                            Set Schedules <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* System Alerts & Users */}
                <div className="bg-base-100/90 backdrop-blur-xl rounded-[28px] border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.18)] p-6 md:p-8 flex flex-col justify-between hover:scale-[1.01] transition-all duration-300">
                    <div>
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] flex items-center justify-center text-white mb-6 shadow-md">
                            <Bell size={22} />
                        </div>
                        <h2 className="text-xl font-bold text-base-content">System Security & Alerts</h2>
                        <p className="text-sm text-base-content/60 mt-2 leading-relaxed">
                            Broadcast delay warnings, weather notifications, harbor blocks, or inspect user accounts and configurations.
                        </p>
                    </div>
                    <div className="mt-8 pt-4 border-t border-base-300/30 flex items-center justify-between">
                        <span className="text-xs font-semibold text-rose-500">
                            No critical delays
                        </span>
                        <Link
                            to="/admin/alerts"
                            className="btn border-0 rounded-xl px-5 text-white bg-gradient-to-r from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] hover:shadow-lg transition-all duration-300 flex items-center gap-1.5 h-11"
                        >
                            Broadcast Alert <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;