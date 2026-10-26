// ─── AI PROVIDER ───
// One transport for every AI feature in the app. The key is read from
// .env.local (VITE_AI_*) with a localStorage override so a new key can be
// pasted at runtime without a rebuild.
//
// Model routing: each task picks the cheapest model that can actually do the
// job — plain chat, photo/vision work, and long-form plan writing.

const ENV_KEY = (import.meta.env.VITE_AI_API_KEY || '').trim();
const ENV_PROVIDER = (import.meta.env.VITE_AI_PROVIDER || '').trim().toLowerCase();
const ENV_BASE = (import.meta.env.VITE_AI_BASE_URL || '').trim();
const ENV_MODELS = {
    chat: (import.meta.env.VITE_AI_MODEL_CHAT || '').trim(),
    vision: (import.meta.env.VITE_AI_MODEL_VISION || '').trim(),
    plan: (import.meta.env.VITE_AI_MODEL_PLAN || '').trim(),
};

export const TASKS = { CHAT: 'chat', VISION: 'vision', PLAN: 'plan' };

// The server (server.js, used by the Railway deploy) can hold the key instead
// of the client. Set VITE_AI_PROXY=off to always call the provider directly.
const PROXY_PATH = '/api/ai';
const USE_PROXY = import.meta.env.VITE_AI_PROXY !== 'off';

const PROVIDERS = {
    // Cline gateway (OpenAI-compatible). Free models keep it running with a $0
    // balance; the paid ones are one env override away.
    cline: {
        base: 'https://api.cline.bot/api/v1', style: 'openai',
        models: {
            chat: 'nvidia/nemotron-3-ultra-550b-a55b:free',
            vision: 'google/gemini-3.8-flash',
            plan: 'anthropic/claude-sonnet-5.5',
        },
    },
    openai: {
        base: 'https://api.openai.com/v1', style: 'openai',
        models: { chat: 'gpt-4o-mini', vision: 'gpt-4o-mini', plan: 'gpt-4o' },
    },
    openrouter: {
        base: 'https://openrouter.ai/api/v1', style: 'openai',
        models: { chat: 'openai/gpt-4o-mini', vision: 'openai/gpt-4o-mini', plan: 'anthropic/claude-sonnet-4.5' },
    },
    deepseek: {
        base: 'https://api.deepseek.com/v1', style: 'openai',
        models: { chat: 'deepseek-chat', vision: 'deepseek-chat', plan: 'deepseek-reasoner' },
    },
    groq: {
        base: 'https://api.groq.com/openai/v1', style: 'openai',
        models: { chat: 'llama-3.3-70b-versatile', vision: 'llama-3.2-11b-vision-preview', plan: 'llama-3.3-70b-versatile' },
    },
    xai: {
        base: 'https://api.x.ai/v1', style: 'openai',
        models: { chat: 'grok-3-mini', vision: 'grok-3-mini', plan: 'grok-3' },
    },
    anthropic: {
        base: 'https://api.anthropic.com/v1', style: 'anthropic',
        models: { chat: 'claude-3-5-haiku-latest', vision: 'claude-3-5-sonnet-latest', plan: 'claude-sonnet-4-5' },
    },
    gemini: {
        base: 'https://generativelanguage.googleapis.com/v1beta', style: 'gemini',
        models: { chat: 'gemini-2.0-flash', vision: 'gemini-2.0-flash', plan: 'gemini-2.5-pro' },
    },
};


// ─── KEY + PROVIDER RESOLUTION ───

export function getAiKey() {
    try {
        return (localStorage.getItem('ai_api_key') || ENV_KEY).trim();
    } catch {
        return ENV_KEY;
    }
}

export function setAiKey(key) {
    try { localStorage.setItem('ai_api_key', (key || '').trim()); } catch { /* ignore */ }
}

export function setAiProvider(id) {
    try { localStorage.setItem('ai_provider', (id || '').trim().toLowerCase()); } catch { /* ignore */ }
}

// Recognisable prefixes. Anything unknown needs VITE_AI_PROVIDER (or setAiProvider).
export function detectProvider(key) {
    if (!key) return '';
    if (key.startsWith('sk-ant-')) return 'anthropic';
    if (key.startsWith('sk-or-v1-')) return 'openrouter';
    if (key.startsWith('gsk_')) return 'groq';
    if (key.startsWith('xai-')) return 'xai';
    if (key.startsWith('AIza')) return 'gemini';
    // Cline gateway keys: sk_ followed by 64 hex chars.
    if (/^sk_[0-9a-f]{64}$/.test(key)) return 'cline';
    if (key.startsWith('sk-proj-') || key.startsWith('sk-')) return 'openai';
    return '';
}

export function getProviderId() {
    let saved = '';
    try { saved = localStorage.getItem('ai_provider') || ''; } catch { /* ignore */ }
    return (saved || ENV_PROVIDER || detectProvider(getAiKey())).toLowerCase();
}

export function getProvider() {
    const id = getProviderId();
    if (id === 'custom' && ENV_BASE) {
        return { id, base: ENV_BASE, style: 'openai', models: { chat: '', vision: '', plan: '' } };
    }
    return PROVIDERS[id] ? { id, ...PROVIDERS[id] } : null;
}

export function modelFor(task) {
    const provider = getProvider();
    if (!provider) return '';
    return ENV_MODELS[task] || provider.models[task] || provider.models.chat;
}

export function isConfigured() {
    if (getAiKey() && getProvider()) return true;
    return USE_PROXY; // the server proxy may be holding the key
}

export function providerLabel() {
    const provider = getProvider();
    if (provider && getAiKey()) return `${provider.id} · ${modelFor(TASKS.CHAT)}`;
    if (USE_PROXY) return 'server proxy';
    return getAiKey() ? 'unknown provider' : 'not configured';
}

// ─── TRANSPORT ───

function fail(code, detail) {
    const err = new Error(detail || code);
    err.code = code;
    return err;
}

async function readError(res) {
    let detail = '';
    try { detail = (await res.text()).slice(0, 300); } catch { /* ignore */ }
    if (res.status === 401 || res.status === 403) throw fail('invalid_key', detail);
    if (res.status === 402 || detail.includes('insufficient_credits')) throw fail('no_credits', detail);
    if (res.status === 429) throw fail('rate_limited', detail);
    if (res.status === 404) throw fail('bad_model', detail);
    throw fail('api_error', `${res.status} ${detail}`);
}

// The Cline gateway wraps OpenAI-shaped payloads in { data: {...} }; plain
// OpenAI/OpenRouter return them at the top level.
function unwrap(payload) {
    return payload?.data?.choices ? payload.data : payload;
}

async function completeOpenAi(provider, key, { model, system, messages, maxTokens, temperature }) {
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` };
    if (provider.id === 'openrouter') {
        headers['HTTP-Referer'] = typeof location !== 'undefined' ? location.origin : 'https://ajwaa.app';
        headers['X-Title'] = 'Ajwaa';
    }
    const res = await fetch(`${provider.base}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            model,
            messages: [{ role: 'system', content: system }, ...messages],
            max_tokens: maxTokens,
            temperature,
        }),
    });
    if (!res.ok) await readError(res);
    const data = unwrap(await res.json());
    return data.choices?.[0]?.message?.content || '';
}


async function completeAnthropic(provider, key, { model, system, messages, maxTokens, temperature }) {
    const res = await fetch(`${provider.base}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({ model, system, messages, max_tokens: maxTokens, temperature }),
    });
    if (!res.ok) await readError(res);
    const data = await res.json();
    return (data.content || []).map(part => part.text || '').join('');
}

async function completeGemini(provider, key, { model, system, messages, maxTokens, temperature }) {
    const res = await fetch(`${provider.base}/models/${model}:generateContent?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            system_instruction: { parts: [{ text: system }] },
            contents: messages.map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
            })),
            generationConfig: { maxOutputTokens: maxTokens, temperature },
        }),
    });
    if (!res.ok) await readError(res);
    const data = await res.json();
    return (data.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('');
}

// Server-side proxy (used by the Railway deploy) keeps the key out of the bundle.
async function completeViaProxy({ task, system, messages, maxTokens, temperature }) {
    let res;
    try {
        res = await fetch(PROXY_PATH, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task, system, messages, maxTokens, temperature }),
        });
    } catch {
        throw fail('no_proxy', 'No AI proxy reachable');
    }

    let data = null;
    try { data = await res.json(); } catch { data = null; }

    // Our proxy answers with { error: { code } }; anything else is not our proxy.
    if (data?.error) throw fail(data.error.code || 'api_error', data.error.message || '');
    if (!res.ok || !data) throw fail('no_proxy', 'No AI proxy on this host');
    if (!data.text) throw fail('empty_reply', 'Model returned no text');
    return data.text;
}

/**
 * Send one completion request.
 * @param {{task?: string, system: string, messages: Array<{role:string,content:string}>, maxTokens?: number, temperature?: number}} opts
 * @returns {Promise<string>} the assistant text
 */
export async function complete({ task = TASKS.CHAT, system, messages, maxTokens = 1500, temperature = 0.6 }) {
    const args = { task, system, messages, maxTokens, temperature };

    // Prefer the proxy so the key stays server-side on Railway. GitHub Pages and
    // `vite dev` have no server, so fall through to a direct provider call.
    if (USE_PROXY) {
        try {
            return await completeViaProxy(args);
        } catch (err) {
            if (err.code !== 'no_proxy') throw err;
        }
    }

    const provider = getProvider();
    const key = getAiKey();
    if (!provider) throw fail('no_provider', 'No AI provider configured');
    if (!key) throw fail('no_key', 'No AI key configured');

    const model = modelFor(task);
    if (!model) throw fail('no_model', `No model mapped for task "${task}"`);

    const call = { model, system, messages, maxTokens, temperature };
    const text = provider.style === 'anthropic'
        ? await completeAnthropic(provider, key, call)
        : provider.style === 'gemini'
            ? await completeGemini(provider, key, call)
            : await completeOpenAi(provider, key, call);

    // Reasoning models can burn the whole budget before writing the answer.
    if (!text.trim()) throw fail('empty_reply', 'Model returned no text');
    return text;
}

export const AI_ERROR_TEXT = {
    no_key: 'No AI key set. Add one in .env.local (VITE_AI_API_KEY) or as AI_API_KEY on the server.',
    no_provider: 'AI key found but its provider is unknown — set VITE_AI_PROVIDER in .env.local.',
    invalid_key: 'That AI key was rejected. Check or rotate it.',
    no_credits: 'The Cline balance is empty — top up at app.cline.bot/credits, or switch to a :free model.',
    rate_limited: 'AI is rate limited right now — try again in a minute.',
    bad_model: 'That model name is not available on this provider.',
    empty_reply: 'The model returned no text — try again or switch the chat model.',
    api_error: 'The AI provider returned an error.',
    network: 'No connection to the AI provider.',
};

export function describeError(err) {
    if (!err) return AI_ERROR_TEXT.api_error;
    return AI_ERROR_TEXT[err.code] || AI_ERROR_TEXT.api_error;
}


