import { supabase } from '../../lib/supabaseClient';
import { assertEdgeOk } from '../../lib/edgeError';

export interface DocumentRow {
    id: string;
    reference_no: string;
    current_status: string;
    created_at: string;
    updated_at: string;
    description: string | null;
    verifier_id?: string;
    approver_id?: string;
    category: {
        id: string;
        name: string;
    } | null;
    verifier?: { full_name: string } | null;
    approver?: { full_name: string } | null;
}

export async function fetchPenyemakKPIs(userId: string) {
    const { data, error } = await supabase
        .from('documents')
        .select('current_status')
        .eq('creator_id', userId);

    if (error) throw error;

    let inProcess = 0;
    let rejected = 0;
    let lulus = 0;
    const total = data.length;

    data.forEach(doc => {
        if (doc.current_status === 'PENDING_VERIFIER' || doc.current_status === 'PENDING_APPROVER') {
            inProcess++;
        } else if (doc.current_status === 'REJECTED') {
            rejected++;
        } else if (doc.current_status === 'LULUS') {
            lulus++;
        }
    });

    return { inProcess, rejected, lulus, total };
}

export async function fetchActiveCategories() {
    const { data, error } = await supabase
        .from('document_categories')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

    if (error) throw error;
    return data;
}

export async function fetchPenyemakDocuments(userId: string): Promise<DocumentRow[]> {
    const { data, error } = await supabase
        .from('documents')
        .select('id, reference_no, current_status, created_at, updated_at, description, verifier_id, approver_id, category:document_categories(id, name), verifier:profiles!documents_verifier_id_fkey(full_name), approver:profiles!documents_approver_id_fkey(full_name)')
        .eq('creator_id', userId)
        .order('updated_at', { ascending: false });

    if (error) throw error;
    return (data as any) || [];
}

export async function submitNewDocument(refNo: string, categoryId: string, description: string) {
    const { data, error } = await supabase.functions.invoke('documents_create', {
        body: { ref_no: refNo.trim(), cat_id: categoryId, desc: description }
    });

    await assertEdgeOk(error, data, 'Gagal mendaftar dokumen.');
    return data.docId as string;
}

export async function resubmitDocument(docId: string, note?: string) {
    const { data, error } = await supabase.functions.invoke('documents_transition', {
        body: { doc_id: docId, action: 'RESUBMIT', note }
    });

    await assertEdgeOk(error, data, 'Gagal menghantar semula dokumen.');
    return data;
}

export interface ReferenceCheckResult {
    ref_exists: boolean;
    is_own: boolean;
    doc_id: string | null;
    current_status: string | null;
    pending_actor_name: string | null;
    updated_at: string | null;
}

/** Semak sama ada nombor rujukan sudah wujud (merentasi semua pengguna) melalui RPC SECURITY DEFINER. */
export async function checkReferenceExists(refNo: string): Promise<ReferenceCheckResult> {
    const { data, error } = await supabase.rpc('check_reference_exists', { p_ref_no: refNo.trim() });
    if (error) throw new Error(error.message || 'Gagal menyemak nombor rujukan.');

    const row = Array.isArray(data) ? data[0] : data;
    return {
        ref_exists: !!row?.ref_exists,
        is_own: !!row?.is_own,
        doc_id: row?.doc_id ?? null,
        current_status: row?.current_status ?? null,
        pending_actor_name: row?.pending_actor_name ?? null,
        updated_at: row?.updated_at ?? null,
    };
}

export async function fetchDocumentActions(docId: string) {
    const { data, error } = await supabase
        .from('document_actions')
        .select(`
            id, action, note, created_at,
            actor:profiles(full_name)
        `)
        .eq('document_id', docId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function fetchDocumentAttachments(docId: string) {
    const { data, error } = await supabase
        .from('document_attachments')
        .select('id, file_name, size_bytes')
        .eq('document_id', docId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}
