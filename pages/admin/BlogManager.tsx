
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, BookOpen } from 'lucide-react';
import { useUserRole } from '../../hooks/useUserRole';
import { BlogPost } from '../../types';

const BlogManager = () => {
    const navigate = useNavigate();
    const { canEdit } = useUserRole();
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, getDocs } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const blogsRef = collection(db, 'blogs');
            const querySnapshot = await getDocs(blogsRef);
            const fetchedBlogs = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as BlogPost));
            // Sort by created_at or date descending in memory
            fetchedBlogs.sort((a: any, b: any) => {
                const aTime = a.created_at?.toMillis?.() || new Date(a.date || 0).getTime();
                const bTime = b.created_at?.toMillis?.() || new Date(b.date || 0).getTime();
                return bTime - aTime;
            });
            setBlogs(fetchedBlogs);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this blog post?')) return;

        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, deleteDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await deleteDoc(doc(db, 'blogs', id));
            setBlogs(blogs.filter(b => b.id !== id));
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Failed to delete blog');
        }
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
                    <p className="text-gray-500">Manage your articles and news</p>
                </div>
                {canEdit && (
                    <button
                        onClick={() => navigate('/admin/blogs/new')}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/30"
                    >
                        <Plus size={20} /> New Article
                    </button>
                )}
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                />
            </div>

            {/* Blogs List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBlogs.map((blog) => (
                        <div key={blog.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-48 overflow-hidden relative bg-gray-100">
                                <img
                                  src={blog.image}
                                  alt={blog.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent && !parent.querySelector('.no-img-placeholder')) {
                                      const ph = document.createElement('div');
                                      ph.className = 'no-img-placeholder flex items-center justify-center w-full h-full text-gray-300 text-4xl';
                                      ph.textContent = '🖼️';
                                      parent.appendChild(ph);
                                    }
                                  }}
                                />
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700">
                                    {blog.category}
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{blog.title}</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <span className="text-xs text-gray-400">{blog.date}</span>
                                    <div className="flex gap-2">
                                        {canEdit && (
                                            <>
                                                <button
                                                    onClick={() => navigate(`/admin/blogs/${blog.id}`)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(blog.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredBlogs.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No blog posts found</p>
                    {canEdit && (
                        <button
                            onClick={() => navigate('/admin/blogs/new')}
                            className="mt-2 text-blue-600 hover:underline text-sm"
                        >
                            Create your first article
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default BlogManager;
