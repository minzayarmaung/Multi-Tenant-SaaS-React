/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAuth } from "../../../security/hooks/useAuth";
import { Role } from "../../../data/enums/Role";
import DashboardService from "../service/DashboardService";
import StatCard from "../components/StatCard";
import LeadStatusChart from "../components/LeadStatusChart";
import type { SystemAdminDashboardResponse }  from "../dto/response/SystemAdminDashboardResponse";
import type { CompanyAdminDashboardResponse } from "../dto/response/CompanyAdminDashboardResponse";
import type { UserDashboardResponse }         from "../dto/response/UserDashboardResponse";
import Sidebar from "../components/Sidebar";

const STATUS_COLORS: Record<string, string> = {
    NEW:       "#3b82f6",
    CONTACTED: "#8b5cf6",
    QUALIFIED: "#10b981",
    LOST:      "#ef4444",
    CONVERTED: "#f59e0b",
};

const DashboardPage = () => {
    const { user }          = useAuth();
    const [data,  setData]  = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        DashboardService.getDashboard()
            .then((res) => setData(res.data))
            .catch(() => setError("Failed to load dashboard."));
    }, []);

    return (
        <div className="flex min-h-screen bg-slate-900">
            <Sidebar />

            <main className="flex-1 p-8 overflow-y-auto">

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Welcome back,{" "}
                        <span className="text-blue-400">{user?.email}</span>
                        <span className="ml-2 px-2 py-0.5 bg-blue-500/10 text-blue-400
                                         border border-blue-500/20 rounded-full text-xs">
                            {user?.role}
                        </span>
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400
                                    rounded-lg px-4 py-3 mb-6 text-sm">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {!data && !error && (
                    <div className="flex items-center gap-3 text-slate-400">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10"
                                    stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor"
                                  d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Loading dashboard...
                    </div>
                )}

                {data && (
                    <>
                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                            {user?.role === Role.SYSTEM_ADMIN && (
                                <SystemAdminStats data={data as SystemAdminDashboardResponse} />
                            )}
                            {user?.role === Role.COMPANY_ADMIN && (
                                <CompanyAdminStats data={data as CompanyAdminDashboardResponse} />
                            )}
                            {user?.role === Role.USER && (
                                <UserStats data={data as UserDashboardResponse} />
                            )}
                        </div>

                        {/* Lead Status Chart */}
                        {data.leadStatusBreakdown &&
                         Object.keys(data.leadStatusBreakdown).length > 0 && (
                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                                <h2 className="text-white font-semibold text-base mb-1">
                                    Lead Status Breakdown
                                </h2>
                                <p className="text-slate-400 text-sm mb-6">
                                    Distribution of leads by current status
                                </p>
                                <LeadStatusChart breakdown={data.leadStatusBreakdown} />

                                {/* Legend */}
                                <div className="flex flex-wrap gap-4 mt-4">
                                    {Object.entries(data.leadStatusBreakdown).map(([status, count]) => (
                                        <div key={status} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full"
                                                 style={{ backgroundColor: STATUS_COLORS[status] || "#64748b" }}
                                            />
                                            <span className="text-slate-400 text-xs">
                                                {status} ({count as number})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

// ── Role-specific stat blocks ─────────────────────────────────

const SystemAdminStats = ({ data }: { data: SystemAdminDashboardResponse }) => (
    <>
        <StatCard label="Total Companies"  value={data.totalCompanies}
                  icon={<BuildingIcon />}  color="blue" />
        <StatCard label="Active Companies" value={data.activeCompanies}
                  icon={<CheckIcon />}     color="green" />
        <StatCard label="Total Users"      value={data.totalUsers}
                  icon={<UsersIcon />}     color="purple" />
        <StatCard label="Total Leads"      value={data.totalLeads}
                  icon={<LeadsIcon />}     color="orange" />
    </>
);

const CompanyAdminStats = ({ data }: { data: CompanyAdminDashboardResponse }) => (
    <>
        <StatCard label="Total Users"      value={data.totalUsers}
                  icon={<UsersIcon />}     color="purple" />
        <StatCard label="Total Leads"      value={data.totalLeads}
                  icon={<LeadsIcon />}     color="blue" />
        <StatCard label="Assigned Leads"   value={data.assignedLeads}
                  icon={<CheckIcon />}     color="green" />
        <StatCard label="Unassigned Leads" value={data.unassignedLeads}
                  icon={<ClockIcon />}     color="orange" />
    </>
);

const UserStats = ({ data }: { data: UserDashboardResponse }) => (
    <>
        <StatCard label="Assigned to Me" value={data.totalAssignedLeads}
                  icon={<LeadsIcon />}   color="blue" />
        <StatCard label="Open Leads"     value={data.openLeads}
                  icon={<ClockIcon />}   color="orange" />
        <StatCard label="Closed Leads"   value={data.closedLeads}
                  icon={<CheckIcon />}   color="green" />
    </>
);

// ── Icons ─────────────────────────────────────────────────────
const BuildingIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9
                 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1
                 1 0 011 1v5m-4 0h4" />
    </svg>
);
const UsersIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7
                 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0
                 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const LeadsIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0
                 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2
                 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2
                 2 0 01-2-2z" />
    </svg>
);
const CheckIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const ClockIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default DashboardPage;