/**
 * Cleanup hero_slides collection - remove all entries
 * Run: node scripts/cleanup-hero.mjs
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

async function listDocs(collectionName) {
    const url = `${BASE_URL}/${collectionName}?key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.documents) return [];
    return data.documents.map(d => {
        const parts = d.name.split('/');
        return parts[parts.length - 1];
    });
}

async function deleteDoc(collectionName, docId) {
    const url = `${BASE_URL}/${collectionName}/${docId}?key=${API_KEY}`;
    const res = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${ID_TOKEN}`
        }
    });
    if (!res.ok) {
        const err = await res.text();
        console.error(`❌ Failed to delete ${docId}: ${err}`);
    } else {
        console.log(`🗑️ Deleted: ${docId}`);
    }
}

async function cleanup() {
    try {
        await signIn('info@lasakedu.in', 'Lasakedu@2026');
        console.log("📡 Fetching documents from 'hero_slides' collection...");
        const ids = await listDocs('hero_slides');
        console.log(`Found ${ids.length} documents.`);

        for (const id of ids) {
            await deleteDoc('hero_slides', id);
        }

        console.log("✨ Hero slides cleared!");
    } catch (err) {
        console.error("❌ Cleanup failed:", err.message);
    }
}

cleanup();
