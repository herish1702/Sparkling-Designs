import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminEditProduct from './pages/AdminEditProduct';
import AdminAddProduct from './pages/AdminAddProduct';
import { isSupabaseConfigured } from './utils/supabaseClient';

function SupabaseConfigWarning() {
    if (isSupabaseConfigured) return null;
    return (
        <div className="bg-red-600 text-white text-sm text-center py-2 px-4">
            ⚠ Supabase is not configured. Create a <code>.env</code> file with{' '}
            <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> (see README.md),
            then restart the dev server. Products and images won't load until this is fixed.
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <SupabaseConfigWarning />
                <Navbar />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/catalog" element={<Catalog />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/admin" element={<AdminLogin />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/edit/:id" element={<AdminEditProduct />} />
                        <Route path="/admin/add" element={<AdminAddProduct />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}