
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import ImageUploader from '../../components/admin/ImageUploader';

const TestimonialEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'new' || !id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        content: '',
        image: '',
        rating: 5
    });

    useEffect(() => {
        if (!isNew && id) {
            fetchTestimonial(id);
        }
    }, [id, isNew]);

    const fetchTestimonial = async (testimonialId: string) => {
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, getDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();
            
            const testimonialDoc = await getDoc(doc(db, 'testimonials', testimonialId));
            if (!testimonialDoc.exists()) {
                alert('Testimonial not found!');
                navigate('/admin/testimonials');
                return;
            }
            const data = testimonialDoc.data();
            if (data) {
                setFormData({
                    name: data.name,
                    role: data.role,
                    content: data.content,
                    image: data.image,
                    rating: data.rating
                });
            }
        } catch (error: any) {
            console.error('Error fetching testimonial:', error);
            alert('Error loading testimonial!');
            navigate('/admin/testimonials');
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
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, setDoc, updateDoc, serverTimestamp } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const now = serverTimestamp();
            const testimonialData: any = {
                ...formData,
                updated_at: now,
            };

            // Only set created_at if it's a new document
            if (isNew) {
                testimonialData.created_at = now;
            }

            if (isNew) {
                const newId = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
                await setDoc(doc(db, 'testimonials', newId), testimonialData);
            } else {
                await updateDoc(doc(db, 'testimonials', id!), testimonialData);
            }

            alert('Testimonial saved successfully!');
            navigate('/admin/testimonials');
        } catch (error: any) {
            console.error('Error saving testimonial:', error);
            alert('Error saving testimonial: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/testimonials')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{isNew ? 'New Achiever' : 'Edit Achiever'}</h1>
                    <p className="text-gray-500">{isNew ? 'Add a success story' : `Editing ${formData.name}'s story`}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Student Info</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role / Company</label>
                            <input
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Placed at TCS"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                            <select
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder="What did they say about the course?"
                        />
                    </div>
                </section>

                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Student Photo</h2>
                    <ImageUploader
                        value={formData.image}
                        onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                        storagePath="testimonials"
                        label="Avatar Image"
                        placeholder="https://..."
                        previewClass="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
                    />
                </section>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/testimonials')}
                        className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <Save size={20} />
                        {loading ? 'Saving...' : 'Save Testimonial'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TestimonialEditor;
