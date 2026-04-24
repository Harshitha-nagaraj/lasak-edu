/**
 * Seed real hero slides into Firebase WITH AUTH
 * Run: node scripts/seed-hero-real.mjs
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

const HERO_SLIDES = [
    {
        order_num: 0,
        image: "/img/websitebanner1.webp",
        title: "Master Practical Skills",
        subtitle: "Hands-on training with 100% Placement Support in IT, Mechanical & Civil.",
        cta_link: "/courses",
        cta_text: "Start Learning",
        active: true,
        created_at: new Date().toISOString()
    },
    {
        order_num: 1,
        image: "/img/websitebanner2.webp",
        title: "Learn from Experts",
        subtitle: "Industry-aligned training guided by experienced professionals from top firms.",
        cta_link: "/about",
        cta_text: "View Our Team",
        active: true,
        created_at: new Date().toISOString()
    },
    {
        order_num: 2,
        image: "/img/websitebanner3.webp",
        title: "Transform Your Career",
        subtitle: "Join our industry-driven courses designed for the current job market trends.",
        cta_link: "/placements",
        cta_text: "See Success Stories",
        active: true,
        created_at: new Date().toISOString()
    },
    {
        order_num: 3,
        image: "/img/websitebanner4.webp",
        title: "College Workshops",
        subtitle: "Conduct interactive sessions and workshops in your college with LASAK experts.",
        cta_link: "/contact",
        cta_text: "Enquiry Now",
        active: true,
        created_at: new Date().toISOString()
    }
];

async function seed() {
    try {
        await signIn('info@lasakedu.in', 'Lasakedu@2026');
        console.log("📡 Seeding Real Hero Slides...");
        for (const [idx, item] of HERO_SLIDES.entries()) {
            const id = `slide-${idx}`;
            await writeDoc('hero_slides', id, item);
            console.log(`✅ Seeded: ${item.title}`);
        }
        console.log("🎉 Hero slides seeded successfully!");
    } catch (err) {
        console.error("❌ Seeding failed:", err.message);
    }
}

seed();
