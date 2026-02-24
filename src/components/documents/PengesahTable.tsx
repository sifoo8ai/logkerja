import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, CheckSquare, Square } from 'lucide-react';
import { DocumentRowExtended } from '../../features/documents/pengesahApi';

const PAGE_SIZE = 10;

interface PengesahTableProps {
    documents: DocumentRowExtended[];
    selectedIds: string[];
    onToggleSelect: (id: string) => void;
    onToggleSelectAll: (ids: string[]) => void;
    onRowClick: (doc: DocumentRowExtended) => void;
}

export const PengesahTable: React.FC<PengesahTableProps> = ({
    documents, selectedIds, onToggleSelect, onToggleSelectAll, onRowClick
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    const filtered = documents.filter(doc =>
        doc.reference_no.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const allCurrentPageSelected = paginated.length > 0 && paginated.every(d => selectedIds.includes(d.id));

    const handleSelectAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (allCurrentPageSelected) {
            onToggleSelectAll(paginated.map(d => d.id)); // will toggle them off in parent logic
        } else {
            onToggleSelectAll(paginated.map(d => d.id)); // will toggle them on
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-200">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Cari #Rujukan..."
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
                            <th className="px-4 py-3 w-10">
                                <button className="flex items-center text-slate-400 hover:text-slate-600 focus:outline-none" onClick={handleSelectAll}>
                                    {allCurrentPageSelected ? <CheckSquare size={18} className="text-blue-600" /> : <Square size={18} />}
                                </button>
                            </th>
                            <th className="px-6 py-3"># Rujukan</th>
                            <th className="px-6 py-3">Penyemak</th>
                            <th className="px-6 py-3">Kategori</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Dikemaskini</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Tiada rekod untuk disahkan</td>
                            </tr>
                        ) : (
                            paginated.map(doc => {
                                const isSelected = selectedIds.includes(doc.id);
                                return (
                                    <tr
                                        key={doc.id}
                                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                                        onClick={() => onRowClick(doc)}
                                    >
                                        <td className="px-4 py-4" onClick={(e) => { e.stopPropagation(); onToggleSelect(doc.id); }}>
                                            {isSelected ? <CheckSquare size={18} className="text-blue-600" /> : <Square size={18} className="text-slate-400" />}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-900">{doc.reference_no}</td>
                                        <td className="px-6 py-4">{doc.creator?.full_name || doc.creator_id?.substring(0, 8) || '-'}</td>
                                        <td className="px-6 py-4">{doc.category?.name || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                                {doc.current_status?.replace('_', ' ')}
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
