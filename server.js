import express from 'express';
import webpush from 'web-push';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// VAPID keys for Web Push
const PUBLIC_VAPID_KEY = 'BK9homfUFtlgX6nhatmHlO0mvckJn2rnfuPhc95kXXR30LluBIoL2LMpdBMU0i148PE6_kYaFbIG45LhC4ddk_M';
const PRIVATE_VAPID_KEY = 'ezKmH4qV_YyLxKFDA_u6eqkHlhznqpNwHk9-p7QzBkc';

webpush.setVapidDetails(
  'mailto:saeed@saeed.sbs',
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
);

// In-memory store for subscriptions (fine for a single-user personal app)
// In a real app, this would be in a database (e.g. SQLite, Postgres, Redis)
let subscriptions = [];

app.post('/api/subscribe', (req, res) => {
  const subscription = req.body;
  
  // Basic check to avoid duplicates in memory
  const exists = subscriptions.find(s => s.endpoint === subscription.endpoint);
  if (!exists) {
    subscriptions.push(subscription);
    console.log('New subscription added. Total:', subscriptions.length);
  }
  
  res.status(201).json({ success: true });
});

// Spam loop: Runs every 5 minutes and pushes to all subscribers
setInterval(() => {
  console.log(`[Push Loop] Checking ${subscriptions.length} subscriptions...`);
  const payload = JSON.stringify({
    title: 'SAEED PROTOCOL ALERT',
    body: "DRINK WATER. DROP AND DO PUSHUPS. IS WHAT YOU'RE DOING RIGHT NOW WORTH THE REWARD?",
    icon: '/vite.svg'
  });

  const validSubscriptions = [];
  
  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, payload).then(() => {
      validSubscriptions.push(sub);
    }).catch(err => {
      console.error('Error sending notification, subscription might be expired/invalid.', err);
    });
  });

  // Keep only valid ones (this cleans up expired ones eventually, though it's asynchronous here)
  // For simplicity, we just log errors.
}, 5 * 60 * 1000); // 5 minutes

// Serve the Vite static build
app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
  console.log('VAPID keys loaded, Push Service initialized.');
});
