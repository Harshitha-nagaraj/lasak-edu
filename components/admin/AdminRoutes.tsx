import React, { lazy, useEffect, useRef } from 'react';
import { useUserRole } from '../../hooks/useUserRole';
import { COURSES } from '../../constants/courseDetails';
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
const EligibilityTests = lazy(() => import('../../pages/admin/EligibilityTests'));
const UserManager = lazy(() => import('../../pages/admin/UserManager'));
const MOUManager = lazy(() => import('../../pages/admin/MOUManager'));
const MOUEditor = lazy(() => import('../../pages/admin/MOUEditor'));
const ScholarshipManager = lazy(() => import('../../pages/admin/ScholarshipManager'));

const PassportManager = lazy(() => import('../../pages/admin/PassportManager'));
const NewsManager = lazy(() => import('../../pages/admin/NewsManager'));
const NewsEditor = lazy(() => import('../../pages/admin/NewsEditor'));
const CategoryManager = lazy(() => import('../../pages/admin/CategoryManager'));
const AccreditationManager = lazy(() => import('../../pages/admin/AccreditationManager'));
const ProgramSegmentsManager = lazy(() => import('../../pages/admin/ProgramSegmentsManager'));
const LearningEcosystemManager = lazy(() => import('../../pages/admin/LearningEcosystemManager'));

const AdminRoutes = () => {
  const { role, loading: roleLoading } = useUserRole();
  const cleanupRef = useRef(false);

  useEffect(() => {
    if (roleLoading) return;
    if (role === 'sales') return;
    if (cleanupRef.current) return;
    cleanupRef.current = true;

    const deepCleanup = async () => {
      try {
        const { getFirestoreDb } = await import('../../lib/firebase');
        const { doc, setDoc, deleteDoc, collection, getDocs } = await import('firebase/firestore');
        const db = await getFirestoreDb();

        console.log('🧹 Starting Deep Cleanup of Course Duplicates...');

        // 1. Get all current document IDs from Firestore
        const querySnapshot = await getDocs(collection(db, 'courses'));
        const allDocIds = querySnapshot.docs.map(d => d.id);
        const validIds = COURSES.map(c => c.id);

        let deletedCount = 0;
        let syncedCount = 0;

        // 2. Identify and delete duplicates (IDs that aren't in our constant list)
        for (const docId of allDocIds) {
          if (!validIds.includes(docId)) {
            console.log(`🗑️ Deleting duplicate: ${docId}`);
            await deleteDoc(doc(db, 'courses', docId));
            deletedCount++;
          }
        }

        // 3. Ensure all valid courses are synced and up to date
        for (const course of COURSES) {
          await setDoc(doc(db, 'courses', course.id), {
            ...course,
            last_sync: new Date().toISOString()
          }, { merge: true });
          syncedCount++;
        }

        console.log(`✅ Cleanup Complete! Deleted ${deletedCount} duplicates, synced ${syncedCount} courses.`);
        alert(`Cleanup Finished! Removed ${deletedCount} duplicates. Your admin panel is now clean.`);
      } catch (e) {
        console.error('Cleanup failed:', e);
      }
    };

    deepCleanup();
  }, [role, roleLoading]);

  if (roleLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (role === 'sales') {
    return (
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="enquiries" replace />} />
          <Route path="enquiries" element={<EnquiryManager />} />
          <Route path="eligibility-tests" element={<EligibilityTests />} />
          <Route path="*" element={<Navigate to="enquiries" replace />} />
        </Route>
      </Routes>
    );
  }

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

        <Route path="passports" element={<PassportManager />} />
        <Route path="mous" element={<MOUManager />} />
        <Route path="mous/new" element={<MOUEditor />} />
        <Route path="mous/:id" element={<MOUEditor />} />
        <Route path="categories" element={<CategoryManager />} />
        <Route path="accreditations" element={<AccreditationManager />} />
        <Route path="program-segments" element={<ProgramSegmentsManager />} />
        <Route path="learning-ecosystem" element={<LearningEcosystemManager />} />
        <Route path="setup" element={<Setup />} />
        <Route path="eligibility-tests" element={<EligibilityTests />} />
      </Route>
      {/* Fallback for within admin */}
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
