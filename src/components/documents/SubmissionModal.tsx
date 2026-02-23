import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { ImageDropzone } from '../attachments/ImageDropzone';
import { fetchActiveCategories, submitNewDocument } from '../../features/documents/penyemakApi';
import { uploadDocumentAttachment } from '../../features/attachments/attachmentsApi';

interface SubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [refNo, setRefNo] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchActiveCategories().then(setCategories).catch(err => console.error(err));
            setRefNo('');
            setCategoryId('');
            setDescription('');
            setFile(null);
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!refNo || !categoryId) {
            setError('Sila isikan No Rujukan dan pilih Kategori.');
            return;
        }

        setLoading(true);
        try {
            // 1. Create Document edge function
            const newDocId = await submitNewDocument(refNo, categoryId, description);

            // 2. If file attached, upload it
            if (file) {
                await uploadDocumentAttachment(newDocId, file);
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Ralat berlaku ketika menyimpan dokumen.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-full">
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">Daftar Dokumen Baru</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

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
                                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Contoh: LOG-2026-001"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Kategori <span className="text-red-500">*</span></label>
                            <select
                                value={categoryId}
                                onChange={e => setCategoryId(e.target.value)}
                                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
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
                            ></textarea>
                        </div>

                        <div>
                            <ImageDropzone
                                hideUploadButton={true}
                                onChange={(f) => setFile(f)}
                            />
                        </div>
                    </form>
                </div>

                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-50"
                        disabled={loading}
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        form="submission-form"
                        disabled={loading}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded shadow-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {loading ? 'Menyimpan...' : 'Hantar Dokumen'}
                    </button>
                </div>
            </div>
        </div>
    );
};
