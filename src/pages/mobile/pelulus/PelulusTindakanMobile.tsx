import React, { useEffect, useState } from 'react';
import { fetchPelulusDocuments, approveDocumentAsPelulus, rejectDocumentAsPelulus } from '../../../features/documents/pelulusApi';
import { DocumentRowExtended } from '../../../features/documents/pengesahApi';
import { useAuth } from '../../../hooks/useAuth';
import { PelulusDetailsSlideOver } from '../../../components/documents/PelulusDetailsSlideOver';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export const PelulusTindakanMobile: React.FC = () => {
    const { user } = useAuth();
    const [documents, setDocuments] = useState<DocumentRowExtended[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<DocumentRowExtended | null>(null);

    const loadData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const docs = await fetchPelulusDocuments(user.id);
            setDocuments(docs || []);
            const docIds = new Set(docs?.map(d => d.id) || []);
            setSelectedIds(prev => prev.filter(id => docIds.has(id)));
        } catch (error) {
            console.error('Failed to load pending docs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [user]);

    const handleToggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleBulkApprove = async () => {
        if (!confirm('Pasti ingin luluskan ' + selectedIds.length + ' dokumen?')) return;
        await Promise.all(selectedIds.map(id => approveDocumentAsPelulus(id, 'Diluluskan melalui peranti mudah alih')));
        await loadData();
        setSelectedIds([]);
    };

    const handleBulkReject = async () => {
        const note = prompt('Sila nyatakan sebab untuk penolakan:');
        if (!note) return;
        if (!confirm('Pasti ingin tolak ' + selectedIds.length + ' dokumen?')) return;
        await Promise.all(selectedIds.map(id => rejectDocumentAsPelulus(id, note)));
        await loadData();
        setSelectedIds([]);
    };

    return (
        <div className="p-4 md:p-6 pb-32 max-w-md mx-auto relative min-h-full">
            {/* Header Area */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-[22px] font-extrabold text-[#1a2b4b]">Senarai Tindakan</h2>
                <button
                    onClick={loadData}
                    className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors border border-gray-100"
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin text-blue-500' : ''} />
                </button>
            </div>

            {/* List Documents */}
            <div className="space-y-3">
                {documents.map(doc => {
                    const isSelected = selectedIds.includes(doc.id);
                    return (
                        <div
                            key={doc.id}
                            className={`group relative flex items-center p-4 rounded-2xl transition-all duration-200 border ${isSelected
                                ? 'bg-blue-50/50 border-blue-200 shadow-[0_4px_12px_rgba(59,130,246,0.08)]'
                                : 'bg-white border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md'
                                }`}
                        >
                            {/* Custom Checkbox */}
                            <div
                                className="mr-4 shrink-0 flex items-center cursor-pointer p-1 -ml-1"
                                onClick={() => handleToggleSelect(doc.id)}
                            >
                                <div className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-colors ${isSelected
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'bg-white border-gray-300 group-hover:border-blue-400'
                                    }`}>
                                    {isSelected && (
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </div>

                            {/* Content Area (Click to open details) */}
                            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedDoc(doc)}>
                                <h3 className={`text-[15px] font-bold truncate mb-1.5 transition-colors ${isSelected ? 'text-blue-900' : 'text-[#1a2b4b]'
                                    }`}>
                                    {doc.reference_no}
                                </h3>
                                <div className="flex items-center">
                                    {/* Kategori Badge */}
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border bg-gray-50 text-gray-600 border-gray-200">
                                        {doc.category?.name || 'Tiada Kategori'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Empty State kalau takde dokumen */}
                {!loading && documents.length === 0 && (
                    <div className="text-center py-12 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                            <CheckCircle className="text-gray-300" size={32} />
                        </div>
                        <h3 className="text-gray-800 font-bold mb-1">Semua Selesai!</h3>
                        <p className="text-sm text-gray-500">Tiada dokumen menunggu kelulusan buat masa ini.</p>
                    </div>
                )}
            </div>

            {/* Contextual Action Bar (Bawah) */}
            {selectedIds.length > 0 && (
                <div
                    className="fixed bottom-[72px] left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] px-5 py-4 flex items-center justify-between z-30 max-w-md mx-auto animate-in slide-in-from-bottom-5 duration-300"
                    style={{ borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}
                >
                    {/* Badge jumlah item dipilih */}
                    <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center px-2.5 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                            {selectedIds.length}
                        </span>
                        <span className="text-sm font-semibold text-gray-600">dipilih</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2.5">
                        <button
                            onClick={handleBulkReject}
                            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-bold text-sm transition-colors border border-red-100 active:scale-95"
                        >
                            <XCircle size={16} strokeWidth={2.5} /> Tolak
                        </button>
                        <button
                            onClick={handleBulkApprove}
                            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-sm shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                        >
                            <CheckCircle size={16} strokeWidth={2.5} /> Luluskan
                        </button>
                    </div>
                </div>
            )}

            <PelulusDetailsSlideOver
                isOpen={!!selectedDoc}
                document={selectedDoc}
                onClose={() => setSelectedDoc(null)}
                onStatusChange={() => {
                    loadData();
                    setSelectedDoc(null);
                }}
            />
        </div>
    );
};

export default PelulusTindakanMobile;
