import { readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

// Read Firebase CLI stored tokens
const configPath = join(homedir(), '.config', 'configstore', 'firebase-tools.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));
const accessToken = config.tokens.access_token;
const refreshToken = config.tokens.refresh_token;

const PROJECT_ID = 'lasak-edu';
const COLLECTION = 'learning_ecosystem';

async function refreshAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com',
      client_secret: 'j9iVZfS8ggCygSdoJUZ0',
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    })
  });
  const data = await res.json();
  return data.access_token;
}

async function listDocuments(token) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}?pageSize=50`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to list documents: ${res.status} ${err}`);
  }
  return res.json();
}

async function updateDocument(token, docName, fields) {
  const fieldMask = Object.keys(fields).map(f => `updateMask.fieldPaths=${f}`).join('&');
  const url = `https://firestore.googleapis.com/v1/${docName}?${fieldMask}`;
  
  const firestoreFields = {};
  for (const [key, value] of Object.entries(fields)) {
    firestoreFields[key] = { stringValue: value };
  }
  
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields: firestoreFields })
  });
  
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to update document: ${res.status} ${err}`);
  }
  return res.json();
}

async function main() {
  console.log('Getting fresh access token...');
  let token;
  try {
    token = await refreshAccessToken();
    console.log('✅ Got fresh token.');
  } catch (err) {
    console.log('Using existing token...');
    token = accessToken;
  }
  
  console.log('\nFetching learning_ecosystem documents...');
  const data = await listDocuments(token);
  
  if (!data.documents || data.documents.length === 0) {
    console.log('⚠️  No documents found in learning_ecosystem collection.');
    return;
  }
  
  console.log(`Found ${data.documents.length} document(s).\n`);
  
  let fixed = 0;
  for (const doc of data.documents) {
    const title = doc.fields?.title?.stringValue || '';
    const docName = doc.name; // Full resource name
    const docId = docName.split('/').pop();
    
    console.log(`  Doc ID: ${docId} | Title: "${title}"`);
    
    if (title.toLowerCase().includes('skillryt')) {
      const newTitle = title.replace(/skillryt/gi, 'Lasak');
      console.log(`  → FIXING to: "${newTitle}"`);
      await updateDocument(token, docName, { title: newTitle });
      console.log(`  ✅ Updated!`);
      fixed++;
    }
  }
  
  console.log(`\n${fixed > 0 ? `✅ Fixed ${fixed} document(s)!` : '⚠️  No Skillryt titles found — database may already be correct.'}`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
