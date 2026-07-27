import { useState, useEffect } from "react";
import { Outlet } from "react-router";

import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

import backLight from "../../assets/backLight3.png";
import backDark from "../../assets/backdark2.png";

const AdminLayout = () => {
    const getTheme = () =>
        document.documentElement.getAttribute("data-theme") ||
        localStorage.getItem("theme") ||
        "light";

    const [theme, setTheme] = useState(getTheme());
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const updateTheme = () => {
            setTheme(getTheme());
        };

        window.addEventListener("themeChanged", updateTheme);

        const observer = new MutationObserver(() => {
            updateTheme();
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobileOpen(false);
            } else if (window.innerWidth < 1024) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        handleResize(); // Initialize on mount
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("themeChanged", updateTheme);
            window.removeEventListener("resize", handleResize);
            observer.disconnect();
        };
    }, []);

    return (
        <div
            className="
            relative
            flex
            min-h-screen
            bg-slate-50
            dark:bg-[#071426]
            transition-all
            duration-500
            overflow-x-hidden
            "
        >
            {/* Ambient glows for premium professional look */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2563EB]/5 dark:bg-[#2563EB]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#00A8FF]/5 dark:bg-[#00A8FF]/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Very Light Overlay */}
            <div
                className="
                absolute
                inset-0
                bg-black/5
                dark:bg-black/20
                pointer-events-none
                "
            />

            {/* Mobile drawer backdrop overlay */}
            {isMobileOpen && (
                <div
                    className="
        fixed
        inset-0
        z-45
        bg-black/55
        transition-all
        duration-300
        md:hidden
        "
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <div className="flex w-full min-h-screen">
                {/* Sidebar */}
                <AdminSidebar
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setIsMobileOpen}
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                />

                {/* Content */}
                <div
                    className={`
                    flex-1
                    flex
                    flex-col
                    min-h-screen
                    min-w-0
                    transition-all
                    duration-300
                    ${isCollapsed ? "md:pl-20" : "md:pl-64"}
                    pl-0
                    `}
                >
                    <AdminTopbar
                        isMobileOpen={isMobileOpen}
                        setIsMobileOpen={setIsMobileOpen}
                        isCollapsed={isCollapsed}
                        setIsCollapsed={setIsCollapsed}
                    />

                    <main
                        className="
                        flex-1
                        overflow-y-auto
                        p-4
                        sm:p-5
                        md:p-6
                        lg:p-8
                        transition-all
                        duration-300
                        "
                    >
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;