import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct } from '../utils/productsApi';
import { uploadProductImages } from '../utils/imageUpload';
import { Product } from '../types';
import ConfirmDialog from '../components/ConfirmDialog';

const CATEGORIES = [
    { id: 'hair-bands', label: '3D Kundan Hair Bands' },
    { id: 'hair-clips', label: 'Alligator Clips' },
    { id: 'bangles', label: 'Bangles' },
    { id: 'bracelets', label: 'Bracelets' },
    { id: 'center-clips', label: 'Center Clips' },
    { id: 'earrings', label: 'Ear Rings' },
    { id: 'necklace-chains', label: 'Invisible Chains' },
    { id: 'saree-pins', label: 'Saree Pins' },
    { id: 'combos', label: 'Combo Products' },
];

const COMMON_COLORS = ['Red', 'Dark Blue', 'Pink', 'Orange', 'Green', 'Yellow', 'Purple', 'Gold', 'White', 'Black', 'Silver', 'Rose Gold', 'Matte Gold', 'Antique Gold'];

export default function AdminEditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [success, setSuccess] = useState('');
    const [colorInput, setColorInput] = useState('');
    const [sizeInput, setSizeInput] = useState('');
    const [imageInput, setImageInput] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        if (!sessionStorage.getItem('admin-auth')) {
            navigate('/admin');
            return;
        }
        getProductById(Number(id)).then(p => {
            if (p) setProduct(p);
            setLoading(false);
        });
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="pt-20 min-h-screen bg-[#0f0f1a] flex items-center justify-center">
                <p className="text-white/60">Loading product...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-20 min-h-screen bg-[#0f0f1a] flex items-center justify-center">
                <p className="text-white/60">Product not found</p>
            </div>
        );
    }

    const update = (field: keyof Product, value: any) => {
        setProduct(prev => prev ? { ...prev, [field]: value } : prev);
    };

    const addColor = () => {
        if (colorInput && !product.colors.includes(colorInput)) {
            update('colors', [...product.colors, colorInput]);
            setColorInput('');
        }
    };

    const removeColor = (color: string) => {
        update('colors', product.colors.filter(c => c !== color));
    };

    const addSize = () => {
        if (sizeInput && !product.sizes.includes(sizeInput)) {
            update('sizes', [...product.sizes, sizeInput]);
            setSizeInput('');
        }
    };

    const removeSize = (size: string) => {
        update('sizes', product.sizes.filter(s => s !== size));
    };

    const addImage = () => {
        if (imageInput && !product.images.includes(imageInput)) {
            update('images', [...product.images, imageInput]);
            setImageInput('');
        }
    };

    const removeImage = (img: string) => {
        update('images', product.images.filter(i => i !== img));
    };

    const handleFiles = async (files: FileList | File[]) => {
        const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (fileArray.length === 0) return;
        setUploadError('');
        setUploading(true);
        try {
            const urls = await uploadProductImages(fileArray);
            update('images', [...product.images, ...urls]);
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Image upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSaveClick = () => setConfirmOpen(true);

    const handleSave = async () => {
        setConfirmOpen(false);
        setSaving(true);
        const ok = await updateProduct(product);
        setSaving(false);
        if (ok) {
            setSuccess('Product updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } else {
            setSuccess('');
            setUploadError('Failed to save changes. Please check your connection and try again.');
        }
    };

    const handleCancel = () => navigate('/admin/dashboard');

    return (
        <div className="pt-20 min-h-screen bg-[#0f0f1a]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold font-display text-white">Edit Product</h1>
                        <p className="text-white/60 text-sm mt-1">{product.code}</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleCancel} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">Cancel</button>
                        <button onClick={handleSaveClick} disabled={saving || uploading} className="bg-[#d4a853] hover:bg-[#b8912e] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {success && (
                    <div className="bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] px-5 py-3 rounded-xl text-sm mb-6">{success}</div>
                )}

                <div className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Product Title *</label>
                        <input type="text" value={product.name} onChange={e => update('name', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-[#d4a853] outline-none transition-all text-sm" />
                    </div>

                    {/* Category & Price */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Category *</label>
                            <select value={product.category} onChange={e => update('category', e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-[#d4a853] outline-none transition-all text-sm">
                                {CATEGORIES.map(c => <option key={c.id} value={c.id} className="bg-[#1a1a2e] text-white">{c.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Price</label>
                            <input type="text" value={product.price} onChange={e => update('price', e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-[#d4a853] outline-none transition-all text-sm" placeholder="e.g. ₹299" />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
                        <textarea value={product.description} onChange={e => update('description', e.target.value)} rows={4}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-[#d4a853] outline-none transition-all text-sm" />
                    </div>

                    {/* Material */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Material</label>
                        <input type="text" value={product.material} onChange={e => update('material', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-[#d4a853] outline-none transition-all text-sm" />
                    </div>

                    {/* Colors */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Available Colours</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {product.colors.map(color => (
                                <span key={color} className="inline-flex items-center gap-1.5 bg-[#d4a853]/20 text-[#d4a853] text-xs px-3 py-1.5 rounded-full">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color.toLowerCase() === 'gold' ? '#d4a853' : color.toLowerCase() === 'white' ? '#fff' : color.toLowerCase() }} />
                                    {color}
                                    <button onClick={() => removeColor(color)} className="text-white/50 hover:text-red-400 ml-1">&times;</button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input type="text" value={colorInput} onChange={e => setColorInput(e.target.value)} placeholder="Type color name"
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:border-[#d4a853] outline-none"
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addColor())} />
                            <button onClick={addColor} className="bg-[#d4a853]/30 hover:bg-[#d4a853]/50 text-white px-3 py-2 rounded-xl text-sm transition-all">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {COMMON_COLORS.filter(c => !product.colors.includes(c)).map(c => (
                                <button key={c} onClick={() => { setProduct(prev => prev ? { ...prev, colors: [...prev.colors, c] } : prev); }}
                                    className="text-[10px] text-white/40 hover:text-white/80 px-2 py-0.5 rounded border border-white/10 hover:border-white/30 transition-all">{c}</button>
                            ))}
                        </div>
                    </div>

                    {/* Sizes */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Available Sizes</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {product.sizes.map(size => (
                                <span key={size} className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs px-3 py-1.5 rounded-full">
                                    {size}
                                    <button onClick={() => removeSize(size)} className="text-white/50 hover:text-red-400 ml-1">&times;</button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input type="text" value={sizeInput} onChange={e => setSizeInput(e.target.value)} placeholder="Type size"
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:border-[#d4a853] outline-none"
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSize())} />
                            <button onClick={addSize} className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-xl text-sm transition-all">Add</button>
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Product Images</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {product.images.map((img, i) => (
                                <div key={i} className="relative group">
                                    <img src={img} alt="" className="w-16 h-16 rounded-lg object-cover border border-white/10" />
                                    <button onClick={() => removeImage(img)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">&times;</button>
                                </div>
                            ))}
                        </div>

                        {/* Drag-and-drop upload area */}
                        <div
                            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={e => {
                                e.preventDefault();
                                setIsDragging(false);
                                if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
                            }}
                            onClick={() => fileInputRef.current?.click()}
                            className={`mb-3 flex flex-col items-center justify-center gap-1.5 border-2 border-dashed rounded-xl py-6 px-4 text-center cursor-pointer transition-all ${isDragging ? 'border-[#d4a853] bg-[#d4a853]/10' : 'border-white/20 hover:border-white/40'
                                }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={e => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ''; }}
                            />
                            {uploading ? (
                                <span className="text-sm text-[#d4a853]">Uploading...</span>
                            ) : (
                                <>
                                    <span className="text-2xl">📤</span>
                                    <span className="text-sm text-white/70">Drag & drop images here, or click to browse</span>
                                </>
                            )}
                        </div>
                        {uploadError && <p className="text-red-400 text-xs mb-3">{uploadError}</p>}

                        <p className="text-xs text-white/40 mb-2">Or paste an image URL directly:</p>
                        <div className="flex gap-2">
                            <input type="text" value={imageInput} onChange={e => setImageInput(e.target.value)} placeholder="Paste image URL"
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:border-[#d4a853] outline-none"
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())} />
                            <button onClick={addImage} className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-xl text-sm transition-all">Add</button>
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Product Tags</label>
                        <div className="flex flex-wrap gap-3">
                            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                                <input type="checkbox" checked={product.featured} onChange={e => update('featured', e.target.checked)}
                                    className="w-4 h-4 accent-[#d4a853]" />
                                Featured Product
                            </label>
                            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                                <input type="checkbox" checked={product.bestSeller} onChange={e => update('bestSeller', e.target.checked)}
                                    className="w-4 h-4 accent-[#d4a853]" />
                                Best Seller
                            </label>
                            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                                <input type="checkbox" checked={product.newArrival} onChange={e => update('newArrival', e.target.checked)}
                                    className="w-4 h-4 accent-[#d4a853]" />
                                New Arrival
                            </label>
                            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                                <input type="checkbox" checked={product.customizationAvailable} onChange={e => update('customizationAvailable', e.target.checked)}
                                    className="w-4 h-4 accent-[#d4a853]" />
                                Customization Available
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                title="Save changes"
                message="Save changes to this product?"
                confirmLabel="Save Changes"
                onConfirm={handleSave}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}