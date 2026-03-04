
import React, { useEffect, useState, useRef, ReactNode } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Award, Users, Star, ExternalLink, ChevronLeft, ChevronRight, Play, Megaphone, Sparkles, Bot, X, Calendar, Clock, Check, Code, Settings, Home as HomeIcon, PenTool, Gamepad2 } from 'lucide-react';
import { ACCREDITATIONS, CATEGORIES, COURSES, COMPANY_LOGOS, PARTNERS, TESTIMONIALS as FALLBACK_STORIES, DEMO_VIDEOS as FALLBACK_YT_VIDEOS } from '../constants';
import { Course } from '../types';
import SEO from '../components/SEO';
import StudentTestimonials from './studenttestmonials';
import { BLOGS } from '../constants';
import { User } from 'lucide-react';
import CategoryCard from '../components/CategoryCard';
import BlogAutoScroll from "../components/BlogAutoScroll";
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import InquiryModal from '../components/InquiryModal';
import RazorpayButton from '../components/RazorpayButton';
import { normalizeImagePath } from '../lib/imageUtils';

// --- Sub Components ---

export const InfiniteTicker = ({ items, direction = 'left', speed = 'fast' }: { items: string[], direction?: 'left' | 'right', speed?: 'fast' | 'slow' }) => {
  return (
    <div className="relative flex overflow-hidden w-full py-8 group bg-transparent">
      <div className={`flex whitespace-nowrap ${direction === 'left' ? 'animate-scroll' : 'animate-scroll-reverse'} hover:pause space-x-16`}>
        {[...items, ...items, ...items, ...items].map((item, idx) => (
          <span key={idx} className="text-xl md:text-2xl font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors px-4">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const ScrollReveal = ({ children, delay = 0 }: { children?: ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// Video Card for Demo Section
const VideoCard: React.FC<{ videoId: string; title?: string; thumbnail: string }> = ({
  videoId,
  title = "Watch on YouTube",
  thumbnail,
}) => {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.98 }}
        className="w-[140px] xs:w-[180px] md:w-[400px] flex-shrink-0 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-lg group transition-all duration-300"
      >
        {/* Thumbnail */}
        <div className="aspect-video bg-black relative">
          <img
            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
            alt="YouTube Video"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="w-full h-full object-cover"
          />


          {/* Play Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition">
              <Play fill="white" className="text-white ml-1" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 text-center">
          <p className="text-blue-600 font-bold text-sm flex items-center justify-center gap-1">
            Watch on YouTube <ExternalLink size={14} />
          </p>
        </div>
      </motion.div>
    </a>
  );
};
const cleanPath = normalizeImagePath;

// YouTube Scroller Component
const YouTubeScroller = React.memo(({ youtubeVideos }: { youtubeVideos: any[] }) => {
  return (
    <div className="relative w-full">
      <div
        className="youtube-scroller pb-4 px-4 md:px-0"
        onMouseDown={(e) => e.currentTarget.classList.add('paused')}
        onMouseUp={(e) => e.currentTarget.classList.remove('paused')}
        onTouchStart={(e) => e.currentTarget.classList.add('paused')}
        onTouchEnd={(e) => e.currentTarget.classList.remove('paused')}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          overflowX: youtubeVideos.length >= 3 ? 'auto' : 'hidden'
        }}
      >
        <div
          className={`flex w-max ${youtubeVideos.length >= 3 ? 'animate-scroll-loop' : 'justify-center'}`}
          style={{ '--duration': `${youtubeVideos.length * 3}s` } as React.CSSProperties}
        >
          {(youtubeVideos.length >= 3
            ? [...youtubeVideos, ...youtubeVideos]
            : youtubeVideos
          ).map((video, idx) => (
            <div key={`${video.id || video.video_id}-${idx}`} className="mr-4 md:mr-8 flex-shrink-0">
              <VideoCard
                videoId={video.video_id}
                thumbnail={video.thumbnail}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// Achievers Scroller Component
const AchieversScroller = React.memo(({ testimonials }: { testimonials: any[] }) => {
  return (
    <div className="relative w-full">
      <div
        className="achievers-scroller pb-4 px-4 md:px-0"
        onMouseDown={(e) => e.currentTarget.classList.add('paused')}
        onMouseUp={(e) => e.currentTarget.classList.remove('paused')}
        onTouchStart={(e) => e.currentTarget.classList.add('paused')}
        onTouchEnd={(e) => e.currentTarget.classList.remove('paused')}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          overflowX: testimonials.length >= 3 ? 'auto' : 'hidden'
        }}
      >
        <div
          className={`flex w-max ${testimonials.length >= 3 ? 'animate-scroll-loop' : 'justify-center'}`}
          style={{ '--duration': `${testimonials.length * 4}s` } as React.CSSProperties}
        >
          {(testimonials.length >= 3
            ? [...testimonials, ...testimonials]
            : testimonials
          ).map((story, i) => (
            <div
              key={`${story.id}-${i}`}
              className="w-[220px] xs:w-[300px] bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex-shrink-0 mr-4 md:mr-8"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full border-2 border-white shadow-md overflow-hidden bg-blue-50 flex items-center justify-center shrink-0">
                  {story.image ? (
                    <img
                      src={cleanPath(story.image)}
                      alt={story.name}
                      width="64"
                      height="64"
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(story.name)}&background=random`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-xl">{story.name.charAt(0)}</div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900">{story.name}</h4>
                  <p className="text-sm text-blue-600 font-semibold">
                    {story.role}
                  </p>
                  <div className="flex text-yellow-400 text-xs mt-1">
                    {[...Array(story.rating || 5)].map((_, i) => <span key={i}>★</span>)}
                  </div>
                </div>
              </div>
              {story.company && (
                <p className="text-xs text-slate-500 font-semibold mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
                  {story.company}
                  {story.package && <span className="ml-2 text-green-600 font-bold">{story.package}</span>}
                </p>
              )}
              <p className="text-slate-600 italic leading-relaxed line-clamp-4">
                &ldquo;{story.content || story.quote || ''}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});



// =======================
// Student Testimonials Data (Local Videos)




const StatCounter = ({ end, label }: { end: number, label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -5 }}
      className="text-center p-6 glass-card rounded-2xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
        <Sparkles className="text-blue-500" />
      </div>
      <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 mb-2 font-tech">
        {count}+
      </h3>
      <p className="text-slate-500 font-bold uppercase tracking-wider text-xs md:text-sm">{label}</p>
    </motion.div>
  );
};

const CourseCard: React.FC<{
  course: Course;
  onEnroll: (course: Course) => void;
  onModules: (course: Course) => void;
  user: any;
}> = ({ course, onEnroll, onModules, user }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => navigate("/courses")}
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl overflow-hidden group border border-slate-200
                 shadow-lg hover:shadow-2xl transition-all duration-300
                 h-full flex flex-col cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
              <span className="text-slate-400 line-through text-sm font-medium">
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
              className="w-full py-3 rounded-xl font-bold text-sm bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all shadow-md active:scale-95"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};


// --- Slider Data (will be fetched from Firestore) ---
const HERO_SLIDES_FALLBACK = [
  {
    id: 1,
    image: "/img/websitebanner1.webp",
    title: "Master Practical Skills",
    subtitle: "Hands-on training with 100% Placement Support",
    link: "/courses",
    cta: "Start Learning"
  },
  {
    id: 2,
    image: "/img/websitebanner2.webp",
    title: "Learn from Experts",
    subtitle: "Industry-aligned training guided by experienced professionals",
    link: "/about",
    cta: "View Accreditations"
  },
  {
    id: 3,
    image: "/img/websitebanner3.webp",
    title: "Transform Your Career",
    subtitle: "With Industry-Driven Courses in Engineering & IT",
    link: "/placements",
    cta: "See Success Stories"
  },
  {
    id: 4,
    image: "/img/banner-6.webp",
    title: "Internship Program",
    subtitle: "Work on Live Projects with LASAK Technologies Pvt Ltd",
    link: "https://docs.google.com/forms/d/e/1FAIpQLScL1mo2i4LF9aineii9xi9V-CVntO8xSbk1Qi_5oU_5mpOnvg/viewform?usp=pp_url",
    cta: "Apply for Internship"
  },
  {
    id: 5,
    image: "/img/websitebanner4.webp",
    title: "College Workshops",
    subtitle: "Conduct Interactive Sessions & Workshops in Colleges with LASAK Technologies Pvt Ltd",
    link: "/contact",
    cta: "Apply to Conduct Workshop"
  }
];



const GOOGLE_REVIEWS_LIST = [
  {
    name: "Sakthi",
    image: "/img/saravana-kumar-r.webp",
    rating: 5,
    text: "I recently completed my internship at LASAK Company and had a great learning experience. The environment is very professional...",
    verified: true
  },
  {
    name: "Vishnu R",
    image: "/img/mr-dharsan-v.webp",
    rating: 5,
    text: "Actually, I had went there for five days training on solidworks, The of teaching was very nice, simple and understandable.",
    verified: true
  },
  {
    name: "King Maker",
    image: "/img/mr-lokkesh-v.webp",
    rating: 5,
    text: "I got a basic idea about solid work, good teaching and excellent place for learning...",
    verified: true
  },
  {
    name: "Priya Darshini",
    image: "/img/ms-chandraleka-k.webp",
    rating: 5,
    text: "One of the best institutes in Coimbatore for Civil CADD. The syllabus is up to date and placement support is genuine.",
    verified: true
  },
  {
    name: "Rahul K",
    image: "/img/mr-surya-m.webp",
    rating: 5,
    text: "Hands down the best place to learn mechanical design software. The faculty is very knowledgeable.",
    verified: true
  }
];
// --- Main Page Component ---

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
    HERO_SLIDES_FALLBACK.map((slide, index) => ({
      id: `fallback-${index}`,
      image: slide.image,
      title: slide.title,
      subtitle: slide.subtitle,
      cta_text: slide.cta,
      cta_link: slide.link
    }))
  );
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>(FALLBACK_YT_VIDEOS.map(v => ({ video_id: v.id, thumbnail: v.thumbnail })));
  const [videoTestimonials, setVideoTestimonials] = useState<any[]>([]);
  const [courses, setCourses] = useState<Course[]>(COURSES.slice(0, 3)); // Initialize with fallback

  useEffect(() => {
    fetchData();

    // Auth and Inquiry tracking
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
      const q = query(collection(db, 'enquiries'), where('email', '==', email), limit(1));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setHasSubmittedInquiry(true);
      }
    } catch (error) {
      console.error('Error checking inquiry status:', error);
    }
  };

  const fetchData = async () => {
    try {
      // Execute all Firestore queries in parallel to eliminate the waterfall delay
      const [
        partnersSnapshot,
        testimonialsSnapshot,
        heroSnapshot,
        ytSnapshot,
        vtSnapshot,
        coursesSnapshot,
        accreditationsSnapshot,
        categoriesSnapshot
      ] = await Promise.all([
        getDocs(collection(db, 'partners')), // Fetch all partners
        getDocs(collection(db, 'testimonials')),
        getDocs(query(collection(db, 'hero_slides'), where('active', '==', true))),
        getDocs(query(collection(db, 'youtube_videos'), where('active', '==', true))),
        getDocs(query(collection(db, 'video_testimonials'), where('active', '==', true))),
        getDocs(query(collection(db, 'courses'), where('show_on_home', '==', true))),
        getDocs(query(collection(db, 'accreditations'), orderBy('order_num', 'asc'))),
        getDocs(query(collection(db, 'categories'), orderBy('order_num', 'asc')))
      ]);

      // Process Partners
      if (!partnersSnapshot.empty) {
        const allPartnersData = partnersSnapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || 'Partner',
              logo: cleanPath(data.logo || ''),
              type: data.type || 'training',
              created_at: data.created_at || 0
            };
          });

        const trainingPartners = allPartnersData
          .filter(p => p.type === 'training')
          .sort((a, b) => (b.created_at || 0) - (a.created_at || 0));

        setPartners(trainingPartners);
      }

      // Process Testimonials
      if (!testimonialsSnapshot.empty) {
        const testimonialsData = testimonialsSnapshot.docs
          .map(doc => {
            const data = doc.data() as any;
            return {
              id: doc.id,
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
          .sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
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
      if (!accreditationsSnapshot.empty) {
        const accData = accreditationsSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setAccreditations(accData);
      }

      // Process Categories
      if (!categoriesSnapshot.empty) {
        const catData = categoriesSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setCategories(catData);
      }
      // Process Hero Slides
      if (!heroSnapshot.empty) {
        const heroData = heroSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as any))
          .sort((a, b) => (a.order_num || 0) - (b.order_num || 0));
        setHeroSlides(heroData);
      }

      // Process Youtube Videos
      if (!ytSnapshot.empty) {
        const ytData = ytSnapshot.docs
          .map(v => ({
            id: v.id,
            video_id: (v.data() as any).video_id,
            order_num: (v.data() as any).order_num || 0,
            thumbnail: `https://img.youtube.com/vi/${(v.data() as any).video_id}/mqdefault.jpg`
          }))
          .sort((a, b) => a.order_num - b.order_num);
        setYoutubeVideos(ytData);
      }

      // Process Video Testimonials
      if (!vtSnapshot.empty) {
        const vtData = vtSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as any))
          .sort((a, b) => (a.order_num || 0) - (b.order_num || 0));
        setVideoTestimonials(vtData);
      }

      // Process Courses
      if (!coursesSnapshot.empty) {
        const fetchedCourses = coursesSnapshot.docs.map((doc: any) => {
          const c = doc.data();
          return {
            id: doc.id,
            ...c,
            image: c.image,
            oldPrice: c.old_price || c.oldPrice,
            isFree: c.is_free || c.isFree
          };
        });

        const mergedCourses = fetchedCourses.map(fetched => {
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

  // Trigger Popup on Load (Firestore)
  useEffect(() => {
    const fetchPopupData = async () => {
      try {
        // Fetch config
        const configDoc = await getDoc(doc(db, 'popup_config', 'default'));

        if (configDoc.exists()) {
          const configData = configDoc.data();
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

          if (configData.enabled) {
            // Fetch slides without orderBy to avoid index requirement
            const slidesSnapshot = await getDocs(query(collection(db, 'popup_slides'), where('active', '==', true)));

            if (!slidesSnapshot.empty) {
              const slidesData = slidesSnapshot.docs
                .map(doc => {
                  const s = doc.data();
                  return {
                    id: doc.id,
                    image: cleanPath(s.image_url),
                    clickable: s.clickable,
                    style: s.style || 'standard',
                    title: s.title,
                    description: s.description,
                    button_text: s.button_text,
                    order_num: s.order_num || 0,
                    features: [s.feature_1, s.feature_2, s.feature_3].filter(Boolean)
                  };
                })
                .sort((a, b) => a.order_num - b.order_num);

              setPromoSlides(slidesData);
              setTimeout(() => setShowPromoPopup(true), 3000);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching popup data:', error);
      }
    };

    fetchPopupData();
  }, []);


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
    <div className="min-h-screen bg-transparent relative overflow-x-hidden font-sans selection:bg-amber-400 selection:text-slate-900">
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
      <AnimatePresence>
        {showPromoPopup && popupEnabled && promoSlides.length > 0 && (
          <div
            className="
        fixed inset-0 z-[9999]
        flex justify-center items-center
        px-4 py-10
      "
          >
            {/* Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
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
                <AnimatePresence mode="wait">
                  {promoSlides[currentPromoSlide]?.clickable ? (
                    // First 2 images with link
                    <a href={formUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowPromoPopup(false)}
                      className="block w-full h-full relative group"
                    >
                      <motion.img
                        key={currentPromoSlide}
                        src={promoSlides[currentPromoSlide]?.image}
                        alt="Special Offer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full h-full object-contain cursor-pointer"
                      />
                    </a>
                  ) : (
                    // Last 2 images without link
                    <div className="relative w-full h-full">
                      <motion.img
                        key={currentPromoSlide}
                        src={promoSlides[currentPromoSlide]?.image}
                        alt="Special Offer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </AnimatePresence>
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 1. Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden group bg-white">

        {/* Slider Background */}
        < AnimatePresence >
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0"
          >
            <img
              src={cleanPath(heroSlides[currentSlide]?.image)}
              alt={heroSlides[currentSlide]?.title}
              className="w-full h-full object-cover brightness-125"
              loading={currentSlide === 0 ? "eager" : "lazy"}
              fetchPriority={currentSlide === 0 ? "high" : "low"}
            />

            {/* Dark overlay without blur – image stays sharp */}

            <div className="absolute inset-0 bg-black/70"></div>
          </motion.div>
        </AnimatePresence >

        {/* Animated Blobs */}
        < div className="absolute inset-0 overflow-hidden pointer-events-none z-0" >
          <motion.div
            animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
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
              className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-blue-600 w-8' : 'bg-slate-300 w-2 hover:bg-slate-400'
                }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl xs:text-5xl md:text-7xl lg:text-8xl font-tech font-black mb-4 md:mb-6 tracking-tighter leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]">
              <motion.span
                key={heroSlides[currentSlide]?.title}
                initial={{ scale: 0.8, opacity: 0, filter: 'blur(20px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: "circOut" }}
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
              </motion.span>
            </h1>

            <p className="text-lg md:text-2xl lg:text-3xl text-white/90 drop-shadow-[0_3px_12px_rgba(0,0,0,0.7)] font-sans font-medium tracking-wide max-w-4xl mx-auto mb-8 md:mb-12 leading-relaxed min-h-[3em] flex items-center justify-center px-4">
              {heroSlides[currentSlide]?.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Link
                  to={heroSlides[currentSlide]?.cta_link}
                  className="px-8 py-4 bg-blue-600 rounded shadow-xl font-bold text-lg hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-white group h-full"
                >
                  {heroSlides[currentSlide]?.cta_text}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 3 }}
              >
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-white border border-slate-200 rounded font-bold text-lg text-slate-700 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 shadow-md transition-all hover:-translate-y-1 h-full flex items-center justify-center"
                >
                  Contact Us
                </Link>
              </motion.div>
            </div>
          </motion.div>
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
          <motion.div
            whileHover={{ y: -5 }}
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
          </motion.div>
        </ScrollReveal>
      </section >



      {/* 5. Statistics (Gradient Blue) */}
      < section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50" >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <StatCounter end={1500} label="Students" />
            <StatCounter end={100} label="Placement %" />
            <StatCounter end={50} label="College Tie-ups" />
            <StatCounter end={30} label="Courses" />
            <StatCounter end={12} label="Highest Package" />
            <StatCounter end={5} label="Years Exp." />
          </div>
        </div>
      </section >


      {/* 6. Categories (White) */}
      < section className="py-20 bg-white" >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black text-center mb-16">
            Explore Course Categories
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {categories.map(cat => (
              <CategoryCard
                key={cat.id}
                title={cat.name}
                icon={CATEGORY_ICONS[cat.id] || cat.icon || <Code />}
                path={`/courses/${cat.id}`}
              />
            ))}
          </div>
        </div>
      </section >



      {/* 6.5 Launch Offer Section (Gradient/Slate) */}
      {/*<section className="py-20 bg-slate-50 px-4">
        <div className="container mx-auto">
          <ScrollReveal>
             <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-2xl text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 opacity-20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="flex-1 text-center md:text-left">
                      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-white/10">
                         <Sparkles size={16} className="text-yellow-300" />
                         <span className="uppercase tracking-wider text-yellow-100">Launching Soon</span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black font-tech mb-4 leading-tight">
                         Generative AI & LLM Specialist
                      </h2>
                      <p className="text-indigo-100 text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
                         Master the future of technology. Learn to build Custom GPTs, RAG Pipelines, and fine-tune Large Language Models.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                         <Link to="/contact" className="px-8 py-4 bg-white text-indigo-700 rounded-lg font-bold shadow-lg hover:bg-indigo-50 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                            Enquire Now <Megaphone size={20} />
                         </Link>
                         <div className="flex items-center gap-2 px-6 py-4 border border-white/30 rounded-lg bg-white/5 backdrop-blur-sm">
                            <span className="font-bold">Limited Seats Available</span>
                         </div>
                      </div>
                   </div>
                   <div className="hidden lg:block">
                      <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 animate-float">
                          <Bot size={80} className="text-white/90" />
                      </div>
                   </div>
                </div>
             </div>
          </ScrollReveal>
        </div>
      </section> */}

      {/* 7. Latest Courses (White) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal>
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

            <AchieversScroller testimonials={testimonials} />
          </ScrollReveal>
        </div>
      </section>


      {/* 9. Student Voices (Autoplay Local Videos + Infinite Scroll) */}
      <StudentTestimonials videos={videoTestimonials} />

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

        <YouTubeScroller youtubeVideos={youtubeVideos} />
      </section>


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
                  <img src="/img/lasakedulogo.png" className="w-full h-full object-cover scale-110" alt="Lasak Edu" />
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
            <div className="w-full xl:w-3/4 relative">

              {/* Review Carousel Container */}
              <div className="overflow-hidden px-2 py-4">
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={reviewIndex} // Key change triggers animation
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {/* Display 2 items at a time */}
                    {[0, 1].map((offset) => {
                      if (testimonials.length === 0) return null;
                      const index = (reviewIndex + offset) % testimonials.length;
                      const review = testimonials[index];

                      return (
                        <div key={index} className="bg-white border border-slate-100 shadow-lg rounded-3xl p-8 relative hover:shadow-xl transition-shadow flex flex-col">
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
                  </motion.div>
                </AnimatePresence>
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

      <BlogAutoScroll />

      <InquiryModal
        isOpen={inquiryModal.isOpen}
        onClose={() => setInquiryModal(prev => ({ ...prev, isOpen: false }))}
        courseId={inquiryModal.courseId}
        courseTitle={inquiryModal.courseTitle}
        category={inquiryModal.category}
        actionType={inquiryModal.actionType}
        onSuccess={inquiryModal.onSuccess}
      />
    </div >
  );
};

export default Home;
