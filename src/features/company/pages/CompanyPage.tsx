/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CompanyService from "../service/CompanyService";
import CompanyTable   from "../components/CompanyTable";
import CompanyForm    from "../components/CompanyForm";
import type { CompanyResponse } from "../dto/response/CompanyResponse";
import { defaultPagination } from "../../../common/request/PaginationRequest";
import Sidebar from "../../dashboard/components/Sidebar";

const CompanyPage = () => {
    const [companies,  setCompanies]  = useState<CompanyResponse[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page,       setPage]       = useState(0);
    const [showForm,   setShowForm]   = useState(false);
    const [editing,    setEditing]    = useState<CompanyResponse | null>(null);
    const [loading,    setLoading]    = useState(true);

    const fetchCompanies = async (p = 0) => {
        setLoading(true);
        try {
            const res = await CompanyService.getAll({ ...defaultPagination, page: p });
            setCompanies(res.data);
            setTotalPages(res.meta.totalPages);
        } catch {
            toast.error("Failed to load companies.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCompanies(page); }, [page]);

    const handleCreate = async (data: any) => {
        await CompanyService.create(data);
        setShowForm(false);
        fetchCompanies(page);
    };

    const handleUpdate = async (data: any) => {
        if (!editing) return;
        await CompanyService.update(editing.id, data);
        setEditing(null);
        fetchCompanies(page);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this company?")) return;
        try {
            await CompanyService.delete(id);
            toast.success("Company deleted.");
            fetchCompanies(page);
        } catch {
            toast.error("Failed to delete company.");
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-900">
            <Sidebar />

            <main className="flex-1 p-8 overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Companies</h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Manage all tenant companies in the system
                        </p>
                    </div>
                    <button
                        onClick={() => { setShowForm(true); setEditing(null); }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500
                                   text-white text-sm font-medium px-4 py-2.5 rounded-lg
                                   transition-all"
                    >
                        <span className="text-lg leading-none">+</span>
                        Create Company
                    </button>
                </div>

                {/* Form */}
                {(showForm || editing) && (
                    <CompanyForm
                        initial={editing}
                        onSubmit={editing ? handleUpdate : handleCreate}
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
                        Loading companies...
                    </div>
                ) : (
                    <>
                        {/* Table */}
                        <CompanyTable
                            companies={companies}
                            onEdit={(c) => { setEditing(c); setShowForm(false); }}
                            onDelete={handleDelete}
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
        </div>
    );
};

export default CompanyPage;