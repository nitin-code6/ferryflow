import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAllFerries } from "../../../services/ferryService";
import toast from "react-hot-toast";
import { deleteFerry } from "../../../services/ferryService";
const FerryListPage = () => {

    const [ferries, setFerries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchFerries();

    }, []);

    const fetchFerries = async () => {

        try {

            const response = await getAllFerries();
            console.log(response);
            setFerries(response.ferries);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };
    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this ferry?"
        );

        if (!confirmed) return;

        try {

            const response = await deleteFerry(id);

            toast.success(response.message);

            fetchFerries();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to delete ferry"
            );

        }

    };
    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                Ferry List
            </h1>

            {ferries.length === 0 ? (
                <p>No ferries found.</p>
            ) : (
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Registration</th>
                            <th>Capacity</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ferries.map((ferry) => (
                            <tr key={ferry._id}>
                                <td>{ferry.name}</td>
                                <td>{ferry.registrationNumber}</td>
                                <td>{ferry.capacity}</td>
                                <td>{ferry.status}</td>

                                <td className="space-x-2">

                                    <Link
                                        to={`/admin/ferries/edit/${ferry._id}`}
                                        className="btn btn-warning btn-sm"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(ferry._id)}
                                        className="btn btn-error btn-sm"
                                    >
                                        Delete
                                    </button>
                                    <Link
                                        to={`/admin/ferries/${ferry._id}`}
                                        className="btn btn-info btn-sm"
                                    >
                                        View
                                    </Link>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default FerryListPage;