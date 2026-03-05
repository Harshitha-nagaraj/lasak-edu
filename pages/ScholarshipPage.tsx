import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, HelpCircle, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Course } from '../types';
import { fetchWithCache } from '../lib/cacheUtils';
import ScholarshipCalculator from '../components/ScholarshipCalculator';
import SEO from '../components/SEO';

interface ScholarshipRule {
    id: string;
    name: string;
    min_percentage: number;
    max_percentage: number;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    is_active: boolean;
    priority: number;
}

const DEFAULT_RULES: ScholarshipRule[] = [
    { id: '1', name: 'Distinction Excellence', min_percentage: 90, max_percentage: 100, discount_type: 'percentage', discount_value: 30, is_active: true, priority: 1 },
    { id: '2', name: 'First Class Merit', min_percentage: 75, max_percentage: 89, discount_type: 'percentage', discount_value: 20, is_active: true, priority: 2 },
    { id: '3', name: 'Second Class Achievement', min_percentage: 60, max_percentage: 74, discount_type: 'percentage', discount_value: 10, is_active: true, priority: 3 },
    { id: '4', name: 'Encouragement Grant', min_percentage: 50, max_percentage: 59, discount_type: 'fixed', discount_value: 1000, is_active: true, priority: 4 },
];

const FAQs = [
    {
        question: 'How do I apply for a scholarship?',
        answer: 'Simply use the calculator above to check your eligibility based on your academic percentage. When you enroll in a course, mention your academic score and provide supporting documents to avail the scholarship discount.'
    },
    {
        question: 'What documents are required?',
        answer: 'You will need to provide your latest academic marksheet or certificate showing your percentage/grade. This can be from your 10th, 12th, or graduation depending on which is most recent.'
    },
    {
        question: 'Can I combine scholarships with other offers?',
        answer: 'Scholarship discounts cannot be combined with other promotional offers or discounts. However, you can choose whichever offer gives you the maximum benefit.'
    },
    {
        question: 'Is the scholarship applicable on all courses?',
        answer: 'Yes, the academic scholarship is applicable on all paid courses offered by LASAK EDU. Free courses are excluded from the scholarship program.'
    },
    {
        question: 'How long is the scholarship valid?',
        answer: 'Once your scholarship eligibility is confirmed, you can avail it within 30 days of verification. After that, you may need to re-apply.'
    }
];

const ScholarshipPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [rules, setRules] = useState<ScholarshipRule[]>(DEFAULT_RULES);
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch courses
            const coursesData = await fetchWithCache('cache_courses_all', query(collection(db, 'courses')));
            if (coursesData && coursesData.length > 0) {
                const fetched = coursesData;
                fetched.sort((a: any, b: any) => (a.title || '').localeCompare(b.title || ''));
                setCourses(fetched);
            }

            // Fetch scholarship rules (active only, sorted by priority)
            const rulesData = await fetchWithCache('cache_scholarship_rules', query(collection(db, 'scholarship_rules')));
            if (rulesData && rulesData.length > 0) {
                const activeRules = rulesData
                    .filter((r: any) => r.is_active)
                    .sort((a: any, b: any) => (a.priority || 0) - (b.priority || 0));
                if (activeRules.length > 0) setRules(activeRules);
            }
        } catch (err) {
            console.log('Using default data', err);
        } finally {
            setLoading(false);
        }
    };

    const parsePrice = (priceStr: string): number => {
        const numericPrice = priceStr.replace(/[^0-9]/g, '');
        return parseInt(numericPrice) || 0;
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <SEO
                title="Scholarship Calculator | LASAK EDU"
                description="Calculate your scholarship eligibility based on your academic performance. Get up to 30% discount on courses."
            />

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-purple-200 text-sm font-medium mb-6">
                            <Award size={16} />
                            Merit-Based Scholarships
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                            Your Academic Excellence
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                                Deserves Rewards
                            </span>
                        </h1>
                        <p className="text-lg text-purple-200 max-w-2xl mx-auto">
                            We believe in rewarding hard work. Get up to 30% scholarship on any course based on your academic performance.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Calculator Section */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {/* Course Selection */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <BookOpen className="text-blue-600" size={20} />
                                    <h3 className="font-bold text-slate-800">Select a Course</h3>
                                </div>
                                <select
                                    value={selectedCourse?.id || ''}
                                    onChange={(e) => {
                                        const course = courses.find(c => c.id === e.target.value);
                                        setSelectedCourse(course || null);
                                    }}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="">Choose a course...</option>
                                    {courses.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.title} - {course.price}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Calculator */}
                            <ScholarshipCalculator
                                coursePrice={selectedCourse ? parsePrice(selectedCourse.price) : 15000}
                                courseName={selectedCourse?.title || 'Sample Course'}
                            />
                        </motion.div>
                    </div>

                    {/* Info Section */}
                    <div className="space-y-8">
                        {/* Scholarship Tiers Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-purple-100 rounded-xl">
                                    <GraduationCap className="text-purple-600 w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Scholarship Tiers</h3>
                            </div>

                            <div className="space-y-4">
                                {rules.map((rule, index) => (
                                    <motion.div
                                        key={rule.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                        className="relative overflow-hidden rounded-2xl border border-slate-100 p-4 hover:shadow-md transition-all"
                                    >
                                        <div className={`absolute top-0 left-0 w-1 h-full ${index === 0 ? 'bg-gradient-to-b from-yellow-400 to-orange-500' :
                                            index === 1 ? 'bg-gradient-to-b from-slate-400 to-slate-500' :
                                                index === 2 ? 'bg-gradient-to-b from-amber-600 to-amber-700' :
                                                    'bg-gradient-to-b from-purple-400 to-purple-500'
                                            }`}></div>

                                        <div className="pl-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-800">{rule.name}</h4>
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                    index === 1 ? 'bg-slate-100 text-slate-700' :
                                                        index === 2 ? 'bg-amber-100 text-amber-700' :
                                                            'bg-purple-100 text-purple-700'
                                                    }`}>
                                                    {rule.discount_type === 'percentage' ? `${rule.discount_value}% OFF` : `₹${rule.discount_value} OFF`}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500">
                                                Academic Score: {rule.min_percentage}% - {rule.max_percentage}%
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* FAQs */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <HelpCircle className="text-blue-600 w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Frequently Asked Questions</h3>
                            </div>

                            <div className="space-y-3">
                                {FAQs.map((faq, index) => (
                                    <div
                                        key={index}
                                        className="border border-slate-100 rounded-xl overflow-hidden"
                                    >
                                        <button
                                            onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                                            className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                                        >
                                            <span className="font-semibold text-slate-700">{faq.question}</span>
                                            {expandedFAQ === index ? (
                                                <ChevronUp className="text-slate-400" size={20} />
                                            ) : (
                                                <ChevronDown className="text-slate-400" size={20} />
                                            )}
                                        </button>
                                        {expandedFAQ === index && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="px-4 pb-4"
                                            >
                                                <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
                                            </motion.div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScholarshipPage;
