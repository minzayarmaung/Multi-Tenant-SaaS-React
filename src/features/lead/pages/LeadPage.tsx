/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../../security/hooks/useAuth";
import { Role } from "../../../data/enums/Role";
import { LeadStatus } from "../../../data/enums/LeadStatus";
import LeadService from "../service/LeadService";
import LeadForm         from "../components/LeadForm";
import LeadTable        from "../components/LeadTable";
import AssignLeadModal  from "../components/AssignLeadModal";
import type { LeadResponse } from "../dto/response/LeadResponse";
import { defaultPagination } from "../../../common/request/PaginationRequest";
import Sidebar from "../../dashboard/components/Sidebar";

const LeadPage = () => {
    const { user }                      = useAuth();
    const [leads,      setLeads]        = useState<LeadResponse[]>([]);
    const [totalPages, setTotalPages]   = useState(0);
    const [page,       setPage]         = useState(0);
    const [loading,    setLoading]      = useState(true);
    const [showForm,   setShowForm]     = useState(false);
    const [editing,    setEditing]      = useState<LeadResponse | null>(null);
    const [assigning,  setAssigning]    = useState<LeadResponse | null>(null);

    const isCompanyAdmin = user?.role === Role.COMPANY_ADMIN;
    const isUser         = user?.role === Role.USER;

    const fetchLeads = async (p = 0) => {
        setLoading(true);
        try {
            const res = isUser
                ? await LeadService.getMyLeads({ ...defaultPagination, page: p })
                : await LeadService.getCompanyLeads({ ...defaultPagination, page: p });
            setLeads(res.data);
            setTotalPages(res.meta.totalPages);
        } catch {
            toast.error("Failed to load leads.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLeads(page); }, [page]);

    const handleSubmit = async (data: { name: string; email: string; phone: string }) => {
        if (editing) {
            await LeadService.update(editing.id, data);
        } else {
            await LeadService.create(data);
        }
        setShowForm(false);
        setEditing(null);
        fetchLeads(page);
    };

    const handleStatusChange = async (id: number, status: LeadStatus) => {
        try {
            await LeadService.updateStatus(id, status);
            toast.success("Status updated.");
            fetchLeads(page);
        } catch {
            toast.error("Failed to update status.");
        }
    };

    const handleAssign = async (userId: number) => {
        if (!assigning) return;
        await LeadService.assign(assigning.id, userId);
        fetchLeads(page);
    };

    return (
        <div className="flex min-h-screen bg-slate-900">
            <Sidebar />

            <main className="flex-1 p-8 overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {isUser ? "My Leads" : "Leads"}
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            {isUser
                                ? "Leads currently assigned to you"
                                : "Manage and track all leads in your company"}
                        </p>
                    </div>
                    {isCompanyAdmin && (
                        <button
                            onClick={() => { setShowForm(true); setEditing(null); }}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500
                                       text-white text-sm font-medium px-4 py-2.5 rounded-lg
                                       transition-all"
                        >
                            <span className="text-lg leading-none">+</span>
                            Create Lead
                        </button>
                    )}
                </div>

                {/* Lead Form */}
                {(showForm || editing) && (
                    <LeadForm
                        editing={editing}
                        onSubmit={handleSubmit}
                        onCancel={() => { setShowForm(false); setEditing(null); }}
                    />
                )}

                {/* Loading */}
                {loading ? (
                    <div className="flex items-center gap-3 text-slate-400 py-12 justify-center">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10"
                                    stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor"
                                  d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Loading leads...
                    </div>
                ) : (
                    <>
                        <LeadTable
                            leads={leads}
                            isCompanyAdmin={isCompanyAdmin}
                            onEdit={(lead) => { setEditing(lead); setShowForm(false); }}
                            onAssign={(lead) => setAssigning(lead)}
                            onStatusChange={handleStatusChange}
                        />

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6">
                                <p className="text-slate-400 text-sm">
                                    Page <span className="text-white">{page + 1}</span> of{" "}
                                    <span className="text-white">{totalPages}</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        disabled={page === 0}
                                        onClick={() => setPage(p => p - 1)}
                                        className="px-3 py-2 rounded-lg text-sm bg-slate-800
                                                   border border-slate-700 text-slate-300
                                                   hover:bg-slate-700 disabled:opacity-40
                                                   disabled:cursor-not-allowed transition-all"
                                    >
                                        ← Prev
                                    </button>
                                    <button
                                        disabled={page + 1 >= totalPages}
                                        onClick={() => setPage(p => p + 1)}
                                        className="px-3 py-2 rounded-lg text-sm bg-slate-800
                                                   border border-slate-700 text-slate-300
                                                   hover:bg-slate-700 disabled:opacity-40
                                                   disabled:cursor-not-allowed transition-all"
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Assign Modal — rendered outside table so it overlays correctly */}
            {assigning && (
                <AssignLeadModal
                    leadId={assigning.id}
                    leadName={assigning.name}
                    onAssign={handleAssign}
                    onClose={() => setAssigning(null)}
                />
            )}
        </div>
    );
};

export default LeadPage;