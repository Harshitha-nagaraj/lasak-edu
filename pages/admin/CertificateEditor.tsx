import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Award } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useUserRole } from '../../hooks/useUserRole';

interface CertificateForm {
    cert_id: string;
    student_name: string;
    course_name: string;
    duration: string;
    status: string;
    completion_date: string;
}

const CertificateEditor = () => {
    const { canEdit } = useUserRole();
    const params = useParams<{ id?: string }>();
    const { id } = params;
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we're on the /new route
    const isNew = location.pathname.endsWith('/new');

    console.log('CertificateEditor - params:', params, 'id:', id, 'isNew:', isNew, 'pathname:', location.pathname);


    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<CertificateForm>({
        cert_id: '',
        student_name: '',
        course_name: '',
        duration: '',
        status: 'Completed',
        completion_date: '',
    });

    useEffect(() => {
        if (!isNew && id) {
            fetchCertificate();
        }
    }, [id, isNew]);

    const fetchCertificate = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const docSnap = await getDoc(doc(db, 'certificates', id));

            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData({
                    cert_id: data.cert_id,
                    student_name: data.student_name,
                    course_name: data.course_name,
                    duration: data.duration,
                    status: data.status,
                    completion_date: data.completion_date || '',
                });
            } else {
                alert('Certificate not found');
                navigate('/admin/certificates');
            }
        } catch (err: any) {
            console.error('Error fetching certificate:', err);
            alert('Failed to load certificate: ' + err.message);
            navigate('/admin/certificates');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.cert_id.trim()) {
            alert('Certificate ID is required');
            return;
        }
        if (!formData.student_name.trim()) {
            alert('Student Name is required');
            return;
        }
        if (!formData.course_name.trim()) {
            alert('Course Name is required');
            return;
        }
        if (!formData.duration.trim()) {
            alert('Duration is required');
            return;
        }

        try {
            setSaving(true);
            const certData = {
                cert_id: formData.cert_id.trim(),
                student_name: formData.student_name.trim(),
                course_name: formData.course_name.trim(),
                duration: formData.duration.trim(),
                status: formData.status,
                completion_date: formData.completion_date || null,
                updated_at: serverTimestamp()
            };

            if (isNew) {
                // Use cert_id as doc ID for consistency
                await setDoc(doc(db, 'certificates', certData.cert_id), {
                    ...certData,
                    created_at: serverTimestamp()
                });
                alert('Certificate created successfully!');
            } else {
                if (!id) throw new Error('Missing certificate ID');
                await updateDoc(doc(db, 'certificates', id), certData);
                alert('Certificate updated successfully!');
            }

            navigate('/admin/certificates');
        } catch (err: any) {
            console.error('Error saving certificate:', err);
            alert('Failed to save certificate: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/certificates')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Award className="text-blue-600" size={32} />
                        {isNew ? 'Add New Certificate' : 'Edit Certificate'}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {isNew ? 'Create a new certificate record' : 'Update certificate information'}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
                {/* Certificate ID */}
                <div>
                    <label htmlFor="cert_id" className="block text-sm font-semibold text-gray-700 mb-2">
                        Certificate ID <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="cert_id"
                        name="cert_id"
                        value={formData.cert_id}
                        onChange={handleChange}
                        placeholder="e.g., TN/CBE/069/LTIEC0030"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono disabled:bg-gray-100 disabled:text-gray-500"
                        required
                        disabled={!canEdit}
                    />
                    <p className="text-sm text-gray-500 mt-1">Unique identifier for the certificate</p>
                </div>

                {/* Student Name */}
                <div>
                    <label htmlFor="student_name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Student Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="student_name"
                        name="student_name"
                        value={formData.student_name}
                        onChange={handleChange}
                        placeholder="e.g., John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                        required
                        disabled={!canEdit}
                    />
                </div>

                {/* Course Name */}
                <div>
                    <label htmlFor="course_name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Course Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="course_name"
                        name="course_name"
                        value={formData.course_name}
                        onChange={handleChange}
                        placeholder="e.g., Full Stack Development"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                        required
                        disabled={!canEdit}
                    />
                </div>

                {/* Duration */}
                <div>
                    <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-2">
                        Duration <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="e.g., 6 Months"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                        required
                        disabled={!canEdit}
                    />
                </div>

                {/* Status */}
                <div>
                    <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                        Status <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                        required
                        disabled={!canEdit}
                    >
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Issued">Issued</option>
                    </select>
                </div>

                {/* Completion Date */}
                <div>
                    <label htmlFor="completion_date" className="block text-sm font-semibold text-gray-700 mb-2">
                        Completion Date
                    </label>
                    <input
                        type="date"
                        id="completion_date"
                        name="completion_date"
                        value={formData.completion_date}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                        disabled={!canEdit}
                    />
                    <p className="text-sm text-gray-500 mt-1">Optional - Leave blank if not completed yet</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                    {canEdit && (
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            <Save size={20} />
                            {saving ? 'Saving...' : (isNew ? 'Create Certificate' : 'Update Certificate')}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => navigate('/admin/certificates')}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CertificateEditor;
