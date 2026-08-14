import express from "express";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import path from "path";
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // Initialize Firebase Admin only once
  try {
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!getApps().length) {
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
        console.log('Firebase Admin initialized successfully in server.ts with Service Account Key');
      } else {
        console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is not defined. Firebase Admin will not be initialized on dev server.');
      }
    }
  } catch (error) {
    console.error('Firebase admin initialization error in server.ts:', error);
  }

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Server-side Automated WhatsApp API Hook
  // Can be configured with external API providers like Twilio for 100% server-automated orders
  app.post("/api/send-whatsapp", async (req, res) => {
    const { orderDetails, customerDetails } = req.body;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886"; // Default Twilio Sandbox number
    const toWhatsApp = process.env.ADMIN_WHATSAPP_NUMBER;

    if (!orderDetails || !customerDetails) {
      return res.status(400).json({ error: "Missing orderDetails or customerDetails" });
    }

    const messageBody = `*NEW ORDER CONFIRMED AUTOMATICALLY!*

*Customer:* ${customerDetails.fullName} (${customerDetails.mobile})
*Address:* ${customerDetails.address}, ${customerDetails.pincode}
*Product:* ${orderDetails.name} (Qty: ${orderDetails.quantity}, ${orderDetails.weight})
*Total Amount:* ₹${orderDetails.totalPrice}
*Payment Method:* ${customerDetails.paymentMethod}`;

    if (!accountSid || !authToken || !toWhatsApp) {
      console.warn("Automated server WhatsApp is not fully configured. Missing TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or ADMIN_WHATSAPP_NUMBER.");
      return res.status(200).json({
        success: false,
        message: "Automated server API received, but credentials are not set. Falling back to secure client redirection.",
        simulatedMessage: messageBody
      });
    }

    try {
      // Dynamic import to prevent crash if not installed, or use standard fetch
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: "POST",
        headers: {
          "Authorization": "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          From: fromWhatsApp,
          To: `whatsapp:${toWhatsApp.replace(/\D/g, "")}`,
          Body: messageBody
        })
      });

      const data = await response.json();
      if (response.ok) {
        return res.status(200).json({ success: true, messageId: data.sid });
      } else {
        throw new Error(data.message || "Failed to send via Twilio API");
      }
    } catch (error: any) {
      console.error("Error sending automated WhatsApp via server API:", error);
      return res.status(500).json({ error: error.message || "Failed to send automated message" });
    }
  });

  app.post("/api/create-admin", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!getApps().length) {
      return res.status(500).json({ 
        error: 'Firebase Admin is not initialized because the FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not defined. Please add FIREBASE_SERVICE_ACCOUNT_KEY under AI Studio Settings (the gear icon on the top) -> Environment Variables with your Firebase Service Account JSON string as the value.' 
      });
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
          // If user already exists, that might be fine
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
      console.error('Error creating admin in server route:', error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // WebSocket Server
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // If it's a broadcast message from admin, send to all clients
        if (data.type === 'BROADCAST_NOTIFICATION') {
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'NOTIFICATION',
                title: data.title || 'New Message',
                body: data.body
              }));
            }
          });
        }
      } catch (err) {
        console.error('Error processing message:', err);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
}

startServer();
