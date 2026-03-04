import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Save, Plus, Trash2, Award, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PassportFeatures {
    price: string;
    features: string[];
}

interface PassportSettings {
    category: string;
    skills: PassportFeatures;
    interview: PassportFeatures;
    job: PassportFeatures;
}

const defaultFeatures = {
    skills: [
        "Comprehensive Curriculum",
        "Integrated Assessment Centre",
        "Faculty with 10+ years experience",
        "Premium Resume Builder",
        "Project Consultation & Feedback",
        "Weekend Doubt Clearing Sessions"
    ],
    interview: [
        "Access to Curated Job Portal",
        "LinkedIn Profile Review",
        "Mock Interviews with Experts",
        "Placement Prep with Mentor",
        "Secure Your Salary Protection",
        "Interview Guarantee (Min 3)"
    ],
    job: [
        "Communicative English Course",
        "Mentors from 250+ Industries",
        "Career Assessment & Counseling",
        "Placement Assistance (Lifetime)",
        "Job Guarantee (Dedicated Manager)"
    ]
};

const PassportManager = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('default');
    const [settings, setSettings] = useState<PassportSettings>({
        category: 'default',
        skills: { price: '0', features: [...defaultFeatures.skills] },
        interview: { price: '4000', features: [...defaultFeatures.interview] },
        job: { price: '9000', features: [...defaultFeatures.job] }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch available categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const catsSnapshot = await getDocs(collection(db, 'categories'));
                const catsList = catsSnapshot.docs.map(doc => doc.data().name);
                setCategories(['default', ...catsList]);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategories(['default', 'Mechanical', 'Civil', 'IT', 'ECE']); // Fallback
            }
        };
        fetchCategories();
    }, []);

    // Fetch settings for selected category
    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, 'passport_settings', selectedCategory);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setSettings(docSnap.data() as PassportSettings);
                } else {
                    // Load defaults if not found
                    setSettings({
                        category: selectedCategory,
                        skills: { price: '0', features: [...defaultFeatures.skills] },
                        interview: { price: '4000', features: [...defaultFeatures.interview] },
                        job: { price: '9000', features: [...defaultFeatures.job] }
                    });
                }
            } catch (error) {
                console.error("Error fetching passport settings:", error);
                toast.error("Failed to load settings.");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [selectedCategory]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'passport_settings', selectedCategory), {
                ...settings,
                updatedAt: new Date()
            });
            toast.success(`${selectedCategory} Passport settings saved successfully`);
        } catch (error) {
            console.error("Error saving passport settings:", error);
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const handlePriceChange = (type: 'skills' | 'interview' | 'job', value: string) => {
        setSettings(prev => ({
            ...prev,
            [type]: { ...prev[type], price: value }
        }));
    };

    const handleFeatureChange = (type: 'skills' | 'interview' | 'job', index: number, value: string) => {
        setSettings(prev => {
            const newFeatures = [...prev[type].features];
            newFeatures[index] = value;
            return {
                ...prev,
                [type]: { ...prev[type], features: newFeatures }
            };
        });
    };

    const addFeature = (type: 'skills' | 'interview' | 'job') => {
        setSettings(prev => ({
            ...prev,
            [type]: { ...prev[type], features: [...prev[type].features, ""] }
        }));
    };

    const removeFeature = (type: 'skills' | 'interview' | 'job', index: number) => {
        setSettings(prev => {
            const newFeatures = [...prev[type].features];
            newFeatures.splice(index, 1);
            return {
                ...prev,
                [type]: { ...prev[type], features: newFeatures }
            };
        });
    };

    if (loading && categories.length === 0) return <div className="p-8"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <Award className="text-blue-600" size={32} />
                        Passport Settings
                    </h1>
                    <p className="text-slate-500 mt-2">Manage pricing and features for each passport tier across different categories.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
                <label className="block text-sm font-bold text-slate-700 mb-2">Select Course Category</label>
                <div className="relative max-w-md">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none appearance-none font-medium text-slate-800"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat === 'default' ? 'Default (Fallback)' : cat}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                </div>
                <p className="text-xs text-slate-500 mt-2">Any course belonging to this category will automatically fetch these passport values.</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Career Skill Builder */}
                    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 flex flex-col">
                        <div className="mb-6 pb-4 border-b border-slate-100">
                            <h3 className="text-xl font-black text-slate-800 mb-4">Career Skill Builder</h3>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Upgrade Price (₹)</label>
                            <input
                                type="number"
                                value={settings.skills.price}
                                onChange={(e) => handlePriceChange('skills', e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
                                placeholder="e.g. 0 for Included"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-sm font-bold text-slate-700">Features</label>
                                <button onClick={() => addFeature('skills')} className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1">
                                    <Plus size={16} /> Add
                                </button>
                            </div>
                            <div className="space-y-3">
                                {settings.skills.features.map((feature, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => handleFeatureChange('skills', idx, e.target.value)}
                                            className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                                        />
                                        <button onClick={() => removeFeature('skills', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Interview Success Track */}
                    <div className="bg-white rounded-2xl shadow-sm border border-cyan-100 p-6 flex flex-col">
                        <div className="mb-6 pb-4 border-b border-slate-100">
                            <h3 className="text-xl font-black text-slate-800 mb-4">Interview Success Track</h3>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Upgrade Price (₹)</label>
                            <input
                                type="number"
                                value={settings.interview.price}
                                onChange={(e) => handlePriceChange('interview', e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 outline-none"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-sm font-bold text-slate-700">Additional Features</label>
                                <button onClick={() => addFeature('interview')} className="text-cyan-600 hover:text-cyan-800 text-sm font-bold flex items-center gap-1">
                                    <Plus size={16} /> Add
                                </button>
                            </div>
                            <div className="space-y-3">
                                {settings.interview.features.map((feature, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => handleFeatureChange('interview', idx, e.target.value)}
                                            className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                                        />
                                        <button onClick={() => removeFeature('interview', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Job Secure Track */}
                    <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6 flex flex-col">
                        <div className="mb-6 pb-4 border-b border-slate-100">
                            <h3 className="text-xl font-black text-slate-800 mb-4">Job Secure Track</h3>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Upgrade Price (₹)</label>
                            <input
                                type="number"
                                value={settings.job.price}
                                onChange={(e) => handlePriceChange('job', e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-600/20 focus:border-rose-600 outline-none"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-sm font-bold text-slate-700">Additional Features</label>
                                <button onClick={() => addFeature('job')} className="text-rose-600 hover:text-rose-800 text-sm font-bold flex items-center gap-1">
                                    <Plus size={16} /> Add
                                </button>
                            </div>
                            <div className="space-y-3">
                                {settings.job.features.map((feature, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => handleFeatureChange('job', idx, e.target.value)}
                                            className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                                        />
                                        <button onClick={() => removeFeature('job', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PassportManager;
