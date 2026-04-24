
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Youtube, ExternalLink } from 'lucide-react';

const YoutubeEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'new' || !id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        video_id: '',
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
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, getDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const videoDoc = await getDoc(doc(db, 'youtube_videos', videoId));
            if (!videoDoc.exists()) {
                alert('Video not found!');
                navigate('/admin/youtube');
                return;
            }
            const data = videoDoc.data();
            if (data) {
                setFormData({
                    video_id: data.video_id,
                    active: data.active,
                    order_num: data.order_num
                });
            }
        } catch (error: any) {
            console.error('Error fetching video:', error);
            alert('Video not found!');
            navigate('/admin/youtube');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const { name, value, type } = target;
        const val = type === 'checkbox' ? (target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, setDoc, updateDoc, serverTimestamp } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            // Extract video ID if user pastes full URL
            let vidId = formData.video_id;
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = vidId.match(regExp);
            if (match && match[2].length === 11) {
                vidId = match[2];
            }

            const dataToSave = {
                ...formData,
                video_id: vidId.trim(),
                updated_at: serverTimestamp()
            };

            if (isNew) {
                const newId = (vidId.trim() || 'video') + '-' + Date.now();
                await setDoc(doc(db, 'youtube_videos', newId), {
                    ...dataToSave,
                    created_at: serverTimestamp()
                });
            } else {
                await updateDoc(doc(db, 'youtube_videos', id!), dataToSave);
            }

            alert('Video saved successfully!');
            navigate('/admin/youtube');
        } catch (error: any) {
            console.error('Error saving video:', error);
            alert('Error saving video: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/youtube')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{isNew ? 'Add YouTube Video' : 'Edit YouTube Video'}</h1>
                    <p className="text-gray-500">Video will be displayed in the YouTube channel section</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video ID or URL</label>
                        <div className="relative">
                            <Youtube className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                name="video_id"
                                value={formData.video_id}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="e.g. EnYGuUc6Qlk or full URL"
                                required
                            />
                        </div>
                        <p className="mt-2 text-xs text-gray-400">Pasting a full YouTube link will automatically extract the ID.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Order Number</label>
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
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="active" className="text-sm font-medium text-gray-700">Active</label>
                        </div>
                    </div>

                    {formData.video_id && (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">Preview</label>
                            <div className="aspect-video bg-black rounded-xl overflow-hidden relative shadow-inner">
                                <img
                                    src={`https://img.youtube.com/vi/${formData.video_id}/hqdefault.jpg`}
                                    className="w-full h-full object-cover"
                                    alt="Thumbnail Preview"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        if (!target.src.includes('mqdefault')) {
                                            target.src = `https://img.youtube.com/vi/${formData.video_id}/mqdefault.jpg`;
                                        }
                                    }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl">
                                        <Youtube className="text-white" size={32} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/youtube')}
                        className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-8 py-3 bg-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <Save size={20} />
                        {loading ? 'Saving...' : 'Save Video'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default YoutubeEditor;
