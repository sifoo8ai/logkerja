import React, { useEffect, useState } from 'react';
import { RefreshCw, FileText, Users, FolderTree } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { fetchAllDocuments, fetchAllUsers, fetchAllCategories } from '../../features/admin/adminApi';
import { AdminDocumentsTable } from '../../components/admin/AdminDocumentsTable';
import { AdminUserManagement } from '../../components/admin/AdminUserManagement';
import { AdminCategories } from '../../components/admin/AdminCategories';
import { AdminDocumentDetailsSlideOver } from '../../components/admin/AdminDocumentDetailsSlideOver';

const AdminDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'dokumen' | 'pengguna' | 'kategori'>('dokumen');

    const [documents, setDocuments] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

    const loadData = async () => {
        try {
            const [docs, usrList, cats] = await Promise.all([
                fetchAllDocuments(),
                fetchAllUsers(),
                fetchAllCategories()
            ]);

            setDocuments(docs || []);

            // Transform user roles query output
            const transformedUsers = (usrList || []).map(u => ({
                id: u.id,
                full_name: u.full_name,
                is_active: u.is_active,
                roles: u.user_roles ? u.user_roles.map((r: any) => r.role) : []
            }));

            setUsers(transformedUsers);
            setCategories(cats || []);
        } catch (error) {
            console.error('Error loading admin dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();

        // Subscribe to all changes in documents for ON_HOLD realtime sync
        const subscription = supabase.channel('admin-docs')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'documents'
                },
                () => {
                    loadData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const handleRefresh = () => {
        setLoading(true);
        loadData();
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Admin Governance Portal</h1>
                    <p className="text-slate-500 font-medium">Pengurusan sistem menyeluruh merangkumi pengguna, routing, dan intervensi dokumen.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        className="p-2 bg-white border border-slate-300 text-slate-600 rounded shadow-sm hover:bg-slate-50 transition-colors"
                        title="Segar Semula"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('dokumen')}
                        className={`flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'dokumen'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        <FileText size={18} className="mr-2" />
                        Semua Dokumen
                    </button>
                    <button
                        onClick={() => setActiveTab('pengguna')}
                        className={`flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'pengguna'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        <Users size={18} className="mr-2" />
                        Pengurusan Pengguna
                    </button>
                    <button
                        onClick={() => setActiveTab('kategori')}
                        className={`flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'kategori'
                                ? 'border-teal-600 text-teal-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        <FolderTree size={18} className="mr-2" />
                        Kategori & Routing
                    </button>
                </nav>
            </div>

            {loading && documents.length === 0 && users.length === 0 && categories.length === 0 ? (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : activeTab === 'dokumen' ? (
                <AdminDocumentsTable
                    documents={documents}
                    categories={categories}
                    onRowClick={setSelectedDoc}
                />
            ) : activeTab === 'pengguna' ? (
                <AdminUserManagement
                    users={users}
                    onRefresh={loadData}
                />
            ) : (
                <AdminCategories
                    categories={categories}
                    users={users}
                    onRefresh={loadData}
                />
            )}

            <AdminDocumentDetailsSlideOver
                isOpen={!!selectedDoc}
                onClose={() => setSelectedDoc(null)}
                document={selectedDoc}
                categories={categories}
                onStatusChange={() => {
                    loadData();
                    setSelectedDoc(null);
                }}
            />
        </div>
    );
};

export default AdminDashboard;
