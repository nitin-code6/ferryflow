import { useState } from "react";

import { Link, useNavigate } from "react-router";

import AuthLayout from "../../components/layout/AuthLayout";

import { forgotPasswordAPI } from "../../services/authService";

const ForgotPasswordPage = () => {

    const navigate =
        useNavigate();

    const [email, setEmail] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            if (!email.trim()) {

                setError(
                    "Please enter your email address"
                );

                return;

            }

            setError("");

            try {

                setLoading(true);

                const result = await forgotPasswordAPI({
                    email
                });

                navigate("/reset-password", {
                    state: {
                        email,
                        purpose: "reset-password"
                    }
                });

            } catch (error) {
                console.log("errot", error)
                setError(

                    error?.response
                        ?.data
                        ?.message ||

                    "Failed to send reset code"

                );

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

                            Forgot

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
                                {" "}Password
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
                            Enter your email address and
                            we'll send a verification code
                            to reset your password.
                        </p>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="
                        mt-6
                        space-y-4
                        "
                    >

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
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => {

                                    setEmail(
                                        e.target.value
                                    );

                                    setError("");

                                }}
                                className="
                                input
                                input-bordered
                                w-full
                                h-12
                                rounded-xl
                                "
                            />

                        </div>

                        {
                            error && (

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
                                        ⚠ {error}
                                    </p>

                                </div>

                            )
                        }

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
                                    ? "Sending..."
                                    : "Send Reset Code"
                            }

                        </button>

                        <div className="text-center">

                            <Link
                                to="/login"
                                className="
                                text-[#0EA5E9]
                                font-medium
                                hover:text-[#2563EB]
                                hover:underline
                                transition-colors
                                "
                            >
                                Back to Login
                            </Link>

                        </div>

                    </form>

                </div>

            </div>

        </AuthLayout>

    );

};

export default ForgotPasswordPage;