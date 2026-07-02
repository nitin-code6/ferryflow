import { Outlet } from "react-router";

import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen">
            <AdminSidebar />

            <div className="flex-1 flex flex-col">
                <AdminTopbar />

                <main className="p-6 bg-base-200 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;