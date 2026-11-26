import { supabase } from '../../lib/supabaseClient';
import { invokeEdge } from '../../lib/edgeError';

export async function uploadDocumentAttachment(documentId: string, file: File) {
    // 1. Get initial upload metadata
    const initData = await invokeEdge('attachments_upload_init',
        { document_id: documentId, filename: file.name },
        'Gagal memulakan muat naik lampiran.');
    if (!initData?.filePath) {
        throw new Error('Gagal memulakan muat naik lampiran.');
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
    await invokeEdge('attachments_register', {
        document_id: documentId,
        file_path: filePath,
        file_name: file.name,
        content_type: file.type,
        size_bytes: file.size,
    }, 'Gagal mendaftar maklumat lampiran.');

    return true;
}

export async function getSignedViewUrl(attachmentId: string): Promise<string> {
    const data = await invokeEdge('attachments_signed_url',
        { attachment_id: attachmentId },
        'Gagal mendapatkan pautan lampiran.');
    if (!data?.signedUrl) {
        throw new Error('Gagal mendapatkan pautan lampiran.');
    }

    return data.signedUrl;
}
