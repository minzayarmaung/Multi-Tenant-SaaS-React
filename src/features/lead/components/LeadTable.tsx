import { LeadStatus } from "../../../data/enums/LeadStatus";
import LeadStatusBadge from "./LeadStatusBadge";
import type { LeadResponse } from "../dto/response/LeadResponse";

interface Props {
    leads:          LeadResponse[];
    isCompanyAdmin: boolean;
    onEdit:         (lead: LeadResponse) => void;
    onAssign:       (lead: LeadResponse) => void;
    onStatusChange: (id: number, status: LeadStatus) => void;
}

const LeadTable = ({ leads, isCompanyAdmin, onEdit, onAssign, onStatusChange }: Props) => {
    if (leads.length === 0) {
        return (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-12
                            text-center text-slate-500 text-sm">
                No leads found.
                {isCompanyAdmin && " Create one to get started."}
            </div>
        );
    }

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-slate-700 bg-slate-700/50">
                        {["ID", "Name", "Email", "Phone", "Status", "Assigned To", "Actions"]
                            .map((h) => (
                                <th key={h} className="text-left text-slate-400 font-medium
                                                       px-4 py-3 text-xs uppercase tracking-wider">
                                    {h}
                                </th>
                            ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-700/30 transition-colors">

                            <td className="px-4 py-3 text-slate-400 text-xs">{lead.id}</td>

                            <td className="px-4 py-3 text-white font-medium">{lead.name}</td>

                            <td className="px-4 py-3 text-slate-300">{lead.email || "-"}</td>

                            <td className="px-4 py-3 text-slate-300">{lead.phone || "-"}</td>

                            {/* Inline status dropdown */}
                            <td className="px-4 py-3">
                                <div className="relative">
                                    <select
                                        value={lead.leadStatus}
                                        onChange={(e) =>
                                            onStatusChange(lead.id, e.target.value as LeadStatus)}
                                        className="bg-slate-700 border border-slate-600 text-slate-200
                                                   rounded-lg px-2 py-1.5 text-xs
                                                   focus:outline-none focus:ring-2 focus:ring-blue-500
                                                   cursor-pointer transition-all appearance-none pr-6"
                                    >
                                        {Object.values(LeadStatus).map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Badge below dropdown */}
                                <div className="mt-1">
                                    <LeadStatusBadge status={lead.leadStatus} />
                                </div>
                            </td>

                            {/* Assigned To */}
                            <td className="px-4 py-3">
                                {lead.assignedToEmail ? (
                                    <span className="text-slate-300 text-xs">
                                        {lead.assignedToEmail}
                                    </span>
                                ) : (
                                    <span className="text-xs px-2 py-1 bg-slate-700
                                                     text-slate-500 rounded-full border
                                                     border-slate-600">
                                        Unassigned
                                    </span>
                                )}
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3">
                                {isCompanyAdmin && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onEdit(lead)}
                                            className="text-xs bg-blue-500/10 hover:bg-blue-500/20
                                                       text-blue-400 border border-blue-500/20
                                                       px-3 py-1.5 rounded-lg transition-all"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onAssign(lead)}
                                            className="text-xs bg-purple-500/10 hover:bg-purple-500/20
                                                       text-purple-400 border border-purple-500/20
                                                       px-3 py-1.5 rounded-lg transition-all"
                                        >
                                            Assign
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LeadTable;