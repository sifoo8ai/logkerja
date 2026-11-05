import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import BrandLogo from '../layout/BrandLogo';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';
import { fetchPengesahPendingCount } from '../../features/documents/pengesahApi';
import { fetchPelulusPendingCount } from '../../features/documents/pelulusApi';

export const MobileShell: React.FC<{ role: string }> = ({ role }) => {
    const { user } = useAuth();
    const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

    useEffect(() => {
        if (!user) return;

        // Badge "pending" hanya relevan untuk PENGESAH/PELULUS
        const roleKey = role.toLowerCase();
        if (roleKey !== 'pengesah' && roleKey !== 'pelulus') return;

        // Function to update badge
        const updateBadge = async () => {
            try {
                let currentCount = 0;
                if (role.toLowerCase() === 'pengesah') {
                    currentCount = await fetchPengesahPendingCount(user.id);
                } else if (role.toLowerCase() === 'pelulus') {
                    currentCount = await fetchPelulusPendingCount(user.id);
                }

                const inIframe = window.self !== window.top;
                if (inIframe && currentCount !== undefined) {
                    window.parent.postMessage({ type: "LOGKERJA_PENDING", count: currentCount }, "*");
                }
            } catch (error) {
                console.error('Failed to update global badge count', error);
            }
        };

        // Initial fetch
        updateBadge();

        // Realtime Subscription
        const filterStr = role.toLowerCase() === 'pengesah' ? `verifier_id=eq.${user.id}` : `approver_id=eq.${user.id}`;

        const sub = supabase.channel(`documents-${role}-global-badge`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'documents',
                    filter: filterStr
                },
                () => {
                    updateBadge();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(sub);
        };
    }, [user?.id, role]);

    return (
        <div className="flex flex-col h-[100dvh] bg-[#f8f9fc] font-sans overflow-hidden relative">

            <header className="bg-[#f8f9fc] pt-6 pb-4 px-6 text-center border-b border-gray-100 flex items-center justify-center gap-2 shrink-0 z-10 transition-all duration-300">
                <BrandLogo className="w-6 h-6" />
                <h1 className="text-gray-400 font-extrabold tracking-[0.2em] uppercase text-xs sm:text-sm shadow-sm opacity-80">
                    LogKerja {formattedRole}
                </h1>
            </header>

            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fc]">
                <Outlet />
            </main>

            <div className="shrink-0 relative z-20 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
                <BottomNav role={role} />
            </div>
        </div>
    );
};

export default MobileShell;
