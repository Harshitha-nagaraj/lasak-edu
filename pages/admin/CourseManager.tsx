import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, BookOpen, Filter } from 'lucide-react';
import { useUserRole } from '../../hooks/useUserRole';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Course } from '../../types';

const CourseManager = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const { canEdit } = useUserRole();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'courses'));
            const fetchedCourses: Course[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Course));
            setCourses(fetchedCourses);
        } catch (error: any) {
            console.error('Error fetching courses:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;

        try {
            await deleteDoc(doc(db, 'courses', id));
            setCourses(courses.filter(c => c.id !== id));
        } catch (error: any) {
            alert('Error deleting course: ' + error.message);
        }
    };

    const toggleHomeVisibility = async (id: string, currentValue: boolean) => {
        try {
            const courseRef = doc(db, 'courses', id);
            await updateDoc(courseRef, { show_on_home: !currentValue });

            // Update local state
            setCourses(courses.map(c =>
                c.id === id ? { ...c, show_on_home: !currentValue } : c
            ));
        } catch (error: any) {
            alert('Error updating course visibility: ' + error.message);
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = (course.title || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || course.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...new Set(courses.map(c => c.category).filter(Boolean))];

    if (loading) {
        return <div className="p-8 text-center">Loading courses...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Course Manager</h1>
                    <p className="text-gray-500 mt-2">Manage your courses, curriculum, and details</p>
                </div>
                {canEdit && (
                    <Link
                        to="/admin/courses/new"
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        Add New Course
                    </Link>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-400 w-5 h-5" />
                    <select
                        className="border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>

            {/* Course List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 font-semibold text-gray-600">Course Name</th>
                                <th className="p-4 font-semibold text-gray-600">Category</th>
                                <th className="p-4 font-semibold text-gray-600">Price</th>
                                <th className="p-4 font-semibold text-gray-600">Duration</th>
                                <th className="p-4 font-semibold text-gray-600">Show on Home</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.map((course) => (
                                <tr key={course.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={course.image} alt={course.title} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                            <span className="font-medium text-gray-800">{course.title}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                                            {course.category}
                                        </span>
                                    </td>
                                    <td className="p-4 font-medium text-gray-700">{course.price}</td>
                                    <td className="p-4 text-gray-500">{course.duration}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => toggleHomeVisibility(course.id, course.show_on_home || false)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${course.show_on_home ? 'bg-blue-600' : 'bg-gray-200'
                                                }`}
                                            title={course.show_on_home ? 'Visible on home page' : 'Hidden from home page'}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${course.show_on_home ? 'translate-x-6' : 'translate-x-1'
                                                }`} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        {canEdit ? (
                                            <div className="flex items-center gap-3">
                                                <Link
                                                    to={`/admin/courses/${course.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(course.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Read Only</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredCourses.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No courses found. Use the Setup page to migrate existing data.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseManager;
