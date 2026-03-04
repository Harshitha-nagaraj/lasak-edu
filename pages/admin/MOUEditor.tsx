
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, Save, Briefcase, Image as ImageIcon } from 'lucide-react';
import { useUserRole } from '../../hooks/useUserRole';

const MOUEditor = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { canEdit } = useUserRole();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        college_name: '',
        description: '',
        image: '',
        date: '',
        order_num: 0
    });

    useEffect(() => {
        if (id && id !== 'new') {
            fetchMOU(id);
        }
    }, [id]);

    const fetchMOU = async (mouId: string) => {
        try {
            setLoading(true);
            const mouDoc = await getDoc(doc(db, 'mous', mouId));
            if (!mouDoc.exists()) {
                alert('MOU not found!');
                navigate('/admin/mous');
                return;
            }
            const data = mouDoc.data();
            if (data) {
                setFormData({
                    college_name: data.college_name || '',
                    description: data.description || '',
                    image: data.image || '',
                    date: data.date || '',
                    order_num: data.order_num || 0
                });
            }
        } catch (error) {
            console.error('Error fetching MOU:', error);
            alert('Failed to load MOU');
            navigate('/admin/mous');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canEdit) return;

        const isNew = !id || id === 'new';
        try {
            setSaving(true);
            const mouData = {
                ...formData,
                updated_at: serverTimestamp(),
                created_at: isNew ? serverTimestamp() : undefined
            };

            if (id && id !== 'new') {
                await updateDoc(doc(db, 'mous', id), mouData);
            } else {
                const newId = formData.college_name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
                await setDoc(doc(db, 'mous', newId), mouData);
            }

            alert('MOU saved successfully!');
            navigate('/admin/mous');
        } catch (error: any) {
            console.error('Error saving MOU:', error);
            alert('Error saving MOU: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/mous')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                    {id && id !== 'new' ? 'Edit MOU' : 'New MOU'}
                </h1>
            </div>

            <form onSubmit={handleSave} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
                        <input
                            type="text"
                            required
                            value={formData.college_name}
                            onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Government Engineering College, Coimbatore"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">MOU Date</label>
                        <input
                            type="text"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. June 2024"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                        <input
                            type="number"
                            value={formData.order_num}
                            onChange={(e) => setFormData({ ...formData, order_num: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder="Describe the partnership..."
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <div className="flex gap-4 items-start">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="/img/mous/college-mou.jpg"
                                />
                            </div>
                            <div className="w-32 h-20 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="text-gray-300" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={saving || !canEdit}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save size={20} />
                        {saving ? 'Saving...' : 'Save MOU'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MOUEditor;
