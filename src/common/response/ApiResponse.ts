export interface ApiResponse<T = unknown> {
    success: number;
    code: number;
    message: string;
    data?: T;
    meta?: Record<string, unknown>;
}