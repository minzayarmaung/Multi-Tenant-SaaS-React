/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "sonner";

interface Props {
    leadId:   number;
    leadName: string;
    onAssign: (userId: number) => Promise<void>;
    onClose:  () => void;
}

const AssignLeadModal = ({ leadId, leadName, onAssign, onClose }: Props) => {
    const [userId,  setUserId]  = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onAssign(Number(userId));
            toast.success("Lead assigned successfully.");
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Assign failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // Backdrop
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm
                        flex items-center justify-center z-50 px-4">

            {/* Modal Card */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl
                            shadow-2xl w-full max-w-md p-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="text-white font-semibold text-base">Assign Lead</h3>
                        <p className="text-slate-400 text-sm mt-0.5">
                            Assigning: <span className="text-blue-400">{leadName}</span>
                            <span className="text-slate-500 ml-1">(#{leadId})</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1.5 mb-5">
                        <label className="text-slate-300 text-sm font-medium">
                            User ID <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="number"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                            placeholder="Enter user ID to assign"
                            className="bg-slate-700/50 border border-slate-600 text-white
                                       placeholder-slate-400 rounded-lg px-3 py-2.5 text-sm
                                       focus:outline-none focus:ring-2 focus:ring-blue-500
                                       focus:border-transparent transition-all"
                        />
                        <p className="text-slate-500 text-xs mt-1">
                            User must belong to your company.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-60
                                       disabled:cursor-not-allowed text-white text-sm font-medium
                                       py-2.5 rounded-lg transition-all flex items-center
                                       justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4"
                                         viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10"
                                                stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor"
                                              d="M4 12a8 8 0 018-8v8z"/>
                                    </svg>
                                    Assigning...
                                </>
                            ) : "Assign"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300
                                       text-sm font-medium py-2.5 rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignLeadModal;