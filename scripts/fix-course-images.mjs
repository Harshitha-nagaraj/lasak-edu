/**
 * Fix Course Image Paths in Firestore
 * Run: node scripts/fix-course-images.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import https from 'https';

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

function httpsReq(options, body) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
                catch { resolve({ status: res.statusCode, body: d }); }
            });
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

async function signIn(email, password) {
    const body = JSON.stringify({ email, password, returnSecureToken: true });
    const res = await httpsReq({
        hostname: 'identitytoolkit.googleapis.com',
        path: `/v1/accounts:signInWithPassword?key=${API_KEY}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, body);
    if (res.status !== 200) throw new Error('Auth failed: ' + JSON.stringify(res.body));
    console.log('🔐 Signed in as admin');
    return res.body.idToken;
}

function toVal(v) {
    if (v === null || v === undefined) return { nullValue: null };
    if (typeof v === 'boolean') return { booleanValue: v };
    if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: v } : { doubleValue: v };
    if (typeof v === 'string') return { stringValue: v };
    if (Array.isArray(v)) return { arrayValue: { values: v.map(toVal) } };
    if (typeof v === 'object') {
        const f = {};
        for (const [k, val] of Object.entries(v)) f[k] = toVal(val);
        return { mapValue: { fields: f } };
    }
    return { stringValue: String(v) };
}

async function patchDoc(token, docId, data) {
    const body = JSON.stringify({
        fields: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, toVal(v)]))
    });
    const res = await httpsReq({
        hostname: 'firestore.googleapis.com',
        path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents/courses/${encodeURIComponent(docId)}?key=${API_KEY}`,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
            'Authorization': `Bearer ${token}`
        }
    }, body);
    if (res.status >= 300) throw new Error(`Patch ${docId}: ${JSON.stringify(res.body)}`);
}

// ── Correct image paths — exact filenames on disk (all lowercase) ──
const IMAGE_FIXES = [
    // MECHANICAL — /img/mech/
    { id: 'mech1', image: '/img/mech/autocad.webp' },
    { id: 'mech2', image: '/img/mech/solidworks-408z.webp' },
    { id: 'mech3', image: '/img/mech/creo-688z.webp' },
    { id: 'mech4', image: '/img/mech/catia-118z.webp' },
    { id: 'mech5', image: '/img/mech/ansys-670z.webp' },
    { id: 'mech6', image: '/img/mech/hypermesh-631z.webp' },
    { id: 'mech7', image: '/img/mech/ansa-062z.webp' },
    { id: 'mech8', image: '/img/mech/nxcad-582z.webp' },
    { id: 'mech9', image: '/img/mech/autodesk-inventor-783z.webp' },
    { id: 'mech10', image: '/img/mech/wiring-harness-catia-256z.webp' },
    { id: 'mech11', image: '/img/mech/cfd-486z.webp' },
    { id: 'mech12', image: '/img/mech/3d-399z.webp' },

    // IT — /img/it/
    { id: 'it1', image: '/img/it/full-stack-development-171z.webp' },
    { id: 'it2', image: '/img/it/python-267z.webp' },
    { id: 'it3', image: '/img/it/da-013z.webp' },
    { id: 'it4', image: '/img/it/java-747z.webp' },
    { id: 'it5', image: '/img/it/st-291z.webp' },
    { id: 'it6', image: '/img/it/digital-marketing-875z.webp' },
    { id: 'it7', image: '/img/it/programming-979z.webp' },
    { id: 'it8', image: '/img/it/web-development-387z.webp' },
    { id: 'it9', image: '/img/it/ui-514z.webp' },
];

async function main() {
    console.log('\n🖼️  Course Image Fixer — LasakEdu');
    console.log(`📂 Project: ${PROJECT_ID}`);
    console.log('─'.repeat(50));

    const token = await signIn('info@lasakedu.in', 'Lasakedu@2026');
    let count = 0;
    let errors = 0;

    for (const fix of IMAGE_FIXES) {
        try {
            await patchDoc(token, fix.id, { image: fix.image });
            count++;
            console.log(`  ✅ ${fix.id} → ${fix.image}`);
        } catch (err) {
            errors++;
            console.log(`  ⚠️  ${fix.id} → SKIP (${err.message.slice(0, 80)})`);
        }
    }

    console.log('\n' + '─'.repeat(50));
    console.log(`✅ ${count} images updated in Firestore`);
    if (errors > 0) console.log(`⚠️  ${errors} skipped (doc may not exist)`);
    console.log('🎉 Done! Refresh lasakedu.in/admin/courses to see the updated images.');
    process.exit(0);
}

main().catch(err => { console.error('\n❌', err.message); process.exit(1); });
