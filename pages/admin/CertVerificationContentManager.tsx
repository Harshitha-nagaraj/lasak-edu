import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff, Search, FileText, ShieldCheck, Award, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { db, storage } from '../../lib/firebase';
import { collection, query, getDocs, orderBy, doc, getDoc, updateDoc, setDoc, serverTimestamp, deleteDoc, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { normalizeImagePath } from '../../lib/imageUtils';

// Icon mapping for How it Works steps
const ICON_OPTIONS = [
    { name: 'Search', component: Search, color: 'blue-600' },
    { name: 'FileText', component: FileText, color: 'purple-600' },
    { name: 'ShieldCheck', component: ShieldCheck, color: 'green-600' },
    { name: 'Award', component: Award, color: 'yellow-600' },
    { name: 'CheckCircle', component: CheckCircle, color: 'cyan-600' },
    { name: 'AlertCircle', component: AlertCircle, color: 'red-600' }
];

// Default content constants
const DEFAULT_HOW_IT_WORKS = [
    { step_number: 1, icon_name: 'Search', icon_color: 'blue-600', title: 'Find Your ID', description: 'Locate the unique Certificate Identification number at the bottom of your certificate.', order_num: 1 },
    { step_number: 2, icon_name: 'FileText', icon_color: 'purple-600', title: 'Enter Details', description: 'Type the ID carefully into the secure search bar above and click \'Verify Now\'.', order_num: 2 },
    { step_number: 3, icon_name: 'ShieldCheck', icon_color: 'green-600', title: 'Instant Validation', description: 'Our system matches your ID against our secure encrypted database for instant results.', order_num: 3 }
];

const DEFAULT_CREDENTIALS = {
    heading: 'Locate Your Credentials',
    description: 'Your official LasakEdu certificate contains a unique identification number. Use this number for verification during job applications or higher education processing.',
    bullet_point_1: 'Tamper-proof digital records',
    bullet_point_2: 'Recognized by top placement partners',
    bullet_point_3: 'Instant cloud-based validation',
    image_url: '/img/certificate-mockup.png'
};

const DEFAULT_FAQS = [
    { question: 'Where can I find my Certificate ID?', answer: 'The ID is located at the bottom-right corner of your physical or digital certificate issued by LasakEdu.', order_num: 1, active: true },
    { question: 'What should I do if my ID is not found?', answer: 'Please ensure you have entered the ID exactly as it appears. If it still doesn\'t show up, contact our support team at info@lasakedu.in.', order_num: 2, active: true },
    { question: 'Is this verification valid for life?', answer: 'Yes, once a certificate is issued and recorded in our database, it remains available for verification indefinitely.', order_num: 3, active: true },
    { question: 'Can employers verify multiple certificates at once?', answer: 'Employers can use this portal to verify certificates individually. For bulk verification, HR teams can contact us directly.', order_num: 4, active: true }
];

const DEFAULT_SUPPORT = {
    heading: 'Still Having Trouble?',
    description: 'Our academic support team is here to help you with any certificate-related issues or verification concerns.',
    button_1_text: 'Contact Support',
    button_1_link: 'mailto:info@lasakedu.in',
    button_2_text: 'Visit Office',
    button_2_link: '/contact'
};

const DEFAULT_LASAK_STANDARD = {
    heading: 'The Lasak Standard: Verification You Can Trust',
    subtitle: 'Integrity in Every Pixel. Authority in Every Hire.',
    intro_text: 'In an era of "instant certificates," Lasak Edu stands apart. We don\'t just issue documents; we validate expertise. Our certification process is a closed-loop, tamper-proof ecosystem designed to protect the hard work of our students and the hiring confidence of our partners.',
    feature_1_title: 'Zero Human Intervention',
    feature_1_desc: 'From the moment a student triggers their Admission Enrollment to the final Course Completion mark by our technical staff, the journey is 100% automated. No manual edits, no back-dating, no exceptions.',
    feature_2_title: 'Dual-Layer Authentication',
    feature_2_desc: 'Verification requires both the Admission Enrollment Number and the Certificate Number. This back-to-back validation ensures that every credential is tied to a legitimate, audited learning journey.',
    feature_3_title: 'ISO-Standard Rigor',
    feature_3_desc: 'We treat our certification audits with the same gravity as international ISO standards. Our digital signatures are permanent and non-tamperable.',
    footer_text: 'For Employers: When you see a Lasak Edu certificate, you aren\'t looking at a participation trophy. You are looking at a verified record of skill acquisition, backed by an automated system that eliminates human error and fraud.'
};

const CertVerificationContentManager = () => {
    const [activeTab, setActiveTab] = useState('how-it-works');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // How it Works state
    const [howItWorksSteps, setHowItWorksSteps] = useState<any[]>(DEFAULT_HOW_IT_WORKS);

    // Credentials Section state
    const [credentialsSection, setCredentialsSection] = useState<any>(DEFAULT_CREDENTIALS);

    // FAQs state
    const [faqs, setFaqs] = useState<any[]>(DEFAULT_FAQS);
    const [editingFaqId, setEditingFaqId] = useState(null);
    const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

    // Support Section state
    const [supportSection, setSupportSection] = useState<any>(DEFAULT_SUPPORT);

    // Lasak Standard Section state
    const [lasakStandardSection, setLasakStandardSection] = useState<any>(DEFAULT_LASAK_STANDARD);

    useEffect(() => {
        fetchAllContent();
    }, []);

    const fetchAllContent = async () => {
        setLoading(true);
        try {
            // Fetch How it Works
            const stepsSnapshot = await getDocs(query(collection(db, 'cert_how_it_works'), orderBy('order_num', 'asc')));
            const stepsData = stepsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (stepsData.length > 0) setHowItWorksSteps(stepsData);

            // Fetch Credentials Section
            const credSnap = await getDoc(doc(db, 'cert_credentials_section', 'default'));
            if (credSnap.exists()) setCredentialsSection({ id: credSnap.id, ...credSnap.data() });

            // Fetch FAQs
            const faqsSnapshot = await getDocs(query(collection(db, 'cert_faqs'), orderBy('order_num', 'asc')));
            const faqsData = faqsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (faqsData.length > 0) setFaqs(faqsData);

            // Fetch Support Section
            const supportSnap = await getDoc(doc(db, 'cert_support_section', 'default'));
            if (supportSnap.exists()) setSupportSection({ id: supportSnap.id, ...supportSnap.data() });

            // Fetch Lasak Standard Section
            const lasakStandardSnap = await getDoc(doc(db, 'cert_lasak_standard_section', 'default'));
            if (lasakStandardSnap.exists()) setLasakStandardSection({ id: lasakStandardSnap.id, ...lasakStandardSnap.data() });

        } catch (error) {
            console.error('Error fetching content:', error);
            showMessage('error', 'Failed to load content');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const saveLasakStandardSection = async () => {
        try {
            const { id, ...dataToSave } = lasakStandardSection;

            const docRef = doc(db, 'cert_lasak_standard_section', 'default');
            await setDoc(docRef, { ...dataToSave, updated_at: serverTimestamp() }, { merge: true });

            showMessage('success', 'Lasak Standard section updated successfully');
            fetchAllContent();
        } catch (error: any) {
            console.error('Error updating Lasak Standard section:', error);
            showMessage('error', 'Failed to update Lasak Standard section');
        }
    };

    // How it Works handlers
    const updateHowItWorksStep = async (step) => {
        try {
            const stepRef = doc(db, 'cert_how_it_works', step.id);
            await setDoc(stepRef, {
                step_number: step.step_number,
                icon_name: step.icon_name,
                icon_color: step.icon_color,
                title: step.title,
                description: step.description,
                order_num: step.order_num,
                updated_at: serverTimestamp()
            }, { merge: true });

            showMessage('success', 'Step updated successfully');
            fetchAllContent();
        } catch (error) {
            console.error('Error updating step:', error);
            showMessage('error', 'Failed to update step');
        }
    };

    // Credentials Section handlers
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `verification/${fileName}`;
            const storageRef = ref(storage, filePath);

            await uploadBytes(storageRef, file);
            const publicUrl = await getDownloadURL(storageRef);

            setCredentialsSection({ ...credentialsSection, image_url: publicUrl });
            showMessage('success', 'Image uploaded successfully');
        } catch (error: any) {
            console.error('Error uploading image:', error);
            showMessage('error', 'Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const saveCredentialsSection = async () => {
        try {
            const { id, ...dataToSave } = credentialsSection;

            const docRef = doc(db, 'cert_credentials_section', 'default');
            await setDoc(docRef, { ...dataToSave, updated_at: serverTimestamp() }, { merge: true });

            showMessage('success', 'Credentials section updated successfully');
            fetchAllContent();
        } catch (error: any) {
            console.error('Error updating credentials section:', error);
            showMessage('error', 'Failed to update credentials section: ' + error.message);
        }
    };

    // FAQ handlers
    const addFaq = async () => {
        if (!newFaq.question || !newFaq.answer) {
            showMessage('error', 'Please fill in both question and answer');
            return;
        }

        try {
            const maxOrder = faqs.length > 0 ? Math.max(...faqs.map(f => f.order_num)) : 0;
            await addDoc(collection(db, 'cert_faqs'), {
                question: newFaq.question,
                answer: newFaq.answer,
                order_num: maxOrder + 1,
                active: true,
                created_at: serverTimestamp()
            });

            showMessage('success', 'FAQ added successfully');
            setNewFaq({ question: '', answer: '' });
            fetchAllContent();
        } catch (error) {
            console.error('Error adding FAQ:', error);
            showMessage('error', 'Failed to add FAQ');
        }
    };

    const updateFaq = async (faq) => {
        try {
            await updateDoc(doc(db, 'cert_faqs', faq.id), {
                question: faq.question,
                answer: faq.answer,
                active: faq.active,
                updated_at: serverTimestamp()
            });

            showMessage('success', 'FAQ updated successfully');
            setEditingFaqId(null);
            fetchAllContent();
        } catch (error) {
            console.error('Error updating FAQ:', error);
            showMessage('error', 'Failed to update FAQ');
        }
    };

    const deleteFaq = async (id) => {
        if (!confirm('Are you sure you want to delete this FAQ?')) return;

        try {
            await deleteDoc(doc(db, 'cert_faqs', id));
            showMessage('success', 'FAQ deleted successfully');
            fetchAllContent();
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            showMessage('error', 'Failed to delete FAQ');
        }
    };

    const moveFaq = async (index, direction) => {
        const newFaqs = [...faqs];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newFaqs.length) return;

        [newFaqs[index], newFaqs[targetIndex]] = [newFaqs[targetIndex], newFaqs[index]];

        try {
            const updates = newFaqs.map((faq, idx) =>
                updateDoc(doc(db, 'cert_faqs', faq.id), { order_num: idx + 1, updated_at: serverTimestamp() })
            );
            await Promise.all(updates);
            fetchAllContent();
        } catch (error) {
            console.error('Error reordering FAQs:', error);
            showMessage('error', 'Failed to reorder FAQs');
        }
    };

    // Support Section handlers
    const saveSupportSection = async () => {
        try {
            const docRef = doc(db, 'cert_support_section', 'default');
            await setDoc(docRef, { ...supportSection, updated_at: serverTimestamp() }, { merge: true });

            showMessage('success', 'Support section updated successfully');
            fetchAllContent();
        } catch (error) {
            console.error('Error updating support section:', error);
            showMessage('error', 'Failed to update support section');
        }
    };

    const getIconComponent = (iconName) => {
        const icon = ICON_OPTIONS.find(i => i.name === iconName);
        return icon ? icon.component : Search;
    };

    const seedDefaultContent = async () => {
        if (!confirm('This will overwrite current content with system defaults. Are you sure?')) return;

        setLoading(true);
        try {
            // How it Works
            for (const step of DEFAULT_HOW_IT_WORKS) {
                await setDoc(doc(db, 'cert_how_it_works', `step - ${step.step_number} `), {
                    ...step,
                    updated_at: serverTimestamp()
                });
            }

            // Credentials
            await setDoc(doc(db, 'cert_credentials_section', 'default'), {
                ...DEFAULT_CREDENTIALS,
                updated_at: serverTimestamp()
            });

            // FAQs
            for (const faq of DEFAULT_FAQS) {
                const id = faq.question.toLowerCase().replace(/[?]/g, '').replace(/\s+/g, '-');
                await setDoc(doc(db, 'cert_faqs', id), {
                    ...faq,
                    updated_at: serverTimestamp()
                });
            }

            // Support
            await setDoc(doc(db, 'cert_support_section', 'default'), {
                ...DEFAULT_SUPPORT,
                updated_at: serverTimestamp()
            });

            // Lasak Standard
            await setDoc(doc(db, 'cert_lasak_standard_section', 'default'), {
                ...DEFAULT_LASAK_STANDARD,
                updated_at: serverTimestamp()
            });

            showMessage('success', 'Default content restored successfully');
            fetchAllContent();
        } catch (error) {
            console.error('Error seeding content:', error);
            showMessage('error', 'Failed to seed default content');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Certificate Verification Page Content</h1>
                    <p className="text-slate-600">Manage all content sections of the Certificate Verification page</p>
                </div>
                <button
                    onClick={seedDefaultContent}
                    className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                >
                    Restore Defaults
                </button>
            </div>

            {/* Message Alert */}
            {message.text && (
                <div className={`mb - 6 p - 4 rounded - lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'} `}>
                    {message.text}
                </div>
            )}

            {/* Tabs */}
            <div className="mb-6 border-b border-slate-200">
                <div className="flex gap-4">
                    {[
                        { id: 'how-it-works', label: 'How it Works' },
                        { id: 'credentials', label: 'Credentials Section' },
                        { id: 'lasak-standard', label: 'Lasak Standard' },
                        { id: 'faqs', label: 'FAQs' },
                        { id: 'support', label: 'Support Section' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px - 6 py - 3 font - semibold border - b - 2 transition - colors ${activeTab === tab.id
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-slate-600 hover:text-slate-900'
                                } `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading content...</p>
                </div>
            ) : (
                <>
                    {/* How it Works Tab */}
                    {activeTab === 'how-it-works' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900">How it Works Steps</h2>
                            {howItWorksSteps.map((step, index) => {
                                const IconComponent = getIconComponent(step.icon_name);
                                return (
                                    <div key={step.id} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className={`w - 16 h - 16 bg - slate - 50 rounded - 2xl flex items - center justify - center`}>
                                                <IconComponent className={`text - ${step.icon_color} `} size={32} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg mb-2">Step {step.step_number}</h3>

                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Icon</label>
                                                        <select
                                                            value={step.icon_name}
                                                            onChange={(e) => {
                                                                const newSteps = [...howItWorksSteps];
                                                                newSteps[index].icon_name = e.target.value;
                                                                setHowItWorksSteps(newSteps);
                                                            }}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                                        >
                                                            {ICON_OPTIONS.map(icon => (
                                                                <option key={icon.name} value={icon.name}>{icon.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Icon Color</label>
                                                        <select
                                                            value={step.icon_color}
                                                            onChange={(e) => {
                                                                const newSteps = [...howItWorksSteps];
                                                                newSteps[index].icon_color = e.target.value;
                                                                setHowItWorksSteps(newSteps);
                                                            }}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                                        >
                                                            {ICON_OPTIONS.map(icon => (
                                                                <option key={icon.color} value={icon.color}>{icon.color}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                                    <input
                                                        type="text"
                                                        value={step.title}
                                                        onChange={(e) => {
                                                            const newSteps = [...howItWorksSteps];
                                                            newSteps[index].title = e.target.value;
                                                            setHowItWorksSteps(newSteps);
                                                        }}
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                                    />
                                                </div>

                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                                    <textarea
                                                        value={step.description}
                                                        onChange={(e) => {
                                                            const newSteps = [...howItWorksSteps];
                                                            newSteps[index].description = e.target.value;
                                                            setHowItWorksSteps(newSteps);
                                                        }}
                                                        rows={3}
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                                    />
                                                </div>

                                                <button
                                                    onClick={() => updateHowItWorksStep(step)}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                                >
                                                    <Save size={16} /> Save Step
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Credentials Section Tab */}
                    {activeTab === 'credentials' && (
                        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Locate Your Credentials Section</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Heading</label>
                                    <input
                                        type="text"
                                        value={credentialsSection.heading}
                                        onChange={(e) => setCredentialsSection({ ...credentialsSection, heading: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <textarea
                                        value={credentialsSection.description}
                                        onChange={(e) => setCredentialsSection({ ...credentialsSection, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Bullet Point 1</label>
                                    <input
                                        type="text"
                                        value={credentialsSection.bullet_point_1}
                                        onChange={(e) => setCredentialsSection({ ...credentialsSection, bullet_point_1: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Bullet Point 2</label>
                                    <input
                                        type="text"
                                        value={credentialsSection.bullet_point_2}
                                        onChange={(e) => setCredentialsSection({ ...credentialsSection, bullet_point_2: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Bullet Point 3</label>
                                    <input
                                        type="text"
                                        value={credentialsSection.bullet_point_3}
                                        onChange={(e) => setCredentialsSection({ ...credentialsSection, bullet_point_3: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            value={credentialsSection.image_url}
                                            onChange={(e) => setCredentialsSection({ ...credentialsSection, image_url: e.target.value })}
                                            placeholder="/img/course-template.png"
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                        />
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="image-upload"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                disabled={uploading}
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className={`px - 4 py - 2 bg - slate - 100 text - slate - 700 rounded - lg hover: bg - slate - 200 cursor - pointer flex items - center gap - 2 border border - slate - 300 text - sm font - medium ${uploading ? 'opacity-50 cursor-not-allowed' : ''} `}
                                            >
                                                <Upload size={16} />
                                                {uploading ? 'Uploading...' : 'Upload Image'}
                                            </label>
                                        </div>
                                    </div>
                                    {credentialsSection.image_url && (
                                        <div className="mt-4 p-2 bg-slate-50 rounded-lg border border-dashed border-slate-300 inline-block">
                                            <img
                                                src={normalizeImagePath(credentialsSection.image_url || '/img/course-template.png')}
                                                alt="Preview"
                                                className="max-h-48 rounded shadow-sm"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                                                }}
                                            />
                                            <p className="text-[10px] text-gray-500 mt-1 text-center truncate w-48">
                                                {credentialsSection.image_url || '/img/course-template.png'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={saveCredentialsSection}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                >
                                    <Save size={20} /> Save Credentials Section
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Lasak Standard Tab */}
                    {activeTab === 'lasak-standard' && (
                        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Lasak Standard Section</h2>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Heading</label>
                                <input type="text" value={lasakStandardSection.heading} onChange={(e) => setLasakStandardSection({ ...lasakStandardSection, heading: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
                                <input type="text" value={lasakStandardSection.subtitle} onChange={(e) => setLasakStandardSection({ ...lasakStandardSection, subtitle: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Intro Text</label>
                                <textarea rows={4} value={lasakStandardSection.intro_text} onChange={(e) => setLasakStandardSection({ ...lasakStandardSection, intro_text: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                            </div>

                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                                <h3 className="font-bold text-lg text-slate-800">Feature 1</h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                    <input type="text" value={lasakStandardSection.feature_1_title} onChange={(e) => setLasakStandardSection({ ...lasakStandardSection, feature_1_title: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <textarea rows={2} value={lasakStandardSection.feature_1_desc} onChange={(e) => setLasakStandardSection({ ...lasakStandardSection, feature_1_desc: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                                <h3 className="font-bold text-lg text-slate-800">Feature 2</h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                    <input type="text" value={lasakStandardSection.feature_2_title} onChange={(e) => setLasakStandardSection({ ...lasakStandardSection, feature_2_title: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <textarea rows={2} value={lasakStandardSection.feature_2_desc} onChange={(e) => setLasakStandardSection({ ...lasakStandardSection, feature_2_desc: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                                <h3 className="font-bold text-lg text-slate-800">Feature 3</h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                    <input type="text" value={lasakStandardSection.feature_3_title} onChange={(e) => setLasakStandardSection({ ...lasakStandardSection, feature_3_title: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <textarea rows={2} value={lasakStandardSection.feature_3_desc} onChange={(e) => setLasakStandardSection({ ...lasakStandardSection, feature_3_desc: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Footer Text (For Employers)</label>
                                <textarea rows={3} value={lasakStandardSection.footer_text} onChange={(e) => setLasakStandardSection({ ...lasakStandardSection, footer_text: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                            </div>

                            <button onClick={saveLasakStandardSection} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                                <Save size={20} /> Save Lasak Standard Section
                            </button>
                        </div>
                    )}

                    {/* FAQs Tab */}
                    {activeTab === 'faqs' && (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Add New FAQ</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Question</label>
                                        <input
                                            type="text"
                                            value={newFaq.question}
                                            onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                                            placeholder="Enter question..."
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Answer</label>
                                        <textarea
                                            value={newFaq.answer}
                                            onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                                            placeholder="Enter answer..."
                                            rows={3}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        />
                                    </div>
                                    <button
                                        onClick={addFaq}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                                    >
                                        <Plus size={16} /> Add FAQ
                                    </button>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-slate-900">Existing FAQs</h2>
                            {faqs.map((faq, index) => (
                                <div key={faq.id} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                                    {editingFaqId === faq.id ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Question</label>
                                                <input
                                                    type="text"
                                                    value={faq.question}
                                                    onChange={(e) => {
                                                        const newFaqs = [...faqs];
                                                        newFaqs[index].question = e.target.value;
                                                        setFaqs(newFaqs);
                                                    }}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Answer</label>
                                                <textarea
                                                    value={faq.answer}
                                                    onChange={(e) => {
                                                        const newFaqs = [...faqs];
                                                        newFaqs[index].answer = e.target.value;
                                                        setFaqs(newFaqs);
                                                    }}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updateFaq(faq)}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingFaqId(null)}
                                                    className="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-bold text-lg">{faq.question}</h3>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            const newFaqs = [...faqs];
                                                            newFaqs[index].active = !faq.active;
                                                            setFaqs(newFaqs);
                                                            updateFaq(newFaqs[index]);
                                                        }}
                                                        className={`p - 2 rounded ${faq.active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'} `}
                                                        title={faq.active ? 'Active' : 'Inactive'}
                                                    >
                                                        {faq.active ? <Eye size={16} /> : <EyeOff size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={() => moveFaq(index, 'up')}
                                                        disabled={index === 0}
                                                        className="p-2 bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-30"
                                                    >
                                                        <ChevronUp size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => moveFaq(index, 'down')}
                                                        disabled={index === faqs.length - 1}
                                                        className="p-2 bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-30"
                                                    >
                                                        <ChevronDown size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingFaqId(faq.id)}
                                                        className="px-3 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteFaq(faq.id)}
                                                        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-slate-600">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Support Section Tab */}
                    {activeTab === 'support' && (
                        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Support Section</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Heading</label>
                                    <input
                                        type="text"
                                        value={supportSection.heading}
                                        onChange={(e) => setSupportSection({ ...supportSection, heading: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <textarea
                                        value={supportSection.description}
                                        onChange={(e) => setSupportSection({ ...supportSection, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Button 1 Text</label>
                                        <input
                                            type="text"
                                            value={supportSection.button_1_text}
                                            onChange={(e) => setSupportSection({ ...supportSection, button_1_text: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Button 1 Link</label>
                                        <input
                                            type="text"
                                            value={supportSection.button_1_link}
                                            onChange={(e) => setSupportSection({ ...supportSection, button_1_link: e.target.value })}
                                            placeholder="mailto:info@lasakedu.in"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Button 2 Text</label>
                                        <input
                                            type="text"
                                            value={supportSection.button_2_text}
                                            onChange={(e) => setSupportSection({ ...supportSection, button_2_text: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Button 2 Link</label>
                                        <input
                                            type="text"
                                            value={supportSection.button_2_link}
                                            onChange={(e) => setSupportSection({ ...supportSection, button_2_link: e.target.value })}
                                            placeholder="/contact"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={saveSupportSection}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                >
                                    <Save size={20} /> Save Support Section
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CertVerificationContentManager;
