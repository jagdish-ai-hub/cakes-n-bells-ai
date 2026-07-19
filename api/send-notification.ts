import { VercelRequest, VercelResponse } from '@vercel/node';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

// Initialize Firebase Admin only once
if (!getApps().length) {
  try {
    // You will need to put your Firebase Service Account JSON string in this Vercel environment variable
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

  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required' });
  }

  // Ensure Firebase was initialized properly
  if (!getApps().length) {
     return res.status(500).json({ error: 'Firebase Admin not configured. Set FIREBASE_SERVICE_ACCOUNT_KEY env var in Vercel.' });
  }

  try {
    const db = getFirestore();
    // Fetch all customer tokens
    const tokensSnapshot = await db.collection('customer_tokens').get();
    
    if (tokensSnapshot.empty) {
      return res.status(200).json({ message: 'No devices registered for notifications.' });
    }

    const tokens: string[] = [];
    tokensSnapshot.forEach((doc: any) => {
      const data = doc.data();
      if (data.token) {
        tokens.push(data.token);
      }
    });

    const message = {
      notification: {
        title,
        body
      },
      tokens
    };

    const response = await getMessaging().sendEachForMulticast(message);
    
    // Optional: Clean up invalid tokens based on response
    const failedTokens: string[] = [];
    if (response.failureCount > 0) {
      response.responses.forEach((resp: any, idx: number) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
        }
      });
      // Delete failedTokens from Firestore to keep the DB clean
      const batch = db.batch();
      failedTokens.forEach(token => {
        batch.delete(db.collection('customer_tokens').doc(token));
      });
      await batch.commit();
    }

    return res.status(200).json({ 
      success: true, 
      sent: response.successCount, 
      failed: response.failureCount 
    });

  } catch (error) {
    console.error('Error sending push notification:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
