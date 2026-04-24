
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

async function check() {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const config = {};
    envFile.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            config[key.trim()] = value.trim().replace(/^"|"$/g, '');
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

    const collections = ['partners', 'testimonials', 'hero_slides', 'video_testimonials', 'courses'];
    const results = {};

    for (const colName of collections) {
        results[colName] = [];
        try {
            const snapshot = await getDocs(collection(db, colName));
            snapshot.forEach(doc => {
                results[colName].push({ id: doc.id, ...doc.data() });
            });
            console.log(`Fetched ${results[colName].length} docs for ${colName}`);
        } catch (err) {
            console.error(`Error fetching ${colName}:`, err.message);
        }
    }

    fs.writeFileSync('firebase_debug.json', JSON.stringify(results, null, 2));
    console.log('Results written to firebase_debug.json');
    process.exit(0);
}

check().catch(console.error);
