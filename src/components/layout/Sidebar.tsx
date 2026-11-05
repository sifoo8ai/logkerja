import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Settings } from 'lucide-react';
import { getActiveRole } from '../../lib/auth';
import BrandLogo from './BrandLogo';
import { getMenuItems } from './navItems';

export const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();
    const menuItems = getMenuItems(getActiveRole());

    return (
        <div className={`bg-slate-900 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} flex flex-col min-h-screen shrink-0`}>
            <div className={`flex items-center p-4 border-b border-slate-700 ${isOpen ? 'justify-between' : 'justify-center'}`}>
                {isOpen ? (
                    <>
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            <BrandLogo className="w-8 h-8" />
                            <h2 className="font-bold text-xl whitespace-nowrap">LogKerja</h2>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-slate-800 rounded"
                            title="Tutup menu"
                            aria-label="Tutup menu"
                        >
                            <X size={20} />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="rounded-lg hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        title="Buka menu"
                        aria-label="Buka menu"
                    >
                        <BrandLogo className="w-8 h-8" />
                    </button>
                )}
            </div>

            <nav className="flex-1 mt-6">
                <ul className="space-y-2 px-3">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    title={isOpen ? undefined : item.name}
                                    className={`flex items-center h-[30px] rounded-md transition-colors ${isOpen ? 'gap-3 px-3' : 'justify-center'} ${isActive ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-slate-800'}`}
                                >
                                    <item.icon size={18} className="flex-shrink-0" />
                                    <span className={`text-sm whitespace-nowrap ${isOpen ? '' : 'hidden'}`}>
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-slate-700 mt-auto">
                <div
                    title={isOpen ? undefined : 'Settings'}
                    className={`flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer ${isOpen ? 'gap-3 px-3' : 'justify-center'}`}
                >
                    <Settings size={18} className="flex-shrink-0" />
                    <span className={`text-sm whitespace-nowrap ${isOpen ? '' : 'hidden'}`}>Settings</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
