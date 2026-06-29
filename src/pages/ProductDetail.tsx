import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../utils/productsApi';
import { Product } from '../types';
import { openWhatsApp } from '../utils/whatsapp';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null | undefined>(undefined);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    useEffect(() => {
        setProduct(undefined);
        setSelectedImage(0);
        getProductById(Number(id)).then(p => setProduct(p ?? null));
    }, [id]);

    if (product === undefined) {
        return (
            <div className="pt-20 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl mb-4 animate-pulse">💎</div>
                    <p className="text-gray-500">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-20 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                    <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
                    <Link to="/catalog" className="bg-[#d4a853] text-white px-6 py-3 rounded-full text-sm font-semibold">
                        Back to Catalog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <Link to="/" className="hover:text-[#d4a853]">Home</Link>
                    <span>/</span>
                    <Link to="/catalog" className="hover:text-[#d4a853]">Catalog</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Images */}
                    <div>
                        <div className="aspect-[4/5] bg-gradient-to-br from-[#f5f0e8] to-[#e8dcc8] rounded-2xl overflow-hidden mb-4">
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="flex gap-3">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-[#d4a853]' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-semibold text-[#d4a853] uppercase tracking-wider bg-[#d4a853]/10 px-3 py-1 rounded-full">
                                {product.category}
                            </span>
                            {product.newArrival && (
                                <span className="text-xs font-semibold text-white uppercase bg-[#d4a853] px-3 py-1 rounded-full">New</span>
                            )}
                            {product.bestSeller && (
                                <span className="text-xs font-semibold text-white uppercase bg-[#e94560] px-3 py-1 rounded-full">Best Seller</span>
                            )}
                        </div>

                        <h1 className="text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-2">{product.name}</h1>
                        <p className="text-sm text-gray-500 font-mono mb-4">Product Code: {product.code}</p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex text-[#d4a853]">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-[#d4a853]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">{product.rating} / 5.0</span>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

                        {/* Material */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Material</h4>
                            <p className="text-sm text-gray-600">{product.material}</p>
                        </div>

                        {/* Colors */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">Available Colors</h4>
                            <div className="flex flex-wrap gap-2">
                                {product.colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all ${selectedColor === color
                                                ? 'border-[#d4a853] bg-[#d4a853]/10 text-[#d4a853]'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="mb-8">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">Available Sizes</h4>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all ${selectedSize === size
                                                ? 'border-[#d4a853] bg-[#d4a853]/10 text-[#d4a853]'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* WhatsApp Buttons */}
                        <div className="mt-auto space-y-3 pt-8 border-t border-gray-100">
                            <button
                                onClick={() => openWhatsApp(product.name, product.code)}
                                className="w-full bg-[#25D366] hover:bg-[#1da851] text-white py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                Buy Now - Order via WhatsApp
                            </button>
                            <button
                                onClick={() => openWhatsApp(product.name, product.code)}
                                className="w-full bg-[#d4a853] hover:bg-[#b8912e] text-white py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Enquire Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}