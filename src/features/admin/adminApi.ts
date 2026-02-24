import { supabase } from '../../lib/supabaseClient';

export async function fetchAllDocuments() {
    const { data, error } = await supabase
        .from('documents')
        .select(`
            id, reference_no, current_status, created_at, updated_at, description,
            category:document_categories(id, name),
            creator:profiles!documents_creator_id_fkey(full_name),
            verifier:profiles!documents_verifier_id_fkey(full_name),
            approver:profiles!documents_approver_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function setDocumentOnHold(docId: string, note: string) {
    const { data, error } = await supabase.functions.invoke('documents_transition', {
        body: { doc_id: docId, action: 'SET_ON_HOLD', note }
    });

    if (error || data?.error) {
        throw new Error(error?.message || data?.error || 'Failed to set document ON_HOLD');
    }

    return data;
}

export async function updateDocumentCategory(docId: string, categoryId: string) {
    // Only allowed for REJECTED or ON_HOLD
    // But backend function doesn't exist for this, so we update direct? 
    // The requirement says: Change category_id, update documents.category_id, DO NOT manually update routing (it resets on RESUBMIT).
    const { data, error } = await supabase
        .from('documents')
        .update({ category_id: categoryId })
        .eq('id', docId)
        .in('current_status', ['REJECTED', 'ON_HOLD']);

    if (error) throw error;
    return data;
}

export async function deleteDocument(docId: string) {
    // Hard delete - foreign keys have cascade on document_actions and document_attachments
    const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId);

    if (error) throw error;
    return true;
}

export async function fetchAllUsers() {
    const { data, error } = await supabase
        .from('profiles')
        .select(`
            id, full_name, is_active,
            user_roles ( role )
        `)
        .order('full_name', { ascending: true });

    if (error) throw error;
    return data;
}

export async function updateUserActiveStatus(userId: string, isActive: boolean) {
    const { error } = await supabase
        .from('profiles')
        .update({ is_active: isActive })
        .eq('id', userId);

    if (error) throw error;
    return true;
}

export async function addUserRole(userId: string, role: string) {
    const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

    if (error) throw error;
    return true;
}

export async function removeUserRole(userId: string, role: string) {
    const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

    if (error) throw error;
    return true;
}

export async function fetchAllCategories() {
    const { data, error } = await supabase
        .from('document_categories')
        .select(`
            id, name, is_active, description,
            routing:category_routing(
                default_verifier_id, 
                default_approver_id,
                verifier:profiles!category_routing_default_verifier_id_fkey(full_name),
                approver:profiles!category_routing_default_approver_id_fkey(full_name)
            )
        `)
        .order('name', { ascending: true });

    if (error) throw error;
    return data;
}

export async function createCategory(name: string, desc: string, verifierId: string, approverId: string) {
    const { data: catData, error: catError } = await supabase
        .from('document_categories')
        .insert({ name, description: desc })
        .select()
        .single();

    if (catError) throw catError;

    const { error: routeError } = await supabase
        .from('category_routing')
        .insert({
            category_id: catData.id,
            default_verifier_id: verifierId,
            default_approver_id: approverId
        });

    if (routeError) throw routeError;
    return true;
}

export async function updateCategory(id: string, name: string, desc: string, isActive: boolean, verifierId: string, approverId: string) {
    const { error: catError } = await supabase
        .from('document_categories')
        .update({ name, description: desc, is_active: isActive })
        .eq('id', id);

    if (catError) throw catError;

    const { error: routeError } = await supabase
        .from('category_routing')
        .update({
            default_verifier_id: verifierId,
            default_approver_id: approverId
        })
        .eq('category_id', id);

    if (routeError) throw routeError;
    return true;
}
