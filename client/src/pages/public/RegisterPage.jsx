import { useState } from "react";
import registerSchema from "../../Validations/authValidation";
import Navbar from "../../components/Navbar/Navbar";
import { registerAPI } from "../../services/authService";
import { useNavigate } from "react-router";

const RegisterPage = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

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

            const response = await registerAPI(formData);

            navigate("/verify-otp", {
                state: {
                    email: formData.email
                }
            });

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen flex justify-center items-center">

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 w-96"
                >

                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input input-bordered"
                    />

                    {errors.name && (
                        <p className="text-red-500 text-sm">
                            {errors.name}
                        </p>
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input input-bordered"
                    />

                    {errors.email && (
                        <p className="text-red-500 text-sm">
                            {errors.email}
                        </p>
                    )}

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="input input-bordered"
                    />

                    {errors.password && (
                        <p className="text-red-500 text-sm">
                            {errors.password}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {
                            loading
                                ? "Creating Account..."
                                : "Register"
                        }
                    </button>

                </form>

            </div>
        </>
    );
};

export default RegisterPage;