import React, { useState, useEffect } from 'react';
import { useUserRole } from '../../hooks/useUserRole';
import { Save, Plus, Trash2, ExternalLink, GripVertical, X } from 'lucide-react';

interface NavMenuItem {
    label: string;
    path: string;
    external?: boolean;
    submenu?: { label: string; path: string }[];
}

interface SiteSettings {
    nav_menu: {
        items: NavMenuItem[];
    };
    footer_text: {
        copyright: string;
        tagline: string;
    };
}

const SiteSettingsManager = () => {
    const { canEdit } = useUserRole();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'header' | 'quick_links' | 'departments' | 'policy_links' | 'contact_form' | 'contact_page'>('header');

    // Menus
    const [menuLinks, setMenuLinks] = useState<NavMenuItem[]>([]);
    const [quickLinks, setQuickLinks] = useState<NavMenuItem[]>([]);
    const [departments, setDepartments] = useState<NavMenuItem[]>([]);
    const [policyLinks, setPolicyLinks] = useState<NavMenuItem[]>([]);
    const [headerCTA, setHeaderCTA] = useState({ label: 'Enquiry now', path: 'https://forms.gle/6sVSvE1schYRYfse7', external: true });
    const [recCourseButton, setRecCourseButton] = useState({ label: 'REC Course', path: '', external: true, active: true });
    const [onlineCourseButton, setOnlineCourseButton] = useState({ label: 'Online Course', path: '', active: false, external: true });

    const [footerText, setFooterText] = useState({ copyright: '', tagline: '', logo: '' });

    // Contact Form Settings
    const [formSettings, setFormSettings] = useState<any>({
        url: '',
        title: '',
        departments: []
    });

    // Contact Page Text Settings
    const [contactPageSettings, setContactPageSettings] = useState({
        heroTitle: 'Get In Touch',
        heroSubtitle: "We'd love to hear from you. Visit our branches or drop us a message.",
        formTitle: 'Send Us a Message',
        formSubtitle: 'Have questions about our courses or placements? Reach out to us and our team will get back to you within 24 hours.'
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, query, where, getDocs } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const settingsQuery = query(
                collection(db, 'site_settings'),
                where('key', 'in', ['nav_menu', 'header_cta', 'rec_course_button', 'online_course_button', 'footer_quick_links', 'footer_departments', 'footer_policy_links', 'footer_text', 'contact_form_settings', 'contact_page_content'])
            );
            const querySnapshot = await getDocs(settingsQuery);
            const settings = querySnapshot.docs.map(doc => ({ key: doc.id, ...doc.data() } as any));

            if (settings) {
                const nav = settings.find(s => s.key === 'nav_menu');
                if (nav) setMenuLinks(nav.value.items || []);

                const cta = settings.find(s => s.key === 'header_cta');
                if (cta) setHeaderCTA(cta.value);

                const rec = settings.find(s => s.key === 'rec_course_button');
                if (rec) setRecCourseButton(rec.value);

                const online = settings.find(s => s.key === 'online_course_button');
                if (online) setOnlineCourseButton(online.value);

                const ql = settings.find(s => s.key === 'footer_quick_links');
                if (ql) setQuickLinks(ql.value.items || []);

                const dep = settings.find(s => s.key === 'footer_departments');
                if (dep) setDepartments(dep.value.items || []);

                const pol = settings.find(s => s.key === 'footer_policy_links');
                if (pol) setPolicyLinks(pol.value.items || []);

                const ft = settings.find(s => s.key === 'footer_text');
                if (ft) setFooterText(ft.value);

                const fms = settings.find(s => s.key === 'contact_form_settings');
                if (fms) setFormSettings(fms.value);

                const cp = settings.find(s => s.key === 'contact_page_content');
                if (cp) setContactPageSettings(cp.value);
            }
        } catch (error: any) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveMenu = async (key: string, items: NavMenuItem[], category: string) => {
        setSaving(true);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, setDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await setDoc(doc(db, 'site_settings', key), {
                key, // Ensure key is saved inside the document for safer fetching
                value: { items },
                category
            }, { merge: true });

            alert(`${category} saved successfully!`);
        } catch (error: any) {
            console.error(`Error saving ${key}:`, error);
            alert(`Error saving ${category}: ` + error.message);
        } finally {
            setSaving(false);
        }
    };

    const saveFooterText = async () => {
        setSaving(true);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, setDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await setDoc(doc(db, 'site_settings', 'footer_text'), {
                value: footerText,
                category: 'footer'
            }, { merge: true });

            alert('Footer text saved successfully!');
        } catch (error: any) {
            console.error('Error saving footer:', error);
            alert('Error saving footer: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const saveFormSettings = async () => {
        setSaving(true);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, setDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await setDoc(doc(db, 'site_settings', 'contact_form_settings'), {
                value: formSettings,
                category: 'contact'
            }, { merge: true });

            alert('Contact form settings saved successfully!');
        } catch (error: any) {
            console.error('Error saving contact form settings:', error);
            alert('Error saving contact form settings: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const saveContactPageSettings = async () => {
        setSaving(true);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, setDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await setDoc(doc(db, 'site_settings', 'contact_page_content'), {
                value: contactPageSettings,
                category: 'contact'
            }, { merge: true });

            alert('Contact page content saved successfully!');
        } catch (error: any) {
            console.error('Error saving contact page content:', error);
            alert('Error saving contact page content: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const saveHeaderCTA = async () => {
        setSaving(true);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, setDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await setDoc(doc(db, 'site_settings', 'header_cta'), {
                value: headerCTA,
                category: 'header'
            }, { merge: true });

            alert('Header CTA saved successfully!');
        } catch (error: any) {
            console.error('Error saving header CTA:', error);
            alert('Error saving header CTA: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const saveRecCourseButton = async () => {
        setSaving(true);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, setDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await setDoc(doc(db, 'site_settings', 'rec_course_button'), {
                value: recCourseButton,
                category: 'header'
            }, { merge: true });

            alert('REC Course button saved successfully!');
        } catch (error: any) {
            console.error('Error saving REC Course button:', error);
            alert('Error saving REC Course button: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const saveOnlineCourseButton = async () => {
        setSaving(true);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, setDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await setDoc(doc(db, 'site_settings', 'online_course_button'), {
                value: onlineCourseButton,
                category: 'floating'
            }, { merge: true });

            alert('Online Course floating button saved successfully!');
        } catch (error: any) {
            console.error('Error saving Online Course button:', error);
            alert('Error saving Online Course button: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    // Generic List Handlers
    const getCurrentLinks = () => {
        if (activeTab === 'header') return menuLinks;
        if (activeTab === 'quick_links') return quickLinks;
        if (activeTab === 'policy_links') return policyLinks;
        return departments;
    };

    const setLinks = (items: NavMenuItem[]) => {
        if (activeTab === 'header') setMenuLinks(items);
        else if (activeTab === 'quick_links') setQuickLinks(items);
        else if (activeTab === 'policy_links') setPolicyLinks(items);
        else setDepartments(items);
    };

    const addLink = () => {
        setLinks([...getCurrentLinks(), { label: 'New Link', path: '/', external: false }]);
    };

    const removeLink = (index: number) => {
        setLinks(getCurrentLinks().filter((_, i) => i !== index));
    };

    const updateLink = (index: number, field: keyof NavMenuItem, value: any) => {
        const list = [...getCurrentLinks()];
        list[index] = { ...list[index], [field]: value };
        setLinks(list);
    };

    const updateSubLink = (parentIndex: number, subIndex: number, field: 'label' | 'path', value: string) => {
        const list = [...getCurrentLinks()];
        const submenu = [...(list[parentIndex].submenu || [])];
        submenu[subIndex] = { ...submenu[subIndex], [field]: value };
        list[parentIndex] = { ...list[parentIndex], submenu };
        setLinks(list);
    };

    const addSubLink = (parentIndex: number) => {
        const list = [...getCurrentLinks()];
        const submenu = [...(list[parentIndex].submenu || []), { label: 'New Submenu Item', path: '/' }];
        list[parentIndex] = { ...list[parentIndex], submenu };
        setLinks(list);
    };

    const removeSubLink = (parentIndex: number, subIndex: number) => {
        const list = [...getCurrentLinks()];
        const submenu = (list[parentIndex].submenu || []).filter((_, i) => i !== subIndex);
        list[parentIndex] = { ...list[parentIndex], submenu: submenu.length > 0 ? submenu : undefined };
        setLinks(list);
    };

    const moveLink = (index: number, direction: 'up' | 'down') => {
        const list = [...getCurrentLinks()];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= list.length) return;
        [list[index], list[newIndex]] = [list[newIndex], list[index]];
        setLinks(list);
    };

    const handleSave = () => {
        if (activeTab === 'contact_form') {
            saveFormSettings();
            return;
        }

        if (activeTab === 'contact_page') {
            saveContactPageSettings();
            return;
        }

        if (activeTab === 'header') {
            saveMenu('nav_menu', menuLinks, 'navigation');
            saveHeaderCTA();
            saveRecCourseButton();
            saveOnlineCourseButton();
            return;
        }
        else if (activeTab === 'quick_links') saveMenu('footer_quick_links', quickLinks, 'footer');
        else if (activeTab === 'policy_links') saveMenu('footer_policy_links', policyLinks, 'footer');
        else saveMenu('footer_departments', departments, 'footer');
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading settings...</div>;
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Site Settings</h1>
            <p className="text-gray-600 mb-8">Manage global site configuration and menus</p>

            {/* Menu Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('header')}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'header' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Header Navigation
                </button>
                <button
                    onClick={() => setActiveTab('quick_links')}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'quick_links' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Footer: Quick Links
                </button>
                <button
                    onClick={() => setActiveTab('departments')}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'departments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Footer: Departments
                </button>
                <button
                    onClick={() => setActiveTab('policy_links')}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'policy_links' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Footer: Policy Links
                </button>
                <button
                    onClick={() => setActiveTab('contact_form')}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'contact_form' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Contact Form Settings
                </button>
                <button
                    onClick={() => setActiveTab('contact_page')}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'contact_page' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Contact Page Content
                </button>
            </div>

            {/* Content Area */}
            {activeTab === 'contact_page' ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Contact Page Text Content</h2>
                        {canEdit && (
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                            >
                                <Save size={20} />
                                {saving ? 'Saving...' : 'Save Content'}
                            </button>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title (Top Header)</label>
                            <input
                                disabled={!canEdit}
                                type="text"
                                value={contactPageSettings.heroTitle}
                                onChange={(e) => setContactPageSettings({ ...contactPageSettings, heroTitle: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                            <textarea
                                disabled={!canEdit}
                                value={contactPageSettings.heroSubtitle}
                                onChange={(e) => setContactPageSettings({ ...contactPageSettings, heroSubtitle: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                            />
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Form Section Header ("Send Us a Message")</label>
                            <input
                                disabled={!canEdit}
                                type="text"
                                value={contactPageSettings.formTitle}
                                onChange={(e) => setContactPageSettings({ ...contactPageSettings, formTitle: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Form Section Subtitle</label>
                            <textarea
                                disabled={!canEdit}
                                value={contactPageSettings.formSubtitle}
                                onChange={(e) => setContactPageSettings({ ...contactPageSettings, formSubtitle: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                            />
                        </div>
                    </div>
                </div>
            ) : activeTab === 'contact_form' ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Contact Form Settings</h2>
                        {canEdit && (
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                            >
                                <Save size={20} />
                                {saving ? 'Saving...' : 'Save Settings'}
                            </button>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Google Script Web App URL</label>
                            <input
                                disabled={!canEdit}
                                type="text"
                                value={formSettings.url}
                                onChange={(e) => setFormSettings({ ...formSettings, url: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm disabled:bg-gray-100 disabled:text-gray-500"
                                placeholder="https://script.google.com/..."
                            />
                            <p className="text-xs text-gray-500 mt-1">The destination URL for form submissions.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
                            <input
                                disabled={!canEdit}
                                type="text"
                                value={formSettings.title}
                                onChange={(e) => setFormSettings({ ...formSettings, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                                placeholder="e.g. Submit Your Details"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Departments (Comma Separated)</label>
                            <textarea
                                disabled={!canEdit}
                                value={formSettings.departments.join(', ')}
                                onChange={(e) => setFormSettings({ ...formSettings, departments: e.target.value.split(',').map(d => d.trim()).filter(Boolean) })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                                placeholder="Mechanical, Civil, CSE, IT..."
                            />
                            <p className="text-xs text-gray-500 mt-1">These options will appear in the 'Select Department' dropdown.</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {activeTab === 'header' ? 'Header Navigation' : activeTab === 'quick_links' ? 'Quick Links' : activeTab === 'policy_links' ? 'Policy Links' : 'Departments'}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Manage links for this section</p>
                        </div>
                        {canEdit && (
                            <button
                                onClick={addLink}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus size={18} />
                                Add Link
                            </button>
                        )}
                    </div>

                    <div className="space-y-3 mb-6">
                        {getCurrentLinks().map((item, index) => (
                            <div key={index} className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-3">
                                    {canEdit && (
                                        <div className="flex flex-col gap-1">
                                            <button onClick={() => moveLink(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30">▲</button>
                                            <GripVertical size={16} className="text-gray-400" />
                                            <button onClick={() => moveLink(index, 'down')} disabled={index === getCurrentLinks().length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-30">▼</button>
                                        </div>
                                    )}
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            disabled={!canEdit}
                                            type="text"
                                            value={item.label}
                                            onChange={(e) => updateLink(index, 'label', e.target.value)}
                                            placeholder="Label"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 font-semibold"
                                        />
                                        <input
                                            disabled={!canEdit}
                                            type="text"
                                            value={item.path}
                                            onChange={(e) => updateLink(index, 'path', e.target.value)}
                                            placeholder="/path or https://..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 whitespace-nowrap">
                                            <input
                                                disabled={!canEdit}
                                                type="checkbox"
                                                checked={item.external || false}
                                                onChange={(e) => updateLink(index, 'external', e.target.checked)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-600">External</span>
                                        </label>
                                        {canEdit && (
                                            <button onClick={() => removeLink(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                        )}
                                    </div>
                                </div>

                                {/* Submenu Section */}
                                {activeTab === 'header' && (
                                    <div className="ml-8 pl-4 border-l-2 border-blue-100 space-y-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Submenu Items</span>
                                            {canEdit && (
                                                <button
                                                    onClick={() => addSubLink(index)}
                                                    className="text-xs flex items-center gap-1 text-blue-600 hover:underline"
                                                >
                                                    <Plus size={12} /> Add Sub-item
                                                </button>
                                            )}
                                        </div>
                                        {(item.submenu || []).map((sub, sIdx) => (
                                            <div key={sIdx} className="flex items-center gap-2">
                                                <input
                                                    disabled={!canEdit}
                                                    type="text"
                                                    value={sub.label}
                                                    onChange={(e) => updateSubLink(index, sIdx, 'label', e.target.value)}
                                                    placeholder="Sub-label"
                                                    className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-400 disabled:bg-gray-50"
                                                />
                                                <input
                                                    disabled={!canEdit}
                                                    type="text"
                                                    value={sub.path}
                                                    onChange={(e) => updateSubLink(index, sIdx, 'path', e.target.value)}
                                                    placeholder="Sub-path"
                                                    className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-400 disabled:bg-gray-50"
                                                />
                                                {canEdit && (
                                                    <button onClick={() => removeSubLink(index, sIdx)} className="p-1 text-red-400 hover:text-red-600 transition-colors"><X size={14} /></button>
                                                )}
                                            </div>
                                        ))}
                                        {(!item.submenu || item.submenu.length === 0) && (
                                            <p className="text-xs text-gray-400 italic">No sub-items</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        {getCurrentLinks().length === 0 && <div className="text-center text-gray-400 italic">No links yet. Add one to get started.</div>}
                    </div>

                    {activeTab === 'header' && (
                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Header CTA Button (Enquiry now)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                                    <input
                                        type="text"
                                        value={headerCTA.label}
                                        onChange={(e) => setHeaderCTA({ ...headerCTA, label: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                                    <input
                                        type="text"
                                        value={headerCTA.path}
                                        onChange={(e) => setHeaderCTA({ ...headerCTA, path: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={headerCTA.external}
                                            onChange={(e) => setHeaderCTA({ ...headerCTA, external: e.target.checked })}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-600">Open in New Tab (External)</span>
                                    </label>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">REC Course Button</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-gray-200">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                                    <input
                                        type="text"
                                        value={recCourseButton.label}
                                        onChange={(e) => setRecCourseButton({ ...recCourseButton, label: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Link (External/Internal)</label>
                                    <input
                                        type="text"
                                        value={recCourseButton.path}
                                        onChange={(e) => setRecCourseButton({ ...recCourseButton, path: e.target.value })}
                                        placeholder="/path or https://... (Leave empty for 'Coming Soon')"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="md:col-span-2 flex gap-6">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={recCourseButton.external}
                                            onChange={(e) => setRecCourseButton({ ...recCourseButton, external: e.target.checked })}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-600">Open in New Tab</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={recCourseButton.active}
                                            onChange={(e) => setRecCourseButton({ ...recCourseButton, active: e.target.checked })}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-600">Show Button in Header</span>
                                    </label>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Online Course Floating Button</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-orange-50 p-4 rounded-xl border border-orange-200">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Label (Tooltip)</label>
                                    <input
                                        type="text"
                                        value={onlineCourseButton.label}
                                        onChange={(e) => setOnlineCourseButton({ ...onlineCourseButton, label: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                                    <input
                                        type="text"
                                        value={onlineCourseButton.path}
                                        onChange={(e) => setOnlineCourseButton({ ...onlineCourseButton, path: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div className="md:col-span-2 flex gap-6">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={onlineCourseButton.external}
                                            onChange={(e) => setOnlineCourseButton({ ...onlineCourseButton, external: e.target.checked })}
                                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-gray-600">Open in New Tab</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={onlineCourseButton.active}
                                            onChange={(e) => setOnlineCourseButton({ ...onlineCourseButton, active: e.target.checked })}
                                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-gray-600">Show Floating Button</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {canEdit && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                        >
                            <Save size={20} />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    )}
                </div>
            )
            }

            {/* Footer Text Section (Always Visible) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Footer Text Content</h2>
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
                        <input
                            disabled={!canEdit}
                            type="text"
                            value={footerText.copyright}
                            onChange={(e) => setFooterText({ ...footerText, copyright: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Footer Logo URL (Optional)</label>
                        <input
                            disabled={!canEdit}
                            type="text"
                            value={footerText.logo || ''}
                            onChange={(e) => setFooterText({ ...footerText, logo: e.target.value })}
                            placeholder="/img/logo.png or https://..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty to show "LASAK EDU" text.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                        <input
                            disabled={!canEdit}
                            type="text"
                            value={footerText.tagline}
                            onChange={(e) => setFooterText({ ...footerText, tagline: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                        />
                    </div>
                </div>
                {canEdit && (
                    <button onClick={saveFooterText} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"><Save size={20} />{saving ? 'Saving...' : 'Save Footer Text'}</button>
                )}
            </div>
        </div >
    );
};

export default SiteSettingsManager;
