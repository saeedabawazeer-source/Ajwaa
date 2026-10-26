import express from 'express';
import webpush from 'web-push';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Local convenience: `npm start` picks up .env.local so the AI proxy works
// outside Railway. On Railway the platform injects real env vars instead.
try {
  const envFile = path.join(__dirname, '.env.local');
  if (fs.existsSync(envFile)) {
    for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  }
} catch { /* no env file — fine */ }

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

// ─── AI PROXY ───
// Holds the model key server-side so it never ships inside the client bundle.
// Railway env vars: AI_API_KEY (required), AI_BASE_URL / AI_MODEL_* (optional).
const AI_BASE = (process.env.AI_BASE_URL || 'https://api.cline.bot/api/v1').replace(/\/+$/, '');
const AI_MODELS = {
  chat: process.env.AI_MODEL_CHAT || 'cline-pass/glm-5.3-flash',
  vision: process.env.AI_MODEL_VISION || 'google/gemini-3.8-flash',
  plan: process.env.AI_MODEL_PLAN || 'cline-pass/kimi-k3',
};

app.post('/api/ai', async (req, res) => {
  const key = (process.env.AI_API_KEY || process.env.VITE_AI_API_KEY || '').trim();
  if (!key) {
    return res.status(400).json({ error: { code: 'no_key', message: 'AI_API_KEY is not set on the server' } });
  }

  const { task = 'chat', system = '', messages = [], maxTokens = 1500, temperature = 0.6 } = req.body || {};
  const model = AI_MODELS[task] || AI_MODELS.chat;

  try {
    const upstream = await fetch(`${AI_BASE}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: system }, ...messages],
        max_tokens: maxTokens,
        temperature,
      }),
    });

    const raw = await upstream.text();
    if (!upstream.ok) {
      let code = 'api_error';
      if (upstream.status === 401 || upstream.status === 403) code = 'invalid_key';
      else if (upstream.status === 402 || raw.includes('insufficient_credits')) code = 'no_credits';
      else if (upstream.status === 429) code = 'rate_limited';
      else if (upstream.status === 404) code = 'bad_model';
      console.error(`[AI] ${upstream.status} ${code}: ${raw.slice(0, 200)}`);
      return res.status(upstream.status).json({ error: { code, message: raw.slice(0, 300) } });
    }

    const parsed = JSON.parse(raw);
    // The Cline gateway wraps OpenAI-shaped payloads in { data: {...} }.
    const payload = parsed?.data?.choices ? parsed.data : parsed;
    const text = payload.choices?.[0]?.message?.content || '';
    if (!text.trim()) {
      console.error('[AI] empty reply from', model, JSON.stringify(parsed).slice(0, 200));
      return res.status(502).json({ error: { code: 'empty_reply', message: 'Model returned no text' } });
    }
    res.json({ text });
  } catch (err) {
    console.error('[AI] proxy error:', err.message);
    res.status(502).json({ error: { code: 'network', message: err.message } });
  }
});

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
