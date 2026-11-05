import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, Clock, User, FileText } from 'lucide-react';

export const BottomNav: React.FC<{ role: string }> = ({ role }) => {
    const basePath = `/app/${role.toLowerCase()}`;

    const tabs = role.toUpperCase() === 'PENYEMAK'
        ? [
            { name: 'Home', path: `${basePath}/home`, icon: Home },
            { name: 'Dokumen', path: `${basePath}/dokumen`, icon: FileText },
            { name: 'Profile', path: `${basePath}/profile`, icon: User },
        ]
        : [
            { name: 'Home', path: `${basePath}/home`, icon: Home },
            { name: 'Tindakan', path: `${basePath}/tindakan`, icon: CheckSquare },
            { name: 'History', path: `${basePath}/history`, icon: Clock },
            { name: 'Profile', path: `${basePath}/profile`, icon: User },
        ];

    return (
        <nav className="flex items-center justify-around bg-white border-t border-gray-200 shrink-0 pb-safe pb-4 pt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                    <NavLink
                        key={tab.name}
                        to={tab.path}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center w-full py-1 space-y-1 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon className={`w-6 h-6 ${isActive ? 'fill-blue-50/50' : ''}`} />
                                <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>{tab.name}</span>
                            </>
                        )}
                    </NavLink>
                );
            })}
        </nav>
    );
};

export default BottomNav;
