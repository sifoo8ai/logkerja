import { supabase } from '../../lib/supabaseClient';

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

async function extractErrorMsg(error: any) {
    if (!error) return null;
    console.error('documents_transition error', error);
    try {
        if (error.context && typeof error.context.json === 'function') {
            const body = await error.context.json();
            if (body && body.error) return body.error;
        }
    } catch (e) {
        // ignore JSON parse error
    }
    return error.message || 'Ralat tidak diketahui';
}

export async function approveDocument(docId: string, note?: string) {
    const { data, error } = await supabase.functions.invoke('documents_transition', {
        body: { doc_id: docId, action: 'APPROVE', note: note || 'Disahkan oleh pengesah' }
    });

    if (error) {
        throw new Error(await extractErrorMsg(error) || 'Gagal menyahkan dokumen');
    }
    if (data?.error) {
        throw new Error(data.error);
    }

    return data;
}

export async function rejectDocument(docId: string, note: string) {
    const { data, error } = await supabase.functions.invoke('documents_transition', {
        body: { doc_id: docId, action: 'REJECT', note }
    });

    if (error) {
        throw new Error(await extractErrorMsg(error) || 'Gagal menolak dokumen');
    }
    if (data?.error) {
        throw new Error(data.error);
    }

    return data;
}
