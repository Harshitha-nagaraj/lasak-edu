import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Tag, CheckCircle, AlertCircle, Percent } from 'lucide-react';

interface Coupon {
    id?: string;
    code: string;
    percentage: number;
    minPrice: number;
    maxPrice: number;
    description?: string;
    active: boolean;
    createdAt?: any;
}

const emptyForm: Omit<Coupon, 'id'> = {
    code: '',
    percentage: 10,
    minPrice: 0,
    maxPrice: 999999,
    description: '',
    active: true,
};

const CouponManager = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<Omit<Coupon, 'id'>>(emptyForm);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

    const showToast = (type: 'success' | 'error', msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, getDocs, orderBy, query } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const q = query(collection(db, 'coupons'), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            setCoupons(snap.docs.map(d => ({ id: d.id, ...d.data() } as Coupon)));
        } catch (err) {
            // Try without orderBy if index not yet created
            try {
                const { getFirestoreDb } = await import('../../lib/firebase');
                const { collection, getDocs } = await import('firebase/firestore');
                const db = await getFirestoreDb();

                const snap = await getDocs(collection(db, 'coupons'));
                setCoupons(snap.docs.map(d => ({ id: d.id, ...d.data() } as Coupon)));
            } catch (err2) {
                showToast('error', 'Failed to load coupons.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCoupons(); }, []);

    const handleOpen = (coupon?: Coupon) => {
        if (coupon) {
            setEditingId(coupon.id || null);
            setForm({
                code: coupon.code,
                percentage: coupon.percentage,
                minPrice: coupon.minPrice,
                maxPrice: coupon.maxPrice,
                description: coupon.description || '',
                active: coupon.active,
            });
        } else {
            setEditingId(null);
            setForm(emptyForm);
        }
        setShowForm(true);
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
    };

    const handleSave = async () => {
        if (!form.code.trim()) return showToast('error', 'Coupon code is required.');
        if (form.percentage <= 0 || form.percentage > 100) return showToast('error', 'Discount % must be 1–100.');
        if (form.minPrice > form.maxPrice) return showToast('error', 'Min price must be ≤ max price.');

        setSaving(true);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, addDoc, doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const payload = {
                code: form.code.trim().toUpperCase(),
                percentage: Number(form.percentage),
                minPrice: Number(form.minPrice),
                maxPrice: Number(form.maxPrice),
                description: form.description || '',
                active: form.active,
            };

            if (editingId) {
                await updateDoc(doc(db, 'coupons', editingId), payload);
                showToast('success', 'Coupon updated successfully!');
            } else {
                await addDoc(collection(db, 'coupons'), { ...payload, createdAt: serverTimestamp() });
                showToast('success', 'Coupon created successfully!');
            }
            handleClose();
            fetchCoupons();
        } catch (err) {
            showToast('error', 'Failed to save coupon.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this coupon?')) return;
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, deleteDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await deleteDoc(doc(db, 'coupons', id));
            showToast('success', 'Coupon deleted.');
            fetchCoupons();
        } catch {
            showToast('error', 'Failed to delete coupon.');
        }
    };

    const toggleActive = async (coupon: Coupon) => {
        if (!coupon.id) return;
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, updateDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await updateDoc(doc(db, 'coupons', coupon.id), { active: !coupon.active });
            fetchCoupons();
        } catch {
            showToast('error', 'Failed to update status.');
        }
    };

    const formatPrice = (v: number) => `₹${Number(v).toLocaleString('en-IN')}`;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl font-bold text-white text-sm transition-all ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <Tag className="text-white" size={20} />
                        </div>
                        Coupon Manager
                    </h1>
                    <p className="text-slate-500 mt-1">Create and manage discount coupon codes for courses.</p>
                </div>
                <button
                    onClick={() => handleOpen()}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                    <Plus size={18} /> Add Coupon
                </button>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8">
                <h3 className="font-black text-blue-800 mb-2 flex items-center gap-2"><Percent size={16} /> How Coupons Work</h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                    Coupons are validated by <strong>price range</strong>. When a student enters a code on the course page,
                    the system checks if the course price falls between the coupon's Min Price and Max Price.
                    If it matches, the discount % is applied and the <strong>balance to pay</strong> is shown.
                </p>
            </div>

            {/* Add/Edit Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-slate-900">{editingId ? 'Edit Coupon' : 'New Coupon'}</h2>
                            <button onClick={handleClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* Coupon Code */}
                            <div>
                                <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">Coupon Code *</label>
                                <input
                                    type="text"
                                    value={form.code}
                                    onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                                    placeholder="e.g. LASAK50"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl font-mono font-bold text-blue-700 focus:border-blue-500 outline-none focus:ring-2 focus:ring-blue-100 transition-all text-lg"
                                />
                            </div>

                            {/* Discount % */}
                            <div>
                                <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">Discount Percentage *</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        min={1} max={100}
                                        value={form.percentage}
                                        onChange={e => setForm(f => ({ ...f, percentage: Number(e.target.value) }))}
                                        className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:border-blue-500 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                    <span className="text-2xl font-black text-blue-600">%</span>
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">Min Price (₹) *</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.minPrice}
                                        onChange={e => setForm(f => ({ ...f, minPrice: Number(e.target.value) }))}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:border-blue-500 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">Max Price (₹) *</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.maxPrice}
                                        onChange={e => setForm(f => ({ ...f, maxPrice: Number(e.target.value) }))}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:border-blue-500 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">Description (optional)</label>
                                <input
                                    type="text"
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="e.g. Summer sale discount"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 focus:border-blue-500 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>

                            {/* Active toggle */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <span className="font-bold text-slate-700">Active</span>
                                <button
                                    onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                                    className={`w-12 h-6 rounded-full transition-all relative ${form.active ? 'bg-green-500' : 'bg-slate-300'}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.active ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            {/* Preview */}
                            {form.code && form.percentage > 0 && (
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-4 text-center">
                                    <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-1">Preview</p>
                                    <p className="text-2xl font-black font-mono">{form.code}</p>
                                    <p className="text-lg font-bold opacity-90">{form.percentage}% OFF</p>
                                    <p className="text-xs opacity-70 mt-1">
                                        Valid for courses priced {formatPrice(form.minPrice)} – {formatPrice(form.maxPrice)}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-7">
                            <button onClick={handleClose} className="flex-1 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {saving ? 'Saving...' : <><Save size={16} /> {editingId ? 'Update' : 'Create'}</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Coupon List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : coupons.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                    <Tag size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-xl font-bold text-slate-600">No coupons yet</h3>
                    <p className="text-slate-600 text-sm mt-1">Click "Add Coupon" to create your first coupon code.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {coupons.map(coupon => (
                        <div key={coupon.id} className={`bg-white rounded-2xl border-2 shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all ${coupon.active ? 'border-slate-100 hover:border-blue-200' : 'border-slate-100 opacity-60'}`}>
                            {/* Code badge */}
                            <div className={`px-5 py-3 rounded-xl font-mono font-black text-xl text-center min-w-[120px] ${coupon.active ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                {coupon.code}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-2xl font-black text-green-600">{coupon.percentage}% OFF</span>
                                    {coupon.description && (
                                        <span className="text-slate-500 text-sm">{coupon.description}</span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-500 mt-1">
                                    Valid for: <strong className="text-slate-700">{formatPrice(coupon.minPrice)}</strong> – <strong className="text-slate-700">{formatPrice(coupon.maxPrice)}</strong>
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 shrink-0">
                                {/* Toggle active */}
                                <button
                                    onClick={() => toggleActive(coupon)}
                                    title={coupon.active ? 'Deactivate' : 'Activate'}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-black border transition-all ${coupon.active ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'}`}
                                >
                                    {coupon.active ? 'Active' : 'Inactive'}
                                </button>
                                <button
                                    onClick={() => handleOpen(coupon)}
                                    className="p-2.5 rounded-xl text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-200"
                                    title="Edit"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(coupon.id!)}
                                    className="p-2.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all border border-slate-200"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CouponManager;
