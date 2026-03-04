/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../../../config/axiosConfig";
import { ENDPOINTS } from "../../../config/apiConfig";
import type { ApiResponse } from "../../../common/response/ApiResponse";

const DashboardService = {
    getDashboard: async (): Promise<ApiResponse<any>> => {
        const response = await axiosInstance.get(ENDPOINTS.DASHBOARD.BASE);
        return response.data;
    }
};

export default DashboardService;