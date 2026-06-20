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
            otpData,

        );

    return response.data;
};

export const resendOtp =
    async (data) => {

        const response =
            await api.post(
                "/auth/resend-otp",
                data
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
export const forgotPasswordAPI = async (email) => {

    const response = await api.post(
        "/auth/forget-password",
        email
    );
    return response.data;
};
export const resetPasswordAPI =
    async (data) => {

        const response =
            await api.post(
                "/auth/reset-password",
                data
            );

        return response.data;
    };
export const googleLoginAPI =
    async (idToken) => {

        const response =
            await api.post(
                "/auth/google",
                {
                    idToken
                }
            );

        return response.data;
    };