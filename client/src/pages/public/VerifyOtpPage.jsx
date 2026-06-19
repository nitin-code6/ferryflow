import { useState } from "react";
import {
    useLocation,
    useNavigate
} from "react-router";
import { verifyOtp, resendOtp } from "../../services/authService";
import Navbar from "../../components/navbar/Navbar";
const VerifyOtpPage = () => {

    const navigate =
        useNavigate();

    const location =
        useLocation();

    const {
        email,
        purpose
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
    const handleResendOtp =
        async () => {

            try {

                setResendLoading(
                    true
                );

                const data =
                    await resendOtp(
                        email
                    );

                console.log(data);

            } catch (error) {

                console.log(error);

            } finally {

                setResendLoading(
                    false
                );

            }

        };
    const handleSubmit =
        async (e) => {

            e.preventDefault();

            if (!otp.trim()) {

                setError(
                    "OTP is required"
                );

                return;
            }

            setError("");

            setLoading(true);

            try {

                const data =
                    await verifyOtp({
                        email,
                        otp,
                    });

                console.log(data);

                navigate("/");

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "OTP verification failed"
                );

            } finally {

                setLoading(false);

            }

        };

    return (
        <>
            <Navbar />

            <div
                className="
                min-h-screen
                flex
                justify-center
                items-center
                "
            >

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="
                    flex
                    flex-col
                    gap-4
                    w-96
                    "
                >

                    <h1
                        className="
                        text-3xl
                        font-bold
                        "
                    >
                        Verify OTP
                    </h1>

                    <p>
                        OTP sent to
                        {" "}
                        <strong>
                            {email}
                        </strong>
                    </p>

                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) =>
                            setOtp(
                                e.target.value
                            )
                        }
                        className="
                        input
                        input-bordered
                        "
                    />

                    {
                        error && (
                            <p
                                className="
                                text-red-500
                                text-sm
                                "
                            >
                                {error}
                            </p>
                        )
                    }

                    <button
                        type="submit"
                        disabled={
                            loading
                        }
                        className="
                        btn
                        btn-primary
                        "
                    >
                        {
                            loading
                                ? "Verifying..."
                                : "Verify OTP"
                        }
                    </button>
                    <button
                        type="button"
                        onClick={
                            handleResendOtp
                        }
                        disabled={
                            resendLoading
                        }
                    >
                        {
                            resendLoading
                                ? "Sending..."
                                : "Resend OTP"
                        }
                    </button>
                </form>

            </div>

        </>
    );
};

export default VerifyOtpPage;