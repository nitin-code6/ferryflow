import { Link } from "react-router";
import { Plus } from "lucide-react";

const AdminPageHeader = ({
    title,
    description,
    buttonText,
    buttonLink,
}) => {
    return (
        <div
            className="
            bg-base-100/90
            backdrop-blur-xl
            rounded-2xl
            border
            border-base-300/40
            shadow-md
            p-5
            mb-6
            "
        >

            {/* Breadcrumb */}

            <div className="text-sm text-base-content/60 mb-2">

                <Link
                    to="/admin/dashboard"
                    className="
                    hover:text-primary
                    transition-colors
                    "
                >
                    Dashboard
                </Link>

                <span className="mx-2">/</span>

                <span className="text-base-content">
                    {title}
                </span>

            </div>

            {/* Header */}

            <div
                className="
                flex
                flex-col
                gap-4
                md:flex-row
                md:items-center
                md:justify-between
                "
            >

                <div>

                    <h1
                        className="
                        text-2xl
                        md:text-3xl
                        font-bold
                        "
                    >
                        {title}
                    </h1>

                    <p
                        className="
                        mt-1
                        text-sm
                        md:text-base
                        text-base-content/70
                        "
                    >
                        {description}
                    </p>

                </div>

                {
                    buttonText &&
                    buttonLink && (

                        <Link
                            to={buttonLink}
                            className="
        inline-flex
        items-center
        justify-center
        gap-2

        h-11
        px-5

        rounded-xl

        bg-gradient-to-r
        from-blue-600
        to-cyan-500

        text-white
        font-semibold

        shadow-md

        hover:from-blue-700
        hover:to-cyan-600

        hover:shadow-lg

        transition-all
        duration-300
    "
                        >
                            <Plus size={18} />

                            {buttonText}
                        </Link>

                    )
                }

            </div>

        </div>
    );
};

export default AdminPageHeader;