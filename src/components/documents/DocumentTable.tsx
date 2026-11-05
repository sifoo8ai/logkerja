import React, { useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface DocumentRow {
    id: string;
    reference_no: string;
    current_status: string;
    created_at: string;
    updated_at: string;
    description: string | null;
    category: {
        id: string;
        name: string;
    } | null;
}

interface DocumentTableProps {
    documents: DocumentRow[];
    onRowClick?: (doc: DocumentRow) => void;
}

const statusColors: Record<string, string> = {
    'PENDING_VERIFIER': 'bg-yellow-100 text-yellow-800',
    'PENDING_APPROVER': 'bg-orange-100 text-orange-800',
    'REJECTED': 'bg-red-100 text-red-800',
    'LULUS': 'bg-emerald-100 text-emerald-800',
    'ON_HOLD': 'bg-slate-100 text-slate-800',
};

const PAGE_SIZE = 10;

export const DocumentTable: React.FC<DocumentTableProps> = ({ documents, onRowClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [page, setPage] = useState(1);

    // Senarai kategori unik daripada dokumen sedia ada (tiada query tambahan)
    const categories = useMemo(() => {
        const map = new Map<string, string>();
        documents.forEach(doc => {
            if (doc.category) map.set(doc.category.id, doc.category.name);
        });
        return Array.from(map, ([id, name]) => ({ id, name }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [documents]);

    const filtered = documents.filter(doc => {
        const matchesSearch = doc.reference_no.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? doc.current_status === statusFilter : true;
        const matchesCategory = categoryFilter ? doc.category?.id === categoryFilter : true;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row p-4 border-b border-slate-200 justify-between gap-4">
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
                <div className="flex flex-col sm:flex-row gap-2">
                    <select
                        value={categoryFilter}
                        onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                        className="w-full md:w-auto text-sm border border-slate-300 rounded-md px-3 py-2"
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="w-full md:w-auto text-sm border border-slate-300 rounded-md px-3 py-2"
                    >
                        <option value="">Semua Status</option>
                        <option value="PENDING_VERIFIER">Pending Verifier</option>
                        <option value="PENDING_APPROVER">Pending Approver</option>
                        <option value="LULUS">Lulus</option>
                        <option value="REJECTED">Ditolak</option>
                        <option value="ON_HOLD">On Hold</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3"># Rujukan</th>
                            <th className="px-6 py-3">Kategori</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Tarikh Daftar</th>
                            <th className="px-6 py-3">Kemaskini Terakhir</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Tiada rekod dijumpai</td>
                            </tr>
                        ) : (
                            paginated.map(doc => (
                                <tr
                                    key={doc.id}
                                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                                    onClick={() => onRowClick && onRowClick(doc)}
                                >
                                    <td className="px-6 py-4 font-semibold text-slate-900">{doc.reference_no}</td>
                                    <td className="px-6 py-4">{doc.category?.name || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[doc.current_status] || 'bg-slate-100'}`}>
                                            {doc.current_status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(doc.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(doc.updated_at).toLocaleDateString()}</td>
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
