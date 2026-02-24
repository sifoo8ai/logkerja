import React, { useState } from 'react';
import { Plus, Edit2, Check, X, Loader2 } from 'lucide-react';
import { createCategory, updateCategory } from '../../features/admin/adminApi';

interface AdminCategoriesProps {
    categories: any[];
    users: any[];
    onRefresh: () => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({ categories, users, onRefresh }) => {
    const [isEditingId, setIsEditingId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const [editForm, setEditForm] = useState({
        name: '', description: '', is_active: true,
        verifierId: '', approverId: ''
    });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    // Helpers to populate dropdowns with users who have the correct roles
    // Actually, any active user could technically be assigned, but ideally we match roles.
    // For MVP, just list all active users to keep it simple, or filter by 'PENGESAH'/'PELULUS'
    const verifierUsers = users.filter(u => u.is_active && u.roles.includes('PENGESAH'));
    const approverUsers = users.filter(u => u.is_active && u.roles.includes('PELULUS'));

    const startEdit = (cat: any) => {
        setIsCreating(false);
        setIsEditingId(cat.id);
        setEditForm({
            name: cat.name,
            description: cat.description || '',
            is_active: cat.is_active,
            verifierId: cat.routing?.[0]?.default_verifier_id || '',
            approverId: cat.routing?.[0]?.default_approver_id || ''
        });
        setError('');
    };

    const startCreate = () => {
        setIsEditingId(null);
        setIsCreating(true);
        setEditForm({
            name: '', description: '', is_active: true,
            verifierId: '', approverId: ''
        });
        setError('');
    };

    const cancelEdit = () => {
        setIsEditingId(null);
        setIsCreating(false);
        setError('');
    };

    const handleSave = async () => {
        if (!editForm.name.trim() || !editForm.verifierId || !editForm.approverId) {
            setError('Nama, Penyemak lalai dan Pelulus lalai wajib diisi.');
            return;
        }

        setSaving(true);
        setError('');
        try {
            if (isCreating) {
                await createCategory(editForm.name, editForm.description, editForm.verifierId, editForm.approverId);
            } else if (isEditingId) {
                await updateCategory(isEditingId, editForm.name, editForm.description, editForm.is_active, editForm.verifierId, editForm.approverId);
            }
            onRefresh();
            cancelEdit();
        } catch (err: any) {
            setError(err.message || 'Gagal menyimpan kategori');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h2 className="font-semibold text-slate-800">Senarai Kategori & Routing</h2>
                {!isCreating && <button
                    onClick={startCreate}
                    className="flex flex-row items-center px-3 py-1.5 bg-blue-600 text-white font-medium text-sm rounded hover:bg-blue-700 transition"
                >
                    <Plus size={16} className="mr-1" /> Tambah Kategori
                </button>}
            </div>

            <div className="p-4 overflow-x-auto">
                {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">{error}</p>}

                <div className="w-full text-left text-sm min-w-[900px] border-t border-slate-200">
                    <div className="bg-slate-50 text-slate-600 font-medium flex gap-4 px-4 py-3 border-b border-slate-200">
                        <div className="flex-[1.5] min-w-0">Nama Kategori</div>
                        <div className="flex-1 min-w-0">Routing (Penyemak)</div>
                        <div className="flex-1 min-w-0">Routing (Pelulus)</div>
                        <div className="w-24 shrink-0">Status</div>
                        <div className="w-24 shrink-0">Tindakan</div>
                    </div>
                    <div className="divide-y divide-slate-100 text-slate-700">
                        {isCreating && (
                            <div className="bg-blue-50/50 flex gap-4 px-4 py-4 items-start">
                                <div className="flex-[1.5] min-w-0 flex flex-col gap-2">
                                    <input
                                        type="text"
                                        placeholder="Nama kategori"
                                        value={editForm.name}
                                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full p-2 border border-blue-300 rounded text-sm focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Description (Optional)"
                                        value={editForm.description}
                                        onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                        className="w-full p-2 border border-slate-300 rounded text-xs"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <select
                                        value={editForm.verifierId}
                                        onChange={e => setEditForm({ ...editForm, verifierId: e.target.value })}
                                        className="w-full p-2 border border-slate-300 rounded text-sm bg-white"
                                    >
                                        <option value="">-- Pilih Penyemak --</option>
                                        {verifierUsers.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                                    </select>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <select
                                        value={editForm.approverId}
                                        onChange={e => setEditForm({ ...editForm, approverId: e.target.value })}
                                        className="w-full p-2 border border-slate-300 rounded text-sm bg-white"
                                    >
                                        <option value="">-- Pilih Pelulus --</option>
                                        {approverUsers.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                                    </select>
                                </div>
                                <div className="w-24 shrink-0 pt-2">
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">Aktif</span>
                                </div>
                                <div className="w-24 shrink-0 pt-1 flex gap-2">
                                    <button onClick={handleSave} disabled={saving} className="p-1.5 text-emerald-600 hover:text-white hover:bg-emerald-600 rounded transition border border-emerald-600">
                                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                    </button>
                                    <button onClick={cancelEdit} disabled={saving} className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-500 rounded transition border border-slate-300">
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {categories.map(cat => {
                            const isEditing = isEditingId === cat.id;
                            return (
                                <div key={cat.id} className="flex gap-4 px-4 py-4 items-start hover:bg-slate-50 transition-colors">
                                    <div className="flex-[1.5] min-w-0 flex flex-col gap-2">
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="w-full p-2 border border-blue-300 rounded text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    value={editForm.description}
                                                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                                    className="w-full p-2 border border-slate-300 rounded text-xs"
                                                />
                                            </>
                                        ) : (
                                            <div>
                                                <p className="font-semibold text-slate-800 break-words">{cat.name}</p>
                                                <p className="text-xs text-slate-500 break-words mt-1">{cat.description || '-'}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {isEditing ? (
                                            <select
                                                value={editForm.verifierId}
                                                onChange={e => setEditForm({ ...editForm, verifierId: e.target.value })}
                                                className="w-full p-2 border border-slate-300 rounded text-sm bg-white"
                                            >
                                                <option value="">-- Pilih Penyemak --</option>
                                                {verifierUsers.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                                            </select>
                                        ) : (
                                            <span className="text-slate-800 break-words">{cat.routing?.[0]?.verifier?.full_name || '-'}</span>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {isEditing ? (
                                            <select
                                                value={editForm.approverId}
                                                onChange={e => setEditForm({ ...editForm, approverId: e.target.value })}
                                                className="w-full p-2 border border-slate-300 rounded text-sm bg-white"
                                            >
                                                <option value="">-- Pilih Pelulus --</option>
                                                {approverUsers.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                                            </select>
                                        ) : (
                                            <span className="text-slate-800 break-words">{cat.routing?.[0]?.approver?.full_name || '-'}</span>
                                        )}
                                    </div>

                                    <div className="w-24 shrink-0 pt-2">
                                        {isEditing ? (
                                            <label className="flex items-center space-x-2 text-sm cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={editForm.is_active}
                                                    onChange={e => setEditForm({ ...editForm, is_active: e.target.checked })}
                                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                                />
                                                <span>Aktif</span>
                                            </label>
                                        ) : (
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${cat.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {cat.is_active ? 'Aktif' : 'Tidak Aktif'}
                                            </span>
                                        )}
                                    </div>

                                    <div className="w-24 shrink-0 pt-1 flex gap-2">
                                        {isEditing ? (
                                            <>
                                                <button onClick={handleSave} disabled={saving} className="p-1.5 text-emerald-600 hover:text-white hover:bg-emerald-600 rounded transition border border-emerald-600">
                                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                                </button>
                                                <button onClick={cancelEdit} disabled={saving} className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-500 rounded transition border border-slate-300">
                                                    <X size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => startEdit(cat)}
                                                disabled={isCreating || isEditingId !== null}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition border border-transparent hover:border-blue-200 disabled:opacity-50"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                {categories.length === 0 && !isCreating && (
                    <p className="text-center text-slate-500 py-6 text-sm">Tiada kategori ditemui.</p>
                )}
            </div>
        </div>
    );
};
