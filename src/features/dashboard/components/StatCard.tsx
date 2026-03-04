interface StatCardProps {
    label: string;
    value: number | string;
    icon: React.ReactNode;
    color: "blue" | "green" | "purple" | "orange" | "red";
}

const colorMap = {
    blue:   { bg: "bg-blue-500/10",   text: "text-blue-400",   border: "border-blue-500/20"   },
    green:  { bg: "bg-green-500/10",  text: "text-green-400",  border: "border-green-500/20"  },
    purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
    orange: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
    red:    { bg: "bg-red-500/10",    text: "text-red-400",    border: "border-red-500/20"    },
};

const StatCard = ({ label, value, icon, color }: StatCardProps) => {
    const c = colorMap[color];
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-center gap-4">
            <div className={`${c.bg} ${c.border} border p-3 rounded-lg`}>
                <div className={`${c.text} w-6 h-6`}>{icon}</div>
            </div>
            <div>
                <p className="text-slate-400 text-sm">{label}</p>
                <p className="text-white text-2xl font-bold mt-0.5">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;