import React from 'react';

interface KpiCardsProps {
    inProcess: number;
    rejected: number;
    lulus: number;
    total: number;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ inProcess, rejected, lulus, total }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="text-sm font-medium text-slate-500 mb-1">JUMLAH DOKUMEN</h3>
                <p className="text-3xl font-bold text-slate-900">{total}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 border-l-4 border-l-yellow-400">
                <h3 className="text-sm font-medium text-slate-500 mb-1 uppercase">Dalam Proses</h3>
                <p className="text-3xl font-bold text-yellow-600">{inProcess}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 border-l-4 border-l-red-500">
                <h3 className="text-sm font-medium text-slate-500 mb-1 uppercase">Ditolak</h3>
                <p className="text-3xl font-bold text-red-600">{rejected}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 border-l-4 border-l-emerald-500">
                <h3 className="text-sm font-medium text-slate-500 mb-1 uppercase">Lulus</h3>
                <p className="text-3xl font-bold text-emerald-600">{lulus}</p>
            </div>
        </div>
    );
};
