
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Briefcase } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useUserRole } from '../../hooks/useUserRole';
import { MOU } from '../../types';

const MOUManager = () => {
    const navigate = useNavigate();
    const { canEdit } = useUserRole();
    const [mous, setMous] = useState<MOU[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMOUs();
    }, []);

    const fetchMOUs = async () => {
        try {
            const mousRef = collection(db, 'mous');
            const q = query(mousRef, orderBy('order_num', 'asc'));
            const querySnapshot = await getDocs(q);

            const fetchedMOUs: MOU[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as MOU));

            setMous(fetchedMOUs);
        } catch (error) {
            console.error('Error fetching MOUs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this MOU?')) return;

        try {
            await deleteDoc(doc(db, 'mous', id));
            setMous(mous.filter(m => m.id !== id));
        } catch (error) {
            console.error('Error deleting MOU:', error);
            alert('Failed to delete MOU');
        }
    };

    const filteredMOUs = mous.filter(m =>
        m.college_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">MOU Management</h1>
                    <p className="text-gray-500">Manage partnership MOUs with colleges</p>
                </div>
                {canEdit && (
                    <button
                        onClick={() => navigate('/admin/mous/new')}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/30"
                    >
                        <Plus size={20} /> New MOU
                    </button>
                )}
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search colleges..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                />
            </div>

            {/* MOUs List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMOUs.map((mou) => (
                        <div key={mou.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-48 overflow-hidden relative bg-slate-100 flex items-center justify-center">
                                {mou.image ? (
                                    <img src={mou.image} alt={mou.college_name} className="w-full h-full object-cover" />
                                ) : (
                                    <Briefcase size={48} className="text-slate-300" />
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">{mou.college_name}</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-3">{mou.description}</p>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <span className="text-xs text-gray-400">{mou.date}</span>
                                    <div className="flex gap-2">
                                        {canEdit && (
                                            <>
                                                <button
                                                    onClick={() => navigate(`/admin/mous/${mou.id}`)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(mou.id)}
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
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredMOUs.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No MOUs found</p>
                    {canEdit && (
                        <button
                            onClick={() => navigate('/admin/mous/new')}
                            className="mt-2 text-blue-600 hover:underline text-sm"
                        >
                            Add your first MOU
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default MOUManager;
