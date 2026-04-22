import React, { useState, useEffect } from 'react';
import { useUserRole } from '../../hooks/useUserRole';
import { Save, Plus, Trash2, Phone, Mail, MapPin, Globe, Edit, Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

interface ContactInfo {
    id: string;
    type: string;
    label: string;
    value: string;
    icon: string;
    branch?: string;
    directions_url?: string | null;
    order_num: number;
    active: boolean;
}

const ContactInfoManager = () => {
    const { canEdit } = useUserRole();
    const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newContact, setNewContact] = useState({
        type: 'phone',
        label: '',
        value: '',
        icon: 'Phone',
        branch: 'main',
        directions_url: ''
    });

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const fetchContactInfo = async () => {
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, query, orderBy, getDocs } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const snapshot = await getDocs(query(collection(db, 'contact_info'), orderBy('order_num', 'asc')));
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactInfo));
            setContactInfo(data || []);
        } catch (error: any) {
            console.error('Error fetching contact info:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, addDoc, doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const contactData = {
                type: newContact.type,
                label: newContact.label,
                value: newContact.value,
                icon: newContact.icon,
                branch: newContact.branch || '',
                directions_url: newContact.type === 'address' ? newContact.directions_url || null : null,
                updated_at: serverTimestamp()
            };

            if (editingId) {
                // Update existing
                await updateDoc(doc(db, 'contact_info', editingId), contactData);
                alert('Contact info updated successfully!');
            } else {
                // Insert new
                const maxOrder = contactInfo.length > 0
                    ? Math.max(...contactInfo.map(c => c.order_num))
                    : -1;

                await addDoc(collection(db, 'contact_info'), {
                    ...contactData,
                    order_num: maxOrder + 1,
                    active: true,
                    created_at: serverTimestamp()
                });

                alert('Contact info added successfully!');
            }

            fetchContactInfo();
            setIsAdding(false);
            setEditingId(null);
            setNewContact({ type: 'phone', label: '', value: '', icon: 'Phone', branch: 'main', directions_url: '' });
        } catch (error: any) {
            console.error('Error saving contact info:', error);
            alert('Error saving contact info: ' + error.message);
        }
    };

    const handleEdit = (contact: ContactInfo) => {
        setNewContact({
            type: contact.type,
            label: contact.label,
            value: contact.value,
            icon: contact.icon,
            branch: contact.branch || 'main',
            directions_url: contact.directions_url || ''
        });
        setEditingId(contact.id);
        setIsAdding(true);
        // Scroll to top to see form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this contact info?')) return;

        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, deleteDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await deleteDoc(doc(db, 'contact_info', id));
            fetchContactInfo();
        } catch (error: any) {
            console.error('Error deleting contact info:', error);
            alert('Error deleting contact info: ' + error.message);
        }
    };

    const handleToggleActive = async (id: string, currentActive: boolean) => {
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, updateDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await updateDoc(doc(db, 'contact_info', id), { active: !currentActive });
            fetchContactInfo();
        } catch (error: any) {
            console.error('Error toggling active:', error);
            alert('Error updating contact info: ' + error.message);
        }
    };

    const seedDefaultData = async () => {
        if (!confirm('This will add default contact information for Peelamedu & Gandhipuram branches plus social media links. Continue?')) return;

        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const defaultContacts = [
                { type: 'address', label: 'Peelamedu Branch', value: '11A, STV Nagar, Peelamedu, Nava India Signal, Coimbatore - 641004', icon: 'MapPin', branch: 'Peelamedu Branch', directions_url: 'https://maps.google.com/?q=LASAK+EDU+Peelamedu+Coimbatore', order_num: 0, active: true },
                { type: 'phone', label: 'Phone Number', value: '+91 7418 734 466', icon: 'Phone', branch: 'Peelamedu Branch', directions_url: null, order_num: 1, active: true },
                { type: 'email', label: 'Email Address', value: 'info@lasakedu.in', icon: 'Mail', branch: 'Peelamedu Branch', directions_url: null, order_num: 2, active: true },
                { type: 'address', label: 'Gandhipuram Branch', value: 'No.655 F Shri Paaththaa avenue 1st floor above Cheran tarpaulin Near Gp signal Gandhipuram -12', icon: 'MapPin', branch: 'Gandhipuram Branch', directions_url: 'https://maps.google.com/?q=LASAK+EDU+Gandhipuram+Coimbatore', order_num: 3, active: true },
                { type: 'phone', label: 'Phone Number', value: '+91 74187 32525', icon: 'Phone', branch: 'Gandhipuram Branch', directions_url: null, order_num: 4, active: true },
                { type: 'email', label: 'Email Address', value: 'info@lasakedu.in', icon: 'Mail', branch: 'Gandhipuram Branch', directions_url: null, order_num: 5, active: true },
                { type: 'social', label: 'Instagram', value: 'https://www.instagram.com/lasakedu/', icon: 'Instagram', branch: '', directions_url: null, order_num: 6, active: true },
                { type: 'social', label: 'Facebook', value: 'https://www.facebook.com/lasakedu/', icon: 'Facebook', branch: '', directions_url: null, order_num: 7, active: true },
                { type: 'social', label: 'YouTube', value: 'https://www.youtube.com/@lasakedu', icon: 'Youtube', branch: '', directions_url: null, order_num: 8, active: true },
                { type: 'social', label: 'LinkedIn', value: 'https://www.linkedin.com/company/lasakedu/', icon: 'Linkedin', branch: '', directions_url: null, order_num: 9, active: true },
            ];

            for (const contact of defaultContacts) {
                await addDoc(collection(db, 'contact_info'), {
                    ...contact,
                    created_at: serverTimestamp(),
                    updated_at: serverTimestamp()
                });
            }

            alert('Default contact data seeded successfully!');
            fetchContactInfo();
        } catch (error: any) {
            console.error('Error seeding data:', error);
            alert('Error seeding data: ' + error.message);
        }
    };

    const getIconComponent = (iconName: string) => {
        const icons: any = {
            Phone,
            Mail,
            MapPin,
            Globe,
            Facebook,
            Instagram,
            Linkedin,
            Twitter,
            Youtube
        };
        const Icon = icons[iconName] || Globe;
        return <Icon size={20} />;
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-center text-gray-500">Loading contact information...</div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Contact & Social Links</h1>
                    <p className="text-gray-600 mt-1">Manage contact details and social media links displayed on the website</p>
                </div>
                {canEdit && (
                    <button
                        onClick={() => {
                            setIsAdding(!isAdding);
                            if (!isAdding) {
                                setEditingId(null);
                                setNewContact({ type: 'phone', label: '', value: '', icon: 'Phone', directions_url: '' });
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        {isAdding ? 'Cancel' : 'Add Contact Info'}
                    </button>
                )}
            </div>

            {/* Add New Form */}
            {isAdding && (
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{editingId ? 'Edit Information' : 'Add New Info/Link'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={newContact.type}
                                    onChange={(e) => {
                                        const type = e.target.value;
                                        let icon = 'Phone';
                                        if (type === 'email') icon = 'Mail';
                                        else if (type === 'address') icon = 'MapPin';
                                        else if (type === 'website') icon = 'Globe';
                                        setNewContact({ ...newContact, type, icon });
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="phone">Phone</option>
                                    <option value="email">Email</option>
                                    <option value="address">Address</option>
                                    <option value="website">Website</option>
                                    <option value="social_media">Social Media</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Branch / Group</label>
                                <select
                                    value={newContact.branch}
                                    onChange={(e) => setNewContact({ ...newContact, branch: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="main">Main Office (STV Nagar)</option>
                                    <option value="gandhipuram">Gandhipuram Branch</option>
                                    <option value="other">Other / No Group</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                                <select
                                    value={newContact.icon}
                                    onChange={(e) => setNewContact({ ...newContact, icon: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Phone">Phone</option>
                                    <option value="Mail">Mail</option>
                                    <option value="MapPin">Location</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="Linkedin">LinkedIn</option>
                                    <option value="Facebook">Facebook</option>
                                    <option value="Twitter">Twitter/X</option>
                                    <option value="Youtube">YouTube</option>
                                    <option value="Globe">Other/Website</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                                <input
                                    type="text"
                                    value={newContact.label}
                                    onChange={(e) => setNewContact({ ...newContact, label: e.target.value })}
                                    placeholder="e.g., Main Office, Support Email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                            <input
                                type="text"
                                value={newContact.value}
                                onChange={(e) => setNewContact({ ...newContact, value: e.target.value })}
                                placeholder="e.g., +91 1234567890, info@example.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Directions URL - Only show for address type */}
                        {newContact.type === 'address' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Directions URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    value={newContact.directions_url}
                                    onChange={(e) => setNewContact({ ...newContact, directions_url: e.target.value })}
                                    placeholder="e.g., https://maps.google.com/?q=place_id:ChIJXXXXXXXXXXXX"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Leave empty to auto-generate from address. For custom links, use Google Maps share URL or any navigation link.
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Save size={20} />
                            {editingId ? 'Update Contact Info' : 'Add Contact Info'}
                        </button>
                    </form>
                </div >
            )}

            {/* Contact Info List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {contactInfo.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        <p className="mb-4">No contact information found. Click "Add Contact Info" to get started.</p>
                        {canEdit && (
                            <button
                                onClick={seedDefaultData}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                🌱 Seed Default Contact Data
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {contactInfo.map((contact) => (
                            <div
                                key={contact.id}
                                className={`flex items-center gap-4 p-4 rounded-lg border ${contact.active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300'
                                    }`}
                            >
                                {/* Icon */}
                                <div className={`p-2 rounded-lg ${contact.active ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'
                                    }`}>
                                    {getIconComponent(contact.icon)}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-500 uppercase">{contact.type}</span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-sm font-medium text-gray-700">{contact.label}</span>
                                    </div>
                                    <div className="text-gray-900 mt-1">{contact.value}</div>
                                </div>

                                {/* Actions */}
                                {canEdit && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(contact)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleToggleActive(contact.id, contact.active)}
                                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${contact.active
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                                }`}
                                        >
                                            {contact.active ? 'Active' : 'Inactive'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(contact.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
};

export default ContactInfoManager;
