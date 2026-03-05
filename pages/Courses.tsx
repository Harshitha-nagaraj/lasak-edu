
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Download, Check, Gamepad2, Rocket, Bot, ArrowRight } from 'lucide-react';
import { CATEGORIES, COURSES } from '../constants';
import SEO from '../components/SEO';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { fetchWithCache } from '../lib/cacheUtils';
import { Course } from '../types';
import InquiryModal from '../components/InquiryModal';
import RazorpayButton from '../components/RazorpayButton';
import { normalizeImagePath } from '../lib/imageUtils';

const Courses = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category } = useParams<{ category?: string }>();
  // Helper to get category from URL path parameter
  const getCategoryFromUrl = () => {
    return category || 'All';
  };

  const [activeCategory, setActiveCategory] = useState(getCategoryFromUrl());
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [hasSubmittedInquiry, setHasSubmittedInquiry] = useState(false);
  const [inquiryModal, setInquiryModal] = useState({
    isOpen: false,
    courseId: '',
    courseTitle: '',
    category: '',
    actionType: 'enroll' as 'enroll' | 'modules', // Track which button was clicked
    onSuccess: undefined as (() => void) | undefined
  });
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  useEffect(() => {
    // Load courses and categories
    fetchCourses();
    fetchCategories();

    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        checkInquiryStatus(user.email || undefined);
      } else {
        setHasSubmittedInquiry(false);
      }
    });

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

  // Effect to update state when URL changes (e.g. clicking submenu links)
  useEffect(() => {
    setActiveCategory(getCategoryFromUrl());
  }, [category]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const rawCourses = await fetchWithCache('cache_all_courses', query(collection(db, 'courses'), limit(50)));

      if (rawCourses && rawCourses.length > 0) {
        const fetchedCourses: Course[] = rawCourses.map((c: any) => {
          return {
            id: c.id,
            title: c.title,
            category: c.category,
            price: c.price,
            oldPrice: c.old_price !== undefined ? c.old_price : c.oldPrice,
            duration: c.duration,
            image: c.image,
            description: c.description,
            modules: c.modules || [],
            isFree: c.isFree
          } as Course;
        });
        // Merge with static data — Firestore values ALWAYS take priority
        const mergedCourses = fetchedCourses.map(fetched => {
          const staticCourse = COURSES.find(c => c.id === fetched.id || c.title === fetched.title);
          if (!staticCourse) return fetched;

          return {
            ...staticCourse,
            ...fetched,
            // Use Firestore values; only fall back to static when truly undefined
            image: normalizeImagePath(fetched.image !== undefined ? fetched.image : staticCourse.image),
            description: fetched.description !== undefined ? fetched.description : staticCourse.description,
            price: fetched.price !== undefined ? fetched.price : staticCourse.price,
            oldPrice: fetched.oldPrice !== undefined ? fetched.oldPrice : (staticCourse.oldPrice || ''),
            duration: fetched.duration !== undefined ? fetched.duration : staticCourse.duration,
            modules: (fetched.modules && fetched.modules.length > 0) ? fetched.modules : staticCourse.modules,
          } as Course;
        });
        setCourses(mergedCourses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const fetchedCats = await fetchWithCache('cache_categories_all', query(collection(db, 'categories')));
      if (fetchedCats && fetchedCats.length > 0) {
        setDbCategories(fetchedCats);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredCourses = activeCategory === 'All'
    ? courses
    : courses.filter(c => c.category === activeCategory);

  const filterTabs = ['All', ...(dbCategories.length > 0 ? dbCategories.map(c => c.id) : CATEGORIES.map(c => c.id))];

  // Animation variants
  const bounceVariant: Variants = {
    hover: {
      y: [-10, 0, -10],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-slate-50 to-white">
      <SEO
        title="Best IT, Mechanical & Civil Courses in Coimbatore | LASAK EDU"
        description="Explore industry-standard courses at LASAK EDU: Full Stack Development, Python, AutoCAD, SolidWorks, Revit, and more. Certified training with 100% placement support."
        keywords="IT courses Coimbatore, Mechanical engineering courses Coimbatore, Civil CAD training Coimbatore, LASAK EDU courses, Python training Coimbatore, SolidWorks course Coimbatore, Revit training Coimbatore, best placement training Coimbatore"
      />

      {/* Hero */}
      <div className="bg-white py-24 px-4 text-center relative overflow-hidden border-b border-slate-200">
        <div className="absolute top-0 left-0 w-full h-full bg-slate-50/50 z-0"></div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-4xl md:text-6xl font-black mb-4 text-slate-900 font-tech">Our Courses</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">Industry-designed curriculums that get you hired.</p>
          <p className="text-slate-600 mt-4 text-base">
            Learn more about our <a href="/programs" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-all">Workshops here →</a>
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8 sticky top-20 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="flex flex-wrap gap-2 justify-center">
          {filterTabs.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                const newUrl = cat === 'All' ? '/courses' : `/courses/${cat}`;
                navigate(newUrl);
              }}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all transform duration-300 border ${activeCategory === cat
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
            >
              {dbCategories.find(c => c.id === cat)?.name || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Kids Zone Header (Conditional) */}
      <AnimatePresence>
        {activeCategory === 'Kids' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="container mx-auto px-4 pt-8">
              <div className="bg-white rounded-3xl p-8 border border-yellow-200 relative overflow-hidden text-center shadow-xl">
                <div className="absolute inset-0 bg-yellow-50/50"></div>
                {/* Floating Icons */}
                <motion.div variants={bounceVariant} animate="hover" className="absolute top-4 left-10 text-yellow-500 opacity-80 hidden md:block z-10">
                  <Gamepad2 size={48} />
                </motion.div>
                <motion.div variants={bounceVariant} animate="hover" className="absolute top-10 right-20 text-blue-500 opacity-80 hidden md:block z-10" style={{ animationDelay: '0.5s' }}>
                  <Rocket size={48} />
                </motion.div>
                <motion.div variants={bounceVariant} animate="hover" className="absolute bottom-4 left-1/4 text-purple-500 opacity-80 hidden md:block z-10" style={{ animationDelay: '0.2s' }}>
                  <Bot size={48} />
                </motion.div>

                <div className="relative z-10">
                  <h2 className="text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 mb-4 font-tech drop-shadow-sm leading-tight">
                    KIDS ZONE
                  </h2>
                  <p className="text-lg md:text-xl text-slate-700 font-bold max-w-2xl mx-auto">
                    Future Innovators Start Here! 🚀 <br />
                    <span className="text-sm text-slate-500 font-medium">Robotics • Coding • Fun</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div
            layout
            variants={containerVariants}
            initial="hidden"
            animate="show"
            key={activeCategory} // Forces re-render of staggered animation on category change
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredCourses.map((course) => (
              <motion.div
                layout
                variants={itemVariants}
                whileTap={{ scale: 0.98, boxShadow: "0 0 30px rgba(37, 99, 235, 0.4)" }} // Lighting shadow
                whileHover={{ y: -10 }}
                key={course.id}
                onClick={() => navigate(`/course/${course.id}`)}
                className={`bg-white rounded-2xl overflow-hidden border flex flex-col h-full group transition-all duration-300 hover:-translate-y-2 cursor-pointer ${course.category === 'Kids' ? 'border-yellow-200 hover:shadow-yellow-100 hover:shadow-2xl' : 'border-slate-200 hover:shadow-2xl'
                  }`}
              >
                <div className="h-56 relative overflow-hidden">
                  <img src={course.image} alt={course.title} width="400" height="224" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${course.category === 'Kids'
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    : 'bg-white text-slate-800 border-slate-100'
                    }`}>
                    {course.duration}
                  </div>
                </div>

                <div className="p-8 flex-grow flex flex-col">
                  <h3 className={`text-xl font-bold mb-3 transition-colors ${course.category === 'Kids' ? 'text-slate-900 group-hover:text-yellow-600' : 'text-slate-900 group-hover:text-blue-600'}`}>{course.title}</h3>
                  <p className="text-sm text-slate-500 mb-6 flex-grow line-clamp-3 leading-relaxed">{course.description}</p>

                  {/* Modules */}
                  <div className="mb-8 space-y-2">
                    {course.modules?.slice(0, 5).map((mod, i) => (
                      <div key={i} className="flex items-center text-xs font-semibold text-slate-600">
                        <Check size={14} className={`mr-2 ${course.category === 'Kids' ? 'text-yellow-500' : 'text-green-500'}`} /> {mod}
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="mt-4">
                      {course.isFree ? (
                        <span className="text-xl font-bold text-green-600">
                          FREE
                        </span>
                      ) : (
                        <div className="flex items-center gap-3">
                          {/* Show old price with strikethrough if it exists */}
                          {course.oldPrice && course.oldPrice !== course.price && (
                            <span className="text-base text-slate-400 line-through font-medium">
                              {course.oldPrice}
                            </span>
                          )}
                          {/* Current price */}
                          <span className="text-2xl font-bold text-slate-900">
                            {course.price}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* EMI Option Badge */}
                    <div className="mb-4">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                        EMI options starts from ₹2999
                      </span>
                    </div>


                    <div className="flex flex-col gap-3">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInquiryModal({
                              isOpen: true,
                              courseId: course.id,
                              courseTitle: course.title,
                              category: course.category,
                              actionType: 'enroll',
                              onSuccess: () => {
                                alert('Thank you for your interest! We will contact you soon.');
                              }
                            });
                          }}
                          className={`flex flex-1 items-center justify-center py-3 rounded font-bold text-sm shadow-md hover:shadow-lg transition-all ${course.category === 'Kids'
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:to-orange-600'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                          Enquiry now
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Skip modal if user is logged in and has already submitted an inquiry
                            if (user && hasSubmittedInquiry) {
                              navigate(`/course/${course.id}`);
                              return;
                            }

                            setInquiryModal({
                              isOpen: true,
                              courseId: course.id,
                              courseTitle: course.title,
                              category: course.category,
                              actionType: 'modules',
                              onSuccess: () => navigate(`/course/${course.id}`)
                            });
                          }}
                          className={`flex flex-1 items-center justify-center py-3 rounded font-bold text-sm border shadow-sm hover:shadow-md transition-all ${course.category === 'Kids'
                            ? 'border-yellow-200 text-yellow-700 hover:bg-yellow-50'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                          Modules
                        </button>
                      </div>
                      <RazorpayButton
                        amount={Number((course.price || "0").toString().replace(/[^0-9]/g, ''))}
                        courseId={course.id}
                        courseTitle={course.title}
                        courseCategory={course.category}
                        buttonLabel="Enroll Now"
                        studentInfo={{
                          full_name: user?.user_metadata?.full_name || user?.user_metadata?.name,
                          email: user?.email,
                          phone: user?.user_metadata?.phone
                        }}
                        className={`w-full py-3 rounded font-bold text-sm shadow-md hover:shadow-lg transition-all ${course.category === 'Kids'
                          ? 'bg-white border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50'
                          : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                          }`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <InquiryModal
        isOpen={inquiryModal.isOpen}
        onClose={() => setInquiryModal(prev => ({ ...prev, isOpen: false }))}
        courseId={inquiryModal.courseId}
        courseTitle={inquiryModal.courseTitle}
        category={inquiryModal.category}
        actionType={inquiryModal.actionType}
        onSuccess={inquiryModal.onSuccess}
      />
    </div>
  );
};

export default Courses;
