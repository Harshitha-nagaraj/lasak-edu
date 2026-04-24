import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Admin Layout
const AdminLayout = lazy(() => import('./AdminLayout'));

// Admin Pages
const Dashboard = lazy(() => import('../../pages/admin/Dashboard'));
const EnquiryManager = lazy(() => import('../../pages/admin/EnquiryManager'));
const CourseManager = lazy(() => import('../../pages/admin/CourseManager'));
const CourseEditor = lazy(() => import('../../pages/admin/CourseEditor'));
const BlogManager = lazy(() => import('../../pages/admin/BlogManager'));
const BlogEditor = lazy(() => import('../../pages/admin/BlogEditor'));
const TestimonialManager = lazy(() => import('../../pages/admin/TestimonialManager'));
const TestimonialEditor = lazy(() => import('../../pages/admin/TestimonialEditor'));
const PartnerManager = lazy(() => import('../../pages/admin/PartnerManager'));
const HeroSlidesManager = lazy(() => import('../../pages/admin/HeroSlidesManager'));
const HeroSlideEditor = lazy(() => import('../../pages/admin/HeroSlideEditor'));
const SiteSettingsManager = lazy(() => import('../../pages/admin/SiteSettingsManager'));
const ContactInfoManager = lazy(() => import('../../pages/admin/ContactInfoManager'));
const AboutContentManager = lazy(() => import('../../pages/admin/AboutContentManager'));
const VideoTestimonialManager = lazy(() => import('../../pages/admin/VideoTestimonialManager'));
const VideoTestimonialEditor = lazy(() => import('../../pages/admin/VideoTestimonialEditor'));
const YoutubeManager = lazy(() => import('../../pages/admin/YoutubeManager'));
const YoutubeEditor = lazy(() => import('../../pages/admin/YoutubeEditor'));
const WorkshopManager = lazy(() => import('../../pages/admin/WorkshopManager'));
const FeatureManager = lazy(() => import('../../pages/admin/FeatureManager'));
const CertificateManager = lazy(() => import('../../pages/admin/CertificateManager'));
const CertificateEditor = lazy(() => import('../../pages/admin/CertificateEditor'));
const CertVerificationContentManager = lazy(() => import('../../pages/admin/CertVerificationContentManager'));
const PopupManager = lazy(() => import('../../pages/admin/PopupManager'));
const PolicyContentManager = lazy(() => import('../../pages/admin/PolicyContentManager'));
const SEOManager = lazy(() => import('../../pages/admin/SEOManager'));
const SEOEditor = lazy(() => import('../../pages/admin/SEOEditor'));
const Setup = lazy(() => import('../../pages/admin/Setup'));
const UserManager = lazy(() => import('../../pages/admin/UserManager'));
const MOUManager = lazy(() => import('../../pages/admin/MOUManager'));
const MOUEditor = lazy(() => import('../../pages/admin/MOUEditor'));
const ScholarshipManager = lazy(() => import('../../pages/admin/ScholarshipManager'));
const CouponManager = lazy(() => import('../../pages/admin/CouponManager'));
const PassportManager = lazy(() => import('../../pages/admin/PassportManager'));
const NewsManager = lazy(() => import('../../pages/admin/NewsManager'));
const NewsEditor = lazy(() => import('../../pages/admin/NewsEditor'));
const CategoryManager = lazy(() => import('../../pages/admin/CategoryManager'));
const AccreditationManager = lazy(() => import('../../pages/admin/AccreditationManager'));
const ProgramSegmentsManager = lazy(() => import('../../pages/admin/ProgramSegmentsManager'));
const LearningEcosystemManager = lazy(() => import('../../pages/admin/LearningEcosystemManager'));

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
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
        <Route path="program-segments" element={<ProgramSegmentsManager />} />
        <Route path="learning-ecosystem" element={<LearningEcosystemManager />} />
        <Route path="setup" element={<Setup />} />
      </Route>
      {/* Fallback for within admin */}
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
