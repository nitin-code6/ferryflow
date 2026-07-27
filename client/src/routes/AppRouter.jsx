import { BrowserRouter, Routes, Route } from "react-router";

import LandingPage from "../pages/public/LandingPage";
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";
import VerifyOtpPage from "../pages/public/VerifyOtpPage";
import ForgotPasswordPage from "../pages/public/ForgotPasswordPage";
import ResetPasswordPage from "../pages/public/ResetPasswordPage";

import AdminLoginPage from "../pages/admin/auth/AdminLoginPage";
import AdminRegisterPage from "../pages/admin/auth/AdminRegisterPage";

import ProtectedRoute from "../components/protectedRoute";

import AdminLayout from "../components/layout/AdminLayout";
import PassengerLayout from "../components/layout/PassengerLayout";

import DashboardPage from "../pages/admin/dashboard/DashboardPage";

import FerryListPage from "../pages/admin/ferries/FerryListPage";
import CreateFerryPage from "../pages/admin/ferries/CreateFerryPage";
import EditFerryPage from "../pages/admin/ferries/EditFerryPage";
import FerryDetailsPage from "../pages/admin/ferries/FerryDetailsPage";

import RouteListPage from "../pages/admin/routes/RouteListPage";
import CreateRoutePage from "../pages/admin/routes/CreateRoutePage";
import EditRoutePage from "../pages/admin/routes/EditRoutePage";
import RouteDetailsPage from "../pages/admin/routes/RouteDetailsPage";

import ScheduleListPage from "../pages/admin/schedules/ScheduleListPage";
import CreateSchedulePage from "../pages/admin/schedules/CreateSchedulePage";
import EditSchedulePage from "../pages/admin/schedules/EditSchedulePage";
import ScheduleDetailsPage from "../pages/admin/schedules/ScheduleDetailsPage";

import BookingManagementPage from "../pages/admin/bookings/BookingManagementPage";
import AlertManagementPage from "../pages/admin/alerts/AlertManagementPage";
import SettingsPage from "../pages/admin/SettingsPage";

import PassengerDashboardPage from "../pages/passenger/PassengerDashboardPage";
import SearchResultsPage from "../pages/passenger/SearchResultsPage";
import BookingPage from "../pages/passenger/BookingPage";
import PaymentPage from "../pages/passenger/PaymentPage";
import PaymentSuccessPage from "../pages/passenger/PaymentSuccessPage";
import MyBookingsPage from "../pages/passenger/MyBookingsPage";
import ProfilePage from "../pages/passenger/ProfilePage";

import FerriesPage from "../pages/public/FerriesPage";
import RoutesPage from "../pages/public/RoutesPage";
import ContactPage from "../pages/public/ContactPage";
import PrivacyPage from "../pages/public/PrivacyPage";
import TermsPage from "../pages/public/TermsPage";
import AccessibilityPage from "../pages/public/AccessibilityPage";

import PublicLayout from "../components/layout/PublicLayout";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/verify-otp" element={<VerifyOtpPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/search-results" element={<SearchResultsPage />} />
                    <Route path="/ferries" element={<FerriesPage />} />
                    <Route path="/routes" element={<RoutesPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/accessibility" element={<AccessibilityPage />} />
                </Route>

                {/* Separate Admin Public Auth Routes (Without Public Navbar) */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Passenger Protected Routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute requiredRoles={["citizen", "tourist"]}>
                            <PassengerLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="dashboard" element={<PassengerDashboardPage />} />
                    <Route path="booking" element={<BookingPage />} />
                    <Route path="payment" element={<PaymentPage />} />
                    <Route path="payment-success" element={<PaymentSuccessPage />} />
                    <Route path="my-bookings" element={<MyBookingsPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                {/* Admin Protected Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requiredRoles={["admin", "staff"]}>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DashboardPage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="register" element={<AdminRegisterPage />} />

                    {/* Ferry Management */}
                    <Route path="ferries" element={<FerryListPage />} />
                    <Route path="ferries/new" element={<CreateFerryPage />} />
                    <Route path="ferries/:id" element={<FerryDetailsPage />} />
                    <Route
                        path="ferries/edit/:id"
                        element={<EditFerryPage />}
                    />

                    {/* Route Management */}
                    <Route path="routes" element={<RouteListPage />} />
                    <Route path="routes/create" element={<CreateRoutePage />} />
                    <Route path="routes/:id" element={<RouteDetailsPage />} />
                    <Route path="routes/:id/edit" element={<EditRoutePage />} />

                    {/* Schedule Management */}
                    <Route path="schedules" element={<ScheduleListPage />} />
                    <Route path="schedules/create" element={<CreateSchedulePage />} />
                    <Route path="schedules/:id" element={<ScheduleDetailsPage />} />
                    <Route path="schedules/:id/edit" element={<EditSchedulePage />} />

                    {/* Booking Management */}
                    <Route path="bookings" element={<BookingManagementPage />} />

                    {/* Alert Management */}
                    <Route path="alerts" element={<AlertManagementPage />} />

                    {/* Settings Page */}
                    <Route path="settings" element={<SettingsPage />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

