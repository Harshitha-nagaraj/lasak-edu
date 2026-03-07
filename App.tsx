
import React, { lazy, Suspense, ReactNode, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Layout from './components/Layout';
import TermsConditions from "./pages/TermsConditions";
import RefundPolicy from "./pages/RefundPolicy";
import CancellationPolicy from "./pages/CancellationPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Direct Import for Admin Login to prevent lazy loading issues
import AdminLogin from './pages/admin/AdminLogin';
import UpdatePassword from './pages/admin/UpdatePassword';
import Maintenance from './pages/Maintenance';

const IS_MAINTENANCE_MODE = false; // Set to true to enable "Under Service" page

// Lazy Load Pages for performance
import Home from './pages/Home';
const Courses = lazy(() => import('./pages/Courses'));
const Verification = lazy(() => import('./pages/Verification'));
const CourseDetails = lazy(() => import('./pages/CourseDetails')); // New Page
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetails = lazy(() => import('./pages/BlogDetails'));
const News = lazy(() => import('./pages/News'));
const Programs = lazy(() => import('./pages/Programs'));
const Placements = lazy(() => import('./pages/Placements'));
const StudentTestimonials = lazy(() => import('./pages/studenttestmonials'));
const ScholarshipPage = lazy(() => import('./pages/ScholarshipPage'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));

// Admin Pages
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const EnquiryManager = lazy(() => import('./pages/admin/EnquiryManager'));
const CourseManager = lazy(() => import('./pages/admin/CourseManager'));
const CourseEditor = lazy(() => import('./pages/admin/CourseEditor'));
const BlogManager = lazy(() => import('./pages/admin/BlogManager'));
const BlogEditor = lazy(() => import('./pages/admin/BlogEditor'));
const TestimonialManager = lazy(() => import('./pages/admin/TestimonialManager'));
const TestimonialEditor = lazy(() => import('./pages/admin/TestimonialEditor'));
const PartnerManager = lazy(() => import('./pages/admin/PartnerManager'));
const HeroSlidesManager = lazy(() => import('./pages/admin/HeroSlidesManager'));
const HeroSlideEditor = lazy(() => import('./pages/admin/HeroSlideEditor'));
const SiteSettingsManager = lazy(() => import('./pages/admin/SiteSettingsManager'));
const ContactInfoManager = lazy(() => import('./pages/admin/ContactInfoManager'));
const AboutContentManager = lazy(() => import('./pages/admin/AboutContentManager'));
const VideoTestimonialManager = lazy(() => import('./pages/admin/VideoTestimonialManager'));
const VideoTestimonialEditor = lazy(() => import('./pages/admin/VideoTestimonialEditor'));
const YoutubeManager = lazy(() => import('./pages/admin/YoutubeManager'));
const YoutubeEditor = lazy(() => import('./pages/admin/YoutubeEditor'));
const WorkshopManager = lazy(() => import('./pages/admin/WorkshopManager')); // [NEW]
const FeatureManager = lazy(() => import('./pages/admin/FeatureManager')); // [NEW]
const CertificateManager = lazy(() => import('./pages/admin/CertificateManager'));
const CertificateEditor = lazy(() => import('./pages/admin/CertificateEditor'));
const CertVerificationContentManager = lazy(() => import('./pages/admin/CertVerificationContentManager'));
const PopupManager = lazy(() => import('./pages/admin/PopupManager'));
const PolicyContentManager = lazy(() => import('./pages/admin/PolicyContentManager'));
const SEOManager = lazy(() => import('./pages/admin/SEOManager'));
const SEOEditor = lazy(() => import('./pages/admin/SEOEditor'));
const Setup = lazy(() => import('./pages/admin/Setup'));
const UserManager = lazy(() => import('./pages/admin/UserManager'));
const MOUManager = lazy(() => import('./pages/admin/MOUManager'));
const MOUEditor = lazy(() => import('./pages/admin/MOUEditor'));
const ScholarshipManager = lazy(() => import('./pages/admin/ScholarshipManager'));
const CouponManager = lazy(() => import('./pages/admin/CouponManager'));
const PassportManager = lazy(() => import('./pages/admin/PassportManager'));
const NewsManager = lazy(() => import('./pages/admin/NewsManager'));
const NewsEditor = lazy(() => import('./pages/admin/NewsEditor'));
const CategoryManager = lazy(() => import('./pages/admin/CategoryManager'));
const AccreditationManager = lazy(() => import('./pages/admin/AccreditationManager'));


const Loader = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// ScrollToTop Component to reset scroll position on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Page Transition Wrapper
const PageWrapper = ({ children }: { children?: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Protected Route Component
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const location = useLocation();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setSession(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <Loader />;

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="sync">
      <Routes location={location}>

        {/* --- MAINTENANCE REDIRECT --- */}
        {IS_MAINTENANCE_MODE && !location.pathname.startsWith('/admin') && (
          <Route path="*" element={<Maintenance />} />
        )}

        {/* --- ADMIN ROUTES (No Public Layout) --- */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/update-password" element={<UpdatePassword />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="enquiries" element={<EnquiryManager />} />
          <Route path="courses" element={<CourseManager />} />
          <Route path="courses/:id" element={<CourseEditor />} />
          <Route path="blogs" element={<BlogManager />} />
          <Route path="blogs/:id" element={<BlogEditor />} />
          <Route path="testimonials" element={<TestimonialManager />} />
          <Route path="testimonials/:id" element={<TestimonialEditor />} />
          <Route path="news" element={<NewsManager />} />
          <Route path="news/:id" element={<NewsEditor />} />
          <Route path="news/new" element={<NewsEditor />} />
          <Route path="partners" element={<PartnerManager />} />
          <Route path="hero-slides" element={<HeroSlidesManager />} />
          <Route path="hero-slides/:id" element={<HeroSlideEditor />} />
          <Route path="settings" element={<SiteSettingsManager />} />
          <Route path="contact-info" element={<ContactInfoManager />} />
          <Route path="about-content" element={<AboutContentManager />} />
          <Route path="video-testimonials" element={<VideoTestimonialManager />} />
          <Route path="video-testimonials/new" element={<VideoTestimonialEditor />} />
          <Route path="video-testimonials/:id" element={<VideoTestimonialEditor />} />
          <Route path="youtube" element={<YoutubeManager />} />
          <Route path="youtube/new" element={<YoutubeEditor />} />
          <Route path="youtube/:id" element={<YoutubeEditor />} />
          <Route path="certificates" element={<CertificateManager />} />
          <Route path="certificates/new" element={<CertificateEditor />} />
          <Route path="certificates/:id" element={<CertificateEditor />} />
          <Route path="cert-verification-content" element={<CertVerificationContentManager />} />
          <Route path="workshops" element={<WorkshopManager />} />
          <Route path="features" element={<FeatureManager />} />
          <Route path="popup" element={<PopupManager />} />
          <Route path="policy-content" element={<PolicyContentManager />} />
          <Route path="seo" element={<SEOManager />} />
          <Route path="seo/edit" element={<SEOEditor />} />
          <Route path="users" element={<UserManager />} />
          <Route path="scholarships" element={<ScholarshipManager />} />
          <Route path="coupons" element={<CouponManager />} />
          <Route path="passports" element={<PassportManager />} />
          <Route path="mous" element={<MOUManager />} />
          <Route path="mous/new" element={<MOUEditor />} />
          <Route path="mous/:id" element={<MOUEditor />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="accreditations" element={<AccreditationManager />} />
          <Route path="setup" element={<Setup />} />
        </Route>


        {/* --- PUBLIC ROUTES (Wrapped in Layout) --- */}

        <Route element={<Layout />}>

          {/* 🚀 Homepage (NO animation for best performance) */}
          <Route path="/" element={<Home />} />

          {/* Light pages – keep animation */}
          {/* Student Login/Signup removed as per request - Redirect to home */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/signup" element={<Navigate to="/" replace />} />

          {/* Medium pages – animated */}
          <Route path="/programs" element={<PageWrapper><Programs /></PageWrapper>} />
          <Route path="/courses" element={<PageWrapper><Courses /></PageWrapper>} />
          <Route path="/courses/:category" element={<PageWrapper><Courses /></PageWrapper>} />
          <Route path="/courses/:category/:slug" element={<PageWrapper><CourseDetails /></PageWrapper>} />
          <Route path="/course/:id" element={<PageWrapper><CourseDetails /></PageWrapper>} />
          <Route path="/verify" element={<PageWrapper><Verification /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />

          <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
          <Route path="/blog/:id" element={<PageWrapper><BlogDetails /></PageWrapper>} />
          <Route path="/news" element={<PageWrapper><News /></PageWrapper>} />

          {/* 🚀 Placements – remove animation (usually heavy images/videos) */}
          <Route path="/placements" element={<Placements />} />

          {/* Testimonials – keep animation */}
          <Route path="/student-testimonials" element={<PageWrapper><StudentTestimonials /></PageWrapper>} />

          {/* 🚀 Scholarship – Now accessible to all */}
          <Route
            path="/scholarship"
            element={<ScholarshipPage />}
          />

          {/* Policy pages – no need animation */}
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          <Route path="/internship" element={<Navigate to="/contact" replace />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </AnimatePresence>
  );
};


const App = () => {
  // 🔥 Add this line to test your API key
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        <AnimatedRoutes />
      </Suspense>
    </Router>
  );
};

export default App;
