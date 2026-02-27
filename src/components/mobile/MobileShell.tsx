import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav'; // Aku assume ni kau punya komponen sedia ada

export const MobileShell: React.FC<{ role: string }> = ({ role }) => {
    // Format nama role bagi cun (contoh: "PENGESAH")
    const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

    return (
        // Aku tukar bg sikit bagi match dengan vibe premium
        <div className="flex flex-col h-[100dvh] bg-[#f8f9fc] font-sans overflow-hidden relative">

            {/* --- HEADER BARU (GAYA KAYANGAN) --- */}
            <header className="bg-[#f8f9fc] pt-6 pb-4 px-6 text-center border-b border-gray-100 flex items-center justify-center shrink-0 z-10 transition-all duration-300">
                {/* Teks kita bagi tracking luas (jarak huruf) supaya nampak macam app eksklusif */}
                <h1 className="text-gray-400 font-extrabold tracking-[0.2em] uppercase text-xs sm:text-sm shadow-sm opacity-80">
                    LogKerja {formattedRole}
                </h1>
            </header>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fc]">
                <Outlet />
            </main>

            {/* --- BOTTOM NAV MAINTAIN --- */}
            <div className="shrink-0 relative z-20 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
                <BottomNav role={role} />
            </div>
        </div>
    );
};

export default MobileShell;
