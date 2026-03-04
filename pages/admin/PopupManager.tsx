import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, Trash2, Plus, Eye, Clock, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { db, storage } from '../../lib/firebase';
import { collection, query, getDocs, orderBy, doc, getDoc, updateDoc, setDoc, serverTimestamp, where, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useUserRole } from '../../hooks/useUserRole';

interface PopupSlide {
    id: string;
    image_url: string;
    clickable: boolean;
    order_num: number;
    style?: 'standard' | 'image_only';
    title?: string;
    description?: string;
    button_text?: string;
    feature_1?: string;
    feature_2?: string;
    feature_3?: string;
}

interface PopupConfig {
    id: string;
    enabled: boolean;
    interval: number;
    form_url: string;
    title?: string;
    description?: string;
    feature_1?: string;
    feature_2?: string;
    feature_3?: string;
    button_text?: string;
}

const PopupManager = () => {
    const { canEdit } = useUserRole();
    const [config, setConfig] = useState<PopupConfig | null>(null);
    const [slides, setSlides] = useState<PopupSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState('');

    useEffect(() => {
        fetchPopupData();
    }, []);

    const fetchPopupData = async () => {
        try {
            // Fetch popup configuration (assuming 'default' id for singleton)
            const configRef = doc(db, 'popup_config', 'default');
            const configSnap = await getDoc(configRef);

            if (configSnap.exists()) {
                setConfig({ id: configSnap.id, ...configSnap.data() } as PopupConfig);
            } else {
                // Initialize default if not exists
                const initialConfig = {
                    enabled: false,
                    interval: 5000,
                    form_url: '',
                    title: 'Transform Your Career',
                    description: 'Join our industry-approved Diploma courses...',
                    button_text: 'Apply Now',
                    feature_1: 'Free Demo Classes',
                    feature_2: 'Internship Included',
                    feature_3: 'Scholarship Available'
                };
                try {
                    await setDoc(configRef, initialConfig);
                } catch (writeErr) {
                    console.warn('Could not auto-create popup_config, using defaults:', writeErr);
                }
                setConfig({ id: 'default', ...initialConfig } as PopupConfig);
            }

            // Fetch popup slides - use simple query to avoid index requirement
            try {
                const q = query(
                    collection(db, 'popup_slides'),
                    where('active', '==', true)
                );
                const querySnapshot = await getDocs(q);
                const slidesData = querySnapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    .sort((a: any, b: any) => (a.order_num || 0) - (b.order_num || 0)) as PopupSlide[];

                setSlides(slidesData);
            } catch (slideErr) {
                console.warn('Error fetching slides, trying without filter:', slideErr);
                // Fallback: fetch all slides
                const allSlidesSnap = await getDocs(collection(db, 'popup_slides'));
                const allSlides = allSlidesSnap.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter((s: any) => s.active !== false)
                    .sort((a: any, b: any) => (a.order_num || 0) - (b.order_num || 0)) as PopupSlide[];
                setSlides(allSlides);
            }
        } catch (error) {
            console.error('Error loading popup data:', error);
            showMessage('error', 'Failed to load popup configuration');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleSave = async () => {
        if (!config) return;

        setSaving(true);
        try {
            // Update popup configuration
            const configRef = doc(db, 'popup_config', config.id);
            await updateDoc(configRef, {
                enabled: config.enabled,
                interval: config.interval,
                form_url: config.form_url,
                title: config.title || '',
                description: config.description || '',
                feature_1: config.feature_1 || '',
                feature_2: config.feature_2 || '',
                feature_3: config.feature_3 || '',
                button_text: config.button_text || '',
                updated_at: serverTimestamp()
            });

            // Update slides order and content
            for (let i = 0; i < slides.length; i++) {
                const slideRef = doc(db, 'popup_slides', slides[i].id);
                await updateDoc(slideRef, {
                    order_num: i + 1,
                    clickable: slides[i].clickable,
                    style: slides[i].style || 'standard',
                    title: slides[i].title || '',
                    description: slides[i].description || '',
                    button_text: slides[i].button_text || '',
                    feature_1: slides[i].feature_1 || '',
                    feature_2: slides[i].feature_2 || '',
                    feature_3: slides[i].feature_3 || '',
                    updated_at: serverTimestamp()
                });
            }

            showMessage('success', 'Popup configuration saved successfully!');
        } catch (error) {
            console.error('Error saving config:', error);
            showMessage('error', 'Failed to save configuration');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, slideId?: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        showMessage('success', 'Uploading image... please wait');

        try {
            // Upload image to Firebase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `popup/${fileName}`;
            const storageRef = ref(storage, filePath);

            console.log('Uploading to Firebase Storage:', filePath);
            await uploadBytes(storageRef, file);
            console.log('Upload complete, getting URL...');

            // Get public URL
            const publicUrl = await getDownloadURL(storageRef);
            console.log('Got download URL:', publicUrl);

            if (slideId) {
                // Update existing slide
                const slideRef = doc(db, 'popup_slides', slideId);
                await updateDoc(slideRef, { image_url: publicUrl, updated_at: serverTimestamp() });

                setSlides(prev => prev.map(slide =>
                    slide.id === slideId ? { ...slide, image_url: publicUrl } : slide
                ));
            } else {
                // Add new slide to Firestore
                const newSlideData = {
                    image_url: publicUrl,
                    clickable: true,
                    order_num: slides.length + 1,
                    active: true,
                    style: 'standard',
                    title: '',
                    description: '',
                    button_text: '',
                    feature_1: '',
                    feature_2: '',
                    feature_3: '',
                    created_at: serverTimestamp(),
                    updated_at: serverTimestamp()
                };
                const docRef = await addDoc(collection(db, 'popup_slides'), newSlideData);

                // Add to local state without serverTimestamp (use current date instead)
                setSlides(prev => [...prev, {
                    id: docRef.id,
                    image_url: publicUrl,
                    clickable: true,
                    order_num: slides.length + 1,
                    style: 'standard',
                    title: '',
                    description: '',
                    button_text: '',
                    feature_1: '',
                    feature_2: '',
                    feature_3: ''
                } as PopupSlide]);
            }

            showMessage('success', 'Image uploaded successfully!');
        } catch (error: any) {
            console.error('Error uploading image:', error);
            const errMsg = error?.code || error?.message || 'Unknown error';
            showMessage('error', 'Failed to upload image: ' + errMsg);
            alert('Image upload failed: ' + errMsg + '\n\nPlease check:\n1. You are logged in as admin\n2. Firebase Storage is enabled in your Firebase console\n3. Storage rules are deployed');
        }

        // Reset file input
        e.target.value = '';
    };

    const addSlideByUrl = async () => {
        if (!newImageUrl.trim()) {
            showMessage('error', 'Please enter an image URL');
            return;
        }

        try {
            const newSlideData = {
                image_url: newImageUrl.trim(),
                clickable: true,
                order_num: slides.length + 1,
                active: true,
                style: 'standard' as const,
                title: '',
                description: '',
                button_text: '',
                feature_1: '',
                feature_2: '',
                feature_3: '',
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            };
            const docRef = await addDoc(collection(db, 'popup_slides'), newSlideData);

            setSlides(prev => [...prev, {
                id: docRef.id,
                image_url: newImageUrl.trim(),
                clickable: true,
                order_num: slides.length + 1,
                style: 'standard',
                title: '',
                description: '',
                button_text: '',
                feature_1: '',
                feature_2: '',
                feature_3: ''
            } as PopupSlide]);

            setNewImageUrl('');
            setShowUrlInput(false);
            showMessage('success', 'Slide added successfully!');
        } catch (error: any) {
            console.error('Error adding slide by URL:', error);
            showMessage('error', 'Failed to add slide: ' + (error?.message || 'Unknown error'));
        }
    };

    const removeSlide = async (slideId: string) => {
        try {
            const slideRef = doc(db, 'popup_slides', slideId);
            await updateDoc(slideRef, {
                active: false,
                updated_at: serverTimestamp()
            });

            setSlides(prev => prev.filter(slide => slide.id !== slideId));
            showMessage('success', 'Slide removed successfully!');
        } catch (error: any) {
            console.error('Error removing slide:', error);
            showMessage('error', 'Failed to remove slide: ' + (error.message || 'Unknown error'));
        }
    };

    const toggleSlideClickable = (slideId: string) => {
        setSlides(prev => prev.map(slide =>
            slide.id === slideId ? { ...slide, clickable: !slide.clickable } : slide
        ));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!config) {
        return (
            <div className="p-6 max-w-6xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">Failed to load popup configuration. Please run the database setup script.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Popup Manager</h1>
                <p className="text-gray-600">Manage the promotional popup that appears on the home page</p>
            </div>

            {/* Success/Error Message */}
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}
                >
                    {message.text}
                </motion.div>
            )}

            {/* Settings Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Eye className="text-blue-600" size={24} />
                    Popup Settings
                </h2>

                <div className="space-y-4">
                    {/* Enable/Disable Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <label className="font-semibold text-gray-700">Enable Popup</label>
                            <p className="text-sm text-gray-500">Show promotional popup to visitors</p>
                        </div>
                        <button
                            disabled={!canEdit}
                            onClick={() => setConfig(prev => prev ? { ...prev, enabled: !prev.enabled } : null)}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${config.enabled ? 'bg-blue-600' : 'bg-gray-300'} ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span
                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${config.enabled ? 'translate-x-7' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Content Settings */}
                    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                        <h3 className="font-bold text-gray-800 border-b pb-2 mb-4">Content Settings</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Popup Title</label>
                                <input
                                    type="text"
                                    value={config.title || ''}
                                    onChange={(e) => setConfig(prev => prev ? { ...prev, title: e.target.value } : null)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Transform Your Career"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Button Text</label>
                                <input
                                    type="text"
                                    value={config.button_text || ''}
                                    onChange={(e) => setConfig(prev => prev ? { ...prev, button_text: e.target.value } : null)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Apply Now"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={config.description || ''}
                                onChange={(e) => setConfig(prev => prev ? { ...prev, description: e.target.value } : null)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                                placeholder="Join our industry-approved Diploma courses..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Feature 1</label>
                                <input
                                    type="text"
                                    value={config.feature_1 || ''}
                                    onChange={(e) => setConfig(prev => prev ? { ...prev, feature_1: e.target.value } : null)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Free Demo Classes"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Feature 2</label>
                                <input
                                    type="text"
                                    value={config.feature_2 || ''}
                                    onChange={(e) => setConfig(prev => prev ? { ...prev, feature_2: e.target.value } : null)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Internship Included"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Feature 3</label>
                                <input
                                    type="text"
                                    value={config.feature_3 || ''}
                                    onChange={(e) => setConfig(prev => prev ? { ...prev, feature_3: e.target.value } : null)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Scholarship Available"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Interval Setting */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                            <Clock size={18} />
                            Slide Interval (milliseconds)
                        </label>
                        <input
                            type="number"
                            value={config.interval}
                            onChange={(e) => setConfig(prev => prev ? { ...prev, interval: parseInt(e.target.value) } : null)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="1000"
                            step="500"
                        />
                        <p className="text-sm text-gray-500 mt-1">Time between slide transitions</p>
                    </div>

                    {/* Form URL */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                            <LinkIcon size={18} />
                            Application Form URL
                        </label>
                        <input
                            type="url"
                            value={config.form_url || ''}
                            onChange={(e) => setConfig(prev => prev ? { ...prev, form_url: e.target.value } : null)}
                            placeholder="https://forms.gle/..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-sm text-gray-500 mt-1">URL for the "Apply Now" button</p>
                    </div>
                </div>
            </div>

            {/* Slides Management */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ImageIcon className="text-blue-600" size={24} />
                        Popup Slides
                    </h2>
                    {canEdit && (
                        <div className="flex items-center gap-2">
                            <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2 text-sm">
                                <Upload size={16} />
                                Upload Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e)}
                                    className="hidden"
                                />
                            </label>
                            <button
                                onClick={() => setShowUrlInput(!showUrlInput)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                            >
                                <Plus size={16} />
                                Add by URL
                            </button>
                        </div>
                    )}
                </div>

                {/* URL Input Section */}
                {showUrlInput && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <label className="block font-medium text-gray-700 mb-2">Paste Image URL</label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg or /img/banner.webp"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <button
                                onClick={addSlideByUrl}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                            >
                                Add Slide
                            </button>
                            <button
                                onClick={() => { setShowUrlInput(false); setNewImageUrl(''); }}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">You can use external URLs or local paths like <code>/img/popup-banner.webp</code></p>
                    </div>
                )}

                {slides.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No slides added yet. Click "Add by URL" or "Upload Image" to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {slides.map((slide) => (
                            <motion.div
                                key={slide.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                            >
                                {/* Slide Image */}
                                <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                                    <img
                                        src={slide.image_url}
                                        alt={`Slide ${slide.order_num}`}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                {/* Slide Controls */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={slide.style || 'standard'}
                                            onChange={(e) => setSlides(prev => prev.map(s =>
                                                s.id === slide.id ? { ...s, style: e.target.value as 'standard' | 'image_only' } : s
                                            ))}
                                            className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                                        >
                                            <option value="standard">Standard (Text + Image)</option>
                                            <option value="image_only">Image Only</option>
                                        </select>
                                        <button
                                            onClick={() => toggleSlideClickable(slide.id)}
                                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${slide.clickable
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            {slide.clickable ? 'Clickable' : 'Not Clickable'}
                                        </button>
                                    </div>

                                    {/* Slide Content Overrides */}
                                    <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                                        <p className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wide">Detailed Slide Content</p>
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                placeholder="Slide Title (Leave empty for default)"
                                                value={slide.title || ''}
                                                onChange={(e) => setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, title: e.target.value } : s))}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                            />
                                            <textarea
                                                placeholder="Slide Description (Leave empty for default)"
                                                value={slide.description || ''}
                                                onChange={(e) => setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, description: e.target.value } : s))}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                rows={2}
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Button Text"
                                                    value={slide.button_text || ''}
                                                    onChange={(e) => setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, button_text: e.target.value } : s))}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Feature 1"
                                                    value={slide.feature_1 || ''}
                                                    onChange={(e) => setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, feature_1: e.target.value } : s))}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Feature 2"
                                                    value={slide.feature_2 || ''}
                                                    onChange={(e) => setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, feature_2: e.target.value } : s))}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Feature 3"
                                                    value={slide.feature_3 || ''}
                                                    onChange={(e) => setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, feature_3: e.target.value } : s))}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {canEdit && (
                                        <div className="flex items-center justify-end gap-2">
                                            <label className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                                                <Upload size={18} />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, slide.id)}
                                                    className="hidden"
                                                />
                                            </label>
                                            <button
                                                onClick={() => removeSlide(slide.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Save Button */}
            {canEdit && (
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">ℹ️ How it works</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• The popup appears 2 seconds after the home page loads</li>
                    <li>• Slides automatically rotate based on the interval you set</li>
                    <li>• Clickable slides will link to the Application Form URL when clicked</li>
                    <li>• Use "Standard" style to text + image, or "Image Only" for just the image</li>
                    <li>• Images are stored in Firebase Storage</li>
                </ul>
            </div>
        </div>
    );
};

export default PopupManager;
