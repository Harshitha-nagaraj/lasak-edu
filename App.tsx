import React, { lazy, Suspense, ReactNode, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
// Framer motion removed to optimize performance

// Legal & Policy Pages
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const CancellationPolicy = lazy(() => import("./pages/CancellationPolicy"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

// Main Layout & Admin Routing
const AdminRoutes = lazy(() => import('./components/admin/AdminRoutes'));
const Layout = lazy(() => import('./components/Layout'));

// Core Pages
const Home = lazy(() => import('./pages/Home'));
const Courses = lazy(() => import('./pages/Courses'));
const Verification = lazy(() => import('./pages/Verification'));
const CourseDetails = lazy(() => import('./pages/CourseDetails'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetails = lazy(() => import('./pages/BlogDetails'));
const News = lazy(() => import('./pages/News'));
const Programs = lazy(() => import('./pages/Programs'));
const Placements = lazy(() => import('./pages/Placements'));
const StudentTestimonials = lazy(() => import('./pages/studenttestmonials'));
const ScholarshipPage = lazy(() => import('./pages/ScholarshipPage'));

// Admin Entry Points
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const UpdatePassword = lazy(() => import('./pages/admin/UpdatePassword'));
const Maintenance = lazy(() => import('./pages/Maintenance'));

const IS_MAINTENANCE_MODE = false;

const Loader = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageWrapper = ({ children }: { children?: ReactNode }) => (
  <div className="animate-fade-in-up">
    {children}
  </div>
);

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const location = useLocation();

  React.useEffect(() => {
    let unsubscribe: any;
    const initAuth = async () => {
      const { getFirebaseAuth } = await import('./lib/firebase');
      const { onAuthStateChanged } = await import('firebase/auth');
      const auth = await getFirebaseAuth();
      unsubscribe = onAuthStateChanged(auth, (user) => {
        setSession(user);
        setLoading(false);
      });
    };
    initAuth();
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  if (loading) return <Loader />;
  if (!session) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return <>{children}</>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <Routes location={location}>
      {IS_MAINTENANCE_MODE && !location.pathname.startsWith('/admin') && (
        <Route path="*" element={<Maintenance />} />
      )}

      {/* Admin Section */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/update-password" element={<UpdatePassword />} />
      <Route path="/admin/*" element={<ProtectedRoute><AdminRoutes /></ProtectedRoute>} />

      {/* Public Section */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<Navigate to="/" replace />} />
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
        <Route path="/placements" element={<Placements />} />
        <Route path="/student-testimonials" element={<PageWrapper><StudentTestimonials /></PageWrapper>} />
        <Route path="/scholarship" element={<ScholarshipPage />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/cancellation-policy" element={<CancellationPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/internship" element={<Navigate to="/contact" replace />} />
        {/* Dynamic Top-Level SEO Route for Courses */}
        <Route path="/:slug" element={<PageWrapper><CourseDetails /></PageWrapper>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        <AnimatedRoutes />
      </Suspense>
    </Router>
  );
};

export default App;
