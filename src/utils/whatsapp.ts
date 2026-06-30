import { WHATSAPP_NUMBER } from './storage';

export function generateWhatsAppUrl(
    productName: string,
    productCode: string,
    color: string = '',
    size: string = '',
    imageUrl: string = ''
): string {
    let message = `Hi Sparkling Designs,\n\nI am interested in the following product:\n\n`;
    message += `Product Name: ${productName}\n`;
    message += `Product Code: ${productCode}\n`;
    if (color) message += `Colour: ${color}\n`;
    if (size) message += `Size: ${size}\n`;
    if (imageUrl) {
        // Image URLs from Supabase Storage are already absolute
        // (https://...supabase.co/...). Only prepend the site origin for
        // legacy relative paths (e.g. "/images/products_raw/...").
        const absoluteImageUrl = /^https?:\/\//i.test(imageUrl)
            ? imageUrl
            : `${window.location.origin}${imageUrl}`;
        message += `Product Image: ${absoluteImageUrl}\n`;
    }
    message += `\nPlease share pricing and ordering details.`;

    // Encode the ENTIRE message exactly once here. Encoding any individual
    // piece above (e.g. the image URL) before this point would cause
    // double-encoding once this final encodeURIComponent runs, corrupting
    // the link (e.g. "https://" becomes "https%3A%2F%2F" as literal text
    // instead of a working URL).
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(
    productName: string,
    productCode: string,
    color: string = '',
    size: string = '',
    imageUrl: string = ''
): void {
    const url = generateWhatsAppUrl(productName, productCode, color, size, imageUrl);
    window.open(url, '_blank');
}