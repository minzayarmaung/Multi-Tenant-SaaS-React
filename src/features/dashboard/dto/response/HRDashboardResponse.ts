export interface HRDashboardResponse {
    openLeads: number;
    closedLeads: number;
    totalUsers: number;
    totalLeads: number;
    unassignedLeads: number;
    leadStatusBreakdown: Record<string, number>;
}
