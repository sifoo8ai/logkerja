import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signOut, getActiveRole } from '../../lib/auth';

const Topbar: React.FC = () => {
    const navigate = useNavigate();
    const activeRole = getActiveRole();

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow relative z-10">
            <div className="flex justify-between items-center px-6 py-4">
                <div className="flex items-center space-x-4">
                    <span className="text-gray-800 font-semibold text-lg">LogKerja</span>
                    {activeRole && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase tracking-wide font-medium">
                            {activeRole}
                        </span>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    <Link to="/app/profile" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                        Profile
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="text-gray-600 hover:text-red-600 text-sm font-medium"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
