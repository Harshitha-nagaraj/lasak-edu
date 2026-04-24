// fix_course_images.mjs
// This script updates all course image URLs in Firestore to match the correct local paths

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBre0-hp2zuEesgla3PEQ62szmtvTN8Q5o",
    authDomain: "lasak-c1db5.firebaseapp.com",
    projectId: "lasak-c1db5",
    storageBucket: "lasak-c1db5.firebasestorage.app",
    messagingSenderId: "297000648833",
    appId: "1:297000648833:web:77acf6b33604e796444d80"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Correct image map based on course title keywords
const IMAGE_MAP = [
    // Mechanical
    { keywords: ['autocad mechanical'], image: '/img/mech/autocad.webp' },
    { keywords: ['solidworks'], image: '/img/mech/solidworks-408z.webp' },
    { keywords: ['creo'], image: '/img/mech/creo-688z.webp' },
    { keywords: ['catia'], image: '/img/mech/catia-118z.webp' },
    { keywords: ['ansys'], image: '/img/mech/ansys-670z.webp' },
    { keywords: ['hypermesh'], image: '/img/mech/hypermesh-631z.webp' },
    { keywords: ['ansa'], image: '/img/mech/ansa-062z.webp' },
    { keywords: ['nx cad', 'nxcad', 'siemens nx'], image: '/img/mech/nxcad-582z.webp' },
    { keywords: ['autodesk inventor', 'inventor'], image: '/img/mech/autodesk-inventor-783z.webp' },
    { keywords: ['wiring harness'], image: '/img/mech/wiring-harness-catia-256z.webp' },
    { keywords: ['cfd'], image: '/img/mech/cfd-486z.webp' },
    { keywords: ['3d printing', '3d scan'], image: '/img/mech/3d-399z.webp' },

    // IT & Software
    { keywords: ['full stack', 'fullstack'], image: '/img/it/full-stack-development-171z.webp' },
    { keywords: ['python'], image: '/img/it/python-267z.webp' },
    { keywords: ['java'], image: '/img/it/java-747z.webp' },
    { keywords: ['data analytics', 'data science'], image: '/img/it/da-013z.webp' },
    { keywords: ['web development', 'web dev'], image: '/img/it/web-development-387z.webp' },
    { keywords: ['digital marketing'], image: '/img/it/digital-marketing-875z.webp' },
    { keywords: ['software testing', 'testing'], image: '/img/it/st-291z.webp' },
    { keywords: ['ui', 'ux', 'ui/ux'], image: '/img/it/ui-514z.webp' },
    { keywords: ['programming', 'c programming', 'c++'], image: '/img/it/programming-979z.webp' },

    // Civil
    { keywords: ['autocad civil'], image: '/img/civil/autocad-civil.webp' },
    { keywords: ['revit'], image: '/img/civil/revit.webp' },
    { keywords: ['sketchup'], image: '/img/civil/sketchup.webp' },
    { keywords: ['staad'], image: '/img/civil/staad.webp' },
    { keywords: ['civil 3d', 'civil3d'], image: '/img/civil/civil-3d.webp' },

    // Arts
    { keywords: ['graphic design'], image: '/img/arts/graphic-design.webp' },
    { keywords: ['video editing'], image: '/img/arts/video-editing.webp' },
    { keywords: ['tally'], image: '/img/arts/tally.webp' },
    { keywords: ['ms office', 'ms-office', 'microsoft office'], image: '/img/arts/ms-office.webp' },
];

function getImageForCourse(title, category) {
    const t = (title || '').toLowerCase();

    for (const entry of IMAGE_MAP) {
        if (entry.keywords.some(k => t.includes(k))) {
            return entry.image;
        }
    }

    // Category-based fallback
    if (category === 'Mechanical') return '/img/mech/autocad.webp';
    if (category === 'IT') return '/img/it/da-013z.webp';
    if (category === 'Civil') return '/img/civil/autocad-civil.webp';
    if (category === 'Arts') return '/img/arts/graphic-design.webp';

    return null; // Don't update if we can't find a match
}

async function fixCourseImages() {
    console.log('🔍 Fetching all courses from Firestore...');

    const snapshot = await getDocs(collection(db, 'courses'));
    console.log(`📦 Found ${snapshot.size} courses\n`);

    let updated = 0;
    let skipped = 0;
    let noMatch = 0;

    for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const currentImage = data.image || '';
        const title = data.title || '';
        const category = data.category || '';

        // Check if image is broken (example.com, empty, or undefined)
        const isBroken = !currentImage ||
            currentImage.includes('example.com') ||
            currentImage.trim() === '' ||
            currentImage.includes('undefined');

        const correctImage = getImageForCourse(title, category);

        if (!correctImage) {
            console.log(`⚠️  No match for: "${title}" (${category}) -- current: ${currentImage}`);
            noMatch++;
            continue;
        }

        if (!isBroken && currentImage === correctImage) {
            console.log(`✅ OK: "${title}" → ${currentImage}`);
            skipped++;
            continue;
        }

        // Update the image in Firestore
        try {
            await updateDoc(doc(db, 'courses', docSnap.id), { image: correctImage });
            console.log(`🔧 FIXED: "${title}"`);
            console.log(`   Was: ${currentImage || '(empty)'}`);
            console.log(`   Now: ${correctImage}\n`);
            updated++;
        } catch (err) {
            console.error(`❌ Failed to update "${title}":`, err.message);
        }
    }

    console.log('\n=== Summary ===');
    console.log(`✅ Already correct: ${skipped}`);
    console.log(`🔧 Fixed: ${updated}`);
    console.log(`⚠️  No match found: ${noMatch}`);
    console.log('\n✨ Done! Refresh the admin panel to see the updated images.');
    process.exit(0);
}

fixCourseImages().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
