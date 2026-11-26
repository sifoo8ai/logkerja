import { supabase } from '../../lib/supabaseClient';
import { invokeEdge } from '../../lib/edgeError';
import { DocumentRowExtended } from './pengesahApi'; // reuse type

export async function fetchPelulusDocuments(userId: string): Promise<DocumentRowExtended[]> {
    const { data, error } = await supabase
        .from('documents')
        .select(`
            id, reference_no, current_status, created_at, updated_at, description, creator_id,
            category:document_categories(id, name),
            creator:profiles!documents_creator_id_fkey(full_name)
        `)
        .eq('approver_id', userId)
        .eq('current_status', 'PENDING_APPROVER')
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data as any;
}

export async function fetchPelulusPendingCount(userId: string): Promise<number> {
    const { count, error } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('approver_id', userId)
        .eq('current_status', 'PENDING_APPROVER');

    if (error) throw error;
    return count || 0;
}

export async function fetchPelulusHistory(userId: string) {
    const { data, error } = await supabase
        .from('document_actions')
        .select(`
            id, action, created_at, note,
            document:documents(id, reference_no, current_status, category:document_categories(name))
        `)
        .eq('actor_id', userId)
        .in('action', ['APPROVE_APPROVER', 'REJECT_APPROVER'])
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function approveDocumentAsPelulus(docId: string, note?: string) {
    return invokeEdge('documents_transition',
        { doc_id: docId, action: 'APPROVE', note: note || 'Diluluskan oleh pelulus' },
        'Gagal meluluskan dokumen');
}

export async function rejectDocumentAsPelulus(docId: string, note: string) {
    return invokeEdge('documents_transition',
        { doc_id: docId, action: 'REJECT', note },
        'Gagal menolak dokumen');
}
