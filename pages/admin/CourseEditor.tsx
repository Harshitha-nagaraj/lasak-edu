
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Save, Plus, Trash2, HelpCircle, Briefcase,
    Rocket, Target, CheckCircle, BookOpen, Brain, Wrench, Building2
} from 'lucide-react';
import { CATEGORIES } from '../../constants';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import ImageUploader from '../../components/admin/ImageUploader';

const CourseEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'new' || !id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<{
        id: string;
        title: string;
        category: string;
        price: string;
        oldPrice?: string;
        duration: string;
        description: string;
        image: string;
        modules: string[];
        tools: string[];
        companies: { name: string; logo: string }[];
        enrollLink: string;
        phone?: string;
        supportLink?: string;
        fee_label?: string;
        discount_label?: string;
        // New landing page fields
        tagline: string;
        introduction: string;
        long_description: string;
        skills_gained: string[];
        eligibility: string[];
        features: string[];
        live_projects: { title: string; description: string }[];
        career_opportunities: { role: string; description: string }[];
        faqs: { question: string; answer: string }[];
        skills_passport_price?: string;
        interview_passport_price?: string;
        job_passport_price?: string;
    }>({
        id: '',
        title: '',
        category: 'Mechanical',
        price: '',
        oldPrice: '',
        duration: '',
        description: '',
        image: '',
        modules: [''],
        tools: [''],
        companies: [{ name: '', logo: '' }],
        enrollLink: '',
        phone: '',
        supportLink: '',
        fee_label: 'Course Fee',
        discount_label: '50% OFF SPECIAL OFFER',
        tagline: '',
        introduction: '',
        long_description: '',
        skills_gained: [''],
        eligibility: [''],
        features: [''],
        live_projects: [{ title: '', description: '' }],
        career_opportunities: [{ role: '', description: '' }],
        faqs: [{ question: '', answer: '' }],
        skills_passport_price: '',
        interview_passport_price: '',
        job_passport_price: ''
    });

    useEffect(() => {
        if (!isNew && id) {
            fetchCourse(id);
        }
    }, [id, isNew]);

    const fetchCourse = async (courseId: string) => {
        try {
            const courseDoc = await getDoc(doc(db, 'courses', courseId));
            if (!courseDoc.exists()) {
                alert('Course not found!');
                navigate('/admin/courses');
                return;
            }
            const data = courseDoc.data();
            if (data) {
                setFormData({
                    id: courseDoc.id,
                    title: data.title,
                    category: data.category,
                    price: data.price,
                    oldPrice: data.old_price || data.oldPrice || '',
                    duration: data.duration,
                    description: data.description,
                    image: data.image,
                    modules: data.modules || [''],
                    tools: data.tools || [''],
                    companies: data.companies || [{ name: '', logo: '' }],
                    enrollLink: data.enroll_link || data.enrollLink || '',
                    phone: data.phone || '',
                    supportLink: data.support_link || data.supportLink || '',
                    fee_label: data.fee_label || 'Course Fee',
                    discount_label: data.discount_label || '50% OFF SPECIAL OFFER',
                    tagline: data.tagline || '',
                    introduction: data.introduction || '',
                    long_description: data.long_description || '',
                    skills_gained: data.skills_gained || [''],
                    eligibility: data.eligibility || [''],
                    features: data.features || [''],
                    live_projects: data.live_projects || [{ title: '', description: '' }],
                    career_opportunities: data.career_opportunities || [{ role: '', description: '' }],
                    faqs: data.faqs || [{ question: '', answer: '' }],
                    skills_passport_price: data.skills_passport_price || '',
                    interview_passport_price: data.interview_passport_price || '',
                    job_passport_price: data.job_passport_price || ''
                });
            }
        } catch (error: any) {
            console.error('Error fetching course:', error);
            alert('Error loading course!');
            navigate('/admin/courses');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };



    // Generic Array Handlers
    const handleArrayChange = (field: string, index: number, value: string) => {
        const newArray = [...(formData as any)[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addToArray = (field: string, defaultValue: any = '') => {
        setFormData(prev => ({ ...prev, [field]: [...(prev as any)[field], defaultValue] }));
    };

    const removeFromArray = (field: string, index: number) => {
        const newArray = (formData as any)[field].filter((_: any, i: number) => i !== index);
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    // Generic Object Array Handlers
    const handleObjArrayChange = (field: string, index: number, subField: string, value: string) => {
        const newArray = [...(formData as any)[field]];
        newArray[index] = { ...newArray[index], [subField]: value };
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const courseData = {
                title: formData.title,
                category: formData.category,
                price: formData.price,
                old_price: formData.oldPrice,
                duration: formData.duration,
                description: formData.description,
                image: formData.image,
                modules: formData.modules.filter(m => m.trim() !== ''),
                tools: formData.tools.filter(t => t.trim() !== ''),
                companies: formData.companies.filter(c => c.name.trim() !== '' || c.logo.trim() !== ''),
                enroll_link: formData.enrollLink,
                phone: formData.phone,
                support_link: formData.supportLink,
                fee_label: formData.fee_label,
                discount_label: formData.discount_label,
                // New fields
                tagline: formData.tagline,
                introduction: formData.introduction,
                long_description: formData.long_description,
                skills_gained: formData.skills_gained.filter(s => s.trim() !== ''),
                eligibility: formData.eligibility.filter(e => e.trim() !== ''),
                features: formData.features.filter(f => f.trim() !== ''),
                live_projects: formData.live_projects.filter(p => p.title.trim() !== ''),
                career_opportunities: formData.career_opportunities.filter(c => c.role.trim() !== ''),
                faqs: formData.faqs.filter(f => f.question.trim() !== ''),
                skills_passport_price: formData.skills_passport_price,
                interview_passport_price: formData.interview_passport_price,
                job_passport_price: formData.job_passport_price
            };

            if (isNew) {
                const newId = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
                await setDoc(doc(db, 'courses', newId), courseData);
            } else {
                await updateDoc(doc(db, 'courses', id), courseData);
            }

            alert('Course saved successfully!');
            navigate('/admin/courses');
        } catch (error: any) {
            console.error('Error saving course:', error);
            alert('Error saving course: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-0 z-50">
                <button onClick={() => navigate('/admin/courses')} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{isNew ? 'Create New Course' : 'Edit Course'}</h1>
                    <p className="text-sm text-gray-500">{isNew ? 'Landing Page Overhaul' : `Updating ${formData.title}`}</p>
                </div>
                <div className="ml-auto flex gap-3">
                    <button onClick={() => navigate('/admin/courses')} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                    <button onClick={handleSubmit} disabled={loading} className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
                        <Save size={20} /> {loading ? 'Saving...' : 'Save Course'}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. BASIC INFO */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 border-b pb-4">
                        <CheckCircle className="text-blue-600" size={24} /> Basic Information
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Course Title</label>
                            <input name="title" value={formData.title} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none font-bold text-slate-800 transition-all" placeholder="Enter Full Course Name" required />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none font-bold text-slate-800">
                                {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Duration</label>
                            <input name="duration" value={formData.duration} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none font-bold text-slate-800" placeholder="e.g. 60 Days / 240 Hours" />
                        </div>
                    </div>
                </section>

                {/* 2. PRICE & SIDEBAR */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 border-b pb-4">
                        <Save className="text-purple-600" size={24} /> Pricing & Sidebar
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Price (₹)</label>
                            <input name="price" value={formData.price} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none font-bold" placeholder="₹14,999" />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Old Price</label>
                            <input name="oldPrice" value={formData.oldPrice} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none" placeholder="₹25,000" />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Phone Number</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none" placeholder="+91 74187 32525" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase text-slate-400 mb-2">Enrollment Link (Google Forms / Other)</label>
                        <input name="enrollLink" value={formData.enrollLink} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none" placeholder="https://forms.gle/..." />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 pt-4">
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Skills Upgrade Fee (₹)</label>
                            <input name="skills_passport_price" value={formData.skills_passport_price} onChange={handleChange} className="w-full px-5 py-3.5 bg-blue-50/50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none font-bold text-blue-800" placeholder="₹0" />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Interview Upgrade Fee (₹)</label>
                            <input name="interview_passport_price" value={formData.interview_passport_price} onChange={handleChange} className="w-full px-5 py-3.5 bg-cyan-50/50 border-2 border-transparent focus:border-cyan-600 rounded-2xl outline-none font-bold text-cyan-800" placeholder="₹4,000" />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Job Upgrade Fee (₹)</label>
                            <input name="job_passport_price" value={formData.job_passport_price} onChange={handleChange} className="w-full px-5 py-3.5 bg-rose-50/50 border-2 border-transparent focus:border-rose-600 rounded-2xl outline-none font-bold text-rose-800" placeholder="₹9,000" />
                        </div>
                    </div>
                </section>

                {/* 3. HERO & CONTENT */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 border-b pb-4">
                        <Rocket className="text-orange-600" size={24} /> Hero & Landing Content
                    </h2>
                    <div>
                        <label className="block text-xs font-black uppercase text-slate-400 mb-2">Hero Tagline</label>
                        <input name="tagline" value={formData.tagline} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none font-bold" placeholder="Master XYZ and accelerate your career..." />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase text-slate-400 mb-2">Hero Introduction (Short)</label>
                        <textarea name="introduction" value={formData.introduction} onChange={handleChange} rows={2} className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none resize-none" placeholder="2-3 line summary for the top section..." />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase text-slate-400 mb-2">Full Course Description (SEO Rich Content)</label>
                        <textarea name="long_description" value={formData.long_description} onChange={handleChange} rows={6} className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none resize-none" placeholder="Write 800-1200 words for SEO optimization here..." />
                    </div>
                    <ImageUploader
                        value={formData.image}
                        onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                        storagePath="courses"
                        label="Course Image"
                        placeholder="/img/courses/..."
                    />
                </section>

                {/* 4. MULTI-FIELD ARRAYS (Modules, Skills, etc.) */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Modules */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                <BookOpen className="text-blue-600" size={24} /> Modules
                            </h2>
                            <button type="button" onClick={() => addToArray('modules')} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"><Plus size={18} /></button>
                        </div>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            {formData.modules.map((item, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input value={item} onChange={(e) => handleArrayChange('modules', idx, e.target.value)} className="flex-1 px-4 py-2 bg-slate-50 border rounded-xl outline-none" placeholder={`Module ${idx + 1}`} />
                                    <button type="button" onClick={() => removeFromArray('modules', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Features */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                <Rocket className="text-green-600" size={24} /> Features
                            </h2>
                            <button type="button" onClick={() => addToArray('features')} className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100"><Plus size={18} /></button>
                        </div>
                        <div className="space-y-3">
                            {formData.features.map((item, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input value={item} onChange={(e) => handleArrayChange('features', idx, e.target.value)} className="flex-1 px-4 py-2 bg-slate-50 border rounded-xl outline-none" placeholder={`Feature ${idx + 1}`} />
                                    <button type="button" onClick={() => removeFromArray('features', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* 5. ELIGIBILITY & SKILLS */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Eligibility */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                <Target className="text-red-600" size={24} /> Eligibility
                            </h2>
                            <button type="button" onClick={() => addToArray('eligibility')} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100"><Plus size={18} /></button>
                        </div>
                        <div className="space-y-3">
                            {formData.eligibility.map((item, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input value={item} onChange={(e) => handleArrayChange('eligibility', idx, e.target.value)} className="flex-1 px-4 py-2 bg-slate-50 border rounded-xl outline-none" placeholder="Who can join?" />
                                    <button type="button" onClick={() => removeFromArray('eligibility', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Skills Gained */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                <Brain className="text-pink-600" size={24} /> Skills Gained
                            </h2>
                            <button type="button" onClick={() => addToArray('skills_gained')} className="p-2 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100"><Plus size={18} /></button>
                        </div>
                        <div className="space-y-3">
                            {formData.skills_gained.map((item, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input value={item} onChange={(e) => handleArrayChange('skills_gained', idx, e.target.value)} className="flex-1 px-4 py-2 bg-slate-50 border rounded-xl outline-none" placeholder="Skill Name" />
                                    <button type="button" onClick={() => removeFromArray('skills_gained', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* 6. PROJECTS & CAREERS */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Live Projects */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                <Rocket className="text-blue-500" size={24} /> Live Projects
                            </h2>
                            <button type="button" onClick={() => addToArray('live_projects', { title: '', description: '' })} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"><Plus size={18} /></button>
                        </div>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            {formData.live_projects.map((item, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 relative">
                                    <button type="button" onClick={() => removeFromArray('live_projects', idx)} className="absolute top-2 right-2 text-red-500 hover:bg-red-100 p-1.5 rounded-lg"><Trash2 size={16} /></button>
                                    <input value={item.title} onChange={(e) => handleObjArrayChange('live_projects', idx, 'title', e.target.value)} className="w-full px-4 py-2 border rounded-xl outline-none font-bold" placeholder="Project Title" />
                                    <textarea value={item.description} onChange={(e) => handleObjArrayChange('live_projects', idx, 'description', e.target.value)} className="w-full px-4 py-2 border rounded-xl outline-none resize-none text-sm" placeholder="Short description of Use Case..." />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Career Opps */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                <Briefcase className="text-indigo-600" size={24} /> Career Opportunities
                            </h2>
                            <button type="button" onClick={() => addToArray('career_opportunities', { role: '', description: '' })} className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100"><Plus size={18} /></button>
                        </div>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            {formData.career_opportunities.map((item, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 relative">
                                    <button type="button" onClick={() => removeFromArray('career_opportunities', idx)} className="absolute top-2 right-2 text-red-500 hover:bg-red-100 p-1.5 rounded-lg"><Trash2 size={16} /></button>
                                    <input value={item.role} onChange={(e) => handleObjArrayChange('career_opportunities', idx, 'role', e.target.value)} className="w-full px-4 py-2 border rounded-xl outline-none font-bold" placeholder="Job Role Name" />
                                    <textarea value={item.description} onChange={(e) => handleObjArrayChange('career_opportunities', idx, 'description', e.target.value)} className="w-full px-4 py-2 border rounded-xl outline-none resize-none text-sm" placeholder="Responsibilities of this role..." />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* 7. FAQs */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                            <HelpCircle className="text-blue-600" size={24} /> Frequently Asked Questions
                        </h2>
                        <button type="button" onClick={() => addToArray('faqs', { question: '', answer: '' })} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"><Plus size={18} /></button>
                    </div>
                    <div className="space-y-4">
                        {formData.faqs.map((item, idx) => (
                            <div key={idx} className="grid md:grid-cols-2 gap-4 items-start p-6 bg-slate-50 rounded-3xl border border-slate-100 relative shadow-sm">
                                <button type="button" onClick={() => removeFromArray('faqs', idx)} className="absolute top-4 right-4 text-red-500 hover:bg-red-100 p-2 rounded-xl"><Trash2 size={18} /></button>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Question</label>
                                    <input value={item.question} onChange={(e) => handleObjArrayChange('faqs', idx, 'question', e.target.value)} className="w-full px-4 py-2.5 border rounded-xl outline-none font-bold" placeholder="e.g. Is prior knowledge required?" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Answer</label>
                                    <textarea value={item.answer} onChange={(e) => handleObjArrayChange('faqs', idx, 'answer', e.target.value)} className="w-full px-4 py-2.5 border rounded-xl outline-none resize-none h-24" placeholder="Enter detailed answer here..." />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 8. TOOLS & COMPANIES (Existing simplified) */}
                <div className="grid md:grid-cols-2 gap-8">
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                <Wrench className="text-blue-600" size={24} /> Tools Covered
                            </h2>
                            <button type="button" onClick={() => addToArray('tools')} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"><Plus size={18} /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {formData.tools.map((tool, index) => (
                                <div key={index} className="flex gap-2">
                                    <input value={tool} onChange={(e) => handleArrayChange('tools', index, e.target.value)} className="flex-1 px-4 py-2 bg-slate-50 border rounded-xl outline-none" placeholder="Tool" />
                                    <button type="button" onClick={() => removeFromArray('tools', index)} className="p-2 text-red-500"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                <Building2 className="text-blue-600" size={24} /> Companies
                            </h2>
                            <button type="button" onClick={() => addToArray('companies', { name: '', logo: '' })} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"><Plus size={18} /></button>
                        </div>
                        <div className="space-y-3">
                            {formData.companies.map((company, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <input value={company.name} onChange={(e) => handleObjArrayChange('companies', index, 'name', e.target.value)} className="flex-1 px-3 py-1.5 bg-slate-50 border rounded-lg text-xs" placeholder="Name" />
                                    <input value={company.logo} onChange={(e) => handleObjArrayChange('companies', index, 'logo', e.target.value)} className="flex-1 px-3 py-1.5 bg-slate-50 border rounded-lg text-xs" placeholder="Logo URL" />
                                    <button type="button" onClick={() => removeFromArray('companies', index)} className="text-red-500"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Form Footer */}
                <div className="flex justify-end gap-6 pt-10 sticky bottom-0 bg-white/80 backdrop-blur-md p-6 -mx-4 border-t border-slate-100">
                    <button type="button" onClick={() => navigate('/admin/courses')} className="px-10 py-4 text-slate-600 font-black hover:bg-slate-50 rounded-2xl transition-all">Discard Changes</button>
                    <button type="submit" disabled={loading} className="px-12 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-3 text-lg">
                        <Save size={24} /> {loading ? 'Saving Progress...' : 'Publish Course'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CourseEditor;
