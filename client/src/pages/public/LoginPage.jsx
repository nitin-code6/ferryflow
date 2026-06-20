import { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import AuthLayout from "../../components/layout/AuthLayout";
import { loginSchema } from "../../Validations/authValidation";
import { loginAPI } from "../../services/authService";

const LoginPage = () => {


    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] =
        useState(false);
    const inputStyles = `
input
input-bordered
w-full
h-12
rounded-xl
border-slate-300
text-slate-900
placeholder:text-slate-400
dark:text-white
dark:placeholder:text-slate-500
focus:border-[#0EA5E9]
focus:outline-none
focus:ring-4
focus:ring-[#0EA5E9]/15
transition-all
duration-200
`;
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setErrors((prev) => ({
            ...prev,
            [e.target.name]: "",
            server: ""
        }));

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result =
            loginSchema.safeParse(formData);
        console.log(result);
        if (!result.success) {

            const fieldErrors = {};

            result.error.issues.forEach((issue) => {

                fieldErrors[
                    issue.path[0]
                ] = issue.message;

            });

            setErrors(fieldErrors);

            return;

        }

        setErrors({});

        setLoading(true);

        try {

            await loginAPI(formData);

            toast.success("Welcome back!");
            navigate("/");

        } catch (error) {

            if (!error.response) {

                setErrors({
                    server:
                        "Unable to connect to server. Please try again."
                });

            } else {

                setErrors({
                    server:
                        error.response.data.message ||
                        "Login failed"
                });

            }

        } finally {

            setLoading(false);

        }

    };

    return (

        <AuthLayout>

            <div
                className="
            bg-base-100/90
            backdrop-blur-xl
            rounded-[28px]
            border
            border-white/20
            shadow-[0_25px_80px_rgba(0,0,0,0.18)]
            overflow-hidden
            "
            >

                <div className="p-6 lg:p-8">

                    <div className="text-center">

                        <h2
                            className="
                        text-3xl
                        lg:text-4xl
                        font-black
                        tracking-tight
                        "
                        >

                            Welcome

                            <span
                                className="
                            bg-gradient-to-r
                            from-[#2563EB]
                            via-[#0EA5E9]
                            to-[#22D3EE]
                            bg-clip-text
                            text-transparent
                            "
                            >
                                {" "}Back
                            </span>

                        </h2>

                        <p
                            className="
                        mt-3
                        text-[15px]
                        font-medium
                        text-slate-500
                        dark:text-slate-400
                        "
                        >
                            Sign in to manage bookings and
                            track ferries in real time.
                        </p>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-6 space-y-4"
                    >

                        {/* Email */}

                        <div>

                            <label
                                className="
                            block
                            mb-2
                            font-semibold
                            text-black
                            dark:text-white
                            "
                            >
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={handleChange}
                                className={inputStyles}
                            />

                            {
                                errors.email && (

                                    <p
                                        className="
                                    mt-2
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-medium
                                    text-red-500
                                    "
                                    >
                                        ⚠ {errors.email}
                                    </p>

                                )
                            }

                        </div>

                        {/* Password */}

                        <div>

                            <label
                                className="
    block
    mb-2
    text-sm
    font-semibold
    text-black
    dark:text-white
    "
                            >
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={inputStyles}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="
                                absolute
                                right-4
                                top-1/2
                                -translate-y-1/2
                                text-sm
                                text-[#0EA5E9]
                                font-medium
                                hover:text-[#2563EB]
                                transition-colors
                                "
                                >
                                    {
                                        showPassword
                                            ? "Hide"
                                            : "Show"
                                    }
                                </button>

                            </div>

                            {
                                errors.password && (

                                    <p
                                        className="
                                    mt-2
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-medium
                                    text-red-500
                                    "
                                    >
                                        ⚠ {errors.password}
                                    </p>

                                )
                            }

                        </div>

                        {/* Forgot Password */}

                        <div className="text-right">

                            <Link
                                to="/forgot-password"
                                className="
                            text-[#0EA5E9]
                            font-medium
                            hover:text-[#2563EB]
                            hover:underline
                            transition-colors
                            "
                            >
                                Forgot Password?
                            </Link>

                        </div>

                        {/* Server Error */}

                        {
                            errors.server && (

                                <div
                                    className="
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                dark:bg-red-500/10
                                px-4
                                py-3
                                "
                                >

                                    <p
                                        className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-medium
                                    text-red-500
                                    "
                                    >
                                        ⚠ {errors.server}
                                    </p>

                                </div>

                            )
                        }

                        {/* Submit Button */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                        btn
                        w-full
                        h-12
                        border-0
                        rounded-xl
                        bg-gradient-to-r
                        from-[#2563EB]
                        via-[#0EA5E9]
                        to-[#22D3EE]
                        text-white
                        shadow-lg
                        shadow-sky-500/20
                        hover:scale-[1.01]
                        transition-all
                        duration-300
                        "
                        >

                            {
                                loading
                                    ? "Signing In..."
                                    : "Sign In"
                            }

                        </button>

                        {/* Register Link */}

                        <div className="text-center pt-1">

                            <p
                                className="
                            text-slate-500
                            dark:text-slate-400
                            "
                            >

                                Don't have an account?

                                <Link
                                    to="/register"
                                    className="
                                ml-2
                                font-semibold
                                text-[#0EA5E9]
                                hover:text-[#2563EB]
                                transition-colors
                                "
                                >
                                    Register
                                </Link>

                            </p>

                        </div>

                    </form>

                </div>

            </div>

        </AuthLayout>

    );


};

export default LoginPage;
