import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export const MobileShell: React.FC<{ role: string }> = ({ role }) => {
    return (
        <div className="flex flex-col h-[100dvh] bg-gray-50 font-sans overflow-hidden relative">
            <header className="flex items-center justify-center p-4 bg-primary text-white shrink-0 shadow-sm z-10 duration-200">
                <h1 className="text-lg font-bold tracking-tight">LogKerja {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}</h1>
            </header>
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                <Outlet />
            </main>
            <BottomNav role={role} />
        </div>
    );
};

export default MobileShell;
