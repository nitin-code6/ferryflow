import { useEffect, useState } from "react";
import { Mail, User, Clock, CheckCheck, HelpCircle, Search, Inbox, CheckCircle2 } from "lucide-react";
import { getAllInquiries, resolveInquiry } from "../../../services/supportService";
import { socket } from "../../../services/socketService";
import StatusBadge from "../../../components/ui/StatusBadge";
import AdminPageHeader from "../../../components/ui/AdminPageHeader";
import SearchBar from "../../../components/ui/SearchBar";
import EmptyState from "../../../components/ui/EmptyState";
import toast from "react-hot-toast";

const InquiryListPage = () => {
    const [inquiries, setInquiries] = useState([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [loading, setLoading] = useState(true);

    const fetchInquiries = async () => {
        try {
            const res = await getAllInquiries();
            setInquiries(res.data || []);
        } catch (error) {
            console.error("Failed to load inquiries:", error);
            toast.error("Failed to fetch support inquiries.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();

        socket.on("inquiry:created", (newInquiry) => {
            setInquiries((prev) => [newInquiry, ...prev]);
            toast.success(`New help desk inquiry received from ${newInquiry.name}!`);
        });

        socket.on("inquiry:resolved", ({ id, status }) => {
            setInquiries((prev) => 
                prev.map((item) => item._id === id ? { ...item, status } : item)
            );
        });

        return () => {
            socket.off("inquiry:created");
            socket.off("inquiry:resolved");
        };
    }, []);

    const handleResolve = async (id) => {
        try {
            const res = await resolveInquiry(id);
            if (res.success) {
                toast.success("Inquiry successfully marked as resolved!");
                setInquiries(prev => 
                    prev.map(item => item._id === id ? { ...item, status: "resolved" } : item)
                );
            }
        } catch (error) {
            console.error("Failed to resolve inquiry:", error);
            toast.error("Failed to mark inquiry as resolved.");
        }
    };

    // Filter and search logic
    const filteredInquiries = inquiries.filter((item) => {
        const matchesSearch = 
            item.name?.toLowerCase().includes(search.toLowerCase()) ||
            item.email?.toLowerCase().includes(search.toLowerCase()) ||
            item.subject?.toLowerCase().includes(search.toLowerCase()) ||
            item.message?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = 
            filterStatus === "all" || 
            item.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const pendingCount = inquiries.filter(i => i.status === "pending").length;
    const resolvedCount = inquiries.filter(i => i.status === "resolved").length;

    // Stat cards data
    const stats = [
        {
            title: "Total Inquiries",
            value: inquiries.length,
            icon: Inbox,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Pending Help Desk",
            value: pendingCount,
            icon: Clock,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        },
        {
            title: "Resolved Inquiries",
            value: resolvedCount,
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        }
    ];

    return (
        <div className="space-y-6 pb-12 text-slate-800 dark:text-slate-100">
            <AdminPageHeader
                title="Support Desk Inquiries"
                description="Manage passenger feedback, help inquiries, and general queries submitted through the portal."
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div 
                        key={idx} 
                        className="bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 p-5 rounded-3xl shadow-sm flex items-center gap-4"
                    >
                        <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">{stat.title}</span>
                            <span className="text-2xl font-black text-slate-900 dark:text-white block mt-0.5">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterStatus("all")}
                        className={`btn btn-sm rounded-xl font-bold transition-all ${
                            filterStatus === "all" ? "btn-primary text-white" : "btn-ghost"
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterStatus("pending")}
                        className={`btn btn-sm rounded-xl font-bold transition-all ${
                            filterStatus === "pending" ? "btn-primary text-white" : "btn-ghost"
                        }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilterStatus("resolved")}
                        className={`btn btn-sm rounded-xl font-bold transition-all ${
                            filterStatus === "resolved" ? "btn-primary text-white" : "btn-ghost"
                        }`}
                    >
                        Resolved
                    </button>
                </div>

                <div className="w-full md:w-80">
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Search name, email, message..."
                    />
                </div>
            </div>

            {/* Main Table Content */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : filteredInquiries.length === 0 ? (
                <EmptyState
                    title="No Inquiries Found"
                    description={search ? "Adjust your search filters to find what you are looking for." : "No customer support inquiries are currently open."}
                    buttonText="Reset Search"
                    onButtonClick={() => { setSearch(""); setFilterStatus("all"); }}
                />
            ) : (
                <div className="bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 rounded-3xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                                    <th className="py-4 pl-6">Customer Info</th>
                                    <th className="py-4">Issue Details</th>
                                    <th className="py-4">Message Context</th>
                                    <th className="py-4">Status</th>
                                    <th className="py-4 pr-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInquiries.map((item) => (
                                    <tr 
                                        key={item._id} 
                                        className="border-b border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-all font-semibold"
                                    >
                                        <td className="py-4 pl-6">
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 dark:text-white font-black text-sm">{item.name}</span>
                                                <span className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 font-bold">
                                                    <Mail size={12} className="text-slate-400 shrink-0" />
                                                    {item.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 dark:text-white font-black text-sm capitalize">{item.subject.replace(/_/g, " ")}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                                    Created: {new Date(item.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 max-w-xs md:max-w-md">
                                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                                                {item.message}
                                            </p>
                                        </td>
                                        <td className="py-4">
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td className="py-4 pr-6 text-right">
                                            {item.status === "pending" ? (
                                                <button
                                                    onClick={() => handleResolve(item._id)}
                                                    className="btn btn-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border-0 btn-xs rounded-lg px-3 py-1 text-xs font-bold transition-all"
                                                >
                                                    Resolve
                                                </button>
                                            ) : (
                                                <span className="text-xs text-emerald-500 flex items-center justify-end gap-1 font-bold pr-2">
                                                    <CheckCheck size={14} /> Solved
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InquiryListPage;
