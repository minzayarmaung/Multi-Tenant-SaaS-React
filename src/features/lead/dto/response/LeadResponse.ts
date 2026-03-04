export interface LeadResponse {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    leadStatus: string;
    companyId: number;
    companyName: string;
    assignedToId?: number;
    assignedToEmail?: string;
    createdAt: string;
    updatedAt: string;
}