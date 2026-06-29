export interface Product {
    id: number;
    name: string;
    code: string;
    category: string;
    description: string;
    material: string;
    colors: string[];
    sizes: string[];
    images: string[];
    price: string;
    featured: boolean;
    newArrival: boolean;
    bestSeller: boolean;
    newlyAdded: boolean;
    customizationAvailable: boolean;
    rating: number;
    createdAt: string;
}

export interface ProductFormData {
    name: string;
    code: string;
    category: string;
    description: string;
    material: string;
    colors: string[];
    sizes: string[];
    images: string[];
    price: string;
    featured: boolean;
    bestSeller: boolean;
    newArrival: boolean;
    customizationAvailable: boolean;
}

export interface WhatsAppMessage {
    productName: string;
    productCode: string;
    color: string;
    size: string;
}

export interface AdminState {
    isLoggedIn: boolean;
    username: string;
}