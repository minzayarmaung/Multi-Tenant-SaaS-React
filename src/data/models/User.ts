import { Role } from "../enums/Role";
import { Status } from "../enums/Status";

export interface User {
    id: number;
    email: string;
    role: Role;
    status: Status;
    companyId?: number;
    companyName?: string;
    createdAt: string;
}