import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import FerryForm from "../../../components/ferry/FerryForm";
import { createFerry } from "../../../services/ferryService";

const CreateFerryPage = () => {

    const navigate = useNavigate();

    const handleCreate = async (data) => {

        try {

            const response = await createFerry(data);

            toast.success(response.message);

            navigate("/admin/ferries");

        } catch (error) {

            toast.error(
                error.response?.data?.message || "Failed to create ferry"
            );

        }

    };

    return (
        <div className="space-y-6">

            <h1 className="text-3xl font-bold">
                Create Ferry
            </h1>

            <FerryForm
                onSubmit={handleCreate}
                submitButtonText="Create Ferry"
            />

        </div>
    );
};

export default CreateFerryPage;