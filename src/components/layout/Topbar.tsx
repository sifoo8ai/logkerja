import React from 'react';
import { useLocation } from 'react-router-dom';
import { getActiveRole } from '../../lib/auth';
import { getPageTitle } from './navItems';
import UserMenu from './UserMenu';

const Topbar: React.FC = () => {
    const location = useLocation();
    const pageTitle = getPageTitle(location.pathname, getActiveRole());

    return (
        <header className="bg-white shadow relative z-10">
            <div className="flex justify-between items-center px-6 py-3">
                <div className="flex items-baseline gap-2 min-w-0">
                    <h1 className="text-lg font-bold text-blue-600 whitespace-nowrap">{pageTitle}</h1>
                    <span className="text-gray-300" aria-hidden="true">|</span>
                    <span className="text-sm text-gray-600 truncate">Sistem Notifikasi Tindakan Berpusat</span>
                </div>

                <UserMenu />
            </div>
        </header>
    );
};

export default Topbar;
