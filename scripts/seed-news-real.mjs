/**
 * Seed real news items into Firebase WITH AUTH
 * Run: node scripts/seed-news-real.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const envFile = resolve(__dir, '../.env.local');
const envText = readFileSync(envFile, 'utf8');
const env = {};
for (const line of envText.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    env[key] = val;
}

const API_KEY = env.VITE_FIREBASE_API_KEY;
const PROJECT_ID = env.VITE_FIREBASE_PROJECT_ID;
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

let ID_TOKEN = null;

async function signIn(email, password) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`Auth failed: ${data.error?.message}`);
    ID_TOKEN = data.idToken;
    console.log(`🔐 Signed in as ${email}`);
}

function toFirestoreValue(val) {
    if (val === null || val === undefined) return { nullValue: null };
    if (typeof val === 'boolean') return { booleanValue: val };
    if (typeof val === 'number') return Number.isInteger(val) ? { integerValue: val } : { doubleValue: val };
    if (typeof val === 'string') return { stringValue: val };
    if (val instanceof Date) return { timestampValue: val.toISOString() };
    if (Array.isArray(val)) return { arrayValue: { values: val.map(toFirestoreValue) } };
    if (typeof val === 'object') {
        const fields = {};
        for (const [k, v] of Object.entries(val)) { fields[k] = toFirestoreValue(v); }
        return { mapValue: { fields } };
    }
    return { stringValue: String(val) };
}

function toFirestoreDoc(obj) {
    const fields = {};
    for (const [k, v] of Object.entries(obj)) { fields[k] = toFirestoreValue(v); }
    return { fields };
}

async function writeDoc(collectionName, docId, data) {
    const url = `${BASE_URL}/${collectionName}/${docId}?key=${API_KEY}`;
    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ID_TOKEN}`
        },
        body: JSON.stringify(toFirestoreDoc(data)),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to write ${docId}: ${err}`);
    }
}

const REAL_NEWS = [
    {
        title: "New Course Launch: Mastering Data Analytics for a Low Price",
        date: "March 2, 2026",
        excerpt: "Enroll now in our latest Data Analytics bundle. Master Excel, SQL, Python, and Tableau at an industry-low price with 100% placement support.",
        category: "Course Launch",
        image: "/img/dataanalytics.webp",
        created_at: new Date().toISOString()
    },
    {
        title: "Join Our Exclusive Online Workshops on Emerging Technologies",
        date: "March 5, 2026",
        excerpt: "We are organizing a series of free online workshops covering UI/UX Design, Cloud Computing, and Cybersecurity. Register today to attend from anywhere.",
        category: "Workshops",
        image: "https://images.unsplash.com/photo-1540575861501-7ad05823c95b?w=800&auto=format&fit=crop&q=60",
        created_at: new Date().toISOString()
    },
    {
        title: "Placement Success: 25+ Students Placed in Top IT Firms This Month",
        date: "Feb 28, 2026",
        excerpt: "Congratulations to our students who successfully landed roles in companies like LMW, CADOPT, and Hinduja Tech. Your dream carrier starts here.",
        category: "Placements",
        image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=60",
        created_at: new Date().toISOString()
    }
];

async function seed() {
    try {
        await signIn('info@lasakedu.in', 'Lasakedu@2026');
        console.log("📡 Seeding Real News Items...");
        for (const [idx, item] of REAL_NEWS.entries()) {
            const id = `news-${idx + 1}`;
            await writeDoc('news', id, item);
            console.log(`✅ Seeded: ${item.title}`);
        }
        console.log("🎉 News seeded successfully!");
    } catch (err) {
        console.error("❌ Seeding failed:", err.message);
    }
}

seed();
