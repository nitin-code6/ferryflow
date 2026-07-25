const StatsCard = ({
    title,
    value,
    icon,
    color,
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
            transition-all
            duration-200
            hover:shadow-md
            "
        >
            <div className="flex items-center justify-between">
                {/* Left */}
                <div>
                    <p
                        className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-slate-400
                        dark:text-slate-450
                        "
                    >
                        {title}
                    </p>

                    <h2
                        className="
                        mt-1.5
                        text-xl
                        font-bold
                        leading-none
                        text-slate-800
                        dark:text-white
                        "
                    >
                        {value}
                    </h2>
                </div>

                {/* Right */}
                <div
                    className={`
                    h-10
                    w-10
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    text-white
                    shrink-0
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