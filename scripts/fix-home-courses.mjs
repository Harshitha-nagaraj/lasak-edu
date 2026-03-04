/**
 * Fix home page courses visibility
 * Run: node scripts/fix-home-courses.mjs
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
}

async function updateDoc(collectionName, docId, fieldsToUpdate) {
    const url = `${BASE_URL}/${collectionName}/${docId}?updateMask.fieldPaths=${Object.keys(fieldsToUpdate).join('&updateMask.fieldPaths=')}&key=${API_KEY}`;

    // Convert to Firestore REST format
    const fields = {};
    for (const [key, value] of Object.entries(fieldsToUpdate)) {
        if (typeof value === 'boolean') fields[key] = { booleanValue: value };
        else if (typeof value === 'string') fields[key] = { stringValue: value };
    }

    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ID_TOKEN}`
        },
        body: JSON.stringify({ fields }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to update ${docId}: ${err}`);
    }
}

async function fix() {
    try {
        await signIn('info@lasakedu.in', 'Lasakedu@2026');
        console.log("📡 Setting 'show_on_home' to true for SolidWorks Masterclass (mech2)...");
        await updateDoc('courses', 'mech2', { show_on_home: true });
        console.log("✅ Update complete!");
    } catch (err) {
        console.error("❌ Error:", err.message);
    }
}

fix();
