import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';
import { fetchPenyemakDocuments, fetchPenyemakKPIs, DocumentRow } from '../features/documents/penyemakApi';

/** KPI + senarai dokumen milik PENYEMAK semasa, dengan kemas kini realtime (penapis creator_id). */
export function usePenyemakDocuments(channelName: string) {
    const { user } = useAuth();
    const userId = user?.id;
    const [kpis, setKpis] = useState({ inProcess: 0, rejected: 0, lulus: 0, total: 0 });
    const [documents, setDocuments] = useState<DocumentRow[]>([]);
    const [loading, setLoading] = useState(true);

    const reload = useCallback(async () => {
        if (!userId) return;
        try {
            const [kpiData, docs] = await Promise.all([
                fetchPenyemakKPIs(userId),
                fetchPenyemakDocuments(userId),
            ]);
            setKpis(kpiData);
            setDocuments(docs);
        } catch (error) {
            console.error('Gagal memuatkan dokumen penyemak:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        reload();

        const sub = supabase.channel(channelName)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'documents', filter: `creator_id=eq.${userId}` },
                () => { reload(); }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(sub);
        };
    }, [userId, channelName, reload]);

    return { kpis, documents, loading, reload };
}
