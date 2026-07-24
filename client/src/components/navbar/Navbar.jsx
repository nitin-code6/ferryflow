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

        document.documentElement.setAttribute(
            "data-theme",
            theme
        );

        localStorage.setItem(
            "theme",
            theme
        );

    }, [theme]);





    const links = [
        {
            name: "Home",
            path: "/"
        },
        {
            name: "Ferry & Transportation",
            path: "/transportation"
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
top-5
left-0
w-full
z-50
"
        >


            <nav

                className="
max-w-6xl
mx-auto

flex
items-center
justify-between

px-5
py-3

rounded-2xl

bg-white/70
dark:bg-slate-900/70

backdrop-blur-xl

border
border-slate-200
dark:border-slate-700

shadow-sm
"

            >



                {/* LOGO */}


                <Link
                    to="/"
                    className="
flex
items-center
gap-2
"
                >


                    <img
                        src={logo}
                        alt="FerryFlow"
                        className="
h-9
w-auto
"
                    />


                    <span
                        className="
text-xl
font-semibold

text-slate-900
dark:text-white
"
                    >

                        Ferry
                        <span
                            className="
text-sky-500
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

                                className="
text-sm

text-slate-600
dark:text-slate-300

hover:text-sky-500

transition
"

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

hover:bg-slate-100
dark:hover:bg-slate-800

transition
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

                        user

                            ?

                            (

                                <div
                                    className="
dropdown
dropdown-end
"
                                >


                                    <button

                                        tabIndex={0}

                                        className="
h-9
w-9

rounded-full

overflow-hidden
"

                                    >

                                        <img

                                            src={
                                                `https://ui-avatars.com/api/?name=${user.name}`
                                            }

                                            alt="profile"

                                        />

                                    </button>




                                    <ul

                                        tabIndex={0}

                                        className="
dropdown-content

menu

mt-3

bg-white
dark:bg-slate-900

rounded-xl

shadow-xl

border

border-slate-200

dark:border-slate-700

w-48

p-2

"

                                    >


                                        <li>

                                            <Link to="/profile">

                                                Profile

                                            </Link>

                                        </li>


                                        <li>

                                            <Link to="/bookings">

                                                My Bookings

                                            </Link>

                                        </li>


                                        <li>

                                            <button onClick={logout}>

                                                Logout

                                            </button>

                                        </li>


                                    </ul>


                                </div>

                            )


                            :

                            (

                                <>


                                    <Link

                                        to="/login"

                                        className="
text-sm

px-4
py-2

rounded-full

text-slate-700

dark:text-slate-200

hover:bg-slate-100

dark:hover:bg-slate-800

transition
"

                                    >

                                        Login

                                    </Link>





                                    <Link

                                        to="/register"

                                        className="
text-sm

px-5
py-2

rounded-full

bg-sky-500

text-white

hover:bg-sky-600

transition

shadow-md

shadow-sky-500/20
"

                                    >

                                        Register

                                    </Link>


                                </>

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



            </nav>







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

bg-white/90

dark:bg-slate-900/90

backdrop-blur-xl

border

border-slate-200

dark:border-slate-700

shadow-lg

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
font-medium

"

                                    >

                                        {link.name}

                                    </Link>


                                ))

                            }


                            <hr />


                            {

                                user

                                    ?

                                    <>

                                        <Link to="/bookings">
                                            My Bookings
                                        </Link>

                                        <button
                                            onClick={logout}
                                            className="text-left"
                                        >
                                            Logout
                                        </button>

                                    </>

                                    :

                                    <>

                                        <Link to="/login">
                                            Login
                                        </Link>

                                        <Link
                                            to="/register"
                                            className="text-sky-500"
                                        >
                                            Register
                                        </Link>

                                    </>

                            }


                        </div>


                    </div>

                )

            }



        </header>


    );


};


export default Navbar;