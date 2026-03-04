export const API_BASE_URL = "http://localhost:8080/multi-tenant-SaaS-management/api/v1";

export const ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN:   "/auth/login",
        LOGOUT:  "/auth/logout",
        REFRESH: "/auth/refresh",
    },
    // Companies
    COMPANIES: {
        BASE:   "/companies",
        BY_ID:  (id: number) => `/companies/${id}`,
    },
    // Users
    USERS: {
        BASE:       "/users",
        MEMBERS:    "/users/members",
        COMPANY:    "/users/company",
        BY_ID:      (id: number) => `/users/${id}`,
    },
    // Leads
    LEADS: {
        BASE:       "/leads",
        MY:         "/leads/my",
        BY_ID:      (id: number) => `/leads/${id}`,
        STATUS:     (id: number) => `/leads/${id}/status`,
        ASSIGN:     (id: number) => `/leads/${id}/assign`,
    },
    // Dashboard
    DASHBOARD: {
        BASE: "/dashboard",
    }
};