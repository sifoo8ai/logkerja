import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { fetchUserRoles, setActiveRole as setStorageActiveRole, getActiveRole } from '../lib/auth';
import { getDefaultRoute } from '../lib/roles';
import { checkAndBootstrapProfile, signOut } from '../lib/auth';

const RolePicker: React.FC = () => {
    const [roles, setRoles] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function init() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/login');
                return;
            }

            const profile = await checkAndBootstrapProfile(session.user);
            if (!profile) {
                setErrorMsg('Error loading or creating profile.');
                setLoading(false);
                return;
            }

            if (!profile.is_active) {
                setErrorMsg('Your account is deactivated. Contact admin.');
                setLoading(false);
                return;
            }

            const userRoles = await fetchUserRoles(session.user.id);

            if (userRoles.length === 0) {
                setErrorMsg('No roles assigned. Contact admin.');
                setLoading(false);
                return;
            }

            if (userRoles.length === 1) {
                const singleRole = userRoles[0];
                setStorageActiveRole(singleRole);
                navigate(getDefaultRoute(singleRole));
                return;
            }

            setRoles(userRoles);
            setLoading(false);
        }

        init();
    }, [navigate]);

    const handleRoleSelect = (role: string) => {
        setStorageActiveRole(role);
        navigate(getDefaultRoute(role));
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (errorMsg) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded shadow text-center text-red-600 max-w-md w-full">
                    <p className="mb-4">{errorMsg}</p>
                    <button onClick={handleLogout} className="text-white bg-slate-800 px-4 py-2 rounded">
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded shadow max-w-sm w-full text-center">
                <h2 className="text-2xl font-semibold mb-6">Select Your Role</h2>
                <div className="space-y-4">
                    {roles.map((role) => (
                        <button
                            key={role}
                            onClick={() => handleRoleSelect(role)}
                            className="block w-full text-white bg-blue-600 hover:bg-blue-700 font-medium py-3 px-4 rounded"
                        >
                            {role}
                        </button>
                    ))}
                </div>
                <div className="mt-8">
                    <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700 text-sm">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RolePicker;
