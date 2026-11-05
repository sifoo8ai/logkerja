import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import RolePicker from '../pages/RolePicker';
import Profile from '../pages/Profile';
import AppShell from '../components/layout/AppShell';

// Dashboards
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import PenyemakDashboard from '../pages/dashboards/PenyemakDashboard';
import PengesahDashboard from '../pages/dashboards/PengesahDashboard';
import PelulusDashboard from '../pages/dashboards/PelulusDashboard';

import { useMediaQuery } from '../hooks/useMediaQuery';

// Mobile Pages
import PengesahHomeMobile from '../pages/mobile/pengesah/PengesahHomeMobile';
import PengesahTindakanMobile from '../pages/mobile/pengesah/PengesahTindakanMobile';
import PengesahHistoryMobile from '../pages/mobile/pengesah/PengesahHistoryMobile';
import PelulusHomeMobile from '../pages/mobile/pelulus/PelulusHomeMobile';
import PelulusTindakanMobile from '../pages/mobile/pelulus/PelulusTindakanMobile';
import PelulusHistoryMobile from '../pages/mobile/pelulus/PelulusHistoryMobile';
import PenyemakHomeMobile from '../pages/mobile/penyemak/PenyemakHomeMobile';
import PenyemakDokumenMobile from '../pages/mobile/penyemak/PenyemakDokumenMobile';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const PengesahIndex = () => {
    const isCompact = useMediaQuery('(max-width: 768px)');
    return isCompact ? <Navigate to="home" replace /> : <PengesahDashboard />;
};

const PenyemakIndex = () => {
    const isCompact = useMediaQuery('(max-width: 768px)');
    return isCompact ? <Navigate to="home" replace /> : <PenyemakDashboard />;
};

const PelulusIndex = () => {
    const isCompact = useMediaQuery('(max-width: 768px)');
    return isCompact ? <Navigate to="home" replace /> : <PelulusDashboard />;
};


export const AppRouter = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setLoading(false);
            // Jika berjaya log masuk dan ini ialah popup window, tutupnya
            if (session && window.opener) {
                window.opener.postMessage({ type: 'popup-login-success', session }, '*');
                window.close();
            }
        });

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setLoading(false);
            // Tutup jika auth state bertukar kepada log masuk pada popup
            if (session && window.opener) {
                window.opener.postMessage({ type: 'popup-login-success', session }, '*');
                window.close();
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading authentication...</div>;
    }

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/role-picker" element={<RolePicker />} />

            {/* Protected Layout */}
            <Route path="/app" element={<AppShell />}>
                {/* Child routes load inside Outlet */}
                <Route index element={<Navigate to="/role-picker" replace />} />

                <Route path="profile" element={<Profile />} />

                <Route path="admin" element={<AdminDashboard />} />
                <Route path="penyemak">
                    <Route index element={<PenyemakIndex />} />
                    <Route path="home" element={<PenyemakHomeMobile />} />
                    <Route path="dokumen" element={<PenyemakDokumenMobile />} />
                    <Route path="profile" element={<Profile />} />
                </Route>

                <Route path="pengesah">
                    <Route index element={<PengesahIndex />} />
                    <Route path="home" element={<PengesahHomeMobile />} />
                    <Route path="tindakan" element={<PengesahTindakanMobile />} />
                    <Route path="history" element={<PengesahHistoryMobile />} />
                    <Route path="profile" element={<Profile />} />
                </Route>

                <Route path="pelulus">
                    <Route index element={<PelulusIndex />} />
                    <Route path="home" element={<PelulusHomeMobile />} />
                    <Route path="tindakan" element={<PelulusTindakanMobile />} />
                    <Route path="history" element={<PelulusHistoryMobile />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRouter;
