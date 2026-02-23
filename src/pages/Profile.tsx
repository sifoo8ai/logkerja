import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                setProfile(data);
            }
            setLoading(false);
        }
        loadProfile();
    }, []);

    if (loading) return <div>Loading Profile...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>
            <pre className="bg-white p-4 rounded shadow border">
                {JSON.stringify(profile, null, 2)}
            </pre>
        </div>
    );
};

export default Profile;
