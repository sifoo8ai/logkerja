import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Loader2, FileText, CheckCircle, XCircle } from 'lucide-react';
import { getSignedViewUrl } from '../../features/attachments/attachmentsApi';
import { fetchDocumentActions } from '../../features/documents/penyemakApi';
import { approveDocument, rejectDocument } from '../../features/documents/pengesahApi';

interface PengesahDetailsSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    document: any; // We can use DocumentRowExtended, but any is faster for reuse
    onStatusChange: () => void;
}

export const PengesahDetailsSlideOver: React.FC<PengesahDetailsSlideOverProps> = ({
    isOpen, onClose, document, onStatusChange
}) => {
    const [actions, setActions] = useState<any[]>([]);
    const [attachments, setAttachments] = useState<any[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Action state
    const [rejectNote, setRejectNote] = useState('');
    const [isActioning, setIsActioning] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [showRejectForm, setShowRejectForm] = useState(false);

    useEffect(() => {
        if (isOpen && document) {
            loadDetails();
            setRejectNote('');
            setShowRejectForm(false);
            setError('');
        }
    }, [isOpen, document]);

    const loadDetails = async () => {
        setLoadingDetails(true);
        try {
            const [acts] = await Promise.all([
                fetchDocumentActions(document.id)
            ]);

            const { supabase } = await import('../../lib/supabaseClient');
            const { data: attsData } = await supabase
                .from('document_attachments')
                .select('id, file_name, size_bytes')
                .eq('document_id', document.id);

            setActions(acts || []);
            setAttachments(attsData || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleViewAttachment = async (attachmentId: string) => {
        try {
            const url = await getSignedViewUrl(attachmentId);
            window.open(url, '_blank');
        } catch (err) {
            alert('Gagal memuat turun lampiran.');
        }
    };

    const handleApprove = async () => {
        if (!document) return;
        setIsActioning('approve');
        setError('');

        try {
            await approveDocument(document.id);
            onStatusChange();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Gagal mengesahkan dokumen.');
        } finally {
            setIsActioning(null);
        }
    };

    const handleReject = async () => {
        if (!document) return;
        if (!rejectNote.trim()) {
            setError('Nota penolakan wajib diisi.');
            return;
        }

        setIsActioning('reject');
        setError('');

        try {
            await rejectDocument(document.id, rejectNote);
            onStatusChange();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Gagal menolak dokumen.');
        } finally {
            setIsActioning(null);
        }
    };

    if (!isOpen || !document) return null;

    // Determine the status from various possible API payload shapes
    const currentStatus = document.current_status || document.document?.current_status || document.status;
    const canAction = currentStatus === 'PENDING_VERIFIER';

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform duration-300">
                <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">{document.reference_no}</h2>
                        <p className="text-sm text-slate-500">{document.category?.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white">
                    {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">{error}</p>}

                    {/* Status Badge */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Status Semasa</h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                            {currentStatus?.replace('_', ' ')}
                        </span>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Keterangan</h3>
                        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-100 min-h-20">
                            {document.description || <span className="text-slate-400 italic">Tiada keterangan disediakan.</span>}
                        </p>
                    </div>

                    {/* Attachments */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Lampiran Imej</h3>
                        {loadingDetails ? (
                            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-blue-500" /></div>
                        ) : attachments.length > 0 ? (
                            <ul className="space-y-2">
                                {attachments.map(att => (
                                    <li key={att.id} className="flex items-center justify-between p-3 rounded-md border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                                        <div className="flex items-center space-x-3 overflow-hidden">
                                            <FileText className="text-blue-500 shrink-0" size={18} />
                                            <span className="text-sm font-medium text-slate-700 truncate">{att.file_name}</span>
                                        </div>
                                        <button
                                            onClick={() => handleViewAttachment(att.id)}
                                            className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                                        >
                                            <ExternalLink size={14} /> <span>Papar</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-500 italic">Tiada lampiran.</p>
                        )}
                    </div>

                    {/* Actions Box */}
                    {canAction && (
                        <div className="mt-8 pt-6 border-t border-slate-200 -mx-5 px-5 bg-slate-50 pb-5">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
                                Tindakan Pengesah
                            </h3>

                            {!showRejectForm ? (
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setShowRejectForm(true)}
                                        disabled={!!isActioning}
                                        className="flex justify-center items-center py-2 px-4 border border-red-200 rounded-md shadow-sm text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                                    >
                                        <XCircle size={16} className="mr-2" /> Tolak
                                    </button>
                                    <button
                                        onClick={handleApprove}
                                        disabled={!!isActioning}
                                        className="flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 disabled:opacity-50 transition-colors"
                                    >
                                        {isActioning === 'approve' ? <Loader2 className="animate-spin mr-2" size={16} /> : <CheckCircle size={16} className="mr-2" />}
                                        Sahkan
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 bg-white p-4 border border-red-200 rounded-lg">
                                    <div>
                                        <label className="block text-xs font-medium text-red-700 mb-1">Sebab Tolakan (Wajib)</label>
                                        <textarea
                                            value={rejectNote}
                                            onChange={e => setRejectNote(e.target.value)}
                                            className="w-full text-sm border border-slate-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
                                            rows={3}
                                            placeholder="Sila nyatakan masalah pada dokumen ini..."
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setShowRejectForm(false)}
                                            disabled={!!isActioning}
                                            className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            onClick={handleReject}
                                            disabled={!!isActioning || !rejectNote.trim()}
                                            className="flex items-center px-4 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded shadow-sm disabled:opacity-50 transition-colors"
                                        >
                                            {isActioning === 'reject' ? <Loader2 className="animate-spin mr-1" size={14} /> : <XCircle size={14} className="mr-1" />}
                                            Hantar Tolakan
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Timeline / Actions */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Sejarah Tindakan</h3>
                        {loadingDetails ? (
                            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-blue-500" /></div>
                        ) : actions.length > 0 ? (
                            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                {actions.map((act) => (
                                    <div key={act.id} className="relative flex items-start group">
                                        <div className="bg-white border-2 border-blue-500 w-3 h-3 rounded-full mt-1.5 ml-3.5 z-10 shrink-0 shadow-sm" />
                                        <div className="ml-4 p-3 bg-slate-50 rounded-md border border-slate-200 w-full shadow-sm">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-bold text-slate-800">{act.action}</span>
                                                <span className="text-xs text-slate-500">{new Date(act.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-xs text-slate-600 mb-1">Oleh: <span className="font-medium">{act.actor?.full_name || 'System'}</span></p>
                                            {act.note && (
                                                <p className="text-sm text-slate-700 mt-2 p-2 bg-white rounded border border-slate-100 italic">"{act.note}"</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">Tiada sejarah.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
