import React, { useEffect, useState } from 'react';
import { RefreshCw, LayoutList, History } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { fetchPelulusDocuments, fetchPelulusHistory, approveDocumentAsPelulus, rejectDocumentAsPelulus } from '../../features/documents/pelulusApi';
import { DocumentRowExtended } from '../../features/documents/pengesahApi'; // reuse type
import { PelulusTable } from '../../components/documents/PelulusTable';
import { BulkActionBar } from '../../components/documents/BulkActionBar';
import { PelulusDetailsSlideOver } from '../../components/documents/PelulusDetailsSlideOver';

const PelulusDashboard: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'tindakan' | 'sejarah'>('tindakan');

    const [documents, setDocuments] = useState<DocumentRowExtended[]>([]);
    const [history, setHistory] = useState<any[]>([]);

    // Bulk selection state
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Detail slide-over state
    const [selectedDoc, setSelectedDoc] = useState<DocumentRowExtended | null>(null);

    const loadData = async (uid: string) => {
        try {
            const [docs, hist] = await Promise.all([
                fetchPelulusDocuments(uid),
                fetchPelulusHistory(uid)
            ]);
            setDocuments(docs || []);
            setHistory(hist || []);

            // Clean up selected ids if they are no longer in documents
            const docIds = new Set(docs?.map(d => d.id) || []);
            setSelectedIds(prev => prev.filter(id => docIds.has(id)));
        } catch (error) {
            console.error('Error loading pelulus dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let subscription: any;

        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUserId(session.user.id);
                await loadData(session.user.id);

                // Setup realtime subscription scoped to approver_id
                subscription = supabase.channel('pelulus-docs')
                    .on(
                        'postgres_changes',
                        {
                            event: '*',
                            schema: 'public',
                            table: 'documents',
                            filter: `approver_id=eq.${session.user.id}`
                        },
                        () => {
                            // Soft reload data on changes
                            loadData(session.user.id);
                        }
                    )
                    .subscribe();
            }
        };
        init();

        return () => {
            if (subscription) supabase.removeChannel(subscription);
        };
    }, []);

    const handleRefresh = () => {
        if (userId) {
            setLoading(true);
            loadData(userId);
        }
    };

    const handleToggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleToggleSelectAll = (ids: string[]) => {
        const areAllSelected = ids.every(id => selectedIds.includes(id));
        if (areAllSelected) {
            setSelectedIds(prev => prev.filter(id => !ids.includes(id)));
        } else {
            const newIds = ids.filter(id => !selectedIds.includes(id));
            setSelectedIds(prev => [...prev, ...newIds]);
        }
    };

    const handleBulkApprove = async () => {
        await Promise.all(selectedIds.map(id => approveDocumentAsPelulus(id)));
        if (userId) await loadData(userId);
        setSelectedIds([]);
    };

    const handleBulkReject = async (note: string) => {
        await Promise.all(selectedIds.map(id => rejectDocumentAsPelulus(id, note)));
        if (userId) await loadData(userId);
        setSelectedIds([]);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard Pelulus</h1>
                    <p className="text-slate-500 font-medium">Uruskan dokumen yang menanti kelulusan akhir anda.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        className="p-2 bg-white border border-slate-300 text-slate-600 rounded shadow-sm hover:bg-slate-50 transition-colors"
                        title="Segar Semula"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('tindakan')}
                        className={`flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'tindakan'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        <LayoutList size={18} className="mr-2" />
                        Untuk Tindakan
                        {documents.length > 0 && (
                            <span className="ml-2 bg-blue-100 text-blue-700 py-0.5 px-2.5 rounded-full text-xs">
                                {documents.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('sejarah')}
                        className={`flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'sejarah'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        <History size={18} className="mr-2" />
                        Sejarah
                    </button>
                </nav>
            </div>

            {loading && documents.length === 0 && history.length === 0 ? (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : activeTab === 'tindakan' ? (
                <div>
                    <PelulusTable
                        documents={documents}
                        selectedIds={selectedIds}
                        onToggleSelect={handleToggleSelect}
                        onToggleSelectAll={handleToggleSelectAll}
                        onRowClick={setSelectedDoc}
                    />

                    <BulkActionBar
                        count={selectedIds.length}
                        onApprove={handleBulkApprove}
                        onReject={handleBulkReject}
                    />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3"># Rujukan</th>
                                    <th className="px-6 py-3">Kategori</th>
                                    <th className="px-6 py-3">Tindakan Anda</th>
                                    <th className="px-6 py-3">Status Terkini Dokumen</th>
                                    <th className="px-6 py-3">Tarikh Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {history.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Tiada sejarah penindakan</td>
                                    </tr>
                                ) : (
                                    history.map(item => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50 cursor-pointer transition-colors"
                                            onClick={() => setSelectedDoc(item.document)}
                                        >
                                            <td className="px-6 py-4 font-semibold text-slate-900">{item.document?.reference_no}</td>
                                            <td className="px-6 py-4">{item.document?.category?.name || '-'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.action === 'APPROVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                                    {item.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-medium text-slate-600">
                                                    {item.document?.current_status?.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{new Date(item.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <PelulusDetailsSlideOver
                isOpen={!!selectedDoc}
                document={selectedDoc}
                onClose={() => setSelectedDoc(null)}
                onStatusChange={() => {
                    if (userId) loadData(userId);
                    setSelectedDoc(null);
                }}
            />
        </div>
    );
};

export default PelulusDashboard;
