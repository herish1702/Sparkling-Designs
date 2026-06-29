import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../utils/productsApi';
import { Product } from '../types';

const PAGE_SIZE = 20;

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (!sessionStorage.getItem('admin-auth')) {
            navigate('/admin');
            return;
        }
        loadProducts();
        const msg = sessionStorage.getItem('admin-notification');
        if (msg) {
            setNotification(msg);
            sessionStorage.removeItem('admin-notification');
            setTimeout(() => setNotification(''), 4000);
        }
    }, [navigate]);

    const loadProducts = () => {
        setLoading(true);
        getProducts().then(data => {
            setProducts(data);
            setLoading(false);
        });
    };

    const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);
    const pageProducts = products.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const goToPage = (page: number) => {
        const clamped = Math.min(Math.max(1, page), totalPages);
        setCurrentPage(clamped);
    };

    const handleDelete = async (id: number, name: string) => {
        if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
            const ok = await deleteProduct(id);
            if (ok) {
                loadProducts();
                setNotification(`"${name}" deleted successfully`);
            } else {
                setNotification(`Failed to delete "${name}". Please try again.`);
            }
            setTimeout(() => setNotification(''), 4000);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin-auth');
        sessionStorage.removeItem('admin-user');
        navigate('/admin');
    };

    return (
        <div className="pt-20 min-h-screen bg-[#0f0f1a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold font-display text-white">Admin Dashboard</h1>
                        <p className="text-white/60 text-sm mt-1">Manage your product catalog</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/admin/add"
                            className="bg-[#d4a853] hover:bg-[#b8912e] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                        >
                            + Add Product
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Notification */}
                {notification && (
                    <div className="bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] px-5 py-3 rounded-xl text-sm mb-6">
                        {notification}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                        <p className="text-2xl font-bold text-white">{products.length}</p>
                        <p className="text-white/50 text-xs mt-1">Total Products</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                        <p className="text-2xl font-bold text-white">{products.filter(p => p.featured).length}</p>
                        <p className="text-white/50 text-xs mt-1">Featured</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                        <p className="text-2xl font-bold text-white">{products.filter(p => p.newArrival || p.newlyAdded).length}</p>
                        <p className="text-white/50 text-xs mt-1">New Arrivals</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                        <p className="text-2xl font-bold text-white">{products.filter(p => p.bestSeller).length}</p>
                        <p className="text-white/50 text-xs mt-1">Best Sellers</p>
                    </div>
                </div>

                {/* Product Table */}
                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                    {loading ? (
                        <div className="py-16 text-center text-white/50 text-sm">Loading products...</div>
                    ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10 text-white/60">
                                    <th className="text-left py-4 px-4 font-medium">Product</th>
                                    <th className="text-left py-4 px-4 font-medium">Code</th>
                                    <th className="text-left py-4 px-4 font-medium">Category</th>
                                    <th className="text-left py-4 px-4 font-medium">Price</th>
                                    <th className="text-left py-4 px-4 font-medium">Status</th>
                                    <th className="text-right py-4 px-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageProducts.map(product => (
                                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-white/10 overflow-hidden flex-shrink-0">
                                                    <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-white font-medium truncate max-w-[200px]">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-white/60 font-mono text-xs">{product.code}</td>
                                        <td className="py-3 px-4">
                                            <span className="bg-[#d4a853]/10 text-[#d4a853] text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-white font-semibold">{product.price}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-1 flex-wrap">
                                                {product.featured && <span className="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.5 rounded">Featured</span>}
                                                {product.newlyAdded && <span className="bg-green-500/20 text-green-400 text-[10px] px-1.5 py-0.5 rounded">New</span>}
                                                {product.bestSeller && <span className="bg-[#e94560]/20 text-[#e94560] text-[10px] px-1.5 py-0.5 rounded">Best</span>}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/admin/edit/${product.id}`}
                                                    className="bg-[#d4a853]/20 hover:bg-[#d4a853]/30 text-[#d4a853] px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    )}

                    {/* Pagination */}
                    {!loading && products.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4 border-t border-white/10">
                            <p className="text-white/40 text-xs">
                                Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, products.length)} of {products.length} products
                            </p>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => goToPage(safePage - 1)}
                                    disabled={safePage === 1}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 text-white/70 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(page =>
                                        page === 1 ||
                                        page === totalPages ||
                                        Math.abs(page - safePage) <= 1
                                    )
                                    .reduce<(number | 'ellipsis')[]>((acc, page, idx, arr) => {
                                        if (idx > 0 && page - arr[idx - 1] > 1) acc.push('ellipsis');
                                        acc.push(page);
                                        return acc;
                                    }, [])
                                    .map((page, idx) =>
                                        page === 'ellipsis' ? (
                                            <span key={`ellipsis-${idx}`} className="px-2 text-white/30 text-xs">…</span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={`min-w-[2.25rem] px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${page === safePage
                                                    ? 'bg-[#d4a853] text-white'
                                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}
                                <button
                                    onClick={() => goToPage(safePage + 1)}
                                    disabled={safePage === totalPages}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 text-white/70 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}