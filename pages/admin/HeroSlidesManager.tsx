import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, doc, deleteDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { useUserRole } from '../../hooks/useUserRole';
import { Plus, Edit2, Trash2, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';

interface HeroSlide {
    id: string;
    order_num: number;
    image: string;
    title: string;
    subtitle: string;
    cta_text: string;
    cta_link: string;
    active: boolean;
}

const HeroSlidesManager = () => {
    const navigate = useNavigate();
    const { canEdit } = useUserRole();
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const slidesSnapshot = await getDocs(query(collection(db, 'hero_slides'), orderBy('order_num', 'asc')));
            const data = slidesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HeroSlide));
            setSlides(data || []);
        } catch (error: any) {
            console.error('Error fetching slides:', error);
            alert('Error loading slides: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this slide?')) return;

        try {
            await deleteDoc(doc(db, 'hero_slides', id));
            alert('Slide deleted successfully!');
            fetchSlides();
        } catch (error: any) {
            console.error('Error deleting slide:', error);
            alert('Error deleting slide: ' + error.message);
        }
    };

    const handleToggleActive = async (id: string, currentActive: boolean) => {
        try {
            await updateDoc(doc(db, 'hero_slides', id), { active: !currentActive });
            fetchSlides();
        } catch (error: any) {
            console.error('Error toggling active:', error);
            alert('Error updating slide: ' + error.message);
        }
    };

    const handleReorder = async (id: string, direction: 'up' | 'down') => {
        const currentIndex = slides.findIndex(s => s.id === id);
        if (currentIndex === -1) return;

        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= slides.length) return;

        const newSlides = [...slides];
        [newSlides[currentIndex], newSlides[newIndex]] = [newSlides[newIndex], newSlides[currentIndex]];

        try {
            const batch = writeBatch(db);
            newSlides.forEach((slide, index) => {
                batch.update(doc(db, 'hero_slides', slide.id), { order_num: index });
            });
            await batch.commit();
            fetchSlides();
        } catch (error: any) {
            console.error('Error reordering slides:', error);
            alert('Error reordering slides: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-center text-gray-500">Loading slides...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hero Slides</h1>
                    <p className="text-gray-600 mt-1">Manage homepage carousel slides</p>
                </div>
                {canEdit && (
                    <button
                        onClick={() => navigate('/admin/hero-slides/new')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        Add New Slide
                    </button>
                )}
            </div>

            {slides.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <p className="text-gray-500 mb-4">No hero slides found</p>
                    {canEdit && (
                        <button
                            onClick={() => navigate('/admin/hero-slides/new')}
                            className="text-blue-600 hover:underline"
                        >
                            Create your first slide
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`bg-white rounded-xl shadow-sm border ${slide.active ? 'border-gray-200' : 'border-gray-300 bg-gray-50'
                                } p-6 hover:shadow-md transition-shadow`}
                        >
                            <div className="flex items-start gap-6">
                                {/* Slide Preview Image */}
                                <div className="flex-shrink-0 w-48 h-28 rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                                        }}
                                    />
                                </div>

                                {/* Slide Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {slide.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-2">{slide.subtitle}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span>CTA: {slide.cta_text}</span>
                                                <span>•</span>
                                                <span>Order: {slide.order_num + 1}</span>
                                                <span>•</span>
                                                <span className={slide.active ? 'text-green-600' : 'text-gray-400'}>
                                                    {slide.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2">
                                    {canEdit && (
                                        <>
                                            {/* Reorder Buttons */}
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleReorder(slide.id, 'up')}
                                                    disabled={index === 0}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title="Move up"
                                                >
                                                    <ChevronUp size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleReorder(slide.id, 'down')}
                                                    disabled={index === slides.length - 1}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title="Move down"
                                                >
                                                    <ChevronDown size={18} />
                                                </button>
                                            </div>

                                            {/* Edit, Toggle, Delete */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/hero-slides/${slide.id}`)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleActive(slide.id, slide.active)}
                                                    className={`p-2 rounded ${slide.active
                                                        ? 'text-green-600 hover:bg-green-50'
                                                        : 'text-gray-400 hover:bg-gray-100'
                                                        }`}
                                                    title={slide.active ? 'Deactivate' : 'Activate'}
                                                >
                                                    {slide.active ? <Eye size={18} /> : <EyeOff size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(slide.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeroSlidesManager;
