const statusStyles = {
    available: "badge badge-success badge-outline",
    maintenance: "badge badge-warning badge-outline",
    out_of_service: "badge badge-error badge-outline",
};

const statusLabels = {
    available: "Available",
    maintenance: "Maintenance",
    out_of_service: "Out of Service",
};

const StatusBadge = ({ status }) => {
    return (
        <span className={statusStyles[status] || "badge"}>
            {statusLabels[status] || status}
        </span>
    );
};

export default StatusBadge;