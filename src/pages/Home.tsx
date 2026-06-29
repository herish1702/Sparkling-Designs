import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/products';
import { INSTAGRAM_URL } from '../utils/storage';
import { getProducts } from '../utils/productsApi';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { openWhatsApp } from '../utils/whatsapp';

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        getProducts().then(setProducts);
    }, []);

    const featuredProducts = products.filter(p => p.featured);
    const newArrivals = products.filter(p => p.newArrival || p.newlyAdded);
    const bestSellers = products.filter(p => p.bestSeller);

    return (
        <div>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center bg-gradient-to-br from-[#0f0f1a] via-[#16213e] to-[#0f3460] overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#d4a853]/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-[#e94560]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
                    <div className="animate-fadeInUp">
                        <span className="inline-block text-[#d4a853] text-sm font-semibold uppercase tracking-[0.2em] mb-6 bg-[#d4a853]/10 px-5 py-2 rounded-full">
                            Premium Kundan Jewelry & Accessories
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display text-white mb-6 leading-tight">
                            Discover the <span className="text-[#d4a853]">Finest Collection</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Browse our exquisite range of handcrafted Kundan jewelry, hair accessories, and traditional ornaments. Order directly through WhatsApp Business for personalized service.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/catalog" className="bg-[#d4a853] hover:bg-[#b8912e] text-white px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#d4a853]/30">Browse Collection</Link>
                            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg> Follow on Instagram
                            </a>
                            <button onClick={() => openWhatsApp('General Inquiry', 'KS-HELLO')} className="bg-[#25D366] hover:bg-[#1da851] text-white px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg> Order via WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 bg-white" id="about">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-[#d4a853] text-sm font-semibold uppercase tracking-[0.2em]">About Us</span>
                            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mt-4 mb-6">Bringing Brilliance <span className="text-[#d4a853]">Since 2015</span></h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">At Sparkling Designs, we are passionate about delivering excellence through our premium handcrafted jewelry and accessories. Our journey began with a simple mission — to help people adorn themselves with the finest Kundan creations.</p>
                            <p className="text-gray-600 mb-6 leading-relaxed">From intricate hair bands and elegant earrings to traditional bangles and saree pins, our carefully crafted pieces ensure lasting beauty and sophistication. We combine traditional craftsmanship with modern design to provide results that exceed expectations.</p>
                            <div className="flex gap-8">
                                <div className="text-center"><span className="block text-3xl font-bold font-display text-[#d4a853]">5000+</span><span className="text-sm text-gray-500">Happy Clients</span></div>
                                <div className="text-center"><span className="block text-3xl font-bold font-display text-[#d4a853]">8+</span><span className="text-sm text-gray-500">Years Experience</span></div>
                                <div className="text-center"><span className="block text-3xl font-bold font-display text-[#d4a853]">50+</span><span className="text-sm text-gray-500">Unique Designs</span></div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-[#d4a853]/20 to-[#d4a853]/5 rounded-3xl flex items-center justify-center">
                                <div className="text-center p-12">
                                    <div className="text-8xl mb-6">💎</div>
                                    <h3 className="text-2xl font-bold font-display text-[#d4a853]">Sparkling Designs</h3>
                                    <p className="text-gray-500 mt-2">Premium Handcrafted Jewelry</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-20 bg-[#f9f6f0]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">Shop by <span className="text-[#d4a853]">Category</span></h2>
                        <p className="text-gray-500 max-w-xl mx-auto">Explore our curated collections across different categories</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {categories.filter(c => c.id !== 'all').map(cat => (
                            <Link key={cat.id} to={`/catalog?category=${cat.id}`} className="group relative overflow-hidden rounded-2xl bg-white p-6 text-center hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#d4a853]/30">
                                <div className="text-4xl mb-3">{cat.icon}</div>
                                <h3 className="text-sm font-semibold text-gray-900">{cat.label}</h3>
                                <p className="text-xs text-gray-500 mt-1">{products.filter(p => p.category === cat.id).length} Designs</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-2">Featured <span className="text-[#d4a853]">Products</span></h2>
                            <p className="text-gray-500">Our most popular and handpicked selections</p>
                        </div>
                        <Link to="/catalog" className="hidden sm:inline-flex text-[#d4a853] hover:text-[#b8912e] font-semibold text-sm items-center gap-1">View All <span>→</span></Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                        {featuredProducts.slice(0, 8).map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                </div>
            </section>

            {/* New Arrivals */}
            <section className="py-20 bg-[#f9f6f0]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-2">New <span className="text-[#d4a853]">Arrivals</span></h2>
                            <p className="text-gray-500">Fresh additions to our collection</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                        {newArrivals.slice(0, 8).map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                </div>
            </section>

            {/* Best Sellers */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-2">Best <span className="text-[#d4a853]">Sellers</span></h2>
                            <p className="text-gray-500">Customer favorites that never go out of style</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                        {bestSellers.slice(0, 8).map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                </div>
            </section>

            {/* Instagram Gallery Section */}
            <section className="py-20 bg-gradient-to-br from-[#f9f6f0] to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="inline-flex items-center gap-2 text-[#d4a853] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg> Follow Us on Instagram
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">@sparkling_designs_2026</h2>
                        <p className="text-gray-500 max-w-xl mx-auto mb-8">Follow us on Instagram for daily updates, new arrivals, behind-the-scenes, and exclusive offers!</p>
                        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-200">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg> Follow @sparkling_designs_2026
                        </a>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 lg:gap-4">
                        {featuredProducts.slice(0, 6).map(product => (
                            <Link key={product.id} to={`/product/${product.id}`} className="group relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-[#f5f0e8] to-[#e8dcc8]">
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="text-white text-center p-4">
                                        <p className="text-xs font-semibold truncate">{product.name}</p>
                                        <p className="text-[10px] mt-1 opacity-80">{product.code}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-12">What Our <span className="text-[#d4a853]">Customers Say</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { name: 'Priya Sharma', text: 'Absolutely love the Kundan hair band! The quality is outstanding and the WhatsApp ordering was seamless.', rating: 5 },
                            { name: 'Rahul Mehta', text: 'Premium quality earrings. Exceeded my expectations. Will order again from their Instagram collection!', rating: 5 },
                            { name: 'Ananya Gupta', text: 'The bangles set is stunning. Perfect for wedding season. Great WhatsApp support & fast response.', rating: 5 },
                        ].map((t, i) => (
                            <div key={i} className="bg-[#f9f6f0] p-6 rounded-2xl text-left">
                                <div className="flex text-[#d4a853] mb-3">
                                    {[...Array(t.rating)].map((_, j) => (
                                        <svg key={j} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">"{t.text}"</p>
                                <p className="font-semibold text-gray-900 text-sm">- {t.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section - Updated Address & Phone */}
            <section className="py-20 bg-[#f9f6f0]" id="contact">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">Get In <span className="text-[#d4a853]">Touch</span></h2>
                        <p className="text-gray-500 max-w-xl mx-auto">We'd love to hear from you. Reach out via WhatsApp or follow us on Instagram!</p>
                    </div>
                    <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 lg:p-12 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-[#d4a853]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-[#d4a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <div><p className="font-medium text-gray-900 text-sm">Address</p><p className="text-gray-500 text-xs">Velachery, Chennai - 600042<br />Tamil Nadu, India</p></div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-[#25D366]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                    </div>
                                    <div><p className="font-medium text-gray-900 text-sm">WhatsApp</p><p className="text-gray-500 text-xs">+91 93840 50366</p></div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                                    </div>
                                    <div><p className="font-medium text-gray-900 text-sm">Instagram</p><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-[#d4a853] text-xs hover:underline">@sparkling_designs_2026</a></div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center p-6 bg-[#f9f6f0] rounded-xl">
                                <h4 className="font-semibold text-gray-900 mb-2">Quick Order via WhatsApp</h4>
                                <p className="text-gray-500 text-sm mb-4">Send us a message and we'll help you find the perfect product!</p>
                                <a href="https://wa.me/919384050366" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#1da851] text-white px-6 py-3 rounded-full text-sm font-semibold transition-all inline-flex items-center gap-2 w-full justify-center mb-3">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg> Send Message
                                </a>
                                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all w-full justify-center">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg> Follow on Instagram
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* WhatsApp CTA Banner */}
            <section className="py-20 bg-gradient-to-r from-[#0f0f1a] to-[#16213e]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">Ready to <span className="text-[#d4a853]">Order</span>?</h2>
                    <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">Browse our complete catalog and place your order through WhatsApp Business. Get personalized assistance and quick responses.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/catalog" className="bg-[#d4a853] hover:bg-[#b8912e] text-white px-8 py-3.5 rounded-full text-sm font-semibold transition-all">View Full Catalog</Link>
                        <a href="https://wa.me/919384050366" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#1da851] text-white px-8 py-3.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg> Order via WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}