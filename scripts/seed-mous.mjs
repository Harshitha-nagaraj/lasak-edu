/**
 * MOU Seeder for LasakEdu
 * Run: node scripts/seed-mous.mjs
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

async function purgeCollection(collectionName) {
    console.log(`🧹 Purging ${collectionName}...`);
    const listRes = await fetch(`${BASE_URL}/${collectionName}?key=${API_KEY}`);
    const data = await listRes.json();
    if (data.documents) {
        for (const doc of data.documents) {
            const docId = doc.name.split('/').pop();
            const delRes = await fetch(`${BASE_URL}/${collectionName}/${docId}?key=${API_KEY}`, {
                method: 'DELETE',
                headers: ID_TOKEN ? { 'Authorization': `Bearer ${ID_TOKEN}` } : {}
            });
            if (delRes.ok) console.log(`🗑️ Deleted: ${docId}`);
        }
    }
}

async function seedMOUs() {
    try {
        await signIn('info@lasakedu.in', 'Admin@123');

        await purgeCollection('mous');

        const mousData = [
            {
                college_name: 'Government College of Technology, Coimbatore',
                description: 'Lasak Edu is proud to partner with GCT Coimbatore to provide advanced technical training and skill development programs for engineering students. Our collaboration focuses on bridging the gap between academic theory and industrial practice.',
                image: '/img/mou-gct.webp',
                date: 'March 2024',
                order_num: 1,
                active: true
            },
            {
                college_name: 'Bishop Appasamy College of Arts and Science',
                description: 'Lasak Edu has signed a strategic MOU with Bishop Appasamy College to empower students with industry-relevant IT skills and placement-oriented training. We provide specialized workshops and internships for final-year students.',
                image: '/img/mou-bishop.webp',
                date: 'February 2024',
                order_num: 2,
                active: true
            }
        ];

        console.log(`\n🚀 Seeding ${mousData.length} MOUs...`);

        for (const [index, item] of mousData.entries()) {
            const url = `${BASE_URL}/mous?key=${API_KEY}`;
            const docFields = {};
            for (const [k, v] of Object.entries(item)) {
                docFields[k] = toFirestoreValue(v);
            }
            docFields.created_at = toFirestoreValue(new Date());

            const headers = { 'Content-Type': 'application/json' };
            if (ID_TOKEN) headers['Authorization'] = `Bearer ${ID_TOKEN}`;

            const res = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify({ fields: docFields })
            });

            if (res.ok) {
                console.log(`✅ Seeded: ${item.college_name}`);
            } else {
                const error = await res.json();
                console.error(`❌ Failed: ${item.college_name}`, JSON.stringify(error));
            }
        }

        console.log('\n✨ MOU Seeding Complete!');
    } catch (err) {
        console.error('\n❌ Seeding failed:', err.message);
    }
}

seedMOUs();
