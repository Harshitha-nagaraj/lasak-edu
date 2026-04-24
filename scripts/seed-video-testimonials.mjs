/**
 * Video Testimonial Seeder for LasakEdu — REST API Version with Auth
 * Run: node scripts/seed-video-testimonials.mjs
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

if (!API_KEY || !PROJECT_ID) {
    console.error('❌ Missing VITE_FIREBASE_API_KEY or VITE_FIREBASE_PROJECT_ID in .env.local');
    process.exit(1);
}

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
    if (typeof val === 'string') return { stringValue: val };
    if (typeof val === 'number') return { integerValue: val.toString() };
    if (typeof val === 'boolean') return { booleanValue: val };
    if (val instanceof Date) return { timestampValue: val.toISOString() };
    if (Array.isArray(val)) return { arrayValue: { values: val.map(toFirestoreValue) } };
    if (typeof val === 'object' && val !== null) {
        const fields = {};
        for (const [k, v] of Object.entries(val)) {
            fields[k] = toFirestoreValue(v);
        }
        return { mapValue: { fields } };
    }
    return { nullValue: null };
}

async function seedVideoTestimonials() {
    try {
        await signIn('info@lasakedu.in', 'Lasakedu@2026');

        const videos = [];
        for (let i = 1; i <= 12; i++) {
            videos.push({
                id: `video-${i}`,
                video_url: `/img/videostestimonial/video${i}.mp4`,
                active: true,
                order_num: i
            });
        }

        console.log(`\n🚀 Seeding ${videos.length} Video Testimonials...`);

        for (const video of videos) {
            const { id, ...fields } = video;
            const url = `${BASE_URL}/video_testimonials/${id}?key=${API_KEY}`;

            const docFields = {};
            for (const [k, v] of Object.entries(fields)) {
                docFields[k] = toFirestoreValue(v);
            }
            docFields.created_at = toFirestoreValue(new Date());
            docFields.updated_at = toFirestoreValue(new Date());

            const headers = { 'Content-Type': 'application/json' };
            if (ID_TOKEN) headers['Authorization'] = `Bearer ${ID_TOKEN}`;

            const res = await fetch(url, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ fields: docFields })
            });

            if (res.ok) {
                console.log(`✅ Seeded: ${video.id}`);
            } else {
                const error = await res.json();
                console.error(`❌ Failed: ${video.id}`, JSON.stringify(error));
            }
        }

        console.log('\n✨ Video Testimonial Seeding Complete!');
    } catch (err) {
        console.error('\n❌ Seeding failed:', err.message);
    }
}

seedVideoTestimonials();
