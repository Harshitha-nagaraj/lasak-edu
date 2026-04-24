
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, Building2, Link as LinkIcon, Save, Briefcase, Filter } from 'lucide-react';
import ImageUploader from '../../components/admin/ImageUploader';
import { useUserRole } from '../../hooks/useUserRole';

// Firestore collection: 'partners' (id, name, logo, type, created_at)

interface Partner {
    id: string;
    name: string;
    logo: string;
    type?: 'training' | 'placement';
}

const cleanPath = (url: string) => {
    if (!url) return url;
    if (url.startsWith('https://') || url.startsWith('http://')) return url;
    let cleaned = url.replace(/\\/g, '/').replace(/^\/?public\//, '/').replace(/\/+/g, '/');
    return cleaned.startsWith('/') ? cleaned : '/' + cleaned;
};

const PartnerManager = () => {
    const { canEdit } = useUserRole();
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [newLogo, setNewLogo] = useState('');
    const [newName, setNewName] = useState('');
    const [newType, setNewType] = useState<'training' | 'placement'>('placement');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [saving, setSaving] = useState(false);
    const [filter, setFilter] = useState<'all' | 'training' | 'placement'>('all');

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, getDocs } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const querySnapshot = await getDocs(collection(db, 'partners'));
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Partner[];
            data.sort((a: any, b: any) => {
                const aTime = a.created_at?.toMillis?.() || 0;
                const bTime = b.created_at?.toMillis?.() || 0;
                return bTime - aTime;
            });
            setPartners(data);
        } catch (error) {
            console.error('Error fetching partners:', error);
        } finally {
            setLoading(false);
        }
    };



    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErrorMsg(null);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await addDoc(collection(db, 'partners'), {
                name: newName,
                logo: newLogo,
                type: newType,
                created_at: serverTimestamp()
            });

            // Refresh list
            fetchPartners();
            setIsAdding(false);
            setNewName('');
            setNewLogo('');
            setNewType('placement');
        } catch (error: any) {
            console.error('Error adding partner:', error);
            setErrorMsg('Error adding partner: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        setErrorMsg(null);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, deleteDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await deleteDoc(doc(db, 'partners', id));
            // Optimistic update
            setPartners(partners.filter(p => p.id !== id));
        } catch (error: any) {
            console.error('Error deleting partner:', error);
            setErrorMsg(`Failed to delete partner: ${error.message}`);
        }
    };

    const filteredPartners = filter === 'all'
        ? partners
        : partners.filter(p => (p.type || 'placement') === filter);

    return (
        <div className="space-y-6">
            {errorMsg && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center justify-between">
                    <span>{errorMsg}</span>
                    <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-700 font-bold px-2">X</button>
                </div>
            )}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Partners & Placements</h1>
                    <p className="text-gray-500">Manage company logos and affiliations</p>
                </div>
                {canEdit && (
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={20} />
                        {isAdding ? 'Cancel' : 'Add New Logo'}
                    </button>
                )}
            </div>

            {/* Add New Section */}
            {isAdding && (
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl animate-fade-in">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Partner / Company</h3>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <div className="flex bg-white p-1 rounded-xl border border-blue-200">
                                <button
                                    type="button"
                                    onClick={() => setNewType('placement')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${newType === 'placement' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Placement
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setNewType('training')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${newType === 'training' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Training
                                </button>
                            </div>
                        </div>

                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                            <input
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Google"
                                required
                            />
                        </div>

                        <div className="md:col-span-4">
                            <ImageUploader
                                value={newLogo}
                                onChange={(url) => setNewLogo(url)}
                                storagePath="partners"
                                label="Logo"
                                placeholder="https://..."
                                previewClass="h-11 w-11 rounded-lg object-contain border border-gray-200"
                            />
                        </div>


                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className={`w-full h-[42px] bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 ${saving ? 'opacity-50' : ''}`}
                            >
                                <Save size={18} /> {saving ? 'Wait...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    All Partners
                </button>
                <button
                    onClick={() => setFilter('placement')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${filter === 'placement' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                >
                    <Briefcase size={14} /> Placement Companies
                </button>
                <button
                    onClick={() => setFilter('training')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${filter === 'training' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                >
                    <Building2 size={14} /> Training Partners
                </button>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    {filteredPartners.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No partners found. Click "Add New Logo" to get started.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {filteredPartners.map((partner) => (
                                <div key={partner.id} className="group relative aspect-[3/2] bg-gray-50 rounded-xl flex items-center justify-center p-4 border border-gray-100 hover:shadow-md transition-all">
                                    {/* Type Badge */}
                                    <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${partner.type === 'training' ? 'bg-purple-500' : 'bg-blue-500'}`} title={partner.type || 'placement'}></div>

                                    <img
                                        src={cleanPath(partner.logo)}
                                        alt={partner.name}
                                        className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                                        onError={(e) => {
                                            console.error(`Failed to load image for ${partner.name}: ${partner.logo}`);
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=' + encodeURIComponent(partner.name);
                                        }}
                                    />

                                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-center shadow-sm">
                                        <p className="text-xs font-bold text-gray-700 truncate">{partner.name}</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">{partner.type || 'placement'}</p>
                                    </div>

                                    {canEdit && (
                                        <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center gap-2 backdrop-blur-sm z-10 transition-all opacity-0 hover:opacity-100">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // alert(`Click Registered on ID: ${partner.id}`); // Debug removed
                                                    handleDelete(partner.id);
                                                }}
                                                className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                                                title="Delete"
                                            >
                                                <Trash2 size={24} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            {/* Debug Section */}
            <div className="mt-8 p-4 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-60">
                <h3 className="font-bold mb-2">Debug Data (Scroll to see IDs)</h3>
                <pre>{JSON.stringify(partners, null, 2)}</pre>
            </div>
        </div>
    );
};

export default PartnerManager;
