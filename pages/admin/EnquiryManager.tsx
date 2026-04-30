import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, Calendar, User, Trash2, X, CheckCircle, Clock } from 'lucide-react';
import { useUserRole } from '../../hooks/useUserRole';

interface Enquiry {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    qualification: string;
    department: string;
    status: string;
    source: string;
    message: string;
    interested_course?: string; // Optional for backward compatibility
    promo_code?: string;
    scholarship_discount?: number;
    is_read: boolean;
    created_at: string;
}

const EnquiryManager = () => {
    const { canEdit } = useUserRole();
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, getDocs } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const enquiriesRef = collection(db, 'enquiries');
            const querySnapshot = await getDocs(enquiriesRef);

            const fetchedEnquiries: Enquiry[] = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const createdAt = data.created_at || data.createdAt;

                return {
                    id: doc.id,
                    ...data,
                    // Robust field mapping for backward compatibility and safety
                    full_name: data.full_name || data.fullName || 'Unknown',
                    email: data.email || 'No email',
                    phone: data.phone || 'No phone',
                    qualification: data.qualification || '',
                    department: data.department || data.interestedCourse || 'General',
                    status: data.status || '',
                    source: data.source || data.applyFrom || 'Website',
                    message: data.message || '',
                    created_at: createdAt?.toDate ? createdAt.toDate().toISOString() : (createdAt || new Date().toISOString())
                } as Enquiry;
            });

            // Safe filter
            const safeEnquiries = fetchedEnquiries.filter(e => e && e.full_name);

            safeEnquiries.sort((a: any, b: any) => {
                const aTime = new Date(a.created_at || 0).getTime();
                const bTime = new Date(b.created_at || 0).getTime();
                return bTime - aTime;
            });
            setEnquiries(safeEnquiries);
        } catch (error) {
            console.error('Error fetching enquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleReadStatus = async (id: string, currentStatus: boolean) => {
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, updateDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const enquiryRef = doc(db, 'enquiries', id);
            await updateDoc(enquiryRef, { is_read: !currentStatus });

            setEnquiries(enquiries.map(e => e.id === id ? { ...e, is_read: !currentStatus } : e));
            if (selectedEnquiry?.id === id) setSelectedEnquiry({ ...selectedEnquiry, is_read: !currentStatus });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const deleteEnquiry = async (id: string) => {
        if (!confirm('Are you sure you want to delete this enquiry?')) return;
        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, deleteDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await deleteDoc(doc(db, 'enquiries', id));
            setEnquiries(enquiries.filter(e => e.id !== id));
            setSelectedEnquiry(null);
        } catch (error) {
            console.error('Error deleting enquiry:', error);
        }
    };

    const filteredEnquiries = enquiries.filter(e => {
        const name = (e.full_name || '').toLowerCase();
        const email = (e.email || '').toLowerCase();
        const phone = (e.phone || '');
        const search = searchTerm.toLowerCase();

        return name.includes(search) || phone.includes(searchTerm) || email.includes(search);
    });

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Enquiries & Leads</h1>
                    <p className="text-gray-500">Track and manage student enquiries from the website</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold border border-blue-100">
                        {enquiries.length} Total Submission{enquiries.length !== 1 ? 's' : ''}
                    </div>
                </div>
            </header>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
            </div>

            {/* List */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Contact</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Department</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-gray-400 italic">Loading enquiries...</td>
                                </tr>
                            ) : filteredEnquiries.map((enquiry) => (
                                <tr
                                    key={enquiry.id}
                                    className={`hover:bg-blue-50/30 transition-colors cursor-pointer ${!enquiry.is_read ? 'bg-blue-50/10' : ''}`}
                                    onClick={() => setSelectedEnquiry(enquiry)}
                                >
                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                        <div className="flex items-center gap-3">
                                            {!enquiry.is_read && <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0" />}
                                            {enquiry.full_name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600">{enquiry.phone}</div>
                                        <div className="text-xs text-gray-400">{enquiry.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold uppercase py-1 px-2 bg-gray-100 text-gray-600 rounded-md">
                                            {enquiry.department}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                        {new Date(enquiry.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {enquiry.is_read ? (
                                            <span className="flex items-center gap-1.5 text-xs text-green-600 font-semibold bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                                                <CheckCircle size={14} /> Processed
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                                                <Clock size={14} /> New Lead
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {canEdit && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteEnquiry(enquiry.id); }}
                                                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!loading && filteredEnquiries.length === 0 && (
                        <div className="p-20 text-center">
                            <h3 className="text-lg font-medium text-gray-400 italic">No enquiries found</h3>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            
                {selectedEnquiry && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setSelectedEnquiry(null)}
                        />
                        <div
                            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
                        >
                            <header className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-600 text-white rounded-xl">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{selectedEnquiry.full_name}</h2>
                                        <p className="text-sm text-gray-500">Submitted {new Date(selectedEnquiry.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedEnquiry(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </header>

                            <div className="p-8 space-y-8">
                                <section className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                                        <p className="font-semibold text-gray-900 flex items-center gap-2"><Phone size={16} className="text-blue-500" /> {selectedEnquiry.phone}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                                        <p className="font-semibold text-gray-900 flex items-center gap-2"><Mail size={16} className="text-purple-500" /> {selectedEnquiry.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qualification</label>
                                        <p className="font-semibold text-gray-900 uppercase">{selectedEnquiry.qualification}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Course Interested</label>
                                        <p className="font-semibold text-gray-900 text-blue-600">{selectedEnquiry.department}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Status</label>
                                        <p className="font-semibold text-gray-900">{selectedEnquiry.status}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Source</label>
                                        <p className="font-semibold text-gray-900">{selectedEnquiry.source}</p>
                                    </div>
                                    {selectedEnquiry.promo_code && (
                                        <div className="space-y-1 bg-green-50 p-2 rounded-lg border border-green-100">
                                            <label className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Applied Coupon</label>
                                            <p className="font-bold text-green-700">{selectedEnquiry.promo_code}</p>
                                        </div>
                                    )}
                                    {selectedEnquiry.scholarship_discount ? (
                                        <div className="space-y-1 bg-blue-50 p-2 rounded-lg border border-blue-100">
                                            <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Scholarship Discount</label>
                                            <p className="font-bold text-blue-700">₹{selectedEnquiry.scholarship_discount.toLocaleString('en-IN')}</p>
                                        </div>
                                    ) : null}
                                </section>

                                <section className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Additional Details / Address</label>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 whitespace-pre-wrap min-h-[100px]">
                                        {selectedEnquiry.message || 'No additional message provided'}
                                    </div>
                                </section>

                                <footer className="flex justify-between items-center pt-4">
                                    <button
                                        onClick={() => toggleReadStatus(selectedEnquiry.id, selectedEnquiry.is_read)}
                                        className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 ${selectedEnquiry.is_read ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-600 text-white hover:bg-green-700 shadow-green-100'}`}
                                    >
                                        {selectedEnquiry.is_read ? 'Mark as New Lead' : 'Mark as Processed'}
                                    </button>
                                    {canEdit && (
                                        <button
                                            onClick={() => deleteEnquiry(selectedEnquiry.id)}
                                            className="text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2"
                                        >
                                            <Trash2 size={18} /> Delete Record
                                        </button>
                                    )}
                                </footer>
                            </div>
                        </div>
                    </div>
                )}
            
        </div>
    );
};

export default EnquiryManager;
