import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Award, AlertCircle } from 'lucide-react';
import { useUserRole } from '../../hooks/useUserRole';
import { motion } from 'framer-motion';

interface Certificate {
    id: string;
    cert_id: string;
    student_name: string;
    course_name: string;
    duration: string;
    status: string;
    completion_date: string | null;
    created_at: string;
}

const CertificateManager = () => {
    const { canEdit } = useUserRole();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: string; certId: string }>({
        show: false,
        id: '',
        certId: ''
    });

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            setError(null);
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { collection, getDocs } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const querySnapshot = await getDocs(collection(db, 'certificates'));
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Certificate));
            data.sort((a: any, b: any) => {
                const aTime = a.created_at?.toMillis?.() || new Date(a.completion_date || 0).getTime();
                const bTime = b.created_at?.toMillis?.() || new Date(b.completion_date || 0).getTime();
                return bTime - aTime;
            });
            setCertificates(data);
        } catch (err: any) {
            console.error('Error fetching certificates:', err);
            setError(err.message || 'Failed to load certificates');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id: string, certId: string) => {
        setDeleteModal({ show: true, id, certId });
    };

    const confirmDelete = async () => {
        const { id, certId } = deleteModal;
        setDeleteModal({ show: false, id: '', certId: '' });

        try {
            const { getFirestoreDb } = await import('../../lib/firebase');
            const { doc, deleteDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            await deleteDoc(doc(db, 'certificates', id));
            setCertificates(certificates.filter(cert => cert.id !== id));
            alert('Certificate deleted successfully!');
        } catch (err: any) {
            console.error('Error deleting certificate:', err);
            alert('Failed to delete certificate: ' + err.message);
        }
    };

    const cancelDelete = () => {
        setDeleteModal({ show: false, id: '', certId: '' });
    };

    const filteredCertificates = certificates.filter(cert =>
        cert.cert_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.course_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Award className="text-blue-600" size={32} />
                        Certificate Management
                    </h1>
                    <p className="text-gray-500 mt-1">Manage student certificates and verification records</p>
                </div>
                {canEdit && (
                    <Link
                        to="/admin/certificates/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                        <Plus size={20} />
                        Add New Certificate
                    </Link>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-700">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Certificate ID, Student Name, or Course..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-sm text-gray-500 mb-1">Total Certificates</div>
                    <div className="text-3xl font-bold text-gray-900">{certificates.length}</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-sm text-gray-500 mb-1">Completed</div>
                    <div className="text-3xl font-bold text-green-600">
                        {certificates.filter(c => c.status === 'Completed').length}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-sm text-gray-500 mb-1">Search Results</div>
                    <div className="text-3xl font-bold text-blue-600">{filteredCertificates.length}</div>
                </div>
            </div>

            {/* Certificates Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Certificate ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Student Name
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Course
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Duration
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Completion Date
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredCertificates.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        {searchTerm ? 'No certificates found matching your search.' : 'No certificates yet. Add your first certificate!'}
                                    </td>
                                </tr>
                            ) : (
                                filteredCertificates.map((cert) => (
                                    <motion.tr
                                        key={cert.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-semibold text-blue-600">
                                                {cert.cert_id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                            {cert.student_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {cert.course_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {cert.duration}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${cert.status === 'Completed'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {cert.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {cert.completion_date || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {canEdit && (
                                                    <>
                                                        <Link
                                                            to={`/admin/certificates/${cert.id}`}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={18} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteClick(cert.id, cert.cert_id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertCircle className="text-red-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Delete Certificate</h3>
                                <p className="text-sm text-gray-500">This action cannot be undone</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete certificate <span className="font-mono font-bold text-blue-600">{deleteModal.certId}</span>?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default CertificateManager;
