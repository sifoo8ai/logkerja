import { supabase } from '../../lib/supabaseClient';
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

export async function approveDocumentAsPelulus(docId: string, note?: string) {
    const { data, error } = await supabase.functions.invoke('documents_transition', {
        body: { doc_id: docId, action: 'APPROVE', note: note || 'Diluluskan oleh pelulus' }
    });

    if (error) {
        throw new Error(await extractErrorMsg(error) || 'Gagal meluluskan dokumen');
    }
    if (data?.error) {
        throw new Error(data.error);
    }

    return data;
}

export async function rejectDocumentAsPelulus(docId: string, note: string) {
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
