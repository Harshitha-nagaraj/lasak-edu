import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Percent, BookOpen, AlertCircle, CheckCircle2, X, Sparkles, Info, Phone, Camera } from 'lucide-react';
import { fetchWithCache } from '../lib/cacheUtils';

interface ScholarshipRule {
  id: string;
  name: string;
  min_percentage: number;
  max_percentage: number;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  is_active: boolean;
  priority: number;
  category: string;
}

interface ScholarshipCalculatorProps {
  coursePrice?: number;
  courseName?: string;
  courseCategory?: string;
  compact?: boolean;
  onCalculate?: (result: CalculationResult) => void;
  onClose?: () => void;
}

interface CalculationResult {
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  scholarshipName: string;
  discountPercentage: number;
  averagePercentage: number;
  promoCode?: string;
  matchingRule?: ScholarshipRule;
}

interface AcademicScores {
  fullName: string;
  phoneNumber: string;
  tenth: string;
  twelfth: string;
  diploma: string;
  collegeCGPA: string;
}

interface ScholarshipSettings {
  modal_title: string;
  modal_description: string;
  success_title: string;
  success_description: string;
  success_next_step_header: string;
  success_next_step_phone: string;
  success_next_step_text: string;
  success_important_header: string;
  success_important_text: string;
  success_note_header: string;
  success_note_text: string;
  failure_title: string;
  failure_header: string;
  failure_body: string;
  failure_phone: string;
  failure_button_text: string;
}

// Default scholarship rules (fallback if database is empty)
const DEFAULT_RULES: ScholarshipRule[] = [
  { id: '1', name: 'Distinction Excellence', min_percentage: 90, max_percentage: 100, discount_type: 'percentage', discount_value: 30, is_active: true, priority: 1, category: 'All' },
  { id: '2', name: 'First Class Merit', min_percentage: 75, max_percentage: 89, discount_type: 'percentage', discount_value: 20, is_active: true, priority: 2, category: 'All' },
  { id: '3', name: 'Second Class Achievement', min_percentage: 60, max_percentage: 74, discount_type: 'percentage', discount_value: 10, is_active: true, priority: 3, category: 'All' },
  { id: '4', name: 'Encouragement Grant', min_percentage: 50, max_percentage: 59, discount_type: 'fixed', discount_value: 1000, is_active: true, priority: 4, category: 'All' },
];

// Convert CGPA to percentage (CGPA * 9.5)
const cgpaToPercentage = (cgpa: number): number => {
  return Math.min(100, cgpa * 9.5);
};

const ScholarshipCalculator: React.FC<ScholarshipCalculatorProps> = ({
  coursePrice = 0,
  courseName = '',
  courseCategory = 'All',
  compact = false,
  onCalculate,
  onClose
}) => {
  const [scores, setScores] = useState<AcademicScores>({
    fullName: '',
    phoneNumber: '',
    tenth: '',
    twelfth: '',
    diploma: '',
    collegeCGPA: ''
  });
  const [allRules, setAllRules] = useState<ScholarshipRule[]>(DEFAULT_RULES);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(coursePrice);
  const [showPopup, setShowPopup] = useState(false);
  const [settings, setSettings] = useState<ScholarshipSettings | null>(null);

  useEffect(() => {
    fetchRules();
    fetchSettings();
  }, []);

  useEffect(() => {
    setPrice(coursePrice);
  }, [coursePrice]);

  const fetchRules = async () => {
    try {
      const { getFirestoreDb } = await import('../lib/firebase');
      const { collection, query, where, orderBy } = await import('firebase/firestore');
      const db = await getFirestoreDb();
      const q = query(collection(db, 'scholarship_rules'), where('is_active', '==', true), orderBy('priority', 'asc'));
      const rulesData = await fetchWithCache('cache_scholarship_rules', q);

      if (rulesData && rulesData.length > 0) {
        setAllRules(rulesData as any);
      }
    } catch (err) {
      console.log('Using default scholarship rules', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const { getFirestoreDb } = await import('../lib/firebase');
      const { collection, query, limit } = await import('firebase/firestore');
      const db = await getFirestoreDb();
      const q = query(collection(db, 'scholarship_settings'), limit(1));
      const settingsData = await fetchWithCache('cache_scholarship_settings', q);

      if (settingsData && settingsData.length > 0) {
        setSettings(settingsData[0] as ScholarshipSettings);
      }
    } catch (err) {
      console.error('Error fetching scholarship settings:', err);
    }
  };

  // Get rules for the current category (category-specific + global "All" rules)
  const getApplicableRules = (): ScholarshipRule[] => {
    const categoryRules = allRules.filter(r => r.category === courseCategory);
    if (categoryRules.length === 0) {
      return allRules.filter(r => r.category === 'All');
    }
    return categoryRules;
  };

  const calculateAveragePercentage = (): number | null => {
    const percentages: number[] = [];
    if (scores.tenth) {
      const val = parseFloat(scores.tenth);
      if (!isNaN(val) && val >= 0 && val <= 100) percentages.push(val);
    }
    if (scores.twelfth) {
      const val = parseFloat(scores.twelfth);
      if (!isNaN(val) && val >= 0 && val <= 100) percentages.push(val);
    }
    if (scores.diploma) {
      const val = parseFloat(scores.diploma);
      if (!isNaN(val) && val >= 0 && val <= 100) percentages.push(val);
    }
    if (scores.collegeCGPA) {
      const val = parseFloat(scores.collegeCGPA);
      if (!isNaN(val) && val >= 0 && val <= 10) percentages.push(cgpaToPercentage(val));
    }
    if (percentages.length === 0) return null;
    const average = percentages.reduce((sum, p) => sum + p, 0) / percentages.length;
    return Math.round(average * 100) / 100;
  };

  const isFormValid = (): boolean => {
    const hasRequiredInfo = scores.fullName.trim().length > 2 && scores.phoneNumber.trim().length >= 10;
    const hasSomeAcademicScore = !!(scores.tenth || scores.twelfth || scores.diploma || scores.collegeCGPA);
    return hasRequiredInfo && hasSomeAcademicScore;
  };

  const calculateScholarship = async () => {
    const averagePercentage = calculateAveragePercentage();
    if (averagePercentage === null || !isFormValid()) return;

    setLoading(true);
    setSubmitError(null);

    // Artificial delay for UI feel
    await new Promise(resolve => setTimeout(resolve, 500));

    const applicableRules = getApplicableRules();
    const matchingRule = applicableRules.find(
      rule => averagePercentage >= rule.min_percentage && averagePercentage <= rule.max_percentage
    );

    let calcResult: CalculationResult;

    if (matchingRule) {
      let discountAmount = 0;
      let discountPercentage = 0;

      if (matchingRule.discount_type === 'percentage') {
        discountPercentage = matchingRule.discount_value;
        discountAmount = (price * matchingRule.discount_value) / 100;
      } else {
        discountAmount = matchingRule.discount_value;
        discountPercentage = price > 0 ? (discountAmount / price) * 100 : 0;
      }

      const promoCode = matchingRule.discount_type === 'percentage'
        ? `LASAK${matchingRule.discount_value}`
        : `LASAK${Math.round((discountAmount / price) * 100)}`;

      calcResult = {
        originalPrice: price,
        discountAmount,
        finalPrice: Math.max(0, price - discountAmount),
        scholarshipName: matchingRule.name,
        discountPercentage,
        averagePercentage,
        promoCode,
        matchingRule
      };
    } else {
      calcResult = {
        originalPrice: price,
        discountAmount: 0,
        finalPrice: price,
        scholarshipName: 'No scholarship applicable',
        discountPercentage: 0,
        averagePercentage
      };
    }

    setResult(calcResult);
    setShowPopup(true);
    setLoading(false);

    // Store in Firestore
    try {
      setSubmitting(true);
      const { getFirebaseAuth, getFirestoreDb } = await import('../lib/firebase');
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const auth = await getFirebaseAuth();
      const db = await getFirestoreDb();
      const user = auth.currentUser;

      await addDoc(collection(db, 'scholarship_applications'), {
        user_id: user?.uid || null,
        full_name: scores.fullName,
        phone_number: scores.phoneNumber,
        tenth: parseFloat(scores.tenth) || 0,
        twelfth: parseFloat(scores.twelfth) || 0,
        diploma: parseFloat(scores.diploma) || 0,
        college_cgpa: parseFloat(scores.collegeCGPA) || 0,
        course_name: courseName,
        course_price: price,
        discount_amount: calcResult.discountAmount,
        final_price: calcResult.finalPrice,
        promo_code: calcResult.promoCode || null,
        status: 'pending',
        created_at: serverTimestamp()
      });

    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError('Failed to save your application. Please try again.');
    } finally {
      setSubmitting(false);
    }

    if (onCalculate) onCalculate(calcResult);
  };

  const updateScore = (field: keyof AcademicScores, value: string) => {
    setScores(prev => ({ ...prev, [field]: value }));
    setResult(null);
  };

  return (
    <>
      {compact ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-purple-50 rounded-2xl p-4 border border-purple-100"
        >
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="text-purple-600" size={18} />
            <h4 className="font-bold text-slate-800 text-sm">{settings?.modal_title || "Scholarship Calculator"}</h4>
          </div>
          <div className="space-y-3">
            <input type="text" value={scores.fullName} onChange={(e) => updateScore('fullName', e.target.value)} placeholder="Full Name" className="w-full px-2 py-1.5 rounded-lg border text-sm" />
            <input type="tel" value={scores.phoneNumber} onChange={(e) => updateScore('phoneNumber', e.target.value)} placeholder="Phone Number" className="w-full px-2 py-1.5 rounded-lg border text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={scores.tenth} onChange={(e) => updateScore('tenth', e.target.value)} placeholder="10th %" className="w-full px-2 py-1.5 rounded-lg border text-sm" />
              <input type="number" value={scores.twelfth} onChange={(e) => updateScore('twelfth', e.target.value)} placeholder="12th %" className="w-full px-2 py-1.5 rounded-lg border text-sm" />
            </div>
            <button onClick={calculateScholarship} disabled={loading || submitting || !isFormValid()} className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm font-bold disabled:opacity-50">
              {loading || submitting ? "Processing..." : "Calculate"}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2.5 md:p-6 relative">
            {onClose && (
              <button onClick={onClose} className="absolute right-2 top-2 md:right-4 md:top-4 p-1 md:p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors z-50">
                <X size={16} className="md:w-5 md:h-5" />
              </button>
            )}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-3 bg-white/20 rounded-lg md:rounded-xl">
                <GraduationCap className="text-white w-4 h-4 md:w-6 md:h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-base md:text-2xl font-black text-white leading-tight">
                  {settings?.modal_title || "Scholarship Calculator"}
                </h2>
                <p className="text-blue-100 text-[9px] md:text-sm font-medium mt-0.5 md:mt-1 leading-tight">
                  {settings?.modal_description || "Check your eligibility based on academic performance"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-3 md:space-y-6">
                {courseName && (
                  <div className="bg-slate-50 rounded-2xl p-3 md:p-5 border border-slate-100">
                    <span className="text-[8px] md:text-[10px] uppercase font-bold text-slate-600 tracking-wider">Selected Course</span>
                    <h3 className="text-base md:text-xl font-black text-slate-800 mt-0.5">{courseName}</h3>
                    <div className="flex items-baseline gap-2 mt-2 md:mt-4">
                      <p className="text-xl md:text-3xl font-black text-blue-600">₹{price.toLocaleString()}</p>
                      <p className="text-[9px] md:text-sm text-slate-600 font-bold uppercase tracking-tight">Course Fee</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  <div className="space-y-0.5 md:space-y-1 md:col-span-2">
                    <label className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
                    <input type="text" value={scores.fullName} onChange={(e) => updateScore('fullName', e.target.value)} className="w-full px-3 py-1.5 md:px-4 md:py-3 rounded-xl border-2 border-slate-100 font-bold outline-none focus:border-purple-500 text-xs md:text-base placeholder:text-slate-300" placeholder="John Doe" />
                  </div>
                  <div className="space-y-0.5 md:space-y-1 md:col-span-2">
                    <label className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase">Phone Number</label>
                    <input type="tel" value={scores.phoneNumber} onChange={(e) => updateScore('phoneNumber', e.target.value)} className="w-full px-3 py-1.5 md:px-4 md:py-3 rounded-xl border-2 border-slate-100 font-bold outline-none focus:border-purple-500 text-xs md:text-base placeholder:text-slate-300" placeholder="7418734466" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 md:col-span-2">
                    <div className="space-y-0.5 md:space-y-1">
                      <label className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase">10th %</label>
                      <input type="number" value={scores.tenth} onChange={(e) => updateScore('tenth', e.target.value)} className="w-full px-2 py-1.5 md:px-4 md:py-3 rounded-xl border-2 border-slate-100 font-bold outline-none focus:border-purple-500 text-xs md:text-base placeholder:text-slate-300" placeholder="85" />
                    </div>
                    <div className="space-y-0.5 md:space-y-1">
                      <label className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase">12th %</label>
                      <input type="number" value={scores.twelfth} onChange={(e) => updateScore('twelfth', e.target.value)} className="w-full px-2 py-1.5 md:px-4 md:py-3 rounded-xl border-2 border-slate-100 font-bold outline-none focus:border-purple-500 text-xs md:text-base placeholder:text-slate-300" placeholder="80" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 md:col-span-2">
                    <div className="space-y-0.5 md:space-y-1">
                      <label className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase">Diploma %</label>
                      <input type="number" value={scores.diploma} onChange={(e) => updateScore('diploma', e.target.value)} className="w-full px-2 py-1.5 md:px-4 md:py-3 rounded-xl border-2 border-slate-100 font-bold outline-none focus:border-purple-500 text-xs md:text-base placeholder:text-slate-300" placeholder="--" />
                    </div>
                    <div className="space-y-0.5 md:space-y-1">
                      <label className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase">CGPA</label>
                      <input type="number" value={scores.collegeCGPA} onChange={(e) => updateScore('collegeCGPA', e.target.value)} className="w-full px-2 py-1.5 md:px-4 md:py-3 rounded-xl border-2 border-slate-100 font-bold outline-none focus:border-purple-500 text-xs md:text-base placeholder:text-slate-300" placeholder="8.5" />
                    </div>
                  </div>
                </div>

                <button onClick={calculateScholarship} disabled={loading || submitting || !isFormValid()} className="w-full py-2.5 md:py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-black text-sm md:text-lg shadow-xl shadow-purple-100 transform active:scale-[0.98] transition-all disabled:opacity-50 mt-1">
                  {loading || submitting ? "Processing..." : "Calculate Scholarship"}
                </button>
                {submitError && (
                  <p className="text-red-500 text-[10px] md:text-xs font-bold text-center mt-2">{submitError}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showPopup && result && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowPopup(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Popup Header */}
              <div className={`pt-10 pb-2 md:pt-14 md:pb-3 px-4 md:px-8 text-center relative ${result.discountAmount > 0 ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gradient-to-r from-red-500 to-pink-600'}`}>
                <button onClick={() => setShowPopup(false)} className="absolute right-4 top-4 md:right-5 md:top-5 p-2 bg-white/40 hover:bg-white/50 text-white rounded-full transition-all z-50 shadow-sm">
                  <X size={20} className="md:w-6 md:h-6" />
                </button>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-0.5">
                  {result.discountAmount > 0 ? <Sparkles className="text-purple-600 w-5 h-5 md:w-6 md:h-6" /> : <Info className="text-red-500 w-5 h-5 md:w-6 md:h-6" />}
                </div>
                <h2 className="text-lg md:text-2xl font-black text-white px-2 md:px-4 leading-tight">
                  {result.discountAmount > 0
                    ? (settings?.success_title || "🎉 Congratulations! Your Scholarship Is Approved 🎉")
                    : (settings?.failure_title || "Scholarship Eligibility Update")
                  }
                </h2>
                {result.discountAmount > 0 && (
                  <p className="text-white/90 text-[10px] md:text-xs font-medium mt-0.5 max-w-2xl mx-auto leading-tight">
                    {settings?.success_description || "Based on the eligibility details you have provided, your scholarship has been provisionally approved."}
                  </p>
                )}
              </div>

              {/* Popup Content */}
              <div className="pt-2 pb-3 px-3 md:pt-3 md:pb-4 md:px-6 overflow-y-auto max-h-[70vh]">
                {result.discountAmount > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-2 md:space-y-3">
                      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-3 md:p-4">
                        <div className="flex justify-between items-start mb-2 md:mb-3">
                          <div>
                            <span className="text-[9px] md:text-[10px] font-bold text-slate-600 uppercase tracking-widest">Selected Course</span>
                            <h3 className="text-base md:text-lg font-black text-slate-800 mt-0.5">{courseName}</h3>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] md:text-[10px] font-bold text-purple-400 uppercase tracking-widest">Scholarship Code</span>
                            <div className="text-xs md:text-base text-purple-600 font-extrabold mt-0.5 bg-purple-50 px-2 py-1 rounded border border-purple-100 ring-4 ring-purple-600/5 animte-pulse">
                              {result.promoCode}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1.5 md:space-y-2 pt-2 border-t border-slate-200">
                          <div className="flex justify-between text-[11px] md:text-sm">
                            <span className="text-gray-600">Original Course Fee:</span>
                            <span className="text-gray-700 line-through">₹{result.originalPrice.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-[11px] md:text-sm font-bold">
                            <span className="text-green-600">Scholarship Discount:</span>
                            <span className="text-green-600">-₹{result.discountAmount.toLocaleString()} ({result.discountPercentage.toFixed(0)}%)</span>
                          </div>
                          <div className="flex justify-between items-center pt-1.5 md:pt-2 border-t border-dashed border-slate-200">
                            <span className="text-xs md:text-base text-slate-800 font-black">Final Net Price:</span>
                            <span className="text-xl md:text-3xl font-black text-blue-600">₹{result.finalPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 md:space-y-3">
                      <div className="bg-purple-50 rounded-xl md:rounded-2xl border border-purple-100 p-2.5 md:p-3 flex gap-3 md:gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-600 rounded-lg md:rounded-xl flex items-center justify-center shrink-0">
                          <Phone size={16} className="text-white md:hidden" />
                          <Phone size={20} className="text-white hidden md:block" />
                        </div>
                        <div>
                          <h4 className="text-purple-900 font-bold text-[11px] md:text-sm">{settings?.success_next_step_header || "Next Step:"}</h4>
                          <p className="text-purple-800 text-[10px] md:text-sm mt-0.5">
                            {settings?.success_next_step_text || "Kindly contact us at"} <a href={`tel:${settings?.success_next_step_phone || "7418734466"}`} className="font-bold underline">{settings?.success_next_step_phone || "7418734466"}</a>
                          </p>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-xl md:rounded-2xl border border-blue-100 p-2.5 md:p-3 flex gap-3 md:gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center shrink-0">
                          <Camera size={16} className="text-white md:hidden" />
                          <Camera size={20} className="text-white hidden md:block" />
                        </div>
                        <div>
                          <h4 className="text-blue-900 font-bold text-[11px] md:text-sm">{settings?.success_important_header || "Important:"}</h4>
                          <p className="text-blue-800 text-[10px] md:text-sm mt-0.5">{settings?.success_important_text || "Please take a screenshot of this message to claim your scholarship."}</p>
                        </div>
                      </div>
                      <div className="bg-amber-50 rounded-xl md:rounded-2xl border border-amber-100 p-2.5 md:p-3 flex gap-3 md:gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-600 rounded-lg md:rounded-xl flex items-center justify-center shrink-0">
                          <AlertCircle size={16} className="text-white md:hidden" />
                          <AlertCircle size={20} className="text-white hidden md:block" />
                        </div>
                        <div>
                          <h4 className="text-amber-900 font-bold text-[11px] md:text-sm">{settings?.success_note_header || "Note:"}</h4>
                          <p className="text-amber-800 text-[9px] md:text-xs mt-0.5 font-medium leading-tight">{settings?.success_note_text || "All details will be re-verified by our executive."}</p>
                        </div>
                      </div>
                      <button onClick={() => setShowPopup(false)} className="w-full py-2.5 md:py-3 bg-blue-600 text-white rounded-xl md:rounded-2xl font-black text-base md:text-lg hover:bg-blue-700 transition-all shadow-lg md:shadow-xl shadow-blue-100">
                        I Understand
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    <div className="bg-slate-50 rounded-2xl p-4 md:p-6 opacity-60 grayscale border">
                      <h3 className="text-base md:text-lg font-bold text-slate-600">Not Eligible</h3>
                      <p className="text-xl md:text-2xl font-black text-slate-600 mt-1 md:mt-2">₹{result.originalPrice.toLocaleString()}</p>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      <div className="bg-red-50 rounded-2xl border border-red-100 p-4 md:p-6 flex gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-red-600 rounded-lg md:rounded-xl flex items-center justify-center shrink-0">
                          <Phone size={20} className="text-white md:hidden" />
                          <Phone size={24} className="text-white hidden md:block" />
                        </div>
                        <div>
                          <h4 className="text-red-900 font-bold text-base md:text-lg">{settings?.failure_header || "Contact for Information"}</h4>
                          <p className="text-red-800 text-xs md:text-sm mt-1 mb-2 md:mb-4">{settings?.failure_body || "We recommend you contact our admission counselor for further information."}</p>
                          <a href={`tel:${settings?.failure_phone || "7418734466"}`} className="text-lg md:text-xl font-black text-red-600 hover:underline">
                            {settings?.failure_phone || "+91 74187 34466"}
                          </a>
                        </div>
                      </div>
                      <button onClick={() => setShowPopup(false)} className="w-full py-3 md:py-4 bg-slate-800 text-white rounded-2xl font-black text-base md:text-lg">
                        {settings?.failure_button_text || "Close"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ScholarshipCalculator;
