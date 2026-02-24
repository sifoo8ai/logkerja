import { supabase } from '../../lib/supabaseClient';

export interface DocumentRowExtended {
    id: string;
    reference_no: string;
    status: string;
    created_at: string;
    updated_at: string;
    description: string | null;
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
            id, reference_no, status, created_at, updated_at, description, verifier_id, approver_id,
            category:document_categories(id, name),
            creator:profiles!creator_id(full_name)
        `)
        .eq('verifier_id', userId)
        .eq('status', 'PENDING_VERIFIER')
        .order('updated_at', { ascending: false });

    if (error) throw error;
    return data as any;
}

export async function fetchPengesahHistory(userId: string) {
    const { data, error } = await supabase
        .from('document_actions')
        .select(`
            id, action_type, created_at, note,
            document:documents(id, reference_no, status, category:document_categories(name))
        `)
        .eq('actor_user_id', userId)
        .in('action_type', ['APPROVE_VERIFIER', 'REJECT_VERIFIER'])
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function approveDocument(docId: string, note?: string) {
    const { data, error } = await supabase.functions.invoke('documents_transition', {
        body: { doc_id: docId, action: 'APPROVE', note: note || 'Disahkan oleh pengesah' }
    });

    if (error || data?.error) {
        throw new Error(error?.message || data?.error || 'Failed to approve document');
    }

    return data;
}

export async function rejectDocument(docId: string, note: string) {
    const { data, error } = await supabase.functions.invoke('documents_transition', {
        body: { doc_id: docId, action: 'REJECT', note }
    });

    if (error || data?.error) {
        throw new Error(error?.message || data?.error || 'Failed to reject document');
    }

    return data;
}
