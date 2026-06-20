import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import AuthLayout from "../../components/layout/AuthLayout";

import { resetPasswordAPI, resendOtp } from "../../services/authService";

const ResetPasswordPage = () => {

    const navigate =
        useNavigate();

    const location =
        useLocation();

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [errors, setErrors] =
        useState({});

    const [formData, setFormData] =
        useState({

            email:
                location.state?.email || "",

            otp: "",

            newPassword: "",

            confirmPassword: ""

        });
    const [
        resendLoading,
        setResendLoading
    ] = useState(false);

    const [timer, setTimer] =
        useState(30);
    useEffect(() => {

        if (timer <= 0)
            return;

        const interval =
            setInterval(() => {

                setTimer(
                    (prev) => prev - 1
                );

            }, 1000);

        return () =>
            clearInterval(
                interval
            );

    }, [timer]);
    const handleResendOtp =
        async () => {

            try {

                setResendLoading(
                    true
                );

                await resendOtp({

                    email:
                        formData.email,

                    purpose:
                        "reset-password"

                });

                setTimer(30);

                setErrors({});

            } catch (error) {

                setErrors({

                    server:

                        error?.response
                            ?.data
                            ?.message ||

                        "Failed to resend OTP"

                });

            } finally {

                setResendLoading(
                    false
                );

            }

        };
    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value

        });

        setErrors({});

    };

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            if (
                !formData.email ||
                !formData.otp ||
                !formData.newPassword ||
                !formData.confirmPassword
            ) {

                setErrors({

                    server:
                        "Please fill all fields"

                });

                return;

            }

            if (
                formData.otp.length !== 6
            ) {

                setErrors({

                    server:
                        "OTP must be 6 digits"

                });

                return;

            }

            if (
                formData.newPassword !==
                formData.confirmPassword
            ) {

                setErrors({

                    confirmPassword:
                        "Passwords do not match"

                });

                return;

            }

            try {

                setLoading(true);

                await resetPasswordAPI({

                    email:
                        formData.email,

                    otp:
                        formData.otp,

                    newPassword:
                        formData.newPassword

                });

                navigate("/login");

            } catch (error) {

                setErrors({

                    server:

                        error?.response
                            ?.data
                            ?.message ||

                        "Failed to reset password"

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

                    <div className="text-center">

                        <h2
                            className="
                            text-3xl
                            lg:text-4xl
                            font-black
                            tracking-tight
                            "
                        >

                            Reset

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
                            Enter the OTP sent to your
                            email and create a new password.
                        </p>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-6 space-y-4"
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
                                "
                            />

                        </div>

                        <div>

                            <label
                                className="
        block
        mb-2
        font-semibold
        "
                            >
                                OTP
                            </label>

                            <input
                                type="text"
                                name="otp"
                                maxLength={6}
                                placeholder="Enter 6-digit OTP"
                                value={formData.otp}
                                onChange={handleChange}
                                className="
        input
        input-bordered
        w-full
        h-12
        rounded-xl
        text-center
        tracking-[0.3em]
        "
                            />

                            <div
                                className="
        mt-3
        text-center
        "
                            >

                                <button
                                    type="button"
                                    onClick={
                                        handleResendOtp
                                    }
                                    disabled={
                                        resendLoading ||
                                        timer > 0
                                    }
                                    className="
            text-[#0EA5E9]
            font-medium
            hover:text-[#2563EB]
            transition-colors
            disabled:opacity-50
            "
                                >

                                    {
                                        resendLoading
                                            ? "Sending..."

                                            : timer > 0

                                                ? `Resend OTP in ${timer}s`

                                                : "Resend OTP"
                                    }

                                </button>

                            </div>

                        </div>
                        <div>

                            <label
                                className="
                                block
                                mb-2
                                font-semibold
                                "
                            >
                                New Password
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="newPassword"
                                    placeholder="Enter new password"
                                    value={
                                        formData.newPassword
                                    }
                                    onChange={handleChange}
                                    className="
                                    input
                                    input-bordered
                                    w-full
                                    h-12
                                    rounded-xl
                                    pr-20
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
                                    text-[#0EA5E9]
                                    font-medium
                                    "
                                >
                                    {
                                        showPassword
                                            ? "Hide"
                                            : "Show"
                                    }
                                </button>

                            </div>

                        </div>

                        <div>

                            <label
                                className="
                                block
                                mb-2
                                font-semibold
                                "
                            >
                                Confirm Password
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    value={
                                        formData.confirmPassword
                                    }
                                    onChange={handleChange}
                                    className="
                                    input
                                    input-bordered
                                    w-full
                                    h-12
                                    rounded-xl
                                    pr-20
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
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
                                    "
                                >
                                    {
                                        showConfirmPassword
                                            ? "Hide"
                                            : "Show"
                                    }
                                </button>

                            </div>

                            {
                                errors.confirmPassword && (

                                    <p
                                        className="
                                        mt-2
                                        text-sm
                                        text-red-500
                                        font-medium
                                        "
                                    >
                                        ⚠ {errors.confirmPassword}
                                    </p>

                                )
                            }

                        </div>

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
                                    ? "Resetting..."
                                    : "Reset Password"
                            }

                        </button>

                        <p
                            className="
    text-center
    text-sm
    text-base-content/60
    "
                        >
                            Didn't receive the code?
                            Use the resend option above.
                        </p>

                    </form>

                </div>

            </div>

        </AuthLayout>

    );

};

export default ResetPasswordPage;