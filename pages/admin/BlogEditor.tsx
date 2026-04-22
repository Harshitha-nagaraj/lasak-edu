
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, Eye, Edit3 } from 'lucide-react';

import ImageUploader from '../../components/admin/ImageUploader';
import { normalizeImagePath } from '../../lib/imageUtils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'new' || !id;
    const contentRef = useRef<HTMLTextAreaElement>(null);

    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
    const [formData, setFormData] = useState({
        title: '',
        category: 'Technology',
        excerpt: '',
        content: '',
        image: '',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        relatedImages: [] as string[]
    });
    const [newRelatedImage, setNewRelatedImage] = useState('');

    useEffect(() => {
        if (!isNew && id) {
            fetchBlog(id);
        }
    }, [id, isNew]);

    const fetchBlog = async (blogId: string) => {
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, getDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const blogDoc = await getDoc(doc(db, 'blogs', blogId));
            if (!blogDoc.exists()) {
                alert('Blog not found!');
                navigate('/admin/blogs');
                return;
            }
            const data = blogDoc.data();
            if (data) {
                setFormData({
                    title: data.title,
                    category: data.category,
                    excerpt: data.excerpt,
                    content: data.content || '',
                    image: data.image,
                    date: data.date,
                    relatedImages: data.relatedImages || []
                });
            }
        } catch (error: any) {
            console.error('Error fetching blog:', error);
            alert('Error loading blog!');
            navigate('/admin/blogs');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };



    const addRelatedImage = () => {
        if (newRelatedImage.trim()) {
            setFormData(prev => ({
                ...prev,
                relatedImages: [...prev.relatedImages, newRelatedImage.trim()]
            }));
            setNewRelatedImage('');
        }
    };

    const removeRelatedImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            relatedImages: prev.relatedImages.filter((_, i) => i !== index)
        }));
    };

    const insertImageAtCursor = () => {
        const url = prompt("Enter image URL:");
        if (!url) return;

        const encodedUrl = encodeURI(url);
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData.content;
        const before = text.substring(0, start);
        const after = text.substring(end);

        const imageMarkdown = `\n![Image Description](${encodedUrl})\n`;

        setFormData(prev => ({
            ...prev,
            content: before + imageMarkdown + after
        }));

        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length;
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, setDoc, updateDoc, serverTimestamp } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const now = serverTimestamp();
            const blogData: any = {
                ...formData,
                updatedAt: now,
                updated_at: now,
            };

            // Only add creation fields if it's a new document
            if (isNew) {
                blogData.createdAt = now;
                blogData.created_at = now;
            }

            if (isNew) {
                const cleanSlug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const newId = cleanSlug + '-' + Math.floor(Math.random() * 10000);
                await setDoc(doc(db, 'blogs', newId), blogData);
            } else {
                // Remove id from blogData if it somehow exists to avoid overwriting doc ID
                delete blogData.id;
                await updateDoc(doc(db, 'blogs', id!), blogData);
            }

            alert('Blog post saved successfully!');
            navigate('/admin/blogs');
        } catch (error: any) {
            console.error('Error saving blog:', error);
            alert('Error saving blog: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/blogs')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{isNew ? 'Create New Article' : 'Edit Article'}</h1>
                        <p className="text-gray-500">{isNew ? 'Share your knowledge' : `Editing ${formData.title}`}</p>
                    </div>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setViewMode('edit')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'edit' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Edit3 size={16} />
                        Edit
                    </button>
                    <button
                        onClick={() => setViewMode('preview')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Eye size={16} />
                        Preview
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {viewMode === 'edit' ? (
                    <div className="space-y-8">
                        {/* Basic Info Section */}
                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Article Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Article Title"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <input
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="e.g. Technology"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                                    <input
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="e.g. October 15, 2023"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Content Section */}
                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Content</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (Short Summary)</label>
                                <textarea
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    placeholder="A brief summary of the article..."
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Full Content (Markdown Supported)</label>
                                    <button
                                        type="button"
                                        onClick={insertImageAtCursor}
                                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors border border-gray-300"
                                    >
                                        <ImageIcon size={14} />
                                        Insert Image
                                    </button>
                                </div>
                                <textarea
                                    ref={contentRef}
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    rows={15}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                    placeholder="# Heading&#10;Write your article content here..."
                                />
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Cover Image</h2>
                            <ImageUploader
                                value={formData.image}
                                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                                storagePath="blogs/covers"
                                label="Cover Image"
                                placeholder="https://..."
                                previewClass="w-full h-48 rounded-xl object-cover border border-gray-200 mt-3"
                            />
                        </section>

                        {/* Related Images Section */}
                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Related Images</h2>
                            <p className="text-sm text-gray-500">Add images that will be displayed in a grid on the blog detail page</p>

                            <div className="space-y-4">
                                <ImageUploader
                                    value={newRelatedImage}
                                    onChange={(url) => setNewRelatedImage(url)}
                                    storagePath="blogs/related"
                                    label="Add Related Image"
                                    placeholder="https://example.com/image.jpg"
                                />
                                <button
                                    type="button"
                                    onClick={addRelatedImage}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Add to Gallery
                                </button>
                            </div>

                            {/* Display current related images */}
                            {formData.relatedImages.length > 0 && (
                                <div className="space-y-3 mt-4">
                                    <h3 className="text-sm font-medium text-gray-700">Current Images ({formData.relatedImages.length})</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {formData.relatedImages.map((img, idx) => (
                                            <div key={idx} className="relative group bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                                                <img
                                                    src={normalizeImagePath(img)}
                                                    alt={`Related ${idx + 1}`}
                                                    className="w-full h-40 object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRelatedImage(idx)}
                                                        className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                                <div className="p-2 bg-white">
                                                    <p className="text-xs text-gray-500 truncate">{img}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[600px]">
                        {/* Preview Header */}
                        <div className="relative h-[250px] w-full overflow-hidden">
                            {formData.image && (
                                <img
                                    src={normalizeImagePath(formData.image)}
                                    alt={formData.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x600?text=Cover+Image+Not+Found';
                                    }}
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-slate-900/70 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 w-full p-8 text-white z-10">
                                <span className="inline-block bg-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase mb-2">
                                    {formData.category}
                                </span>
                                <h1 className="text-2xl md:text-3xl font-black mb-2 leading-tight">
                                    {formData.title || 'Article Title'}
                                </h1>
                                <div className="flex items-center gap-4 text-xs opacity-90">
                                    <span>{formData.date}</span>
                                    <span>By Admin</span>
                                </div>
                            </div>
                        </div>

                        {/* Preview Content */}
                        <div className="p-8 md:p-12">
                            {formData.relatedImages.length > 0 && (
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {formData.relatedImages.slice(0, 2).map((img, idx) => (
                                        <div key={idx} className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                            <img src={normalizeImagePath(img)} alt="Related" className="w-full h-32 object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="prose prose-blue max-w-none 
                                prose-headings:font-bold prose-headings:text-slate-900
                                prose-p:text-slate-600 prose-p:leading-relaxed
                                prose-img:rounded-2xl prose-img:shadow-md
                                prose-ul:list-disc prose-ul:pl-5
                                prose-a:text-blue-600 prose-a:font-medium">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        h2: ({ children }) => (
                                            <div className="my-8 p-4 bg-gray-50 border-l-4 border-blue-600 rounded-r-xl">
                                                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-0 mb-0">
                                                    {children}
                                                </h2>
                                            </div>
                                        ),
                                        img: ({ src, alt }) => (
                                            <div className="my-6 bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                                                <img src={normalizeImagePath(src) || ''} alt={alt || ''} className="w-full h-auto object-cover max-h-[400px]" />
                                                {alt && <p className="text-center text-xs text-slate-500 py-2 bg-white border-t border-slate-100">{alt}</p>}
                                            </div>
                                        ),
                                    }}
                                >
                                    {formData.content || '*No content yet...*'}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 z-50">
                    <div className="max-w-4xl mx-auto flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/blogs')}
                            className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-8 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <Save size={20} />
                            {loading ? 'Saving...' : 'Save Article'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BlogEditor;
