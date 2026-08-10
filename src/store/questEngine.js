// ─── QUEST ENGINE ───
// Daily quests that rotate and track progress

export const QUEST_POOL = [
    {
        id: 'all_meals',
        title: 'Full Day Nutrition',
        desc: 'Log all 4 meal slots',
        xp: 30,
        check: (day) => {
            const slots = [day.meals.breakfast, day.meals.lunch, day.meals.dinner, day.meals.snacks];
            const filled = slots.filter(s => s.length > 0).length;
            return { current: filled, target: 4, done: filled >= 4 };
        }
    },
    {
        id: 'protein_target',
        title: 'Protein Champion',
        desc: 'Hit your daily protein goal',
        xp: 40,
        check: (day, user) => {
            const target = user?.macros?.p || 150;
            const p = [...day.meals.breakfast, ...day.meals.lunch, ...day.meals.dinner, ...day.meals.snacks].reduce((s, m) => s + m.p, 0);
            return { current: Math.min(p, target), target, done: p >= target };
        }
    },
    {
        id: 'water_goal',
        title: 'Hydration Master',
        desc: 'Hit your water target',
        xp: 25,
        check: (day, user) => {
            const target = user?.waterGoal || 2.5;
            return { current: Math.min(day.water, target), target, done: day.water >= target };
        }
    },
    {
        id: 'workout_complete',
        title: 'Iron Warrior',
        desc: 'Complete a workout session today',
        xp: 50,
        check: (day) => {
            const count = (day.workouts || []).length;
            return { current: Math.min(count, 1), target: 1, done: count >= 1 };
        }
    },
    {
        id: 'cal_target',
        title: 'Calorie Precision',
        desc: 'Stay within 100 kcal of target',
        xp: 45,
        check: (day, user) => {
            const cals = [...day.meals.breakfast, ...day.meals.lunch, ...day.meals.dinner, ...day.meals.snacks].reduce((s, m) => s + m.cals, 0);
            const target = user?.calorieTarget || 2000;
            const diff = Math.abs(cals - target);
            const done = cals > 0 && diff <= 100;
            return { current: done ? 1 : 0, target: 1, done };
        }
    },
    {
        id: 'log_5_items',
        title: 'Nutrition Tracker',
        desc: 'Log at least 4 food items today',
        xp: 25,
        check: (day) => {
            const count = [...day.meals.breakfast, ...day.meals.lunch, ...day.meals.dinner, ...day.meals.snacks].length;
            return { current: Math.min(count, 4), target: 4, done: count >= 4 };
        }
    },
];

// Calculate Mifflin-St Jeor TDEE & Recommended Macros
export function calculateTDEE({ gender = 'male', weight = 72.5, height = 180, age = 25, activityLevel = 1.375, goal = 'muscle_gain' }) {
    // BMR (Mifflin-St Jeor)
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr += (gender === 'female' ? -161 : 5);

    let tdee = Math.round(bmr * activityLevel);

    // Goal adjustment
    if (goal === 'cutting') tdee -= 400;
    else if (goal === 'muscle_gain') tdee += 300;

    tdee = Math.max(1200, Math.round(tdee));

    // Macro Split
    let p = Math.round(weight * 2.2); // ~1g per lb
    let f = Math.round((tdee * 0.25) / 9); // 25% cals from fats
    let c = Math.round((tdee - (p * 4 + f * 9)) / 4); // remaining from carbs

    if (c < 50) c = 50;

    return { calorieTarget: tdee, macros: { p, c, f } };
}

// Pick 3 quests for today based on date seed
export function getDailyQuests(dateKey) {
    let hash = 0;
    for (let i = 0; i < dateKey.length; i++) {
        hash = ((hash << 5) - hash) + dateKey.charCodeAt(i);
        hash |= 0;
    }
    hash = Math.abs(hash);

    const pool = [...QUEST_POOL];
    for (let i = pool.length - 1; i > 0; i--) {
        const j = (hash + i * 37) % (i + 1);
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    return pool.slice(0, 3);
}

// Check quest progress for a given day
export function checkQuests(quests, day, user) {
    return quests.map(q => ({
        ...q,
        ...q.check(day, user),
    }));
}
