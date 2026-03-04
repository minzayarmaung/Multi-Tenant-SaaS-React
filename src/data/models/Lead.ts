import { LeadStatus } from "../enums/LeadStatus";

export interface Lead {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    leadStatus: LeadStatus;
    companyId: number;
    companyName: string;
    assignedToId?: number;
    assignedToEmail?: string;
    createdAt: string;
    updatedAt: string;
}