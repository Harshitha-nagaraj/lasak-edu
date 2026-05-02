
import React, { useEffect, useState, useRef, ReactNode, lazy, Suspense } from 'react';
import { useNativeInView } from '../hooks/useNativeInView';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Award, Users, Star, ExternalLink, ChevronLeft, ChevronRight, Play, Megaphone, Sparkles, Bot, X, Calendar, Clock, Check, Code, Settings, Home as HomeIcon, PenTool, Gamepad2, Briefcase, Globe } from 'lucide-react';
import { COURSE_SUMMARIES as COURSES } from '../constants/courseSummaries';
import { TESTIMONIALS as FALLBACK_STORIES } from '../constants/testimonials';
import { BLOG_SUMMARIES as BLOGS } from '../constants/blogSummaries';
import { ACCREDITATIONS, CATEGORIES, COMPANY_LOGOS, PARTNERS, DEMO_VIDEOS as FALLBACK_YT_VIDEOS, HERO_SLIDES_FALLBACK, GOOGLE_REVIEWS_LIST, IMPORTANT_PROGRAM_BLOCKS, STUDENT_VIDEOS } from '../constants/ui';
import { Course } from '../types';
import SEO from '../components/SEO';
import CategoryCard from '../components/CategoryCard';
import { normalizeImagePath } from '../lib/imageUtils';

const StudentTestimonials = lazy(() => import('./studenttestmonials'));
const BlogAutoScroll = lazy(() => import('../components/BlogAutoScroll'));
const HomeExtra = lazy(() => import('../components/HomeExtra').then(m => ({ default: (props: any) => null as any }))); // Placeholder for type, actual lazy load below

// Granular lazy loading of Home sections
const LazyAchieversScroller = lazy(() => import('../components/HomeExtra').then(m => ({ default: m.AchieversScroller })));
const LazyYouTubeScroller = lazy(() => import('../components/HomeExtra').then(m => ({ default: m.YouTubeScroller })));
const LazyStatCounter = lazy(() => import('../components/HomeExtra').then(m => ({ default: m.StatCounter })));
const LazyProgramSegments = lazy(() => import('../components/ProgramSegments'));
const LazyLearningBenefits = lazy(() => import('../components/LearningBenefits'));
const InquiryModal = lazy(() => import('../components/InquiryModal'));
const RazorpayButton = lazy(() => import('../components/RazorpayButton'));

// --- Sub Components ---

const cleanPath = normalizeImagePath;



// =======================
// Student Testimonials Data (Local Videos)




// InfiniteTicker and ScrollReveal moved back or kept if light
export const InfiniteTicker = ({ items, direction = 'left', speed = 'fast' }: { items: string[], direction?: 'left' | 'right', speed?: 'fast' | 'slow' }) => {
  return (
    <div className="relative flex overflow-hidden w-full py-8 group bg-transparent">
      <div className={`flex whitespace-nowrap ${direction === 'left' ? 'animate-scroll' : 'animate-scroll-reverse'} hover:pause space-x-16`}>
        {[...items, ...items, ...items, ...items].map((item, idx) => (
          <span key={idx} className="text-xl md:text-2xl font-bold text-slate-600 uppercase tracking-widest hover:text-blue-600 transition-colors px-4">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const ScrollReveal = React.memo(({ children, delay = 0, active = true }: { children?: ReactNode, delay?: number, active?: boolean }) => {
  const [ref, isInView] = useNativeInView<HTMLDivElement>({ once: true, threshold: 0.1, rootMargin: '-100px' });

  return (
    <div
      ref={ref}
      style={{
        opacity: !active || isInView ? 1 : 0,
        transform: !active || isInView ? 'translateY(0)' : 'translateY(50px)',
        transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
});

const CourseCard: React.FC<{
  course: Course;
  onEnroll: (course: Course) => void;
  onModules: (course: Course) => void;
  user: any;
  priority?: "high" | "low" | "auto";
  index?: number;
}> = ({ course, onEnroll, onModules, user, priority = "auto", index = 0 }) => {
  const [cardRef, isCardInView] = useNativeInView<HTMLDivElement>({ once: true, threshold: 0.1 });
  const navigate = useNavigate();

  // Optimized image loading for above-the-fold content
  const isEager = index < 3;

  return (
    <div
      ref={cardRef}
      onClick={() => navigate("/courses")}
      style={{
        opacity: priority === "high" || isCardInView ? 1 : 0,
        transform: priority === "high" || isCardInView ? 'scale(1)' : 'scale(0.95)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
      }}
      className="bg-white rounded-2xl overflow-hidden group border border-slate-200
                 shadow-lg hover:shadow-2xl
                 h-full flex flex-col cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          loading={isEager ? "eager" : "lazy"}
          fetchPriority={isEager ? "high" : "low"}
          width="400"
          height="224"
          sizes="(max-width: 768px) 100vw, 400px"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          decoding="async"
        />
        <div className="absolute top-4 right-4 bg-white/95 px-3 py-1 rounded-full text-xs font-bold">
          {course.category}
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>

        <p className="text-slate-500 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Modules Preview */}
        <div className="mb-6 space-y-2 flex-grow">
          {course.modules?.slice(0, 3).map((mod, i) => (
            <div key={i} className="flex items-center text-xs font-semibold text-slate-600">
              <Check size={14} className="mr-2 text-green-500" /> {mod}
            </div>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            {course.oldPrice && (
              <span className="text-gray-700 line-through text-sm font-medium">
                {course.oldPrice}
              </span>
            )}
            <span className={`text-2xl font-bold ${course.isFree ? "text-green-600" : "text-slate-900"}`}>
              {course.price}
            </span>
            {course.oldPrice && (
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Offer
              </span>
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
                onClick={(e) => {
                  e.stopPropagation();
                  onEnroll(course);
                }}
                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 text-sm"
              >
                Enquiry now
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onModules(course);
                }}
                className="flex-1 bg-white text-slate-700 font-bold py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95 text-sm"
              >
                Modules
              </button>
            </div>
            <Suspense fallback={<div className="h-12 w-full bg-slate-100 animate-pulse rounded-xl"></div>}>
              <RazorpayButton
                amount={Number((course.price || "0").toString().replace(/[^0-9]/g, ''))}
                courseId={course.id}
                courseTitle={course.title}
                courseCategory={course.category}
                studentInfo={{
                  full_name: user?.user_metadata?.full_name || user?.user_metadata?.name,
                  email: user?.email,
                  phone: user?.user_metadata?.phone
                }}
                className="w-full py-3 rounded-xl font-bold text-sm bg-white border-2 border-blue-600 text-blue-700 hover:bg-blue-50 transition-all shadow-md active:scale-95"
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Slider Data (will be fetched from Firestore) ---

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [showPromoPopup, setShowPromoPopup] = useState(false);
  const navigate = useNavigate();
  const [inquiryModal, setInquiryModal] = useState({
    isOpen: false,
    courseId: '',
    courseTitle: '',
    category: '',
    actionType: 'enroll' as 'enroll' | 'modules',
    onSuccess: undefined as (() => void) | undefined
  });
  const [user, setUser] = useState<any>(null);
  const [hasSubmittedInquiry, setHasSubmittedInquiry] = useState(false);
  const [currentPromoSlide, setCurrentPromoSlide] = useState(0);
  const [popupEnabled, setPopupEnabled] = useState(false);
  const [promoSlides, setPromoSlides] = useState<any[]>([]);
  const [promoInterval, setPromoInterval] = useState(4000);
  const [formUrl, setFormUrl] = useState('');
  const [popupTitle, setPopupTitle] = useState('Transform Your Career');
  const [popupDesc, setPopupDesc] = useState('Join our industry-approved Diploma courses in IT, Mechanical, and Civil Engineering. Get 100% Placement Support.');
  const [popupFeatures, setPopupFeatures] = useState(['Free Demo Classes', 'Internship Included', 'Scholarship Available']);
  const [popupButtonText, setPopupButtonText] = useState('Apply Now');
  const [accreditations, setAccreditations] = useState<any[]>(ACCREDITATIONS);
  const [categories, setCategories] = useState<any[]>(CATEGORIES);
  const [programSegments, setProgramSegments] = useState<any[]>([]);
  const [learningEcosystem, setLearningEcosystem] = useState<any[]>([]);



  const CATEGORY_ICONS: Record<string, any> = {
    'IT': <Code className="w-8 h-8 text-cyan-400" />,
    'Mechanical': <Settings className="w-8 h-8 text-purple-400" />,
    'Civil': <HomeIcon className="w-8 h-8 text-green-400" />,
    'Arts': <PenTool className="w-8 h-8 text-pink-400" />,
    'Kids': <Gamepad2 className="w-8 h-8 text-yellow-400" />,
  };

  // Firestore State
  const [partners, setPartners] = useState<{ id: string, name: string, logo: string }[]>(
    PARTNERS.map((p, i) => ({ id: `fallback-${i}`, name: p.alt, logo: p.src }))
  );
  const [testimonials, setTestimonials] = useState<{ id: string, name: string, role: string, content: string, image: string, rating: number }[]>(
    GOOGLE_REVIEWS_LIST.map((r, i) => ({
      id: `fallback-${i}`,
      name: r.name,
      role: r.verified ? 'Verified Student' : 'Student',
      content: r.text,
      image: r.image,
      rating: r.rating
    }))
  );
  const [heroSlides, setHeroSlides] = useState<{ id: string, image: string, title: string, subtitle: string, cta_text: string, cta_link: string }[]>(
    [
      {
        id: 'lcp-fallback',
        image: '/img/websitebanner1.webp',
        title: 'Master Practical Skills',
        subtitle: 'Hands-on training with 100% Placement Support',
        cta_text: 'Start Learning',
        cta_link: '/courses'
      },
      ...HERO_SLIDES_FALLBACK.slice(1).map((slide, index) => ({
        id: `fallback-${index + 1}`,
        image: slide.image,
        title: slide.title,
        subtitle: slide.subtitle,
        cta_text: slide.cta,
        cta_link: slide.link
      }))
    ]
  );
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>(FALLBACK_YT_VIDEOS.map(v => ({ video_id: v.id, thumbnail: v.thumbnail })));
  const [videoTestimonials, setVideoTestimonials] = useState<any[]>([]);
  // Performance: Initialize with LCP-critical courses to avoid layout shift and resource delay
  const getInitialCourses = () => {
    const lcpCourse = COURSES.find(c => c.id === 'it4');
    const others = COURSES.filter(c => c.id !== 'it4').slice(0, 2);
    return lcpCourse ? [lcpCourse, ...others] : COURSES.slice(0, 3);
  };

  const [courses, setCourses] = useState<Course[]>(getInitialCourses());

  useEffect(() => {
    fetchData(); 
    getPopupData(); 
  }, []);

  const fetchData = async () => {
    try {
      const { fetchHomeData } = await import('../lib/homeData');
      const { 
        partnersRaw, 
        testimonialsRaw, 
        heroRaw, 
        ytRaw, 
        vtRaw, 
        coursesRaw, 
        accreditationsRaw, 
        categoriesRaw,
        programSegmentsRaw,
        learningEcosystemRaw
      } = await fetchHomeData();

      // Process Partners
      if (partnersRaw && partnersRaw.length > 0) {
        const allPartnersData = partnersRaw
          .map((data: any) => {
            return {
              id: data.id,
              name: data.name || 'Partner',
              logo: cleanPath(data.logo || ''),
              type: data.type || 'training',
              created_at: data.created_at || 0
            };
          });

        const trainingPartners = allPartnersData
          .filter((p: any) => p.type === 'training')
          .sort((a: any, b: any) => (b.created_at || 0) - (a.created_at || 0));

        setPartners(trainingPartners);
      }

      // Process Testimonials
      if (testimonialsRaw && testimonialsRaw.length > 0) {
        const testimonialsData = testimonialsRaw
          .map((data: any) => {
            return {
              id: data.id,
              name: data.name || '',
              role: data.role || 'Student',
              content: data.quote || data.content || data.text || '',
              company: data.company || '',
              package: data.package || '',
              image: data.image || '',
              rating: data.rating || 5,
              created_at: data.created_at || 0
            };
          })
          .sort((a: any, b: any) => (b.created_at || 0) - (a.created_at || 0));
        setTestimonials(testimonialsData);
      } else {
        setTestimonials(FALLBACK_STORIES.map(s => ({
          id: s.id,
          name: s.name,
          role: s.role,
          content: s.quote,
          company: s.company,
          package: s.package,
          image: s.image,
          rating: s.rating || 5,
          created_at: 0
        })));
      }

      // Process Accreditations
      if (accreditationsRaw && accreditationsRaw.length > 0) {
        setAccreditations(accreditationsRaw);
      }

      // Process Categories
      if (categoriesRaw && categoriesRaw.length > 0) {
        const mergedCategories = CATEGORIES.map(defaultCat => {
          const fromFirestore = categoriesRaw.find((c: any) => c.id === defaultCat.id);
          return fromFirestore ? { ...defaultCat, ...fromFirestore } : defaultCat;
        });

        // Add any extra categories from Firestore that aren't in defaults
        const extraCategories = categoriesRaw.filter((c: any) => !CATEGORIES.some(d => d.id === c.id));

        setCategories([...mergedCategories, ...extraCategories]);
      }

      // Process Hero Slides
      if (heroRaw && heroRaw.length > 0) {
        const heroData = heroRaw
          .sort((a: any, b: any) => (a.order_num || 0) - (b.order_num || 0));
        setHeroSlides(heroData);
      }

      // Process Youtube Videos
      if (ytRaw && ytRaw.length > 0) {
        const ytData = ytRaw
          .map((v: any) => ({
            id: v.id,
            video_id: v.video_id,
            order_num: v.order_num || 0,
            thumbnail: `https://img.youtube.com/vi/${v.video_id}/mqdefault.jpg`
          }))
          .sort((a: any, b: any) => a.order_num - b.order_num);
        setYoutubeVideos(ytData);
      }

      // Process Video Testimonials
      if (vtRaw && vtRaw.length > 0) {
        const vtData = vtRaw
          .sort((a: any, b: any) => (a.order_num || 0) - (b.order_num || 0));
        setVideoTestimonials(vtData);
      }

      // Process Courses
      if (coursesRaw && coursesRaw.length > 0) {
        const fetchedCourses = coursesRaw.map((c: any) => {
          return {
            id: c.id,
            ...c,
            image: c.image,
            oldPrice: c.old_price || c.oldPrice,
            isFree: c.is_free || c.isFree
          };
        });

        const mergedCourses = fetchedCourses.map((fetched: any) => {
          const staticCourse = COURSES.find(c => c.id === fetched.id || c.title === fetched.title);
          if (!staticCourse) {
            return {
              ...fetched,
              image: cleanPath(fetched.image)
            } as Course;
          }

          return {
            ...staticCourse,
            ...fetched,
            image: cleanPath(fetched.image || staticCourse.image),
            description: fetched.description || staticCourse.description,
            price: fetched.price || staticCourse.price,
            oldPrice: fetched.oldPrice || staticCourse.oldPrice,
            duration: fetched.duration || staticCourse.duration,
          } as Course;
        }).sort((a: any, b: any) => (b.created_at || 0) - (a.created_at || 0)).slice(0, 3);

        setCourses(mergedCourses);
      }

      // Process Program Segments
      if (programSegmentsRaw && programSegmentsRaw.length > 0) {
        setProgramSegments(programSegmentsRaw);
      }

      // Process Learning Ecosystem
      if (learningEcosystemRaw) {
        const ecosystemOrder = [
          "Lasak LMS Portal",
          "Coursera Access",
          "Industry Exposure Sessions",
          "Placement & Career Support",
          "Communication & Aptitude",
          "Real-world Projects"
        ];

        const processedEcosystem = [...learningEcosystemRaw]
          .map((item: any) => {
            if (item.title === "Industry Exposure Sessions") return { ...item, size: 'large' };
            if (item.title === "Placement & Career Support") return { ...item, size: 'large' };
            if (item.title === "Communication & Aptitude") return { ...item, size: 'large' };
            return { ...item, size: 'small' };
          })
          .sort((a, b) => {
            const indexA = ecosystemOrder.indexOf(a.title);
            const indexB = ecosystemOrder.indexOf(b.title);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            return (a.order_num || 0) - (b.order_num || 0);
          });

        setLearningEcosystem(processedEcosystem);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000); // 6 seconds per slide
    return () => clearInterval(timer);
  }, [heroSlides.length]);



  const getPopupData = async () => {
    try {
      const { fetchHomePopupData } = await import('../lib/homeData');
      const data = await fetchHomePopupData();
      if (data) {
        const { configData, slidesData } = data;
        setPopupEnabled(configData.enabled);
        setPromoInterval(configData.interval);
        setFormUrl(configData.form_url);
        if (configData.title) setPopupTitle(configData.title);
        if (configData.description) setPopupDesc(configData.description);
        if (configData.button_text) setPopupButtonText(configData.button_text);

        const features = [];
        if (configData.feature_1) features.push(configData.feature_1);
        if (configData.feature_2) features.push(configData.feature_2);
        if (configData.feature_3) features.push(configData.feature_3);
        if (features.length > 0) setPopupFeatures(features);

        if (configData.enabled && slidesData.length > 0) {
          const mappedSlides = slidesData.map((s: any) => ({
            id: s.id,
            image: cleanPath(s.image_url || s.image),
            clickable: s.clickable,
            style: s.style || 'standard',
            title: s.title,
            description: s.description,
            button_text: s.button_text,
            order_num: s.order_num || 0,
            features: [s.feature_1, s.feature_2, s.feature_3].filter(Boolean)
          })).sort((a: any, b: any) => a.order_num - b.order_num);

          setPromoSlides(mappedSlides);
          setTimeout(() => setShowPromoPopup(true), 3000);
        }
      }
    } catch (error) {
      console.error('Error fetching popup data:', error);
    }
  };


  // Promo Popup Auto Scroll
  useEffect(() => {
    if (!showPromoPopup || promoSlides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentPromoSlide(prev => (prev + 1) % promoSlides.length);
    }, promoInterval);

    return () => clearInterval(timer);
  }, [showPromoPopup, promoSlides, promoInterval]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  // Corrected navigation logic to allow full cycle
  const nextReview = () => setReviewIndex((prev) => (prev + 1) % GOOGLE_REVIEWS_LIST.length);
  const prevReview = () => setReviewIndex((prev) => (prev - 1 + GOOGLE_REVIEWS_LIST.length) % GOOGLE_REVIEWS_LIST.length);

  const STUDENT_VIDEOS = [
    { id: 'LXb3EKWsInQ', title: 'Student Success Story - IT' },
    { id: 'ysz5S6PUM-U', title: 'Placement Review - Mechanical' },
    { id: 'bMknfKXIFA8', title: 'React Course Review' },
    { id: '9No-FiEInLA', title: 'Civil CAD Training Experience' },
    { id: 'hF5z6tK5', title: 'Internship Experience' },
    { id: 'jK9s8dL2', title: 'Career Guidance Session' },
  ];




  return (
    <div className="min-h-screen bg-transparent relative font-sans selection:bg-amber-400 selection:text-slate-900">
      {/* Visually hidden H1 for SEO */}
      <h1 className="sr-only">LASAK EDU – Best Training Institute in Coimbatore for IT, Mechanical & Civil Courses</h1>

      {/* --- SEO TAGS --- */}
      <SEO
        title="LASAK EDU – Leading Training Institute in Coimbatore | IT, Mechanical & Civil Courses"
        description="LASAK EDU is the best training institute in Coimbatore offering industry-standard IT, Mechanical and Civil courses with 100% placement support. Enroll today!"
        keywords="LASAK EDU, lasakedu, lasak edu, LASAK Institute, training institute in Coimbatore, software training Coimbatore, mechanical engineering courses Coimbatore, civil engineering training Coimbatore, placement training Coimbatore, best IT institute Coimbatore"
        url="https://lasakedu.in"
      />

      {/* --- PROMO POPUP POSTER --- */}
      
        {showPromoPopup && popupEnabled && promoSlides.length > 0 && (
          <div
            className="
        fixed inset-0 z-[9999]
        flex justify-center items-center
        px-4 py-10
      "
          >
            {/* Background Overlay */}
            <div
              onClick={() => setShowPromoPopup(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* ✅ CLOSE BUTTON – FIXED TO SCREEN */}
            <button
              onClick={() => setShowPromoPopup(false)}
              aria-label="Close popup"
              className="
          fixed
          top-4 md:top-[100px]
          right-4
          w-10 h-10 md:w-11 md:h-11
          bg-red-600 text-white
          rounded-full
          flex items-center justify-center
          text-lg md:text-xl font-bold
          z-[10001]
          shadow-xl
          active:scale-90
        "
            >
              ✕
            </button>

            {/* Popup Content Container */}
            <div
              className={`
                relative
                bg-white
                rounded-2xl
                shadow-2xl
                overflow-y-auto
                max-h-[85vh]
                ${promoSlides[currentPromoSlide]?.style === 'image_only' ? 'max-w-md bg-transparent shadow-none' : 'max-w-4xl flex flex-col md:flex-row'}
                w-full
                mx-2
              `}
            >
              {/* LEFT IMAGE (Full width if image_only) */}
              <div className={`
                   ${promoSlides[currentPromoSlide]?.style === 'image_only' ? 'w-full h-auto rounded-2xl overflow-hidden' : 'w-full md:w-1/2 bg-blue-600 overflow-hidden'}
                `}>
                
                  {promoSlides[currentPromoSlide]?.clickable ? (
                    // First 2 images with link
                    <a href={formUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowPromoPopup(false)}
                      className="block w-full h-full relative group"
                    >
                      <img
                        key={currentPromoSlide}
                        src={promoSlides[currentPromoSlide]?.image}
                        alt="Special Offer"
                        className="w-full h-full object-contain cursor-pointer"
                      />
                    </a>
                  ) : (
                    // Last 2 images without link
                    <div className="relative w-full h-full">
                      <img
                        key={currentPromoSlide}
                        src={promoSlides[currentPromoSlide]?.image}
                        alt="Special Offer"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                
              </div>


              {/* RIGHT CONTENT (Only for standard style) */}
              {promoSlides[currentPromoSlide]?.style !== 'image_only' && (
                <div className="w-full md:w-1/2 p-6 md:p-10">
                  <h3 className="text-2xl font-bold mb-2">
                    {promoSlides[currentPromoSlide]?.title || popupTitle}
                  </h3>

                  <p className="text-slate-600 mb-6">
                    {promoSlides[currentPromoSlide]?.description || popupDesc}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {/* Use slide features if available (and > 0), else global features */}
                    {(promoSlides[currentPromoSlide]?.features && promoSlides[currentPromoSlide]?.features.length > 0
                      ? promoSlides[currentPromoSlide]?.features
                      : popupFeatures
                    ).map((feature: any, idx: number) => (
                      <li key={idx} className="flex items-center gap-3">
                        <CheckCircle className="text-green-500" size={18} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowPromoPopup(false)}
                    className="inline-flex w-full items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 text-base"
                  >
                    {promoSlides[currentPromoSlide]?.button_text || popupButtonText || "Get Offer"} <ArrowRight size={18} />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      

      {/* 1. Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden group bg-white">

        {/* Slider Background */}
        <>
          <div
            key={currentSlide}
            className="absolute inset-0 z-0"
          >
            <img
              src={cleanPath(heroSlides[currentSlide]?.image || '/img/websitebanner1.webp')}
              alt={heroSlides[currentSlide]?.title}
              width="1920"
              height="1080"
              sizes="(max-width: 768px) 100vw, 1920px"
              className="w-full h-full object-cover brightness-125"
              loading={currentSlide === 0 ? "eager" : "lazy"}
              decoding={currentSlide === 0 ? "sync" : "async"}
              fetchPriority={currentSlide === 0 ? "high" : "low"}
            />

            {/* Dark overlay without blur – image stays sharp */}

            <div className="absolute inset-0 bg-black/70"></div>
          </div>
        </>

        {/* Animated Blobs */}
        < div className="absolute inset-0 overflow-hidden pointer-events-none z-0" >
          <div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]"
          />
        </div >

        {/* ❌ Arrows Removed Completely */}

        {/* Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-blue-600 w-8' : 'bg-white/50 hover:bg-white'}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div
            key={currentSlide}
          >
            <h1 className="text-3xl xs:text-5xl md:text-7xl lg:text-8xl font-tech font-black mb-4 md:mb-6 tracking-tighter leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]">
              <span
                key={heroSlides[currentSlide]?.title}
                className="block"
              >
                {heroSlides[currentSlide]?.title.split(" ").map((word, i) => (
                  <span
                    key={i}
                    className={i === 1 ? "text-blue-400" : "text-white"}
                  >
                    {word}{" "}
                  </span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-2xl lg:text-3xl text-white/90 drop-shadow-[0_3px_12px_rgba(0,0,0,0.7)] font-sans font-medium tracking-wide max-w-4xl mx-auto mb-8 md:mb-12 leading-relaxed min-h-[3em] flex items-center justify-center px-4">
              {heroSlides[currentSlide]?.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div
              >
                <Link
                  to={heroSlides[currentSlide]?.cta_link}
                  className="px-8 py-4 bg-blue-600 rounded shadow-xl font-bold text-lg hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-white group h-full"
                >
                  {heroSlides[currentSlide]?.cta_text}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div
              >
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-white border border-slate-200 rounded font-bold text-lg text-slate-700 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 shadow-md transition-all hover:-translate-y-1 h-full flex items-center justify-center"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section >


      {/* 2. Accreditation Logos (Fixed) */}
      < section className="bg-white py-12 border-b border-slate-100" >
        <ScrollReveal>
          <h2 className="text-center text-xl font-bold text-slate-600 uppercase tracking-widest mb-8">
            We are accredited by
          </h2>
          <div className="flex items-center justify-center gap-6 md:gap-12 flex-wrap px-4">
            {accreditations.map((logo) => (
              <div
                key={logo.id || logo.src}
                className="bg-white p-3 md:p-4 rounded-xl shadow-md border border-slate-200 flex items-center justify-center w-24 h-16 md:w-32 md:h-24 overflow-hidden"
              >
                <img
                  src={cleanPath(logo.src)}
                  alt={logo.alt}
                  width="80"
                  height="80"
                  loading="lazy"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/100x100?text=${logo.alt}`;
                  }}
                />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section >

      {/* 3. Authorized Training Partner (Fixed Layout) */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 border-b border-slate-100">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-12 px-4">

            {/* LEFT TEXT */}
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
                Authorized Training Partners
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                We collaborate with leading industry partners to deliver industry-ready
                training and globally recognized certifications.
              </p>
            </div>

            {/* RIGHT IMAGES */}
            <div className="flex-1 flex flex-wrap gap-8 justify-center md:justify-start md:pl-12">
              {partners.slice(0, 2).map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200
                       hover:shadow-xl transition-all duration-300 hover:-translate-y-1
                       w-48 h-32 flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={cleanPath(partner.logo || '')}
                    alt={partner.name}
                    width="192"
                    height="128"
                    loading="lazy"
                    className="max-w-full max-h-full object-contain opacity-90 hover:opacity-100 transition"
                    title={partner.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/200x120?text=Partner';
                    }}
                  />
                </div>
              ))}
            </div>

          </div>
        </ScrollReveal>
      </section>




      {/* 4. Internship + Vendor (White) */}
      < section className="py-24 px-4 bg-white relative overflow-hidden" >
        <ScrollReveal>
          <div
            className="max-w-6xl mx-auto bg-slate-50 rounded-3xl p-10 md:p-16 relative z-10 border border-slate-200 shadow-2xl transition-all flex flex-col md:flex-row items-center gap-10 h-auto md:h-[700px] overflow-hidden"
          >
            {/* Left Content */}
            <div className="flex-1 flex flex-col justify-center h-full">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Internship Opportunity</h2>
              <h3 className="text-xl font-medium mb-6 text-slate-600">
                Official Vendor of <span className="text-blue-600 font-bold">LASAK Technologies Pvt Ltd</span>
              </h3>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Gain real-world experience through our exclusive internship programs. Work on live projects and get industry-ready before you graduate.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://lasak.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1 transition-all"
                >
                  Visit LASAK Technologies <ExternalLink size={20} />
                </a>

                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLScL1mo2i4LF9aineii9xi9V-CVntO8xSbk1Qi_5oU_5mpOnvg/viewform?usp=pp_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-1 transition-all"
                >
                  Enquiry for Internship <ExternalLink size={20} />
                </a>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1 w-full flex justify-center h-full">
              <div className="relative w-full max-w-[500px] h-full">
                {/* Animated Background Circles */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-60 animate-pulse"></div>
                {/* Center Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src="/cert.jpg"
                    alt="certificate"
                    width="450"
                    height="350"
                    loading="lazy"
                    className="max-w-[90%] max-h-[90%] object-contain rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section >



      {/* 5. Statistics (Gradient Blue) */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <Suspense fallback={<div className="h-20 animate-pulse bg-slate-100 rounded-xl" />}>
              <LazyStatCounter end={1500} label="Students" />
              <LazyStatCounter end={100} label="Placement %" />
              <LazyStatCounter end={50} label="College Tie-ups" />
              <LazyStatCounter end={30} label="Courses" />
              <LazyStatCounter end={12} label="Highest Package" />
              <LazyStatCounter end={5} label="Years Exp." />
            </Suspense>
          </div>
        </div>
      </section>

      {/* 6. Categories (White) */}
      <section className="pt-10 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black text-center mb-16">
            Explore Course Categories
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {categories.map(cat => (
              <CategoryCard
                key={cat.id}
                title={cat.name}
                icon={CATEGORY_ICONS[cat.id] || cat.icon?.() || <Code />}
                path={`/courses/${cat.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6.3 Important Program Segments - Pure Tailwind Sticky Stack */}
      <Suspense fallback={<div className="h-96 animate-pulse bg-slate-100 rounded-3xl mx-4 my-20" />}>
        <LazyProgramSegments segments={programSegments} />
      </Suspense>

      {/* 7. Latest Courses (White) */}
      <section className="pb-20 pt-10 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal active={false}>
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Latest Courses</h2>
                <p className="text-slate-500">Upgrade your skills with our industry-standard curriculum.</p>
              </div>
              <Link to="/Courses" className="text-blue-600 hover:text-blue-800 font-bold hidden sm:block hover:translate-x-1 transition-transform">View All Courses &rarr;</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, i) =>
                <CourseCard
                  key={course.id}
                  course={course}
                  user={user}
                  priority={i < 3 ? "high" : "low"}
                  index={i}
                  onEnroll={(c) => setInquiryModal({
                    isOpen: true,
                    courseId: c.id,
                    courseTitle: c.title,
                    category: c.category,
                    actionType: 'enroll',
                    onSuccess: () => {
                      alert('Thank you for your interest! We will contact you soon.');
                    }
                  })}
                  onModules={(course) => {
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
                />
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 8. Achievers – Auto Scrolling Row */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-black text-slate-900 text-center mb-16">
              Our Achievers
            </h2>

            <Suspense fallback={<div className="h-64 flex items-center justify-center text-slate-600">Loading achievers...</div>}>
              <LazyAchieversScroller testimonials={testimonials} cleanPath={cleanPath} />
            </Suspense>
          </ScrollReveal>
        </div>
      </section>


      {/* 9. Student Voices (Autoplay Local Videos + Infinite Scroll) */}
      <Suspense fallback={<div className="py-20 text-center text-slate-600">Loading testimonials...</div>}>
        <StudentTestimonials videos={videoTestimonials} />
      </Suspense>

      {/* 10. Demo Courses Ticker */}
      <section className="py-20 relative bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10 mb-10 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-bold mb-2 font-tech text-white">
              Subscribe to Our YouTube Channel
            </h2>
            <p className="text-white/80">
              Watch free course previews, tutorials, placement stories and more..
            </p>
          </ScrollReveal>
        </div>

        <Suspense fallback={<div className="h-48 flex items-center justify-center text-white/50">Loading videos...</div>}>
          <LazyYouTubeScroller youtubeVideos={youtubeVideos} />
        </Suspense>
      </section>


      {/* 10.5 Learning Benefits Grid (from lasakedu.com) */}
      <Suspense fallback={<div className="h-96 animate-pulse bg-slate-100 rounded-3xl mx-4 my-24" />}>
        <LazyLearningBenefits benefitsData={learningEcosystem} />
      </Suspense>

      {/* 11. Testimonials (White) */}
      <section className="py-24 bg-white text-slate-900 border-b border-slate-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-16 text-slate-900">Google Reviews</h2>

          <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-8 xl:gap-10">

            {/* LEFT: Fixed Summary Card */}
            <div className="w-full xl:w-1/4">
              <div className="bg-white shadow-xl rounded-3xl p-10 border border-slate-100 relative h-full flex flex-col items-center justify-center text-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-3xl"></div>

                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-md overflow-hidden mb-6 p-2">
                  <img src={cleanPath("/img/favicon.png")} className="w-[80%] h-[80%] object-contain" alt="Lasak Edu" />
                </div>

                <h3 className="text-xl font-bold text-slate-900">LASAK EDU</h3>
                <p className="text-slate-500 text-sm mb-4">Authorized Training Center<br />Coimbatore</p>

                <div className="flex justify-center text-yellow-400 text-xl mb-3">
                  {[1, 2, 3, 4, 5].map((i) => <span key={i}>★</span>)}
                </div>

                <p className="text-slate-600 font-semibold mb-6">307 Google reviews</p>

                <a href="https://g.page/r/CduapsFWMkahEAE/review" target="_blank" rel="noopener noreferrer" className="px-6 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition font-medium w-full">
                  Write a review
                </a>
              </div>
            </div>

            {/* RIGHT: Sliding Review Cards */}
            <div className="w-full xl:w-3/4 relative flex flex-col justify-center">

              {/* Review Carousel Container */}
              <div className="overflow-hidden px-2 py-4">
                
                  <div
                    key={reviewIndex} // Key change triggers animation
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {/* Display 2 items at a time */}
                    {[0, 1].map((offset) => {
                      if (testimonials.length === 0) return null;
                      const index = (reviewIndex + offset) % testimonials.length;
                      const review = testimonials[index];

                      return (
                        <div key={index} className="bg-white border border-slate-100 shadow-lg rounded-3xl p-8 relative hover:shadow-xl transition-shadow flex flex-col h-full">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg border border-slate-100 uppercase">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-800 text-sm md:text-base">{review.name}</h3>
                              <div className="flex text-yellow-400 text-xs md:text-sm">
                                {[...Array(review.rating)].map((_, i) => <span key={i}>★</span>)}
                              </div>
                            </div>
                          </div>

                          <div className="flex-grow">
                            <p className="text-slate-600 text-sm leading-relaxed line-clamp-4 italic">
                              "{review.content}"
                            </p>
                          </div>

                          <div className="mt-4 pt-4 border-t border-slate-50">
                            <span className="text-xs font-bold text-blue-600 cursor-pointer hover:underline">READ FULL REVIEW</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                
              </div>

              {/* Navigation Arrows (Floating on Sides) */}
              <button
                type="button"
                aria-label="Previous review"
                onClick={prevReview}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-6 
             z-20 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                type="button"
                aria-label="Next review"
                onClick={nextReview}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-6 
             z-20 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
              >
                <ChevronRight size={24} />
              </button>


            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="py-16 text-center text-slate-600">Loading blogs...</div>}>
        <BlogAutoScroll />
      </Suspense>

      <Suspense fallback={null}>
        <InquiryModal
          isOpen={inquiryModal.isOpen}
          onClose={() => setInquiryModal(prev => ({ ...prev, isOpen: false }))}
          courseId={inquiryModal.courseId}
          courseTitle={inquiryModal.courseTitle}
          category={inquiryModal.category}
          actionType={inquiryModal.actionType}
          onSuccess={inquiryModal.onSuccess}
        />
      </Suspense>
    </div >
  );
};

export default Home;
