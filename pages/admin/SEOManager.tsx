import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Globe, ChevronRight, Layout, BookOpen, Info, Mail, Plus, X } from 'lucide-react';

interface SEOStatus {
    page_path: string;
    is_defined: boolean;
}

const SEOManager = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [definedPages, setDefinedPages] = useState<string[]>([]);
    const [courses, setCourses] = useState<{ id: string, title: string }[]>([]);
    const [blogs, setBlogs] = useState<{ id: string, title: string }[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newPath, setNewPath] = useState('');

    const STATIC_PAGES = [
        { path: '/', label: 'Home Page', icon: <Layout className="text-blue-500" /> },
        { path: '/about', label: 'About Us', icon: <Info className="text-purple-500" /> },
        { path: '/courses', label: 'Courses Listing', icon: <BookOpen className="text-green-500" /> },
        { path: '/contact', label: 'Contact Us', icon: <Mail className="text-orange-500" /> },
        { path: '/blog', label: 'Blog Listing', icon: <BookOpen className="text-blue-500" /> },
        { path: '/verify', label: 'Certificate Verification', icon: <Globe className="text-cyan-500" /> },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, getDocs } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            // Fetch defined SEO entries
            const seoSnapshot = await getDocs(collection(db, 'page_seo'));
            setDefinedPages(seoSnapshot.docs.map(doc => doc.data().page_path));

            // Fetch courses
            const coursesSnapshot = await getDocs(collection(db, 'courses'));
            setCourses(coursesSnapshot.docs.map(doc => ({
                id: doc.id,
                title: doc.data().title
            })));

            // Fetch blogs
            const blogsSnapshot = await getDocs(collection(db, 'blogs'));
            setBlogs(blogsSnapshot.docs.map(doc => ({
                id: doc.id,
                title: doc.data().title
            })));
        } catch (error) {
            console.error('Error fetching SEO data:', error);
        } finally {
            setLoading(false);
        }
    };

    const isDefined = (path: string) => definedPages.includes(path);

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredBlogs = blogs.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredStatic = STATIC_PAGES.filter(p =>
        p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.path.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const customPages = definedPages.filter(path => 
        !STATIC_PAGES.some(p => p.path === path) &&
        !path.startsWith('/courses/') &&
        !path.startsWith('/blog/')
    );
    const filteredCustom = customPages.filter(path =>
        path.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <header className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">SEO Manager</h1>
                    <p className="text-gray-500">Manage titles, descriptions, and meta tags for all pages</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition font-medium"
                >
                    <Plus size={20} />
                    <span>Add Custom Page</span>
                </button>
            </header>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search pages or courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Static Pages */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <Layout size={20} /> Main Site Pages
                    </h2>
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        {filteredStatic.map((page) => (
                            <button
                                key={page.path}
                                onClick={() => navigate(`/admin/seo/edit?path=${encodeURIComponent(page.path)}`)}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                                        {page.icon}
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-gray-900">{page.label}</div>
                                        <div className="text-xs text-gray-500 font-mono">{page.path}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {isDefined(page.path) ? (
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Customized</span>
                                    ) : (
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Default</span>
                                    )}
                                    <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Course Pages */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <BookOpen size={20} /> Course Pages
                    </h2>
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden max-h-[500px] overflow-y-auto custom-scrollbar">
                        {filteredCourses.map((course) => (
                            <button
                                key={course.id}
                                onClick={() => navigate(`/admin/seo/edit?path=${encodeURIComponent(`/courses/${course.id}`)}`)}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-white transition-colors">
                                        <BookOpen size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-gray-900 line-clamp-1">{course.title}</div>
                                        <div className="text-xs text-gray-500 font-mono">/courses/{course.id}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {isDefined(`/courses/${course.id}`) ? (
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Customized</span>
                                    ) : (
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Default</span>
                                    )}
                                    <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        ))}
                        {filteredCourses.length === 0 && (
                            <div className="p-12 text-center text-gray-400 italic">No courses found</div>
                        )}
                    </div>
                </section>

                {/* Blog Pages */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <BookOpen size={20} className="text-pink-500" /> Blog Pages
                    </h2>
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden max-h-[500px] overflow-y-auto custom-scrollbar">
                        {filteredBlogs.map((blog) => (
                            <button
                                key={blog.id}
                                onClick={() => navigate(`/admin/seo/edit?path=${encodeURIComponent(`/blog/${blog.id}`)}`)}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-pink-50 text-pink-600 rounded-lg group-hover:bg-white transition-colors">
                                        <BookOpen size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-gray-900 line-clamp-1">{blog.title}</div>
                                        <div className="text-xs text-gray-500 font-mono">/blog/{blog.id}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {isDefined(`/blog/${blog.id}`) ? (
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Customized</span>
                                    ) : (
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Default</span>
                                    )}
                                    <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        ))}
                        {filteredBlogs.length === 0 && (
                            <div className="p-12 text-center text-gray-400 italic">No blog posts found</div>
                        )}
                    </div>
                </section>

                {/* Custom Pages */}
                {customPages.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <Globe size={20} className="text-orange-500" /> Custom Pages
                    </h2>
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden max-h-[500px] overflow-y-auto custom-scrollbar">
                        {filteredCustom.map((path) => (
                            <button
                                key={path}
                                onClick={() => navigate(`/admin/seo/edit?path=${encodeURIComponent(path)}`)}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-white transition-colors">
                                        <Globe size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-gray-900 truncate">{path}</div>
                                        <div className="text-xs text-gray-500 font-mono">Custom Route</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Customized</span>
                                    <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        ))}
                        {filteredCustom.length === 0 && (
                            <div className="p-12 text-center text-gray-400 italic">No matching custom pages</div>
                        )}
                    </div>
                </section>
                )}
            </div>

            {/* Add Custom Page Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Add Custom SEO Page</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Page Path</label>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="e.g. /privacy-policy"
                                    value={newPath}
                                    onChange={(e) => setNewPath(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                />
                                <p className="text-xs text-gray-500 mt-2">Enter the exact relative URL path for the page you want to manage (must start with '/').</p>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={!newPath.startsWith('/') || newPath.length < 2}
                                    onClick={() => {
                                        setIsAddModalOpen(false);
                                        navigate(`/admin/seo/edit?path=${encodeURIComponent(newPath)}`);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium shadow hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default SEOManager;
