const DEFAULT_ALERTS = [
    {
        id: "alert-1",
        type: "delay",
        routeName: "Seattle to Bainbridge Island",
        message: "Sea Breeze is experiencing a minor 15-minute delay due to cargo loading operations.",
        date: "Today, 10:45 AM"
    },
    {
        id: "alert-2",
        type: "weather",
        routeName: "All Northern Routes",
        message: "Gale warnings active for Puget Sound. Minor speed reductions in place. Crossings may take 10 minutes longer.",
        date: "Today, 08:00 AM"
    }
];

export const getAllAlerts = async () => {
    const stored = localStorage.getItem("ferryflow_alerts");
    if (!stored) {
        localStorage.setItem("ferryflow_alerts", JSON.stringify(DEFAULT_ALERTS));
        return { success: true, alerts: DEFAULT_ALERTS };
    }
    return { success: true, alerts: JSON.parse(stored) };
};

export const createAlert = async (alertData) => {
    const { alerts } = await getAllAlerts();
    const newAlert = {
        id: `alert-${Date.now()}`,
        date: "Just now",
        ...alertData
    };
    const updated = [newAlert, ...alerts];
    localStorage.setItem("ferryflow_alerts", JSON.stringify(updated));
    return { success: true, message: "Announcement broadcasted successfully", alert: newAlert };
};

export const deleteAlert = async (id) => {
    const { alerts } = await getAllAlerts();
    const updated = alerts.filter(a => a.id !== id);
    localStorage.setItem("ferryflow_alerts", JSON.stringify(updated));
    return { success: true, message: "Announcement removed successfully" };
};
