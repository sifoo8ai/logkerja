import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';
import { usePenyemakDocuments } from '../../../hooks/usePenyemakDocuments';
import { SubmissionModal } from '../../../components/documents/SubmissionModal';
import { DocumentDetailsSlideOver } from '../../../components/documents/DocumentDetailsSlideOver';
import { StatusBadge } from '../../../components/documents/StatusBadge';
import { DocumentRow } from '../../../features/documents/penyemakApi';

const RECENT_COUNT = 5;

export const PenyemakHomeMobile: React.FC = () => {
    const { kpis, documents, loading, reload } = usePenyemakDocuments('documents-penyemak-home');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<DocumentRow | null>(null);

    const kpiItems = [
        { label: 'Jumlah', value: kpis.total, color: 'text-slate-900', border: 'border-l-slate-300' },
        { label: 'Dalam Proses', value: kpis.inProcess, color: 'text-yellow-600', border: 'border-l-yellow-400' },
        { label: 'Ditolak', value: kpis.rejected, color: 'text-red-600', border: 'border-l-red-500' },
        { label: 'Lulus', value: kpis.lulus, color: 'text-emerald-600', border: 'border-l-emerald-500' },
    ];

    return (
        <div className="p-4 space-y-5 max-w-md mx-auto">
            <h2 className="text-[22px] font-extrabold text-[#1a2b4b]">Home</h2>

            <button
                onClick={() => setIsSubmitting(true)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-sm hover:bg-blue-700 transition"
            >
                <Plus size={20} /> Daftar Dokumen
            </button>

            <div className="grid grid-cols-2 gap-3">
                {kpiItems.map(item => (
                    <div key={item.label} className={`bg-white rounded-xl border border-slate-200 border-l-4 ${item.border} p-3 shadow-sm`}>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{item.label}</p>
                        <p className={`text-2xl font-bold ${item.color}`}>{loading ? '–' : item.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-700">Dokumen Terkini</h3>
                    <Link to="/app/penyemak/dokumen" className="flex items-center text-xs font-semibold text-blue-600">
                        Lihat semua <ChevronRight size={14} />
                    </Link>
                </div>
                {loading && documents.length === 0 ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                ) : documents.length === 0 ? (
                    <p className="px-4 py-6 text-sm text-slate-500 text-center">Belum ada dokumen.</p>
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {documents.slice(0, RECENT_COUNT).map(doc => (
                            <li key={doc.id}>
                                <button
                                    onClick={() => setSelectedDoc(doc)}
                                    className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-50"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{doc.reference_no}</p>
                                        <p className="text-xs text-slate-500 truncate">{doc.category?.name || '-'}</p>
                                    </div>
                                    <StatusBadge status={doc.current_status} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <SubmissionModal
                isOpen={isSubmitting}
                onClose={() => setIsSubmitting(false)}
                onSuccess={reload}
            />

            <DocumentDetailsSlideOver
                isOpen={!!selectedDoc}
                document={selectedDoc}
                onClose={() => setSelectedDoc(null)}
                onStatusChange={reload}
            />
        </div>
    );
};

export default PenyemakHomeMobile;
