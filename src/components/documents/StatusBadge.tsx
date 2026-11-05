import React from 'react';
import { statusLabel } from '../../features/documents/referenceCheck';

const statusColors: Record<string, string> = {
    PENDING_VERIFIER: 'bg-yellow-100 text-yellow-800',
    PENDING_APPROVER: 'bg-orange-100 text-orange-800',
    REJECTED: 'bg-red-100 text-red-800',
    LULUS: 'bg-emerald-100 text-emerald-800',
    ON_HOLD: 'bg-slate-100 text-slate-800',
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${statusColors[status] || 'bg-slate-100 text-slate-700'}`}>
        {statusLabel(status)}
    </span>
);

export default StatusBadge;
