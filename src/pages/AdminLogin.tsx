import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminCredentials } from '../utils/storage';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const creds = getAdminCredentials();
        if (username === creds.username && password === creds.password) {
            sessionStorage.setItem('admin-auth', 'true');
            sessionStorage.setItem('admin-user', username);
            navigate('/admin/dashboard');
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="pt-20 min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#16213e] to-[#0f3460] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                    <div className="text-center mb-8">
                        <div className="text-4xl mb-3">🔐</div>
                        <h1 className="text-2xl font-bold font-display text-white">Admin Login</h1>
                        <p className="text-white/60 text-sm mt-2">Sparkling Designs Management</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-[#d4a853] focus:ring-2 focus:ring-[#d4a853]/20 outline-none transition-all text-sm"
                                placeholder="Enter username"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-[#d4a853] focus:ring-2 focus:ring-[#d4a853]/20 outline-none transition-all text-sm"
                                placeholder="Enter password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#d4a853] hover:bg-[#b8912e] text-white py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}