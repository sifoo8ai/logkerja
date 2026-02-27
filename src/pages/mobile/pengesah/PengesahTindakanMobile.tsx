import React, { useEffect, useState } from 'react';
import { fetchAssignedDocuments, approveDocument, rejectDocument, DocumentRowExtended } from '../../../features/documents/pengesahApi';
import { useAuth } from '../../../hooks/useAuth';
import { PengesahDetailsSlideOver } from '../../../components/documents/PengesahDetailsSlideOver';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export const PengesahTindakanMobile: React.FC = () => {
    const { user } = useAuth();
    const [documents, setDocuments] = useState<DocumentRowExtended[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<DocumentRowExtended | null>(null);

    const loadData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const docs = await fetchAssignedDocuments(user.id);
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
        await Promise.all(selectedIds.map(id => approveDocument(id, 'Disahkan melalui peranti mudah alih')));
        await loadData();
        setSelectedIds([]);
    };

    const handleBulkReject = async () => {
        const note = prompt('Sila nyatakan sebab untuk penolakan:');
        if (!note) return;
        if (!confirm('Pasti ingin tolak ' + selectedIds.length + ' dokumen?')) return;
        await Promise.all(selectedIds.map(id => rejectDocument(id, note)));
        await loadData();
        setSelectedIds([]);
    };

    return (
        <div className="p-4 pb-24 max-w-md mx-auto relative">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Senarai Tindakan</h2>
                <button onClick={loadData} className="p-2 bg-white rounded-full shadow-sm text-gray-500">
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="space-y-3">
                {documents.map(doc => (
                    <div key={doc.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={selectedIds.includes(doc.id)}
                            onChange={() => handleToggleSelect(doc.id)}
                            className="w-5 h-5 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div className="flex-1 cursor-pointer" onClick={() => setSelectedDoc(doc)}>
                            <p className="font-semibold text-gray-800">{doc.reference_no}</p>
                            <p className="text-sm text-gray-500">{doc.category?.name || 'Tiada Kategori'}</p>
                        </div>
                    </div>
                ))}

                {!loading && documents.length === 0 && (
                    <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm">
                        Tiada dokumen menunggu tindakan
                    </div>
                )}
            </div>

            {selectedIds.length > 0 && (
                <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] flex justify-between items-center z-10 w-full max-w-md mx-auto">
                    <span className="font-medium text-sm text-gray-700">{selectedIds.length} dipilih</span>
                    <div className="flex gap-2">
                        <button onClick={handleBulkReject} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg font-medium text-sm flex items-center gap-1">
                            <XCircle size={16} /> Tolak
                        </button>
                        <button onClick={handleBulkApprove} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-medium text-sm flex items-center gap-1">
                            <CheckCircle size={16} /> Sahkan
                        </button>
                    </div>
                </div>
            )}

            <PengesahDetailsSlideOver
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

export default PengesahTindakanMobile;
