import React, { useState } from 'react';
import { CreditCard, Loader2, CheckCircle, X, Download } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface RazorpayButtonProps {
    amount: number;
    courseId: string;
    courseTitle: string;
    courseCategory: string;
    studentInfo?: {
        full_name?: string;
        email?: string;
        phone?: string;
        branch?: string;
    };
    promoCode?: string;
    discountAmount?: number;
    className?: string;
    buttonLabel?: string;
    onSuccess?: (paymentId: string) => void;
    onError?: (error: any) => void;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

// Load Razorpay checkout script dynamically
const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
        if (window.Razorpay) { resolve(true); return; }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const RazorpayButton = React.forwardRef<any, RazorpayButtonProps>(({
    amount,
    courseId,
    courseTitle,
    courseCategory,
    promoCode = '',
    discountAmount = 0,
    studentInfo,
    className = "",
    buttonLabel = "Pay Now",
    onSuccess,
    onError
}, ref) => {
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState<{ paymentId: string; amount: number } | null>(null);

    const handlePayment = async (
        overrideInfo?: RazorpayButtonProps['studentInfo'],
        overridePromo?: string,
        overrideDiscount?: number,
        overrideAmount?: number
    ) => {
        const info = overrideInfo || studentInfo;
        const currentDiscount = overrideDiscount !== undefined ? overrideDiscount : discountAmount;
        let currentAmount = 0;

        if (overrideAmount !== undefined) {
            currentAmount = overrideAmount;
        } else {
            currentAmount = Math.max(0, (amount + (discountAmount || 0)) - (currentDiscount || 0));
        }

        const currentPromo = overridePromo !== undefined ? overridePromo : promoCode;

        // Razorpay minimum is ₹1
        if (currentAmount < 1) {
            alert("The total amount must be at least ₹1. Please contact support for a 100% scholarship.");
            return;
        }

        if (!info?.full_name || !info?.email || !info?.phone) {
            alert("Please provide your Name, Email, and Phone number before paying.");
            return;
        }

        setLoading(true);

        try {
            // Load Razorpay SDK
            const loaded = await loadRazorpayScript();
            if (!loaded) {
                throw new Error("Failed to load payment gateway. Please check your internet connection and try again.");
            }

            const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
            if (!razorpayKey) {
                throw new Error("Payment gateway is not configured. Please contact support.");
            }

            // Open Razorpay Checkout (client-only mode — no backend order creation needed)
            const options = {
                key: razorpayKey,
                amount: Math.round(currentAmount * 100), // amount in paise
                currency: "INR",
                name: "LasakEdu Institute",
                description: `Enrollment: ${courseTitle}`,
                image: "/img/lasak-logo.png",
                prefill: {
                    name: info.full_name || '',
                    email: info.email || '',
                    contact: info.phone || '',
                },
                notes: {
                    course_id: courseId,
                    course_title: courseTitle,
                    branch: info.branch || '',
                    promo_code: currentPromo || '',
                },
                theme: {
                    color: "#2563EB"
                },
                handler: async (response: any) => {
                    try {
                        // Save enrollment record to Firestore
                        const user = auth.currentUser;
                        await addDoc(collection(db, 'enrollments'), {
                            payment_id: response.razorpay_payment_id,
                            order_id: response.razorpay_order_id || null,
                            signature: response.razorpay_signature || null,
                            course_id: courseId,
                            course_title: courseTitle,
                            course_category: courseCategory,
                            amount_paid: currentAmount,
                            promo_code: currentPromo || null,
                            discount_applied: currentDiscount || 0,
                            student_name: info?.full_name || '',
                            student_email: info?.email || '',
                            student_phone: info?.phone || '',
                            branch: info?.branch || '',
                            user_id: user?.uid || null,
                            status: 'paid',
                            created_at: serverTimestamp(),
                        });
                        setLoading(false);
                        setPaymentSuccess({ paymentId: response.razorpay_payment_id, amount: currentAmount });
                        if (onSuccess) onSuccess(response.razorpay_payment_id);
                    } catch (dbErr) {
                        console.error("Failed to save enrollment:", dbErr);
                        setLoading(false);
                        setPaymentSuccess({ paymentId: response.razorpay_payment_id, amount: currentAmount });
                        if (onSuccess) onSuccess(response.razorpay_payment_id);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', (response: any) => {
                console.error("Payment failed:", response.error);
                alert(`Payment failed: ${response.error.description || 'Unknown error'}`);
                if (onError) onError(response.error);
                setLoading(false);
            });
            rzp.open();

        } catch (error: any) {
            console.error("Payment Initiation Error:", error);
            alert(error.message || "Failed to initiate payment. Please try again.");
            if (onError) onError(error);
            setLoading(false);
        }
    };

    React.useImperativeHandle(ref, () => ({
        handlePayment
    }));

    return (
        <>
            {/* ── SUCCESS POPUP ─────────────────────────────── */}
            {paymentSuccess && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setPaymentSuccess(null)}>
                    <div
                        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close */}
                        <button
                            onClick={() => setPaymentSuccess(null)}
                            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Confetti dots (decorative) */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-t-3xl" />

                        {/* Icon */}
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
                            <CheckCircle className="text-green-500" size={52} strokeWidth={2} />
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 mb-2">Payment Successful! 🎉</h2>
                        <p className="text-slate-500 mb-6 leading-relaxed">
                            You're now enrolled in <strong className="text-slate-800">{courseTitle}</strong>.<br />
                            Our team will contact you shortly with next steps.
                        </p>

                        {/* Payment details */}
                        <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Amount Paid</span>
                                <span className="font-black text-slate-900">₹{paymentSuccess.amount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Payment ID</span>
                                <span className="font-mono text-xs text-blue-600 font-bold truncate max-w-[180px]">{paymentSuccess.paymentId}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Status</span>
                                <span className="text-green-600 font-black">✓ Confirmed</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setPaymentSuccess(null)}
                            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-green-200 text-lg"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {/* ── PAY BUTTON ───────────────────────────────── */}
            <button
                onClick={() => handlePayment()}
                disabled={loading || amount <= 0}
                className={`flex items-center justify-center gap-2 font-bold transition-all ${className} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                ) : (
                    <CreditCard size={20} />
                )}
                {loading ? "Processing..." : buttonLabel}
            </button>
        </>
    );
});

export default RazorpayButton;
