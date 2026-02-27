import React from 'react';
import { Clock } from 'lucide-react';

interface PendingKpiCardProps {
    count: number;
    loading?: boolean;
}

export const PendingKpiCard: React.FC<PendingKpiCardProps> = ({ count, loading }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="bg-orange-50 p-3 rounded-full">
                <Clock className="w-8 h-8 text-orange-500" />
            </div>
            <div>
                <h3 className="text-gray-500 text-sm font-medium">Menunggu Tindakan</h3>
                {loading ? (
                    <div className="h-10 w-16 bg-gray-200 animate-pulse rounded mt-1 mx-auto"></div>
                ) : (
                    <p className="text-4xl font-bold text-gray-900 mt-1">{count}</p>
                )}
            </div>
        </div>
    );
};

export default PendingKpiCard;
