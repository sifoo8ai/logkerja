import type { ReferenceCheckResult } from './penyemakApi';

/**
 * Keputusan bagi satu nombor rujukan, mengikut state machine transition_document:
 * - NEW       : belum wujud → boleh daftar baharu
 * - RESUBMIT  : milik sendiri, REJECTED / ON_HOLD → boleh Hantar Semula (RESUBMIT)
 * - BLOCKED   : wujud tetapi tidak boleh dikemas kini oleh pengguna ini sekarang
 *
 * Pelayan kekal sebagai penguat kuasa — logik ini hanya memandu UI.
 */
export type ReferenceActionKind = 'NEW' | 'RESUBMIT' | 'BLOCKED';

export interface ReferenceAction {
    kind: ReferenceActionKind;
    message: string;
    docId: string | null;
    docStatus: string | null;
}

export const STATUS_LABELS: Record<string, string> = {
    PENDING_VERIFIER: 'Menunggu Pengesah',
    PENDING_APPROVER: 'Menunggu Pelulus',
    REJECTED: 'Ditolak',
    LULUS: 'Lulus',
    ON_HOLD: 'On Hold',
};

export function statusLabel(status: string | null | undefined): string {
    if (!status) return '-';
    return STATUS_LABELS[status] || status;
}

export function resolveReferenceAction(result: ReferenceCheckResult): ReferenceAction {
    const docStatus = result.current_status;

    if (!result.ref_exists) {
        return { kind: 'NEW', message: 'Nombor rujukan tersedia.', docId: null, docStatus: null };
    }

    if (!result.is_own) {
        return {
            kind: 'BLOCKED',
            message: `Nombor ini sudah didaftarkan oleh pengguna lain (status: ${statusLabel(docStatus)}). Hanya pendaftar asal boleh menghantar semula.`,
            docId: null,
            docStatus,
        };
    }

    switch (docStatus) {
        case 'REJECTED':
        case 'ON_HOLD':
            return {
                kind: 'RESUBMIT',
                message: `Dokumen anda berstatus ${statusLabel(docStatus)}. Anda boleh hantar semula untuk semakan baharu.`,
                docId: result.doc_id,
                docStatus,
            };
        case 'PENDING_VERIFIER':
        case 'PENDING_APPROVER': {
            const who = docStatus === 'PENDING_VERIFIER' ? 'Pengesah' : 'Pelulus';
            const name = result.pending_actor_name ? ` (${result.pending_actor_name})` : '';
            return {
                kind: 'BLOCKED',
                message: `Dokumen anda sedang menunggu ${who}${name}. Ia perlu ditolak dahulu sebelum boleh dihantar semula.`,
                docId: result.doc_id,
                docStatus,
            };
        }
        case 'LULUS':
            return {
                kind: 'BLOCKED',
                message: 'Dokumen anda sudah LULUS. Hanya Admin boleh menetapkan ON HOLD sebelum semakan baharu.',
                docId: result.doc_id,
                docStatus,
            };
        default:
            return {
                kind: 'BLOCKED',
                message: `Nombor ini sudah wujud (status: ${statusLabel(docStatus)}).`,
                docId: result.doc_id,
                docStatus,
            };
    }
}
