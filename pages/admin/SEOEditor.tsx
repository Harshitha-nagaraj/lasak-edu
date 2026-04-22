import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Globe, Eye, Image as ImageIcon } from 'lucide-react';
import { useUserRole } from '../../hooks/useUserRole';

// Default values from the site's original hardcoded content
const DEFAULT_SEO: Record<string, any> = {
    '/': {
        title: "LasakEdu Institute Coimbatore | IT, Mechanical, Civil & Data Analytics Training",
        description: "LasakEdu Institute Coimbatore offers job-oriented IT, Mechanical, Civil and Data Analytics courses with internship and placement support.",
        keywords: "education institute in Coimbatore, training institute in Coimbatore, data analytics course Coimbatore, IT training institute, internship courses"
    },
    '/about': {
        title: "About LasakEdu Institute | Best Training Institute in Coimbatore",
        description: "LasakEdu Institute Coimbatore is a trusted education and training institute offering IT, Mechanical, Civil and Data Analytics courses with internship and placement support.",
        keywords: "about LasakEdu Institute, best education institute in Coimbatore, training institute in Coimbatore, skill development institute, career training institute"
    },
    '/courses': {
        title: "Explore Courses | LASAK EDU",
        description: "Browse our wide range of professional training programs in Mechanical, IT, and Civil engineering.",
    },
    '/contact': {
        title: "Contact LasakEdu Institute Coimbatore",
        description: "Get in touch with LasakEdu Institute for admissions and course details.",
        keywords: "LasakEdu contact, education institute contact, training institute address"
    },
    '/blog': {
        title: "Latest Blogs & Industry Insights | LASAK EDU",
        description: "Stay updated with the latest trends in IT, Mechanical, and Civil engineering. Read expert articles and career tips from LasakEdu.",
        keywords: "lasakedu blog, tech insights, career advice, engineering articles"
    },
    '/verify': {
        title: "Certificate Verification | LasakEdu Institute Coimbatore",
        description: "Verify student certificates and internship records issued by LasakEdu Institute Coimbatore.",
        keywords: "certificate verification, internship certificate verification, LasakEdu verification, student certificate check"
    }
};

const SEOEditor = () => {
    const { canEdit } = useUserRole();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const path = queryParams.get('path') || '/';

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isDefault, setIsDefault] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        keywords: '',
        image_url: ''
    });

    useEffect(() => {
        fetchSEO();
    }, [path]);

    const fetchSEO = async () => {
        try {
            setLoading(true);
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, getDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const docId = encodeURIComponent(path);
            const docRef = doc(db, 'page_seo', docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    keywords: data.keywords || '',
                    image_url: data.image_url || ''
                });
                setIsDefault(false);
            } else {
                await resolveDefaultSEO();
                setIsDefault(true);
            }
        } catch (error) {
            console.log('Error fetching SEO, resolving defaults:', error);
            await resolveDefaultSEO();
            setIsDefault(true);
        } finally {
            setLoading(false);
        }
    };

    const resolveDefaultSEO = async () => {
        const { getFirestoreDb } = await import('../../lib/firebase');
        const { doc, getDoc } = await import('firebase/firestore');
        const db = await getFirestoreDb();

        // Handle course pages dynamically
        if (path.startsWith('/courses/')) {
            const courseId = path.split('/').pop();
            if (courseId) {
                const courseDoc = await getDoc(doc(db, 'courses', courseId));
                if (courseDoc.exists()) {
                    const course = courseDoc.data();
                    setFormData({
                        title: `${course.title} - Course Details | LASAK EDU`,
                        description: course.description || '',
                        keywords: '',
                        image_url: course.image || ''
                    });
                    return;
                }
            }
        }

        // Handle blog pages dynamically
        if (path.startsWith('/blog/')) {
            const blogId = path.split('/').pop();
            if (blogId) {
                const blogDoc = await getDoc(doc(db, 'blogs', blogId));
                if (blogDoc.exists()) {
                    const blog = blogDoc.data();
                    setFormData({
                        title: `${blog.title} | LASAK EDU Blog`,
                        description: blog.excerpt || '',
                        keywords: '',
                        image_url: blog.image || ''
                    });
                    return;
                }
            }
        }

        // Handle static pages from our map
        const defaultValues = DEFAULT_SEO[path] || DEFAULT_SEO['/'];
        setFormData({
            title: defaultValues.title,
            description: defaultValues.description,
            keywords: defaultValues.keywords || '',
            image_url: '/img/favicon.png'
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const docId = encodeURIComponent(path);
            await setDoc(doc(db, 'page_seo', docId), {
                page_path: path,
                ...formData,
                updated_at: serverTimestamp()
            });

            alert('SEO settings saved successfully!');
            navigate('/admin/seo');
        } catch (error: any) {
            console.error('Error saving SEO:', error);
            alert('Error saving SEO: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Edit Page SEO</h1>
                        <p className="text-gray-500 font-mono text-sm">Target Path: {path}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isDefault ? (
                        <div className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full border border-yellow-100 flex items-center gap-1">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                            Showing Defaults
                        </div>
                    ) : (
                        <div className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            Custom SEO Active
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Column */}
                <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Globe size={20} className="text-blue-500" />
                            <h2 className="text-lg font-semibold text-gray-800">Search Engine Metadata</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                            <input
                                disabled={!canEdit}
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                                placeholder="e.g. Best IT Training in Coimbatore | LASAK EDU"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Recommended: 50-60 characters</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                            <textarea
                                disabled={!canEdit}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none disabled:bg-gray-100 disabled:text-gray-500"
                                placeholder="Briefly describe what this page is about for search results..."
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Recommended: 150-160 characters</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (Comma Separated)</label>
                            <input
                                disabled={!canEdit}
                                value={formData.keywords}
                                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm disabled:bg-gray-100 disabled:text-gray-500"
                                placeholder="it training, mechanical design, coimbatore..."
                            />
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <ImageIcon size={20} className="text-purple-500" />
                            <h2 className="text-lg font-semibold text-gray-800">Social Sharing Image (OG Image)</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <input
                                disabled={!canEdit}
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                                placeholder="https://lasakedu.in/img/social-preview.jpg"
                            />
                        </div>

                        {formData.image_url && (
                            <div className="aspect-video bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </section>

                    <div className="flex justify-end pt-4">
                        {canEdit && (
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save size={20} />
                                {saving ? 'Saving...' : 'Save SEO Settings'}
                            </button>
                        )}
                    </div>
                </form>

                {/* Preview Column */}
                <aside className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 sticky top-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Eye size={20} className="text-gray-400" />
                            <h2 className="text-lg font-semibold text-gray-800">Search Preview</h2>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 font-sans">
                            <div className="text-[#1a0dab] text-xl font-medium truncate mb-1">
                                {formData.title || 'Page Title Will Appear Here'}
                            </div>
                            <div className="text-[#006621] text-sm mb-1 truncate">
                                https://lasakedu.in{path}
                            </div>
                            <div className="text-[#545454] text-sm line-clamp-2">
                                {formData.description || 'Provide a meta description to see how this page will look in search engine results like Google.'}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-50 uppercase tracking-widest text-[10px] font-bold text-gray-400">
                            Social Preview
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <div className="aspect-[1.91/1] bg-gray-100">
                                {formData.image_url ? (
                                    <img src={formData.image_url} alt="FB share" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                            </div>
                            <div className="p-3 bg-gray-50 border-t border-gray-100">
                                <div className="text-[#606770] text-[12px] uppercase tracking-wide">lasakedu.in</div>
                                <div className="font-bold text-[#1d2129] leading-tight mt-1 line-clamp-1">
                                    {formData.title || 'Page Title'}
                                </div>
                                <div className="text-[#606770] text-[12px] mt-1 line-clamp-1">
                                    {formData.description || 'Page description goes here...'}
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default SEOEditor;
