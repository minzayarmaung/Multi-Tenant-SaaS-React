import React, { createContext, useState, useEffect,type ReactNode } from "react";
import { Role } from "../../data/enums/Role";
import axiosInstance from "../../config/axiosConfig";
import { ENDPOINTS } from "../../config/apiConfig";
import type { User } from "../../data/models/User";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    hasRole: (role: Role) => boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser]           = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);  // true on first load

    // On app start — try to restore session from cookie
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem("user");
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, { email, password });
        const userData: User = response.data.data;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // persist across refresh
    };

    const logout = async (): Promise<void> => {
        try {
            await axiosInstance.post(ENDPOINTS.AUTH.LOGOUT);
        } finally {
            setUser(null);
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
    };

    const hasRole = (role: Role): boolean => user?.role === role;

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            login,
            logout,
            isAuthenticated: !!user,
            hasRole,
        }}>
            {children}
        </AuthContext.Provider>
    );
};