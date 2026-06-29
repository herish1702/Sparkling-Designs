import { supabase, PRODUCT_IMAGES_BUCKET } from './supabaseClient';

function sanitizeFileName(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9.]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

/**
 * Uploads an image file to Supabase Storage and returns its public URL.
 * Throws an error if the upload fails (caller should catch and show a message).
 */
export async function uploadProductImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop() || 'jpg';
    const baseName = sanitizeFileName(file.name.replace(/\.[^.]+$/, ''));
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${baseName}.${ext}`;
    const path = `products/${uniqueName}`;

    const { error: uploadError } = await supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
    return data.publicUrl;
}

/** Uploads multiple files, returning their public URLs in the same order. */
export async function uploadProductImages(files: File[]): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
        const url = await uploadProductImage(file);
        urls.push(url);
    }
    return urls;
}
