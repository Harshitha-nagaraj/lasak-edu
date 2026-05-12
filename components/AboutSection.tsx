
import React, { useState } from 'react';
import { Sparkles, CheckCircle, ArrowRight, Send, Star, Award, ShieldCheck } from 'lucide-react';

const AboutSection = () => {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        try {
            const { getFirestoreDb } = await import('../lib/firebase');
            const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            const submissionData = {
                full_name: formData.get('fullName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                qualification: formData.get('qualification'),
                current_profile: formData.get('profile'),
                graduation_year: formData.get('gradYear'),
                language: formData.get('language'),
                source: 'About Section Form',
                created_at: serverTimestamp()
            };

            await addDoc(collection(db, 'enquiries'), submissionData);

            // Send to Google Sheets
            const scriptUrl = "https://script.google.com/macros/s/AKfycbyCXeBcecLMxEqsI895ypcAgNwa0v4obpE6lXMczvDolz3kaMRPf6aDxmTH9vEL5FzKsw/exec";
            fetch(scriptUrl, {
                method: "POST",
                mode: 'no-cors',
                body: JSON.stringify(submissionData)
            }).catch(err => console.error("Google Sheets Error:", err));

            setSubmitted(true);
            form.reset();
        } catch (error) {
            console.error("Submission error:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    
                    {/* Left Side: Information */}
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold mb-6">
                            <Sparkles size={16} /> Get to know about LASAK EDU
                        </div>
                        
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
                            LASAK Technologies <br />
                            <span className="text-blue-600">Private Limited</span>
                        </h2>
                        
                        <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                            <p>
                                LASAK Technologies Private Limited is a leading technology solutions and skills development company. We specialize in <span className="font-bold text-slate-900">Software Development, Web Development services, Digital Marketing</span>, and <span className="font-bold text-slate-900">Mechanical Engineering projects</span>.
                            </p>
                            
                            <p>
                                Established with a vision to empower students and professionals, we are dedicated to providing effective and high-quality learning programs that transcend industry standards. LASAK EDU today is trusted by thousands of learners and numerous corporate partners.
                            </p>
                        </div>

                        {/* Awards/Highlights */}
                        <div className="mt-12 grid grid-cols-2 gap-6">
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center group hover:bg-blue-50 transition-colors">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md mb-4 text-blue-600 group-hover:scale-110 transition-transform">
                                    <Star size={24} />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">Most Trusted</h4>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Edutech Brand</p>
                            </div>
                            
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center group hover:bg-blue-50 transition-colors">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md mb-4 text-blue-600 group-hover:scale-110 transition-transform">
                                    <Award size={24} />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">Guaranteed</h4>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Placement Support</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="lg:w-1/2 w-full">
                        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative">
                            {/* Form Header */}
                            <div className="bg-slate-50 p-8 border-b border-slate-100 text-center">
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Talk To Your Career Expert</h3>
                                <p className="text-slate-500 font-medium">Take the first step towards your dream career today.</p>
                            </div>

                            <div className="p-8">
                                {submitted ? (
                                    <div className="py-20 text-center space-y-6">
                                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                                            <CheckCircle size={40} />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900">Details Submitted!</h3>
                                        <p className="text-slate-500">Our expert will contact you within 24 hours.</p>
                                        <button 
                                            onClick={() => setSubmitted(false)}
                                            className="text-blue-600 font-bold hover:underline"
                                        >
                                            Submit another enquiry
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input 
                                                name="fullName"
                                                type="text" 
                                                placeholder="Name" 
                                                required 
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-medium"
                                            />
                                            <input 
                                                name="email"
                                                type="email" 
                                                placeholder="Email" 
                                                required 
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-medium"
                                            />
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="w-24 px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400">
                                                IN +91
                                            </div>
                                            <input 
                                                name="phone"
                                                type="tel" 
                                                placeholder="Mobile Number" 
                                                required 
                                                className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-medium"
                                            />
                                        </div>

                                        <select 
                                            name="qualification"
                                            required 
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-medium appearance-none text-slate-500"
                                        >
                                            <option value="">Education Qualification</option>
                                            <option value="BE/B.Tech">BE/B.Tech</option>
                                            <option value="ME/M.Tech">ME/M.Tech</option>
                                            <option value="BCA/MCA">BCA/MCA</option>
                                            <option value="B.Sc/M.Sc">B.Sc/M.Sc</option>
                                            <option value="Others">Others</option>
                                        </select>

                                        <select 
                                            name="profile"
                                            required 
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-medium appearance-none text-slate-500"
                                        >
                                            <option value="">Current Profile</option>
                                            <option value="Student">Student</option>
                                            <option value="Working Professional">Working Professional</option>
                                            <option value="Job Seeker">Job Seeker</option>
                                        </select>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <select 
                                                name="gradYear"
                                                required 
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-medium appearance-none text-slate-500"
                                            >
                                                <option value="">Year of Graduation</option>
                                                {[2027, 2026, 2025, 2024, 2023, 2022, 2021, 2020].map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>

                                            <select 
                                                name="language"
                                                required 
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-medium appearance-none text-slate-500"
                                            >
                                                <option value="">Speaking Language</option>
                                                <option value="Tamil">Tamil</option>
                                                <option value="English">English</option>
                                            </select>
                                        </div>

                                        <button 
                                            type="submit" 
                                            disabled={submitting}
                                            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xl rounded-2xl shadow-[0_10px_20px_rgba(37,99,235,0.3)] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                                        >

                                            {submitting ? 'Processing...' : 'Book a Session'}
                                            {!submitting && <ArrowRight size={24} />}
                                        </button>

                                        <p className="text-[10px] text-slate-400 text-center mt-4">
                                            By registering, I agree to be contacted via phone, SMS, or email for offers & products.
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
