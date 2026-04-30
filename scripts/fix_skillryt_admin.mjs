// Fix Skillryt LMS Portal -> Lasak LMS Portal using Firebase Admin SDK
// Uses application default credentials via firebase-admin

import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Try application default credentials (works if logged in via firebase CLI or gcloud)
let app;
try {
  app = initializeApp({
    credential: applicationDefault(),
    projectId: 'lasak-edu',
  });
} catch (err) {
  console.error('Could not use application default credentials:', err.message);
  process.exit(1);
}

const db = getFirestore(app);

async function fixSkillrytTitle() {
  console.log('Fetching learning_ecosystem collection from Firestore...');
  const snapshot = await db.collection('learning_ecosystem').get();
  
  console.log(`Found ${snapshot.docs.length} document(s).`);
  
  let fixed = 0;
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    console.log(`  - Doc ID: ${docSnap.id} | Title: "${data.title}"`);
    
    if (data.title && data.title.toLowerCase().includes('skillryt')) {
      const newTitle = data.title.replace(/skillryt/gi, 'Lasak');
      console.log(`  ✅ FIXING: "${data.title}" → "${newTitle}"`);
      await docSnap.ref.update({ title: newTitle });
      fixed++;
    }
  }
  
  if (fixed === 0) {
    console.log('\n⚠️  No documents with "Skillryt" found in title.');
    console.log('Listing all document titles:');
    snapshot.docs.forEach(d => console.log(`  - "${d.data().title}"`));
  } else {
    console.log(`\n✅ Fixed ${fixed} document(s) in Firestore!`);
  }
  
  process.exit(0);
}

fixSkillrytTitle().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
