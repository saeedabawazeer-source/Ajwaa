// ─── AI COACH ───
// Context-aware motivational messages

const MORNING_MSGS = [
    "Rise and grind! A new day, a new chance to hit your goals.",
    "Good morning, champ. Your body is waiting for fuel — log breakfast.",
    "Early birds earn the most XP. Let's start logging!",
    "Today's a fresh page. Make it count.",
    "Your streak depends on today. Let's go!",
];

const MIDDAY_MSGS = [
    "Halfway through the day — how's your protein looking?",
    "Don't forget lunch! Consistent meals = consistent gains.",
    "Midday check-in: are you staying hydrated?",
    "Your muscles need fuel to grow. Have you eaten enough?",
];

const EVENING_MSGS = [
    "Evening check: did you hit your targets today?",
    "One more meal could complete your daily quests.",
    "Great day or room to improve? Either way, you showed up.",
    "Log dinner and wrap up a solid day.",
];

const ON_TRACK_MSGS = [
    "You're absolutely crushing it today!",
    "Right on target. Keep this energy going.",
    "Your discipline is paying off. Stay locked in.",
    "Almost at your goal — don't let up now!",
];

const BEHIND_MSGS = [
    "You're behind on calories. Time to fuel up!",
    "Still time to catch up — log your next meal.",
    "Don't let today slip. Every meal counts.",
    "You've got room in your macros. Eat something nutritious!",
];

const OVER_MSGS = [
    "You've exceeded your target. No stress — just be mindful.",
    "Over your calorie goal, but tomorrow's a reset.",
    "Went a bit over? It happens. Stay consistent, not perfect.",
];

const PROTEIN_LOW = [
    "Your protein is low. Try chicken, eggs, or a shake.",
    "Need more protein? A Greek yogurt or protein bar can help.",
    "Your muscles need protein! You're behind on your goal.",
];

const STREAK_MSGS = [
    "Your streak is alive! Don't break the chain.",
    "Strong streak game. Keep showing up daily.",
    "Consecutive days of effort compound into real results.",
];

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function getSmartCoachMessage(totals, user, streak, today) {
    const hour = new Date().getHours();
    const calPct = totals.cals / user.calorieTarget;
    const proteinPct = totals.p / user.macros.p;

    // Priority: protein warning
    if (proteinPct < 0.5 && hour >= 14) {
        return pick(PROTEIN_LOW);
    }

    // Over target
    if (calPct > 1.1) {
        return pick(OVER_MSGS);
    }

    // On track or behind
    if (calPct >= 0.7 && calPct <= 1.1) {
        return pick(ON_TRACK_MSGS);
    }

    if (calPct < 0.5 && hour >= 12) {
        return pick(BEHIND_MSGS);
    }

    // Time-based
    if (hour < 11) return pick(MORNING_MSGS);
    if (hour < 16) return pick(MIDDAY_MSGS);

    // Streak msgs if streak > 3
    if (streak > 3) return pick(STREAK_MSGS);

    return pick(EVENING_MSGS);
}
