import api from "./axios";

export const registerAPI = async (userData) => {

    const response = await api.post(
        "/auth/register",
        userData
    );

    return response.data;
};

export const verifyOtp = async (
    otpData
) => {

    const response =
        await api.post(
            "/auth/verify-email",
            otpData
        );

    return response.data;
};

export const resendOtp =
    async (email) => {

        const response =
            await api.post(
                "/auth/resend-otp",
                { email }
            );

        return response.data;
    };
export const loginAPI = async (loginData) => {
    const response = await api.post(
        "/auth/login",
        loginData
    );
    return response.data;
};