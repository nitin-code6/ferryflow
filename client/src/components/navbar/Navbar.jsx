import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

import logo from "../../assets/ferry-logo2.png";
import { useAuth } from "../../context/AuthContext";
import { logoutAPI } from "../../services/authService";

const Navbar = () => {

    const navigate = useNavigate();

    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    const {
        user,
        setUser
    } = useAuth();

    useEffect(() => {

        document.documentElement.setAttribute(
            "data-theme",
            theme
        );

        localStorage.setItem(
            "theme",
            theme
        );

    }, [theme]);

    const handleLogout = async () => {

        try {

            await logoutAPI();

            setUser(null);

            navigate("/login");

        } catch (error) {

            console.error(error);

        }

    };

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Schedules", path: "/schedules" },
        { name: "Routes", path: "/routes" },
        { name: "Alerts", path: "/alerts" },
        { name: "My Bookings", path: "/bookings" },
        { name: "About Us", path: "/about" },
        { name: "Contact", path: "/contact" },
    ];

    return (
        <header
            className="
            navbar
            bg-base-100/80
            backdrop-blur-lg
            border-b
            border-base-300
            sticky
            top-0
            z-50
            px-8
            "
        >

            {/* Logo */}

            <div className="flex-1">

                <Link
                    to="/"
                    className="flex items-center gap-3"
                >

                    <img
                        src={logo}
                        alt="FerryFlow"
                        className="h-15 w-auto object-contain"
                    />

                    <div className="hidden md:block">

                        <h1 className="text-3xl font-bold">
                            Ferry
                            <span className="text-primary">
                                Flow
                            </span>
                        </h1>

                        <p className="text-xs opacity-70">
                            Real-Time Ferry Operations
                        </p>

                    </div>

                </Link>

            </div>

            {/* Navigation */}

            <div className="hidden lg:flex">

                <ul
                    className="
                    menu
                    menu-horizontal
                    gap-2
                    font-medium
                    "
                >

                    {
                        navLinks.map((link) => (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className="
                                    hover:text-primary
                                    transition-all
                                    duration-200
                                    "
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))
                    }

                </ul>

            </div>

            {/* Right Side */}

            <div className="flex items-center gap-3">

                {/* Theme Toggle */}

                <button
                    className="
                    btn
                    btn-circle
                    btn-ghost
                    "
                    onClick={() =>
                        setTheme(
                            theme === "light"
                                ? "dark"
                                : "light"
                        )
                    }
                >

                    {
                        theme === "light"
                            ? <FiMoon size={18} />
                            : <FiSun size={18} />
                    }

                </button>

                {
                    user ? (

                        <div className="dropdown dropdown-end">

                            <div
                                tabIndex={0}
                                role="button"
                                className="
                                btn
                                btn-ghost
                                btn-circle
                                avatar
                                "
                            >

                                <div className="w-10 rounded-full">

                                    <img
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                                        alt={user.name}
                                    />

                                </div>

                            </div>

                            <ul
                                tabIndex={0}
                                className="
                                menu
                                menu-sm
                                dropdown-content
                                mt-3
                                z-[1]
                                p-2
                                shadow
                                bg-base-100
                                rounded-box
                                w-52
                                "
                            >

                                <li>
                                    <Link to="/profile">
                                        Profile
                                    </Link>
                                </li>

                                <li>
                                    <button
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>

                            </ul>

                        </div>

                    ) : (

                        <>
                            <Link
                                to="/login"
                                className="btn btn-outline"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="btn btn-primary"
                            >
                                Register
                            </Link>
                        </>

                    )
                }

            </div>

        </header>
    );
};

export default Navbar;