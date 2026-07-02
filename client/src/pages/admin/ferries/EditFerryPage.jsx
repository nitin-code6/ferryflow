import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";

import FerryForm from "../../../components/ferry/FerryForm";
import {
    getFerryById,
    updateFerry,
} from "../../../services/ferryService";

const EditFerryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ferry, setFerry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchFerry();
    }, []);

    const fetchFerry = async () => {
        try {
            const response = await getFerryById(id);

            setFerry(response.ferry);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to fetch ferry"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (data) => {
        try {
            setIsSubmitting(true);

            const response = await updateFerry(id, data);

            toast.success(response.message);

            navigate("/admin/ferries");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update ferry"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">
                Edit Ferry
            </h1>

            <FerryForm
                defaultValues={ferry}
                onSubmit={handleUpdate}
                isLoading={isSubmitting}
                submitButtonText="Update Ferry"
            />
        </div>
    );
};

export default EditFerryPage;