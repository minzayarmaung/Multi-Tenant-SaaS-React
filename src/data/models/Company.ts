import { Status } from "../enums/Status";

export interface Company {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    status: Status;
    createdAt: string;
}