import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { updateUserActiveStatus, addUserRole, removeUserRole } from '../../features/admin/adminApi';

const PAGE_SIZE = 15;
const AVAILABLE_ROLES = ['ADMIN', 'PENYEMAK', 'PENGESAH', 'PELULUS'];

interface AdminUserManagementProps {
    users: any[];
    onRefresh: () => void;
}

export const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ users, onRefresh }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

    const filtered = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.roles?.some((r: string) => r.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleToggleActive = async (user: any) => {
        setUpdatingUserId(user.id);
        try {
            await updateUserActiveStatus(user.id, !user.is_active);
            onRefresh();
        } catch (err: any) {
            alert(err.message || 'Gagal mengubah status');
        } finally {
            setUpdatingUserId(null);
        }
    };

    const handleToggleRole = async (user: any, role: string) => {
        // Validation for MVP: Can't easily prevent last admin from removing admin, we'll just show alert if they do and it fails.
        // Or we can just let backend RLS or constraints handle it (if any), currently schemas don't enforce "at least 1 admin".
        const hasRole = user.roles.includes(role);
        setUpdatingUserId(user.id);
        try {
            if (hasRole) {
                await removeUserRole(user.id, role);
            } else {
                await addUserRole(user.id, role);
            }
            onRefresh();
        } catch (err: any) {
            alert(err.message || 'Gagal mengubah peranan');
        } finally {
            setUpdatingUserId(null);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h2 className="font-semibold text-slate-800">Senarai Pengguna</h2>
                <div className="relative max-w-sm w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Cari pengguna/peranan..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3">Nama</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Peranan (Roles)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">Tiada pengguna ditemui</td>
                            </tr>
                        ) : (
                            paginated.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-900">{user.full_name || 'Tiada Nama'}</div>
                                        <div className="text-xs text-slate-500 font-mono">{user.id.substring(0, 8)}...</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleActive(user)}
                                            disabled={updatingUserId === user.id}
                                            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${user.is_active
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                                } disabled:opacity-50`}
                                        >
                                            {user.is_active ? 'Aktif' : 'Tidak Aktif'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {AVAILABLE_ROLES.map(role => {
                                                const hasRole = user.roles.includes(role);
                                                return (
                                                    <button
                                                        key={role}
                                                        onClick={() => handleToggleRole(user, role)}
                                                        disabled={updatingUserId === user.id}
                                                        className={`flex items-center px-2 py-1 text-xs font-medium rounded border transition-colors ${hasRole
                                                            ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                                                            : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                                                            } disabled:opacity-50`}
                                                    >
                                                        {hasRole && <Check size={12} className="mr-1" />} {role}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200">
                <span className="text-sm text-slate-500">
                    Menunjuk {paginated.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0} ke {Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length} rekod
                </span>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-1 rounded-md border border-slate-300 disabled:opacity-50 hover:bg-slate-50"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-1 rounded-md border border-slate-300 disabled:opacity-50 hover:bg-slate-50"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
