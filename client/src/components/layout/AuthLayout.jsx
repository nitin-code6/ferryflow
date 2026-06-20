import { useState, useEffect } from "react";

import Navbar from "../Navbar/Navbar";

import backLight from "../../assets/backLight3.png"
import backDark from "../../assets/backdark2.png";
import {
    Ship,
    Ticket,
    MapPinned,
    Bell,
    ShieldCheck
} from "lucide-react";
const AuthLayout = ({ children }) => {

    const getTheme = () =>
        document.documentElement.getAttribute("data-theme") ||
        localStorage.getItem("theme") ||
        "light";

    const [theme, setTheme] =
        useState(getTheme());

    useEffect(() => {

        const updateTheme = () => {
            setTheme(getTheme());
        };

        window.addEventListener(
            "themeChanged",
            updateTheme
        );

        const observer =
            new MutationObserver(() => {
                updateTheme();
            });

        observer.observe(
            document.documentElement,
            {
                attributes: true,
                attributeFilter: ["data-theme"]
            }
        );

        return () => {

            window.removeEventListener(
                "themeChanged",
                updateTheme
            );

            observer.disconnect();

        };

    }, []);

    const bgImage =
        theme === "dark"
            ? backDark
            : backLight;

    return (
        <>
            <Navbar />

            <div
                className="
            min-h-[calc(100vh-80px)]
            relative
            bg-cover
            bg-center
            bg-no-repeat
            overflow-hidden
            "
                style={{
                    backgroundImage: `url(${bgImage})`
                }}
            >

                {/* LIGHT OVERLAY */}

                <div
                    className="
                absolute
                inset-0
                bg-gradient-to-r
                from-slate-950/50
                via-slate-950/15
                to-transparent
                "
                />

                <div
                    className="
                relative
                z-10
                min-h-[calc(100vh-80px)]
                flex
                flex-col
                lg:grid
                lg:grid-cols-[1fr_1fr]
                "
                >

                    {/* LEFT SECTION */}

                    <div
                        className="
                    px-6
                    pt-10
                    pb-6
                    lg:px-12
                    xl:px-16
                    lg:flex
                    lg:flex-col
                    lg:justify-center
                    "
                    >

                        <div className="max-w-xl text-white">

                            <h1
                                className="
                            text-4xl
                            sm:text-5xl
                            xl:text-6xl
                            font-extrabold
                            leading-[1.05]
                            tracking-tight
                            "
                            >
                                Sail{" "}

                                <span className="text-cyan-400">
                                    Smarter.
                                </span>

                                <br />

                                Travel{" "}

                                <span className="text-sky-400">
                                    Faster.
                                </span>

                            </h1>

                            <p
                                className="
                            mt-5
                            max-w-md
                            text-base
                            sm:text-lg
                            leading-7
                            text-white/85
                            "
                            >
                                Book ferry tickets, track schedules,
                                and receive real-time travel updates
                                with FerryFlow.
                            </p>

                            {/* DESKTOP FEATURES */}

                            <div
                                className="
                            hidden
                            lg:block
                            mt-10
                            space-y-4
                            "
                            >

                                <div className="flex items-center gap-4">

                                    <div
                                        className="
                                    h-10
                                    w-10
                                    rounded-full
                                    border
                                    border-white/20
                                    bg-white/10
                                    backdrop-blur-sm
                                    flex
                                    items-center
                                    justify-center
                                    "
                                    >
                                        <Ship size={18} />
                                    </div>

                                    <div>

                                        <p className="font-semibold">
                                            Real-time Ferry Tracking
                                        </p>

                                        <p className="text-sm text-white/70">
                                            Track your ferry in real time.
                                        </p>

                                    </div>

                                </div>

                                <div className="flex items-center gap-4">

                                    <div
                                        className="
                                    h-10
                                    w-10
                                    rounded-full
                                    border
                                    border-white/20
                                    bg-white/10
                                    backdrop-blur-sm
                                    flex
                                    items-center
                                    justify-center
                                    "
                                    >
                                        <Ticket size={18} />
                                    </div>

                                    <div>

                                        <p className="font-semibold">
                                            Easy Ticket Booking
                                        </p>

                                        <p className="text-sm text-white/70">
                                            Book tickets in a few clicks.
                                        </p>

                                    </div>

                                </div>

                                <div className="flex items-center gap-4">

                                    <div
                                        className="
                                    h-10
                                    w-10
                                    rounded-full
                                    border
                                    border-white/20
                                    bg-white/10
                                    backdrop-blur-sm
                                    flex
                                    items-center
                                    justify-center
                                    "
                                    >
                                        <MapPinned size={18} />
                                    </div>

                                    <div>

                                        <p className="font-semibold">
                                            Live Route Updates
                                        </p>

                                        <p className="text-sm text-white/70">
                                            Stay updated with route changes.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT SECTION */}

                    <div
                        className="
                    flex
                    justify-center
                    px-4
                    pb-8
                    lg:items-center
                    lg:px-8
                    "
                    >

                        <div
                            className="
    w-full
    max-w-[460px]
    "
                        >
                            {children}
                        </div>

                    </div>

                </div>

            </div>

        </>
    );
};

export default AuthLayout;