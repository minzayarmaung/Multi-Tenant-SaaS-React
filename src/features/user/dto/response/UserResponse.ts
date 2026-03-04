export interface UserResponse {
    id: number;
    email: string;
    role: string;
    status: string;
    companyId?: number;
    companyName?: string;
    createdAt: string;
}