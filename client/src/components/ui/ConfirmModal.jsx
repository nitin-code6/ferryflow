import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmModal = ({
    isOpen,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    isLoading = false,
    variant = "danger", // 'danger' | 'info' | 'warning'
}) => {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const getConfirmButtonClass = () => {
        if (variant === "danger") {
            return "bg-gradient-to-r from-rose-500 via-red-500 to-pink-600 text-white hover:scale-[1.02] hover:shadow-rose-500/20";
        }
        return "bg-gradient-to-r from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] text-white hover:scale-[1.02] hover:shadow-primary/20";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop with blur */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
                onClick={onCancel}
            />

            {/* Modal Card */}
            <div
                className="relative w-full max-w-md bg-base-100/90 backdrop-blur-xl rounded-[28px] border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.18)] p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="flex flex-col items-center text-center">
                    {variant === "danger" && (
                        <div className="mb-4 p-3 rounded-full bg-rose-500/10 text-rose-500">
                            <AlertTriangle size={28} className="animate-pulse" />
                        </div>
                    )}

                    <h3
                        id="modal-title"
                        className="text-xl font-bold tracking-tight text-base-content"
                    >
                        {title}
                    </h3>

                    <p className="mt-3 text-sm md:text-base text-base-content/70 leading-relaxed">
                        {message}
                    </p>

                    <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3 w-full justify-center">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="btn btn-ghost hover:bg-base-200 border border-base-300 rounded-xl px-5 h-12 w-full sm:w-auto font-medium transition-all"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`btn border-0 rounded-xl px-6 h-12 w-full sm:w-auto font-semibold shadow-lg transition-all duration-300 ${getConfirmButtonClass()}`}
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
