import { Link } from "react-router";

const EmptyState = ({
    title = "No Data Found",
    description = "There are no records to display at the moment.",
    icon,
    buttonText,
    buttonLink,
    onButtonClick,
}) => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 md:p-16 max-w-xl mx-auto rounded-[28px] bg-base-100/50 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] my-6">
            {icon && (
                <div className="mb-6 p-4 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-inner animate-pulse duration-3000">
                    {icon}
                </div>
            )}
            
            <h3 className="text-2xl font-bold tracking-tight text-base-content">
                {title}
            </h3>
            
            <p className="mt-2 text-sm md:text-base text-base-content/60 leading-relaxed max-w-sm">
                {description}
            </p>

            {buttonText && (
                <div className="mt-8">
                    {buttonLink ? (
                        <Link
                            to={buttonLink}
                            className="btn h-12 border-0 rounded-xl px-6 text-white bg-gradient-to-r from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] hover:scale-[1.02] hover:shadow-xl transition-all duration-300 font-semibold"
                        >
                            {buttonText}
                        </Link>
                    ) : (
                        <button
                            onClick={onButtonClick}
                            className="btn h-12 border-0 rounded-xl px-6 text-white bg-gradient-to-r from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] hover:scale-[1.02] hover:shadow-xl transition-all duration-300 font-semibold"
                        >
                            {buttonText}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
