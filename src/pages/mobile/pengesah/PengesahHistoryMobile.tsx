import React, { useEffect, useState } from 'react';
import { fetchPengesahHistory, DocumentRowExtended } from '../../../features/documents/pengesahApi';
import { useAuth } from '../../../hooks/useAuth';
import { PengesahDetailsSlideOver } from '../../../components/documents/PengesahDetailsSlideOver';
import { RefreshCw, Clock } from 'lucide-react';

export const PengesahHistoryMobile: React.FC = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoc, setSelectedDoc] = useState<DocumentRowExtended | null>(null);

    const loadData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const hist = await fetchPengesahHistory(user.id);
            setHistory(hist || []);
        } catch (error) {
            console.error('Failed to load history docs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [user]);

    return (
        <div className="p-4 space-y-4 max-w-md mx-auto pb-24">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Sejarah</h2>
                <button onClick={loadData} className="p-2 bg-white rounded-full shadow-sm text-gray-500">
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {loading && history.length === 0 ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : history.length === 0 ? (
                <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center gap-2">
                    <Clock size={24} className="text-gray-300" />
                    <p>Tiada sejarah tindakan</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {history.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer" onClick={() => setSelectedDoc(item.document)}>
                            <div className="flex justify-between items-start mb-2">
                                <p className="font-semibold text-gray-800">{item.document?.reference_no}</p>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${item.action === 'APPROVE_VERIFIER' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                    {item.action === 'APPROVE_VERIFIER' ? 'Sahkan' : 'Tolak'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>{item.document?.category?.name || 'Tiada Kategori'}</span>
                                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <PengesahDetailsSlideOver
                isOpen={!!selectedDoc}
                document={selectedDoc}
                onClose={() => setSelectedDoc(null)}
                onStatusChange={() => { }}
            />
        </div>
    );
};

export default PengesahHistoryMobile;
