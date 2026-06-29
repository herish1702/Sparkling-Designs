import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct, generateProductCode } from '../utils/productsApi';
import { uploadProductImages } from '../utils/imageUpload';
import { Product } from '../types';

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

export default function AdminAddProduct() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [colorInput, setColorInput] = useState('');
    const [sizeInput, setSizeInput] = useState('');
    const [imageInput, setImageInput] = useState('');

    const [form, setForm] = useState({
        name: '',
        category: 'hair-bands',
        description: '',
        material: '',
        colors: [] as string[],
        sizes: [] as string[],
        images: [] as string[],
        price: '₹',
        featured: false,
        bestSeller: false,
        newArrival: true,
        customizationAvailable: false,
    });

    useEffect(() => {
        if (!sessionStorage.getItem('admin-auth')) {
            navigate('/admin');
        }
    }, [navigate]);

    const update = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

    const validate = (): boolean => {
        const errs: string[] = [];
        if (!form.name.trim()) errs.push('Product title is required');
        if (form.images.length === 0) errs.push('At least one image is required');
        setErrors(errs);
        return errs.length === 0;
    };

    const handleFiles = async (files: FileList | File[]) => {
        const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (fileArray.length === 0) return;
        setUploadError('');
        setUploading(true);
        try {
            const urls = await uploadProductImages(fileArray);
            update('images', [...form.images, ...urls]);
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Image upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!validate()) return;
        if (!window.confirm('Add this product to the catalog?')) return;
        setSaving(true);

        const code = await generateProductCode(form.category);
        const newProduct: Omit<Product, 'id'> = {
            name: form.name,
            code,
            category: form.category,
            description: form.description,
            material: form.material,
            colors: form.colors,
            sizes: form.sizes,
            images: form.images,
            price: form.price,
            featured: form.featured,
            newArrival: true,
            bestSeller: form.bestSeller,
            newlyAdded: true,
            customizationAvailable: form.customizationAvailable,
            rating: 5.0,
            createdAt: new Date().toISOString(),
        };

        const created = await addProduct(newProduct);
        setSaving(false);

        if (created) {
            setSuccess(`"${created.name}" added successfully! (Code: ${created.code})`);
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 2000);
        } else {
            setErrors(['Failed to add product. Please check your connection and try again.']);
        }
    };

    return (
        <div className="pt-20 min-h-screen bg-[#0f0f1a]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold font-display text-white">Add New Product</h1>
                        <p className="text-white/60 text-sm mt-1">Create a new product listing</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => navigate('/admin/dashboard')} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">Cancel</button>
                    </div>
                </div>

                {errors.length > 0 && (
                    <div className="bg-red-500/20 border border-red-500/40 text-red-300 px-5 py-3 rounded-xl text-sm mb-6">
                        {errors.map((e, i) => <p key={i}>{e}</p>)}
                    </div>
                )}

                {success && (
                    <div className="bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] px-5 py-3 rounded-xl text-sm mb-6">{success}</div>
                )}

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Product Title *</label>
                        <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-[#d4a853] outline-none transition-all text-sm" placeholder="Enter product name" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Category *</label>
                            <select value={form.category} onChange={e => update('category', e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-[#d4a853] outline-none transition-all text-sm">
                                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Price</label>
                            <input type="text" value={form.price} onChange={e => update('price', e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-[#d4a853] outline-none transition-all text-sm" placeholder="e.g. ₹299" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
                        <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-[#d4a853] outline-none transition-all text-sm" placeholder="Describe the product..." />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Material</label>
                        <input type="text" value={form.material} onChange={e => update('material', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-[#d4a853] outline-none transition-all text-sm" placeholder="e.g. Gold-Plated, Kundan Stones" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Available Colours</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {form.colors.map(color => (
                                <span key={color} className="inline-flex items-center gap-1.5 bg-[#d4a853]/20 text-[#d4a853] text-xs px-3 py-1.5 rounded-full">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color.toLowerCase() === 'gold' ? '#d4a853' : color.toLowerCase() === 'white' ? '#fff' : color.toLowerCase() }} />
                                    {color}
                                    <button onClick={() => update('colors', form.colors.filter(c => c !== color))} className="text-white/50 hover:text-red-400 ml-1">&times;</button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input type="text" value={colorInput} onChange={e => setColorInput(e.target.value)} placeholder="Type color name"
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:border-[#d4a853] outline-none"
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), colorInput && (update('colors', [...form.colors, colorInput]), setColorInput('')))} />
                            <button onClick={() => { if (colorInput) { update('colors', [...form.colors, colorInput]); setColorInput(''); } }} className="bg-[#d4a853]/30 hover:bg-[#d4a853]/50 text-white px-3 py-2 rounded-xl text-sm transition-all">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {COMMON_COLORS.filter(c => !form.colors.includes(c)).map(c => (
                                <button key={c} onClick={() => update('colors', [...form.colors, c])}
                                    className="text-[10px] text-white/40 hover:text-white/80 px-2 py-0.5 rounded border border-white/10 hover:border-white/30 transition-all">{c}</button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Available Sizes</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {form.sizes.map(size => (
                                <span key={size} className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs px-3 py-1.5 rounded-full">
                                    {size}
                                    <button onClick={() => update('sizes', form.sizes.filter(s => s !== size))} className="text-white/50 hover:text-red-400 ml-1">&times;</button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input type="text" value={sizeInput} onChange={e => setSizeInput(e.target.value)} placeholder="Type size"
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:border-[#d4a853] outline-none"
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), sizeInput && (update('sizes', [...form.sizes, sizeInput]), setSizeInput('')))} />
                            <button onClick={() => { if (sizeInput) { update('sizes', [...form.sizes, sizeInput]); setSizeInput(''); } }} className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-xl text-sm transition-all">Add</button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Product Images *</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {form.images.map((img, i) => (
                                <div key={i} className="relative group">
                                    <img src={img} alt="" className="w-16 h-16 rounded-lg object-cover border border-white/10" />
                                    <button onClick={() => update('images', form.images.filter((_, j) => j !== i))} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
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
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), imageInput && (update('images', [...form.images, imageInput]), setImageInput('')))} />
                            <button onClick={() => { if (imageInput) { update('images', [...form.images, imageInput]); setImageInput(''); } }} className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-xl text-sm transition-all">Add</button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Product Tags (Optional)</label>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { key: 'featured', label: 'Featured Product' },
                                { key: 'bestSeller', label: 'Best Seller' },
                                { key: 'customizationAvailable', label: 'Customization Available' },
                            ].map(tag => (
                                <label key={tag.key} className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                                    <input type="checkbox" checked={(form as any)[tag.key]} onChange={e => update(tag.key, e.target.checked)} className="w-4 h-4 accent-[#d4a853]" />
                                    {tag.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button onClick={handleSave} disabled={saving || uploading}
                        className="w-full bg-[#d4a853] hover:bg-[#b8912e] text-white py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50">
                        {saving ? 'Adding Product...' : 'Add Product to Catalog'}
                    </button>
                </div>
            </div>
        </div>
    );
}