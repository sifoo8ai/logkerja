import { supabase } from '../../lib/supabaseClient';
import { assertEdgeOk } from '../../lib/edgeError';

export async function uploadDocumentAttachment(documentId: string, file: File) {
    // 1. Get initial upload metadata
    const { data: initData, error: initError } = await supabase.functions.invoke('attachments_upload_init', {
        body: { document_id: documentId, filename: file.name },
    });

    await assertEdgeOk(initError, initData, 'Gagal memulakan muat naik lampiran.');
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
    const { data: registerData, error: registerError } = await supabase.functions.invoke('attachments_register', {
        body: {
            document_id: documentId,
            file_path: filePath,
            file_name: file.name,
            content_type: file.type,
            size_bytes: file.size,
        },
    });

    await assertEdgeOk(registerError, registerData, 'Gagal mendaftar maklumat lampiran.');

    return true;
}

export async function getSignedViewUrl(attachmentId: string): Promise<string> {
    const { data, error } = await supabase.functions.invoke('attachments_signed_url', {
        body: { attachment_id: attachmentId },
    });

    await assertEdgeOk(error, data, 'Gagal mendapatkan pautan lampiran.');
    if (!data?.signedUrl) {
        throw new Error('Gagal mendapatkan pautan lampiran.');
    }

    return data.signedUrl;
}
