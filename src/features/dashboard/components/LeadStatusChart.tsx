import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from "recharts";

interface Props {
    breakdown: Record<string, number>;
}

const STATUS_COLORS: Record<string, string> = {
    NEW:        "#3b82f6",
    CONTACTED:  "#8b5cf6",
    QUALIFIED:  "#10b981",
    LOST:       "#ef4444",
    CONVERTED:  "#f59e0b",
};

const LeadStatusChart = ({ breakdown }: Props) => {
    const data = Object.entries(breakdown).map(([status, count]) => ({
        status,
        count,
        fill: STATUS_COLORS[status] || "#64748b",
    }));

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-40 text-slate-500 text-sm">
                No lead data available.
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                    dataKey="status"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={{ stroke: "#334155" }}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: 8,
                        color: "#f1f5f9",
                    }}
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default LeadStatusChart;