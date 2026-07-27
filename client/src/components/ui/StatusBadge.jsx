const statusStyles = {
    // Active / Available / Success
    available: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    active: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    completed: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    confirmed: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    paid: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",

    // Pending / Warnings / Schedules
    maintenance: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    boarding: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    pending: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    pending_payment: "bg-amber-500/10 text-amber-500 border border-amber-500/20",

    // Errors / Offline / Cancelled
    out_of_service: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
    inactive: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
    cancelled: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
    failed: "bg-rose-500/10 text-rose-500 border border-rose-500/20",

    // Informational / Transitions
    scheduled: "bg-sky-500/10 text-sky-500 border border-sky-500/20",
    departed: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
    refunded: "bg-slate-500/10 text-slate-500 border border-slate-500/20",
};

const statusLabels = {
    available: "Available",
    maintenance: "Maintenance",
    out_of_service: "Out of Service",
    active: "Active",
    inactive: "Inactive",
    scheduled: "Scheduled",
    boarding: "Boarding",
    departed: "Departed",
    completed: "Completed",
    cancelled: "Cancelled",
    pending: "Pending",
    pending_payment: "Awaiting Payment",
    confirmed: "Confirmed",
    paid: "Paid",
    failed: "Failed",
    refunded: "Refunded",
};

const StatusBadge = ({ status }) => {
    const key = (status || "").toLowerCase().trim();
    const style = statusStyles[key] || "bg-slate-500/10 text-slate-500 border border-slate-500/20";
    const label = statusLabels[key] || (status || "").replace(/_/g, " ");
    return (
        <span className={`inline-flex items-center justify-center font-bold tracking-wider uppercase text-[10px] px-2.5 py-1 rounded-full w-fit ${style}`}>
            {label}
        </span>
    );
};

export default StatusBadge;