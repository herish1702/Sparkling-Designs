import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { openWhatsApp } from '../utils/whatsapp';

interface ProductCardProps {
    product: Product;
    featured?: boolean;
}

export default function ProductCard({ product, featured }: ProductCardProps) {
    const [imgError, setImgError] = useState(false);

    const handleWhatsApp = () => {
        openWhatsApp(product.name, product.code, '', '', product.images[0] || '');
    };

    return (
        <div className={`group bg-white rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl hover:shadow-[#d4a853]/10 hover:border-[#d4a853]/30 ${featured ? 'lg:flex' : ''}`}>
            {/* Image */}
            <div className={`relative overflow-hidden ${featured ? 'lg:w-1/2' : ''}`}>
                <div className="aspect-[4/5] bg-gradient-to-br from-[#f5f0e8] to-[#e8dcc8] flex items-center justify-center overflow-hidden">
                    {!imgError ? (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <span className="text-xs">{product.name}</span>
                        </div>
                    )}
                </div>
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.newlyAdded && (
                        <span className="bg-green-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">Newly Added</span>
                    )}
                    {product.newArrival && !product.newlyAdded && (
                        <span className="bg-[#d4a853] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">New</span>
                    )}
                    {product.bestSeller && (
                        <span className="bg-[#e94560] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">Best Seller</span>
                    )}
                    {product.customizationAvailable && (
                        <span className="bg-purple-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">Custom</span>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className={`p-4 lg:p-5 flex flex-col ${featured ? 'lg:w-1/2 lg:justify-center' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-medium text-[#d4a853] uppercase tracking-wider bg-[#d4a853]/10 px-2.5 py-0.5 rounded-full">
                        {product.category}
                    </span>
                    <span className="text-sm font-bold text-[#d4a853]">{product.price}</span>
                </div>
                <h3 className="font-display font-semibold text-gray-900 text-base lg:text-lg mb-1.5 line-clamp-1">
                    {product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2 font-mono">Code: {product.code}</p>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                    {product.description}
                </p>

                <div className="mt-auto flex items-center gap-2 pt-3 border-t border-gray-100">
                    <Link
                        to={`/product/${product.id}`}
                        className="flex-1 text-center bg-white border-2 border-[#d4a853] text-[#d4a853] hover:bg-[#d4a853] hover:text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                    >
                        View Details
                    </Link>
                    <button
                        onClick={handleWhatsApp}
                        className="flex-1 bg-[#25D366] hover:bg-[#1da851] text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5"
                    >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        Enquiry
                    </button>
                </div>
            </div>
        </div>
    );
}