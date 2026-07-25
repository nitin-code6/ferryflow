const statusStyles = {
    available: "badge badge-success badge-outline",
    maintenance: "badge badge-warning badge-outline",
    out_of_service: "badge badge-error badge-outline",
    active: "badge badge-success badge-outline",
    inactive: "badge badge-error badge-outline",
    scheduled: "badge badge-info badge-outline",
    boarding: "badge badge-warning badge-outline",
    departed: "badge badge-primary badge-outline",
    completed: "badge badge-success badge-outline",
    cancelled: "badge badge-error badge-outline",
    // Booking-specific statuses
    pending: "badge badge-warning badge-outline",
    pending_payment: "badge badge-warning badge-outline",
    confirmed: "badge badge-success",
    paid: "badge badge-success badge-outline",
    failed: "badge badge-error badge-outline",
    refunded: "badge badge-neutral badge-outline",
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
    // Booking-specific
    pending: "Pending",
    pending_payment: "Awaiting Payment",
    confirmed: "Confirmed",
    paid: "Paid",
    failed: "Failed",
    refunded: "Refunded",
};


const StatusBadge = ({ status }) => {
    return (
        <span className={statusStyles[status] || "badge"}>
            {statusLabels[status] || status}
        </span>
    );
};

export default StatusBadge;