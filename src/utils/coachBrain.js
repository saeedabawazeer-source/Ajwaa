// ─── COACH BRAIN ───
// Persona + orchestration for the Ajwaa chat. Reads the user's real logged
// data (coachContext) and answers as his strength coach and nutritionist.

import { complete, TASKS, isConfigured, describeError } from './aiProvider';
import { buildCoachSnapshot, formatSnapshot } from './coachContext';
import { OWNER_PLAN } from '../data/secretPlan';
import { generateAjwaResponse } from './ajwaChat';

const GOAL_PLAYBOOK = {
    fat_loss: 'Goal: lean recomp in a calorie deficit. Protect muscle first — protein is non-negotiable, carbs go around the training window, and the scale should drift down slowly while lifts hold or climb. Never suggest crash dieting or long fasted cardio.',
    muscle_gain: 'Goal: muscle gain in a small surplus. Protein 1.8-2.2 g/kg, progressive overload every week, and a rising scale is the plan working, not a problem.',
    fitness: 'Goal: general fitness. Consistency beats intensity — balanced meals, 3-4 sessions a week, sleep and daily steps.',
};

function planBlock() {
    const { targets, timeline, supplements, week, rules } = OWNER_PLAN;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return [
        `HIS ACTIVE PLAN (2-month lean recomp): ${targets.calories} kcal, ${targets.macros.p}P/${targets.macros.c}C/${targets.macros.f}F, ${targets.water}L water.`,
        `DAILY RHYTHM: ${timeline.map(s => `${s.time} ${s.title}`).join(' → ')}.`,
        `SUPPLEMENTS: ${supplements.map(s => `${s.name} ${s.dose} (${s.timing})`).join('; ')}.`,
        `SPLIT: ${days.map((d, i) => `${d}=${week[i] || 'rest'}`).join(' ')}. Day 1 is Pull A.`,
        `PLAN RULES: ${rules.join(' ')}`,
    ].join('\n');
}

export function buildCoachSystemPrompt(snapshot, { ownerMode = false } = {}) {
    const goal = snapshot.profile.goal || 'fitness';
    return [
        `You are Ajwaa — ${snapshot.profile.name || 'the user'}'s strength coach and sports nutritionist inside his own training app.`,
        'You are not a generic chatbot. You read the DATA block below before every answer and you coach off those numbers.',
        '',
        'HOW YOU ANSWER',
        '- Lead with the number that matters, then the action. 2-5 short sentences, or a tight list when he asks for options.',
        '- Quote his real data: remaining calories, protein gap, water logged, last session, weight trend.',
        '- Prescribe from his plan and his remaining macros. Suggest Gulf/Middle Eastern food he actually eats (kabsa, mandi, shawarma, grilled chicken, laban) when relevant.',
        '- If a number is missing, say what he should log instead of inventing it. Never fabricate data that is not in the DATA block.',
        '- Units: kg, kcal, grams, liters. Be direct and warm, like a coach who wants him to win. No medical diagnoses and no crash diets.',
        '- If he asks about something outside training, nutrition or recovery, say it is outside your lane and pull him back to the plan.',
        '',
        GOAL_PLAYBOOK[goal] || GOAL_PLAYBOOK.fitness,
        ownerMode ? planBlock() : '',
        '',
        'LOGGING FOOD',
        'When the user tells you what they ate and asks for it to be logged, finish your reply with exactly one line, on its own:',
        'ACTION:{"slot":"breakfast|lunch|dinner|snacks","food":"short name","cals":0,"p":0,"c":0,"f":0}',
        'Estimate the macros for the portion they described. Only emit that line when they are asking you to log food, never otherwise.',
        '',
        '=== DATA (his real logs, right now) ===',
        formatSnapshot(snapshot),
    ].filter(Boolean).join('\n');
}

/** Pull an ACTION line (food logging) out of the reply and keep it out of the chat text. */
function extractAction(text) {
    const match = text.match(/ACTION:\s*(\{[\s\S]*?\})/);
    if (!match) return { text, action: null };
    let action = null;
    try {
        const parsed = JSON.parse(match[1]);
        if (parsed && parsed.food) {
            action = {
                slot: ['breakfast', 'lunch', 'dinner', 'snacks'].includes(parsed.slot) ? parsed.slot : 'snacks',
                food: String(parsed.food),
                cals: Number(parsed.cals) || 0,
                p: Number(parsed.p) || 0,
                c: Number(parsed.c) || 0,
                f: Number(parsed.f) || 0,
            };
        }
    } catch { action = null; }
    return { text: text.replace(match[0], '').trim(), action };
}

/**
 * Ask the coach. Always resolves: if AI is unconfigured or fails, the built-in
 * rule engine answers so the chat never goes dead.
 * @returns {Promise<{text: string, source: 'ai'|'rules'|'error', note?: string, action?: object}>}
 */
export async function askCoach({ message, history = [], state, derived = {}, ownerMode = false }) {
    const rules = () => ({ text: generateAjwaResponse(message, derived), source: 'rules' });

    if (!isConfigured()) return rules();

    try {
        const snapshot = buildCoachSnapshot(state, derived);
        const messages = [
            ...history
                .slice(-8)
                .map(m => ({ role: m.role === 'ajwa' ? 'assistant' : 'user', content: m.text })),
            { role: 'user', content: message },
        ];

        const text = (await complete({
            task: TASKS.CHAT,
            system: buildCoachSystemPrompt(snapshot, { ownerMode }),
            messages,
            maxTokens: 1500,
            temperature: 0.6,
        })).trim();

        if (!text) return { ...rules(), note: 'The model returned an empty reply.' };
        const { text: clean, action } = extractAction(text);
        return { text: clean, source: 'ai', action };
    } catch (err) {
        console.error('askCoach failed:', err);
        return { ...rules(), source: 'error', note: describeError(err) };
    }
}
