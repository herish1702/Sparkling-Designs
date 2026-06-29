// NOTE: Product catalog data now lives in Supabase (see src/utils/productsApi.ts).
// This file only keeps static reference data: category list, and shared constants.

export const categories = [
    { id: 'all', label: 'All Products', icon: '📦' },
    { id: 'hair-bands', label: '3D Kundan Hair Bands', icon: '🎀' },
    { id: 'hair-clips', label: 'Alligator Clips', icon: '📎' },
    { id: 'bangles', label: 'Bangles', icon: '🔗' },
    { id: 'bracelets', label: 'Bracelets', icon: '📿' },
    { id: 'center-clips', label: 'Center Clips', icon: '💎' },
    { id: 'earrings', label: 'Ear Rings', icon: '💍' },
    { id: 'necklace-chains', label: 'Invisible Chains', icon: '📿' },
    { id: 'saree-pins', label: 'Saree Pins', icon: '📍' },
    { id: 'combos', label: 'Combo', icon: '🎁' },
] as const;

export const WHATSAPP_NUMBER = '919384050366';
export const INSTAGRAM_URL = 'https://www.instagram.com/sparkling_designs_2026/';