import { BrowserRouter, Routes, Route } from "react-router";

import LandingPage from "../pages/public/LandingPage";
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";
import VerifyOtpPage from "../pages/public/VerifyOtpPage";
import ForgotPasswordPage from "../pages/public/ForgotPasswordPage";
import ResetPasswordPage from "../pages/public/ResetPasswordPage";

import ProtectedRoute from "../components/protectedRoute";

import AdminLayout from "../components/layout/AdminLayout";

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

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Routes */}

                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-otp" element={<VerifyOtpPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Admin Routes */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="dashboard" element={<DashboardPage />} />

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
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

