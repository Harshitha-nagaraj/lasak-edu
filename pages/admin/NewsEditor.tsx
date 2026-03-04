import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { normalizeImagePath } from '../../lib/imageUtils';

const NewsEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'new' || !id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'New Course',
        excerpt: '',
        image: '',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    });

    useEffect(() => {
        if (!isNew && id) {
            fetchNewsItem(id);
        }
    }, [id, isNew]);

    const fetchNewsItem = async (newsId: string) => {
        try {
            const newsDoc = await getDoc(doc(db, 'news', newsId));
            if (!newsDoc.exists()) {
                alert('News update not found!');
                navigate('/admin/news');
                return;
            }
            const data = newsDoc.data();
            if (data) {
                setFormData({
                    title: data.title,
                    category: data.category || '',
                    excerpt: data.excerpt || '',
                    image: data.image || '',
                    date: data.date || ''
                });
            }
        } catch (error: any) {
            console.error('Error fetching news:', error);
            alert('Error loading news update!');
            navigate('/admin/news');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const now = serverTimestamp();
            const newsData: any = {
                ...formData,
                updated_at: now,
            };

            // Only set created_at if it's a new document
            if (isNew) {
                newsData.created_at = now;
            }

            if (isNew) {
                const newId = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
                await setDoc(doc(db, 'news', newId), newsData);
            } else {
                await updateDoc(doc(db, 'news', id!), newsData);
            }

            alert('News update saved successfully!');
            navigate('/admin/news');
        } catch (error: any) {
            console.error('Error saving news:', error);
            alert('Error saving news: ' + error.message);
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
                        onClick={() => navigate('/admin/news')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{isNew ? 'Create News Update' : 'Edit News Update'}</h1>
                        <p className="text-gray-500">{isNew ? 'Announce something new' : `Editing ${formData.title}`}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-8">
                    {/* Basic Info Section */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Update Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Enter update title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    <option value="New Course">New Course</option>
                                    <option value="Placements">Placements</option>
                                    <option value="Workshop">Workshop</option>
                                    <option value="Success Stories">Success Stories</option>
                                    <option value="General">General</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Date</label>
                                <input
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Feb 20, 2026"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Content Section */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Summary</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (Full Content not supported for News)</label>
                            <textarea
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                placeholder="Describe the news update..."
                                required
                            />
                        </div>
                    </section>

                    {/* Image Section */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Cover Image</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <div className="flex gap-2">
                                <input
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="https://..."
                                />
                            </div>
                            {formData.image && (
                                <div className="mt-4 w-full h-64 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center">
                                    <img
                                        src={normalizeImagePath(formData.image)}
                                        alt="Preview"
                                        className="max-w-full max-h-full object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Submit Button */}
                <div className="max-w-4xl mx-auto flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/news')}
                        className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <Save size={20} />
                        {loading ? 'Saving...' : 'Save Update'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewsEditor;
