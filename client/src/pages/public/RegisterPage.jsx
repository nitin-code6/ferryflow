import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { registerSchema } from "../../Validations/authValidation";
import { registerAPI } from "../../services/authService";
import AuthLayout from "../../components/layout/AuthLayout";

const RegisterPage = () => {


    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] =
        useState(false);

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
            registerSchema.safeParse(formData);

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

            await registerAPI(formData);



            navigate("/verify-otp", {
                state: {
                    email: formData.email,
                    purpose: "verify-email"
                }
            });

        } catch (error) {

            const message = !error.response
                ? "Unable to connect to server. Please try again."
                : error.response?.data?.message ||
                "Registration failed";

            setErrors({
                server: message
            });



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

                    {/* Heading */}

                    <div className="text-center">

                        <h2
                            className="
        text-3xl
        lg:text-4xl
        font-black
        tracking-tight
        "
                        >

                            Create Your

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
                                {" "}Account
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
                            Create your account to book tickets
                            and track ferries in real time.
                        </p>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-6 space-y-4"
                    >

                        {/* Name */}

                        <div>

                            <label
                                className="
                            block
                            mb-2
                            font-semibold
                            "
                            >
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                className="
input
input-bordered
w-full
h-12
rounded-xl
border-slate-300
focus:border-[#0EA5E9]
focus:outline-none
focus:ring-4
focus:ring-[#0EA5E9]/15
transition-all
duration-200
"
                            />

                            {
                                errors.name && (

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
                                        ⚠ {errors.name}
                                    </p>

                                )
                            }

                        </div>

                        {/* Email */}

                        <div>

                            <label
                                className="
                            block
                            mb-2
                            font-semibold
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
                                className="
input
input-bordered
w-full
h-12
rounded-xl
border-slate-300
focus:border-[#0EA5E9]
focus:outline-none
focus:ring-4
focus:ring-[#0EA5E9]/15
transition-all
duration-200
"
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
                            font-semibold
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
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="
input
input-bordered
w-full
h-12
rounded-xl
pr-20
border-slate-300
focus:border-[#0EA5E9]
focus:outline-none
focus:ring-4
focus:ring-[#0EA5E9]/15
transition-all
duration-200
"
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
                                text-base-content/60
                                "
                                >
                                    {
                                        showPassword
                                            ? "Hide"
                                            : "Show"
                                    }
                                </button>

                            </div>

                            <p
                                className="
                            mt-1
                            text-xs
                            text-base-content/50
                            "
                            >
                                Minimum 8 characters
                            </p>

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

                        {/* Submit */}

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
                        hover:scale-[1.01]
                        transition-all
                        duration-300
                        "
                        >

                            {
                                loading
                                    ? "Creating Account..."
                                    : "Create Account"
                            }

                        </button>

                        {/* Login Link */}

                        <div className="text-center pt-1">

                            <p
                                className="
                            text-base-content/60
                            "
                            >

                                Already have an account?

                                <Link
                                    to="/login"
                                    className="
    ml-2
    font-semibold
    text-[#0EA5E9]
    hover:text-[#2563EB]
    transition-colors
    "
                                >
                                    Login here
                                </Link>

                            </p>

                        </div>

                    </form>

                </div>

            </div>

        </AuthLayout>

    );
};

export default RegisterPage;
