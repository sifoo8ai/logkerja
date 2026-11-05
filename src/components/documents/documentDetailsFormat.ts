import { CheckCircle2, FileOutput, FileText, Pause, Sparkles, XCircle, LucideIcon } from 'lucide-react';

/**
 * Label paparan, ikon dan warna untuk modal butiran dokumen (UX-DETAILS-01).
 * Hanya untuk paparan — nilai enum dalam database tidak berubah.
 */

export interface StatusBanner {
    title: string;
    subtitle: string;
    /** kelas Tailwind untuk kotak banner */
    box: string;
    /** kelas Tailwind untuk titik penunjuk */
    dot: string;
}

// Warna ikut skema status sistem (DocumentTable.tsx / StatusBadge.tsx)
const STATUS_BANNERS: Record<string, StatusBanner> = {
    PENDING_VERIFIER: {
        title: 'Menunggu pengesahan',
        subtitle: 'Tindakan pengesah diperlukan',
        box: 'bg-yellow-50 border-yellow-200 text-yellow-900',
        dot: 'bg-yellow-400',
    },
    PENDING_APPROVER: {
        title: 'Menunggu kelulusan',
        subtitle: 'Tindakan pelulus diperlukan',
        box: 'bg-orange-50 border-orange-200 text-orange-900',
        dot: 'bg-orange-400',
    },
    REJECTED: {
        title: 'Ditolak',
        subtitle: 'Sila semak nota dan hantar semula',
        box: 'bg-red-50 border-red-200 text-red-900',
        dot: 'bg-red-500',
    },
    LULUS: {
        title: 'Lulus',
        subtitle: 'Dokumen telah diluluskan',
        box: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        dot: 'bg-emerald-500',
    },
    ON_HOLD: {
        title: 'Ditangguhkan',
        subtitle: 'Ditahan oleh Admin — boleh dihantar semula',
        box: 'bg-slate-100 border-slate-200 text-slate-800',
        dot: 'bg-slate-500',
    },
};

export function statusBanner(status: string): StatusBanner {
    return STATUS_BANNERS[status] || {
        title: status,
        subtitle: '',
        box: 'bg-slate-50 border-slate-200 text-slate-800',
        dot: 'bg-slate-400',
    };
}

export interface ActionStyle {
    label: string;
    icon: LucideIcon;
    /** kelas Tailwind untuk bulatan ikon */
    iconBox: string;
}

const ACTION_STYLES: Record<string, ActionStyle> = {
    CREATE: { label: 'Dokumen dicipta', icon: FileText, iconBox: 'bg-slate-100 text-slate-600' },
    APPROVE_VERIFIER: { label: 'Disahkan', icon: CheckCircle2, iconBox: 'bg-emerald-50 text-emerald-600' },
    APPROVE_APPROVER: { label: 'Diluluskan', icon: CheckCircle2, iconBox: 'bg-emerald-50 text-emerald-600' },
    AUTO_FINALIZE: { label: 'Dimuktamadkan automatik', icon: Sparkles, iconBox: 'bg-emerald-50 text-emerald-600' },
    REJECT_VERIFIER: { label: 'Ditolak oleh pengesah', icon: XCircle, iconBox: 'bg-red-50 text-red-600' },
    REJECT_APPROVER: { label: 'Ditolak oleh pelulus', icon: XCircle, iconBox: 'bg-red-50 text-red-600' },
    RESUBMIT: { label: 'Dihantar semula', icon: FileOutput, iconBox: 'bg-blue-50 text-blue-600' },
    SET_ON_HOLD: { label: 'Ditangguhkan', icon: Pause, iconBox: 'bg-amber-50 text-amber-600' },
};

export function actionStyle(action: string): ActionStyle {
    return ACTION_STYLES[action] || { label: action, icon: FileText, iconBox: 'bg-slate-100 text-slate-600' };
}

const BULAN = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];

/** Format tarikh sebagai "05 Nov 2026" (bulan pendek Bahasa Melayu). */
export function formatTarikh(value: string | null | undefined): string {
    if (!value) return '-';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '-';
    return `${String(d.getDate()).padStart(2, '0')} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

/** "MOHD NOR RIZAL BIN SULAIMAN / MEDIC" → { name: 'MOHD NOR RIZAL BIN SULAIMAN', unit: 'MEDIC' } */
export function splitActorName(fullName: string | null | undefined): { name: string; unit: string | null } {
    const raw = (fullName || '').trim();
    if (!raw) return { name: 'Sistem', unit: null };
    const idx = raw.lastIndexOf(' / ');
    if (idx === -1) return { name: raw, unit: null };
    return { name: raw.slice(0, idx).trim(), unit: raw.slice(idx + 3).trim() || null };
}

/** Inisial untuk avatar, contoh "KHAIRUL ANUAR BIN ..." → "KA". */
export function initials(fullName: string | null | undefined): string {
    const { name } = splitActorName(fullName);
    const skip = new Set(['BIN', 'BINTI', 'BT', 'B', 'A/L', 'A/P']);
    const words = name.split(/\s+/).filter(w => w && !skip.has(w.toUpperCase()));
    const letters = words.slice(0, 2).map(w => w[0]).join('');
    return (letters || '?').toUpperCase();
}
