
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import fs from 'fs';

async function fixFirestoreImagePaths() {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const config = {};
    envFile.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join('=').trim().replace(/^"|"$/g, '');
            config[key] = value;
        }
    });

    const fbConfig = {
        apiKey: config.VITE_FIREBASE_API_KEY,
        authDomain: config.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: config.VITE_FIREBASE_PROJECT_ID,
        storageBucket: config.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: config.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: config.VITE_FIREBASE_APP_ID
    };

    const app = initializeApp(fbConfig);
    const db = getFirestore(app);

    // Map of old path -> new path
    const pathFixes = {
        '/img/ASHOK G.webp': '/img/ASHOK-G.webp',
        '/img/Mr. DHARSAN V.webp': '/img/Mr-DHARSAN-V.webp',
        '/img/Mr. GANESHPRADEEP .V.webp': '/img/Mr-GANESHPRADEEP-V.webp',
        '/img/Mr. GANESHPRADEEP V.webp': '/img/Mr-GANESHPRADEEP-V.webp',
        '/img/Mr. LOKKESH V.webp': '/img/Mr-LOKKESH-V.webp',
        '/img/Mr. RUTHRESH V.webp': '/img/Mr-RUTHRESH-V.webp',
        '/img/Mr. SURYA M.webp': '/img/Mr-SURYA-M.webp',
        '/img/Mr. Syed Sharukh.webp': '/img/Mr-Syed-Sharukh.webp',
        '/img/Mr. ANISH JOSEPH C.jpeg': '/img/Mr-ANISH-JOSEPH-C.jpeg',
        '/img/saravana kumar r.webp': '/img/saravana-kumar-r.webp',
        '/img/vishnu lakshmi s.webp': '/img/vishnu-lakshmi-s.webp',
        '/img/loga prasath p.jpeg': '/img/loga-prasath-p.jpeg',
        '/img/about 1.webp': '/img/about-1.webp',
        '/img/mou jct.webp': '/img/mou-jct.webp',
        '/img/nellakottai clg.webp': '/img/nellakottai-clg.webp',
        '/img/KGISL Mechanical Students.webp': '/img/KGISL-Mechanical-Students.webp',
        '/img/Design Workshops.webp': '/img/Design-Workshops.webp',
        '/img/Collaboration Zones.webp': '/img/Collaboration-Zones.webp',
    };

    const collectionsToFix = ['testimonials', 'partners', 'hero_slides', 'video_testimonials', 'courses', 'popup_slides'];
    const imageFields = ['image', 'logo', 'image_url', 'video_url', 'thumbnail'];

    let totalFixed = 0;

    for (const colName of collectionsToFix) {
        try {
            const snapshot = await getDocs(collection(db, colName));
            for (const docSnap of snapshot.docs) {
                const data = docSnap.data();
                const updates = {};
                let needsUpdate = false;

                for (const field of imageFields) {
                    if (data[field] && typeof data[field] === 'string') {
                        const oldPath = data[field];
                        const newPath = pathFixes[oldPath];
                        if (newPath) {
                            updates[field] = newPath;
                            needsUpdate = true;
                            console.log(`  [${colName}/${docSnap.id}] ${field}: "${oldPath}" → "${newPath}"`);
                            totalFixed++;
                        }
                    }
                }

                if (needsUpdate) {
                    await updateDoc(doc(db, colName, docSnap.id), updates);
                }
            }
        } catch (err) {
            console.error(`Error with ${colName}:`, err.message);
        }
    }

    console.log(`\n✅ Fixed ${totalFixed} Firestore image paths!`);
    process.exit(0);
}

fixFirestoreImagePaths().catch(console.error);
