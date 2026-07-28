import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
    FiMoon,
    FiSun,
    FiMenu,
    FiX
} from "react-icons/fi";

import logo from "../../assets/ferry-logo2.png";

import { useAuth } from "../../context/AuthContext";
import { logoutAPI } from "../../services/authService";



const Navbar = () => {


    const navigate = useNavigate();


    const { user, setUser } = useAuth();


    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );


    const [open, setOpen] = useState(false);



    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);





    const links = [
        {
            name: "Home",
            path: "/"
        },
        {
            name: "Ferry & Transportation",
            path: "/ferries"
        },
        {
            name: "Routes",
            path: "/routes"
        },
        {
            name: "Contact",
            path: "/contact"
        }
    ];






    const logout = async () => {

        await logoutAPI();

        setUser(null);

        navigate("/login");

    };





    return (

        <header
            className="
fixed
top-0
left-0
w-full
z-50
bg-[#F8FAFC]/90
dark:bg-[#071426]/90
backdrop-blur-xl
border-b
border-blue-100/80
dark:border-[#00A8FF]/20
shadow-sm
shadow-[#2563EB]/5
transition-all
duration-300
"
        >
            <div className="max-w-full px-6 md:px-12 py-4 flex items-center justify-between">
                {/* LOGO */}
                <Link
                    to="/"
                    className="
flex
items-center
gap-3
"
                >
                    <div className="p-1.5 bg-sky-500/10 dark:bg-sky-400/15 border border-sky-500/20 dark:border-sky-400/30 rounded-xl shadow-[0_0_15px_rgba(14,165,233,0.15)] flex items-center justify-center">
                        <img
                            src={logo}
                            alt="FerryFlow"
                            className="
h-7
w-auto
filter
brightness-110
drop-shadow-[0_2px_6px_rgba(14,165,233,0.3)]
"
                        />
                    </div>
                    <span
                        className="
text-xl
font-black
text-[#071426]
dark:text-[#F8FAFC]
"
                    >
                        Ferry
                        <span
                            className="
inline-block
bg-gradient-to-r
from-[#2563EB]
to-[#00A8FF]
bg-clip-text
text-transparent
"
                        >
                            Flow
                        </span>
                    </span>
                </Link>

                {/* DESKTOP LINKS */}
                <div
                    className="
hidden
md:flex
items-center
gap-7
"
                >
                    {
                        links.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-sm font-semibold text-[#071426]/75 dark:text-[#F8FAFC]/75 hover:text-[#2563EB] dark:hover:text-[#00A8FF] transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))
                    }
                </div>

                {/* ACTIONS */}
                <div
                    className="
hidden
md:flex
items-center
gap-3
"
                >
                    <button
                        onClick={() => {
                            setTheme(
                                theme === "light"
                                    ?
                                    "dark"
                                    :
                                    "light"
                            )
                        }}
                        className="
h-9
w-9
flex
items-center
justify-center
rounded-full
hover:bg-[#2563EB]/10
dark:hover:bg-[#00A8FF]/10
text-[#071426]
dark:text-[#F8FAFC]
transition-all
duration-250
"
                    >
                        {
                            theme === "light"
                                ?
                                <FiMoon size={17} />
                                :
                                <FiSun size={17} />
                        }
                    </button>





                    {
                        user ? (
                            <div className="dropdown dropdown-end">
                                <button tabIndex={0} className="h-9 w-9 rounded-full overflow-hidden border border-primary/30">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0EA5E9&color=fff`}
                                        alt={user.name}
                                    />
                                </button>

                                <ul
                                    tabIndex={0}
                                    className="dropdown-content menu mt-3 bg-base-100 dark:bg-slate-900 rounded-xl shadow-xl border border-base-300 w-52 p-2 z-50 text-base-content"
                                >
                                    <div className="px-3 py-2 border-b border-base-300 mb-1">
                                        <p className="font-bold text-sm truncate">{user.name}</p>
                                        <p className="text-xs text-base-content/50 uppercase tracking-wider font-semibold">{user.role}</p>
                                    </div>
                                    {(user?.role === "admin" || user?.role === "staff") ? (
                                        <li>
                                            <Link to="/admin/dashboard" className="font-bold text-primary">
                                                Admin Dashboard
                                            </Link>
                                        </li>
                                    ) : (
                                        <li>
                                            <Link to="/dashboard" className="font-semibold">
                                                Dashboard
                                            </Link>
                                        </li>
                                    )}
                                    <li>
                                        <Link to="/my-bookings" className="font-semibold">
                                            My Bookings
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/profile" className="font-semibold">
                                            Profile
                                        </Link>
                                    </li>
                                    <div className="divider my-1"></div>
                                    <li>
                                        <button onClick={logout} className="text-error font-bold">
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                {/* Passenger Auth */}
                                <div className="flex items-center gap-1.5 border-r border-[#2563EB]/15 dark:border-sky-950/80 pr-2">
                                    <Link
                                        to="/login"
                                        className="text-xs font-bold px-3.5 py-2.5 rounded-xl border border-[#2563EB]/40 dark:border-[#00A8FF]/30 text-[#2563EB] dark:text-[#00A8FF] hover:bg-[#2563EB] dark:hover:bg-[#00A8FF] hover:text-white dark:hover:text-[#071426] hover:border-transparent transition-all"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#00A8FF] text-white hover:opacity-95 shadow-md shadow-[#2563EB]/15 transition-all"
                                    >
                                        Register
                                    </Link>
                                </div>

                                {/* Admin Auth (Distinctly Styled for Administration Portal) */}
                                <div className="flex items-center gap-1.5 pl-1">
                                    <Link
                                        to="/admin/login"
                                        className="text-xs font-bold px-3.5 py-2.5 rounded-xl bg-[#071426]/5 dark:bg-[#0F1D36] text-[#071426] dark:text-[#F8FAFC] hover:bg-[#071426]/10 dark:hover:bg-[#162746] border border-[#071426]/10 dark:border-[#1E294B] transition-all flex items-center gap-1.5"
                                    >
                                        <span className="text-[10px]">🛡️</span> Admin Login
                                    </Link>
                                </div>
                            </div>
                        )
                    }



                </div>








                {/* MOBILE BUTTON */}



                <button

                    onClick={() => setOpen(!open)}

                    className="
md:hidden

p-2

rounded-lg

hover:bg-slate-100

dark:hover:bg-slate-800
"

                >


                    {

                        open

                            ?

                            <FiX />

                            :

                            <FiMenu />

                    }


                </button>



            </div>







            {/* MOBILE MENU */}


            {

                open && (
                    <div
                        className="
md:hidden
max-w-6xl
mx-auto
mt-3
px-5
py-5
rounded-2xl
bg-[#F8FAFC]/95
dark:bg-[#071426]/95
backdrop-blur-xl
border
border-blue-100/80
dark:border-[#00A8FF]/20
shadow-lg
shadow-[#2563EB]/5
"
                    >
                        <div
                            className="
flex
flex-col
gap-4
"
                        >
                            {
                                links.map(link => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setOpen(false)}
                                        className="
text-sm
font-semibold
text-[#071426]/80
dark:text-[#F8FAFC]/80
hover:text-[#2563EB]
dark:hover:text-[#00A8FF]
transition-colors
"
                                    >
                                        {link.name}
                                    </Link>
                                ))
                            }

                            <hr className="border-[#2563EB]/10 dark:border-sky-950/80" />

                            {
                                user ? (
                                    <>
                                        <Link to="/my-bookings" onClick={() => setOpen(false)} className="font-semibold text-[#071426]/80 dark:text-[#F8FAFC]/80 text-sm">
                                            My Bookings
                                        </Link>
                                        <Link to="/profile" onClick={() => setOpen(false)} className="font-semibold text-[#071426]/80 dark:text-[#F8FAFC]/80 text-sm">
                                            Profile
                                        </Link>
                                        <button onClick={logout} className="text-left text-error font-bold text-sm">
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#071426]/50 dark:text-[#F8FAFC]/50">Passenger Portal</p>
                                        <div className="flex gap-2">
                                            <Link to="/login" onClick={() => setOpen(false)} className="btn btn-sm border border-[#2563EB]/25 text-[#2563EB] dark:border-[#00A8FF]/20 dark:text-[#00A8FF] flex-1 font-bold rounded-xl bg-transparent hover:bg-[#2563EB]/5">
                                                Login
                                            </Link>
                                            <Link to="/register" onClick={() => setOpen(false)} className="btn btn-sm bg-gradient-to-r from-[#2563EB] to-[#00A8FF] text-white border-0 flex-1 font-bold rounded-xl shadow-sm">
                                                Register
                                            </Link>
                                        </div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#071426]/50 dark:text-[#F8FAFC]/50 pt-2">Admin Portal</p>
                                        <div className="flex gap-2">
                                            <Link to="/admin/login" onClick={() => setOpen(false)} className="btn btn-sm bg-slate-200 hover:bg-slate-300 dark:bg-[#0F1D36] dark:hover:bg-[#162746] text-[#071426] dark:text-[#F8FAFC] border border-slate-300 dark:border-[#1E294B] flex-1 font-bold rounded-xl">
                                                Admin Login
                                            </Link>
                                        </div>
                                    </div>
                                )
                            }

                            {/* Mobile Theme Toggle */}
                            <div className="flex items-center justify-between pt-2 border-t border-[#2563EB]/10 dark:border-sky-950/80">
                                <span className="text-xs font-semibold text-[#071426]/60 dark:text-[#F8FAFC]/60">
                                    {theme === "light" ? "Light Mode" : "Dark Mode"}
                                </span>
                                <button
                                    onClick={() => {
                                        setTheme(theme === "light" ? "dark" : "light");
                                        setOpen(false);
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2563EB]/10 dark:bg-[#00A8FF]/10 text-[#2563EB] dark:text-[#00A8FF] font-semibold text-xs transition-all hover:bg-[#2563EB]/20 dark:hover:bg-[#00A8FF]/20"
                                >
                                    {theme === "light" ? <FiMoon size={14} /> : <FiSun size={14} />}
                                    {theme === "light" ? "Switch to Dark" : "Switch to Light"}
                                </button>
                            </div>
                        </div>

                    </div>
                )

            }



        </header>


    );
};


export default Navbar;