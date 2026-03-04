import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check, Building2, Phone, ArrowRight, ArrowLeft, BookOpen,
    X, Wrench, Star, Users, Brain, GraduationCap,
    Target, Briefcase, HelpCircle, ChevronDown, MessageCircle,
    Download, Award, Rocket, Clock, PlayCircle
} from 'lucide-react';
import { Course } from '../types';
import { COMPANY_LOGOS, getCompaniesForCourse, COURSES } from '../constants';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where, limit, addDoc } from 'firebase/firestore';
import SEO from '../components/SEO';
import ScholarshipCalculator from '../components/ScholarshipCalculator';
import InquiryModal from '../components/InquiryModal';
import RazorpayButton from '../components/RazorpayButton';

const cleanPath = (url: string) => {
    if (!url) return url;
    if (url.startsWith('https://') || url.startsWith('http://')) return url;
    return url.replace(/^\/?public\//, '/');
};

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState<Course | null>(COURSES.find(c => c.id === id) || null);
    const [loading, setLoading] = useState(!COURSES.find(c => c.id === id));
    const [showScholarshipModal, setShowScholarshipModal] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [selectedPassport, setSelectedPassport] = useState<'skills' | 'interview' | 'job'>('skills');
    const [enquiryFormData, setEnquiryFormData] = useState({
        name: '',
        phone: '',
        email: '',
        branch: ''
    });
    const [formSettings, setFormSettings] = useState({
        url: '',
        title: 'Submit Your Details',
        departments: [] as string[]
    });
    const [user, setUser] = useState<any>(null);
    const [hasSubmittedInquiry, setHasSubmittedInquiry] = useState(false);
    const [scholarshipDiscount, setScholarshipDiscount] = useState(0);
    const [inquiryModal, setInquiryModal] = useState({
        isOpen: false,
        actionType: 'enroll' as 'enroll' | 'modules' | 'pay',
        onSuccess: undefined as ((data?: any) => void) | undefined
    });
    const [promoCode, setPromoCode] = useState<string>('');
    const [couponInput, setCouponInput] = useState<string>('');
    const [couponStatus, setCouponStatus] = useState<{ type: 'success' | 'error' | 'none', message: string }>({ type: 'none', message: '' });
    const [firestoreCoupons, setFirestoreCoupons] = useState<any[]>([]);
    const [isCustomPayment, setIsCustomPayment] = useState(false);
    const [customAmount, setCustomAmount] = useState<string>('');
    interface PassportFeatures {
        price: string | number;
        features: string[];
    }

    interface PassportSettings {
        category: string;
        skills: PassportFeatures;
        interview: PassportFeatures;
        job: PassportFeatures;
    }

    const defaultPassportSettings: PassportSettings = {
        category: 'default',
        skills: {
            price: 0,
            features: [
                "Comprehensive Curriculum",
                "Integrated Assessment Centre",
                "Faculty with 10+ years experience",
                "Premium Resume Builder",
                "Project Consultation & Feedback",
                "Weekend Doubt Clearing Sessions"
            ]
        },
        interview: {
            price: 4000,
            features: [
                "Access to Curated Job Portal",
                "LinkedIn Profile Review",
                "Mock Interviews with Experts",
                "Placement Prep with Mentor",
                "Secure Your Salary Protection",
                "Interview Guarantee (Min 3)"
            ]
        },
        job: {
            price: 9000,
            features: [
                "Communicative English Course",
                "Mentors from 250+ Industries",
                "Career Assessment & Counseling",
                "Placement Assistance (Lifetime)",
                "Job Guarantee (Dedicated Manager)"
            ]
        }
    };

    const [passportSettings, setPassportSettings] = useState<PassportSettings>(defaultPassportSettings);

    const heroPaymentRef = React.useRef<any>(null);
    const pricingPaymentRef = React.useRef<any>(null);

    useEffect(() => {
        const fetchCourseAndPassport = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, 'courses', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const courseData = { id: docSnap.id, ...docSnap.data() } as Course;
                    setCourse(courseData);

                    // Fetch passport settings for this course's category
                    try {
                        const passportRef = doc(db, 'passport_settings', courseData.category);
                        const passportSnap = await getDoc(passportRef);

                        if (passportSnap.exists()) {
                            setPassportSettings(passportSnap.data() as PassportSettings);
                        } else {
                            // Try fetching default if specific category settings don't exist
                            const defaultRef = doc(db, 'passport_settings', 'default');
                            const defaultSnap = await getDoc(defaultRef);
                            if (defaultSnap.exists()) {
                                setPassportSettings(defaultSnap.data() as PassportSettings);
                            }
                        }
                    } catch (passportError) {
                        console.error('Error fetching passport settings:', passportError);
                    }
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching course:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseAndPassport();

        // Listen for auth changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                checkInquiryStatus(user.email || undefined);
            } else {
                setHasSubmittedInquiry(false);
            }
        });

        // Fetch active coupons from Firestore
        getDocs(collection(db, 'coupons')).then(snap => {
            const active = snap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .filter((c: any) => c.active !== false);
            setFirestoreCoupons(active);
        }).catch(() => { /* silent fail — fallback coupons still work */ });

        return () => unsubscribe();
    }, []);

    const checkInquiryStatus = async (email: string | undefined) => {
        if (!email) return;
        try {
            const enquiriesRef = collection(db, 'enquiries');
            const q = query(enquiriesRef, where('email', '==', email), limit(1));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setHasSubmittedInquiry(true);
            }
        } catch (error) {
            console.error('Error checking inquiry status:', error);
        }
    };

    const handlePaymentClick = (type: 'hero' | 'pricing') => {
        // Check if basic information is present
        if (!enquiryFormData.name || !enquiryFormData.phone || !enquiryFormData.email) {
            // Open modal in 'pay' mode to collect info first
            setInquiryModal(prev => ({
                ...prev,
                isOpen: true,
                actionType: 'pay',
                onSuccess: (data) => {
                    // Update state for future refs
                    if (data) {
                        setEnquiryFormData(prev => ({
                            ...prev,
                            name: data.name,
                            email: data.email,
                            phone: data.phone,
                            branch: data.branch
                        }));
                        // Update discount and promo code from modal
                        setScholarshipDiscount(data.discountAmount || 0);
                        setPromoCode(data.promoCode || '');
                        if (data.customAmount !== undefined) {
                            setIsCustomPayment(true);
                            setCustomAmount(String(data.customAmount));
                        } else {
                            setIsCustomPayment(false);
                            setCustomAmount('');
                        }
                    }

                    // Trigger payment IMMEDIATELY with the data from modal
                    const paymentInfo = data ? {
                        full_name: data.name,
                        email: data.email,
                        phone: data.phone,
                        branch: data.branch
                    } : undefined;

                    if (type === 'hero') heroPaymentRef.current?.handlePayment(paymentInfo, data?.promoCode, data?.discountAmount, data?.customAmount);
                    else pricingPaymentRef.current?.handlePayment(paymentInfo, data?.promoCode, data?.discountAmount, data?.customAmount);
                }
            }));
            return;
        }

        // Information present, trigger payment directly
        if (type === 'hero') heroPaymentRef.current?.handlePayment();
        else pricingPaymentRef.current?.handlePayment();
    };

    const handleEnquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // 1. Store lead in Firestore
            const submission = {
                full_name: enquiryFormData.name,
                phone: enquiryFormData.phone,
                email: enquiryFormData.email,
                message: `AUTONOTIFY: Course Enquiry for ${course?.title} (Branch: ${enquiryFormData.branch})`,
                branch: enquiryFormData.branch,
                source: 'Course Quick Enquiry',
                status: 'New',
                created_at: new Date()
            };

            await addDoc(collection(db, 'enquiries'), submission);

            // 2. Automated Notification via Google Script (No mailto required)
            const scriptUrl = formSettings.url || "https://script.google.com/macros/s/AKfycbwA4ov727SfKJtwf851GvUQEATLRpUUV_JzWzAhgjIWuETQmKPHH9e7N35T5wWnE7PF4w/exec";

            const sheetsData = {
                fullName: enquiryFormData.name,
                phone: enquiryFormData.phone,
                email: enquiryFormData.email,
                preferredBranch: enquiryFormData.branch,
                department: course?.category || 'General',
                status: 'New', // Default status
                course: course?.title || 'Unknown Course'
            };

            // Trigger automated email intimation
            fetch(scriptUrl, {
                method: "POST",
                mode: 'no-cors',
                body: JSON.stringify(sheetsData)
            });

            alert("Inquiry Sent! We have received your details and will contact you shortly.");
            setEnquiryFormData({ name: '', phone: '', email: '', branch: '' });

        } catch (error) {
            console.error("Enquiry Error:", error);
            alert("Entry Saved in Database. We will contact you soon!");
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    // Fallback static data if Firestore lacks some fields
    const getFallbackFeatures = () => [
        "Industry-Expert Trainers",
        "Live Hands-on Projects",
        "Internship Opportunity",
        "Resume Building Support",
        "Mock Interviews",
        "Certification",
        "100% Placement Assistance"
    ];

    const getFallbackEligibility = () => [
        "College Students & Freshers",
        "Working Professionals",
        "Non-Technical Learners",
        "Final Year Students"
    ];

    const getFallbackFAQs = (courseTitle: string) => [
        {
            question: "Is prior knowledge required?",
            answer: `No, this ${courseTitle} course is designed from beginner to advanced levels. We start from the basics.`
        },
        {
            question: "Will I get certification?",
            answer: "Yes, you will receive an industry-recognized certification upon successful completion of the course and projects."
        },
        {
            question: "Is placement support available?",
            answer: "Absolutely! We provide dedicated placement assistance including mock interviews, resume preparation, and job referrals."
        },
        {
            question: "What is the course duration?",
            answer: "The duration varies by course. This specific workshop is designed to be completed within the mentioned timeline with intensive practical sessions."
        },
        {
            question: "Is this course beginner friendly?",
            answer: "Yes, our instructors ensure that even students from non-technical backgrounds can follow the curriculum easily."
        }
    ];

    const parsePrice = (priceStr: string | undefined | null) => {
        if (!priceStr) return 0;
        const cleaned = priceStr.toString().replace(/[^0-9]/g, '');
        const num = parseInt(cleaned);
        return isNaN(num) ? 0 : num;
    };

    const formatPrice = (price: number) => {
        return `₹${price.toLocaleString('en-IN')}`;
    };

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settingsDoc = await getDoc(doc(db, 'site_settings', 'contact_form_settings'));
                if (settingsDoc.exists()) {
                    const val = settingsDoc.data().value;
                    if (val) setFormSettings(val);
                }
            } catch (err) { console.error("Error fetching settings:", err); }
        };

        fetchSettings();

        const fetchCourse = async () => {
            if (!id) return;
            try {
                const courseDoc = await getDoc(doc(db, 'courses', id));
                let courseData = courseDoc.exists() ? courseDoc.data() : null;
                if (courseData) courseData.id = courseDoc.id;

                if (!courseData) {
                    const staticData = COURSES.find(c => c.id === id);
                    if (staticData) courseData = staticData;
                }

                if (courseData) {
                    const staticCourse = COURSES.find(c => c.id === courseData.id || c.title === courseData.title);

                    const mappedCourse: Course = {
                        id: courseData.id,
                        title: courseData.title,
                        category: courseData.category,
                        // Prioritize database price, fallback to static price
                        price: courseData.price || staticCourse?.price,
                        // Handle old price for display if needed
                        oldPrice: courseData.old_price || courseData.oldPrice || staticCourse?.oldPrice,
                        duration: courseData.duration || staticCourse?.duration,
                        image: courseData.image || staticCourse?.image,
                        description: courseData.description || staticCourse?.description,
                        modules: (courseData.modules && courseData.modules.length > 0) ? courseData.modules : (staticCourse?.modules || []),
                        isFree: courseData.isFree,
                        tools: (courseData.tools && courseData.tools.length > 0) ? courseData.tools : (staticCourse?.tools || []),
                        companies: (courseData.companies && courseData.companies.length > 0) ? courseData.companies : (staticCourse?.companies || []),
                        enrollLink: courseData.enroll_link || courseData.enrollLink || staticCourse?.enrollLink,
                        phone: courseData.phone || staticCourse?.phone,
                        supportLink: courseData.support_link || courseData.supportLink || staticCourse?.supportLink,
                        // New fields - Prioritize database if available, then static
                        tagline: courseData.tagline || staticCourse?.tagline || `Master ${courseData.title} and accelerate your career growth with expert-led training.`,
                        introduction: courseData.introduction || staticCourse?.introduction || courseData.description,
                        skills_gained: courseData.skills_gained || staticCourse?.skills_gained || [],
                        eligibility: courseData.eligibility || staticCourse?.eligibility || getFallbackEligibility(),
                        live_projects: (courseData.live_projects && courseData.live_projects.length > 0) ? courseData.live_projects : (staticCourse?.live_projects || [
                            { title: "Industry Standard Project 1", description: "Real-world application of core concepts in a production environment." },
                            { title: "Advanced Capstone Project", description: "Complex problem-solving using industry-standard tools and methodologies." }
                        ]),
                        career_opportunities: (courseData.career_opportunities && courseData.career_opportunities.length > 0) ? courseData.career_opportunities : (staticCourse?.career_opportunities || [
                            { role: `${courseData.category} Specialist`, description: "Oversee technical implementations and system designs." },
                            { role: "Junior Developer/Designer", description: "Support team projects and contribute to core deliverables." }
                        ]),
                        faqs: (courseData.faqs && courseData.faqs.length > 0) ? courseData.faqs : (staticCourse?.faqs || getFallbackFAQs(courseData.title)),
                        features: (courseData.features && courseData.features.length > 0) ? courseData.features : (staticCourse?.features || getFallbackFeatures()),
                        long_description: courseData.long_description || staticCourse?.long_description || courseData.description,
                        skills_passport_price: courseData.skills_passport_price || staticCourse?.skills_passport_price || '₹0',
                        interview_passport_price: courseData.interview_passport_price || staticCourse?.interview_passport_price || '₹4,000',
                        job_passport_price: courseData.job_passport_price || staticCourse?.job_passport_price || '₹9,000',
                        seo: courseData.seo || staticCourse?.seo || {
                            title: `${courseData.title} Course in Coimbatore | Lasak Edu`,
                            description: `Best ${courseData.title} training in Coimbatore with placement support. Learn from experts at Lasak Edu.`,
                            keywords: `${courseData.title}, Course in Coimbatore, Lasak Edu, Placement`
                        }
                    };
                    setCourse(mappedCourse);
                }
            } catch (error) {
                console.error('Error fetching course:', error);
                const staticData = COURSES.find(c => c.id === id);
                if (staticData) {
                    setCourse(staticData);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();

        const params = new URLSearchParams(window.location.search);
        if (params.get('showScholarship') === 'true') {
            setShowScholarshipModal(true);
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [id]);

    const handleApplyScholarship = async () => {
        setShowScholarshipModal(true);
    };

    const handleScholarshipCalculation = (result: any) => {
        if (result.discountAmount > 0) {
            setScholarshipDiscount(result.discountAmount);
            if (result.promoCode) {
                setPromoCode(result.promoCode);
                setCouponInput(result.promoCode);
            }
        }
    };

    const applyCoupon = () => {
        const code = couponInput.trim().toUpperCase();
        if (!code) {
            setScholarshipDiscount(0);
            setPromoCode('');
            setCouponStatus({ type: 'none', message: '' });
            return;
        }

        const basePrice = parsePrice(course?.price);

        // ── 1. Check Firestore coupons first (admin-managed) ──────────────────
        if (firestoreCoupons.length > 0) {
            const fsMatch = firestoreCoupons.find((c: any) => c.code === code);
            if (fsMatch) {
                if (basePrice >= fsMatch.minPrice && basePrice <= fsMatch.maxPrice) {
                    const discount = (basePrice * fsMatch.percentage) / 100;
                    setScholarshipDiscount(discount);
                    setPromoCode(code);
                    setCouponStatus({ type: 'success', message: `🎉 Coupon applied! ${fsMatch.percentage}% OFF → You save ${formatPrice(discount)}` });
                } else {
                    setCouponStatus({ type: 'error', message: `Coupon ${code} is not valid for this course's price range.` });
                    setScholarshipDiscount(0);
                    setPromoCode('');
                }
                return;
            }
        }

        // ── 2. Fallback: hardcoded price-range coupons ─────────────────────
        const rangeCoupons = [
            { code: 'LASAK50', percentage: 50, min: 80000, max: 100000 },
            { code: 'LASAK20', percentage: 20, min: 60000, max: 89999 },
            { code: 'LASAK10', percentage: 10, min: 30000, max: 50000 },
        ];

        const rangeMatch = rangeCoupons.find(c => c.code === code);
        if (rangeMatch) {
            if (basePrice >= rangeMatch.min && basePrice <= rangeMatch.max) {
                const discount = (basePrice * rangeMatch.percentage) / 100;
                setScholarshipDiscount(discount);
                setPromoCode(code);
                setCouponStatus({ type: 'success', message: `🎉 Coupon applied! ${rangeMatch.percentage}% OFF → You save ${formatPrice(discount)}` });
            } else {
                setCouponStatus({ type: 'error', message: `Coupon ${code} is not valid for this course's price range.` });
                setScholarshipDiscount(0);
                setPromoCode('');
            }
            return;
        }

        // ── 3. Generic LASAK{N} fallback ──────────────────────────────────
        const match = code.match(/^LASAK([A-Z]*)(\d+)$/);
        if (match) {
            const percentage = parseInt(match[2]);
            if (percentage > 0 && percentage <= 100) {
                const discount = (basePrice * percentage) / 100;
                setScholarshipDiscount(discount);
                setPromoCode(code);
                setCouponStatus({ type: 'success', message: `🎉 Coupon applied! ${percentage}% OFF → You save ${formatPrice(discount)}` });
                return;
            }
        }

        setCouponStatus({ type: 'error', message: 'Invalid or expired coupon code.' });
        setScholarshipDiscount(0);
        setPromoCode('');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Course Not Found</h2>
                <button onClick={() => navigate('/courses')} className="px-6 py-2 bg-blue-600 text-white rounded-full">Back to Courses</button>
            </div>
        );
    }

    const relatedCourses = COURSES.filter(c => c.category === course.category && c.id !== course.id).slice(0, 3);


    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <SEO
                title={course.seo?.title || course.title}
                description={course.seo?.description || course.description}
                keywords={course.seo?.keywords}
                image={cleanPath(course.image)}
                url={window.location.href}
            />

            {/* Schema Markup for SEO */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Course",
                    "name": course.title,
                    "description": course.description,
                    "provider": {
                        "@type": "Organization",
                        "name": "Lasak Edu",
                        "sameAs": "https://lasakedu.in"
                    },
                    "offers": {
                        "@type": "Offer",
                        "price": parsePrice(course.price),
                        "priceCurrency": "INR",
                        "category": "EducationalCourse"
                    },
                    "hasCourseInstance": {
                        "@type": "CourseInstance",
                        "courseMode": "Blended",
                        "courseWorkload": course.duration
                    }
                })}
            </script>

            {course.faqs && (
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": course.faqs.map(faq => ({
                            "@type": "Question",
                            "name": faq.question,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": faq.answer
                            }
                        }))
                    })}
                </script>
            )}

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute top-1/2 -left-24 w-72 h-72 bg-purple-50 rounded-full blur-3xl opacity-30"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* Go Back Button */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Go Back
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                            <span className="inline-block px-4 py-1.5 bg-blue-600/10 text-blue-600 rounded-full text-sm font-bold mb-6 tracking-wide uppercase">
                                {course.category} • {course.duration}
                            </span>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6 font-tech">
                                {course.title}
                            </h1>
                            <p className="text-xl text-blue-600 font-bold mb-4">{course.tagline}</p>
                            <p className="text-slate-600 text-lg mb-8 max-w-xl leading-relaxed">
                                {course.introduction}
                            </p>

                            <div className="flex flex-wrap gap-6 mb-10">
                                <div className="flex items-center gap-3">
                                    <Clock className="text-blue-600" size={24} />
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Duration</p>
                                        <p className="font-bold text-slate-900">{course.duration}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="text-blue-600" size={24} />
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Mode</p>
                                        <p className="font-bold text-slate-900">Online + Offline</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <GraduationCap className="text-blue-600" size={24} />
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Level</p>
                                        <p className="font-bold text-slate-900">Beginner to Advanced</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                                <button
                                    onClick={() => {
                                        if (user && hasSubmittedInquiry) {
                                            alert('Thank you for your interest! We will contact you soon.');
                                            return;
                                        }
                                        setInquiryModal({
                                            isOpen: true,
                                            actionType: 'enroll',
                                            onSuccess: () => alert('Thank you for your interest! We will contact you soon.')
                                        });
                                    }}
                                    className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group w-full sm:w-auto"
                                >
                                    Enquiry now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <div onClick={() => handlePaymentClick('hero')} className="w-full sm:w-auto">
                                    <RazorpayButton
                                        ref={heroPaymentRef}
                                        amount={isCustomPayment && customAmount ? parseInt(customAmount) : Math.max(0, (parsePrice(course.price) || 0) - scholarshipDiscount)}
                                        courseId={course.id}
                                        courseTitle={course.title}
                                        courseCategory={course.category}
                                        promoCode={promoCode}
                                        discountAmount={scholarshipDiscount}
                                        studentInfo={{
                                            full_name: enquiryFormData.name,
                                            email: enquiryFormData.email,
                                            phone: enquiryFormData.phone,
                                            branch: enquiryFormData.branch
                                        }}
                                        className="px-8 py-4 bg-green-600 text-white font-bold rounded-xl shadow-xl shadow-green-200 hover:bg-green-700 transition-all w-full sm:w-auto"
                                    />
                                </div>
                                <button onClick={handleApplyScholarship} className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                                    Apply Scholarship
                                </button>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
                            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                                <img src={cleanPath(course.image)} alt={course.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <Award className="text-green-600" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Certified Training</p>
                                        <p className="text-xs text-slate-500">ISO 9001:2015 Approved</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. ABOUT THE COURSE */}
            < section className="py-20 bg-slate-50" >
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">About the Course</h2>
                            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
                        </div>
                        <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-sm border border-slate-100">
                            <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                {course.long_description || course.description}
                            </p>
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Skills You'll Master:</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {(course.skills_gained && course.skills_gained.length > 0
                                    ? course.skills_gained
                                    : (course.modules || [])
                                ).map((skill, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                            <Check className="text-blue-600" size={14} strokeWidth={3} />
                                        </div>
                                        <span className="text-slate-700 font-medium">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* 3. TECHNOLOGIES COVERED */}
            {
                course.tools && course.tools.length > 0 && (
                    <section className="py-20 bg-white">
                        <div className="container mx-auto px-4 text-center">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Technologies & Tools</h2>
                            <p className="text-slate-500 mb-12">Industry-standard tools used by professionals worldwide.</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                {course.tools.map((tool, idx) => (
                                    <div key={idx} className="px-8 py-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-800 font-bold shadow-sm hover:shadow-md hover:scale-105 transition-all flex items-center gap-3">
                                        <Wrench className="text-blue-600" size={18} />
                                        {tool}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )
            }

            {/* 4. COURSE MODULES */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Comprehensive Curriculum</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Structured learning path from basic concepts to advanced professional techniques.</p>
                    </div>
                    <div className="max-w-4xl mx-auto space-y-4">
                        {course.modules.map((mod, idx) => (
                            <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:border-blue-200 transition-colors">
                                <div className="p-4 sm:p-6 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-black flex items-center justify-center shrink-0">
                                            {idx + 1}
                                        </span>
                                        <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{mod}</h4>
                                    </div>
                                    <div className="text-slate-300">
                                        <BookOpen size={20} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. COURSE FEATURES */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Why Choose Us?</h2>
                        <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {course.features?.map((feature, idx) => (
                            <div key={idx} className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100 text-center hover:bg-blue-50 transition-colors">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <Rocket className="text-blue-600" size={28} />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-2">{feature}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. ELIGIBILITY */}
            <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 skew-x-12 translate-x-20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black mb-6">Who Can Join This Course?</h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                Our curriculum is designed to accommodate learners at any stage of their journey. No prior experience is required for most modules.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {course.eligibility?.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                            <Check className="text-blue-500" size={14} strokeWidth={3} />
                                        </div>
                                        <span className="font-bold">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
                            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
                                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                                    <Target className="text-white" size={32} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold">Industry Readiness</h4>
                                    <p className="text-slate-400">Bridging the gap between academia and corporate requirements.</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shrink-0 mt-1">
                                        <Check className="text-white" size={14} strokeWidth={3} />
                                    </div>
                                    <p><span className="font-bold text-white">Full Practical Focus:</span> 80% practical and 20% theory sessions.</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shrink-0 mt-1">
                                        <Check className="text-white" size={14} strokeWidth={3} />
                                    </div>
                                    <p><span className="font-bold text-white">Project Centric:</span> Learn by building real systems.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. LIVE PROJECTS */}
            {
                course.category !== 'Kids' && (
                    <section className="py-20 bg-white">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Real-World Projects</h2>
                                <p className="text-slate-500 max-w-2xl mx-auto">Apply your skills to actual industry use cases through our hands-on project phase.</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                                {course.live_projects?.map((proj, idx) => (
                                    <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all">
                                        <div className="flex items-center gap-4 mb-4 text-blue-600">
                                            <PlayCircle size={32} />
                                            <span className="font-black text-sm uppercase tracking-widest">Live Project {idx + 1}</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-3">{proj.title}</h4>
                                        <p className="text-slate-600 leading-relaxed">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )
            }

            {/* 8. CAREER OPPORTUNITIES */}
            {
                course.category !== 'Kids' && (
                    <section className="py-20 bg-slate-50">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Career Roles After This Course</h2>
                                <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {course.career_opportunities?.map((opp, idx) => (
                                    <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                                        <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 mb-6">
                                            <Briefcase size={24} />
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-4">{opp.role}</h4>
                                        <p className="text-slate-500">{opp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )
            }

            {/* 9. TESTIMONIALS / GOOGLE REVIEWS */}
            <section className="py-20 bg-slate-50 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Student Success Stories</h2>
                    </div>

                    <div className="relative">
                        <div
                            ref={scrollRef}
                            className="flex overflow-x-auto pb-8 gap-6 no-scrollbar snap-x"
                        >
                            {[
                                // ...
                                {
                                    name: "Sakthi",
                                    initials: "SA",
                                    color: "bg-cyan-400",
                                    text: "I recently completed my internship at LASAK Company and had a great learning experience. The environment is very professional...",
                                },
                                {
                                    name: "056_Vishnu R",
                                    initials: "VR",
                                    color: "bg-gray-400",
                                    text: "Actually, I had went there for five days training on solidworks, The of teaching was very nice, simple and understandable.",
                                },
                                {
                                    name: "Rahul Kumar",
                                    initials: "RK",
                                    color: "bg-blue-400",
                                    text: "Excellent coaching and friendly environment. The practical sessions were very helpful for my career growth.",
                                },
                                {
                                    name: "Priyanka S",
                                    initials: "PS",
                                    color: "bg-purple-400",
                                    text: "Best place to learn advanced software. The trainers are highly experienced and provide personal attention to every student.",
                                }
                            ].map((review, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="min-w-[280px] md:min-w-[450px] bg-white p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 snap-center flex flex-col"
                                >
                                    <div className="flex items-center gap-5 mb-8">
                                        <div className={`w-16 h-16 ${review.color} rounded-full flex items-center justify-center text-white font-black text-xl shadow-inner`}>
                                            {review.initials}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-900 mb-1">{review.name}</h4>
                                            <div className="flex gap-1 text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={16} fill="currentColor" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-slate-600 italic text-lg leading-relaxed mb-8 flex-1">
                                        "{review.text}"
                                    </p>

                                    <div className="pt-8 border-t border-slate-50">
                                        <a href="https://www.google.com/search?q=lasak+edu+reviews" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-black text-sm uppercase tracking-widest hover:text-blue-800 transition-colors flex items-center gap-2">
                                            Read Full Review
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Navigation Arrows */}
                        <div className="absolute top-1/2 -left-4 -translate-y-1/2 hidden lg:block z-20">
                            <button
                                onClick={() => scroll('left')}
                                className="w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center text-slate-900 border border-slate-100 hover:bg-slate-50 transition-all group"
                            >
                                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <div className="absolute top-1/2 -right-4 -translate-y-1/2 hidden lg:block z-20">
                            <button
                                onClick={() => scroll('right')}
                                className="w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center text-slate-900 border border-slate-100 hover:bg-slate-50 transition-all group"
                            >
                                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}} />
            </section>

            {/* 10. FAQ SECTION */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Frequently Asked Questions</h2>
                        <div className="flex items-center justify-center gap-2 text-blue-600 font-bold">
                            <HelpCircle size={20} />
                            <span>Clearing your doubts</span>
                        </div>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {course.faqs?.map((faq, idx) => (
                            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                <button
                                    onClick={() => setActiveAccordion(activeAccordion === idx ? null : idx)}
                                    className="w-full p-6 flex items-center justify-between text-left"
                                >
                                    <span className="font-bold text-slate-800">{faq.question}</span>
                                    <ChevronDown className={`text-slate-400 transition-transform ${activeAccordion === idx ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {activeAccordion === idx && (
                                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                            <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-50">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 10. CHOOSE YOUR PASSPORT (NEW SECTION) */}
            {course.category !== 'Kids' && (
                <section className="py-24 bg-white relative overflow-hidden">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Choose Your Passport</h2>
                            <p className="text-slate-500 text-lg">Select the level of support you need for your career growth.</p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {/* 1. SKILLS PASSPORT */}
                            <div
                                onClick={() => setSelectedPassport('skills')}
                                className={`relative p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] border-4 transition-all cursor-pointer group flex flex-col ${selectedPassport === 'skills' ? 'border-blue-600 bg-blue-50/30 shadow-2xl scale-[1.02] sm:scale-105' : 'border-slate-100 bg-white hover:border-blue-200 shadow-xl'}`}
                            >
                                <div className={`absolute top-6 right-6 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPassport === 'skills' ? 'bg-blue-600 border-blue-600' : 'border-slate-200'}`}>
                                    {selectedPassport === 'skills' && <Check size={16} className="text-white" strokeWidth={4} />}
                                </div>
                                <div className="mb-8">
                                    <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Career Skill Builder</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-blue-600">
                                            {parsePrice(passportSettings.skills.price) === 0 ? "INCLUDED" : `+ ${passportSettings.skills.price}`}
                                        </span>
                                        <span className="text-slate-400 text-sm font-bold">/ Upgrade</span>
                                    </div>
                                </div>
                                <ul className="space-y-4 mb-20 flex-1">
                                    {passportSettings.skills.features.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-slate-600 text-sm font-medium">
                                            <Check size={18} className="text-green-500 shrink-0" strokeWidth={3} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className={`mt-auto text-center font-black uppercase tracking-widest text-xs py-3 rounded-xl transition-colors ${selectedPassport === 'skills' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    {selectedPassport === 'skills' ? 'Selected' : 'Select Package'}
                                </div>
                            </div>

                            {/* 2. INTERVIEW PASSPORT */}
                            <div
                                onClick={() => setSelectedPassport('interview')}
                                className={`relative p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] border-4 transition-all cursor-pointer group flex flex-col ${selectedPassport === 'interview' ? 'border-cyan-600 bg-cyan-50/30 shadow-2xl scale-[1.02] sm:scale-105' : 'border-slate-100 bg-white hover:border-cyan-200 shadow-xl'}`}
                            >
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1 bg-cyan-600 text-white text-xs font-black rounded-full uppercase tracking-widest shadow-lg">Most Popular</div>
                                <div className={`absolute top-6 right-6 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPassport === 'interview' ? 'bg-cyan-600 border-cyan-600' : 'border-slate-200'}`}>
                                    {selectedPassport === 'interview' && <Check size={16} className="text-white" strokeWidth={4} />}
                                </div>
                                <div className="mb-8">
                                    <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Interview Success Track</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-cyan-600">+ {passportSettings.interview.price}</span>
                                        <span className="text-slate-400 text-sm font-bold">/ Upgrade</span>
                                    </div>
                                </div>
                                <div className="mb-4 text-xs font-black text-cyan-600 uppercase">ALL CAREER SKILL BUILDER BENEFITS +</div>
                                <ul className="space-y-4 mb-20 flex-1">
                                    {passportSettings.interview.features.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-slate-600 text-sm font-medium">
                                            <Check size={18} className="text-cyan-500 shrink-0" strokeWidth={3} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className={`mt-auto text-center font-black uppercase tracking-widest text-xs py-3 rounded-xl transition-colors ${selectedPassport === 'interview' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    {selectedPassport === 'interview' ? 'Selected' : 'Select Package'}
                                </div>
                            </div>

                            {/* 3. JOB PASSPORT */}
                            <div
                                onClick={() => setSelectedPassport('job')}
                                className={`relative p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] border-4 transition-all cursor-pointer group flex flex-col ${selectedPassport === 'job' ? 'border-rose-600 bg-rose-50/30 shadow-2xl scale-[1.02] sm:scale-105' : 'border-slate-100 bg-white hover:border-rose-200 shadow-xl'}`}
                            >
                                <div className={`absolute top-6 right-6 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPassport === 'job' ? 'bg-rose-600 border-rose-600' : 'border-slate-200'}`}>
                                    {selectedPassport === 'job' && <Check size={16} className="text-white" strokeWidth={4} />}
                                </div>
                                <div className="mb-8">
                                    <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Job Secure Track</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-rose-600">+ {passportSettings.job.price}</span>
                                        <span className="text-slate-400 text-sm font-bold">/ Upgrade</span>
                                    </div>
                                </div>
                                <div className="mb-4 text-xs font-black text-rose-600 uppercase">ALL INTERVIEW SUCCESS TRACK BENEFITS +</div>
                                <ul className="space-y-4 mb-20 flex-1">
                                    {passportSettings.job.features.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-slate-600 text-sm font-medium">
                                            <Check size={18} className="text-rose-500 shrink-0" strokeWidth={3} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className={`mt-auto text-center font-black uppercase tracking-widest text-xs py-3 rounded-xl transition-colors ${selectedPassport === 'job' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    {selectedPassport === 'job' ? 'Selected' : 'Select Package'}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* 11. PRICING & ENROLLMENT (UPDATED) */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-16 text-white text-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10">
                            <span className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest mb-8 inline-block">
                                Final Step to Success
                            </span>
                            <h2 className="text-3xl md:text-5xl font-black mb-10 leading-tight">Begin Your Professional Transformation</h2>

                            {/* Coupon Input Box (Always Visible) */}
                            <div className="mb-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <input
                                    type="text"
                                    value={couponInput}
                                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                    onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                                    placeholder="Enter coupon code (e.g. LASAK50)"
                                    className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 font-bold focus:outline-none focus:border-white/50 backdrop-blur-sm text-sm"
                                />
                                <button
                                    onClick={applyCoupon}
                                    className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-black rounded-xl transition-all text-sm shrink-0"
                                >
                                    Apply
                                </button>
                            </div>
                            {couponStatus.type !== 'none' && (
                                <div className={`mb-6 px-4 py-2 rounded-lg text-sm font-bold inline-block ${couponStatus.type === 'success' ? 'bg-green-500/20 text-green-200 border border-green-400/30' : 'bg-red-500/20 text-red-200 border border-red-400/30'}`}>
                                    {couponStatus.message}
                                </div>
                            )}

                            {/* Custom Amount Toggle */}
                            <div className="flex bg-white/10 rounded-xl p-1 mb-8 max-w-md mx-auto backdrop-blur-sm">
                                <button
                                    onClick={() => setIsCustomPayment(false)}
                                    className={`flex-1 py-3 rounded-lg text-sm font-black tracking-wide transition-all ${!isCustomPayment ? 'bg-white text-blue-900 shadow-md scale-105' : 'text-blue-200 hover:text-white'}`}
                                >
                                    FIXED COURSE AMOUNT
                                </button>
                                <button
                                    onClick={() => setIsCustomPayment(true)}
                                    className={`flex-1 py-3 rounded-lg text-sm font-black tracking-wide transition-all ${isCustomPayment ? 'bg-white text-blue-900 shadow-md scale-105' : 'text-blue-200 hover:text-white'}`}
                                >
                                    MANUALLY ENTER AMOUNT
                                </button>
                            </div>

                            {/* Dynamic Display based on selection */}
                            {isCustomPayment ? (
                                <div className="mb-12 max-w-xs mx-auto animate-in fade-in zoom-in duration-300">
                                    <label className="block text-blue-200 text-xs font-black mb-3 uppercase tracking-widest leading-relaxed">
                                        Enter Amount to Pay Now
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 text-2xl font-black">₹</span>
                                        <input
                                            type="number"
                                            value={customAmount}
                                            onChange={(e) => setCustomAmount(e.target.value)}
                                            placeholder="0"
                                            min="0"
                                            className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white placeholder-blue-200 text-4xl font-black focus:outline-none focus:border-green-400/50 focus:bg-white/20 backdrop-blur-sm transition-all text-center placeholder:opacity-50"
                                        />
                                    </div>
                                    <p className="mt-3 text-white/60 text-xs font-semibold">
                                        Use this to make partial/installment payments.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-4 mb-12 animate-in fade-in zoom-in duration-300">
                                    {scholarshipDiscount > 0 ? (
                                        <>
                                            {/* Original price struck through */}
                                            <span className="text-2xl font-bold text-blue-200 line-through opacity-70">
                                                {formatPrice(parsePrice(course.price) +
                                                    (selectedPassport === 'skills' ? parsePrice(passportSettings.skills.price) :
                                                        selectedPassport === 'interview' ? parsePrice(passportSettings.interview.price) :
                                                            parsePrice(passportSettings.job.price)))}
                                            </span>
                                            {/* You save badge */}
                                            <div className="flex items-center gap-2 px-5 py-1.5 bg-yellow-400/20 border border-yellow-400/40 rounded-full">
                                                <span className="text-yellow-300 font-black text-sm">🎉 You save {formatPrice(scholarshipDiscount)}</span>
                                            </div>
                                            {/* Balance to pay */}
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs font-black uppercase tracking-widest text-green-300 mb-1">Balance to Pay</span>
                                                <span className="text-5xl md:text-8xl font-black text-green-300 tracking-tighter drop-shadow-lg">
                                                    {formatPrice(Math.max(0, parsePrice(course.price) +
                                                        (selectedPassport === 'skills' ? parsePrice(passportSettings.skills.price) :
                                                            selectedPassport === 'interview' ? parsePrice(passportSettings.interview.price) :
                                                                parsePrice(passportSettings.job.price)) - scholarshipDiscount))}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-baseline justify-center gap-4">
                                            <span className="text-4xl xs:text-5xl md:text-8xl font-black text-white tracking-tighter">
                                                {formatPrice(parsePrice(course.price) +
                                                    (selectedPassport === 'skills' ? parsePrice(passportSettings.skills.price) :
                                                        selectedPassport === 'interview' ? parsePrice(passportSettings.interview.price) :
                                                            parsePrice(passportSettings.job.price)))}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center justify-center mb-8">
                                <div className="flex items-center gap-2 px-6 py-2 bg-green-500/20 rounded-full border border-green-500/30 inline-flex">
                                    <Check size={18} className="text-green-400" strokeWidth={4} />
                                    <span className="text-green-100 font-bold uppercase tracking-widest text-xs">
                                        {selectedPassport.toUpperCase()} PASSPORT SELECTED
                                    </span>
                                </div>
                            </div>

                            <div className="mb-8 bg-white/10 px-4 py-2 rounded-lg border border-white/20 inline-block backdrop-blur-sm">
                                <p className="text-sm font-bold text-blue-100 flex items-center justify-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    EMI options starts from ₹2999
                                </p>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                                <div onClick={() => handlePaymentClick('pricing')} className="w-full md:w-auto">
                                    <RazorpayButton
                                        ref={pricingPaymentRef}
                                        amount={isCustomPayment ? (parseInt(customAmount) || 0) : Math.max(0, parsePrice(course.price) +
                                            (selectedPassport === 'skills' ? parsePrice(passportSettings.skills.price) :
                                                selectedPassport === 'interview' ? parsePrice(passportSettings.interview.price) :
                                                    parsePrice(passportSettings.job.price)) - scholarshipDiscount)}
                                        courseId={course.id}
                                        courseTitle={course.title}
                                        courseCategory={course.category}
                                        studentInfo={{
                                            full_name: enquiryFormData.name,
                                            email: enquiryFormData.email,
                                            phone: enquiryFormData.phone,
                                            branch: enquiryFormData.branch
                                        }}
                                        className="px-12 py-5 bg-white text-blue-900 text-xl font-black rounded-2xl hover:bg-blue-50 transition-all shadow-xl hover:scale-105 w-full md:w-auto"
                                    />
                                </div>
                                <button
                                    onClick={() => setInquiryModal({
                                        isOpen: true,
                                        actionType: 'enroll',
                                        onSuccess: () => alert('Thank you for your interest!')
                                    })}
                                    className="px-12 py-5 bg-blue-500/20 text-white text-xl font-bold rounded-2xl border-2 border-white/20 hover:bg-blue-500/30 transition-all hover:scale-105 flex items-center justify-center gap-3 group/btn w-full md:w-auto"
                                >
                                    Confirm Enrollment <ArrowRight size={24} className="group-hover/btn:translate-x-2 transition-transform" />
                                </button>
                                <a
                                    href={`tel:${course.phone || "+917418732525"}`}
                                    className="px-12 py-5 bg-blue-500/20 text-white text-xl font-bold rounded-2xl border-2 border-white/20 hover:bg-blue-500/30 transition-all flex items-center justify-center gap-3 w-full md:w-auto"
                                >
                                    <Phone size={24} /> Talk to Expert
                                </a>
                            </div>

                            <p className="mt-12 text-blue-200/80 text-sm font-medium flex items-center justify-center gap-8">
                                <span className="flex items-center gap-2"><Check size={16} /> Secure Payment</span>
                                <span className="flex items-center gap-2"><Check size={16} /> ISO Certified</span>
                                <span className="flex items-center gap-2"><Check size={16} /> Career Guaranteed</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Internal Linking & Related Courses Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16">
                            {/* Related Courses */}
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                    <BookOpen className="text-blue-600" />
                                    Related {course.category} Courses
                                </h3>
                                <div className="space-y-4">
                                    {relatedCourses.map((relCourse) => (
                                        <Link
                                            key={relCourse.id}
                                            to={`/course/${relCourse.id}`}
                                            className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                                        >
                                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                                                <img src={relCourse.image} alt={relCourse.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{relCourse.title}</h4>
                                                <p className="text-xs text-slate-500">{relCourse.duration}</p>
                                            </div>
                                            <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Internal Links & Navigation */}
                            <div className="bg-blue-50 rounded-[2.5rem] p-8 md:p-10 border border-blue-100 self-start">
                                <h3 className="text-2xl font-black text-slate-900 mb-6">Explore More</h3>
                                <p className="text-slate-600 mb-8">
                                    Continue your learning journey with Lasak Edu. Explore our full range of programs or get in touch for personalized guidance.
                                </p>
                                <div className="space-y-4">
                                    <Link to="/courses" className="flex items-center justify-between p-4 bg-white rounded-xl font-bold text-slate-800 hover:text-blue-600 transition-colors shadow-sm group">
                                        Explore all Courses
                                        <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
                                    </Link>
                                    <Link to="/programs" className="flex items-center justify-between p-4 bg-white rounded-xl font-bold text-slate-800 hover:text-blue-600 transition-colors shadow-sm group">
                                        View our Programs
                                        <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
                                    </Link>
                                    <Link to="/contact" className="flex items-center justify-between p-4 bg-white rounded-xl font-bold text-slate-800 hover:text-blue-600 transition-colors shadow-sm group">
                                        Contact us for Inquiries
                                        <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 12. CONTACT / ENQUIRY */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">Still Have Questions?</h2>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                Our educational consultants are ready to help you choose the right program for your career goals.
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                        <Phone className="text-white" size={28} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-black uppercase mb-1">Call Us Anywhere</p>
                                        <a href={`tel:${course.phone || "+917418732525"}`} className="text-xl font-bold text-slate-800 hover:text-blue-600">{course.phone || "+91 74187 32525"}</a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 p-6 bg-green-50 rounded-2xl shadow-sm border border-green-100">
                                    <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center shrink-0">
                                        <MessageCircle className="text-white" size={28} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-green-600 font-black uppercase mb-1">WhatsApp Now</p>
                                        <a href={`https://wa.me/${(course.phone || "917418732525").replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-green-800 hover:text-green-600">Click to Chat</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100">
                            <h3 className="text-2xl font-black text-slate-900 mb-8">Quick Enquiry Form</h3>
                            <form className="space-y-4" onSubmit={handleEnquirySubmit}>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                                        placeholder="Enter your name"
                                        value={enquiryFormData.name}
                                        onChange={(e) => setEnquiryFormData({ ...enquiryFormData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                                            placeholder="Enter phone"
                                            value={enquiryFormData.phone}
                                            onChange={(e) => setEnquiryFormData({ ...enquiryFormData, phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                                            placeholder="Enter email"
                                            value={enquiryFormData.email}
                                            onChange={(e) => setEnquiryFormData({ ...enquiryFormData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Branch</label>
                                    <select
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all appearance-none cursor-pointer"
                                        value={enquiryFormData.branch}
                                        onChange={(e) => setEnquiryFormData({ ...enquiryFormData, branch: e.target.value })}
                                        required
                                    >
                                        <option value="" disabled>Select Branch</option>
                                        <option value="Peelamedu">Peelamedu</option>
                                        <option value="Gandhipuram">Gandhipuram</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all text-lg mt-4">
                                    Request Callback
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Scholarship Modal */}
            <AnimatePresence>
                {showScholarshipModal && (
                    <div className="fixed inset-0 z-[100000] overflow-y-auto bg-black/60 backdrop-blur-sm" onClick={() => setShowScholarshipModal(false)}>
                        <div className="flex min-h-full items-start justify-center p-4 pt-24 md:pt-36 text-center">
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-3xl transform shadow-xl transition-all" onClick={(e) => e.stopPropagation()}>
                                <ScholarshipCalculator
                                    coursePrice={parsePrice(course.price)}
                                    courseName={course.title}
                                    courseCategory={course.category}
                                    compact={false}
                                    onCalculate={handleScholarshipCalculation}
                                    onClose={() => setShowScholarshipModal(false)}
                                />
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            <InquiryModal
                isOpen={inquiryModal.isOpen}
                onClose={() => setInquiryModal(prev => ({ ...prev, isOpen: false }))}
                courseId={course.id}
                courseTitle={course.title}
                category={course.category}
                actionType={inquiryModal.actionType}
                basePrice={parsePrice(course.price)}
                upgradePrice={
                    selectedPassport === 'skills' ? parsePrice(passportSettings.skills.price) :
                        selectedPassport === 'interview' ? parsePrice(passportSettings.interview.price) :
                            parsePrice(passportSettings.job.price)
                }
                upgradeName={
                    selectedPassport === 'skills' ? 'Career Skill Builder' :
                        selectedPassport === 'interview' ? 'Interview Success Track' :
                            'Job Secure Track'
                }
                initialPromoCode={promoCode}
                initialDiscount={scholarshipDiscount}
                onSuccess={(data) => {
                    if (data) {
                        setEnquiryFormData(prev => ({
                            ...prev,
                            name: data.name,
                            email: data.email,
                            phone: data.phone,
                            branch: data.branch
                        }));
                        setPromoCode(data.promoCode || '');
                        setScholarshipDiscount(data.discountAmount || 0);
                    }
                    if (inquiryModal.onSuccess) inquiryModal.onSuccess(data);
                }}
            />
        </div>
    );
};

export default CourseDetails;
