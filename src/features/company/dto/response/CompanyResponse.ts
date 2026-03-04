export interface CompanyResponse {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    status: string;
    createdAt: string;
}