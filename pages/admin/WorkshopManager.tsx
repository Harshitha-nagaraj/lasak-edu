import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, doc, deleteDoc, updateDoc, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { useUserRole } from '../../hooks/useUserRole';
import { Plus, Trash2, Save, X, Edit, Zap, MapPin, Percent, Calendar, Clock, Image as ImageIcon } from 'lucide-react';

interface Workshop {
    id: string;
    title: string;
    description: string;
    type: 'live' | 'offline' | 'offer';
    badge_text: string;
    icon: string;
    button_text: string;
    button_link: string;
    tags: string[];
    active: boolean;
    order_num: number;
}

const WorkshopManager = () => {
    const { canEdit } = useUserRole();
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Workshop>>({
        title: '',
        description: '',
        type: 'live',
        badge_text: '',
        icon: 'Zap',
        button_text: 'Register Now',
        button_link: '',
        tags: [],
        active: true,
        order_num: 1
    });

    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        fetchWorkshops();
    }, []);

    const fetchWorkshops = async () => {
        try {
            const snapshot = await getDocs(query(collection(db, 'workshops'), orderBy('order_num', 'asc')));
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workshop));
            setWorkshops(data || []);
        } catch (error) {
            console.error('Error fetching workshops:', error);
        } finally {
            setLoading(false);
        }
    };

    const [debugLog, setDebugLog] = useState<string[]>([]);

    const addToLog = (msg: string) => {
        console.log(msg);
        setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
    };

    const runDiagnostics = async () => {
        setDebugLog([]); // Clear log
        addToLog('Starting System Diagnostic (Firebase)...');

        const timestamp = new Date().toISOString();
        const testTitle = `Diagnostic Test ${timestamp}`;
        let createdId = '';

        try {
            // 1. Test Insert
            addToLog('1. Attempting INSERT to Firestore...');
            const docRef = await addDoc(collection(db, 'workshops'), {
                title: testTitle,
                description: 'System Test',
                type: 'live',
                order_num: 999,
                created_at: serverTimestamp()
            });

            createdId = docRef.id;
            addToLog(`2. INSERT Success! ID: ${createdId}`);

            // 2. Test Select
            addToLog('3. Attempting SELECT from Firestore...');
            const docSnap = await getDoc(doc(db, 'workshops', createdId));

            if (!docSnap.exists()) throw new Error('SELECT returned no data.');

            addToLog('4. SELECT Success!');

            // 3. Test Delete
            addToLog('5. Attempting DELETE from Firestore...');
            await deleteDoc(doc(db, 'workshops', createdId));

            addToLog('6. DELETE Success!');
            addToLog('*** PASSED: FIREBASE PERMISSIONS ARE CORRECT ***');
            fetchWorkshops();

        } catch (error: any) {
            addToLog(`!!! DIAGNOSTIC FAILED !!!`);
            addToLog(`Error: ${error.message}`);
            addToLog(`Please verify your Firestore Security Rules.`);

            // Clean up
            if (createdId) {
                try { await deleteDoc(doc(db, 'workshops', createdId)); } catch (e) { }
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        addToLog(`Starting save process... (Mode: ${currentId ? 'EDIT' : 'CREATE'})`);

        setLoading(true);

        const workshopData = {
            title: formData.title,
            description: formData.description,
            type: formData.type,
            badge_text: formData.badge_text,
            icon: formData.icon,
            button_text: formData.button_text,
            button_link: formData.button_link,
            tags: formData.tags || [],
            active: formData.active,
            order_num: formData.order_num
        };

        addToLog(`Payload prepared. Title: "${workshopData.title}"`);

        try {
            if (currentId) {
                // Ensure ID is trimmed just in case
                const safeId = currentId.trim();
                addToLog(`Updating Workshop ID: "${safeId}"`);

                await updateDoc(doc(db, 'workshops', safeId), {
                    ...workshopData,
                    updated_at: serverTimestamp()
                });

                addToLog(`Update Successful!`);
            } else {
                addToLog('Inserting new record...');
                const docRef = await addDoc(collection(db, 'workshops'), {
                    ...workshopData,
                    created_at: serverTimestamp(),
                    updated_at: serverTimestamp()
                });
                addToLog(`Insert Successful! ID: ${docRef.id}`);
            }

            await fetchWorkshops();
            setIsEditing(false);
            resetForm();
            addToLog(`Form saved and reset.`);

        } catch (error: any) {
            console.error('Error in handleSave:', error);
            addToLog(`SAVE FAILED: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (workshop: any) => {
        if (!window.confirm(`Are you sure you want to delete "${workshop.title}"?`)) return;

        const id = workshop.id;
        addToLog(`Attempting delete for: "${workshop.title}" (ID: ${id})`);

        try {
            await deleteDoc(doc(db, 'workshops', id));
            setWorkshops(workshops.filter(w => w.id !== id));
            addToLog(`Success: Deleted.`);
        } catch (error: any) {
            console.error('Error deleting workshop:', error);
            addToLog(`EXCEPTION: ${error.message}`);
        }
    };

    const resetForm = () => {
        setCurrentId(null);
        setFormData({
            title: '',
            description: '',
            type: 'live',
            badge_text: '',
            icon: 'Zap',
            button_text: 'Register Now',
            button_link: '',
            tags: [],
            active: true,
            order_num: 1
        });
        setTagInput('');
    };

    const handleEdit = (workshop: Workshop) => {
        setCurrentId(workshop.id);
        setFormData(workshop);
        setIsEditing(true);
    };

    const addTag = () => {
        if (tagInput.trim()) {
            setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
            setTagInput('');
        }
    };

    const removeTag = (index: number) => {
        const newTags = [...(formData.tags || [])];
        newTags.splice(index, 1);
        setFormData({ ...formData, tags: newTags });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Workshops & Offers Manager</h1>
                <div className="flex gap-2">
                    {canEdit && (
                        <>
                            <button
                                onClick={runDiagnostics}
                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-600 font-bold"
                            >
                                <Zap size={20} /> Test Database
                            </button>
                            <button
                                onClick={() => { resetForm(); setIsEditing(true); }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 font-bold"
                            >
                                <span>+</span> Add New
                            </button>
                        </>
                    )}
                </div>
            </div>

            {!loading && workshops.length === 0 && !isEditing && (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">No workshops found.</p>
                    {canEdit && (
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => { resetForm(); setIsEditing(true); }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 font-bold"
                            >
                                <span>+</span> Create First Workshop
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="text-xs text-center text-gray-400 mt-8 mb-6">
                Connected to Firebase Firestore
            </div>

            {isEditing && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-fade-in">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-lg font-bold">{currentId ? 'Edit Workshop' : 'Add New Workshop'}</h3>
                        <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
                    </div>

                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-2 border rounded-lg h-24"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                className="w-full p-2 border rounded-lg"
                            >
                                <option value="live">Live Workshop</option>
                                <option value="offline">Offline Event</option>
                                <option value="offer">Special Offer</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Badge Text</label>
                            <input
                                value={formData.badge_text || ''}
                                onChange={e => setFormData({ ...formData, badge_text: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                                placeholder="e.g. LIVE, Offline, Early Bird"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Icon Name (Lucide)</label>
                            <select
                                value={formData.icon}
                                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                            >
                                <option value="Zap">Zap (Lightning)</option>
                                <option value="MapPin">MapPin (Location)</option>
                                <option value="Percent">Percent (Offer)</option>
                                <option value="Calendar">Calendar</option>
                                <option value="Clock">Clock</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tags</label>
                            <div className="flex gap-2">
                                <input
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="Add tag..."
                                />
                                <button type="button" onClick={addTag} className="bg-gray-200 px-3 rounded-lg">+</button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.tags?.map((tag, i) => (
                                    <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center gap-1">
                                        {tag} <button type="button" onClick={() => removeTag(i)} className="text-blue-900 font-bold">&times;</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Button Text</label>
                            <input
                                value={formData.button_text || ''}
                                onChange={e => setFormData({ ...formData, button_text: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Button Link</label>
                            <input
                                value={formData.button_link || ''}
                                onChange={e => setFormData({ ...formData, button_link: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Workshop</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workshops.map(workshop => (
                    <div key={workshop.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group hover:shadow-md transition">
                        <div className={`absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded ${workshop.type === 'live' ? 'bg-red-100 text-red-600' :
                            workshop.type === 'offline' ? 'bg-orange-100 text-orange-600' :
                                'bg-blue-100 text-blue-600'
                            }`}>
                            {workshop.type.toUpperCase()}
                        </div>

                        <h3 className="font-bold text-lg mb-2 pr-12">{workshop.title}</h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-3">{workshop.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {workshop.tags?.map((tag, i) => (
                                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{tag}</span>
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                            <a href={workshop.button_link} target="_blank" rel="noreferrer" className="text-blue-600 text-sm font-medium hover:underline">
                                {workshop.button_text} &rarr;
                            </a>
                            <div className="flex gap-2">
                                {canEdit && (
                                    <>
                                        <button onClick={() => handleEdit(workshop)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(workshop)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Debug Console */}
            {debugLog.length > 0 && (
                <div className="mt-8 p-4 bg-gray-900 rounded-lg overflow-hidden">
                    <h3 className="text-gray-400 text-xs font-bold uppercase mb-2">System Diagnostics Log</h3>
                    <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap h-40 overflow-y-auto">
                        {debugLog.map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default WorkshopManager;
