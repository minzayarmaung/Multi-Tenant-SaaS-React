export interface PaginationMeta {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    method?: string;
    endpoint?: string;
}

export interface PaginatedApiResponse<T> {
    success: number;
    code: number;
    message: string;
    meta: PaginationMeta;
    data: T[];
}