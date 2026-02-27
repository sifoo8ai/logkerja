import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { fetchPelulusPendingCount } from '../../../features/documents/pelulusApi';
import PendingKpiCard from '../../../components/mobile/PendingKpiCard';
import { supabase } from '../../../lib/supabaseClient';

export const PelulusHomeMobile: React.FC = () => {
    const { user } = useAuth();
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');

    const loadData = async () => {
        if (!user) return;
        try {
            const data = await fetchPelulusPendingCount(user.id);
            setCount(data);
            const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
            if (profile) setUserName(profile.full_name);
        } catch (error) {
            console.error('Failed to load pending count:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();

        // Realtime Subscription
        if (!user) return;
        const sub = supabase.channel('documents-pelulus-home')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'documents',
                    filter: `approver_id=eq.${user.id}`
                },
                () => {
                    loadData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(sub);
        };
    }, [user?.id]);

    return (
        <div className="p-4 space-y-6 max-w-md mx-auto relative">
            <h2 className="text-xl font-bold text-gray-800">Home</h2>
            <PendingKpiCard
                count={count}
                loading={loading}
                userName={userName}
                targetRoute="/app/pelulus/tindakan"
            />
        </div>
    );
};

export default PelulusHomeMobile;
