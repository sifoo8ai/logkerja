import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { supabase } from '../../lib/supabaseClient';
import { getActiveRole, checkAndBootstrapProfile } from '../../lib/auth';
import { ROLE_ROUTES } from '../../lib/roles';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import MobileShell from '../mobile/MobileShell';
import ErpCaptureHost from '../erp/ErpCaptureHost';

export const AppShell: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        async function checkAuth() {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                navigate('/login');
                return;
            }

            const profile = await checkAndBootstrapProfile(session.user);
            if (!profile || !profile.is_active) {
                navigate('/role-picker'); // will show error message
                return;
            }

            const role = getActiveRole();
            if (!role) {
                navigate('/role-picker');
                return;
            }

            const expectedRoutePrefix = ROLE_ROUTES[role];
            if (location.pathname !== '/app/profile' && expectedRoutePrefix && !location.pathname.startsWith(expectedRoutePrefix)) {
                navigate(expectedRoutePrefix);
                return;
            }

            setLoading(false);
        }

        checkAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
                navigate('/login');
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [navigate, location.pathname]);

    const role = getActiveRole();
    const isCompact = useMediaQuery('(max-width: 768px)');
    const isMobileMode = isCompact && (role === 'PENGESAH' || role === 'PELULUS' || role === 'PENYEMAK');

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading App...</div>;
    }

    if (isMobileMode && role) {
        return (
            <>
                <MobileShell role={role} />
                <ErpCaptureHost />
            </>
        );
    }

    return (
        <div className="flex bg-gray-50 font-sans h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <Outlet />
                </main>
            </div>
            <ErpCaptureHost />
        </div>
    );
};

export default AppShell;
