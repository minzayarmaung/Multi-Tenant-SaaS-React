export interface UserDashboardResponse {
    totalAssignedLeads: number;
    openLeads: number;
    closedLeads: number;
    leadStatusBreakdown: Record<string, number>;
}