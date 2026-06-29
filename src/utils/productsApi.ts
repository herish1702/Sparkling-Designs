import { supabase } from './supabaseClient';
import { Product } from '../types';

// ---- Mapping helpers: DB rows use snake_case, app uses camelCase ----

interface ProductRow {
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
    new_arrival: boolean;
    best_seller: boolean;
    newly_added: boolean;
    customization_available: boolean;
    rating: number;
    created_at: string;
}

function rowToProduct(row: ProductRow): Product {
    return {
        id: row.id,
        name: row.name,
        code: row.code,
        category: row.category,
        description: row.description,
        material: row.material,
        colors: row.colors || [],
        sizes: row.sizes || [],
        images: row.images || [],
        price: row.price,
        featured: row.featured,
        newArrival: row.new_arrival,
        bestSeller: row.best_seller,
        newlyAdded: row.newly_added,
        customizationAvailable: row.customization_available,
        rating: row.rating,
        createdAt: row.created_at,
    };
}

function productToRow(product: Partial<Product>): Partial<ProductRow> {
    const row: Partial<ProductRow> = {};
    if (product.id !== undefined) row.id = product.id;
    if (product.name !== undefined) row.name = product.name;
    if (product.code !== undefined) row.code = product.code;
    if (product.category !== undefined) row.category = product.category;
    if (product.description !== undefined) row.description = product.description;
    if (product.material !== undefined) row.material = product.material;
    if (product.colors !== undefined) row.colors = product.colors;
    if (product.sizes !== undefined) row.sizes = product.sizes;
    if (product.images !== undefined) row.images = product.images;
    if (product.price !== undefined) row.price = product.price;
    if (product.featured !== undefined) row.featured = product.featured;
    if (product.newArrival !== undefined) row.new_arrival = product.newArrival;
    if (product.bestSeller !== undefined) row.best_seller = product.bestSeller;
    if (product.newlyAdded !== undefined) row.newly_added = product.newlyAdded;
    if (product.customizationAvailable !== undefined) row.customization_available = product.customizationAvailable;
    if (product.rating !== undefined) row.rating = product.rating;
    if (product.createdAt !== undefined) row.created_at = product.createdAt;
    return row;
}

// ---- Public API (async, backed by Supabase) ----

export async function getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error('Error fetching products:', error.message);
        return [];
    }
    return (data as ProductRow[]).map(rowToProduct);
}

export async function getProductById(id: number): Promise<Product | undefined> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        console.error('Error fetching product:', error.message);
        return undefined;
    }
    return data ? rowToProduct(data as ProductRow) : undefined;
}

export async function updateProduct(updated: Product): Promise<boolean> {
    const { error } = await supabase
        .from('products')
        .update(productToRow(updated))
        .eq('id', updated.id);

    if (error) {
        console.error('Error updating product:', error.message);
        return false;
    }
    return true;
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .insert(productToRow(product))
        .select()
        .single();

    if (error) {
        console.error('Error adding product:', error.message);
        return null;
    }
    return data ? rowToProduct(data as ProductRow) : null;
}

export async function deleteProduct(id: number): Promise<boolean> {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
        console.error('Error deleting product:', error.message);
        return false;
    }
    return true;
}

export async function generateProductCode(category: string): Promise<string> {
    const prefix = category.split('-').map((w: string) => w[0].toUpperCase()).join('');
    const { data, error } = await supabase
        .from('products')
        .select('code')
        .like('code', `KS-${prefix}%`);

    if (error) {
        console.error('Error generating product code:', error.message);
        return `KS-${prefix}-001`;
    }
    return `KS-${prefix}-${String((data?.length || 0) + 1).padStart(3, '0')}`;
}
