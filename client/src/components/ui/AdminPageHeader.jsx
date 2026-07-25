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
            bg-white
            dark:bg-[#0F1D36]
            rounded-2xl
            border
            border-slate-200
            dark:border-sky-950/80
            shadow-sm
            p-5
            mb-6
            "
        >

            {/* Breadcrumb */}

            <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">

                <Link
                    to="/admin/dashboard"
                    className="
                    hover:text-[#2563EB]
                    dark:hover:text-[#00A8FF]
                    transition-colors
                    "
                >
                    Dashboard
                </Link>

                <span className="mx-2">/</span>

                <span className="text-slate-800 dark:text-white font-semibold">
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

                <div className="text-left">

                    <h1
                        className="
                        text-xl
                        md:text-2xl
                        font-bold
                        text-slate-800
                        dark:text-white
                        "
                    >
                        {title}
                    </h1>

                    <p
                        className="
                        mt-1
                        text-xs
                        md:text-sm
                        text-slate-500
                        dark:text-slate-400
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