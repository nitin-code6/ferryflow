import { FiClock, FiAlertTriangle, FiAlertCircle, FiTrendingDown, FiWind } from "react-icons/fi";

const alertStyles = {
    delay: {
        border: "border-amber-500/20",
        bg: "bg-amber-500/5",
        icon: <FiClock className="text-amber-500" size={20} />,
        labelColor: "text-amber-600 dark:text-amber-400",
        labelText: "Delay Alert",
    },
    cancellation: {
        border: "border-red-500/20",
        bg: "bg-red-500/5",
        icon: <FiAlertCircle className="text-red-500" size={20} />,
        labelColor: "text-red-600 dark:text-red-400",
        labelText: "Service Cancellation",
    },
    weather: {
        border: "border-sky-500/20",
        bg: "bg-sky-500/5",
        icon: <FiWind className="text-sky-500" size={20} />,
        labelColor: "text-sky-600 dark:text-sky-400",
        labelText: "Weather Warning",
    },
    maintenance: {
        border: "border-purple-500/20",
        bg: "bg-purple-500/5",
        icon: <FiAlertTriangle className="text-purple-500" size={20} />,
        labelColor: "text-purple-600 dark:text-purple-400",
        labelText: "Vessel Maintenance",
    },
};

const AlertCard = ({ type = "delay", message, date, routeName }) => {
    const config = alertStyles[type] || alertStyles.delay;

    return (
        <div className={`border ${config.border} ${config.bg} rounded-2xl p-4 flex gap-4 transition-all hover:scale-[1.01]`}>
            <div className="shrink-0 mt-0.5">{config.icon}</div>
            <div className="space-y-1 flex-1">
                <div className="flex justify-between items-center">
                    <span className={`text-xs font-black uppercase tracking-wider ${config.labelColor}`}>
                        {config.labelText}
                    </span>
                    {date && (
                        <span className="text-[10px] text-base-content/40 font-semibold uppercase">{date}</span>
                    )}
                </div>
                {routeName && (
                    <p className="text-xs font-bold text-base-content/70">Route: {routeName}</p>
                )}
                <p className="text-sm font-medium text-base-content/90 leading-relaxed mt-1">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default AlertCard;
