import Navbar from "@/components/navbar/Navbar"

const LandingPage = () => {
    return (
        <>
            <Navbar />

            <div className="min-h-[90vh] flex flex-col items-center justify-center">
                <h1 className="text-6xl font-bold">
                    FerryFlow
                </h1>

                <p className="mt-4 text-lg">
                    Real-Time Ferry Operations & Passenger Management System
                </p>

                <button className="btn btn-primary mt-6">
                    Book Tickets
                </button>
            </div>
        </>
    );
};

export default LandingPage;