export interface PaginationRequest {
    keyword?: string;
    page: number;
    size: number;
    sortField: string;
    sortDirection: "asc" | "desc";
}

export const defaultPagination: PaginationRequest = {
    page: 0,
    size: 10,
    sortField: "createdAt",
    sortDirection: "desc"
};