import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { subscribeUserToPush } from '../features/notifications/pushClient';

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [pushStatus, setPushStatus] = useState<string>('');

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

        if ('Notification' in window) {
            setPushStatus(Notification.permission);
        } else {
            setPushStatus('unsupported');
        }
    }, []);

    const handleEnablePush = async () => {
        const success = await subscribeUserToPush();
        if (success) {
            setPushStatus('granted');
            alert('Pemberitahuan push berjaya diaktifkan!');
        } else {
            alert('Gagal mengaktifkan pemberitahuan push. Sila periksa tetapan browser anda.');
        }
    };

    if (loading) return <div>Loading Profile...</div>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Profil Saya</h1>

            <div className="bg-white p-6 rounded shadow border mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Maklumat Pengguna</h2>
                <pre className="bg-gray-50 p-4 rounded text-sm text-gray-800 overflow-x-auto">
                    {JSON.stringify(profile, null, 2)}
                </pre>
            </div>

            <div className="bg-white p-6 rounded shadow border">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Tetapan Notifikasi</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Status Semasa:
                    <span className={`ml-2 font-medium ${pushStatus === 'granted' ? 'text-green-600' :
                            pushStatus === 'denied' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                        {pushStatus === 'granted' ? 'Dibenarkan' :
                            pushStatus === 'unsupported' ? 'Tidak Disokong' :
                                pushStatus === 'denied' ? 'Dihalang' : 'Belum Ditetapkan'}
                    </span>
                </p>

                <button
                    onClick={handleEnablePush}
                    disabled={pushStatus === 'granted' || pushStatus === 'unsupported' || pushStatus === 'denied'}
                    className="px-4 py-2 bg-blue-600 text-white rounded font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    Aktifkan Notifikasi (Push)
                </button>
            </div>
        </div>
    );
};

export default Profile;
