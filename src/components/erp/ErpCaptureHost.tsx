import React, { useEffect, useRef, useState } from 'react';
import { getActiveRole } from '../../lib/auth';
import { SubmissionModal, SubmissionResult } from '../documents/SubmissionModal';

/**
 * Penerima tangkapan ERP (ERP-CAPTURE-01).
 *
 * Extension LogKerja (side panel) membungkus PWA dalam iframe. Content script di erp.upm.edu.my
 * menangkap Ref. Nbr + Creator, kemudian side panel menghantar mesej ini ke iframe:
 *   { type: 'LOGKERJA_ERP_CAPTURE', refNo, creatorName }
 * PWA membalas ke parent:
 *   { type: 'LOGKERJA_READY' }  — sekali selepas dimuat, supaya side panel boleh hantar tangkapan tertangguh
 *   { type: 'LOGKERJA_ERP_RESULT', refNo, status, docStatus?, message? }
 *
 * Mesej hanya diterima jika PWA berada dalam iframe, datang dari window parent sendiri, dan
 * origin ialah halaman extension Chrome.
 */

const REF_PATTERN = /^[A-Za-z0-9]{6,20}$/;
const MAX_CREATOR_LEN = 120;

type ResultStatus = SubmissionResult['status'] | 'WRONG_ROLE';

interface Capture {
    refNo: string;
    creatorName: string;
    origin: string;
    nonce: number;
}

export const ErpCaptureHost: React.FC = () => {
    const [capture, setCapture] = useState<Capture | null>(null);
    const nonceRef = useRef(0);

    const inIframe = typeof window !== 'undefined' && window.self !== window.top;

    const postToParent = (message: Record<string, unknown>, origin: string) => {
        try {
            window.parent.postMessage(message, origin);
        } catch (err) {
            console.error('[ErpCaptureHost] Gagal menghantar mesej ke parent:', err);
        }
    };

    useEffect(() => {
        if (!inIframe) return;

        // Beritahu side panel PWA sudah sedia menerima tangkapan (tiada data sensitif)
        window.parent.postMessage({ type: 'LOGKERJA_READY' }, '*');

        const handler = (event: MessageEvent) => {
            if (event.source !== window.parent) return;
            if (typeof event.origin !== 'string' || !event.origin.startsWith('chrome-extension://')) return;

            const data = event.data;
            if (!data || data.type !== 'LOGKERJA_ERP_CAPTURE') return;

            const refNo = typeof data.refNo === 'string' ? data.refNo.trim() : '';
            const creatorName = typeof data.creatorName === 'string' ? data.creatorName.trim().slice(0, MAX_CREATOR_LEN) : '';

            if (!REF_PATTERN.test(refNo)) {
                postToParent({ type: 'LOGKERJA_ERP_RESULT', refNo, status: 'ERROR', message: 'Format nombor rujukan tidak sah.' }, event.origin);
                return;
            }

            if (getActiveRole() !== 'PENYEMAK') {
                postToParent({
                    type: 'LOGKERJA_ERP_RESULT',
                    refNo,
                    status: 'WRONG_ROLE' as ResultStatus,
                    message: 'Buka LogKerja sebagai PENYEMAK untuk mendaftar dokumen.',
                }, event.origin);
                return;
            }

            nonceRef.current += 1;
            setCapture({ refNo, creatorName, origin: event.origin, nonce: nonceRef.current });
        };

        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, [inIframe]);

    if (!capture) return null;

    const handleResult = (result: SubmissionResult) => {
        postToParent({
            type: 'LOGKERJA_ERP_RESULT',
            refNo: result.refNo || capture.refNo,
            status: result.status,
            docStatus: result.docStatus ?? null,
            message: result.message ?? null,
        }, capture.origin);
    };

    return (
        <SubmissionModal
            key={capture.nonce}
            isOpen={true}
            source="erp"
            initialRefNo={capture.refNo}
            initialDescription={capture.creatorName}
            onClose={() => setCapture(null)}
            onSuccess={() => { /* senarai dikemas kini melalui realtime */ }}
            onResult={handleResult}
        />
    );
};

export default ErpCaptureHost;
