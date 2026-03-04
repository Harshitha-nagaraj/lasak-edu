import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Save, Plus, Trash2, Edit2 } from 'lucide-react';
import { useUserRole } from '../../hooks/useUserRole';

interface AboutContent {
    id: string;
    section: string;
    content: any;
    order_num: number;
    active: boolean;
}

const AboutContentManager = () => {
    const { canEdit } = useUserRole();
    const [contents, setContents] = useState<AboutContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<any>({});

    useEffect(() => {
        fetchContents();
    }, []);

    const fetchContents = async () => {
        try {
            const snapshot = await getDocs(query(collection(db, 'about_content'), orderBy('order_num', 'asc')));
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AboutContent));
            setContents(data || []);
        } catch (error: any) {
            console.error('Error fetching about content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (content: AboutContent) => {
        setEditingId(content.id);
        setEditForm(content.content);
    };

    const handleSave = async (id: string, section: string) => {
        try {
            // Clean up the form data before saving
            let cleanedForm = { ...editForm };

            // If this is core_values or why_choose_us, trim icon names
            if (['core_values', 'why_choose_us'].includes(section) && editForm.items && Array.isArray(editForm.items)) {
                cleanedForm.items = editForm.items.map((item: any) => ({
                    ...item,
                    icon: item.icon ? item.icon.trim() : item.icon,
                    title: item.title ? item.title.trim() : item.title
                }));
            }

            await updateDoc(doc(db, 'about_content', id), {
                content: cleanedForm,
                updated_at: serverTimestamp()
            });

            alert('Content updated successfully!');
            setEditingId(null);
            fetchContents();
        } catch (error: any) {
            console.error('Error updating content:', error);
            alert('Error updating content: ' + error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this content?')) return;

        try {
            await deleteDoc(doc(db, 'about_content', id));
            fetchContents();
        } catch (error: any) {
            console.error('Error deleting content:', error);
            alert('Error deleting content: ' + error.message);
        }
    };

    const renderEditForm = (content: AboutContent) => {
        if (editingId !== content.id) return null;

        switch (content.section) {
            case 'intro':
            case 'mission':
            case 'vision':
            case 'journey':
                return (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={editForm.title || ''}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={editForm.description || ''}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                                <input
                                    type="text"
                                    value={editForm.image || ''}
                                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">Leave empty to use the default website image.</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleSave(content.id, content.section)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'team_member':
                return (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={editForm.name || ''}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <input
                                    type="text"
                                    value={editForm.role || ''}
                                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={editForm.desc || ''}
                                    onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    value={editForm.image || ''}
                                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleSave(content.id, content.section)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'teaching_approach':
            case 'infrastructure':
                return (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={editForm.title || ''}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={editForm.description || ''}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bullet Points</label>
                                <div className="space-y-2">
                                    {(editForm.items || []).map((item: string, index: number) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={item}
                                                onChange={(e) => {
                                                    const newItems = [...(editForm.items || [])];
                                                    newItems[index] = e.target.value;
                                                    setEditForm({ ...editForm, items: newItems });
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newItems = (editForm.items || []).filter((_: any, i: number) => i !== index);
                                                    setEditForm({ ...editForm, items: newItems });
                                                }}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setEditForm({ ...editForm, items: [...(editForm.items || []), ''] })}
                                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        <Plus size={16} /> Add Point
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    value={editForm.image || ''}
                                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleSave(content.id, content.section)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'why_choose_us':
                return (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={editForm.title || ''}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                <input
                                    type="text"
                                    value={editForm.subtitle || ''}
                                    onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reasons</label>
                                <div className="space-y-3">
                                    {(editForm.items || []).map((item: any, index: number) => (
                                        <div key={index} className="flex flex-col gap-2 p-3 bg-white rounded border border-gray-200">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={item.title}
                                                    placeholder="Title (e.g. Practical Learning)"
                                                    onChange={(e) => {
                                                        const newItems = [...(editForm.items || [])];
                                                        newItems[index] = { ...item, title: e.target.value };
                                                        setEditForm({ ...editForm, items: newItems });
                                                    }}
                                                    className="w-1/2 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newItems = (editForm.items || []).filter((_: any, i: number) => i !== index);
                                                        setEditForm({ ...editForm, items: newItems });
                                                    }}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                value={item.desc}
                                                placeholder="Description"
                                                onChange={(e) => {
                                                    const newItems = [...(editForm.items || [])];
                                                    newItems[index] = { ...item, desc: e.target.value };
                                                    setEditForm({ ...editForm, items: newItems });
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setEditForm({ ...editForm, items: [...(editForm.items || []), { title: '', desc: '' }] })}
                                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        <Plus size={16} /> Add Reason
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleSave(content.id, content.section)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'core_values':
                return (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={editForm.title || ''}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg text-xs">
                                <p className="font-semibold text-gray-700 mb-2">📋 Available Icons:</p>
                                <div className="grid grid-cols-4 gap-1 text-gray-600">
                                    <div><strong>Basic:</strong> CheckCircle, Clock, Heart, Users, Target, Eye, Monitor, BookOpen, User</div>
                                    <div><strong>Success:</strong> Star, Award, Shield, Zap, TrendingUp, ThumbsUp, Trophy</div>
                                    <div><strong>Ideas:</strong> Lightbulb, Rocket, Gift, Smile</div>
                                    <div><strong>Communication:</strong> MessageCircle, Phone, Mail, Globe, Home</div>
                                    <div><strong>Security:</strong> Settings, Lock, Unlock, Key, Search</div>
                                    <div><strong>Files:</strong> Calendar, FileText, Folder, Download, Upload, Share2</div>
                                    <div><strong>Info:</strong> AlertCircle, Info, HelpCircle, XCircle, AlertTriangle</div>
                                    <div><strong>Professional:</strong> Briefcase, GraduationCap, Code, Cpu, Database, Server</div>
                                    <div><strong>Media:</strong> Camera, Image, Video, Music, Headphones, Mic</div>
                                    <div><strong>Business:</strong> ShoppingCart, CreditCard, DollarSign, BarChart, PieChart</div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Values</label>
                                <div className="space-y-4">
                                    {(editForm.items || []).map((item: any, index: number) => (
                                        <div key={index} className="flex flex-col gap-2 p-3 bg-white rounded border border-gray-200">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={item.title}
                                                    placeholder="Title (e.g. Quality)"
                                                    onChange={(e) => {
                                                        const newItems = [...(editForm.items || [])];
                                                        newItems[index] = { ...item, title: e.target.value };
                                                        setEditForm({ ...editForm, items: newItems });
                                                    }}
                                                    className="w-1/3 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                                <input
                                                    type="text"
                                                    value={item.icon || ''}
                                                    placeholder="Icon Name (e.g. CheckCircle)"
                                                    onChange={(e) => {
                                                        const newItems = [...(editForm.items || [])];
                                                        newItems[index] = { ...item, icon: e.target.value };
                                                        setEditForm({ ...editForm, items: newItems });
                                                    }}
                                                    className="w-1/3 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newItems = (editForm.items || []).filter((_: any, i: number) => i !== index);
                                                        setEditForm({ ...editForm, items: newItems });
                                                    }}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                value={item.text}
                                                placeholder="Description"
                                                onChange={(e) => {
                                                    const newItems = [...(editForm.items || [])];
                                                    newItems[index] = { ...item, text: e.target.value };
                                                    setEditForm({ ...editForm, items: newItems });
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setEditForm({ ...editForm, items: [...(editForm.items || []), { title: '', text: '', icon: 'CheckCircle' }] })}
                                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        <Plus size={16} /> Add Value
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleSave(content.id, content.section)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-center text-gray-500">Loading about content...</div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">About Page Content</h1>
                <p className="text-gray-600 mt-1">Manage mission, vision, team members, and other about page content</p>
            </div>

            {contents.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <p className="text-gray-500 mb-4">No about content found</p>
                    <p className="text-sm text-gray-400">Run the migration to populate initial content</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {contents.map((content) => (
                        <div
                            key={content.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 capitalize">{content.section}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {content.section === 'team_member' && `Team Member: ${content.content.name || 'Unnamed'}`}
                                        {content.section === 'mission' && 'Company Mission Statement'}
                                        {content.section === 'vision' && 'Company Vision Statement'}
                                        {content.section === 'intro' && 'About Page Introduction'}
                                        {content.section === 'journey' && 'Our Journey'}
                                        {content.section === 'teaching_approach' && 'Teaching Methodology & Approach'}
                                        {content.section === 'infrastructure' && 'Infrastructure & Facilities'}
                                        {content.section === 'why_choose_us' && 'Why Choose Us Section'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {canEdit && (
                                        <>
                                            <button
                                                onClick={() => handleEdit(content)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(content.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Display Content */}
                            <div className="text-sm text-gray-700 space-y-2">
                                {content.content.title && (
                                    <div>
                                        <span className="font-medium">Title:</span> {content.content.title}
                                    </div>
                                )}
                                {content.section === 'core_values' && content.content.items && (
                                    <div>
                                        <span className="font-medium">Values:</span>
                                        <ul className="list-disc pl-5 mt-1 text-gray-600">
                                            {content.content.items.map((item: any, i: number) => (
                                                <li key={i}>{item.title} - {item.text}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {content.content.name && (
                                    <div>
                                        <span className="font-medium">Name:</span> {content.content.name}
                                    </div>
                                )}
                                {content.content.role && (
                                    <div>
                                        <span className="font-medium">Role:</span> {content.content.role}
                                    </div>
                                )}
                                {content.content.desc && (
                                    <div>
                                        <span className="font-medium">Description:</span>
                                        <p className="mt-1 text-gray-600">{content.content.desc}</p>
                                    </div>
                                )}
                                {content.content.description && (
                                    <div>
                                        <span className="font-medium">Description:</span>
                                        <p className="mt-1 text-gray-600">{content.content.description}</p>
                                    </div>
                                )}
                            </div>

                            {/* Edit Form */}
                            {renderEditForm(content)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AboutContentManager;
