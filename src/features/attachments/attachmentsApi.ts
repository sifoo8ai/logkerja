import { supabase } from '../../lib/supabaseClient';

export async function uploadDocumentAttachment(documentId: string, file: File) {
    // 1. Get initial upload metadata
    const { data: initData, error: initError } = await supabase.functions.invoke('attachments_upload_init', {
        body: { document_id: documentId, filename: file.name },
    });

    if (initError || !initData?.filePath) {
        throw new Error(initError?.message || 'Failed to initialize upload');
    }

    const { filePath } = initData;

    // 2. Upload to storage directly (RLS allows authenticated to insert with proper bucket)
    const { error: uploadError } = await supabase.storage
        .from('document-attachments')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
        throw new Error(uploadError.message || 'Failed to upload to storage');
    }

    // 3. Register metadata in the database via Edge Function
    const { error: registerError } = await supabase.functions.invoke('attachments_register', {
        body: {
            document_id: documentId,
            file_path: filePath,
            file_name: file.name,
            content_type: file.type,
            size_bytes: file.size,
        },
    });

    if (registerError) {
        throw new Error(registerError.message || 'Failed to register attachment metadata');
    }

    return true;
}

export async function getSignedViewUrl(attachmentId: string): Promise<string> {
    const { data, error } = await supabase.functions.invoke('attachments_signed_url', {
        body: { attachment_id: attachmentId },
    });

    if (error || !data?.signedUrl) {
        throw new Error(error?.message || 'Failed to get signed URL');
    }

    return data.signedUrl;
}
