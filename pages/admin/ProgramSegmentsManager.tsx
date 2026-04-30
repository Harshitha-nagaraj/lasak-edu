import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, GripVertical, PlusCircle, Download } from 'lucide-react';
import { useUserRole } from '../../hooks/useUserRole';

interface ProgramCategory {
    name: string;
    desc?: string;
    icon?: string;
}

interface ProgramSegment {
    id: string;
    segment_id: string;
    badge: string;
    title: string;
    description: string;
    bgColor: string;
    layout?: string;
    categories: ProgramCategory[];
    order_num: number;
}

// Default static segments to seed into Firestore
const DEFAULT_SEGMENTS = [
    {
        segment_id: 'intensive',
        badge: 'Intern while you learn!',
        title: 'Intensive Certification Program',
        description: 'Get an early entry into real workplaces, work alongside experienced professionals, and contribute to real client projects– all while you\'re still learning with intensive internship training programs.',
        bgColor: '#c4a000',
        layout: 'default',
        order_num: 0,
        categories: [
            { name: 'Artificial Intelligence', icon: 'Bot' },
            { name: 'Data Science', icon: 'Code' },
            { name: 'Data Analytics', icon: 'Star' },
            { name: 'Business Analytics', icon: 'Users' },
            { name: 'MERN Stack with UI/UX', icon: 'Code' },
            { name: 'DevOps', icon: 'Settings' },
            { name: 'Digital Marketing with AI', icon: 'Megaphone' }
        ]
    },
    {
        segment_id: 'advanced',
        badge: 'Upskill with a guide!',
        title: 'Advanced Professional Certification Program',
        description: 'Level up your skills and career with job-ready certification programs designed for today\'s competitive world.',
        bgColor: '#a81d1d',
        layout: 'default',
        order_num: 1,
        categories: [
            { name: 'Data Engineering', icon: 'Settings' },
            { name: 'Data Science', icon: 'Code' },
            { name: 'DevOps', icon: 'Settings' },
            { name: 'Data Analytics', icon: 'Star' },
            { name: 'Artificial Intelligence', icon: 'Bot' },
            { name: 'MERN Stack with UI/UX', icon: 'Code' },
            { name: 'Digital Marketing with AI', icon: 'Megaphone' },
            { name: 'Business Analytics', icon: 'Users' },
            { name: 'Banking & Financial Services', icon: 'Briefcase' }
        ]
    },
    {
        segment_id: 'mechanical',
        badge: 'Master Core Design!',
        title: 'Mechanical Courses',
        description: 'Master industry-leading tools and technologies for mechanical design, simulation, and analysis.',
        bgColor: '#d84315',
        layout: 'default',
        order_num: 2,
        categories: [
            { name: '3D Printing & Prototyping', icon: 'Settings' },
            { name: 'ANSA Pre-Processing Course', icon: 'Settings' },
            { name: 'ANSYS Simulation Course', icon: 'Settings' },
            { name: 'AutoCAD Mechanical', icon: 'Settings' },
            { name: 'Computational Fluid Dynamics (CFD)', icon: 'Settings' },
            { name: 'Autodesk Inventor Course', icon: 'Settings' },
            { name: 'Wiring Harness Design Course', icon: 'Settings' },
            { name: 'SolidWorks Masterclass', icon: 'Settings' },
            { name: 'NX CAD (Unigraphics) Course', icon: 'Settings' }
        ]
    },
    {
        segment_id: 'sap',
        badge: 'Learn world-renowned tech!',
        title: 'Global SAP Certification Programs',
        description: 'Get globally recognized and career-ready with hands-on SAP training and official certification programs.',
        bgColor: '#006699',
        layout: 'sap',
        order_num: 3,
        categories: [
            { name: 'SAP Technical', icon: 'Settings', desc: 'Into tech guts? Jump into ABAP, unravel system architecture, and cook up custom SAP solutions that matter. If code is your happy place, well—welcome home.' },
            { name: 'SAP Functional', icon: 'Users', desc: 'Not a coder but love making stuff work better? Mess around with SAP modules like MM, SD, FI. Tweak workflows, smooth out the chaos, and watch businesses run smoother than ever.' }
        ]
    },
    {
        segment_id: 'externship',
        badge: 'Learn abroad!',
        title: 'International Externship Program',
        description: 'Kickstart your international career with hybrid externships that give you a real-world experience and industry exposure.',
        bgColor: '#002b45',
        layout: 'externship',
        order_num: 4,
        categories: [
            { name: 'Artificial Intelligence', icon: 'Bot', desc: 'If you wanna mess with the future—here\'s your playground.' },
            { name: 'Digital Marketing', icon: 'Megaphone', desc: 'Get your hands dirty with real data, play with ads, SEO, all that jazz. No fluff, just straight-up growth tactics.' },
            { name: 'Human Resource', icon: 'Users', desc: 'Walk out prepped for whatever office drama comes your way.' }
        ]
    },
    {
        segment_id: 'online',
        badge: 'Upskill fast!',
        title: 'Online Professional Certification Program',
        description: 'Learn anytime, anywhere with flexible online professional certification programs designed to build practical skills and boost your career.',
        bgColor: '#4a148c',
        layout: 'default',
        order_num: 5,
        categories: [
            { name: 'MERN Stack Development', icon: 'Code' },
            { name: 'Front End Development', icon: 'Code' },
            { name: 'Software Testing', icon: 'CheckCircle' },
            { name: 'Digital Marketing with AI', icon: 'Megaphone' },
            { name: 'Banking and Financial Services', icon: 'Briefcase' },
            { name: 'Business Analytics', icon: 'Users' },
            { name: 'AWS', icon: 'Settings' },
            { name: 'Data Science', icon: 'Code' },
            { name: 'Data Engineering', icon: 'Settings' },
            { name: 'Data Analytics', icon: 'Star' },
            { name: 'Linux', icon: 'Settings' },
            { name: 'Networking', icon: 'Globe' },
            { name: 'UI/UX', icon: 'PenTool' },
            { name: 'Artificial Intelligence', icon: 'Bot' }
        ]
    }
];

const ProgramSegmentsManager = () => {
    const { canEdit } = useUserRole();
    const [segments, setSegments] = useState<ProgramSegment[]>([]);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editData, setEditData] = useState<ProgramSegment>({
        id: '', segment_id: '', badge: '', title: '', description: '', bgColor: '#000000', layout: 'default', categories: [], order_num: 0
    });
    const [isAdding, setIsAdding] = useState(false);
    const [newData, setNewData] = useState<Omit<ProgramSegment, 'id'>>({
        segment_id: '', badge: '', title: '', description: '', bgColor: '#006699', layout: 'default', categories: [], order_num: 0
    });

    useEffect(() => {
        fetchSegments();
    }, []);

    const fetchSegments = async () => {
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, query, orderBy, getDocs } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const q = query(collection(db, 'program_segments'), orderBy('order_num', 'asc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            } as ProgramSegment));
            setSegments(data);
        } catch (error) {
            console.error('Error fetching program segments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newData.title || !newData.segment_id) return;
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const newOrderNum = segments.length > 0
                ? Math.max(...segments.map(c => c.order_num)) + 1
                : 0;

            await addDoc(collection(db, 'program_segments'), {
                ...newData,
                order_num: newOrderNum,
                created_at: serverTimestamp()
            });

            alert('Segment added successfully!');
            setIsAdding(false);
            setNewData({ segment_id: '', badge: '', title: '', description: '', bgColor: '#006699', layout: 'default', categories: [], order_num: 0 });
            fetchSegments();
        } catch (error) {
            console.error('Error adding segment:', error);
            alert('Failed to add segment. Please try again.');
        }
    };

    const handleUpdate = async () => {
        if (!isEditing || !editData.title) return;
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const { id, ...updatePayload } = editData;

            await updateDoc(doc(db, 'program_segments', isEditing), {
                ...updatePayload,
                updated_at: serverTimestamp()
            });
            alert('Segment updated successfully!');
            setIsEditing(null);
            fetchSegments();
        } catch (error) {
            console.error('Error updating segment:', error);
            alert('Failed to update segment.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this segment?')) return;
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, deleteDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await deleteDoc(doc(db, 'program_segments', id));
            fetchSegments();
        } catch (error) {
            console.error('Error deleting segment:', error);
        }
    };

    const handleSeedDefaults = async () => {
        if (!window.confirm('This will add all 6 default program segments to Firestore (any existing ones by the same segment_id will be skipped). Continue?')) return;
        setSeeding(true);
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, addDoc, getDocs, serverTimestamp } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            // Get existing segment_ids to avoid duplicates
            const snapshot = await getDocs(collection(db, 'program_segments'));
            const existingIds = new Set(snapshot.docs.map(d => d.data().segment_id));

            const toAdd = DEFAULT_SEGMENTS.filter(s => !existingIds.has(s.segment_id));

            if (toAdd.length === 0) {
                alert('All default segments already exist in Firestore!');
                setSeeding(false);
                return;
            }

            for (const seg of toAdd) {
                await addDoc(collection(db, 'program_segments'), {
                    ...seg,
                    created_at: serverTimestamp()
                });
            }

            alert(`Successfully added ${toAdd.length} default segment(s) to Firestore!`);
            fetchSegments();
        } catch (error) {
            console.error('Error seeding segments:', error);
            alert('Failed to seed default segments. Please try again.');
        } finally {
            setSeeding(false);
        }
    };

    // Helper for nested categories
    const updateCategory = (data: any, setData: any, idx: number, field: string, val: string) => {
        const newCats = [...data.categories];
        newCats[idx] = { ...newCats[idx], [field]: val };
        setData({ ...data, categories: newCats });
    };
    const addCategory = (data: any, setData: any) => {
        setData({ ...data, categories: [...data.categories, { name: '', desc: '', icon: 'Settings' }] });
    };
    const removeCategory = (data: any, setData: any, idx: number) => {
        const newCats = [...data.categories];
        newCats.splice(idx, 1);
        setData({ ...data, categories: newCats });
    };

    const renderFormCard = (data: any, setData: any, onSave: any, onCancel: any, isNew = false) => (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 mb-6 relative">
            <h3 className="font-bold text-lg mb-4">{isNew ? 'Add New Segment' : 'Edit Segment'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Segment ID</label>
                    <input type="text" className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" value={data.segment_id} onChange={e => setData({ ...data, segment_id: e.target.value })} placeholder="e.g. advanced" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Order Number</label>
                    <input type="number" className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" value={data.order_num || 0} onChange={e => setData({ ...data, order_num: parseInt(e.target.value) || 0 })} disabled={isNew} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
                    <input type="text" className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" value={data.title} onChange={e => setData({ ...data, title: e.target.value })} placeholder="Title" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Badge Text</label>
                    <input type="text" className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" value={data.badge} onChange={e => setData({ ...data, badge: e.target.value })} placeholder="Badge" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                    <textarea className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm h-20 outline-none focus:ring-2 focus:ring-blue-500 resize-none" value={data.description} onChange={e => setData({ ...data, description: e.target.value })} placeholder="Description" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Background Color</label>
                    <div className="flex gap-2">
                        <input type="color" className="h-9 w-9 rounded cursor-pointer" value={data.bgColor} onChange={e => setData({ ...data, bgColor: e.target.value })} />
                        <input type="text" className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm outline-none" value={data.bgColor} onChange={e => setData({ ...data, bgColor: e.target.value })} />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Layout</label>
                    <select className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" value={data.layout || 'default'} onChange={e => setData({ ...data, layout: e.target.value })}>
                        <option value="default">Default Ticker</option>
                        <option value="sap">SAP Layout (2 col)</option>
                        <option value="externship">Externship Layout (3 col)</option>
                    </select>
                </div>
            </div>

            <div className="mb-6 p-4 border rounded-xl bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-sm">Categories / Items</h4>
                    <button onClick={() => addCategory(data, setData)} className="flex items-center gap-1 text-xs text-blue-600 font-bold hover:bg-blue-100 px-2 py-1 rounded">
                        <PlusCircle size={14} /> Add Item
                    </button>
                </div>
                <div className="space-y-3">
                    {(data.categories || []).map((cat: any, idx: number) => (
                        <div key={idx} className="flex gap-3 items-start bg-white p-3 rounded-lg border shadow-sm relative">
                            <button onClick={() => removeCategory(data, setData, idx)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 shadow hover:bg-red-200">
                                <X size={12} />
                            </button>
                            <div className="flex-1 space-y-2">
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Name" className="flex-1 px-2 py-1 border rounded text-xs outline-none" value={cat.name} onChange={e => updateCategory(data, setData, idx, 'name', e.target.value)} />
                                    <input type="text" placeholder="Icon (e.g. Code)" className="w-24 px-2 py-1 border rounded text-xs outline-none" value={cat.icon || ''} onChange={e => updateCategory(data, setData, idx, 'icon', e.target.value)} />
                                </div>
                                <textarea placeholder="Description (Optional)" className="w-full px-2 py-1 border rounded text-xs h-12 outline-none resize-none" value={cat.desc || ''} onChange={e => updateCategory(data, setData, idx, 'desc', e.target.value)} />
                            </div>
                        </div>
                    ))}
                    {(!data.categories || data.categories.length === 0) && (
                        <p className="text-xs text-gray-500 italic text-center py-2">No categories added yet.</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
                <button onClick={onCancel} className="px-4 py-2 border rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
                <button onClick={onSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-sm font-semibold text-white hover:bg-blue-700 shadow flex items-center">
                    <Save size={16} /> Save Segment
                </button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Program Segments</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage the sliding program segments on the home page.</p>
                    {segments.length === 0 && !loading && (
                        <p className="text-amber-600 text-xs mt-1 font-semibold">⚠ No segments in Firestore. Click "Load Defaults" to populate all 6 existing cards.</p>
                    )}
                </div>
                {canEdit && (
                    <div className="flex gap-2">
                        {!isAdding && segments.length < DEFAULT_SEGMENTS.length && (
                            <button
                                onClick={handleSeedDefaults}
                                disabled={seeding}
                                className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition-all font-semibold shadow-md disabled:opacity-60"
                            >
                                <Download size={18} /> {seeding ? 'Loading...' : 'Load Defaults'}
                            </button>
                        )}
                        {!isAdding && (
                            <button
                                onClick={() => setIsAdding(true)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md shadow-blue-500/20"
                            >
                                <Plus size={20} /> Add Segment
                            </button>
                        )}
                    </div>
                )}
            </div>

            {isAdding && renderFormCard(newData, setNewData, handleAdd, () => setIsAdding(false), true)}

            <div className="grid grid-cols-1 space-y-4">
                {segments.map((segment) => (
                    <React.Fragment key={segment.id}>
                        {isEditing === segment.id ? (
                            renderFormCard(editData, setEditData, handleUpdate, () => setIsEditing(null), false)
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row gap-5 items-start relative group">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 shadow-inner" style={{ backgroundColor: segment.bgColor }}>
                                    {segment.order_num}
                                </div>
                                <div className="flex-1">
                                    <div className="flex gap-2 items-center mb-1">
                                        <h3 className="font-bold text-xl">{segment.title}</h3>
                                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase font-bold">{segment.badge}</span>
                                        <span className="text-[10px] border px-2 py-0.5 rounded text-gray-400">ID: {segment.segment_id}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">{segment.description}</p>
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        <span className="font-semibold text-gray-400">Items:</span>
                                        {segment.categories && segment.categories.map((c, i) => (
                                            <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md mb-1">{c.name}</span>
                                        ))}
                                    </div>
                                </div>
                                {canEdit && (
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setIsEditing(segment.id);
                                                setEditData(segment);
                                            }}
                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg bg-gray-50"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(segment.id)}
                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg bg-gray-50"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </React.Fragment>
                ))}
                {segments.length === 0 && !isAdding && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed">
                        <p className="text-gray-400 italic">No segments found. Click "Add Segment" to start.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgramSegmentsManager;
