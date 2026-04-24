/**
 * Restore/re-seed testimonials in Firestore
 * Run: node scripts/restore_testimonials.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const envText = readFileSync(resolve(__dir, '../.env.local'), 'utf8');
const env = {};
for (const line of envText.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
}

const API_KEY = env.VITE_FIREBASE_API_KEY;
const PROJECT_ID = env.VITE_FIREBASE_PROJECT_ID;

async function signIn(email, password) {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`Auth failed: ${data.error?.message}`);
    console.log(`🔐 Signed in`);
    return data.idToken;
}

function toVal(v) {
    if (v === null || v === undefined) return { nullValue: null };
    if (typeof v === 'boolean') return { booleanValue: v };
    if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: `${v}` } : { doubleValue: v };
    if (typeof v === 'string') return { stringValue: v };
    if (v instanceof Date) return { timestampValue: v.toISOString() };
    if (Array.isArray(v)) return { arrayValue: { values: v.map(toVal) } };
    if (typeof v === 'object') {
        const fields = {};
        for (const [k, val] of Object.entries(v)) fields[k] = toVal(val);
        return { mapValue: { fields } };
    }
    return { stringValue: String(v) };
}

async function writeDoc(token, collection, docId, data) {
    const fields = {};
    for (const [k, v] of Object.entries(data)) fields[k] = toVal(v);
    const res = await fetch(
        `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${docId}?key=${API_KEY}`,
        {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ fields })
        }
    );
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to write ${collection}/${docId}: ${err}`);
    }
}

// ── Full testimonials data with all fields ──
const TESTIMONIALS = [
    { id: 'vishnu-lakshmi', name: 'Vishnu Lakshmi', company: 'LMW - COIMBATORE', role: 'Design Engineer', image: '/img/vishnu lakshmi s.webp', quote: 'Proud to start my career with a great opportunity. LASAK EDU gave me the skills and confidence to land this role.', package: '7 LPA', rating: 5 },
    { id: 'ashok-g', name: 'Ashok G', company: 'CADOPT', role: 'Design Engineer', image: '/img/ASHOK G.webp', quote: 'Happy to begin my journey as a Design Engineer. The hands-on training at LASAK EDU was truly industry-oriented.', package: '3.5 LPA', rating: 5 },
    { id: 'saravana-kumar-r', name: 'Saravana Kumar R', company: 'CADOPT', role: 'Design Engineer', image: '/img/saravana kumar r.webp', quote: 'Great learning experience that shaped my career. I am grateful for the placement support and training quality.', package: '3 LPA', rating: 5 },
    { id: 'chandraleka-gk', name: 'ChandraLeka G.K.', company: 'CADOPT', role: 'Design Engineer', image: '/img/Ms.CHANDRALEKA_K.webp', quote: 'Achieving this milestone feels amazing. LASAK EDU\'s guidance made all the difference in my career journey.', package: '3.2 LPA', rating: 5 },
    { id: 'dharsan-v', name: 'Dharsan V', company: 'DESIGNTECH', role: 'Design Engineer', image: '/img/Mr. DHARSAN V.webp', quote: 'Excited to start my professional journey. The practical exposure I got here was beyond my expectations.', package: '3.5 LPA', rating: 5 },
    { id: 'lokkesh-v', name: 'Lokkesh V', company: 'CADOpt', role: 'Design Engineer', image: '/img/Mr. LOKKESH V.webp', quote: 'Grateful for this rewarding job opportunity. LASAK EDU\'s placement cell worked tirelessly to help students.', package: '3.7 LPA', rating: 5 },
    { id: 'surya-m', name: 'Surya M', company: 'CADOpt', role: 'Design Engineer', image: '/img/Mr. SURYA M.webp', quote: 'Happy to start my professional journey with CADOpt. The curriculum at LASAK EDU is perfectly aligned with industry needs.', package: '3.2 LPA', rating: 5 },
    { id: 'ruthresh-v', name: 'Ruthresh V', company: 'MEKNO EOT Crane', role: 'Design Engineer', image: '/img/Mr. RUTHRESH V.webp', quote: 'Proud to begin my engineering career. Practical labs and project work at LASAK EDU built my real-world confidence.', package: '2.7 LPA', rating: 5 },
    { id: 'syed-sharukh', name: 'Syed Sharukh', company: 'JACK GROUPS', role: 'Design Engineer', image: '/img/Mr. Syed Sharukh.webp', quote: 'Excited to join JACK Groups. The mentorship and career guidance at LASAK EDU helped me prepare for interviews.', package: '3.2 LPA', rating: 5 },
    { id: 'anish-joseph-c', name: 'Anish Joseph C', company: 'JACK GROUPS', role: 'Design Engineer', image: '/img/Mr. ANISH JOSEPH C.jpeg', quote: 'Grateful to begin my journey at JACK Groups. LASAK EDU\'s structured training approach truly prepared me for this role.', package: '3.2 LPA', rating: 5 },
];

async function main() {
    console.log('\n👥 Restoring testimonials in Firestore...');
    console.log(`📂 Project: ${PROJECT_ID}`);
    console.log('─'.repeat(50));

    const token = await signIn('info@lasakedu.in', 'Lasakedu@2026');
    let ok = 0, fail = 0;

    for (const t of TESTIMONIALS) {
        const { id, ...data } = t;
        try {
            await writeDoc(token, 'testimonials', id, {
                ...data,
                // Store both field names for compatibility
                content: data.quote,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
            console.log(`  ✅ ${t.name} — ${t.company} (${t.package})`);
            ok++;
        } catch (err) {
            console.log(`  ❌ ${t.name}: ${err.message.slice(0, 60)}`);
            fail++;
        }
    }

    console.log('\n' + '─'.repeat(50));
    console.log(`✅ Restored: ${ok} testimonials`);
    if (fail > 0) console.log(`❌ Failed: ${fail}`);
    console.log('🎉 Done! Refresh the home page to verify.');
    process.exit(0);
}

main().catch(err => { console.error('\n❌ Fatal:', err.message); process.exit(1); });
