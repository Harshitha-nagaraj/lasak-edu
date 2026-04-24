/**
 * About Content Seeder for LasakEdu
 * Run: node scripts/seed-about-content.mjs
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

async function seedAboutContent() {
    try {
        await signIn('info@lasakedu.in', 'Lasakedu@2026');

        const aboutData = [
            {
                section: 'mission',
                content: {
                    title: 'Our Mission',
                    description: 'To empower individuals with practical, industry-aligned skills that bridge the gap between education and employment.',
                    image: '/img/about1.webp'
                },
                order_num: 1
            },
            {
                section: 'vision',
                content: {
                    title: 'Our Vision',
                    description: 'To be the leading Skill Development Center globally, recognized for excellence in technical training and career transformation.',
                    image: '/img/about4.webp'
                },
                order_num: 2
            },
            {
                section: 'journey',
                content: {
                    title: 'Our Journey',
                    description: "LASAK EDU (Lasak Overseas Education, and Lasak Technologies) was founded in 2019 by Sharan Gautham Sakthivel, BE, MBA. With over five years of expertise in both education and industry, we specialize in delivering high-quality training in IT and Mechanical Engineering domains.\n\nAt LASAK EDU, we aim to empower students with career-oriented courses and industry-relevant training programs. Our programs are designed to equip learners with the skills and confidence needed to explore opportunities, achieve their career goals, and become valuable resources in the global workforce.",
                    image: '/img/journyabout.webp'
                },
                order_num: 3
            },
            {
                section: 'core_values',
                content: {
                    title: 'Our Core Values',
                    items: [
                        { icon: 'CheckCircle', title: 'Quality', text: 'We never compromise on training quality.' },
                        { icon: 'Clock', title: 'Discipline', text: 'We value time and professionalism.' },
                        { icon: 'Heart', title: 'Support', text: 'We support students even after courses.' },
                        { icon: 'Users', title: 'Ethics', text: 'Transparent and honest guidance.' }
                    ]
                },
                order_num: 4
            },
            {
                section: 'why_choose_us',
                content: {
                    title: 'Why Choose Us?',
                    subtitle: 'Simple reasons to start your learning journey with us.',
                    items: [
                        { title: 'Practical Learning', desc: 'We focus on hands-on training, not just theory.' },
                        { title: 'Experienced Faculty', desc: 'Learn from trainers who have worked in the industry.' },
                        { title: 'Placement Support', desc: 'We help you prepare for interviews and find jobs.' },
                        { title: 'Affordable Fees', desc: 'Quality education at reasonable prices for everyone.' },
                        { title: 'Updated Syllabus', desc: 'We teach what companies are looking for today.' },
                        { title: 'Personal Attention', desc: 'Small batch sizes to ensure every student learns well.' }
                    ]
                },
                order_num: 5
            }
        ];

        console.log(`\n🚀 Seeding ${aboutData.length} About Content items...`);

        for (const item of aboutData) {
            const url = `${BASE_URL}/about_content/${item.section}?key=${API_KEY}`;
            const docFields = {};
            for (const [k, v] of Object.entries(item)) {
                docFields[k] = toFirestoreValue(v);
            }
            docFields.updated_at = toFirestoreValue(new Date());

            const headers = { 'Content-Type': 'application/json' };
            if (ID_TOKEN) headers['Authorization'] = `Bearer ${ID_TOKEN}`;

            const res = await fetch(url, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ fields: docFields })
            });

            if (res.ok) {
                console.log(`✅ Seeded: ${item.section}`);
            } else {
                const error = await res.json();
                console.error(`❌ Failed: ${item.section}`, JSON.stringify(error));
            }
        }

        console.log('\n✨ About Content Seeding Complete!');
    } catch (err) {
        console.error('\n❌ Seeding failed:', err.message);
    }
}

seedAboutContent();
