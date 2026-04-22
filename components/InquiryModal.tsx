import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchWithCache } from '../lib/cacheUtils';

interface InquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: string;
    courseTitle: string;
    category: string;
    actionType?: 'enroll' | 'modules' | 'pay'; // Determines behavior after submission
    basePrice?: number;
    upgradePrice?: number;
    upgradeName?: string;
    initialPromoCode?: string;
    initialDiscount?: number;
    onSuccess?: (data?: { name: string; email: string; phone: string; branch: string; promoCode: string; discountAmount: number; customAmount?: number }) => void;
}

interface CourseOption {
    id: string;
    title: string;
}

const InquiryModal: React.FC<InquiryModalProps> = ({
    isOpen,
    onClose,
    courseId,
    courseTitle,
    category,
    actionType = 'modules', // Default to modules for backward compatibility
    basePrice = 0,
    upgradePrice = 0,
    upgradeName = '',
    initialPromoCode = '',
    initialDiscount = 0,
    onSuccess
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [courses, setCourses] = useState<CourseOption[]>([]);
    const [promoCode, setPromoCode] = useState(initialPromoCode);
    const [discountAmount, setDiscountAmount] = useState(initialDiscount);
    const [couponInput, setCouponInput] = useState(initialPromoCode);
    const [couponStatus, setCouponStatus] = useState<{ type: 'success' | 'error' | 'none', message: string }>({ type: initialPromoCode ? 'success' : 'none', message: initialPromoCode ? 'Scholarship applied!' : '' });
    const [isCustomPayment, setIsCustomPayment] = useState(false);
    const [customAmount, setCustomAmount] = useState('');
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);
    const [initialData, setInitialData] = useState({
        fullName: '',
        phone: '',
        email: ''
    });

    React.useEffect(() => {
        let unsubscribe: any;
        const initAuth = async () => {
            const { getFirebaseAuth } = await import('../lib/firebase');
            const { onAuthStateChanged } = await import('firebase/auth');
            const authInstance = await getFirebaseAuth();
            unsubscribe = onAuthStateChanged(authInstance, async (user) => {
                if (user) {
                    setUser(user);
                    setInitialData({
                        fullName: user.displayName || '',
                        phone: user.phoneNumber || '',
                        email: user.email || ''
                    });
                }
            });
        };
        initAuth();

        const fetchCourses = async () => {
            try {
                const { getFirestoreDb } = await import('../lib/firebase');
                const { query, collection, orderBy } = await import('firebase/firestore');
                const db = await getFirestoreDb();
                const fetchedCourses = await fetchWithCache('cache_courses_dropdown', query(collection(db, 'courses'), orderBy('title', 'asc')));
                if (fetchedCourses) {
                    const mappedCourses = fetchedCourses.map((doc: any) => ({
                        id: doc.id,
                        title: doc.title
                    }));
                    setCourses(mappedCourses);
                }
            } catch (err) {
                console.error('Error fetching courses:', err);
            }
        };

        fetchCourses();
        return () => { if (unsubscribe) unsubscribe(); };
    }, []);

    const [couponLoading, setCouponLoading] = useState(false);

    const applyCoupon = async () => {
        const code = couponInput.trim().toUpperCase();
        if (!code) {
            setDiscountAmount(0);
            setPromoCode('');
            setCouponStatus({ type: 'none', message: '' });
            return;
        }

        setCouponLoading(true);
        try {
            const { getFirestoreDb } = await import('../lib/firebase');
            const { collection, query, where, getDocs } = await import('firebase/firestore');
            const db = await getFirestoreDb();
            const couponsRef = collection(db, 'coupon_codes');
            const q = query(couponsRef, where('code', '==', code), where('is_active', '==', true));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setCouponStatus({ type: 'error', message: 'Invalid or expired coupon code.' });
                setDiscountAmount(0);
                setPromoCode('');
                return;
            }

            const data = querySnapshot.docs[0].data();

            // Check expiry
            if (data.expires_at && data.expires_at.toDate() < new Date()) {
                setCouponStatus({ type: 'error', message: 'This coupon has expired.' });
                setDiscountAmount(0);
                setPromoCode('');
                return;
            }

            // Check usage limit
            if (data.usage_limit !== null && data.usage_count >= data.usage_limit) {
                setCouponStatus({ type: 'error', message: 'This coupon has reached its usage limit.' });
                setDiscountAmount(0);
                setPromoCode('');
                return;
            }

            // Calculate discount
            let discount = 0;
            if (data.discount_type === 'percentage') {
                discount = (basePrice * data.discount_value) / 100;
            } else {
                discount = Math.min(data.discount_value, basePrice);
            }

            setDiscountAmount(discount);
            setPromoCode(code);
            const label = data.discount_type === 'percentage'
                ? `${data.discount_value}% OFF`
                : `₹${data.discount_value} OFF`;
            setCouponStatus({ type: 'success', message: `✅ Coupon applied: ${label}` });
        } catch (err) {
            console.error('Error validating coupon:', err);
            setCouponStatus({ type: 'error', message: 'Failed to validate coupon. Please try again.' });
        } finally {
            setCouponLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        try {
            const { getFirestoreDb } = await import('../lib/firebase');
            const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
            const db = await getFirestoreDb();

            // 1. Save to Firestore (Lead management)
            const submissionData = {
                full_name: formData.get('fullName'),
                qualification: formData.get('qualification'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                message: `Gated Enquiry for: ${courseTitle} (Branch: ${formData.get('branch')})`,
                department: formData.get('department'),
                status: formData.get('status'),
                branch: formData.get('branch'),
                source: formData.get('applyFrom'),
                interested_course: formData.get('interestedCourse'),
                promo_code: promoCode,
                scholarship_discount: discountAmount,
                user_id: user?.uid || null,
                created_at: serverTimestamp()
            };
            await addDoc(collection(db, 'enquiries'), submissionData);

            // 2. Send to Google Sheets as JSON Payload
            const scriptUrl = "https://script.google.com/macros/s/AKfycbyCXeBcecLMxEqsI895ypcAgNwa0v4obpE6lXMczvDolz3kaMRPf6aDxmTH9vEL5FzKsw/exec";

            const sheetsData = {
                fullName: submissionData.full_name,
                qualification: submissionData.qualification,
                phone: submissionData.phone,
                email: submissionData.email,
                department: submissionData.department,
                status: submissionData.status,
                preferredBranch: submissionData.branch,
                course: submissionData.interested_course,
                promoCode: submissionData.promo_code || "",
                discountAmount: submissionData.scholarship_discount || 0
            };

            fetch(scriptUrl, {
                method: "POST",
                mode: 'no-cors',
                body: JSON.stringify(sheetsData)
            }).catch(err => console.error("Google Sheets Error:", err));

            // 3. Handle Success
            onClose();
            if (onSuccess) {
                onSuccess({
                    name: String(formData.get('fullName')),
                    email: String(formData.get('email')),
                    phone: String(formData.get('phone')),
                    branch: String(formData.get('branch')),
                    promoCode: promoCode,
                    discountAmount: discountAmount,
                    customAmount: isCustomPayment && customAmount ? Number(customAmount) : undefined
                });
            } else {
                if (actionType === 'modules') {
                    navigate(`/course/${courseId}`);
                }
            }

            if (actionType !== 'pay' && actionType !== 'enroll') {
                alert("Details Submitted! Accessing Modules...");
            }
            form.reset();

        } catch (error) {
            console.error("Submission error:", error);
            onClose();
            if (onSuccess) {
                onSuccess();
            } else {
                navigate(`/course/${courseId}`);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
                    {/* Backdrop */}
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <m.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-4xl bg-[#0a0f1e] rounded-[1.2rem] sm:rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden my-auto mx-2"
                    >
                        {/* Design Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                        <div className="relative z-10 p-5 sm:p-8 md:p-10 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6 sm:mb-8">
                                <div>
                                    <m.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-cyan-400 rounded-full text-xs font-bold border border-blue-500/20 mb-4"
                                    >
                                        <Sparkles size={14} /> Quick Enquiry
                                    </m.div>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
                                        Interested in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 line-clamp-2">{courseTitle}</span>?
                                    </h2>
                                    <p className="text-slate-600 text-xs sm:text-sm">Submit your details to view modules & get expert guidance.</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    aria-label="Close modal"
                                    className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-300 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Form Content - Split Layout */}
                            <div className="flex flex-col lg:flex-row gap-10">
                                {/* Left Side: Personal Details */}
                                <form onSubmit={handleSubmit} className="flex-1 space-y-4 sm:space-y-6">
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Full Name</label>
                                                <input
                                                    name="fullName"
                                                    type="text"
                                                    placeholder="eg: John Doe"
                                                    required
                                                    defaultValue={initialData.fullName}
                                                    className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all placeholder:text-slate-600"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Qualification</label>
                                                <input
                                                    name="qualification"
                                                    type="text"
                                                    placeholder="eg: BE Mechanical"
                                                    required
                                                    className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all placeholder:text-slate-600"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Phone Number</label>
                                                <input
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="eg: +91 98765 43210"
                                                    required
                                                    defaultValue={initialData.phone}
                                                    className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all placeholder:text-slate-600"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Email Address</label>
                                                <input
                                                    name="email"
                                                    type="email"
                                                    placeholder="eg: john@example.com"
                                                    required
                                                    defaultValue={initialData.email}
                                                    className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all placeholder:text-slate-600"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Department</label>
                                                <select
                                                    name="department"
                                                    required
                                                    defaultValue={category}
                                                    className="w-full p-3 rounded-xl bg-[#1a2333] text-white border border-white/10 outline-none cursor-pointer hover:border-white/20 transition-colors appearance-none"
                                                >
                                                    <option value="Mechanical">Mechanical</option>
                                                    <option value="Civil">Civil</option>
                                                    <option value="IT">IT</option>
                                                    <option value="Kids">Kids</option>
                                                    <option value="ECE">ECE</option>
                                                    <option value="Others">Others</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Current Status</label>
                                                <select
                                                    name="status"
                                                    required
                                                    className="w-full p-3 rounded-xl bg-[#1a2333] text-white border border-white/10 outline-none cursor-pointer hover:border-white/20 transition-colors appearance-none"
                                                >
                                                    <option value="Student">Student</option>
                                                    <option value="Working">Professional</option>
                                                    <option value="Fresher">Fresher</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Source</label>
                                                <select
                                                    name="applyFrom"
                                                    required
                                                    className="w-full p-3 rounded-xl bg-[#1a2333] text-white border border-white/10 outline-none cursor-pointer hover:border-white/20 transition-colors appearance-none"
                                                >
                                                    <option value="Google">Google</option>
                                                    <option value="Instagram">Instagram</option>
                                                    <option value="Facebook">Facebook</option>
                                                    <option value="Referral">Referral</option>
                                                    <option value="Others">Others</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Interested Course</label>
                                                <select
                                                    name="interestedCourse"
                                                    required
                                                    defaultValue={courseTitle}
                                                    className="w-full p-3 rounded-xl bg-[#1a2333] text-white border border-white/10 outline-none cursor-pointer hover:border-white/20 transition-colors appearance-none"
                                                >
                                                    <option value={courseTitle}>{courseTitle} (Current)</option>
                                                    {courses.filter(c => c.title !== courseTitle).map(course => (
                                                        <option key={course.id} value={course.title}>
                                                            {course.title}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Preferred Branch</label>
                                                <select
                                                    name="branch"
                                                    required
                                                    className="w-full p-3 rounded-xl bg-[#1a2333] text-white border border-white/10 outline-none cursor-pointer hover:border-white/20 transition-colors appearance-none"
                                                >
                                                    <option value="" disabled selected>Select Branch</option>
                                                    <option value="Peelamedu">Peelamedu</option>
                                                    <option value="Gandhipuram">Gandhipuram</option>
                                                </select>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black py-4 rounded-2xl hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(6,182,212,0.3)] disabled:opacity-50 mt-6 flex items-center justify-center gap-2 text-lg"
                                        >
                                            {submitting ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    {actionType === 'pay' ? 'Processing...' : 'Authorizing...'}
                                                </span>
                                            ) : (
                                                <>{actionType === 'pay' ? 'Proceed to Payment' : actionType === 'enroll' ? 'Submit' : 'Access Modules'} <ArrowRight size={20} /></>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                {/* Right Side: Order Summary */}
                                {actionType === 'pay' && (
                                    <div className="w-full lg:w-80 border-t lg:border-t-0 border-white/10 pt-8 lg:pt-0">
                                        <div className="bg-white/5 rounded-2xl sm:rounded-3xl border border-white/10 overflow-hidden lg:sticky lg:top-0">
                                            <div className="bg-blue-600/20 px-5 sm:px-6 py-4 border-b border-white/10">
                                                <h3 className="text-white font-bold flex items-center gap-2">
                                                    <Sparkles className="text-cyan-400" size={18} /> Order Summary
                                                </h3>
                                            </div>

                                            <div className="p-5 sm:p-6 space-y-5 sm:space-y-6">
                                                {/* Course Info */}
                                                <div>
                                                    <p className="text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-1">Program</p>
                                                    <p className="text-white font-black text-base sm:text-lg leading-tight">{courseTitle}</p>
                                                </div>

                                                {/* Custom Payment Toggle */}
                                                <div className="flex bg-white/5 rounded-xl p-1 mb-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsCustomPayment(false)}
                                                        className={`flex-1 py-2 rounded-lg text-[10px] font-black tracking-wide transition-all ${!isCustomPayment ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-600 hover:text-white'}`}
                                                    >
                                                        FIXED AMOUNT
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsCustomPayment(true)}
                                                        className={`flex-1 py-2 rounded-lg text-[10px] font-black tracking-wide transition-all ${isCustomPayment ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-600 hover:text-white'}`}
                                                    >
                                                        MANUAL AMOUNT
                                                    </button>
                                                </div>

                                                {/* Custom Amount Input Box */}
                                                {isCustomPayment && (
                                                    <div className="mb-4">
                                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Enter Amount to Pay Now</label>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 font-bold">₹</span>
                                                            <input
                                                                type="number"
                                                                value={customAmount}
                                                                onChange={(e) => setCustomAmount(e.target.value)}
                                                                placeholder="0"
                                                                min="0"
                                                                className="w-full pl-8 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold focus:outline-none focus:border-cyan-500 transition-all text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Promo Code Box */}
                                                <div className="bg-slate-900/50 rounded-2xl p-4 border border-white/5">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Promo code</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={couponInput}
                                                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                                            placeholder="Enter code"
                                                            className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-bold outline-none focus:border-cyan-500 uppercase transition-all"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={applyCoupon}
                                                            className="shrink-0 bg-white/10 hover:bg-white/20 text-white text-xs font-black px-4 py-2 rounded-xl transition-all uppercase tracking-wider disabled:opacity-50" disabled={couponLoading}
                                                        >
                                                            Apply
                                                        </button>
                                                    </div>
                                                    {couponStatus.type !== 'none' && (
                                                        <p className={`text-[10px] font-bold mt-2 ${couponStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                                            {couponStatus.message}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Pricing Breakdown */}
                                                {!isCustomPayment ? (
                                                    <div className="space-y-3 pt-4 border-t border-white/10">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-slate-600 font-medium">Program Fees</span>
                                                            <span className="text-white font-bold">₹{basePrice.toLocaleString('en-IN')}</span>
                                                        </div>
                                                        {upgradePrice > 0 && (
                                                            <div className="flex justify-between text-sm items-center">
                                                                <span className="text-slate-600 font-medium">{upgradeName || 'Upgrade'}</span>
                                                                <span className="text-white font-bold">₹{upgradePrice.toLocaleString('en-IN')}</span>
                                                            </div>
                                                        )}
                                                        {discountAmount > 0 && (
                                                            <div className="flex justify-between text-sm items-center">
                                                                <div className="flex flex-col">
                                                                    <span className="text-green-400 font-medium">Scholarship Discount</span>
                                                                    <span className="text-[10px] text-green-400/70 font-bold uppercase tracking-wider">{promoCode}</span>
                                                                </div>
                                                                <span className="text-green-400 font-bold">- ₹{discountAmount.toLocaleString('en-IN')}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : null}

                                                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                                    <p className="text-slate-100 font-black flex flex-col">
                                                        <span className="text-xs text-slate-600 font-bold uppercase tracking-wider mb-1">Grand Total</span>
                                                        <span className="text-3xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                                            ₹{isCustomPayment && customAmount ? Number(customAmount).toLocaleString('en-IN') : Math.max(0, basePrice + upgradePrice - discountAmount).toLocaleString('en-IN')}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Note */}
                            <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
                                <CheckCircle size={14} className="text-green-500" />
                                Your data is secured and will only be used for admission guidance.
                            </div>
                        </div>
                    </m.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default InquiryModal;
