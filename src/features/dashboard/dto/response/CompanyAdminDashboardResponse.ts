export interface CompanyAdminDashboardResponse {
    totalUsers: number;
    totalLeads: number;
    assignedLeads: number;
    unassignedLeads: number;
    leadStatusBreakdown: Record<string, number>;
}