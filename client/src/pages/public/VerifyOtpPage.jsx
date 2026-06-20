import { useState, useEffect } from "react";
import {
    useLocation,
    useNavigate
} from "react-router";

import {
    verifyOtp,
    resendOtp
} from "../../services/authService";

import AuthLayout from "../../components/layout/AuthLayout";

const VerifyOtpPage = () => {

    const navigate =
        useNavigate();

    const location =
        useLocation();

    const {
        email
    } = location.state || {};

    const [otp, setOtp] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const [
        resendLoading,
        setResendLoading
    ] = useState(false);

    const [timer, setTimer] =
        useState(30);

    useEffect(() => {

        if (!email) {

            navigate(
                "/register"
            );

        }

    }, [email, navigate]);

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

            setError("");

            try {

                setResendLoading(true);

                await resendOtp(email);

                setTimer(30);

            } catch (error) {

                setError(

                    error?.response
                        ?.data
                        ?.message ||

                    "Failed to resend OTP"

                );

            } finally {

                setResendLoading(false);

            }

        };

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            if (!otp.trim()) {

                setError(
                    "Please enter the verification code"
                );

                return;
            }

            if (otp.length !== 6) {

                setError(
                    "OTP must contain 6 digits"
                );

                return;
            }

            setError("");

            setLoading(true);

            try {

                await verifyOtp({

                    email,
                    otp

                });

                navigate("/");

            } catch (error) {

                setError(

                    error?.response
                        ?.data
                        ?.message ||

                    "OTP verification failed"

                );

            } finally {

                setLoading(false);

            }

        };

    return (

        <AuthLayout>

            <div
                className="
            bg-base-100/95
            rounded-[28px]
            border
            border-base-300/50
            shadow-[0_10px_40px_rgba(0,0,0,0.15)]
            overflow-hidden
            "
            >

                <div className="p-6 lg:p-8">

                    <h2
                        className="
    text-3xl
    lg:text-4xl
    font-black
    tracking-tight
    "
                    >

                        Verify Your

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
                            {" "}Email
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
                        We've sent a verification code to
                    </p>

                    <p
                        className="
    mt-1
    font-semibold
    text-[#0EA5E9]
    break-all
    "
                    >
                        {email}
                    </p>

                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="
                    mt-8
                    space-y-4
                    "
                    >

                        <input
                            autoFocus
                            type="text"
                            maxLength={6}
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => {

                                setOtp(
                                    e.target.value.replace(
                                        /\D/g,
                                        ""
                                    )
                                );

                                setError("");

                            }}
                            className="
    input
    input-bordered
    w-full
    h-12
    rounded-xl
    text-center
    text-lg
    font-semibold
    tracking-[0.35em]
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
                            disabled={
                                loading
                            }
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
                                    ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>

                                            Verifying...
                                        </>
                                    )
                                    : (
                                        "Verify OTP"
                                    )
                            }

                        </button>

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
btn
btn-outline
w-full
h-12
rounded-xl
border-[#0EA5E9]
text-[#0EA5E9]
hover:bg-[#0EA5E9]
hover:text-white
">

                            {
                                resendLoading
                                    ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>

                                            Sending...
                                        </>
                                    )
                                    : timer > 0
                                        ? `Resend OTP in ${timer}s`
                                        : "Resend OTP"
                            }

                        </button>

                        <div className="text-center pt-2">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/register"
                                    )
                                }
                                className="
text-[#0EA5E9]
font-medium
hover:text-[#2563EB]
hover:underline
transition-colors
"
                            >
                                Back to Register
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </AuthLayout>

    );


};

export default VerifyOtpPage;
