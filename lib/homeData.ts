import { fetchWithCache } from './cacheUtils';

export const fetchHomeData = async () => {
  const { getFirestoreDb } = await import('./firebase');
  const db = await getFirestoreDb();
  const { collection, query, where, getDocs, orderBy, limit } = await import('firebase/firestore');

  const [
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
  ] = await Promise.all([
    fetchWithCache('cache_home_partners', query(collection(db, 'partners'), limit(40))),
    fetchWithCache('cache_home_testimonials', query(collection(db, 'testimonials'), limit(15))),
    fetchWithCache('cache_hero_slides', query(collection(db, 'hero_slides'), where('active', '==', true))),
    fetchWithCache('cache_youtube_videos', query(collection(db, 'youtube_videos'), where('active', '==', true))),
    fetchWithCache('cache_video_testimonials', query(collection(db, 'video_testimonials'), where('active', '==', true))),
    fetchWithCache('cache_courses_home', query(collection(db, 'courses'), where('show_on_home', '==', true))),
    fetchWithCache('cache_accreditations', query(collection(db, 'accreditations'), orderBy('order_num', 'asc'))),
    fetchWithCache('cache_categories', query(collection(db, 'categories'), orderBy('order_num', 'asc'))),
    fetchWithCache('cache_home_program_segments', query(collection(db, 'program_segments'), orderBy('order_num', 'asc'))),
    fetchWithCache('cache_home_learning_ecosystem', query(collection(db, 'learning_ecosystem'), orderBy('order_num', 'asc')))
  ]);

  return {
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
  };
};

export const checkUserInquiryStatus = async (email: string) => {
  const { getFirestoreDb } = await import('./firebase');
  const db = await getFirestoreDb();
  const { collection, query, where, getDocs, limit } = await import('firebase/firestore');

  const q = query(collection(db, 'enquiries'), where('email', '==', email), limit(1));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

export const fetchHomePopupData = async () => {
  const { getFirestoreDb } = await import('./firebase');
  const db = await getFirestoreDb();
  const { doc, getDoc, collection, query, where } = await import('firebase/firestore');

  const configDoc = await getDoc(doc(db, 'popup_config', 'default'));
  if (!configDoc.exists()) return null;

  const configData = configDoc.data();
  let slidesData = [];

  if (configData.enabled) {
    const slidesRaw = await fetchWithCache('cache_popup_slides', query(collection(db, 'popup_slides'), where('active', '==', true)));
    if (slidesRaw) {
      slidesData = slidesRaw.sort((a: any, b: any) => (a.order_num || 0) - (b.order_num || 0));
    }
  }

  return { configData, slidesData };
};
