
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, GripVertical } from 'lucide-react';
import { db } from '../../lib/firebase';
import {
    collection,
    query,
    orderBy,
    getDocs,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';
import { useUserRole } from '../../hooks/useUserRole';

interface Category {
    id: string;
    name: string;
    order_num: number;
}

const CategoryManager = () => {
    const { canEdit } = useUserRole();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editData, setEditData] = useState({ id: '', name: '' });
    const [isAdding, setIsAdding] = useState(false);
    const [newData, setNewData] = useState({ id: '', name: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const q = query(collection(db, 'categories'), orderBy('order_num', 'asc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            } as Category));
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newData.id || !newData.name) return;
        try {
            const newOrderNum = categories.length > 0
                ? Math.max(...categories.map(c => c.order_num)) + 1
                : 0;

            await setDoc(doc(db, 'categories', newData.id), {
                name: newData.name,
                id: newData.id,
                order_num: newOrderNum,
                created_at: serverTimestamp()
            });

            setIsAdding(false);
            setNewData({ id: '', name: '' });
            fetchCategories();
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleUpdate = async () => {
        if (!isEditing || !editData.name) return;
        try {
            await updateDoc(doc(db, 'categories', isEditing), {
                name: editData.name,
                updated_at: serverTimestamp()
            });
            setIsEditing(null);
            fetchCategories();
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this category? Courses using this category might be affected.')) return;
        try {
            await deleteDoc(doc(db, 'categories', id));
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
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
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Course Categories</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage the categories used for filtering courses.</p>
                </div>
                {canEdit && !isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md shadow-blue-500/20"
                    >
                        <Plus size={20} /> Add Category
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-16 text-center">Order</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID (Internal)</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Display Name</th>
                            {canEdit && <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isAdding && (
                            <tr className="bg-blue-50/50 animate-pulse-slow">
                                <td className="px-6 py-4 text-center text-gray-400">#</td>
                                <td className="px-6 py-4">
                                    <input
                                        type="text"
                                        placeholder="e.g. Mechanical"
                                        className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        value={newData.id}
                                        onChange={(e) => setNewData({ ...newData, id: e.target.value })}
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <input
                                        type="text"
                                        placeholder="Display Name"
                                        className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        value={newData.name}
                                        onChange={(e) => setNewData({ ...newData, name: e.target.value })}
                                    />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={handleAdd} className="p-2 text-green-600 hover:bg-green-100 rounded-lg">
                                            <Save size={18} />
                                        </button>
                                        <button onClick={() => setIsAdding(false)} className="p-2 text-gray-400 hover:bg-gray-200 rounded-lg">
                                            <X size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {categories.map((cat, idx) => (
                            <motion.tr
                                key={cat.id}
                                layout
                                className="group hover:bg-slate-50 transition-colors"
                            >
                                <td className="px-6 py-4 text-center">
                                    <span className="text-gray-400 font-medium">{cat.order_num}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-600">{cat.id}</span>
                                </td>
                                <td className="px-6 py-4">
                                    {isEditing === cat.id ? (
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            value={editData.name}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                            autoFocus
                                        />
                                    ) : (
                                        <span className="font-semibold text-gray-800">{cat.name}</span>
                                    )}
                                </td>
                                {canEdit && (
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {isEditing === cat.id ? (
                                                <>
                                                    <button onClick={handleUpdate} className="p-2 text-green-600 hover:bg-green-100 rounded-lg">
                                                        <Save size={18} />
                                                    </button>
                                                    <button onClick={() => setIsEditing(null)} className="p-2 text-gray-400 hover:bg-gray-200 rounded-lg">
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setIsEditing(cat.id);
                                                            setEditData({ id: cat.id, name: cat.name });
                                                        }}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cat.id)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {categories.length === 0 && !isAdding && (
                    <div className="text-center py-12">
                        <p className="text-gray-400 italic">No categories found. Click "Add Category" to start.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryManager;
