import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronDown, Check, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { fetchUserRoles, getActiveRole, setActiveRole, signOut } from '../../lib/auth';
import { getDefaultRoute } from '../../lib/roles';
import { formatRoleLabel } from './navItems';

/**
 * Butang avatar + role di topbar. Dropdown papar senarai role user (tukar role tanpa logout)
 * dan butang Log keluar.
 */
export const UserMenu: React.FC = () => {
    const navigate = useNavigate();
    const activeRole = getActiveRole();
    const [open, setOpen] = useState(false);
    const [roles, setRoles] = useState<string[]>([]);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session || cancelled) return;
            const [profRes, userRoles] = await Promise.all([
                supabase.from('profiles').select('full_name, email').eq('id', session.user.id).single(),
                fetchUserRoles(session.user.id),
            ]);
            if (cancelled) return;
            setFullName(profRes.data?.full_name || session.user.email || '');
            setEmail(profRes.data?.email || session.user.email || '');
            setRoles(userRoles);
        })().catch((e) => console.error('Gagal muat menu pengguna:', e));
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (!open) return;
        const onClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const handleSwitchRole = (role: string) => {
        setOpen(false);
        if (role === activeRole) return;
        setActiveRole(role);
        navigate(getDefaultRoute(role));
    };

    const handleLogout = async () => {
        setOpen(false);
        await signOut();
        navigate('/login');
    };

    const roleList = roles.length > 0 ? roles : activeRole ? [activeRole] : [];

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={open}
                className="flex items-center gap-2.5 rounded-full pl-1 pr-2 py-1 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
                <span className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center shrink-0">
                    <User size={18} className="text-white" />
                </span>
                <span className="text-sm font-semibold text-gray-900">{formatRoleLabel(activeRole)}</span>
                <ChevronDown
                    size={16}
                    className={`text-gray-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            <div
                role="menu"
                className={`absolute right-0 mt-2 w-64 origin-top-right bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 transition-all duration-150 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
            >
                {(fullName || email) && (
                    <div className="px-4 pb-2 mb-1 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{fullName}</p>
                        {email && <p className="text-xs text-gray-500 truncate">{email}</p>}
                    </div>
                )}

                <p className="px-4 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    Tukar peranan
                </p>
                {roleList.map((role) => {
                    const isActive = role === activeRole;
                    return (
                        <button
                            key={role}
                            type="button"
                            role="menuitem"
                            disabled={isActive}
                            onClick={() => handleSwitchRole(role)}
                            className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left transition-colors ${isActive ? 'text-blue-600 font-semibold bg-blue-50 cursor-default' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            <span>{formatRoleLabel(role)}</span>
                            {isActive && <Check size={16} />}
                        </button>
                    );
                })}

                <div className="my-1 border-t border-gray-100" />
                <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut size={16} />
                    Log keluar
                </button>
            </div>
        </div>
    );
};

export default UserMenu;
