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
        // Kad utama
        <div className="relative overflow-hidden bg-gradient-to-br from-[#7434db] to-[#4542e6] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 md:p-7 text-white mt-4 border border-white/10 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">

            {/* Efek glow belakang */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-5 z-10 relative mb-7">
                {/* Bekas nombor */}
                {loading ? (
                    <div className="w-16 h-16 bg-white/20 animate-pulse rounded-2xl shrink-0"></div>
                ) : (
                    <div className="shrink-0 bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/20 shadow-inner">
                        <span className="text-5xl font-black tracking-tight drop-shadow-sm">{count}</span>
                    </div>
                )}

                {/* UBAH KAT SINI: 
                    Tambah `flex-1 min-w-0` supaya flex container ni tahu cara nak mengecut
                */}
                <div className="flex flex-col justify-center flex-1 min-w-0">
                    {/* Buang truncate di sini supaya teks boleh turun ke second line */}
                    <h3 className="text-base font-bold leading-snug mb-1 drop-shadow-sm">
                        Dokumen untuk tindakan
                    </h3>

                    {/* UBAH KAT SINI: Guna `flex w-full` ganti `inline-flex` */}
                    <div className="flex items-center gap-1.5 opacity-90 w-full">
                        {/* UBAH KAT SINI: Tambah `shrink-0` supaya ikon tak penyek */}
                        <svg className="w-3.5 h-3.5 text-white/80 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {/* Teks nama user kekal dengan truncate */}
                        <p className="text-[11px] sm:text-xs font-medium tracking-wide uppercase truncate">
                            {userName || 'Memuatkan...'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Button */}
            <button
                onClick={() => navigate(targetRoute)}
                className="group relative w-full flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 active:bg-white/30 transition-all duration-300 backdrop-blur-md border border-white/20 text-white rounded-xl py-3.5 font-semibold text-sm z-10 overflow-hidden shadow-sm"
            >
                <span>Semak Sekarang</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </button>
        </div>
    );
};

export default PendingKpiCard;