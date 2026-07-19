import { VercelRequest, VercelResponse } from '@vercel/node';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin only once
if (!getApps().length) {
  try {
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountStr) {
      const serviceAccount = JSON.parse(serviceAccountStr);
      initializeApp({
        credential: cert(serviceAccount)
      });
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Ensure Firebase was initialized properly
  if (!getApps().length) {
     return res.status(500).json({ error: 'Firebase Admin not configured. Set FIREBASE_SERVICE_ACCOUNT_KEY env var in Vercel.' });
  }

  try {
    const db = getFirestore();
    const auth = getAuth();
    
    // Create user in Firebase Auth if password is provided
    if (password) {
      try {
        await auth.createUser({
          email: email,
          password: password,
        });
      } catch (authErr: any) {
        // If user already exists, that might be fine (e.g. they signed in with Google before)
        if (authErr.code !== 'auth/email-already-exists') {
          throw authErr;
        }
      }
    }

    // Add to Firestore admins collection
    await db.collection('admins').doc(email.trim().toLowerCase()).set({
      email: email.trim().toLowerCase(),
      addedAt: new Date().toISOString()
    });

    return res.status(200).json({ success: true, message: 'Admin created successfully' });

  } catch (error: any) {
    console.error('Error creating admin:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
