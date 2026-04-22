
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import ImageUploader from '../../components/admin/ImageUploader';
import { useUserRole } from '../../hooks/useUserRole';

interface Accreditation {
    id: string;
    alt: string;
    src: string;
    order_num: number;
}

const AccreditationManager = () => {
    const { canEdit } = useUserRole();
    const [accreditations, setAccreditations] = useState<Accreditation[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);


    const [formData, setFormData] = useState({
        id: '',
        alt: '',
        src: '',
        order_num: 0
    });

    useEffect(() => {
        fetchAccreditations();
    }, []);

    const fetchAccreditations = async () => {
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, query, orderBy, getDocs } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const q = query(collection(db, 'accreditations'), orderBy('order_num', 'asc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            } as Accreditation));
            setAccreditations(data);
        } catch (error) {
            console.error('Error fetching accreditations:', error);
        } finally {
            setLoading(false);
        }
    };



    const handleSave = async () => {
        if (!formData.alt || !formData.src) {
            alert('Please provide both an alt text and an image.');
            return;
        }

        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const id = isEditing || formData.alt.toLowerCase().replace(/\s+/g, '-');
            const data = {
                alt: formData.alt,
                src: formData.src,
                order_num: isEditing ? formData.order_num : accreditations.length,
                updated_at: serverTimestamp(),
                ...(isEditing ? {} : { created_at: serverTimestamp() })
            };

            await setDoc(doc(db, 'accreditations', id), data, { merge: true });

            setIsAdding(false);
            setIsEditing(null);
            setFormData({ id: '', alt: '', src: '', order_num: 0 });
            fetchAccreditations();
        } catch (error) {
            console.error('Error saving accreditation:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this accreditation?')) return;
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, deleteDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await deleteDoc(doc(db, 'accreditations', id));
            fetchAccreditations();
        } catch (error) {
            console.error('Error deleting accreditation:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Accreditations & Partners</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage logos displayed in the accreditation section.</p>
                </div>
                {canEdit && !isAdding && !isEditing && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md shadow-blue-500/20"
                    >
                        <Plus size={20} /> Add Accreditation
                    </button>
                )}
            </div>

            {(isAdding || isEditing) && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 mb-8 space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Display Name / Alt Text</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.alt}
                                    onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                                    placeholder="e.g. ISO Certified"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25"
                                >
                                    {isEditing ? 'Update' : 'Save'} Accreditation
                                </button>
                                <button
                                    onClick={() => {
                                        setIsAdding(false);
                                        setIsEditing(null);
                                        setFormData({ id: '', alt: '', src: '', order_num: 0 });
                                    }}
                                    className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <ImageUploader
                                value={formData.src}
                                onChange={(url) => setFormData(prev => ({ ...prev, src: url }))}
                                storagePath="accreditations"
                                label="Logo Image"
                                placeholder="https://... or /img/..."
                                previewClass="w-full h-32 rounded-xl object-contain border border-gray-200"
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {accreditations.map((acc) => (
                    <motion.div
                        key={acc.id}
                        layout
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 group relative overflow-hidden flex flex-col items-center justify-center h-48"
                    >
                        <img src={acc.src} alt={acc.alt} className="max-w-full max-h-[80%] object-contain" />
                        <p className="mt-3 text-sm font-bold text-gray-600 text-center">{acc.alt}</p>

                        {canEdit && (
                            <div className="absolute inset-0 bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                <button
                                    onClick={() => {
                                        setIsEditing(acc.id);
                                        setFormData(acc);
                                        setIsAdding(false);
                                    }}
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-all w-3/4"
                                >
                                    <Edit2 size={18} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(acc.id)}
                                    className="flex items-center gap-2 px-6 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all w-3/4"
                                >
                                    <Trash2 size={18} /> Delete
                                </button>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {accreditations.length === 0 && !isAdding && (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 italic font-medium">No accreditations found.</p>
                </div>
            )}
        </div>
    );
};

export default AccreditationManager;
