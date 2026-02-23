import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { uploadDocumentAttachment } from '../../features/attachments/attachmentsApi';

interface ImageDropzoneProps {
    documentId: string;
    onSuccess?: () => void;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({ documentId, onSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMsg('');
        const selected = e.target.files?.[0];
        validateAndSetFile(selected);
    };

    const validateAndSetFile = (selected?: File) => {
        if (!selected) return;

        if (!ALLOWED_TYPES.includes(selected.type)) {
            setErrorMsg('Hanya imej (JPG, PNG, WebP) dibenarkan.');
            return;
        }

        if (selected.size > MAX_SIZE) {
            setErrorMsg('Saiz fail tidak boleh melebihi 5MB.');
            return;
        }

        setFile(selected);
    };

    const handleUpload = async () => {
        if (!file || uploading) return;
        setUploading(true);
        setErrorMsg('');

        try {
            await uploadDocumentAttachment(documentId, file);
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setErrorMsg(err.message || 'Gagal memuat naik imej');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full max-w-lg p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-800 mb-3">Sertakan Attachment (Imej)</h3>

            {!file ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                        <UploadCloud className="w-8 h-8 mb-2" />
                        <p className="text-sm font-semibold mb-1">Klik untuk memuat naik</p>
                        <p className="text-xs text-slate-400">JPG, PNG atau WebP (Maks: 5MB)</p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handleFileChange}
                    />
                </label>
            ) : (
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50">
                    <div className="flex flex-col truncate pr-4">
                        <span className="text-sm text-slate-800 font-medium truncate">{file.name}</span>
                        <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <button
                        type="button"
                        disabled={uploading}
                        onClick={() => setFile(null)}
                        className="text-slate-400 hover:text-red-500 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}

            {errorMsg && <p className="text-red-500 text-xs mt-2">{errorMsg}</p>}

            <div className="mt-4 flex justify-end">
                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="flex flex-row items-center px-4 py-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="animate-spin w-4 h-4 mr-2" />
                            Menyimpan...
                        </>
                    ) : (
                        'Simpan'
                    )}
                </button>
            </div>
        </div>
    );
};
