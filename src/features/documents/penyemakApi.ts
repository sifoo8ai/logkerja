import { supabase } from '../../lib/supabaseClient';

export interface DocumentRow {
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

export async function submitNewDocument(refNo: string, categoryId: string, description: string) {
    const { data, error } = await supabase.functions.invoke('documents_create', {
        body: { ref_no: refNo, cat_id: categoryId, desc: description }
    });

    if (error) {
        let msg = error.message;
        if ((error as any).details) msg += `\nDetails: ${(error as any).details}`;
        if ((error as any).status) msg = `[HTTP ${(error as any).status}] ${msg}`;
        throw new Error(msg);
    }
    if (data?.error) {
        throw new Error(data.error);
    }

    return data.docId;
}

export async function resubmitDocument(docId: string, note?: string) {
    const { data, error } = await supabase.functions.invoke('documents_transition', {
        body: { doc_id: docId, action: 'RESUBMIT', note }
    });

    if (error || data?.error) {
        throw new Error(error?.message || data?.error || 'Failed to resubmit document');
    }

    return data;
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
