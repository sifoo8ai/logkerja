import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Loader2, FileText, Send, Copy, Check, Paperclip, ArrowRight } from 'lucide-react';
import { getSignedViewUrl } from '../../features/attachments/attachmentsApi';
import { fetchDocumentActions, resubmitDocument } from '../../features/documents/penyemakApi';
import { ImageDropzone } from '../attachments/ImageDropzone';
import { uploadDocumentAttachment } from '../../features/attachments/attachmentsApi';
import { actionStyle, formatTarikh, initials, splitActorName, statusBanner } from './documentDetailsFormat';

interface DocumentDetailsSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    document: any;
    onStatusChange: () => void;
}

type TabKey = 'butiran' | 'audit';

export const DocumentDetailsSlideOver: React.FC<DocumentDetailsSlideOverProps> = ({
    isOpen, onClose, document, onStatusChange
}) => {
    const [actions, setActions] = useState<any[]>([]);
    const [attachments, setAttachments] = useState<any[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [activeTab, setActiveTab] = useState<TabKey>('butiran');
    const [copied, setCopied] = useState(false);

    // Resubmit state
    const [resubmitNote, setResubmitNote] = useState('');
    const [newFile, setNewFile] = useState<File | null>(null);
    const [isResubmitting, setIsResubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && document) {
            setActiveTab('butiran');
            setCopied(false);
            setError('');
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

    const handleCopyRef = async () => {
        try {
            await navigator.clipboard.writeText(document.reference_no);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error('Gagal menyalin nombor rujukan:', err);
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

    const status: string = document.current_status;
    const banner = statusBanner(status);
    const canResubmit = ['REJECTED', 'ON_HOLD'].includes(status);
    const isPending = status === 'PENDING_VERIFIER' || status === 'PENDING_APPROVER';
    const pendingActor = status === 'PENDING_VERIFIER'
        ? (document.verifier?.full_name || document.verifier_id?.substring(0, 8) || 'Pengesah')
        : (document.approver?.full_name || document.approver_id?.substring(0, 8) || 'Pelulus');
    const latest = actions[0];

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col">
                {/* Header */}
                <div className="px-5 pt-5 pb-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Butiran Dokumen</p>
                            <div className="flex items-center gap-2 mt-1">
                                <h2 className="text-2xl font-bold text-slate-900 truncate">{document.reference_no}</h2>
                                <button
                                    onClick={handleCopyRef}
                                    className={`shrink-0 p-1.5 rounded-md border transition-colors ${copied ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                                    title={copied ? 'Disalin' : 'Salin nombor rujukan'}
                                    aria-label="Salin nombor rujukan"
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                            </div>
                            <p className="text-sm text-slate-500 mt-0.5">{document.category?.name || '-'}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="shrink-0 p-2 text-slate-500 hover:text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                            aria-label="Tutup"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Banner status */}
                    <div className={`mt-4 flex items-start gap-3 px-4 py-3 rounded-lg border ${banner.box}`}>
                        <span className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${banner.dot}`} />
                        <div>
                            <p className="text-sm font-bold">{banner.title}</p>
                            {banner.subtitle && <p className="text-xs opacity-80">{banner.subtitle}</p>}
                        </div>
                    </div>

                    {/* Tab */}
                    <div className="mt-4 flex border-b border-slate-200" role="tablist">
                        <TabButton active={activeTab === 'butiran'} onClick={() => setActiveTab('butiran')}>
                            Butiran Dokumen
                        </TabButton>
                        <TabButton active={activeTab === 'audit'} onClick={() => setActiveTab('audit')}>
                            Jejak Audit
                            <span className="ml-2 inline-flex items-center justify-center min-w-[1.5rem] px-1.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                                {loadingDetails ? '…' : actions.length}
                            </span>
                        </TabButton>
                    </div>
                </div>

                {/* Kandungan */}
                <div className="flex-1 overflow-y-auto px-5 pb-5">
                    {activeTab === 'butiran' ? (
                        <div className="divide-y divide-slate-100">
                            {/* Pegawai tindakan */}
                            {isPending && (
                                <section className="py-4">
                                    <h3 className="text-sm font-bold text-slate-800">Pegawai tindakan</h3>
                                    <p className="text-xs text-slate-500">Menunggu tindakan daripada</p>
                                    <div className="mt-3 flex items-center gap-3">
                                        <span className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                                            {initials(pendingActor)}
                                        </span>
                                        <span className="text-sm font-semibold text-slate-800">{pendingActor}</span>
                                    </div>
                                </section>
                            )}

                            {/* Tarikh */}
                            <section className="py-4 grid grid-cols-2">
                                <div className="pr-4">
                                    <p className="text-xs text-slate-500">Tarikh daftar</p>
                                    <p className="text-sm font-semibold text-slate-800">{formatTarikh(document.created_at)}</p>
                                </div>
                                <div className="pl-4 border-l border-slate-200">
                                    <p className="text-xs text-slate-500">Dikemas kini</p>
                                    <p className="text-sm font-semibold text-slate-800">{formatTarikh(document.updated_at)}</p>
                                </div>
                            </section>

                            {/* Keterangan */}
                            <section className="py-4">
                                <h3 className="text-sm font-bold text-slate-800 mb-2">Keterangan</h3>
                                <p className="text-sm text-slate-700 bg-slate-50 px-3 py-2.5 rounded-md whitespace-pre-wrap">
                                    {document.description || <span className="text-slate-400 italic">Tiada keterangan disediakan.</span>}
                                </p>
                            </section>

                            {/* Lampiran */}
                            <section className="py-4">
                                <h3 className="text-sm font-bold text-slate-800 mb-2">Lampiran</h3>
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
                                                    className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center space-x-1 shrink-0"
                                                >
                                                    <ExternalLink size={14} /> <span>Papar</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="flex items-center gap-3 p-4 rounded-lg border border-dashed border-slate-300 text-slate-500">
                                        <Paperclip size={20} className="shrink-0" />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700">Tiada lampiran</p>
                                            <p className="text-xs">Tiada fail dilampirkan pada dokumen ini.</p>
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Hantar Semula */}
                            {canResubmit && (
                                <section className="py-4">
                                    <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
                                        <h3 className="text-sm font-bold text-red-800 mb-3">Tindakan: Hantar Semula</h3>

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
                                </section>
                            )}

                            {/* Aktiviti terkini */}
                            <section className="py-4">
                                <h3 className="text-sm font-bold text-slate-800 mb-3">Aktiviti terkini</h3>
                                {loadingDetails ? (
                                    <div className="flex justify-center p-4"><Loader2 className="animate-spin text-blue-500" /></div>
                                ) : latest ? (
                                    <>
                                        <ActivityRow action={latest} compact />
                                        <button
                                            onClick={() => setActiveTab('audit')}
                                            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800"
                                        >
                                            Lihat semua {actions.length} aktiviti <ArrowRight size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <p className="text-sm text-slate-500">Tiada aktiviti.</p>
                                )}
                            </section>
                        </div>
                    ) : (
                        <div className="py-4">
                            <h3 className="text-sm font-bold text-slate-800">Sejarah tindakan</h3>
                            <p className="text-xs text-slate-500 mb-4">{actions.length} aktiviti • Terkini dahulu</p>
                            {loadingDetails ? (
                                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-blue-500" /></div>
                            ) : actions.length > 0 ? (
                                <ol className="relative">
                                    {actions.map((act, i) => (
                                        <li key={act.id} className="relative pb-6 last:pb-0">
                                            {i < actions.length - 1 && (
                                                <span className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-slate-200" aria-hidden="true" />
                                            )}
                                            <ActivityRow action={act} />
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="text-sm text-slate-500">Tiada sejarah.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-slate-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        role="tab"
        aria-selected={active}
        onClick={onClick}
        className={`flex items-center px-4 py-2.5 -mb-px text-sm font-semibold border-b-2 transition-colors ${active ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
    >
        {children}
    </button>
);

const ActivityRow: React.FC<{ action: any; compact?: boolean }> = ({ action, compact = false }) => {
    const style = actionStyle(action.action);
    const Icon = style.icon;
    const actor = splitActorName(action.actor?.full_name);

    return (
        <div className="flex items-start gap-3">
            <span className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.iconBox}`}>
                <Icon size={20} />
            </span>
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-bold text-slate-800">{style.label}</p>
                    <span className="text-xs text-slate-500 whitespace-nowrap">{formatTarikh(action.created_at)}</span>
                </div>
                {compact ? (
                    <p className="text-xs text-slate-500">{action.actor?.full_name || 'Sistem'}</p>
                ) : (
                    <>
                        <p className="text-xs text-slate-600">{actor.name}</p>
                        {actor.unit && <p className="text-xs text-slate-500">{actor.unit}</p>}
                    </>
                )}
                {!compact && action.note && (
                    <p className="mt-2 pl-3 border-l-2 border-slate-300 text-sm text-slate-600 italic">"{action.note}"</p>
                )}
            </div>
        </div>
    );
};
