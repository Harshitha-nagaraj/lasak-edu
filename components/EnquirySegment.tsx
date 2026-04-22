import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, Send, Sparkles } from 'lucide-react';

const EnquirySegment = () => {
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const submission = {
            full_name: formData.get('fullName'),
            qualification: formData.get('qualification'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            message: formData.get('address'),
            department: formData.get('department'),
            status: formData.get('status'),
            source: formData.get('applyFrom'),
            created_at: new Date()
        };

        try {
            const { getFirestoreDb } = await import('../lib/firebase');
            const { collection, addDoc } = await import('firebase/firestore');
            const db = await getFirestoreDb();
            // 1. Save to Firestore
            await addDoc(collection(db, 'enquiries'), submission);

            // 2. Send to Google Sheets (External)
            const scriptURL = "https://script.google.com/macros/s/AKfycbyCXeBcecLMxEqsI895ypcAgNwa0v4obpE6lXMczvDolz3kaMRPf6aDxmTH9vEL5FzKsw/exec";
            
            const sheetsData = {
                fullName: String(submission.full_name),
                email: String(submission.email),
                phone: String(submission.phone),
                qualification: String(submission.qualification),
                department: String(submission.department),
                status: String(submission.status),
                course: String(submission.source),
                preferredBranch: String(submission.message)
            };

            fetch(scriptURL, {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify(sheetsData)
            }).catch(err => console.error("Google Sheets Error:", err));

            alert("Enquiry Submitted Successfully! Our team will contact you soon.");
            form.reset();
        } catch (error) {
            console.error("Submission error:", error);
            alert("Submission Failed! Please try again later or contact us directly.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section id="enquiry-segment" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="bg-gradient-to-br from-[#0a0f1e] to-[#161e2e] rounded-[3rem] p-8 md:p-16 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row gap-16 items-center">

                    {/* Background Visual Effects */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    {/* Left Content */}
                    <div className="lg:w-1/2 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-cyan-400 rounded-full text-sm font-bold border border-blue-500/20 mb-8"
                        >
                            <Sparkles size={16} /> Fast-Track Your Career
                        </motion.div>

                        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                            Take Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">First Step</span> Toward Success
                        </h2>

                        <p className="text-slate-600 text-lg mb-12 leading-relaxed max-w-xl">
                            Unlock industry-leading training, guaranteed placement support, and real-world project experience. Fill out the form and our career experts will map out your journey.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                                    <Briefcase className="text-cyan-400" size={28} />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white">500+</div>
                                    <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Hiring Partners</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                                    <CheckCircle className="text-green-400" size={28} />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white">100%</div>
                                    <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Placement Support</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="lg:w-1/2 w-full relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl"
                        >
                            <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                                <Send className="text-cyan-400" size={24} /> Submit Your Details
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input
                                        name="fullName"
                                        type="text"
                                        placeholder="Full Name"
                                        required
                                        className="w-full p-4 rounded-2xl bg-white/5 text-white border border-white/10 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all placeholder:text-slate-500"
                                    />
                                    <input
                                        name="qualification"
                                        type="text"
                                        placeholder="Qualification"
                                        required
                                        className="w-full p-4 rounded-2xl bg-white/5 text-white border border-white/10 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all placeholder:text-slate-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input
                                        name="phone"
                                        type="tel"
                                        placeholder="Phone Number"
                                        required
                                        className="w-full p-4 rounded-2xl bg-white/5 text-white border border-white/10 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all placeholder:text-slate-500"
                                    />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Email Address"
                                        required
                                        className="w-full p-4 rounded-2xl bg-white/5 text-white border border-white/10 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all placeholder:text-slate-500"
                                    />
                                </div>

                                <textarea
                                    name="address"
                                    placeholder="Brief Message or Address"
                                    rows={3}
                                    required
                                    className="w-full p-4 rounded-2xl bg-white/5 text-white border border-white/10 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all placeholder:text-slate-500 resize-none"
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <select
                                        name="department"
                                        required
                                        className="w-full p-4 rounded-2xl bg-[#1a2333] text-slate-300 border border-white/10 outline-none cursor-pointer hover:border-white/20 transition-colors appearance-none"
                                    >
                                        <option value="" disabled selected>Department</option>
                                        <option value="Mechanical">Mechanical</option>
                                        <option value="Civil">Civil</option>
                                        <option value="IT">IT</option>
                                        <option value="ECE">ECE</option>
                                    </select>

                                    <select
                                        name="status"
                                        required
                                        className="w-full p-4 rounded-2xl bg-[#1a2333] text-slate-300 border border-white/10 outline-none cursor-pointer hover:border-white/20 transition-colors appearance-none"
                                    >
                                        <option value="" disabled selected>Status</option>
                                        <option value="Student">Student</option>
                                        <option value="Working">Professional</option>
                                        <option value="Fresher">Fresher</option>
                                    </select>

                                    <select
                                        name="applyFrom"
                                        required
                                        className="w-full p-4 rounded-2xl bg-[#1a2333] text-slate-300 border border-white/10 outline-none cursor-pointer hover:border-white/20 transition-colors appearance-none"
                                    >
                                        <option value="" disabled selected>Source</option>
                                        <option value="Instagram">Instagram</option>
                                        <option value="Google">Google</option>
                                        <option value="Facebook">Facebook</option>
                                        <option value="Referral">Referral</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black py-5 rounded-2xl hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(6,182,212,0.3)] disabled:opacity-50 mt-4 flex items-center justify-center gap-2 text-lg"
                                >
                                    {submitting ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Submitting...
                                        </span>
                                    ) : (
                                        <>Submit Enquiry <ArrowRight size={20} /></>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* External dependency - used in button */
const ArrowRight = ({ size, className = "" }: { size: number, className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
);

export default EnquirySegment;
