// ─── COACH BRAIN ───
// Persona + orchestration for the Ajwaa chat. Reads the user's real logged
// data (coachContext) and answers as his strength coach and nutritionist.

import { complete, TASKS, isConfigured, describeError } from './aiProvider';
import { buildCoachSnapshot, formatSnapshot } from './coachContext';
import { OWNER_PLAN } from '../data/secretPlan';
import { WORKOUT_TEMPLATES } from '../data/workoutTemplates';
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
        'PHOTOS',
        'He can send photos (a meal, a machine, a form check, a progress shot). Read the image and answer about what is actually in it, using the same coaching voice. If it is food, estimate the portion and macros.',
        '',
        'COACH ACTIONS',
        'Only when he explicitly asks you to change something, finish your reply with exactly one line on its own:',
        '- log food: ACTION:{"type":"log_meal","slot":"breakfast|lunch|dinner|snacks","food":"short name","cals":0,"p":0,"c":0,"f":0}',
        '- swap the exercise he is doing: ACTION:{"type":"swap_exercise","from":"Squat","to":"Leg Press"}',
        `- change the weekly split: ACTION:{"type":"set_split","week":{"0":null,"1":"push","2":"pull_a","3":"legs","4":"push","5":"pull","6":"legs"}}`,
        `Valid session ids: ${WORKOUT_TEMPLATES.map(t => t.id).join(', ')}. Days are 0=Sunday … 6=Saturday, null is a rest day.`,
        'Never emit an ACTION line unless he asked for that change.',
        '',
        '=== DATA (his real logs, right now) ===',
        formatSnapshot(snapshot),
    ].filter(Boolean).join('\n');
}

/** Pull an ACTION line out of the reply and keep it out of the chat text. */
function extractAction(text) {
    const match = text.match(/ACTION:\s*(\{[\s\S]*?\})/);
    if (!match) return { text, action: null };
    let action = null;
    try {
        const p = JSON.parse(match[1]);
        if (p?.type === 'swap_exercise' && p.from && p.to) {
            action = { type: 'swap_exercise', from: String(p.from), to: String(p.to) };
        } else if (p?.type === 'set_split' && p.week) {
            action = { type: 'set_split', week: p.week };
        } else if (p?.food) {
            action = {
                type: 'log_meal',
                slot: ['breakfast', 'lunch', 'dinner', 'snacks'].includes(p.slot) ? p.slot : 'snacks',
                food: String(p.food),
                cals: Number(p.cals) || 0,
                p: Number(p.p) || 0,
                c: Number(p.c) || 0,
                f: Number(p.f) || 0,
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
export async function askCoach({ message, history = [], state, derived = {}, ownerMode = false, image = null }) {
    const rules = () => ({ text: generateAjwaResponse(message, derived), source: 'rules' });

    if (!isConfigured()) return rules();

    try {
        const snapshot = buildCoachSnapshot(state, derived);
        const messages = [
            ...history
                .slice(-8)
                .map(m => ({ role: m.role === 'ajwa' ? 'assistant' : 'user', content: m.text })),
            { role: 'user', content: message || 'What do you think of this?' },
        ];

        const text = (await complete({
            task: TASKS.CHAT,
            system: buildCoachSystemPrompt(snapshot, { ownerMode }),
            messages,
            image,
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
