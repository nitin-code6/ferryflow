export const DotsLoader = () => {
    return (
        <div className="flex space-x-2.5 justify-center items-center h-48" aria-label="Loading...">
            <div className="w-4.5 h-4.5 rounded-full bg-[#2563EB] animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-4.5 h-4.5 rounded-full bg-[#0EA5E9] animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-4.5 h-4.5 rounded-full bg-[#22D3EE] animate-bounce"></div>
        </div>
    );
};

export const TableSkeleton = ({ rows = 5 }) => {
    return (
        <div className="w-full space-y-4 animate-pulse">
            <div className="h-12 bg-base-300/40 rounded-2xl w-full"></div>
            {Array.from({ length: rows }).map((_, i) => (
                <div
                    key={i}
                    className="h-16 bg-base-200/40 border border-base-300/10 rounded-2xl w-full flex items-center px-6 justify-between"
                >
                    <div className="h-5 bg-base-300/40 rounded-lg w-1/4"></div>
                    <div className="h-5 bg-base-300/40 rounded-lg w-1/5"></div>
                    <div className="h-5 bg-base-300/40 rounded-lg w-12"></div>
                    <div className="h-7 bg-base-300/40 rounded-full w-24"></div>
                    <div className="h-8 bg-base-300/40 rounded-xl w-24"></div>
                </div>
            ))}
        </div>
    );
};

export const DetailSkeleton = () => {
    return (
        <div className="w-full max-w-2xl bg-base-100/90 rounded-[28px] border border-white/20 shadow-lg p-6 lg:p-8 space-y-6 animate-pulse">
            <div className="h-8 bg-base-300/40 rounded-xl w-1/3 mb-8"></div>
            <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-base-300/10">
                        <div className="h-5 bg-base-300/40 rounded-lg w-1/4"></div>
                        <div className="h-5 bg-base-300/40 rounded-lg w-1/3"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LoadingSkeleton = ({ variant = "table", rows }) => {
    if (variant === "dots") {
        return <DotsLoader />;
    }
    if (variant === "details") {
        return <DetailSkeleton />;
    }
    return <TableSkeleton rows={rows} />;
};

export default LoadingSkeleton;
