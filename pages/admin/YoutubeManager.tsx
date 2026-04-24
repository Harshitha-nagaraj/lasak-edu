
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Youtube, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';
import { useUserRole } from '../../hooks/useUserRole';

interface YoutubeVideo {
    id: string;
    video_id: string;
    active: boolean;
    order_num: number;
}

const YoutubeManager = () => {
    const navigate = useNavigate();
    const { canEdit } = useUserRole();
    const [videos, setVideos] = useState<YoutubeVideo[]>([]);
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

            const snapshot = await getDocs(query(collection(db, 'youtube_videos'), orderBy('order_num', 'asc')));
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as YoutubeVideo));
            // Normalise missing order_num values
            const normalized = data.map((v, i) => ({ ...v, order_num: v.order_num ?? i + 1 }));
            setVideos(normalized);
        } catch (error: any) {
            // Fallback: try without orderBy if index missing
            try {
                const { getFirestoreDb } = await import('../../lib/firebase');
                const { collection, getDocs } = await import('firebase/firestore');
                const db = await getFirestoreDb();
                const snapshot = await getDocs(collection(db, 'youtube_videos'));
                const data = snapshot.docs.map((doc, i) => ({ id: doc.id, order_num: i + 1, ...doc.data() } as YoutubeVideo));
                setVideos(data);
            } catch (e) {
                console.error('Error fetching videos:', e);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this video?')) return;

        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, deleteDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await deleteDoc(doc(db, 'youtube_videos', id));
            setVideos(prev => prev.filter(v => v.id !== id));
        } catch (error: any) {
            console.error('Error deleting video:', error);
            alert('Error deleting video: ' + error.message);
        }
    };

    const moveItem = async (index: number, direction: 'up' | 'down') => {
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= videos.length) return;

        setReordering(true);
        try {
            const newVideos = [...videos];
            const aOrder = newVideos[index].order_num;
            const bOrder = newVideos[swapIndex].order_num;
            newVideos[index] = { ...newVideos[index], order_num: bOrder };
            newVideos[swapIndex] = { ...newVideos[swapIndex], order_num: aOrder };
            [newVideos[index], newVideos[swapIndex]] = [newVideos[swapIndex], newVideos[index]];

            setVideos(newVideos);

            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, updateDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();
            await Promise.all([
                updateDoc(doc(db, 'youtube_videos', newVideos[index].id), { order_num: newVideos[index].order_num }),
                updateDoc(doc(db, 'youtube_videos', newVideos[swapIndex].id), { order_num: newVideos[swapIndex].order_num }),
            ]);
        } catch (error) {
            console.error('Error reordering:', error);
            alert('Failed to save order. Please try again.');
            fetchVideos();
        } finally {
            setReordering(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">YouTube Video Feed</h1>
                    <p className="text-gray-500">Manage YouTube videos shown on the home page · Use ↑↓ to reorder</p>
                </div>
                {canEdit && (
                    <button
                        onClick={() => navigate('/admin/youtube/new')}
                        className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg shadow-red-500/30"
                    >
                        <Plus size={20} /> Add New Video
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video, index) => (
                        <div key={video.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
                            {/* Order badge + arrow controls */}
                            <div className="flex items-center justify-between mb-3">
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                                    # {index + 1}
                                </span>
                                {canEdit && (
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => moveItem(index, 'up')}
                                            disabled={index === 0 || reordering}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            title="Move Up"
                                        >
                                            <ChevronUp size={16} />
                                        </button>
                                        <button
                                            onClick={() => moveItem(index, 'down')}
                                            disabled={index === videos.length - 1 || reordering}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            title="Move Down"
                                        >
                                            <ChevronDown size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="aspect-video bg-black rounded-xl mb-4 overflow-hidden relative group">
                                <img
                                    src={`https://img.youtube.com/vi/${video.video_id}/mqdefault.jpg`}
                                    className="w-full h-full object-cover"
                                    alt="YouTube Thumbnail"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                    <Youtube className="text-red-600 opacity-90" size={48} />
                                </div>
                                <a
                                    href={`https://www.youtube.com/watch?v=${video.video_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute top-2 right-2 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-lg text-white transition-colors"
                                >
                                    <ExternalLink size={16} />
                                </a>
                            </div>

                            <div className="flex-grow">
                                <p className="text-sm font-mono text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg truncate">
                                    ID: {video.video_id}
                                </p>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                <span className={`text-xs px-2 py-1 rounded-full ${video.active ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'}`}>
                                    {video.active ? 'Active' : 'Hidden'}
                                </span>
                                <div className="flex gap-2">
                                    {canEdit && (
                                        <>
                                            <button
                                                onClick={() => navigate(`/admin/youtube/${video.id}`)}
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
                    ))}
                </div>
            )}

            {!loading && videos.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <Youtube size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No YouTube videos found</p>
                    {canEdit && (
                        <button
                            onClick={() => navigate('/admin/youtube/new')}
                            className="mt-2 text-red-600 hover:underline text-sm"
                        >
                            Add your first YouTube video
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default YoutubeManager;
