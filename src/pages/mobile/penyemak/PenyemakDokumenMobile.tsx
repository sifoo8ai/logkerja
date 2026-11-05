import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { usePenyemakDocuments } from '../../../hooks/usePenyemakDocuments';
import { DocumentDetailsSlideOver } from '../../../components/documents/DocumentDetailsSlideOver';
import { StatusBadge } from '../../../components/documents/StatusBadge';
import { DocumentRow } from '../../../features/documents/penyemakApi';
import { STATUS_LABELS } from '../../../features/documents/referenceCheck';

const PAGE_SIZE = 20;

export const PenyemakDokumenMobile: React.FC = () => {
    const { documents, loading, reload } = usePenyemakDocuments('documents-penyemak-dokumen');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [visible, setVisible] = useState(PAGE_SIZE);
    const [selectedDoc, setSelectedDoc] = useState<DocumentRow | null>(null);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return documents.filter(doc =>
            (!term || doc.reference_no.toLowerCase().includes(term) || (doc.description || '').toLowerCase().includes(term)) &&
            (!statusFilter || doc.current_status === statusFilter)
        );
    }, [documents, search, statusFilter]);

    return (
        <div className="p-4 space-y-4 max-w-md mx-auto">
            <h2 className="text-[22px] font-extrabold text-[#1a2b4b]">Dokumen</h2>

            <div className="space-y-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Cari #Rujukan atau keterangan..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setVisible(PAGE_SIZE); }}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={e => { setStatusFilter(e.target.value); setVisible(PAGE_SIZE); }}
                    className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-white"
                >
                    <option value="">Semua Status</option>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </div>

            {loading && documents.length === 0 ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
            ) : filtered.length === 0 ? (
                <p className="py-8 text-sm text-slate-500 text-center">Tiada dokumen sepadan.</p>
            ) : (
                <ul className="space-y-2">
                    {filtered.slice(0, visible).map(doc => (
                        <li key={doc.id}>
                            <button
                                onClick={() => setSelectedDoc(doc)}
                                className="w-full text-left bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 hover:bg-slate-50"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-slate-800 truncate">{doc.reference_no}</p>
                                    <StatusBadge status={doc.current_status} />
                                </div>
                                <p className="mt-1 text-xs text-slate-500 truncate">
                                    {doc.category?.name || '-'}{doc.description ? ` · ${doc.description}` : ''}
                                </p>
                                <p className="mt-0.5 text-[11px] text-slate-400">
                                    Kemas kini {new Date(doc.updated_at).toLocaleDateString('ms-MY')}
                                </p>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {filtered.length > visible && (
                <button
                    onClick={() => setVisible(v => v + PAGE_SIZE)}
                    className="w-full py-2 text-sm font-semibold text-blue-600 bg-white border border-slate-200 rounded-lg"
                >
                    Papar lagi ({filtered.length - visible})
                </button>
            )}

            <DocumentDetailsSlideOver
                isOpen={!!selectedDoc}
                document={selectedDoc}
                onClose={() => setSelectedDoc(null)}
                onStatusChange={reload}
            />
        </div>
    );
};

export default PenyemakDokumenMobile;
