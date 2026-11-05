import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Menu, X, Settings } from 'lucide-react';
import { getActiveRole } from '../../lib/auth';
import { getDefaultRoute } from '../../lib/roles';
import BrandLogo from './BrandLogo';

export const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();
    const activeRole = getActiveRole();

    const menuItems = [
        { name: 'Dashboard', path: activeRole ? getDefaultRoute(activeRole) : '/app', icon: Home },
        { name: 'Profile', path: '/app/profile', icon: User },
        // More dynamic options based on roles can be added here
    ];

    return (
        <div className={`bg-slate-900 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} flex flex-col min-h-screen`}>
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div className={`flex items-center gap-2.5 overflow-hidden transition-all ${isOpen ? 'w-auto' : 'w-0 opacity-0'}`}>
                    <BrandLogo className="w-8 h-8" />
                    <h2 className="font-bold text-xl whitespace-nowrap">LogKerja</h2>
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-slate-800 rounded">
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <nav className="flex-1 mt-6">
                <ul className="space-y-2 px-3">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center space-x-3 p-3 rounded hover:bg-slate-800 transition-colors ${location.pathname === item.path ? 'bg-blue-600 hover:bg-blue-700' : ''
                                    }`}
                            >
                                <item.icon size={20} className="flex-shrink-0" />
                                <span className={`overflow-hidden transition-all whitespace-nowrap ${isOpen ? 'w-auto' : 'w-0 opacity-0'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-slate-700 mt-auto">
                <div className={`flex items-center space-x-3 text-slate-400 hover:text-white transition-colors cursor-pointer`}>
                    <Settings size={20} />
                    <span className={`overflow-hidden transition-all whitespace-nowrap ${isOpen ? 'w-auto' : 'w-0 opacity-0'}`}>Settings</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
