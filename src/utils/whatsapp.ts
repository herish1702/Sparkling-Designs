import { WHATSAPP_NUMBER } from './storage';

export function generateWhatsAppUrl(
    productName: string,
    productCode: string,
    color: string = '',
    size: string = '',
    imageUrl: string = ''
): string {
    let message = `Hi Sparkling Designs,%0A%0AI am interested in the following product:%0A%0A`;
    message += `Product Name: ${productName}%0A`;
    message += `Product Code: ${productCode}%0A`;
    if (color) message += `Colour: ${color}%0A`;
    if (size) message += `Size: ${size}%0A`;
    if (imageUrl) {
        // Image URLs from Supabase Storage are already absolute
        // (https://...supabase.co/...). Only prepend the site origin for
        // legacy relative paths (e.g. "/images/products_raw/...").
        const absoluteImageUrl = /^https?:\/\//i.test(imageUrl)
            ? imageUrl
            : `${window.location.origin}${imageUrl}`;
        message += `Product Image: ${encodeURIComponent(absoluteImageUrl)}%0A`;
    }
    message += `%0APlease share pricing and ordering details.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
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