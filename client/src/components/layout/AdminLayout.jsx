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

    const bgImage = theme === "dark" ? backDark : backLight;

    return (
        <div
            className="
            relative
            flex
            min-h-screen
            bg-cover
            bg-center
            bg-no-repeat
            bg-fixed
            transition-all
            duration-500
            overflow-x-hidden
            "
            style={{
                backgroundImage: `url(${bgImage})`,
            }}
        >
            {/* Very Light Overlay (No Blur) */}
            <div
                className="
                absolute
                inset-0
                bg-black/5
                pointer-events-none
                "
            />

            {/* Mobile drawer backdrop overlay */}
            {isMobileOpen && (
                <div
                    className="
        fixed
        inset-0
        z-40
        bg-black/40
        transition-opacity
        duration-300
        md:hidden
        "
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <div className="relative z-10 flex w-full min-h-screen">
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