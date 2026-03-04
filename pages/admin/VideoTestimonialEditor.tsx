
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Video } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const VideoTestimonialEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'new' || !id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        video_url: '',
        active: true,
        order_num: 0
    });

    useEffect(() => {
        if (!isNew && id) {
            fetchVideo(id);
        }
    }, [id, isNew]);

    const fetchVideo = async (videoId: string) => {
        try {
            const docSnap = await getDoc(doc(db, 'video_testimonials', videoId));
            if (!docSnap.exists()) {
                alert('Video not found!');
                navigate('/admin/video-testimonials');
                return;
            }
            const data = docSnap.data();
            if (data) {
                setFormData({
                    video_url: data.video_url,
                    active: data.active,
                    order_num: data.order_num
                });
            }
        } catch (error: any) {
            console.error('Error fetching video:', error);
            alert('Video not found!');
            navigate('/admin/video-testimonials');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isNew) {
                const newId = 'video-' + Date.now();
                await setDoc(doc(db, 'video_testimonials', newId), {
                    ...formData,
                    created_at: serverTimestamp(),
                    updated_at: serverTimestamp()
                });
            } else {
                await updateDoc(doc(db, 'video_testimonials', id!), {
                    ...formData,
                    updated_at: serverTimestamp()
                });
            }

            alert('Video testimonial saved successfully!');
            navigate('/admin/video-testimonials');
        } catch (error: any) {
            console.error('Error saving video:', error);
            alert('Error saving: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/video-testimonials')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{isNew ? 'New Video Testimonial' : 'Edit Video Testimonial'}</h1>
                    <p className="text-gray-500">Manage video details</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Video URL / YouTube Link</label>
                        <input
                            name="video_url"
                            value={formData.video_url}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="https://www.youtube.com/watch?v=... OR /img/video.mp4"
                            required
                        />
                        <p className="mt-1 text-xs text-gray-500">Paste a YouTube link or use a local path (e.g., /img/videostestimonial/video1.mp4).</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                            <input
                                type="number"
                                name="order_num"
                                value={formData.order_num}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-6">
                            <input
                                type="checkbox"
                                id="active"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="active" className="text-sm font-medium text-gray-700">Visible on website</label>
                        </div>
                    </div>

                    {formData.video_url && (() => {
                        const getYoutubeId = (url: string) => {
                            if (!url) return null;
                            const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([a-zA-Z0-9_-]{11})/);
                            if (match) return match[1];
                            if (url.length === 11 && !url.includes('/') && !url.includes('.mp4')) return url;
                            return null;
                        };
                        const ytId = getYoutubeId(formData.video_url);

                        return (
                            <div className="mt-6 aspect-video max-w-sm mx-auto bg-black rounded-xl overflow-hidden shadow-inner">
                                {ytId ? (
                                    <iframe
                                        src={`https://www.youtube.com/embed/${ytId}`}
                                        className="w-full h-full border-0"
                                        allowFullScreen
                                    />
                                ) : (
                                    <video
                                        src={formData.video_url}
                                        className="w-full h-full object-contain"
                                        controls
                                    />
                                )}
                            </div>
                        );
                    })()}
                </section>

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/video-testimonials')}
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
                        {loading ? 'Saving...' : 'Save Video'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VideoTestimonialEditor;
