import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PendingKpiCardProps {
    count: number;
    loading?: boolean;
    userName?: string;
    targetRoute: string;
}

export const PendingKpiCard: React.FC<PendingKpiCardProps> = ({ count, loading, userName, targetRoute }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-gradient-to-br from-[#8031d2] to-[#4645e5] rounded-[24px] shadow-lg p-6 flex flex-col relative overflow-hidden text-white mt-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-xl"></div>

            <div className="flex items-start gap-4 z-10 mb-6">
                <div className="flex-shrink-0">
                    {loading ? (
                        <div className="w-14 h-16 bg-white/20 animate-pulse rounded-lg mt-1"></div>
                    ) : (
                        <span className="text-[64px] font-bold leading-none tracking-tight shadow-sm drop-shadow-md">{count}</span>
                    )}
                </div>
                <div className="flex flex-col justify-start pt-2">
                    <h3 className="text-lg font-bold leading-tight mb-1 drop-shadow-sm">Dokumen untuk tindakan</h3>
                    <p className="text-sm text-white/80 font-medium">
                        {'{'} {userName || 'Sila Tunggu...'} {'}'}
                    </p>
                </div>
            </div>

            <button
                onClick={() => navigate(targetRoute)}
                className="w-full bg-blue-500/80 hover:bg-blue-600 transition-colors backdrop-blur-sm border border-blue-400/50 text-white rounded-xl py-3.5 font-semibold text-sm z-10 shadow-inner"
            >
                Pergi ke Tindakan
            </button>
        </div>
    );
};

export default PendingKpiCard;
