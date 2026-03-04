import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { useUserRole } from '../../hooks/useUserRole';
import { Plus, Trash2, X, Edit, Award, Briefcase, Zap, BookOpen } from 'lucide-react';

interface Feature {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    order_num: number;
}

const FeatureManager = () => {
    const { canEdit } = useUserRole();
    const [features, setFeatures] = useState<Feature[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Feature>>({
        title: '',
        description: '',
        icon: 'Award',
        color: 'blue',
        order_num: 1
    });

    useEffect(() => {
        fetchFeatures();
    }, []);

    const fetchFeatures = async () => {
        try {
            const featuresSnapshot = await getDocs(query(collection(db, 'program_features'), orderBy('order_num', 'asc')));
            const data = featuresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feature));
            setFeatures(data || []);
        } catch (error) {
            console.error('Error fetching features:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const featureData = {
            title: formData.title,
            description: formData.description,
            icon: formData.icon,
            color: formData.color,
            order_num: formData.order_num
        };

        try {
            if (currentId) {
                // Update
                await updateDoc(doc(db, 'program_features', currentId), featureData);
            } else {
                // Insert
                await addDoc(collection(db, 'program_features'), featureData);
            }

            fetchFeatures();
            setIsEditing(false);
            resetForm();
        } catch (error: any) {
            console.error('Error saving feature:', error);
            alert(`Failed to save feature: ${error.message || JSON.stringify(error)}`);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this feature?')) return;
        try {
            await deleteDoc(doc(db, 'program_features', id));
            setFeatures(features.filter(f => f.id !== id));
        } catch (error: any) {
            console.error('Error deleting feature:', error);
            alert(`Failed to delete feature: ${error.message || JSON.stringify(error)}`);
        }
    };

    const resetForm = () => {
        setCurrentId(null);
        setFormData({
            title: '',
            description: '',
            icon: 'Award',
            color: 'blue',
            order_num: 1
        });
    };

    const handleEdit = (feature: Feature) => {
        setCurrentId(feature.id);
        setFormData(feature);
        setIsEditing(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Program Key Features</h1>
                {canEdit && (
                    <button
                        onClick={() => { resetForm(); setIsEditing(true); }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                    >
                        <Plus size={20} /> Add Feature
                    </button>
                )}
            </div>

            {isEditing && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-fade-in">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-lg font-bold">{currentId ? 'Edit Feature' : 'Add New Feature'}</h3>
                        <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
                    </div>

                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-2 border rounded-lg h-24"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Icon Name (Lucide)</label>
                            <select
                                value={formData.icon}
                                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                            >
                                <option value="Award">Award</option>
                                <option value="Briefcase">Briefcase</option>
                                <option value="Zap">Zap (Lightning)</option>
                                <option value="BookOpen">BookOpen</option>
                                <option value="Target">Target</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Color Theme</label>
                            <select
                                value={formData.color}
                                onChange={e => setFormData({ ...formData, color: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                            >
                                <option value="blue">Blue</option>
                                <option value="red">Red</option>
                                <option value="yellow">Yellow</option>
                                <option value="green">Green</option>
                                <option value="purple">Purple</option>
                            </select>
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Feature</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map(feature => (
                    <div key={feature.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group hover:shadow-md transition">
                        <div className={`mb-4 w-12 h-12 rounded-lg flex items-center justify-center ${feature.color === 'red' ? 'bg-red-100 text-red-600' :
                            feature.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                                feature.color === 'green' ? 'bg-green-100 text-green-600' :
                                    'bg-blue-100 text-blue-600'
                            }`}>
                            <span className="font-mono text-xs">{feature.icon}</span>
                        </div>

                        <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                        <p className="text-gray-500 text-sm mb-4">{feature.description}</p>

                        <div className="flex justify-end gap-2 pt-4 border-t border-gray-50">
                            {canEdit && (
                                <>
                                    <button onClick={() => handleEdit(feature)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(feature.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeatureManager;
