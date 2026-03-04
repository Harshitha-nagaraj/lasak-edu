import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';
import ImageUploader from '../../components/admin/ImageUploader';
import { ArrowLeft, Save } from 'lucide-react';

interface HeroSlideForm {
    image: string;
    title: string;
    subtitle: string;
    cta_text: string;
    cta_link: string;
    order_num: number;
    active: boolean;
}

const HeroSlideEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isNew = id === 'new';

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<HeroSlideForm>({
        image: '',
        title: '',
        subtitle: '',
        cta_text: 'Learn More',
        cta_link: '/courses',
        order_num: 0,
        active: true
    });

    useEffect(() => {
        if (!isNew) {
            fetchSlide();
        }
    }, [id]);

    const fetchSlide = async () => {
        try {
            const slideDoc = await getDoc(doc(db, 'hero_slides', id!));
            if (!slideDoc.exists()) {
                alert('Slide not found!');
                navigate('/admin/hero-slides');
                return;
            }
            const data = slideDoc.data();
            if (data) {
                setFormData({
                    image: data.image,
                    title: data.title,
                    subtitle: data.subtitle,
                    cta_text: data.cta_text,
                    cta_link: data.cta_link,
                    order_num: data.order_num,
                    active: data.active
                });
            }
        } catch (error: any) {
            console.error('Error fetching slide:', error);
            alert('Error loading slide: ' + error.message);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isNew) {
                // Get the max order_num and add 1
                const maxOrderQuery = query(collection(db, 'hero_slides'), orderBy('order_num', 'desc'), limit(1));
                const maxOrderSnapshot = await getDocs(maxOrderQuery);

                const nextOrder = !maxOrderSnapshot.empty
                    ? maxOrderSnapshot.docs[0].data().order_num + 1
                    : 0;

                const newId = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
                await setDoc(doc(db, 'hero_slides', newId), {
                    ...formData,
                    order_num: nextOrder,
                    created_at: serverTimestamp(),
                    updated_at: serverTimestamp()
                });

                alert('Hero slide created successfully!');
            } else {
                await updateDoc(doc(db, 'hero_slides', id!), {
                    ...formData,
                    updated_at: serverTimestamp()
                });
                alert('Hero slide updated successfully!');
            }

            navigate('/admin/hero-slides');
        } catch (error: any) {
            console.error('Error saving slide:', error);
            alert('Error saving slide: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };



    return (
        <div className="p-8 max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/admin/hero-slides')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft size={20} />
                Back to Hero Slides
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    {isNew ? 'Create New Hero Slide' : 'Edit Hero Slide'}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <ImageUploader
                        value={formData.image}
                        onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                        storagePath="hero_slides"
                        label="Slide Image *"
                        placeholder="https://example.com/image.jpg or /img/banner.webp"
                        previewClass="w-full h-48 rounded-xl object-cover border border-gray-200 mt-3"
                    />

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Master Practical Skills"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Subtitle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subtitle *
                        </label>
                        <textarea
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            required
                            rows={3}
                            placeholder="Hands-on training with 100% Placement Support"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* CTA Text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Call-to-Action Button Text *
                        </label>
                        <input
                            type="text"
                            name="cta_text"
                            value={formData.cta_text}
                            onChange={handleChange}
                            required
                            placeholder="Start Learning"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* CTA Link */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Call-to-Action Link *
                        </label>
                        <input
                            type="text"
                            name="cta_link"
                            value={formData.cta_link}
                            onChange={handleChange}
                            required
                            placeholder="/courses or https://example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Use relative paths (e.g., /courses) or full URLs (e.g., https://example.com)
                        </p>
                    </div>

                    {/* Active Checkbox */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="active"
                            checked={formData.active}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label className="text-sm font-medium text-gray-700">
                            Active (visible on homepage)
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            <Save size={20} />
                            {loading ? 'Saving...' : isNew ? 'Create Slide' : 'Update Slide'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/hero-slides')}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HeroSlideEditor;
