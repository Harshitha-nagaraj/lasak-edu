import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, GripVertical, Image as ImageIcon, Download } from 'lucide-react';
import { useUserRole } from '../../hooks/useUserRole';
import { clearCache } from '../../lib/cacheUtils';

interface EcosystemItem {
    id: string;
    title: string;
    desc: string;
    image: string;
    size: 'small' | 'large';
    order_num: number;
}

const DEFAULT_ECOSYSTEM_ITEMS = [
    {
      title: "Lasak LMS Portal",
      desc: "with ready-to-access 10,000+ modules and practice tests",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop",
      size: "small",
      order_num: 0
    },
    {
      title: "Coursera Access",
      desc: "with guidance for 30+ certifications and specializations",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
      size: "small",
      order_num: 1
    },
    {
      title: "Industry Exposure Sessions",
      desc: "workshops and discussions with industry leaders",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop",
      size: "large",
      order_num: 2
    },
    {
      title: "Placement & Career Support",
      desc: "assured interviews and dedicated career mentorship",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2923216?q=80&w=800&auto=format&fit=crop",
      size: "small",
      order_num: 3
    },
    {
      title: "Communication & Aptitude",
      desc: "intensive professional-grade soft skills training for workplace-readiness",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
      size: "small",
      order_num: 4
    },
    {
      title: "Real-world Projects",
      desc: "Guided, practice, and capstone projects from industry partners",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop",
      size: "small",
      order_num: 5
    }
];

const LearningEcosystemManager = () => {
    const { canEdit } = useUserRole();
    const [items, setItems] = useState<EcosystemItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editData, setEditData] = useState<EcosystemItem>({ id: '', title: '', desc: '', image: '', size: 'small', order_num: 0 });
    const [isAdding, setIsAdding] = useState(false);
    const [seeding, setSeeding] = useState(false);
    const [newData, setNewData] = useState<Omit<EcosystemItem, 'id'>>({ title: '', desc: '', image: '', size: 'small', order_num: 0 });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, query, orderBy, getDocs } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const q = query(collection(db, 'learning_ecosystem'), orderBy('order_num', 'asc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            } as EcosystemItem));
            setItems(data);
        } catch (error) {
            console.error('Error fetching ecosystem items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newData.title || !newData.desc) return;
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const newOrderNum = items.length > 0
                ? Math.max(...items.map(c => c.order_num)) + 1
                : 0;

            await addDoc(collection(db, 'learning_ecosystem'), {
                ...newData,
                order_num: newOrderNum,
                created_at: serverTimestamp()
            });

            clearCache('cache_home_learning_ecosystem');
            setIsAdding(false);
            setNewData({ title: '', desc: '', image: '', size: 'small', order_num: 0 });
            fetchItems();
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const handleUpdate = async () => {
        if (!isEditing || !editData.title) return;
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const { id, ...updatePayload } = editData;

            await updateDoc(doc(db, 'learning_ecosystem', isEditing), {
                ...updatePayload,
                updated_at: serverTimestamp()
            });
            clearCache('cache_home_learning_ecosystem');
            setIsEditing(null);
            fetchItems();
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this benefit?')) return;
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, deleteDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await deleteDoc(doc(db, 'learning_ecosystem', id));
            clearCache('cache_home_learning_ecosystem');
            fetchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleSeedDefaults = async () => {
        if (!window.confirm('This will add all default ecosystem cards to Firestore. Continue?')) return;
        setSeeding(true);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, addDoc, getDocs, serverTimestamp } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const snapshot = await getDocs(collection(db, 'learning_ecosystem'));
            const existingTitles = new Set(snapshot.docs.map(d => d.data().title));

            const toAdd = DEFAULT_ECOSYSTEM_ITEMS.filter(s => !existingTitles.has(s.title));

            if (toAdd.length === 0) {
                alert('All default cards already exist in Firestore!');
                setSeeding(false);
                return;
            }

            for (const item of toAdd) {
                await addDoc(collection(db, 'learning_ecosystem'), {
                    ...item,
                    created_at: serverTimestamp()
                });
            }

            clearCache('cache_home_learning_ecosystem');
            alert(`Successfully added ${toAdd.length} default card(s) to Firestore!`);
            fetchItems();
        } catch (error) {
            console.error('Error seeding ecosystem items:', error);
            alert('Failed to seed defaults. Please try again.');
        } finally {
            setSeeding(false);
        }
    };

    const renderFormRow = (data: any, setData: any, onSave: any, onCancel: any, isNew = false) => (
        <tr className="bg-blue-50/50">
            <td className="px-4 py-4 text-center">
                {!isNew && (
                    <input
                        type="number"
                        className="w-16 px-2 py-1.5 bg-white border border-blue-200 rounded-lg text-sm text-center"
                        value={data.order_num}
                        onChange={(e) => setData({ ...data, order_num: parseInt(e.target.value) || 0 })}
                        min={0}
                    />
                )}
            </td>
            <td className="px-4 py-4">
                <input
                    type="text"
                    placeholder="Title"
                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg outline-none text-sm font-semibold mb-2"
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                />
                <textarea
                    placeholder="Description"
                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg outline-none text-sm h-20 resize-none"
                    value={data.desc}
                    onChange={(e) => setData({ ...data, desc: e.target.value })}
                />
            </td>
            <td className="px-4 py-4">
                <input
                    type="text"
                    placeholder="Image URL"
                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg outline-none text-sm mb-2"
                    value={data.image}
                    onChange={(e) => setData({ ...data, image: e.target.value })}
                />
                <select
                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg outline-none text-sm"
                    value={data.size}
                    onChange={(e) => setData({ ...data, size: e.target.value as 'small' | 'large' })}
                >
                    <option value="small">Small (Standard)</option>
                    <option value="large">Large (Tall)</option>
                </select>
            </td>
            <td className="px-4 py-4 text-right">
                <div className="flex justify-end gap-2">
                    <button onClick={onSave} className="p-2 text-green-600 hover:bg-green-100 rounded-lg">
                        <Save size={18} />
                    </button>
                    <button onClick={onCancel} className="p-2 text-gray-400 hover:bg-gray-200 rounded-lg">
                        <X size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Learning Ecosystem</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage the benefits cards shown on the home page.</p>
                    {items.length === 0 && !loading && (
                        <p className="text-amber-600 text-xs mt-1 font-semibold">⚠ No cards in Firestore. Click "Load Defaults" to populate.</p>
                    )}
                </div>
                {canEdit && (
                    <div className="flex gap-2">
                        {!isAdding && items.length < DEFAULT_ECOSYSTEM_ITEMS.length && (
                            <button
                                onClick={handleSeedDefaults}
                                disabled={seeding}
                                className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition-all font-semibold shadow-md disabled:opacity-60"
                            >
                                <Download size={18} /> {seeding ? 'Loading...' : 'Load Defaults'}
                            </button>
                        )}
                        {!isAdding && (
                            <button
                                onClick={() => setIsAdding(true)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md shadow-blue-500/20"
                            >
                                <Plus size={20} /> Add Card
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-16 text-center">Order</th>
                            <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/2">Content</th>
                            <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Media & Size</th>
                            {canEdit && <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right w-24">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isAdding && renderFormRow(newData, setNewData, handleAdd, () => setIsAdding(false), true)}

                        {items.map((item) => (
                            <React.Fragment key={item.id}>
                                {isEditing === item.id ? (
                                    renderFormRow(editData, setEditData, handleUpdate, () => setIsEditing(null), false)
                                ) : (
                                    <tr layout className="group hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4 text-center">
                                            <span className="text-gray-400 font-medium">{item.order_num}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                                            <p className="text-sm text-gray-500 line-clamp-2">{item.desc}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.title} className="w-12 h-12 rounded object-cover border" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400"><ImageIcon size={20} /></div>
                                                )}
                                                <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${item.size === 'large' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {item.size}
                                                </span>
                                            </div>
                                        </td>
                                        {canEdit && (
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            setIsEditing(item.id);
                                                            setEditData(item);
                                                        }}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                {items.length === 0 && !isAdding && (
                    <div className="text-center py-12">
                        <p className="text-gray-400 italic">No items found. Click "Add Card" to start.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearningEcosystemManager;
