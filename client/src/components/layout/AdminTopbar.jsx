import { Bell, Moon, Search } from "lucide-react";

const AdminTopbar = () => {
    return (
        <header className="h-16 bg-base-100 border-b px-6 flex items-center justify-between">

            {/* Left */}
            <h1 className="text-xl font-semibold">
                Admin Dashboard
            </h1>

            {/* Right */}
            <div className="flex items-center gap-4">

                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="input input-bordered pl-10 w-64"
                    />
                </div>

                <button className="btn btn-ghost btn-circle">
                    <Bell size={20} />
                </button>

                <button className="btn btn-ghost btn-circle">
                    <Moon size={20} />
                </button>

                <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-10">
                        <span>A</span>
                    </div>
                </div>

            </div>

        </header>
    );
};

export default AdminTopbar;