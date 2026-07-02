import { useEffect, useState } from "react";

import { getAllFerries } from "../../../services/ferryService";

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
                        </tr>
                    </thead>

                    <tbody>
                        {ferries.map((ferry) => (
                            <tr key={ferry._id}>
                                <td>{ferry.name}</td>
                                <td>{ferry.registrationNumber}</td>
                                <td>{ferry.capacity}</td>
                                <td>{ferry.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default FerryListPage;