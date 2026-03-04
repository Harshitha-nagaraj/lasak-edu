/**
 * Master Config Seeder for LasakEdu
 * Ensures ALL site settings, contact info, and popup data are present.
 * Run: node scripts/seed-master-config.mjs
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

// ─────────────────────────────────────────
// DATA CONFIGURATION
// ─────────────────────────────────────────

const CONTACT_INFO = [
    { type: 'address', label: 'Main Office', value: '11A, STV Nagar, Peelamedu, Coimbatore - 641004', icon: 'MapPin', order_num: 1, active: true },
    { type: 'phone', label: 'Phone', value: '+91 74187 32525', icon: 'Phone', order_num: 2, active: true },
    { type: 'email', label: 'Email', value: 'info@lasakedu.in', icon: 'Mail', order_num: 3, active: true },
    { type: 'address', label: 'Gandhipuram Branch', value: 'No.655 F Shri Paaththaa avenue, 1st floor, Near Gp signal Gandhipuram', icon: 'MapPin', order_num: 4, active: true },
    { type: 'social_media', label: 'Instagram', value: 'https://www.instagram.com/lasak_edu/', icon: 'Instagram', order_num: 10, active: true },
    { type: 'social_media', label: 'LinkedIn', value: 'https://www.linkedin.com/in/lasak-edu-a3a2ba254/', icon: 'Linkedin', order_num: 11, active: true },
    { type: 'social_media', label: 'Facebook', value: 'https://www.facebook.com/lasaktechnoinstitute', icon: 'Facebook', order_num: 12, active: true },
];

const SITE_SETTINGS = [
    {
        id: 'footer_text',
        data: {
            key: 'footer_text',
            value: {
                copyright: `© ${new Date().getFullYear()} LASAK EDU. All rights reserved.`,
                tagline: 'Empowering careers through quality education and industry-standard training since 2012.'
            }
        }
    },
    {
        id: 'nav_menu',
        data: {
            key: 'nav_menu',
            value: {
                items: [
                    { label: 'Home', path: '/' },
                    { label: 'Workshops', path: '/programs' },
                    {
                        label: 'Courses',
                        path: '/courses',
                        submenu: [
                            { label: 'CSE / IT', path: '/courses/IT' },
                            { label: 'Mechanical', path: '/courses/Mechanical' },
                            { label: 'Civil', path: '/courses/Civil' },
                            { label: 'Arts', path: '/courses/Arts' },
                            { label: 'Kids', path: '/courses/Kids' },
                        ]
                    },
                    { label: 'Overseas Education', path: 'https://lasak.edumilestones.com/', external: true },
                    { label: 'Blog', path: '/blog' },
                    { label: 'News', path: '/news' },
                    { label: 'About', path: '/about' },
                    { label: 'Contact', path: '/contact' }
                ]
            }
        }
    },
    {
        id: 'footer_quick_links',
        data: {
            key: 'footer_quick_links',
            value: {
                items: [
                    { label: 'Home', path: '/' },
                    { label: 'Courses', path: '/courses' },
                    { label: 'Workshops', path: '/programs' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'News', path: '/news' },
                    { label: 'About Us', path: '/about' },
                    { label: 'Contact Us', path: '/contact' }
                ]
            }
        }
    },
    {
        id: 'footer_departments',
        data: {
            key: 'footer_departments',
            value: {
                items: [
                    { label: 'CSE / IT Training', path: '/courses/IT' },
                    { label: 'Mechanical Design', path: '/courses/Mechanical' },
                    { label: 'Civil & Arch', path: '/courses/Civil' },
                    { label: 'Arts', path: '/courses/Arts' },
                    { label: 'Kids Robotics', path: '/courses/Kids' }
                ]
            }
        }
    },
    {
        id: 'footer_policy_links',
        data: {
            key: 'footer_policy_links',
            value: {
                items: [
                    { label: 'Privacy Policy', path: '/privacy-policy' },
                    { label: 'Terms & Conditions', path: '/terms-conditions' },
                    { label: 'Refund Policy', path: '/refund-policy' },
                    { label: 'Cancellation Policy', path: '/cancellation-policy' }
                ]
            }
        }
    }
];

const POPUP_CONFIG_DATA = {
    enabled: true,
    interval: 5000,
    form_url: 'https://docs.google.com/forms/d/e/1FAIpQLScL1mo2i4LF9aineii9xi9V-CVntO8xSbk1Qi_5oU_5mpOnvg/viewform',
    title: 'Transform Your Career',
    description: 'Apply for Scholarship today!',
    button_text: 'Apply Now',
    feature_1: 'Free Demo Classes',
    feature_2: '100% Placement Support',
    feature_3: 'ISO Certified Certificate'
};

const POPUP_SLIDES = [
    {
        active: true,
        order_num: 1,
        image_url: '/img/websitebanner1.webp',
        title: 'Special Scholarship Offer!',
        description: 'Get up to 50% discount on all courses.',
        button_text: 'Apply Now',
        clickable: true,
        style: 'standard'
    }
];

async function main() {
    try {
        await signIn('info@lasakedu.in', 'Lasakedu@2026');

        console.log('📡 Seeding Contact Info...');
        for (const contact of CONTACT_INFO) {
            await writeDoc('contact_info', `${contact.type}-${contact.order_num}`, contact);
        }

        console.log('📡 Seeding Site Settings...');
        for (const setting of SITE_SETTINGS) {
            await writeDoc('site_settings', setting.id, setting.data);
        }

        console.log('📡 Seeding Popup Config...');
        await writeDoc('popup_config', 'default', POPUP_CONFIG_DATA);

        console.log('📡 Seeding Popup Slides...');
        for (let i = 0; i < POPUP_SLIDES.length; i++) {
            await writeDoc('popup_slides', `slide-${i + 1}`, POPUP_SLIDES[i]);
        }

        console.log('\n✅ Master configuration seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Seeder failed:', err.message);
        process.exit(1);
    }
}

main();
