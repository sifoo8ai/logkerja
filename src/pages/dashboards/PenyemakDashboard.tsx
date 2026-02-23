import React, { useEffect, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { fetchPenyemakKPIs, DocumentRow } from '../../features/documents/penyemakApi';
import { KpiCards } from '../../components/dashboard/KpiCards';
import { DocumentTable } from '../../components/documents/DocumentTable';
import { SubmissionModal } from '../../components/documents/SubmissionModal';
import { DocumentDetailsSlideOver } from '../../components/documents/DocumentDetailsSlideOver';

const PenyemakDashboard: React.FC = () => {
    const [kpis, setKpis] = useState({ inProcess: 0, rejected: 0, lulus: 0, total: 0 });
    const [documents, setDocuments] = useState<DocumentRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    // Modals & Slide-over state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<DocumentRow | null>(null);

    const loadData = async (uid: string) => {
        try {
            const [kpiData, { data: docs }] = await Promise.all([
                fetchPenyemakKPIs(uid),
                supabase
                    .from('documents')
                    .select('id, reference_no, current_status, created_at, updated_at, description, category:document_categories(id, name)')
                    .eq('creator_id', uid)
                    .order('updated_at', { ascending: false })
            ]);

            setKpis(kpiData);
            setDocuments((docs as any) || []);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let subscription: any;

        const init = async () => {
            const { data } = await supabase.auth.getUser();
            if (data.user) {
                setUserId(data.user.id);
                await loadData(data.user.id);

                // Setup realtime subscription
                subscription = supabase.channel('penyemak-docs')
                    .on(
                        'postgres_changes',
                        {
                            event: '*',
                            schema: 'public',
                            table: 'documents',
                            filter: `creator_id=eq.${data.user.id}`
                        },
                        () => {
                            // On any change, softly reload data
                            console.log('Realtime update detected');
                            loadData(data.user.id);
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

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard Penyemak</h1>
                    <p className="text-slate-500 font-medium">Uruskan serahan dan rujukan dokumen anda.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        className="p-2 bg-white border border-slate-300 text-slate-600 rounded shadow-sm hover:bg-slate-50 transition-colors"
                        title="Segar Semula"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={() => setIsSubmitting(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded shadow-sm hover:bg-blue-700 transition"
                    >
                        <Plus size={20} className="mr-2" /> Daftar Dokumen
                    </button>
                </div>
            </div>

            {loading && documents.length === 0 ? (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <>
                    <KpiCards {...kpis} />
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-lg">
                            <h2 className="text-lg font-semibold text-slate-800">Senarai Dokumen Anda</h2>
                        </div>
                        <DocumentTable
                            documents={documents}
                            onRowClick={(doc) => setSelectedDoc(doc)}
                        />
                    </div>
                </>
            )}

            <SubmissionModal
                isOpen={isSubmitting}
                onClose={() => setIsSubmitting(false)}
                onSuccess={() => {
                    if (userId) loadData(userId);
                }}
            />

            <DocumentDetailsSlideOver
                isOpen={!!selectedDoc}
                document={selectedDoc}
                onClose={() => setSelectedDoc(null)}
                onStatusChange={() => {
                    if (userId) loadData(userId);
                }}
            />
        </div>
    );
};

export default PenyemakDashboard;
