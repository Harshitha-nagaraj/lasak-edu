/**
 * Seed default scholarship rules for all categories into Firestore
 * Run: node scripts/seed-scholarships.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import https from 'https';

const __dir = dirname(fileURLToPath(import.meta.url));
const envFile = resolve(__dir, '../.env.local');
const envText = readFileSync(envFile, 'utf8');
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

function httpsRequest(options, body) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (c) => (data += c));
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
                catch { resolve({ status: res.statusCode, body: data }); }
            });
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

async function signIn(email, password) {
    const body = JSON.stringify({ email, password, returnSecureToken: true });
    const res = await httpsRequest({
        hostname: 'identitytoolkit.googleapis.com',
        path: `/v1/accounts:signInWithPassword?key=${API_KEY}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, body);
    if (res.status !== 200) throw new Error('Auth failed: ' + JSON.stringify(res.body));
    console.log(`🔐 Signed in as ${email}`);
    return res.body.idToken;
}

function toVal(v) {
    if (v === null || v === undefined) return { nullValue: null };
    if (typeof v === 'boolean') return { booleanValue: v };
    if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: v } : { doubleValue: v };
    if (typeof v === 'string') return { stringValue: v };
    if (Array.isArray(v)) return { arrayValue: { values: v.map(toVal) } };
    if (typeof v === 'object') {
        const fields = {};
        for (const [k, val] of Object.entries(v)) fields[k] = toVal(val);
        return { mapValue: { fields } };
    }
    return { stringValue: String(v) };
}

async function addDoc(token, collection, data) {
    const body = JSON.stringify({ fields: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, toVal(v)])) });
    const res = await httpsRequest({
        hostname: 'firestore.googleapis.com',
        path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}?key=${API_KEY}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
            'Authorization': `Bearer ${token}`,
        },
    }, body);
    if (res.status >= 300) throw new Error(`Add failed: ${JSON.stringify(res.body)}`);
    return res.body;
}

// Same default rules as in ScholarshipManager.tsx handleSeedCategoryRules
const CATEGORIES = ['All', 'IT', 'Mechanical', 'Civil', 'Arts', 'Kids'];

function buildRulesForCategory(category) {
    const label = category === 'All' ? 'Global' : category;
    return [
        { name: `${label} - Distinction Excellence`, min_percentage: 90, max_percentage: 100, discount_type: 'percentage', discount_value: 30, is_active: true, priority: 1, category, save_rule: '' },
        { name: `${label} - First Class Merit`, min_percentage: 75, max_percentage: 89, discount_type: 'percentage', discount_value: 20, is_active: true, priority: 2, category, save_rule: '' },
        { name: `${label} - Second Class Achievement`, min_percentage: 60, max_percentage: 74, discount_type: 'percentage', discount_value: 10, is_active: true, priority: 3, category, save_rule: '' },
        { name: `${label} - Encouragement Grant`, min_percentage: 50, max_percentage: 59, discount_type: 'fixed', discount_value: 1000, is_active: true, priority: 4, category, save_rule: '' },
    ];
}

async function main() {
    console.log('\n🎓 Seeding Scholarship Rules — LasakEdu');
    console.log(`📂 Project: ${PROJECT_ID}`);
    console.log('─'.repeat(40));

    const token = await signIn('info@lasakedu.in', 'Lasakedu@2026');

    let total = 0;
    for (const category of CATEGORIES) {
        const rules = buildRulesForCategory(category);
        for (const rule of rules) {
            await addDoc(token, 'scholarship_rules', rule);
            total++;
        }
        console.log(`  ✅ ${category === 'All' ? 'Global Rules' : category + ' Category'} — 4 rules added`);
    }

    console.log(`\n🎉 Done! ${total} scholarship rules seeded across ${CATEGORIES.length} categories.`);
    process.exit(0);
}

main().catch((err) => {
    console.error('\n❌ Failed:', err.message);
    process.exit(1);
});
