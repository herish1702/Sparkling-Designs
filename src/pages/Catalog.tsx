import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categories } from '../data/products';
import { getProducts } from '../utils/productsApi';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { openWhatsApp } from '../utils/whatsapp';

export default function Catalog() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const activeCategory = searchParams.get('category') || 'all';

    useEffect(() => {
        getProducts().then(data => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    const filteredProducts = useMemo(() => {
        let result = products;
        if (activeCategory !== 'all') {
            result = result.filter(p => p.category === activeCategory);
        }
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(term) ||
                p.code.toLowerCase().includes(term) ||
                p.description.toLowerCase().includes(term)
            );
        }
        return result;
    }, [products, activeCategory, searchTerm]);

    const setCategory = (cat: string) => {
        if (cat === 'all') {
            setSearchParams({});
        } else {
            setSearchParams({ category: cat });
        }
    };

    return (
        <div className="pt-20 min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold font-display text-gray-900 mb-4">
                        Our <span className="text-[#d4a853]">Collection</span>
                    </h1>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        Browse our curated selection of premium products. Click on any product to view details or order via WhatsApp.
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
                    {/* Search */}
                    <div className="relative w-full lg:w-80">
                        <input
                            type="text"
                            placeholder="Search products, codes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#d4a853] focus:ring-2 focus:ring-[#d4a853]/20 outline-none transition-all text-sm"
                        />
                        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap items-center gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${activeCategory === cat.id
                                        ? 'bg-[#d4a853] text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat.icon} {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4 animate-pulse">💎</div>
                        <p className="text-gray-500">Loading products...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500">Try a different search or category</p>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 mb-6">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </>
                )}

                {/* WhatsApp CTA */}
                <div className="mt-16 text-center bg-[#f9f6f0] rounded-2xl p-8 lg:p-12">
                    <h3 className="text-2xl font-bold font-display text-gray-900 mb-3">
                        Can't find what you're looking for?
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Contact us directly on WhatsApp and we'll help you find the perfect product.
                    </p>
                    <button
                        onClick={() => openWhatsApp('Product Inquiry', 'KS-QUERY')}
                        className="bg-[#25D366] hover:bg-[#1da851] text-white px-8 py-3.5 rounded-full text-sm font-semibold transition-all inline-flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        Ask on WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
}