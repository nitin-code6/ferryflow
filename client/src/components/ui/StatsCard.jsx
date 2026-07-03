const StatsCard = ({
    title,
    value,
    icon,
    color,
}) => {
    return (
        <div
            className="
            bg-base-100/90
            backdrop-blur-xl
            rounded-xl
            border
            border-base-300/40
            shadow-md
            p-4

            transition-all
            duration-200

            hover:shadow-lg
            hover:border-primary/30
            "
        >
            <div className="flex items-center justify-between">

                {/* Left */}

                <div>

                    <p
                        className="
                        text-xs
                        uppercase
                        tracking-wide
                        text-base-content/60
                        "
                    >
                        {title}
                    </p>

                    <h2
                        className="
                        mt-1
                        text-2xl
                        font-bold
                        leading-none
                        "
                    >
                        {value}
                    </h2>

                </div>

                {/* Right */}

                <div
                    className={`
                    h-11
                    w-11
                    rounded-xl

                    flex
                    items-center
                    justify-center

                    text-white

                    ${color}
                    `}
                >
                    {icon}
                </div>

            </div>
        </div>
    );
};

export default StatsCard;