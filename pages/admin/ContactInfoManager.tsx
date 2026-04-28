import React, { useState, useEffect } from 'react';
import { useUserRole } from '../../hooks/useUserRole';
import { Save, Plus, Trash2, MapPin, Edit, X, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { clearCache } from '../../lib/cacheUtils';

interface BranchCard {
    id: string;
    name: string;         // e.g. "Head Office"
    address: string;
    phone: string;
    email: string;
    directions_url?: string;
    order_num: number;
    active: boolean;
}

interface SocialLink {
    id: string;
    label: string;
    url: string;
    icon: string;
    active: boolean;
    order_num: number;
}

const emptyBranch = (): Omit<BranchCard, 'id' | 'order_num' | 'active'> => ({
    name: '',
    address: '',
    phone: '',
    email: '',
    directions_url: ''
});

const ContactInfoManager = () => {
    const { canEdit } = useUserRole();
    const [branches, setBranches] = useState<BranchCard[]>([]);
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingBranch, setEditingBranch] = useState<BranchCard | null>(null);
    const [isAddingBranch, setIsAddingBranch] = useState(false);
    const [formData, setFormData] = useState(emptyBranch());
    const [activeTab, setActiveTab] = useState<'branches' | 'social'>('branches');

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            // Fetch branches
            try {
                const branchSnap = await getDocs(query(collection(db, 'contact_branches'), orderBy('order_num', 'asc')));
                setBranches(branchSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BranchCard)));
            } catch {
                setBranches([]);
            }

            // Fetch social links
            try {
                const socialSnap = await getDocs(query(collection(db, 'contact_social'), orderBy('order_num', 'asc')));
                setSocialLinks(socialSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialLink)));
            } catch {
                setSocialLinks([]);
            }
        } catch (error: any) {
            console.error('Error fetching contact data:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveBranch = async () => {
        if (!formData.name || !formData.address || !formData.phone) {
            alert('Branch Name, Address, and Phone are required.');
            return;
        }
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, addDoc, doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const data = {
                name: formData.name,
                address: formData.address,
                phone: formData.phone,
                email: formData.email,
                directions_url: formData.directions_url || '',
                updated_at: serverTimestamp()
            };

            if (editingBranch) {
                await updateDoc(doc(db, 'contact_branches', editingBranch.id), data);
                alert('Branch updated!');
            } else {
                await addDoc(collection(db, 'contact_branches'), {
                    ...data,
                    active: true,
                    order_num: branches.length,
                    created_at: serverTimestamp()
                });
                alert('Branch added!');
            }

            setEditingBranch(null);
            setIsAddingBranch(false);
            setFormData(emptyBranch());
            clearCache('cache_contact_info');
            fetchData();
        } catch (error: any) {
            alert('Error saving branch: ' + error.message);
        }
    };

    const deleteBranch = async (id: string) => {
        if (!confirm('Delete this branch card?')) return;
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, deleteDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();
            await deleteDoc(doc(db, 'contact_branches', id));
            clearCache('cache_contact_info');
            fetchData();
        } catch (error: any) {
            alert('Error deleting branch: ' + error.message);
        }
    };

    const toggleBranchActive = async (id: string, current: boolean) => {
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, updateDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();
            await updateDoc(doc(db, 'contact_branches', id), { active: !current });
            clearCache('cache_contact_info');
            fetchData();
        } catch (error: any) {
            alert('Error updating branch: ' + error.message);
        }
    };


    // Seed default branches
    const seedDefaults = async () => {
        if (!confirm('This will seed the default Head Office and Branch Office cards. Continue?')) return;
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
            const db = await getFirestoreDb();
            const defaults = [
                { name: 'Head Office', address: '11A, STV Nagar, Peelamedu, Nava India Signal, Coimbatore - 641004', phone: '+91 7418 734 466', email: 'info@lasakedu.in', directions_url: 'https://maps.google.com/?q=LASAK+EDU+Peelamedu+Coimbatore', active: true, order_num: 0 },
                { name: 'Branch Office', address: 'No.655 F Shri Paaththaa avenue 1st floor above Cheran tarpaulin Near Gp signal Gandhipuram -12', phone: '+91 74187 32525', email: 'info@lasakedu.in', directions_url: 'https://maps.google.com/?q=LASAK+EDU+Gandhipuram+Coimbatore', active: true, order_num: 1 }
            ];
            for (const d of defaults) {
                await addDoc(collection(db, 'contact_branches'), { ...d, created_at: serverTimestamp(), updated_at: serverTimestamp() });
            }
            alert('Default branch cards seeded!');
            fetchData();
        } catch (e:any) {
            alert('Error seeding branches: ' + e.message);
        }
    };

    const startEdit = (branch: BranchCard) => {
        if (!canEdit) return;
        setEditingBranch(branch);
        setFormData({
            name: branch.name || '',
            address: branch.address || '',
            phone: branch.phone || '',
            email: branch.email || '',
            directions_url: branch.directions_url || ''
        });
        setIsAddingBranch(true);
    };


    // Social link CRUD
    const [socialForm, setSocialForm] = useState({ id: '', label: '', url: '', icon: '' });
    const [isAddingSocial, setIsAddingSocial] = useState(false);
    const startSocialEdit = (link: SocialLink) => {
        setSocialForm({ id: link.id, label: link.label, url: link.url, icon: link.icon });
        setIsAddingSocial(true);
    };
    const saveSocial = async () => {
        if (!socialForm.label || !socialForm.url) { alert('Label and URL required'); return; }
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, addDoc, doc, setDoc, serverTimestamp } = await import('firebase/firestore');
            const db = await getFirestoreDb();
            const data = { label: socialForm.label, url: socialForm.url, icon: socialForm.icon, active: true, order_num: socialLinks.length, updated_at: serverTimestamp() };
            if (socialForm.id) {
                await setDoc(doc(db, 'contact_social', socialForm.id), { ...data, created_at: serverTimestamp() }, { merge: true });
                setSocialLinks(prev => prev.map(l => l.id === socialForm.id ? { ...l, ...data } : l));
            } else {
                const docRef = await addDoc(collection(db, 'contact_social'), { ...data, created_at: serverTimestamp() });
                setSocialLinks(prev => [...prev, { id: docRef.id, ...data }]);
            }
            setIsAddingSocial(false);
            setSocialForm({ id: '', label: '', url: '', icon: '' });
            clearCache('cache_contact_info');
        } catch (e: any) { alert('Error saving social link: ' + e.message); }
    };
    const deleteSocial = async (id: string) => {
        if (!confirm('Delete this social link?')) return;
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, deleteDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();
            await deleteDoc(doc(db, 'contact_social', id));
            setSocialLinks(prev => prev.filter(l => l.id !== id));
            clearCache('cache_contact_info');
        } catch (e: any) { alert('Error deleting social link: ' + e.message); }
    };

    const getIconComponent = (icon: string) => {
        const map: any = { Facebook: <Facebook size={20} />, Instagram: <Instagram size={20} />, Linkedin: <Linkedin size={20} />, Twitter: <Twitter size={20} /> };
        return map[icon] || <span className="text-xs font-bold">{icon[0]}</span>;
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading contact information...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Contact & Social Links</h1>
            <p className="text-gray-500 mb-6">Manage branch cards shown on the Contact page</p>

            {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200">
                    {(['branches', 'social'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab === 'branches' ? 'Branch Cards' : 'Social Media'}
                        </button>
                    ))}
                </div>

            {activeTab === 'branches' && (
                <>
                    {/* Add / Edit Form */}
                    {isAddingBranch ? (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">{editingBranch ? 'Edit Branch Card' : 'Add New Branch Card'}</h3>
                                <button onClick={() => { setIsAddingBranch(false); setEditingBranch(null); setFormData(emptyBranch()); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch / Office Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Head Office, Branch Office"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
                                    <textarea
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Full address"
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+91 XXXXX XXXXX"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="info@example.com"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps / Directions URL (Optional)</label>
                                    <input
                                        type="url"
                                        value={formData.directions_url}
                                        onChange={e => setFormData({ ...formData, directions_url: e.target.value })}
                                        placeholder="https://maps.google.com/..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <button
                                    onClick={saveBranch}
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Save size={18} />
                                    {editingBranch ? 'Update Branch' : 'Save Branch'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-3 mb-6">
                            {canEdit && (
                                <button
                                    onClick={() => { setIsAddingBranch(true); setEditingBranch(null); setFormData(emptyBranch()); }}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus size={18} /> Add Branch Card
                                </button>
                            )}
                        </div>
                    )}

                    {/* Branch List */}
                    <div className="space-y-4">
                        {branches.length === 0 ? (
                            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
                                <MapPin size={40} className="mx-auto mb-3 text-gray-300" />
                                <p className="mb-4">No branch cards yet.</p>
                                {canEdit && (
                                    <button onClick={seedDefaults} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                        🌱 Load Default Branches
                                    </button>
                                )}
                            </div>
                        ) : (
                            branches.map(branch => (
                                <div key={branch.id} className={`bg-white rounded-xl border p-5 ${branch.active ? 'border-gray-200' : 'border-dashed border-gray-300 opacity-60'}`}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                                <MapPin size={22} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-bold text-gray-900 text-lg">{branch.name}</h3>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${branch.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                                        {branch.active ? 'Visible' : 'Hidden'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-1">📍 {branch.address}</p>
                                                <p className="text-sm text-gray-600 mb-1">📞 {branch.phone}</p>
                                                {branch.email && <p className="text-sm text-gray-600">✉️ {branch.email}</p>}
                                            </div>
                                        </div>
                                        {canEdit && (
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button onClick={() => startEdit(branch)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => toggleBranchActive(branch.id, branch.active)}
                                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${branch.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                                                >
                                                    {branch.active ? 'Hide' : 'Show'}
                                                </button>
                                                <button onClick={() => deleteBranch(branch.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {activeTab === 'social' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    {/* Social links list */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Social Media Links</h3>
                        {canEdit && (
                            <button onClick={() => { setIsAddingSocial(true); setSocialForm({ id: '', label: '', url: '', icon: '' }); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <Plus size={18} /> Add Social Link
                            </button>
                        )}
                    </div>
                    {isAddingSocial && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Label" value={socialForm.label} onChange={e => setSocialForm({ ...socialForm, label: e.target.value })} className="px-3 py-2 border rounded" />
                                <input type="url" placeholder="URL" value={socialForm.url} onChange={e => setSocialForm({ ...socialForm, url: e.target.value })} className="px-3 py-2 border rounded" />
                                <input type="text" placeholder="Icon (Facebook, Instagram, etc.)" value={socialForm.icon} onChange={e => setSocialForm({ ...socialForm, icon: e.target.value })} className="px-3 py-2 border rounded md:col-span-2" />
                                <button onClick={saveSocial} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                    <Save size={16} /> Save
                                </button>
                                <button onClick={() => { setIsAddingSocial(false); setSocialForm({ id: '', label: '', url: '', icon: '' }); }} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="space-y-3">
                        {socialLinks.map(link => (
                            <div key={link.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 flex items-center justify-center text-blue-600">
                                        {getIconComponent(link.icon)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{link.label}</p>
                                        <a href={link.url} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline">{link.url}</a>
                                    </div>
                                </div>
                                {canEdit && (
                                    <div className="flex gap-2 items-center">
                                        <button onClick={() => startSocialEdit(link)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                                        <button onClick={() => deleteSocial(link.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {socialLinks.length === 0 && <p className="text-gray-400">No social links configured.</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactInfoManager;
