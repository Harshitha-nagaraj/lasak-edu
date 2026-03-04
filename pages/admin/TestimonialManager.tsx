
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Quote } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useUserRole } from '../../hooks/useUserRole';

// Helper type based on schema
interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    image: string;
    rating: number;
}

const TestimonialManager = () => {
    const navigate = useNavigate();
    const { canEdit } = useUserRole();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const testimonialsRef = collection(db, 'testimonials');
            const querySnapshot = await getDocs(testimonialsRef);
            const fetchedTestimonials: Testimonial[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Testimonial));
            fetchedTestimonials.sort((a: any, b: any) => {
                const aTime = a.created_at?.toMillis?.() || 0;
                const bTime = b.created_at?.toMillis?.() || 0;
                return bTime - aTime;
            });
            setTestimonials(fetchedTestimonials);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            await deleteDoc(doc(db, 'testimonials', id));
            setTestimonials(testimonials.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            alert('Failed to delete testimonial');
        }
    };

    const filteredTestimonials = testimonials.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Our Achievers</h1>
                    <p className="text-gray-500">Manage student success stories displayed on the home page</p>
                </div>
                {canEdit && (
                    <button
                        onClick={() => navigate('/admin/testimonials/new')}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/30"
                    >
                        <Plus size={20} /> New Testimonial
                    </button>
                )}
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search testimonials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                />
            </div>

            {/* Testimonials List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTestimonials.map((testimonial) => (
                        <div key={testimonial.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                        {testimonial.image ? (
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold">${testimonial.name.charAt(0)}</div>`;
                                                }}
                                            />
                                        ) : (
                                            <div className="text-blue-600 font-bold text-lg">{testimonial.name.charAt(0)}</div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
                                        <p className="text-xs text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                                <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">
                                    {testimonial.rating} ★
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm mb-4 italic line-clamp-3">"{testimonial.content}"</p>

                            <div className="flex justify-end gap-2 pt-4 border-t border-gray-50">
                                {canEdit && (
                                    <>
                                        <button
                                            onClick={() => navigate(`/admin/testimonials/${testimonial.id}`)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(testimonial.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredTestimonials.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <Quote size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No achievers found</p>
                    {canEdit && (
                        <button
                            onClick={() => navigate('/admin/testimonials/new')}
                            className="mt-2 text-blue-600 hover:underline text-sm"
                        >
                            Add your first achiever
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default TestimonialManager;
