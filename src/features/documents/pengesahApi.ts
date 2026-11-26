import { supabase } from '../../lib/supabaseClient';
import { invokeEdge } from '../../lib/edgeError';

export interface DocumentRowExtended {
    id: string;
    reference_no: string;
    current_status: string;
    created_at: string;
    updated_at: string;
    description: string | null;
    creator_id: string;
    category: {
        id: string;
        name: string;
    } | null;
    creator?: {
        full_name: string;
    } | null;
}

export async function fetchAssignedDocuments(userId: string): Promise<DocumentRowExtended[]> {
    const { data, error } = await supabase
        .from('documents')
        .select(`
            id, reference_no, current_status, created_at, updated_at, description, verifier_id, approver_id, creator_id,
            category:document_categories(id, name),
            creator:profiles!documents_creator_id_fkey(full_name)
        `)
        .eq('verifier_id', userId)
        .eq('current_status', 'PENDING_VERIFIER')
        .order('updated_at', { ascending: false });

    if (error) throw error;
    return data as any;
}

export async function fetchPengesahPendingCount(userId: string): Promise<number> {
    const { count, error } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('verifier_id', userId)
        .eq('current_status', 'PENDING_VERIFIER');

    if (error) throw error;
    return count || 0;
}

export async function fetchPengesahHistory(userId: string) {
    const { data, error } = await supabase
        .from('document_actions')
        .select(`
            id, action, created_at, note,
            document:documents(id, reference_no, current_status, category:document_categories(name))
        `)
        .eq('actor_id', userId)
        .in('action', ['APPROVE_VERIFIER', 'REJECT_VERIFIER'])
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function approveDocument(docId: string, note?: string) {
    return invokeEdge('documents_transition',
        { doc_id: docId, action: 'APPROVE', note: note || 'Disahkan oleh pengesah' },
        'Gagal menyahkan dokumen');
}

export async function rejectDocument(docId: string, note: string) {
    return invokeEdge('documents_transition',
        { doc_id: docId, action: 'REJECT', note },
        'Gagal menolak dokumen');
}
