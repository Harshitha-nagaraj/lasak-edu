
import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useUserRole } from '../../hooks/useUserRole';

const PolicyContentManager = () => {
    const { canEdit } = useUserRole();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'terms' | 'refund' | 'privacy' | 'cancellation'>('terms');

    const [content, setContent] = useState({
        terms: '',
        refund: '',
        privacy: '',
        cancellation: ''
    });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, getDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const keys = ['terms_conditions_content', 'refund_policy_content', 'privacy_policy_content', 'cancellation_policy_content'];

            const results: any = {};
            for (const key of keys) {
                const docSnap = await getDoc(doc(db, 'site_settings', key));
                if (docSnap.exists()) {
                    results[key] = docSnap.data().value?.content || '';
                }
            }

            setContent({
                terms: results['terms_conditions_content'] || '',
                refund: results['refund_policy_content'] || '',
                privacy: results['privacy_policy_content'] || '',
                cancellation: results['cancellation_policy_content'] || ''
            });
        } catch (error: any) {
            console.error('Error fetching policy content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            let key = '';
            let textContent = '';
            let label = '';

            if (activeTab === 'terms') {
                key = 'terms_conditions_content';
                textContent = content.terms;
                label = 'Terms & Conditions';
            } else if (activeTab === 'refund') {
                key = 'refund_policy_content';
                textContent = content.refund;
                label = 'Refund Policy';
            } else if (activeTab === 'cancellation') {
                key = 'cancellation_policy_content';
                textContent = content.cancellation;
                label = 'Cancellation Policy';
            } else {
                key = 'privacy_policy_content';
                textContent = content.privacy;
                label = 'Privacy Policy';
            }

            await setDoc(doc(db, 'site_settings', key), {
                key,
                value: { content: textContent },
                category: 'policy_content',
                updated_at: serverTimestamp()
            });

            alert(`${label} saved successfully!`);
        } catch (error: any) {
            console.error('Error saving content:', error);
            alert('Error saving content: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Policy Content Editor</h1>
            <p className="text-gray-600 mb-8">Edit the content for Terms & Conditions and Refund Policy pages.</p>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('terms')}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'terms' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Terms & Conditions
                </button>
                <button
                    onClick={() => setActiveTab('refund')}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'refund' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Refund Policy
                </button>
                <button
                    onClick={() => setActiveTab('privacy')}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'privacy' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Privacy Policy
                </button>
                <button
                    onClick={() => setActiveTab('cancellation')}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'cancellation' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Cancellation Policy
                </button>
            </div>

            {/* Editor */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {activeTab === 'terms' ? 'Terms & Conditions Content' : activeTab === 'refund' ? 'Refund Policy Content' : activeTab === 'cancellation' ? 'Cancellation Policy Content' : 'Privacy Policy Content'}
                    </h2>
                    {canEdit && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                        >
                            <Save size={20} />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    )}
                </div>

                <div className="relative">
                    <p className="text-xs text-gray-500 mb-2">
                        You can use HTML tags (&lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;) for formatting.
                    </p>
                    <textarea
                        readOnly={!canEdit}
                        value={activeTab === 'terms' ? content.terms : activeTab === 'refund' ? content.refund : activeTab === 'cancellation' ? content.cancellation : content.privacy}
                        onChange={(e) => setContent(prev => ({ ...prev, [activeTab]: e.target.value }))}
                        rows={25}
                        className={`w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm leading-relaxed ${!canEdit ? 'bg-gray-50 text-gray-500' : ''}`}
                        placeholder="Enter HTML content here..."
                    />
                </div>
            </div>
        </div>
    );
};

export default PolicyContentManager;
