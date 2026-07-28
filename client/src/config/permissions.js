export const rolePermissions = {
    admin: {
        ferryView: true,
        ferryManagement: true,
        routeView: true,
        routeManagement: true,
        scheduleView: true,
        scheduleManagement: true,
        bookingManagement: true,
        userManagement: true,
        alerts: true,
        inquiries: true,
        dashboardAnalytics: true
    },
    staff: {
        ferryView: true,
        ferryManagement: false,
        routeView: true,
        routeManagement: false,
        scheduleView: true,
        scheduleManagement: false,
        bookingManagement: false,
        userManagement: false,
        alerts: true,
        inquiries: true,
        dashboardAnalytics: false // staff gets a limited dashboard
    },
    citizen: {
        ferryView: false,
        ferryManagement: false,
        routeView: false,
        routeManagement: false,
        scheduleView: false,
        scheduleManagement: false,
        bookingManagement: false,
        userManagement: false,
        alerts: false,
        inquiries: false,
        dashboardAnalytics: false
    },
    tourist: {
        ferryView: false,
        ferryManagement: false,
        routeView: false,
        routeManagement: false,
        scheduleView: false,
        scheduleManagement: false,
        bookingManagement: false,
        userManagement: false,
        alerts: false,
        inquiries: false,
        dashboardAnalytics: false
    }
};
