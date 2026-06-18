import { Link } from "react-router";
import { useState, useEffect } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

import logo from "../../assets/ferry-logo2.png";

const Navbar = () => {

    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

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

                {/* Login */}

                <Link
                    to="/login"
                    className="btn btn-outline"
                >
                    Login
                </Link>

                {/* Register */}

                <Link
                    to="/register"
                    className="btn btn-primary"
                >
                    Register
                </Link>

            </div>

        </header>
    );
};

export default Navbar;