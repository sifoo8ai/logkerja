import { Home, User, type LucideIcon } from 'lucide-react';
import { getDefaultRoute } from '../../lib/roles';

export interface NavItem {
    name: string;
    path: string;
    icon: LucideIcon;
}

/** Menu sidebar desktop — sumber tunggal nama page untuk Sidebar & Topbar. */
export function getMenuItems(role: string | null): NavItem[] {
    return [
        { name: 'Dashboard', path: role ? getDefaultRoute(role) : '/app', icon: Home },
        { name: 'Profile', path: '/app/profile', icon: User },
    ];
}

/** Nama page semasa berdasarkan path; fallback "Dashboard". */
export function getPageTitle(pathname: string, role: string | null): string {
    const items = getMenuItems(role);
    const exact = items.find((i) => i.path === pathname);
    if (exact) return exact.name;
    if (pathname.endsWith('/profile')) return 'Profile';
    return 'Dashboard';
}

export function formatRoleLabel(role: string | null): string {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}
