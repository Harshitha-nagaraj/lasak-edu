import React from 'react';
import { X, Check, Building2, Phone, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { Course } from '../types';
import { COMPANY_LOGOS } from '../constants/ui';

const cleanPath = (url: string) => {
    if (!url) return url;
    if (url.startsWith('https://') || url.startsWith('http://')) return url;

    // Ensure we don't have double slashes and remove 'public' if it exists at the start
    let cleaned = url.replace(/^\/?public\//, '/').replace(/\/+/g, '/');

    // Normalize the final filename part to match our strict on-disk naming
    const parts = cleaned.split('/');
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes('.')) {
        const extIndex = lastPart.lastIndexOf('.');
        const base = lastPart.slice(0, extIndex);
        const ext = lastPart.slice(extIndex).toLowerCase();
        // Normalize base: lowercase, replace non-alphanumeric with hyphen
        const normalizedBase = base.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        parts[parts.length - 1] = normalizedBase + ext;

        // Also normalize mid-path directories if any
        for (let i = 0; i < parts.length - 1; i++) {
            if (parts[i] && parts[i] !== 'img') {
                parts[i] = parts[i].toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            }
        }

        cleaned = parts.join('/');
    }

    return cleaned.startsWith('/') ? cleaned : '/' + cleaned;
};

interface CourseDetailsModalProps {
    course: Course | null;
    isOpen: boolean;
    onClose: () => void;
}

const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({ course, isOpen, onClose }) => {
    if (!course) return null;

    // Animation variants
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
        exit: { opacity: 0, scale: 0.95, y: 20 }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <div
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <div
                        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Header / Hero Section */}
                        <div className="relative h-48 sm:h-64 bg-slate-900 overflow-hidden shrink-0">
                            <img
                                src={cleanPath(course.image)}
                                alt={course.title}
                                className="w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                            <div className="absolute top-6 left-6 z-10">
                                <button
                                    onClick={onClose}
                                    aria-label="Back to courses"
                                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full text-sm font-bold transition-all shadow-lg"
                                >
                                    <ArrowLeft size={16} /> Back
                                </button>
                            </div>

                            <div className="absolute bottom-8 left-8 right-8 z-10">
                                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">{course.title}</h2>
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                                        {course.duration}
                                    </span>
                                    {course.category === 'Kids' && (
                                        <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                                            Kids Zone
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-50">
                            <div className="max-w-4xl mx-auto space-y-10">

                                {/* Description */}
                                <div className="text-center sm:text-left">
                                    <p className="text-lg text-slate-600 leading-relaxed">
                                        {course.description}
                                    </p>
                                </div>

                                {/* Modules Section */}
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <BookOpen className="text-blue-600" />
                                        <h3 className="text-xl font-bold text-slate-800">Course Modules</h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {course.modules.map((mod, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 shrink-0">
                                                    <Check size={16} className="text-blue-600" />
                                                </div>
                                                <span className="font-medium text-slate-700">{mod}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tools Covered Section */}
                                {course.tools && course.tools.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-6">
                                            <Building2 className="text-purple-600" />
                                            <h3 className="text-xl font-bold text-slate-800">Tools Covered</h3>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {course.tools.map((tool, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
                                                >
                                                    <span className="font-medium text-slate-700 text-center">{tool}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Companies Hiring Section */}
                                {course.category !== 'Kids' && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-6">
                                            <Building2 className="text-green-600" />
                                            <h3 className="text-xl font-bold text-slate-800">Companies Hiring</h3>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {course.companies && course.companies.length > 0 ? (
                                                course.companies.map((company, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center h-28 group"
                                                    >
                                                        <img
                                                            src={cleanPath(company.logo)}
                                                            alt={company.name}
                                                            className="max-w-full h-12 object-contain mb-2 group-hover:scale-110 transition-transform duration-300"
                                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                                        />
                                                        <span className="text-xs font-semibold text-slate-600 text-center">{company.name}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                COMPANY_LOGOS.slice(0, 8).map((logo, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center h-24 group"
                                                    >
                                                        <img
                                                            src={cleanPath(logo)}
                                                            alt="Company Logo"
                                                            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                                        />
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 bg-white border-t border-slate-100 shrink-0">
                            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <div className="hidden sm:block">
                                    <p className="text-sm text-slate-500">Ready to start your journey?</p>
                                    <p className="text-lg font-bold text-slate-800">Enroll today!</p>
                                </div>

                                <div className="flex w-full sm:w-auto gap-3">
                                    <a
                                        href="tel:+917418732525"
                                        className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-green-600 text-green-700 font-bold hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Phone size={18} /> Call Now
                                    </a>
                                    <a
                                        href="https://forms.gle/6sVSvE1schYRYfse7"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        Enquiry now <ArrowRight size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default CourseDetailsModal;
