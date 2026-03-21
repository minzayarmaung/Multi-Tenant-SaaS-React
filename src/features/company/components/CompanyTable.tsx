import { useState } from "react";
import type { CompanyResponse } from "../dto/response/CompanyResponse";

interface Props {
    companies: CompanyResponse[];
    onView: (company: CompanyResponse) => void;
    onEdit: (company: CompanyResponse) => void;
    onDelete: (id: number) => void;
}

const CompanyTable = ({ companies, onView, onEdit, onDelete }: Props) => {
    // 1. State to track the ID of the company being deleted
    const [companyToDelete, setCompanyToDelete] = useState<number | null>(null);

    if (companies.length === 0) {
        return (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center text-slate-500 text-sm">
                No companies found. Create one to get started.
            </div>
        );
    }

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden relative">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-slate-700 bg-slate-700/50">
                        {["ID", "Name", "Email", "Phone", "Address", "Status", "Actions"].map((h) => (
                            <th key={h} className="text-left text-slate-400 font-medium px-4 py-3 text-xs uppercase tracking-wider">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {companies.map((c) => (
                        <tr
                            key={c.id}
                            onClick={() => onView(c)}
                            className="hover:bg-slate-700/40 transition-colors cursor-pointer"
                        >
                            <td className="px-4 py-3 text-slate-400 text-xs">{c.id}</td>
                            <td className="px-4 py-3 text-white font-medium">{c.name}</td>
                            <td className="px-4 py-3 text-slate-300">{c.email}</td>
                            <td className="px-4 py-3 text-slate-300">{c.phone || "-"}</td>
                            <td className="px-4 py-3 text-slate-300">{c.address || "-"}</td>
                            <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border
                                    ${c.status === "ACTIVE"
                                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                                        : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                                    {c.status}
                                </span>
                            </td>
                            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => onEdit(c)}
                                            className="text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-all">
                                        Edit
                                    </button>
                                    {/* 2. Update Delete button to set state instead of direct call */}
                                    <button onClick={() => setCompanyToDelete(c.id)}
                                            className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg transition-all">
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 3. Confirmation Modal Overlay */}
            {companyToDelete !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-semibold text-white mb-2">Confirm Deletion</h3>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            Are you sure you want to delete this company? 
                            <span className="block mt-2 text-red-400 font-medium">
                                Warning: Deleting this company will also deactivate all associated users.
                            </span>
                        </p>
                        
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setCompanyToDelete(null)}
                                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    onDelete(companyToDelete);
                                    setCompanyToDelete(null);
                                }}
                                className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all shadow-lg shadow-red-500/20"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyTable;