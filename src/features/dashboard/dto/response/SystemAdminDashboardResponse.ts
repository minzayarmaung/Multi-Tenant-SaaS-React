export interface SystemAdminDashboardResponse {
    totalCompanies: number;
    activeCompanies: number;
    totalUsers: number;
    totalLeads: number;
    leadStatusBreakdown: Record<string, number>;
}