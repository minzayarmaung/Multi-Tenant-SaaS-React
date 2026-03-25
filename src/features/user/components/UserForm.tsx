/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { UserResponse } from "../dto/response/UserResponse";
import type { CompanyResponse } from "../../company/dto/response/CompanyResponse";
import CompanyService from "../../company/service/CompanyService";
import { defaultPagination } from "../../../common/request/PaginationRequest";
import { Role } from "../../../data/enums/Role";

interface Props {
    editing:       UserResponse | null;
    isSystemAdmin: boolean;
    isCompanyAdmin: boolean;
    onSubmit: (data: {name: string; email: string; password: string; role: Role , companyId?: number }) => Promise<void>;
    onCancel: () => void;
}

const UserForm = ({ editing, isSystemAdmin, isCompanyAdmin, onSubmit, onCancel }: Props) => {
    const [name,      setName]      = useState("");
    const [email,     setEmail]     = useState("");
    const [password,  setPassword]  = useState("");
    const [role,      setRole]      = useState<Role>(Role.USER);
    const [companyId, setCompanyId] = useState<number | "">("");
    const [companies, setCompanies] = useState<CompanyResponse[]>([]);
    const [showPass,  setShowPass]  = useState(false);
    const [loading,   setLoading]   = useState(false);

    useEffect(() => {
        setName(editing?.name || "");
        setEmail(editing?.email || "");
        setRole(editing?.role || Role.USER);
        setPassword("");
        setCompanyId("");
    }, [editing]);

    const ASSIGNABLE_ROLES = [Role.USER, Role.HR, Role.COMPANY_ADMIN];

    const getPasswordStrength = (pass: string) => {
        if (!pass) return 0;
        let points = 0;
        if (pass.length > 7) points++; 
        if (/[A-Z]/.test(pass)) points++; 
        if (/[0-9]/.test(pass)) points++; 
        if (/[^A-Za-z0-9]/.test(pass)) points++; 
        return points; 
    };

    const strength = getPasswordStrength(password);

    useEffect(() => {
        if (isSystemAdmin && !editing) {
            CompanyService.getAll({ ...defaultPagination, size: 100 })
                .then((res) => setCompanies(res.data))
                .catch(() => toast.error("Failed to load companies."));
        }
    }, [isSystemAdmin, editing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                name,
                email,
                password,
                role,
                companyId: isSystemAdmin && !editing && companyId !== ""
                    ? Number(companyId) : undefined,
            });
            toast.success(editing ? "User updated." : "User created.");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Request failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-slate-300 text-sm font-medium">
                        Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text" value={name}
                        onChange={(e) => setName(e.target.value)}
                        required placeholder="Mr. David"
                        className="bg-slate-700/50 border border-slate-600 text-white
                                   placeholder-slate-400 rounded-lg px-3 py-2.5 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-blue-500
                                   focus:border-transparent transition-all"
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-slate-300 text-sm font-medium">
                        Email <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="email" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required placeholder="user@company.com"
                        className="bg-slate-700/50 border border-slate-600 text-white
                                   placeholder-slate-400 rounded-lg px-3 py-2.5 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-blue-500
                                   focus:border-transparent transition-all"
                    />
                </div>

                {/* Password Section */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-slate-300 text-sm font-medium">
                        Password{" "}
                        {editing
                            ? <span className="text-slate-500 font-normal text-xs">(blank = keep)</span>
                            : <span className="text-red-400">*</span>}
                    </label>
                    <div className="relative flex items-center">
                        <input
                            type={showPass ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required={!editing} 
                            placeholder="••••••••"
                            className="w-full bg-slate-700/50 border border-slate-600 text-white
                                       placeholder-slate-400 rounded-lg px-3 py-2.5 text-sm pr-10
                                       focus:outline-none focus:ring-2 focus:ring-blue-500
                                       focus:border-transparent transition-all"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 p-1 text-slate-400 hover:text-slate-200 transition-colors z-10"
                        >
                            {showPass ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>

                    {/* Strength Meter */}
                    {password.length > 0 && (
                        <div className="mt-1 space-y-1">
                            <div className="flex gap-1 h-1">
                                {[1, 2, 3, 4].map((lvl) => (
                                    <div key={lvl} className={`h-full flex-1 rounded-full transition-all duration-500 ${
                                        strength >= lvl 
                                            ? strength <= 1 ? "bg-red-500" : strength === 2 ? "bg-yellow-500" : strength === 3 ? "bg-blue-500" : "bg-emerald-500"
                                            : "bg-slate-700"
                                    }`} />
                                ))}
                            </div>
                            <p className="text-[10px] uppercase font-bold text-slate-500">
                                Strength: <span className="text-slate-300">{strength <= 1 ? "Weak" : strength === 2 ? "Fair" : strength === 3 ? "Good" : "Strong"}</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Role Dropdown */}
                {(isCompanyAdmin || isSystemAdmin) && (
                    <div className="flex flex-col gap-1.5">
                        <label className="text-slate-300 text-sm font-medium">
                            Role <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as Role)}
                            required
                            className="bg-slate-700/50 border border-slate-600 text-white
                                       rounded-lg px-3 py-2.5 text-sm
                                       focus:outline-none focus:ring-2 focus:ring-blue-500
                                       focus:border-transparent transition-all"
                        >
                            {ASSIGNABLE_ROLES.map((r) => (
                                <option key={r} value={r} className="bg-slate-800">
                                    {r.replace("_", " ")}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Company Dropdown */}
                {isSystemAdmin && !editing && (
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-slate-300 text-sm font-medium">
                            Company <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={companyId}
                            onChange={(e) => setCompanyId(Number(e.target.value))}
                            required
                            className="bg-slate-700/50 border border-slate-600 text-white
                                       rounded-lg px-3 py-2.5 text-sm
                                       focus:outline-none focus:ring-2 focus:ring-blue-500
                                       focus:border-transparent transition-all"
                        >
                            <option value="" className="bg-slate-800">— Select a company —</option>
                            {companies.map((c) => (
                                <option key={c.id} value={c.id} className="bg-slate-800">
                                    {c.name} (ID: {c.id})
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-slate-700">
                <button type="submit" disabled={loading}
                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60
                                   text-white text-sm font-medium px-5 py-2.5 rounded-lg
                                   transition-all flex items-center gap-2">
                    {loading ? "Saving..." : "Save"}
                </button>
                <button type="button" onClick={onCancel}
                        className="bg-slate-700 hover:bg-slate-600 text-slate-300
                                   text-sm font-medium px-5 py-2.5 rounded-lg transition-all">
                    Cancel
                </button>
            </div>
        </form>
    );
};

// --- SVG Icons ---
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
    </svg>
);

export default UserForm;