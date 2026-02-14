// ─── XP ENGINE ───
// Award rules, level calculation, and title mapping

export const XP_AWARDS = {
    MEAL_LOG: 10,
    CALORIE_TARGET_HIT: 50,
    PROTEIN_GOAL_HIT: 30,
    WORKOUT_COMPLETE: 40,
    WATER_GOAL_HIT: 20,
    ALL_MEALS_LOGGED: 25,
    STREAK_BONUS_PER_DAY: 5, // multiplied by streak length
    QUEST_COMPLETE: 0, // varies per quest
};

// Level = floor(sqrt(totalXP / 100))
export function getLevel(xp) {
    return Math.floor(Math.sqrt(xp / 100));
}

export function getXPForLevel(level) {
    return level * level * 100;
}

export function getXPProgress(xp) {
    const level = getLevel(xp);
    const currentLevelXP = getXPForLevel(level);
    const nextLevelXP = getXPForLevel(level + 1);
    const progress = xp - currentLevelXP;
    const needed = nextLevelXP - currentLevelXP;
    return { level, progress, needed, percentage: Math.min((progress / needed) * 100, 100) };
}

const LEVEL_TITLES = [
    'Beginner',      // 0
    'Starter',       // 1
    'Dedicated',     // 2
    'Consistent',    // 3
    'Focused',       // 4
    'Athlete',       // 5
    'Warrior',       // 6
    'Champion',      // 7
    'Beast',         // 8
    'Elite',         // 9
    'Legend',        // 10+
];

export function getLevelTitle(level) {
    return LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)];
}

// Calculate XP earned for a given day's data
export function calcDayXP(day, user, streak) {
    if (!day) return { total: 0, breakdown: [] };
    const breakdown = [];
    const allMeals = [...day.meals.breakfast, ...day.meals.lunch, ...day.meals.dinner, ...day.meals.snacks];

    // Meal logging XP
    const mealCount = allMeals.length;
    if (mealCount > 0) {
        const xp = mealCount * XP_AWARDS.MEAL_LOG;
        breakdown.push({ label: `${mealCount} meals logged`, xp });
    }

    // All 4 slots have items
    const slotsUsed = [day.meals.breakfast, day.meals.lunch, day.meals.dinner, day.meals.snacks].filter(s => s.length > 0).length;
    if (slotsUsed === 4) {
        breakdown.push({ label: 'All meals logged', xp: XP_AWARDS.ALL_MEALS_LOGGED });
    }

    // Calorie target
    const totalCals = allMeals.reduce((s, m) => s + m.cals, 0);
    if (totalCals > 0 && Math.abs(totalCals - user.calorieTarget) <= 100) {
        breakdown.push({ label: 'Calorie target hit', xp: XP_AWARDS.CALORIE_TARGET_HIT });
    }

    // Protein goal
    const totalProtein = allMeals.reduce((s, m) => s + m.p, 0);
    if (totalProtein >= user.macros.p) {
        breakdown.push({ label: 'Protein goal hit', xp: XP_AWARDS.PROTEIN_GOAL_HIT });
    }

    // Workouts
    if (day.workouts && day.workouts.length > 0) {
        const xp = day.workouts.length * XP_AWARDS.WORKOUT_COMPLETE;
        breakdown.push({ label: `${day.workouts.length} workout(s)`, xp });
    }

    // Water
    if (day.water >= user.waterGoal) {
        breakdown.push({ label: 'Water goal hit', xp: XP_AWARDS.WATER_GOAL_HIT });
    }

    // Streak bonus
    if (streak > 0) {
        const xp = XP_AWARDS.STREAK_BONUS_PER_DAY * streak;
        breakdown.push({ label: `${streak}-day streak bonus`, xp });
    }

    const total = breakdown.reduce((s, b) => s + b.xp, 0);
    return { total, breakdown };
}
