import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Loader2, FileText, PauseCircle, Trash2, Save, FileEdit } from 'lucide-react';
import { getSignedViewUrl } from '../../features/attachments/attachmentsApi';
import { fetchDocumentActions } from '../../features/documents/penyemakApi'; // reuse for history
import { setDocumentOnHold, updateDocumentCategory, deleteDocument } from '../../features/admin/adminApi';

interface AdminDocumentDetailsSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    document: any; // Using any for simplicity MVP
    categories: any[];
    onStatusChange: () => void;
}

export const AdminDocumentDetailsSlideOver: React.FC<AdminDocumentDetailsSlideOverProps> = ({
    isOpen, onClose, document, categories, onStatusChange
}) => {
    const [actions, setActions] = useState<any[]>([]);
    const [attachments, setAttachments] = useState<any[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Actions states
    const [holdNote, setHoldNote] = useState('');
    const [showHoldForm, setShowHoldForm] = useState(false);

    const [newCategoryId, setNewCategoryId] = useState('');
    const [showCategoryEdit, setShowCategoryEdit] = useState(false);

    const [isActioning, setIsActioning] = useState<string | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && document) {
            loadDetails();
            setHoldNote('');
            setShowHoldForm(false);
            setShowCategoryEdit(false);
            setNewCategoryId(document.category?.id || '');
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

    const handleHold = async () => {
        if (!holdNote.trim()) {
            setError('Nota penahanan (ON HOLD) wajib diisi.');
            return;
        }

        setIsActioning('hold');
        setError('');

        try {
            await setDocumentOnHold(document.id, holdNote);
            onStatusChange();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Gagal menahan dokumen.');
        } finally {
            setIsActioning(null);
        }
    };

    const handleUpdateCategory = async () => {
        if (!newCategoryId || newCategoryId === document.category?.id) {
            setShowCategoryEdit(false);
            return;
        }

        setIsActioning('category');
        setError('');

        try {
            await updateDocumentCategory(document.id, newCategoryId);
            onStatusChange();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Gagal mengemaskini kategori dokumen.');
        } finally {
            setIsActioning(null);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('ANDA PASTI? Tindakan ini akan memadam dokumen ini dan rekodnya secara kekal.')) {
            return;
        }

        setIsActioning('delete');
        setError('');

        try {
            await deleteDocument(document.id);
            onStatusChange();
            onClose();
        } catch (err: any) {
            // Displays actual error from Supabase
            const errorMsg = err instanceof Error ? err.message : (err?.message || 'Gagal memadam dokumen.');
            setError(errorMsg);
        } finally {
            setIsActioning(null);
        }
    };

    if (!isOpen || !document) return null;

    const canHold = document.current_status === 'LULUS';
    const canChangeCategory = ['REJECTED', 'ON_HOLD'].includes(document.current_status);

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md h-full bg-slate-50 shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform duration-300">
                <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-100">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">{document.reference_no}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 border border-slate-300 uppercase tracking-wider">
                                {document.current_status.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">{error}</p>}

                    {/* Meta Info */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 space-y-3 text-sm">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <span className="text-slate-500 font-medium">Kategori:</span>
                            {showCategoryEdit ? (
                                <div className="flex items-center gap-2">
                                    <select
                                        value={newCategoryId}
                                        onChange={e => setNewCategoryId(e.target.value)}
                                        className="text-sm border border-slate-300 rounded px-2 py-1"
                                    >
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    <button onClick={handleUpdateCategory} disabled={!!isActioning} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                                        {isActioning === 'category' ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    </button>
                                    <button onClick={() => setShowCategoryEdit(false)} disabled={!!isActioning} className="p-1 text-slate-400 hover:bg-slate-100 rounded">
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-800">{document.category?.name || '-'}</span>
                                    {canChangeCategory && (
                                        <button onClick={() => setShowCategoryEdit(true)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1 rounded transition-colors" title="Kemas kini Kategori">
                                            <FileEdit size={14} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between pb-2 border-b border-slate-100">
                            <span className="text-slate-500 font-medium whitespace-nowrap mr-4">Pencipta:</span>
                            <span className="text-slate-800 font-medium truncate text-right">{document.creator?.full_name || '-'}</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b border-slate-100">
                            <span className="text-slate-500 font-medium whitespace-nowrap mr-4">Penyemak (Routing):</span>
                            <span className="text-slate-800 truncate text-right">{document.verifier?.full_name || '-'}</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b border-slate-100">
                            <span className="text-slate-500 font-medium whitespace-nowrap mr-4">Pelulus (Routing):</span>
                            <span className="text-slate-800 truncate text-right">{document.approver?.full_name || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">Dikemaskini:</span>
                            <span className="text-slate-600 font-medium">{new Date(document.updated_at).toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Admin Action Control Panel */}
                    <div className="bg-red-50/50 border border-red-200 p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
                            Kawalan Pentadbir (Admin)
                        </h3>

                        {!showHoldForm ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowHoldForm(true)}
                                    disabled={!canHold || !!isActioning}
                                    title={!canHold ? "Dokumen mesti dalam status LULUS untuk di tahan." : "Tahan dokumen ini"}
                                    className="flex-1 flex justify-center items-center py-2 px-3 border border-yellow-300 rounded text-xs font-semibold text-yellow-800 bg-yellow-100 hover:bg-yellow-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <PauseCircle size={14} className="mr-1.5" /> Set ON_HOLD
                                </button>

                                <button
                                    onClick={handleDelete}
                                    disabled={!!isActioning}
                                    className="flex-1 flex justify-center items-center py-2 px-3 border border-red-300 rounded text-xs font-semibold text-red-800 bg-white hover:bg-red-50 disabled:opacity-40 transition-colors"
                                >
                                    {isActioning === 'delete' ? <Loader2 size={14} className="animate-spin mr-1.5" /> : <Trash2 size={14} className="mr-1.5" />}
                                    Padam Total
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3 bg-white p-3 border border-yellow-300 rounded">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nota Penahanan (Wajib)</label>
                                    <textarea
                                        value={holdNote}
                                        onChange={e => setHoldNote(e.target.value)}
                                        className="w-full text-sm border border-slate-300 rounded p-2 focus:ring-yellow-500 focus:border-yellow-500"
                                        rows={2}
                                        placeholder="Sebab ianya ditahan..."
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowHoldForm(false)}
                                        disabled={!!isActioning}
                                        className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors"
                                    >Batal</button>
                                    <button
                                        onClick={handleHold}
                                        disabled={!!isActioning || !holdNote.trim()}
                                        className="flex items-center px-3 py-1.5 text-xs font-medium text-yellow-900 bg-yellow-300 hover:bg-yellow-400 rounded shadow-sm disabled:opacity-50 transition-colors"
                                    >
                                        {isActioning === 'hold' ? <Loader2 className="animate-spin mr-1" size={14} /> : <PauseCircle size={14} className="mr-1" />} Set ON_HOLD
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Attachments */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Lampiran</h3>
                        {loadingDetails ? (
                            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-blue-500" /></div>
                        ) : attachments.length > 0 ? (
                            <ul className="space-y-2">
                                {attachments.map(att => (
                                    <li key={att.id} className="flex items-center justify-between p-3 rounded-md border border-slate-200 bg-white hover:border-blue-300 transition-colors">
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
                            <p className="text-sm text-slate-500 italic bg-white p-3 rounded border border-slate-200">Tiada lampiran.</p>
                        )}
                    </div>

                    {/* Timeline */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Sejarah Tindakan (Audit Log)</h3>
                        {loadingDetails ? (
                            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-blue-500" /></div>
                        ) : actions.length > 0 ? (
                            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                {actions.map((act) => (
                                    <div key={act.id} className="relative flex items-start group">
                                        <div className="bg-white border-2 border-slate-400 w-3 h-3 rounded-full mt-1.5 ml-3.5 z-10 shrink-0 shadow-sm" />
                                        <div className="ml-4 p-3 bg-white rounded-md border border-slate-200 w-full shadow-sm">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-bold text-slate-800">{act.action}</span>
                                                <span className="text-xs text-slate-500">{new Date(act.created_at).toLocaleDateString()} {new Date(act.created_at).toLocaleTimeString()}</span>
                                            </div>
                                            <p className="text-xs text-slate-600 mb-1">Oleh: <span className="font-medium">{act.actor?.full_name || 'System'}</span></p>

                                            <div className="text-[10px] text-slate-400 font-mono mb-2 uppercase break-all">
                                                {act.from_status ? `${act.from_status} → ${act.to_status}` : `→ ${act.to_status}`}
                                            </div>

                                            {act.note && (
                                                <p className="text-sm text-slate-700 p-2 bg-slate-50 rounded border border-slate-100 italic">"{act.note}"</p>
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
