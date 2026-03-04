import axiosInstance from "../../../config/axiosConfig";
import { ENDPOINTS } from "../../../config/apiConfig";
import type { ApiResponse } from "../../../common/response/ApiResponse";
import type { PaginatedApiResponse } from "../../../common/response/PaginatedApiResponse";
import type { PaginationRequest } from "../../../common/request/PaginationRequest";
import type { CompanyResponse } from "../dto/response/CompanyResponse";

const CompanyService = {

    getAll: async (params: PaginationRequest): Promise<PaginatedApiResponse<CompanyResponse>> => {
        const response = await axiosInstance.get(ENDPOINTS.COMPANIES.BASE, { params });
        return response.data;
    },

    getById: async (id: number): Promise<ApiResponse<CompanyResponse>> => {
        const response = await axiosInstance.get(ENDPOINTS.COMPANIES.BY_ID(id));
        return response.data;
    },

    create: async (data: { name: string; email: string; phone?: string; address?: string })
        : Promise<ApiResponse<CompanyResponse>> => {
        const response = await axiosInstance.post(ENDPOINTS.COMPANIES.BASE, data);
        return response.data;
    },

    update: async (id: number, data: { name: string; email: string; phone?: string; address?: string })
        : Promise<ApiResponse<CompanyResponse>> => {
        const response = await axiosInstance.patch(ENDPOINTS.COMPANIES.BY_ID(id), data);
        return response.data;
    },

    delete: async (id: number): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.delete(ENDPOINTS.COMPANIES.BY_ID(id));
        return response.data;
    }
};

export default CompanyService; 