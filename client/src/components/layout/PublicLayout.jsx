import { Outlet } from "react-router";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

const PublicLayout = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 bg-base-100 text-base-content">
            <Navbar />
            
            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default PublicLayout;
