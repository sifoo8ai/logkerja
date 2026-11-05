import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, CheckCircle2, AlertTriangle, RotateCcw, Info } from 'lucide-react';
import { ImageDropzone } from '../attachments/ImageDropzone';
import {
    fetchActiveCategories,
    submitNewDocument,
    resubmitDocument,
    checkReferenceExists,
} from '../../features/documents/penyemakApi';
import { uploadDocumentAttachment } from '../../features/attachments/attachmentsApi';
import { resolveReferenceAction, ReferenceAction } from '../../features/documents/referenceCheck';

export type SubmissionResultStatus = 'SUBMITTED' | 'RESUBMITTED' | 'BLOCKED' | 'CANCELLED' | 'ERROR';

export interface SubmissionResult {
    status: SubmissionResultStatus;
    refNo: string;
    docStatus?: string | null;
    message?: string;
}

interface SubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    /** Pra-isi nombor rujukan (contoh: dari tangkapan ERP) */
    initialRefNo?: string;
    /** Pra-isi Keterangan Tambahan (contoh: nama Creator ERP) */
    initialDescription?: string;
    source?: 'manual' | 'erp';
    /** Dipanggil sekali bagi setiap keputusan akhir (untuk dilaporkan balik ke extension ERP) */
    onResult?: (result: SubmissionResult) => void;
}

type CheckState = 'idle' | 'checking' | 'done' | 'error';

const CHECK_DEBOUNCE_MS = 400;

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    initialRefNo,
    initialDescription,
    source = 'manual',
    onResult,
}) => {
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [refNo, setRefNo] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [note, setNote] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [refError, setRefError] = useState('');
    const [checkState, setCheckState] = useState<CheckState>('idle');
    const [action, setAction] = useState<ReferenceAction | null>(null);
    const [doneWarning, setDoneWarning] = useState<string | null>(null);

    const checkSeq = useRef(0);
    const reported = useRef(false);

    const report = (result: SubmissionResult) => {
        if (reported.current) return;
        reported.current = true;
        onResult?.(result);
    };

    // Reset borang setiap kali modal dibuka
    useEffect(() => {
        if (isOpen) {
            fetchActiveCategories().then(setCategories).catch(err => console.error(err));
            setRefNo((initialRefNo || '').trim());
            setCategoryId('');
            setDescription(initialDescription || '');
            setNote('');
            setFile(null);
            setError('');
            setRefError('');
            setCheckState('idle');
            setAction(null);
            setDoneWarning(null);
            reported.current = false;
        }
    }, [isOpen, initialRefNo, initialDescription]);

    // Semakan duplikasi (debounce) setiap kali nombor rujukan berubah
    useEffect(() => {
        if (!isOpen) return;
        const value = refNo.trim();
        setRefError('');

        if (!value) {
            setCheckState('idle');
            setAction(null);
            return;
        }

        const seq = ++checkSeq.current;
        setCheckState('checking');
        const timer = setTimeout(async () => {
            try {
                const result = await checkReferenceExists(value);
                if (seq !== checkSeq.current) return;
                setAction(resolveReferenceAction(result));
                setCheckState('done');
            } catch (err) {
                if (seq !== checkSeq.current) return;
                console.error('Semakan nombor rujukan gagal:', err);
                setAction(null);
                setCheckState('error');
            }
        }, source === 'erp' && value === (initialRefNo || '').trim() ? 0 : CHECK_DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [refNo, isOpen, source, initialRefNo]);

    // Laporkan ke extension bila tangkapan ERP tidak boleh diteruskan
    useEffect(() => {
        if (source === 'erp' && checkState === 'done' && action?.kind === 'BLOCKED' && refNo.trim() === (initialRefNo || '').trim()) {
            report({ status: 'BLOCKED', refNo: refNo.trim(), docStatus: action.docStatus, message: action.message });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [source, checkState, action]);

    if (!isOpen) return null;

    const mode: 'NEW' | 'RESUBMIT' = action?.kind === 'RESUBMIT' ? 'RESUBMIT' : 'NEW';
    const isBlocked = action?.kind === 'BLOCKED';
    const isChecking = checkState === 'checking';
    const isDone = doneWarning !== null;

    const handleClose = () => {
        if (!isDone) {
            report({ status: 'CANCELLED', refNo: refNo.trim() });
        }
        onClose();
    };

    const finishSuccess = (status: 'SUBMITTED' | 'RESUBMITTED', uploadWarning: string | null) => {
        report({ status, refNo: refNo.trim(), docStatus: 'PENDING_VERIFIER' });
        onSuccess();
        if (uploadWarning) {
            // Dokumen sudah berjaya — jangan biarkan pengguna klik Hantar semula
            setDoneWarning(uploadWarning);
        } else {
            onClose();
        }
    };

    const uploadIfAny = async (docId: string): Promise<string | null> => {
        if (!file) return null;
        try {
            await uploadDocumentAttachment(docId, file);
            return null;
        } catch (err: any) {
            return err?.message || 'Lampiran gagal dimuat naik.';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setRefError('');

        const value = refNo.trim();
        if (!value) {
            setRefError('Sila isikan No Rujukan.');
            return;
        }
        if (isBlocked || isChecking) return;

        if (mode === 'NEW' && !categoryId) {
            setError('Sila pilih Kategori.');
            return;
        }

        setLoading(true);
        try {
            if (mode === 'RESUBMIT' && action?.docId) {
                await resubmitDocument(action.docId, note.trim() || undefined);
                const warn = await uploadIfAny(action.docId);
                finishSuccess('RESUBMITTED', warn);
            } else {
                const newDocId = await submitNewDocument(value, categoryId, description);
                const warn = await uploadIfAny(newDocId);
                finishSuccess('SUBMITTED', warn);
            }
        } catch (err: any) {
            if (err?.code === 'DUPLICATE_REF') {
                setRefError(err.message);
                // Kemas kini petunjuk status supaya pengguna nampak pilihan yang betul
                try {
                    setAction(resolveReferenceAction(await checkReferenceExists(value)));
                    setCheckState('done');
                } catch { /* abaikan */ }
            } else {
                setError(err?.message || 'Ralat berlaku ketika menyimpan dokumen.');
            }
        } finally {
            setLoading(false);
        }
    };

    const title = isDone
        ? 'Dokumen Disimpan'
        : mode === 'RESUBMIT' ? 'Hantar Semula Dokumen' : 'Daftar Dokumen Baru';

    const submitLabel = mode === 'RESUBMIT' ? 'Hantar Semula' : 'Hantar Dokumen';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-full">
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-slate-800 truncate">{title}</h2>
                        {source === 'erp' && !isDone && (
                            <p className="text-xs text-blue-600 font-medium">Ditangkap dari ERP UPM</p>
                        )}
                    </div>
                    <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 shrink-0">
                        <X size={24} />
                    </button>
                </div>

                {isDone ? (
                    <div className="p-4 space-y-3">
                        <div className="flex items-start gap-2 p-3 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 text-sm">
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            <span>Dokumen <b>{refNo.trim()}</b> berjaya disimpan.</span>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-amber-50 text-amber-800 rounded border border-amber-200 text-sm">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <span>Lampiran gagal dimuat naik: {doneWarning}. Anda boleh muat naik semula dari butiran dokumen.</span>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 overflow-y-auto">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        <form id="submission-form" onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1"># Rujukan <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={refNo}
                                    onChange={e => setRefNo(e.target.value)}
                                    className={`w-full border rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${refError || isBlocked ? 'border-red-300' : 'border-slate-300'}`}
                                    placeholder="Contoh: S26314001R00353"
                                    autoComplete="off"
                                    required
                                />
                                <ReferenceStatusHint checkState={checkState} action={action} />
                                {refError && <p className="mt-1 text-xs text-red-600">{refError}</p>}
                            </div>

                            {mode === 'NEW' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Kategori <span className="text-red-500">*</span></label>
                                        <select
                                            value={categoryId}
                                            onChange={e => setCategoryId(e.target.value)}
                                            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                            disabled={isBlocked}
                                            required
                                        >
                                            <option value="">-- Pilih Kategori --</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan Tambahan</label>
                                        <textarea
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                            rows={3}
                                            placeholder="Nota untuk rujukan penyemak..."
                                            disabled={isBlocked}
                                        ></textarea>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nota Hantar Semula</label>
                                    <textarea
                                        value={note}
                                        onChange={e => setNote(e.target.value)}
                                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                        placeholder="Contoh: Pembetulan telah dibuat dalam ERP (pilihan)"
                                    ></textarea>
                                    <p className="mt-1 text-xs text-slate-500">Kategori kekal sama. Pengesah & Pelulus akan ditetapkan semula mengikut routing kategori.</p>
                                </div>
                            )}

                            {!isBlocked && (
                                <div>
                                    <ImageDropzone
                                        hideUploadButton={true}
                                        onChange={(f) => setFile(f)}
                                    />
                                </div>
                            )}
                        </form>
                    </div>
                )}

                <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-50"
                        disabled={loading}
                    >
                        {isDone || isBlocked ? 'Tutup' : 'Batal'}
                    </button>
                    {!isDone && !isBlocked && (
                        <button
                            type="submit"
                            form="submission-form"
                            disabled={loading || isChecking}
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded shadow-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {loading ? 'Menyimpan...' : submitLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const ReferenceStatusHint: React.FC<{ checkState: CheckState; action: ReferenceAction | null }> = ({ checkState, action }) => {
    if (checkState === 'idle') return null;

    if (checkState === 'checking') {
        return (
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                <Loader2 className="w-3 h-3 animate-spin" /> Menyemak nombor rujukan...
            </p>
        );
    }

    if (checkState === 'error' || !action) {
        return (
            <p className="mt-1 flex items-start gap-1 text-xs text-amber-700">
                <Info className="w-3.5 h-3.5 shrink-0 mt-px" /> Tidak dapat menyemak sekarang. Sistem akan menyemak semasa dokumen dihantar.
            </p>
        );
    }

    if (action.kind === 'NEW') {
        return (
            <p className="mt-1 flex items-center gap-1 text-xs text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> {action.message}
            </p>
        );
    }

    if (action.kind === 'RESUBMIT') {
        return (
            <p className="mt-1 flex items-start gap-1 text-xs text-blue-700">
                <RotateCcw className="w-3.5 h-3.5 shrink-0 mt-px" /> {action.message}
            </p>
        );
    }

    return (
        <p className="mt-1 flex items-start gap-1 text-xs text-red-700">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" /> {action.message}
        </p>
    );
};
