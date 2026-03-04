import { Role } from "../../../../data/enums/Role";

export interface LoginResponse {
    id: number;
    email: string;
    role: Role;
    companyId?: number;
    companyName?: string;
}