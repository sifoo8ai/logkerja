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

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const AppRouter = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(() => {
            setLoading(false);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange(() => {
            setLoading(false);
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
                <Route path="penyemak" element={<PenyemakDashboard />} />
                <Route path="pengesah" element={<PengesahDashboard />} />
                <Route path="pelulus" element={<PelulusDashboard />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRouter;
