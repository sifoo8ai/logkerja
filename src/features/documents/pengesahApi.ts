import { supabase } from '../../lib/supabaseClient';

export interface DocumentRowExtended {
    id: string;
    reference_no: string;
    current_status: string;
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
            id, reference_no, current_status, created_at, updated_at, description,
            category:document_categories(id, name),
            creator:profiles!documents_creator_id_fkey(full_name)
        `)
        .eq('verifier_id', userId)
        .eq('current_status', 'PENDING_VERIFIER')
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data as any;
}

export async function fetchPengesahHistory(userId: string) {
    const { data, error } = await supabase
        .from('document_actions')
        .select(`
            id, action, created_at, note,
            document:documents(id, reference_no, current_status, category:document_categories(name))
        `)
        .eq('actor_id', userId)
        .in('action', ['APPROVE', 'REJECT'])
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
