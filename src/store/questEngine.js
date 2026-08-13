// ─── QUEST ENGINE ───
// Daily quests that rotate and track progress

const QUEST_POOL = [
    {
        id: 'all_meals',
        title: 'Full Day',
        desc: 'Log all 4 meal slots',
        xp: 30,
        check: (day) => {
            const slots = [day.meals.breakfast, day.meals.lunch, day.meals.dinner, day.meals.snacks];
            const filled = slots.filter(s => s.length > 0).length;
            return { current: filled, target: 4, done: filled >= 4 };
        }
    },
    {
        id: 'protein_150',
        title: 'Protein Power',
        desc: 'Hit 150g protein',
        xp: 40,
        check: (day) => {
            const p = [...day.meals.breakfast, ...day.meals.lunch, ...day.meals.dinner, ...day.meals.snacks].reduce((s, m) => s + m.p, 0);
            return { current: Math.min(p, 150), target: 150, done: p >= 150 };
        }
    },
    {
        id: 'water_3',
        title: 'Hydro Mode',
        desc: 'Drink 3L of water',
        xp: 20,
        check: (day) => {
            return { current: Math.min(day.water, 3), target: 3, done: day.water >= 3 };
        }
    },
    {
        id: 'workout_3ex',
        title: 'Iron Session',
        desc: 'Complete a workout with 3+ exercises',
        xp: 50,
        check: (day) => {
            const best = (day.workouts || []).reduce((b, w) => Math.max(b, w.exercises.length), 0);
            return { current: Math.min(best, 3), target: 3, done: best >= 3 };
        }
    },
    {
        id: 'cal_target',
        title: 'On Point',
        desc: 'Stay within 100 kcal of your target',
        xp: 40,
        check: (day, user) => {
            const cals = [...day.meals.breakfast, ...day.meals.lunch, ...day.meals.dinner, ...day.meals.snacks].reduce((s, m) => s + m.cals, 0);
            const diff = Math.abs(cals - user.calorieTarget);
            const done = cals > 0 && diff <= 100;
            return { current: done ? 1 : 0, target: 1, done };
        }
    },
    {
        id: 'log_5_items',
        title: 'Food Tracker',
        desc: 'Log 5 food items today',
        xp: 25,
        check: (day) => {
            const count = [...day.meals.breakfast, ...day.meals.lunch, ...day.meals.dinner, ...day.meals.snacks].length;
            return { current: Math.min(count, 5), target: 5, done: count >= 5 };
        }
    },
    {
        id: 'water_2',
        title: 'Stay Hydrated',
        desc: 'Drink at least 2L of water',
        xp: 15,
        check: (day) => {
            return { current: Math.min(day.water, 2), target: 2, done: day.water >= 2 };
        }
    },
    {
        id: 'any_workout',
        title: 'Move It',
        desc: 'Complete any workout',
        xp: 30,
        check: (day) => {
            const count = (day.workouts || []).length;
            return { current: Math.min(count, 1), target: 1, done: count >= 1 };
        }
    },
];

// Pick 3 quests for today based on date seed
export function getDailyQuests(dateKey) {
    // Simple hash from date string to get consistent daily selection
    let hash = 0;
    for (let i = 0; i < dateKey.length; i++) {
        hash = ((hash << 5) - hash) + dateKey.charCodeAt(i);
        hash |= 0;
    }
    hash = Math.abs(hash);

    // Shuffle pool using hash as seed
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
