import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const PAGE_SIZE = 10;

interface AdminDocumentsTableProps {
    documents: any[];
    onRowClick: (doc: any) => void;
    categories: any[];
}

export const AdminDocumentsTable: React.FC<AdminDocumentsTableProps> = ({
    documents, onRowClick, categories
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [page, setPage] = useState(1);

    const filtered = documents.filter(doc => {
        const matchSearch = doc.reference_no.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter ? doc.current_status === statusFilter : true;
        const matchCategory = categoryFilter ? doc.category?.id === categoryFilter : true;
        return matchSearch && matchStatus && matchCategory;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Cari #Rujukan..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={categoryFilter}
                        onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                        className="px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map((c: any) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                            className="pl-9 pr-6 py-2 text-sm border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                        >
                            <option value="">Semua Status</option>
                            <option value="PENDING_VERIFIER">Pending Semakan</option>
                            <option value="PENDING_APPROVER">Pending Kelulusan</option>
                            <option value="REJECTED">Ditolak</option>
                            <option value="LULUS">Lulus</option>
                            <option value="ON_HOLD">Ditahan (Hold)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3"># Rujukan</th>
                            <th className="px-6 py-3">Penyemak (Routing)</th>
                            <th className="px-6 py-3">Pelulus (Routing)</th>
                            <th className="px-6 py-3">Kategori</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Dikemaskini</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Tiada rekod ditemui</td>
                            </tr>
                        ) : (
                            paginated.map(doc => {
                                return (
                                    <tr
                                        key={doc.id}
                                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                                        onClick={() => onRowClick(doc)}
                                    >
                                        <td className="px-6 py-4 font-semibold text-slate-900">{doc.reference_no}</td>
                                        <td className="px-6 py-4">{doc.verifier?.full_name || '-'}</td>
                                        <td className="px-6 py-4">{doc.approver?.full_name || '-'}</td>
                                        <td className="px-6 py-4">{doc.category?.name || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${doc.current_status === 'LULUS' ? 'bg-emerald-100 text-emerald-800' :
                                                    doc.current_status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                        doc.current_status === 'ON_HOLD' ? 'bg-gray-100 text-gray-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {doc.current_status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{new Date(doc.updated_at).toLocaleDateString()}</td>
                                    </tr>
                                )
                            })
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
                    <span className="text-sm text-slate-600 font-medium">
                        Page {page} of {totalPages}
                    </span>
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
