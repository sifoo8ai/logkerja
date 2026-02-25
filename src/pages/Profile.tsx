import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { subscribeUserToPush } from '../features/notifications/pushClient';
import { fetchUserRoles, getActiveRole } from '../lib/auth';
import { User, Mail, Hash, BadgeCheck, Ban, Shield, Layers, Bell, BellOff, Lock } from 'lucide-react';

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<any>(null);
    const [roles, setRoles] = useState<string[]>([]);
    const [activeRole, setActiveRoleState] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [pushStatus, setPushStatus] = useState<string>('');
    const [sessionProvider, setSessionProvider] = useState<string>('');

    useEffect(() => {
        async function loadData() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    const [profResponse, userRoles] = await Promise.all([
                        supabase.from('profiles').select('*').eq('id', session.user.id).single(),
                        fetchUserRoles(session.user.id)
                    ]);
                    setProfile(profResponse.data);
                    setRoles(userRoles);

                    const provider = session.user.app_metadata?.provider || 'Emel';
                    setSessionProvider(provider.charAt(0).toUpperCase() + provider.slice(1));
                }
                setActiveRoleState(getActiveRole());
            } catch (error) {
                console.error("Error loading profile data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();

        if ('Notification' in window) {
            setPushStatus(Notification.permission);
        } else {
            setPushStatus('unsupported');
        }
    }, []);

    const [isPushLoad, setIsPushLoad] = useState(false);

    const handleEnablePush = async () => {
        setIsPushLoad(true);
        const result = await subscribeUserToPush();
        setIsPushLoad(false);

        if (result && result.success) {
            setPushStatus('granted');
            alert('Pemberitahuan push berjaya diaktifkan dan didaftarkan ke pangkalan data!');
        } else {
            alert(result?.error || 'Gagal mengaktifkan pemberitahuan push. Sila periksa tetapan browser anda.');
        }
    };

    if (loading) {
        return (
            <div className="p-6 max-w-5xl mx-auto space-y-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        <div className="h-40 bg-slate-200 rounded-2xl"></div>
                        <div className="h-40 bg-slate-200 rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Profil Saya</h1>
                <p className="text-sm text-slate-500 mt-1">Maklumat akaun, peranan, dan notifikasi.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Kad 1: Maklumat Pengguna */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-5">
                        <User className="text-blue-600" size={20} />
                        <h2 className="text-base font-semibold text-slate-800">Maklumat Pengguna</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500 flex items-center gap-1.5 mb-1"><User size={14} /> Nama</span>
                            <span className="text-sm font-medium text-gray-900">{profile?.full_name || '—'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500 flex items-center gap-1.5 mb-1"><Mail size={14} /> Email</span>
                            <span className="text-sm font-medium text-gray-900">{profile?.email || '—'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500 flex items-center gap-1.5 mb-1"><Hash size={14} /> ID Pengguna</span>
                            <span className="text-sm font-medium text-gray-900">{profile?.id ? profile.id.slice(0, 8) + '…' : '—'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500 flex items-center gap-1.5 mb-1">
                                {profile?.is_active ? <BadgeCheck size={14} className="text-green-500" /> : <Ban size={14} className="text-red-500" />}
                                Status Akaun
                            </span>
                            <div>
                                {profile?.is_active ? (
                                    <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">Aktif</span>
                                ) : (
                                    <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">Tidak Aktif</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kad 2: Peranan & Akses */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-5">
                        <Shield className="text-purple-600" size={20} />
                        <h2 className="text-base font-semibold text-slate-800">Peranan & Akses</h2>
                    </div>
                    <div className="space-y-5">
                        <div>
                            <span className="text-sm leading-tight text-gray-500 flex items-center gap-1.5 mb-2"><Layers size={14} /> Role aktif sekarang</span>
                            <div>
                                {activeRole ? (
                                    <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 shadow-sm">{activeRole}</span>
                                ) : (
                                    <span className="text-sm font-medium text-gray-900">—</span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 mt-2 italic">Role aktif menentukan dashboard yang dipaparkan.</p>
                        </div>
                        <div>
                            <span className="text-sm leading-tight text-gray-500 flex items-center gap-1.5 mb-2"><Shield size={14} /> Semua role anda</span>
                            <div className="flex flex-wrap gap-2">
                                {roles.length > 0 ? roles.map(r => (
                                    <span key={r} className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">{r}</span>
                                )) : (
                                    <span className="text-sm font-medium text-gray-900">Tiada role ditetapkan (Hubungi Admin)</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kad 3: Tetapan Notifikasi (Push) */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-5">
                        {pushStatus === 'granted' ? <Bell className="text-green-600" size={20} /> : <BellOff className="text-amber-600" size={20} />}
                        <h2 className="text-base font-semibold text-slate-800">Tetapan Notifikasi (Push)</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500 mb-1">Status Kebenaran</span>
                            <div>
                                {pushStatus === 'granted' ? (
                                    <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">Dibenarkan</span>
                                ) : pushStatus === 'denied' ? (
                                    <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">Dihalang</span>
                                ) : pushStatus === 'unsupported' ? (
                                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700">Tidak Disokong</span>
                                ) : (
                                    <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-700">Belum Ditetapkan (Default)</span>
                                )}
                            </div>
                        </div>

                        {pushStatus === 'denied' && (
                            <p className="text-xs text-red-600 italic">Sila benarkan notifikasi di setting browser.</p>
                        )}

                        <div className="pt-2">
                            <button
                                onClick={handleEnablePush}
                                disabled={pushStatus === 'unsupported' || pushStatus === 'denied' || isPushLoad}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {isPushLoad ? 'Mendaftar...' : pushStatus === 'granted' ? 'Daftar Semula Push' : 'Aktifkan Notifikasi (Push)'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Kad 4: Keselamatan Sesi */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-5">
                        <Lock className="text-slate-600" size={20} />
                        <h2 className="text-base font-semibold text-slate-800">Keselamatan Sesi</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500 mb-1">Penyedia Sesi (Provider)</span>
                            <span className="text-sm font-medium text-gray-900">{sessionProvider || '—'}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
