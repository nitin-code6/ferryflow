import { useEffect, useState } from "react";
import { useParams } from "react-router";
import toast from "react-hot-toast";

import { getFerryById } from "../../../services/ferryService";

const FerryDetailsPage = () => {

    const { id } = useParams();

    const [ferry, setFerry] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFerry();
    }, []);

    const fetchFerry = async () => {
        try {

            const response = await getFerryById(id);

            setFerry(response.ferry);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch ferry"
            );

        } finally {

            setLoading(false);

        }
    };

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className="card bg-base-100 shadow-lg p-6 max-w-2xl">

            <h1 className="text-3xl font-bold mb-6">
                Ferry Details
            </h1>

            <div className="space-y-4">

                <div>
                    <strong>Name:</strong> {ferry.name}
                </div>

                <div>
                    <strong>Registration Number:</strong>{" "}
                    {ferry.registrationNumber}
                </div>

                <div>
                    <strong>Capacity:</strong>{" "}
                    {ferry.capacity}
                </div>

                <div>
                    <strong>Status:</strong>{" "}
                    {ferry.status}
                </div>

                <div>
                    <strong>Created At:</strong>{" "}
                    {new Date(
                        ferry.createdAt
                    ).toLocaleString()}
                </div>

                <div>
                    <strong>Updated At:</strong>{" "}
                    {new Date(
                        ferry.updatedAt
                    ).toLocaleString()}
                </div>

            </div>

        </div>
    );
};

export default FerryDetailsPage;