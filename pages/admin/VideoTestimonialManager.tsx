
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Video, ChevronUp, ChevronDown } from 'lucide-react';
import { useUserRole } from '../../hooks/useUserRole';

interface VideoTestimonial {
    id: string;
    video_url: string;
    active: boolean;
    order_num: number;
}

const VideoTestimonialManager = () => {
    const navigate = useNavigate();
    const { canEdit } = useUserRole();
    const [videos, setVideos] = useState<VideoTestimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [reordering, setReordering] = useState(false);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, query, orderBy, getDocs } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const snapshot = await getDocs(query(collection(db, 'video_testimonials'), orderBy('order_num', 'asc')));
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoTestimonial));
            // Ensure order_num is set for all items
            const normalized = data.map((v, i) => ({ ...v, order_num: v.order_num ?? i + 1 }));
            setVideos(normalized);
        } catch (error) {
            console.error('Error fetching video testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this video testimonial?')) return;

        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, deleteDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await deleteDoc(doc(db, 'video_testimonials', id));
            setVideos(videos.filter(v => v.id !== id));
        } catch (error) {
            console.error('Error deleting video:', error);
            alert('Failed to delete video');
        }
    };

    const moveItem = async (index: number, direction: 'up' | 'down') => {
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= videos.length) return;

        setReordering(true);
        try {
            const newVideos = [...videos];
            // Swap order_num values
            const aOrder = newVideos[index].order_num;
            const bOrder = newVideos[swapIndex].order_num;
            newVideos[index] = { ...newVideos[index], order_num: bOrder };
            newVideos[swapIndex] = { ...newVideos[swapIndex], order_num: aOrder };
            // Swap positions in array
            [newVideos[index], newVideos[swapIndex]] = [newVideos[swapIndex], newVideos[index]];

            setVideos(newVideos);

            // Persist to Firestore
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, updateDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();
            await Promise.all([
                updateDoc(doc(db, 'video_testimonials', newVideos[index].id), { order_num: newVideos[index].order_num }),
                updateDoc(doc(db, 'video_testimonials', newVideos[swapIndex].id), { order_num: newVideos[swapIndex].order_num }),
            ]);
        } catch (error) {
            console.error('Error reordering:', error);
            alert('Failed to save order. Please try again.');
            fetchVideos();
        } finally {
            setReordering(false);
        }
    };

    const getYoutubeId = (url: string) => {
        if (!url) return null;
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([a-zA-Z0-9_-]{11})/);
        if (match) return match[1];
        if (url.length === 11 && !url.includes('/') && !url.includes('.mp4')) return url;
        return null;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Student Video Testimonials</h1>
                    <p className="text-gray-500">Manage video success stories on the home page · Use ↑↓ to reorder</p>
                </div>
                {canEdit && (
                    <button
                        onClick={() => navigate('/admin/video-testimonials/new')}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/30"
                    >
                        <Plus size={20} /> Add New Video
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video, index) => {
                        const ytId = getYoutubeId(video.video_url);
                        return (
                            <div key={video.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                {/* Order badge + arrow controls */}
                                <div className="flex items-center justify-between mb-3">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                                        # {index + 1}
                                    </span>
                                    {canEdit && (
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => moveItem(index, 'up')}
                                                disabled={index === 0 || reordering}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                title="Move Up"
                                            >
                                                <ChevronUp size={16} />
                                            </button>
                                            <button
                                                onClick={() => moveItem(index, 'down')}
                                                disabled={index === videos.length - 1 || reordering}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                title="Move Down"
                                            >
                                                <ChevronDown size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="aspect-[9/16] bg-black rounded-xl mb-4 overflow-hidden relative group">
                                    {ytId ? (
                                        <img
                                            src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                                            alt="Video thumbnail"
                                            className="w-full h-full object-cover opacity-60"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                                            }}
                                        />
                                    ) : (
                                        <video
                                            src={video.video_url}
                                            className="w-full h-full object-cover"
                                            muted
                                            onMouseOver={e => (e.target as HTMLVideoElement).play().catch(() => { })}
                                            onMouseOut={e => (e.target as HTMLVideoElement).pause()}
                                        />
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                        <Video className="text-white opacity-50 group-hover:opacity-100" size={40} />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                    <span className={`text-xs px-2 py-1 rounded-full ${video.active ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'}`}>
                                        {video.active ? 'Active' : 'Hidden'}
                                    </span>
                                    <div className="flex gap-2">
                                        {canEdit && (
                                            <>
                                                <button
                                                    onClick={() => navigate(`/admin/video-testimonials/${video.id}`)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(video.id)}
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
                        );
                    })}
                </div>
            )}

            {!loading && videos.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <Video size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No video testimonials found</p>
                    {canEdit && (
                        <button
                            onClick={() => navigate('/admin/video-testimonials/new')}
                            className="mt-2 text-blue-600 hover:underline text-sm"
                        >
                            Add your first video success story
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default VideoTestimonialManager;
