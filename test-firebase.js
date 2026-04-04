// Test Firebase connection
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Test with environment variables
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n").replace(/"/g, ""),
};

console.log('Testing Firebase connection...');
console.log('Project ID:', serviceAccount.projectId);
console.log('Client Email:', serviceAccount.clientEmail);
console.log('Private Key length:', serviceAccount.privateKey.length);

try {
  initializeApp({
    credential: cert(serviceAccount),
  });
  
  const db = getFirestore();
  console.log('✅ Firebase initialized successfully');
  
  // Test connection
  db.collection('testimonials').limit(1).get()
    .then(snapshot => {
      console.log('✅ Firestore connection successful!');
      console.log(`Found ${snapshot.docs.length} documents`);
    })
    .catch(error => {
      console.log('❌ Firestore connection failed:', error.message);
    });
    
} catch (error) {
  console.log('❌ Firebase initialization failed:', error.message);
}
