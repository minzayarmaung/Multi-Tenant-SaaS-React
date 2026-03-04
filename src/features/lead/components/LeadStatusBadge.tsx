
interface Props {
    status: string;
}

const STATUS_STYLES: Record<string, string> = {
    NEW:       "bg-blue-500/10   text-blue-400   border-blue-500/20",
    CONTACTED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    QUALIFIED: "bg-green-500/10  text-green-400  border-green-500/20",
    LOST:      "bg-red-500/10    text-red-400    border-red-500/20",
    CONVERTED: "bg-amber-500/10  text-amber-400  border-amber-500/20",
};

const LeadStatusBadge = ({ status }: Props) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border
                      ${STATUS_STYLES[status] || "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
        {status}
    </span>
);

export default LeadStatusBadge;