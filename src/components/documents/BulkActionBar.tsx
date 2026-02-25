import React, { useState } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface BulkActionBarProps {
    count: number;
    onApprove: () => Promise<void>;
    onReject: (note: string) => Promise<void>;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({ count, onApprove, onReject }) => {
    const [loadingAction, setLoadingAction] = useState<string | null>(null);
    const [showRejectNote, setShowRejectNote] = useState(false);
    const [rejectNote, setRejectNote] = useState('');
    const [error, setError] = useState('');

    if (count === 0) return null;

    const handleApprove = async () => {
        setLoadingAction('approve');
        setError('');
        try {
            await onApprove();
        } catch (err: any) {
            setError(err.message || 'Gagal meluluskan dokumen terpilih');
        } finally {
            setLoadingAction(null);
        }
    };

    const handleReject = async () => {
        if (!rejectNote.trim()) {
            setError('Sila berikan ulasan penolakan');
            return;
        }
        setLoadingAction('reject');
        setError('');
        try {
            await onReject(rejectNote);
            setShowRejectNote(false);
            setRejectNote('');
        } catch (err: any) {
            setError(err.message || 'Gagal menolak dokumen terpilih');
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 transition-transform transform translate-y-0">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center text-slate-700">
                    <span className="font-semibold mr-2">{count}</span> dokumen dipilih

                    {error && <span className="ml-4 text-sm text-red-500 font-medium">{error}</span>}
                </div>

                {showRejectNote ? (
                    <div className="flex w-full md:w-auto items-center gap-2">
                        <input
                            type="text"
                            placeholder="Sebab tolakan (wajib)..."
                            value={rejectNote}
                            onChange={e => setRejectNote(e.target.value)}
                            className="flex-1 text-sm border border-slate-300 rounded-md px-3 py-2"
                        />
                        <button
                            onClick={() => setShowRejectNote(false)}
                            className="text-sm text-slate-500 hover:text-slate-700"
                        >Batal</button>
                        <button
                            onClick={handleReject}
                            disabled={loadingAction === 'reject' || !rejectNote.trim()}
                            className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
                        >
                            {loadingAction === 'reject' ? <Loader2 size={16} className="animate-spin mr-1" /> : <XCircle size={16} className="mr-1" />} Tolak
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowRejectNote(true)}
                            disabled={!!loadingAction}
                            className="flex items-center text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
                        >
                            <XCircle size={16} className="mr-1" /> Tolak Terpilih
                        </button>
                        <button
                            onClick={handleApprove}
                            disabled={!!loadingAction}
                            className="flex items-center text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm px-4 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
                        >
                            {loadingAction === 'approve' ? <Loader2 size={16} className="animate-spin mr-1" /> : <CheckCircle size={16} className="mr-1" />}
                            Sahkan Terpilih
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
