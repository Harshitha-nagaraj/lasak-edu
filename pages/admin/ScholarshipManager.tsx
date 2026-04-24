import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Plus, Edit2, Trash2, Save, X, ToggleLeft, ToggleRight, ArrowUp, ArrowDown, Filter, Tag, Copy } from 'lucide-react';


// Available categories
const CATEGORIES = ['All', 'IT', 'Mechanical', 'Civil', 'Arts', 'Kids'];

interface ScholarshipRule {
    id: string;
    name: string;
    min_percentage: number;
    max_percentage: number;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    is_active: boolean;
    priority: number;
    category: string;
    save_rule: string;
}

interface ScholarshipSettings {
    id: string;
    modal_title: string;
    modal_description: string;
    success_title: string;
    success_description: string;
    success_next_step_header: string;
    success_next_step_phone: string;
    success_next_step_text: string;
    success_important_header: string;
    success_important_text: string;
    success_note_header: string;
    success_note_text: string;
    failure_title: string;
    failure_header: string;
    failure_body: string;
    failure_phone: string;
    failure_button_text: string;
}

interface CouponCode {
    id: string;
    code: string;
    description: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    is_active: boolean;
    usage_limit: number | null;
    usage_count: number;
    expires_at: string | null;
    created_at: string;
}

const DEFAULT_COUPON: Omit<CouponCode, 'id' | 'usage_count' | 'created_at'> = {
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 10,
    is_active: true,
    usage_limit: null,
    expires_at: null
};

const DEFAULT_RULE: Omit<ScholarshipRule, 'id'> = {
    name: '',
    min_percentage: 0,
    max_percentage: 100,
    discount_type: 'percentage',
    discount_value: 10,
    is_active: true,
    priority: 1,
    category: 'All',
    save_rule: ''
};

const ScholarshipManager: React.FC = () => {
    const [rules, setRules] = useState<ScholarshipRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingRule, setEditingRule] = useState<ScholarshipRule | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newRule, setNewRule] = useState<Omit<ScholarshipRule, 'id'>>(DEFAULT_RULE);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [filterCategory, setFilterCategory] = useState<string>('All');
    const [activeTab, setActiveTab] = useState<'rules' | 'settings' | 'coupons'>('rules');
    const [settings, setSettings] = useState<ScholarshipSettings | null>(null);
    const [settingsLoading, setSettingsLoading] = useState(false);

    // Coupon state
    const [coupons, setCoupons] = useState<CouponCode[]>([]);
    const [couponsLoading, setCouponsLoading] = useState(false);
    const [isAddingCoupon, setIsAddingCoupon] = useState(false);
    const [newCoupon, setNewCoupon] = useState<Omit<CouponCode, 'id' | 'usage_count' | 'created_at'>>(DEFAULT_COUPON);
    const [editingCoupon, setEditingCoupon] = useState<CouponCode | null>(null);

    useEffect(() => {
        fetchRules();
        fetchSettings();
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setCouponsLoading(true);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, getDocs } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const couponsSnapshot = await getDocs(collection(db, 'coupon_codes'));
            const data = couponsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CouponCode));
            data.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
            setCoupons(data || []);
        } catch (err) {
            console.error('Error fetching coupons:', err);
        } finally {
            setCouponsLoading(false);
        }
    };

    const handleAddCoupon = async () => {
        if (!newCoupon.code.trim()) { showMessage('error', 'Please enter a coupon code'); return; }
        if (newCoupon.discount_value <= 0) { showMessage('error', 'Discount value must be greater than 0'); return; }
        setSaving(true);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, addDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const couponData = {
                ...newCoupon,
                code: newCoupon.code.trim().toUpperCase(),
                usage_count: 0,
                created_at: new Date().toISOString()
            };
            await addDoc(collection(db, 'coupon_codes'), couponData);
            showMessage('success', 'Coupon code added!');
            setNewCoupon(DEFAULT_COUPON);
            setIsAddingCoupon(false);
            fetchCoupons();
        } catch (err: any) {
            showMessage('error', 'Failed to add coupon.');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateCoupon = async () => {
        if (!editingCoupon) return;
        setSaving(true);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, updateDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await updateDoc(doc(db, 'coupon_codes', editingCoupon.id), {
                code: editingCoupon.code.trim().toUpperCase(),
                description: editingCoupon.description,
                discount_type: editingCoupon.discount_type,
                discount_value: editingCoupon.discount_value,
                is_active: editingCoupon.is_active,
                usage_limit: editingCoupon.usage_limit,
                expires_at: editingCoupon.expires_at || null
            });
            showMessage('success', 'Coupon updated!');
            setEditingCoupon(null);
            fetchCoupons();
        } catch (err) {
            showMessage('error', 'Failed to update coupon.');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleCoupon = async (coupon: CouponCode) => {
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, updateDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await updateDoc(doc(db, 'coupon_codes', coupon.id), { is_active: !coupon.is_active });
            fetchCoupons();
        } catch (err) {
            showMessage('error', 'Failed to toggle coupon status.');
        }
    };

    const handleDeleteCoupon = async (id: string) => {
        if (!window.confirm('Delete this coupon code permanently?')) return;
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, deleteDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await deleteDoc(doc(db, 'coupon_codes', id));
            showMessage('success', 'Coupon deleted.');
            fetchCoupons();
        } catch (err) {
            showMessage('error', 'Failed to delete coupon.');
        }
    };

    const fetchSettings = async () => {
        setSettingsLoading(true);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, query, limit, getDocs, doc, setDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const settingsSnapshot = await getDocs(query(collection(db, 'scholarship_settings'), limit(1)));
            if (!settingsSnapshot.empty) {
                const docSnap = settingsSnapshot.docs[0];
                setSettings({ id: docSnap.id, ...docSnap.data() } as ScholarshipSettings);
            } else {
                // Create default settings document so the form renders with content
                const defaults: Omit<ScholarshipSettings, 'id'> = {
                    modal_title: 'Scholarship Calculator',
                    modal_description: 'Check your eligibility based on academic performance',
                    success_title: '🎉 Congratulations! Your Scholarship Is Approved 🎉',
                    success_description: 'Based on the eligibility details you have provided, your scholarship has been provisionally approved.',
                    success_next_step_header: 'Next Step:',
                    success_next_step_phone: '7418734466',
                    success_next_step_text: 'Kindly contact us at',
                    success_important_header: 'Important:',
                    success_important_text: 'Please take a screenshot of this message to claim your scholarship.',
                    success_note_header: 'Note:',
                    success_note_text: 'All details will be re-verified by our executive. The scholarship is subject to document verification at the time of admission. This is a provisional approval only.',
                    failure_title: 'Scholarship Eligibility Update',
                    failure_header: 'Contact for Information',
                    failure_body: 'We recommend you contact our admission counselor for further information.',
                    failure_phone: '+91 74187 34466',
                    failure_button_text: 'Close',
                };
                const newDocRef = doc(collection(db, 'scholarship_settings'));
                await setDoc(newDocRef, defaults);
                setSettings({ id: newDocRef.id, ...defaults });
                console.log('Created default scholarship_settings document');
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
        } finally {
            setSettingsLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        if (!settings) return;
        setSaving(true);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, updateDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await updateDoc(doc(db, 'scholarship_settings', settings.id), settings as any);
            showMessage('success', 'Popup settings saved successfully');
        } catch (err) {
            console.error('Error saving settings:', err);
            showMessage('error', 'Failed to save popup settings');
        } finally {
            setSaving(false);
        }
    };

    const fetchRules = async () => {
        setLoading(true);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, getDocs } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const rulesRef = collection(db, 'scholarship_rules');
            const querySnapshot = await getDocs(rulesRef);
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScholarshipRule));
            // Sort in memory: by category first, then by priority
            data.sort((a, b) => {
                if (a.category < b.category) return -1;
                if (a.category > b.category) return 1;
                return (a.priority || 0) - (b.priority || 0);
            });
            setRules(data || []);
        } catch (err) {
            console.error('Error fetching rules:', err);
            showMessage('error', 'Failed to load scholarship rules');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleAddRule = async () => {
        if (!newRule.name.trim()) {
            showMessage('error', 'Please enter a rule name');
            return;
        }

        setSaving(true);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, addDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            // Get max priority for this category
            const categoryRules = rules.filter(r => r.category === newRule.category);
            const maxPriority = categoryRules.length > 0
                ? Math.max(...categoryRules.map(r => r.priority)) + 1
                : 1;

            await addDoc(collection(db, 'scholarship_rules'), { ...newRule, priority: maxPriority });

            showMessage('success', 'Scholarship rule added successfully');
            setNewRule(DEFAULT_RULE);
            setIsAdding(false);
            fetchRules();
        } catch (err) {
            console.error('Error adding rule:', err);
            showMessage('error', 'Failed to add scholarship rule');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateRule = async () => {
        if (!editingRule) return;

        setSaving(true);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, updateDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await updateDoc(doc(db, 'scholarship_rules', editingRule.id), {
                name: editingRule.name,
                min_percentage: editingRule.min_percentage,
                max_percentage: editingRule.max_percentage,
                discount_type: editingRule.discount_type,
                discount_value: editingRule.discount_value,
                is_active: editingRule.is_active,
                priority: editingRule.priority,
                category: editingRule.category
            });

            showMessage('success', 'Rule updated successfully');
            setEditingRule(null);
            fetchRules();
        } catch (err) {
            console.error('Error updating rule:', err);
            showMessage('error', 'Failed to update rule');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteRule = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this scholarship rule?')) return;

        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, deleteDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await deleteDoc(doc(db, 'scholarship_rules', id));
            showMessage('success', 'Rule deleted successfully');
            fetchRules();
        } catch (err) {
            console.error('Error deleting rule:', err);
            showMessage('error', 'Failed to delete rule');
        }
    };

    const handleToggleActive = async (rule: ScholarshipRule) => {
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, updateDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await updateDoc(doc(db, 'scholarship_rules', rule.id), { is_active: !rule.is_active });
            fetchRules();
        } catch (err) {
            console.error('Error toggling rule:', err);
            showMessage('error', 'Failed to update rule status');
        }
    };

    const handleMovePriority = async (rule: ScholarshipRule, direction: 'up' | 'down') => {
        const categoryRules = rules.filter(r => r.category === rule.category);
        const currentIndex = categoryRules.findIndex(r => r.id === rule.id);
        const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (swapIndex < 0 || swapIndex >= categoryRules.length) return;

        const swapRule = categoryRules[swapIndex];

        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, updateDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await updateDoc(doc(db, 'scholarship_rules', rule.id), { priority: swapRule.priority });
            await updateDoc(doc(db, 'scholarship_rules', swapRule.id), { priority: rule.priority });
            fetchRules();
        } catch (err) {
            console.error('Error reordering rules:', err);
        }
    };

    const handleSeedCategoryRules = async (category: string) => {
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, addDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const defaultRules = [
                { name: `${category} - Distinction Excellence`, min_percentage: 90, max_percentage: 100, discount_type: 'percentage', discount_value: 30, is_active: true, priority: 1, category },
                { name: `${category} - First Class Merit`, min_percentage: 75, max_percentage: 89, discount_type: 'percentage', discount_value: 20, is_active: true, priority: 2, category },
                { name: `${category} - Second Class Achievement`, min_percentage: 60, max_percentage: 74, discount_type: 'percentage', discount_value: 10, is_active: true, priority: 3, category },
                { name: `${category} - Encouragement Grant`, min_percentage: 50, max_percentage: 59, discount_type: 'fixed', discount_value: 1000, is_active: true, priority: 4, category },
            ];
            for (const rule of defaultRules) {
                await addDoc(collection(db, 'scholarship_rules'), rule);
            }
            showMessage('success', `Default rules added for ${category}!`);
            fetchRules();
        } catch (err) {
            showMessage('error', 'Failed to add default rules');
        }
    };

    // Filter rules by selected category
    const filteredRules = filterCategory === 'All'
        ? rules
        : rules.filter(r => r.category === filterCategory || r.category === 'All');

    // Group rules by category for display
    const groupedRules = CATEGORIES.reduce((acc, cat) => {
        acc[cat] = rules.filter(r => r.category === cat);
        return acc;
    }, {} as Record<string, ScholarshipRule[]>);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-xl">
                        <GraduationCap className="text-purple-600 w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Scholarship Manager</h2>
                        <p className="text-slate-500 text-sm">Manage category-specific scholarship rules</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Category Filter */}
                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
                        <Filter size={16} className="text-slate-500" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none"
                        >
                            <option value="All">All Categories</option>
                            {CATEGORIES.filter(c => c !== 'All').map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                        <Plus size={18} />
                        Add Rule
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 gap-1">
                <button
                    onClick={() => setActiveTab('rules')}
                    className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'rules' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500'}`}
                >
                    Scholarship Rules
                </button>
                <button
                    onClick={() => setActiveTab('coupons')}
                    className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'coupons' ? 'border-green-600 text-green-600' : 'border-transparent text-slate-500'}`}
                >
                    <Tag size={14} /> Coupon Codes
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'settings' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500'}`}
                >
                    Popup Settings
                </button>
            </div>

            {/* Message Banner */}
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                    {message.text}
                </motion.div>
            )}

            {activeTab === 'coupons' ? (
                <div className="space-y-6">
                    {/* Add Coupon Button */}
                    <div className="flex justify-between items-center">
                        <p className="text-slate-500 text-sm">{coupons.length} coupon code{coupons.length !== 1 ? 's' : ''} in database</p>
                        <button
                            onClick={() => setIsAddingCoupon(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                        >
                            <Plus size={16} /> Add Coupon
                        </button>
                    </div>

                    {/* Add Coupon Form */}
                    {isAddingCoupon && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-4"
                        >
                            <h3 className="font-bold text-green-800">New Coupon Code</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Code *</label>
                                    <input type="text" value={newCoupon.code}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                        placeholder="e.g. LASAK50"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg uppercase font-mono focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Discount Type</label>
                                    <select value={newCoupon.discount_type}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, discount_type: e.target.value as 'percentage' | 'fixed' })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Discount Value {newCoupon.discount_type === 'percentage' ? '(%)' : '(₹)'}
                                    </label>
                                    <input type="number" value={newCoupon.discount_value} min="0"
                                        onChange={(e) => setNewCoupon({ ...newCoupon, discount_value: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description (optional)</label>
                                    <input type="text" value={newCoupon.description}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                                        placeholder="e.g. Diwali Special 50% off"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Usage Limit (blank = unlimited)</label>
                                    <input type="number" value={newCoupon.usage_limit ?? ''} min="1"
                                        onChange={(e) => setNewCoupon({ ...newCoupon, usage_limit: e.target.value ? parseInt(e.target.value) : null })}
                                        placeholder="Unlimited"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date (blank = never)</label>
                                    <input type="datetime-local"
                                        value={newCoupon.expires_at ? newCoupon.expires_at.slice(0, 16) : ''}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, expires_at: e.target.value || null })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleAddCoupon} disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                                ><Save size={16} />{saving ? 'Saving...' : 'Save Coupon'}</button>
                                <button onClick={() => { setIsAddingCoupon(false); setNewCoupon(DEFAULT_COUPON); }}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200"
                                ><X size={16} />Cancel</button>
                            </div>
                        </motion.div>
                    )}

                    {/* Coupons Table */}
                    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                        {couponsLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : coupons.length === 0 ? (
                            <div className="text-center py-12 text-slate-600">
                                <Tag size={40} className="mx-auto mb-2 opacity-30" />
                                <p>No coupon codes yet. Click "Add Coupon" to create one.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Code</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Description</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Discount</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Usage</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Expiry</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {coupons.map((coupon) => (
                                            <tr key={coupon.id} className="border-b border-slate-50 hover:bg-slate-50">
                                                <td className="px-4 py-3">
                                                    {editingCoupon?.id === coupon.id ? (
                                                        <input type="text" value={editingCoupon.code}
                                                            onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                                                            className="px-2 py-1 border border-slate-200 rounded text-sm font-mono uppercase w-28"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded text-sm">{coupon.code}</span>
                                                            <button onClick={() => navigator.clipboard.writeText(coupon.code)}
                                                                className="text-slate-300 hover:text-slate-500"
                                                                title="Copy code"
                                                            ><Copy size={12} /></button>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-600 max-w-[150px]">
                                                    {editingCoupon?.id === coupon.id ? (
                                                        <input type="text" value={editingCoupon.description}
                                                            onChange={(e) => setEditingCoupon({ ...editingCoupon, description: e.target.value })}
                                                            className="px-2 py-1 border border-slate-200 rounded text-sm w-full"
                                                        />
                                                    ) : coupon.description || <span className="text-slate-300 italic">—</span>}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {editingCoupon?.id === coupon.id ? (
                                                        <div className="flex gap-1">
                                                            <select value={editingCoupon.discount_type}
                                                                onChange={(e) => setEditingCoupon({ ...editingCoupon, discount_type: e.target.value as 'percentage' | 'fixed' })}
                                                                className="px-1 py-1 border border-slate-200 rounded text-xs"
                                                            >
                                                                <option value="percentage">%</option>
                                                                <option value="fixed">₹</option>
                                                            </select>
                                                            <input type="number" value={editingCoupon.discount_value}
                                                                onChange={(e) => setEditingCoupon({ ...editingCoupon, discount_value: parseFloat(e.target.value) || 0 })}
                                                                className="w-16 px-1 py-1 border border-slate-200 rounded text-sm"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className="font-bold text-purple-700 text-sm">
                                                            {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`} OFF
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-500">
                                                    {editingCoupon?.id === coupon.id ? (
                                                        <input type="number" value={editingCoupon.usage_limit ?? ''} min="1"
                                                            onChange={(e) => setEditingCoupon({ ...editingCoupon, usage_limit: e.target.value ? parseInt(e.target.value) : null })}
                                                            placeholder="∞"
                                                            className="w-16 px-1 py-1 border border-slate-200 rounded text-sm"
                                                        />
                                                    ) : (
                                                        <span>{coupon.usage_count} / {coupon.usage_limit ?? '∞'}</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-slate-500">
                                                    {editingCoupon?.id === coupon.id ? (
                                                        <input type="datetime-local"
                                                            value={editingCoupon.expires_at ? editingCoupon.expires_at.slice(0, 16) : ''}
                                                            onChange={(e) => setEditingCoupon({ ...editingCoupon, expires_at: e.target.value || null })}
                                                            className="px-1 py-1 border border-slate-200 rounded text-xs"
                                                        />
                                                    ) : coupon.expires_at ? (
                                                        <span className={new Date(coupon.expires_at) < new Date() ? 'text-red-500 font-medium' : ''}>
                                                            {new Date(coupon.expires_at).toLocaleDateString('en-IN')}
                                                        </span>
                                                    ) : <span className="text-slate-300">Never</span>}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button onClick={() => handleToggleCoupon(coupon)}
                                                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}
                                                    >
                                                        {coupon.is_active ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                                                        {coupon.is_active ? 'Active' : 'Off'}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {editingCoupon?.id === coupon.id ? (
                                                            <>
                                                                <button onClick={handleUpdateCoupon} disabled={saving}
                                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                                ><Save size={14} /></button>
                                                                <button onClick={() => setEditingCoupon(null)}
                                                                    className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"
                                                                ><X size={14} /></button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button onClick={() => setEditingCoupon(coupon)}
                                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                                ><Edit2 size={14} /></button>
                                                                <button onClick={() => handleDeleteCoupon(coupon.id)}
                                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                                ><Trash2 size={14} /></button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            ) : activeTab === 'rules' ? (
                <>
                    {/* Add New Rule Form */}
                    {isAdding && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl p-6 shadow-lg border border-purple-200"
                        >
                            <h3 className="font-bold text-slate-800 mb-4">Add New Scholarship Rule</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                    <select
                                        value={newRule.category}
                                        onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Rule Name</label>
                                    <input
                                        type="text"
                                        value={newRule.name}
                                        onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                                        placeholder="e.g., Distinction Excellence"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Min %</label>
                                    <input
                                        type="number"
                                        value={newRule.min_percentage}
                                        onChange={(e) => setNewRule({ ...newRule, min_percentage: parseInt(e.target.value) || 0 })}
                                        min="0"
                                        max="100"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Max %</label>
                                    <input
                                        type="number"
                                        value={newRule.max_percentage}
                                        onChange={(e) => setNewRule({ ...newRule, max_percentage: parseInt(e.target.value) || 100 })}
                                        min="0"
                                        max="100"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Discount Type</label>
                                    <select
                                        value={newRule.discount_type}
                                        onChange={(e) => setNewRule({ ...newRule, discount_type: e.target.value as 'percentage' | 'fixed' })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Discount Value {newRule.discount_type === 'percentage' ? '(%)' : '(₹)'}
                                    </label>
                                    <input
                                        type="number"
                                        value={newRule.discount_value}
                                        onChange={(e) => setNewRule({ ...newRule, discount_value: parseFloat(e.target.value) || 0 })}
                                        min="0"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={handleAddRule}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    {saving ? 'Saving...' : 'Save Rule'}
                                </button>
                                <button
                                    onClick={() => { setIsAdding(false); setNewRule(DEFAULT_RULE); }}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200"
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Rules by Category */}
                    {CATEGORIES.map(category => {
                        const categoryRules = groupedRules[category] || [];
                        const isFiltered = filterCategory !== 'All' && filterCategory !== category;

                        if (isFiltered) return null; // Hide categories that don't match filter

                        return (
                            <div key={category} className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                                {/* Category Header */}
                                <div className={`px-6 py-4 border-b ${category === 'All' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' :
                                    category === 'IT' ? 'bg-blue-50 text-blue-800' :
                                        category === 'Mechanical' ? 'bg-orange-50 text-orange-800' :
                                            category === 'Civil' ? 'bg-gray-50 text-gray-800' :
                                                category === 'Arts' ? 'bg-pink-50 text-pink-800' :
                                                    'bg-yellow-50 text-yellow-800'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg">{category === 'All' ? 'Global Rules (Apply to All)' : `${category} Category`}</h3>
                                            <p className={`text-sm ${category === 'All' ? 'text-purple-100' : 'opacity-70'}`}>
                                                {categoryRules.length} rule{categoryRules.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        {categoryRules.length === 0 && (
                                            <button
                                                onClick={() => handleSeedCategoryRules(category)}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${category === 'All' ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-white hover:bg-slate-50 text-slate-700 border'
                                                    }`}
                                            >
                                                Add Default Rules
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Rules Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Priority</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Rule Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">% Range</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Discount</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
                                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categoryRules.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-600">
                                                        No rules for this category. Click "Add Default Rules" or create custom ones.
                                                    </td>
                                                </tr>
                                            ) : (
                                                categoryRules.map((rule, index) => (
                                                    <tr key={rule.id} className="border-b border-slate-50 hover:bg-slate-50">
                                                        <td className="px-6 py-3">
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={() => handleMovePriority(rule, 'up')}
                                                                    disabled={index === 0}
                                                                    className="p-1 text-slate-600 hover:text-slate-600 disabled:opacity-30"
                                                                >
                                                                    <ArrowUp size={14} />
                                                                </button>
                                                                <span className="font-medium text-slate-600 text-sm">{rule.priority}</span>
                                                                <button
                                                                    onClick={() => handleMovePriority(rule, 'down')}
                                                                    disabled={index === categoryRules.length - 1}
                                                                    className="p-1 text-slate-600 hover:text-slate-600 disabled:opacity-30"
                                                                >
                                                                    <ArrowDown size={14} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-3">
                                                            {editingRule?.id === rule.id ? (
                                                                <input
                                                                    type="text"
                                                                    value={editingRule.name}
                                                                    onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                                                                    className="px-2 py-1 border border-slate-200 rounded text-sm w-full"
                                                                />
                                                            ) : (
                                                                <span className="font-medium text-slate-700 text-sm">{rule.name}</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-3">
                                                            {editingRule?.id === rule.id ? (
                                                                <div className="flex items-center gap-1">
                                                                    <input
                                                                        type="number"
                                                                        value={editingRule.min_percentage}
                                                                        onChange={(e) => setEditingRule({ ...editingRule, min_percentage: parseInt(e.target.value) || 0 })}
                                                                        className="w-14 px-1 py-1 border border-slate-200 rounded text-sm"
                                                                    />
                                                                    <span>-</span>
                                                                    <input
                                                                        type="number"
                                                                        value={editingRule.max_percentage}
                                                                        onChange={(e) => setEditingRule({ ...editingRule, max_percentage: parseInt(e.target.value) || 100 })}
                                                                        className="w-14 px-1 py-1 border border-slate-200 rounded text-sm"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <span className="text-slate-600 text-sm">{rule.min_percentage}% - {rule.max_percentage}%</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-3">
                                                            {editingRule?.id === rule.id ? (
                                                                <div className="flex items-center gap-1">
                                                                    <select
                                                                        value={editingRule.discount_type}
                                                                        onChange={(e) => setEditingRule({ ...editingRule, discount_type: e.target.value as 'percentage' | 'fixed' })}
                                                                        className="px-1 py-1 border border-slate-200 rounded text-sm"
                                                                    >
                                                                        <option value="percentage">%</option>
                                                                        <option value="fixed">₹</option>
                                                                    </select>
                                                                    <input
                                                                        type="number"
                                                                        value={editingRule.discount_value}
                                                                        onChange={(e) => setEditingRule({ ...editingRule, discount_value: parseFloat(e.target.value) || 0 })}
                                                                        className="w-16 px-1 py-1 border border-slate-200 rounded text-sm"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <span className="font-bold text-purple-600 text-sm">
                                                                    {rule.discount_type === 'percentage' ? `${rule.discount_value}%` : `₹${rule.discount_value}`}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-3">
                                                            <button
                                                                onClick={() => handleToggleActive(rule)}
                                                                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${rule.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                                                                    }`}
                                                            >
                                                                {rule.is_active ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                                                                {rule.is_active ? 'Active' : 'Off'}
                                                            </button>
                                                        </td>
                                                        <td className="px-6 py-3">
                                                            <div className="flex items-center justify-end gap-1">
                                                                {editingRule?.id === rule.id ? (
                                                                    <>
                                                                        <button
                                                                            onClick={handleUpdateRule}
                                                                            disabled={saving}
                                                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                                        >
                                                                            <Save size={14} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setEditingRule(null)}
                                                                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"
                                                                        >
                                                                            <X size={14} />
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <button
                                                                            onClick={() => setEditingRule(rule)}
                                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                                        >
                                                                            <Edit2 size={14} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteRule(rule.id)}
                                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })}
                </>
            ) : (
                /* Popup Settings Tab */
                <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 space-y-8">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h3 className="text-lg font-bold text-slate-800">Global Popup Content</h3>
                        <button
                            onClick={handleSaveSettings}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>

                    {settings ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Main Modal */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-purple-600 flex items-center gap-2">
                                    <Edit2 size={16} /> Main Calculator Modal
                                </h4>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Modal Title</label>
                                    <input
                                        type="text"
                                        value={settings.modal_title}
                                        onChange={(e) => setSettings({ ...settings, modal_title: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Modal Description</label>
                                    <textarea
                                        value={settings.modal_description}
                                        onChange={(e) => setSettings({ ...settings, modal_description: e.target.value })}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            {/* Failure Popup */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-red-600 flex items-center gap-2">
                                    <ToggleLeft size={16} /> Eligibility Update (Failure)
                                </h4>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Popup Title</label>
                                    <input
                                        type="text"
                                        value={settings.failure_title}
                                        onChange={(e) => setSettings({ ...settings, failure_title: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Wait/Contact Phone</label>
                                    <input
                                        type="text"
                                        value={settings.failure_phone}
                                        onChange={(e) => setSettings({ ...settings, failure_phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Wait/Contact Body</label>
                                    <textarea
                                        value={settings.failure_body}
                                        onChange={(e) => setSettings({ ...settings, failure_body: e.target.value })}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                            </div>

                            {/* Success Popup */}
                            <div className="md:col-span-2 space-y-6 border-t pt-6">
                                <h4 className="font-bold text-green-600 flex items-center gap-2">
                                    <ToggleRight size={16} /> Approval Success Popup
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Success Title (🎉...🎉)</label>
                                        <input
                                            type="text"
                                            value={settings.success_title}
                                            onChange={(e) => setSettings({ ...settings, success_title: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Success Description</label>
                                        <textarea
                                            value={settings.success_description}
                                            onChange={(e) => setSettings({ ...settings, success_description: e.target.value })}
                                            rows={2}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Next Step Header</label>
                                        <input
                                            type="text"
                                            value={settings.success_next_step_header}
                                            onChange={(e) => setSettings({ ...settings, success_next_step_header: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Next Step Phone</label>
                                        <input
                                            type="text"
                                            value={settings.success_next_step_phone}
                                            onChange={(e) => setSettings({ ...settings, success_next_step_phone: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Next Step Text</label>
                                        <input
                                            type="text"
                                            value={settings.success_next_step_text}
                                            onChange={(e) => setSettings({ ...settings, success_next_step_text: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Important Header</label>
                                        <input
                                            type="text"
                                            value={settings.success_important_header}
                                            onChange={(e) => setSettings({ ...settings, success_important_header: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Important Body</label>
                                        <textarea
                                            value={settings.success_important_text}
                                            onChange={(e) => setSettings({ ...settings, success_important_text: e.target.value })}
                                            rows={2}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Note Header</label>
                                        <input
                                            type="text"
                                            value={settings.success_note_header}
                                            onChange={(e) => setSettings({ ...settings, success_note_header: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Note Body</label>
                                        <textarea
                                            value={settings.success_note_text}
                                            onChange={(e) => setSettings({ ...settings, success_note_text: e.target.value })}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            Loading settings...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ScholarshipManager;
