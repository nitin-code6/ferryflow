import { Outlet } from "react-router";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import backlight3 from "../../assets/backlight3.png";
import backDark from "../../assets/backDark.png";

const PublicLayout = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 bg-[#F1F5F9] dark:bg-[#071426] text-[#071426] dark:text-[#F8FAFC] relative overflow-x-hidden">
            {/* Background Images with Low Opacity */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.09] dark:hidden bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: `url(${backlight3})` }} />
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] hidden dark:block bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: `url(${backDark})` }} />
            
            <Navbar />
            
            <main className="flex-1 relative z-10">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default PublicLayout;
