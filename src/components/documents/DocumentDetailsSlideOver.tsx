import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Loader2, FileText, Send } from 'lucide-react';
import { getSignedViewUrl } from '../../features/attachments/attachmentsApi';
import { fetchDocumentActions, resubmitDocument } from '../../features/documents/penyemakApi';
import { ImageDropzone } from '../attachments/ImageDropzone';
import { uploadDocumentAttachment } from '../../features/attachments/attachmentsApi';

interface DocumentDetailsSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    document: any;
    onStatusChange: () => void;
}

export const DocumentDetailsSlideOver: React.FC<DocumentDetailsSlideOverProps> = ({
    isOpen, onClose, document, onStatusChange
}) => {
    const [actions, setActions] = useState<any[]>([]);
    const [attachments, setAttachments] = useState<any[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Resubmit state
    const [resubmitNote, setResubmitNote] = useState('');
    const [newFile, setNewFile] = useState<File | null>(null);
    const [isResubmitting, setIsResubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && document) {
            loadDetails();
        }
    }, [isOpen, document]);

    const loadDetails = async () => {
        setLoadingDetails(true);
        try {
            const [acts] = await Promise.all([
                fetchDocumentActions(document.id)
            ]);

            // To prevent needing to re-fetch attachments metadata differently, we can just do a direct query:
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

    const handleResubmit = async () => {
        if (!document) return;
        setIsResubmitting(true);
        setError('');

        try {
            await resubmitDocument(document.id, resubmitNote);
            if (newFile) {
                await uploadDocumentAttachment(document.id, newFile);
            }
            onStatusChange();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Gagal menghantar semula dokumen.');
        } finally {
            setIsResubmitting(false);
        }
    };

    if (!isOpen || !document) return null;

    const canResubmit = ['REJECTED', 'ON_HOLD'].includes(document.current_status);

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
                    {/* Status Badge */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Status Semasa</h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800 border border-slate-200">
                            {document.current_status}
                        </span>
                    </div>

                    {/* Menunggu Tindakan */}
                    {(document.current_status === 'PENDING_VERIFIER' || document.current_status === 'PENDING_APPROVER') && (
                        <div>
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menunggu Tindakan</h3>
                            <p className="text-sm font-medium text-slate-800 bg-blue-50 text-blue-900 px-3 py-2 rounded-md border border-blue-100 inline-block">
                                {document.current_status === 'PENDING_VERIFIER'
                                    ? (document.verifier?.full_name || document.verifier_id?.substring(0, 8) || 'Pengesah')
                                    : (document.approver?.full_name || document.approver_id?.substring(0, 8) || 'Pelulus')}
                            </p>
                        </div>
                    )}

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

                    {/* Resubmit Area */}
                    {canResubmit && (
                        <div className="mt-8 pt-6 border-t border-red-200 bg-red-50/50 -mx-5 px-5 pb-5">
                            <h3 className="text-sm font-bold text-red-800 mb-3 flex items-center">
                                Tindakan: Hantar Semula (Resubmit)
                            </h3>

                            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Nota Pembetulan (Pilihan)</label>
                                    <textarea
                                        value={resubmitNote}
                                        onChange={e => setResubmitNote(e.target.value)}
                                        className="w-full text-sm border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={2}
                                        placeholder="Saya telah mengemaskini..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Lampiran Baru (Pilihan)</label>
                                    <ImageDropzone hideUploadButton={true} onChange={setNewFile} />
                                </div>

                                <button
                                    onClick={handleResubmit}
                                    disabled={isResubmitting}
                                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                                >
                                    {isResubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : <><Send size={16} className="mr-2" /> Hantar Semula</>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
