import { VercelRequest, VercelResponse } from '@vercel/node';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

// Initialize Firebase Admin only once
if (!getApps().length) {
  try {
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountStr) {
      let serviceAccount;
      try {
        serviceAccount = JSON.parse(serviceAccountStr);
      } catch (e) {
        // If it's base64 encoded
        try {
          const decoded = Buffer.from(serviceAccountStr, 'base64').toString('utf8');
          serviceAccount = JSON.parse(decoded);
        } catch (b64Err) {
          // If it has literal newlines or escaped newlines, normalize them
          try {
            const cleaned = serviceAccountStr.replace(/\\n/g, '\n');
            serviceAccount = JSON.parse(cleaned);
          } catch (cleanErr) {
            throw new Error(`Failed to parse Firebase Service Account JSON string: ${e instanceof Error ? e.message : String(e)}`);
          }
        }
      }

      initializeApp({
        credential: cert(serviceAccount)
      });
      console.log('Firebase Admin initialized successfully in send-notification with Service Account Key');
    } else {
      console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is not defined. Firebase Admin will not be initialized in send-notification api.');
    }
  } catch (error) {
    console.error('Firebase admin initialization error in send-notification:', error);
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
     return res.status(500).json({ error: 'Firebase Admin is not initialized because the FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not defined. Please add FIREBASE_SERVICE_ACCOUNT_KEY under AI Studio Settings (the gear icon on the top) or in your Vercel/environment settings.' });
  }

  try {
    const db = getFirestore();
    const messaging = getMessaging();
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

    const response = await messaging.sendEachForMulticast(message);
    
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
