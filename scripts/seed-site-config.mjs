/**
 * Site Config Seeder for LasakEdu
 * Fixes missing footer contact and promo popup
 * Run: node scripts/seed-site-config.mjs
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

function toFirestoreValue(val) {
    if (val === null || val === undefined) return { nullValue: null };
    if (typeof val === 'boolean') return { booleanValue: val };
    if (typeof val === 'number') return Number.isInteger(val) ? { integerValue: val } : { doubleValue: val };
    if (typeof val === 'string') return { stringValue: val };
    if (val instanceof Date) return { timestampValue: val.toISOString() };
    if (Array.isArray(val)) {
        return { arrayValue: { values: val.map(toFirestoreValue) } };
    }
    if (typeof val === 'object') {
        const fields = {};
        for (const [k, v] of Object.entries(val)) {
            fields[k] = toFirestoreValue(v);
        }
        return { mapValue: { fields } };
    }
    return { stringValue: String(val) };
}

function toFirestoreDoc(obj) {
    const fields = {};
    for (const [k, v] of Object.entries(obj)) {
        fields[k] = toFirestoreValue(v);
    }
    return { fields };
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

async function writeDoc(collectionName, docId, data) {
    const url = `${BASE_URL}/${collectionName}/${docId}?key=${API_KEY}`;
    const body = toFirestoreDoc(data);
    const headers = { 'Content-Type': 'application/json' };
    if (ID_TOKEN) headers['Authorization'] = `Bearer ${ID_TOKEN}`;
    const res = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify(body) });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to write ${collectionName}/${docId}: ${err}`);
    }
}

const SOCIAL_CONTACTS = [
    { type: 'social_media', label: 'Instagram', value: 'https://www.instagram.com/lasak_edu/', icon: 'Instagram', order_num: 10, active: true },
    { type: 'social_media', label: 'LinkedIn', value: 'https://www.linkedin.com/in/lasak-edu-a3a2ba254/', icon: 'Linkedin', order_num: 11, active: true },
    { type: 'social_media', label: 'Facebook', value: 'https://www.facebook.com/lasaktechnoinstitute', icon: 'Facebook', order_num: 12, active: true },
];

const POPUP_CONFIG = {
    enabled: true,
    interval: 4000,
    form_url: 'https://docs.google.com/forms/d/e/1FAIpQLScL1mo2i4LF9aineii9xi9V-CVntO8xSbk1Qi_5oU_5mpOnvg/viewform',
    title: 'Special Scholarship Offer!',
    description: 'Apply now for up to 50% scholarship on all diploma courses. Limited seats available for the next batch.',
    button_text: 'Apply for Scholarship',
    feature_1: 'Free Demo Classes',
    feature_2: '100% Placement Support',
    feature_3: 'ISO Certified Certificate'
};

const POPUP_SLIDE = {
    active: true,
    order_num: 1,
    image_url: '/img/websitebanner1.webp',
    clickable: true,
    style: 'standard', // 'standard' or 'image_only'
    title: 'Master Industry Skills',
    description: 'Join our Mechanical & IT courses today.',
    button_text: 'Learn More',
    feature_1: 'Expert Faculty',
    feature_2: 'Real-time Projects',
    feature_3: 'Placement Assistance'
};

async function main() {
    try {
        await signIn('info@lasakedu.in', 'Lasakedu@2026');

        console.log('\n📡 Seeding Social Contacts...');
        for (const contact of SOCIAL_CONTACTS) {
            await writeDoc('contact_info', `social-${contact.label.toLowerCase()}`, contact);
        }

        console.log('📡 Seeding Popup Config...');
        await writeDoc('popup_config', 'default', POPUP_CONFIG);

        console.log('📡 Seeding Popup Slides...');
        await writeDoc('popup_slides', 'slide-1', POPUP_SLIDE);

        console.log('\n✅ Site configuration updated successfully!');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Seeder failed:', err.message);
        process.exit(1);
    }
}

main();
