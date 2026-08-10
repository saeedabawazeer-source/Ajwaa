// ─── ACHIEVEMENTS ───
// Badge definitions with unlock conditions

export const ACHIEVEMENTS = [
    {
        id: 'first_meal',
        title: 'First Steps',
        desc: 'Log your first meal',
        icon: 'Sunrise',
        check: (stats) => stats.totalMeals >= 1,
    },
    {
        id: 'streak_3',
        title: 'Streak Starter',
        desc: '3-day streak',
        icon: 'Flame',
        check: (stats) => stats.bestStreak >= 3,
    },
    {
        id: 'streak_7',
        title: 'On Fire',
        desc: '7-day streak',
        icon: 'Flame',
        check: (stats) => stats.bestStreak >= 7,
    },
    {
        id: 'streak_30',
        title: 'Unstoppable',
        desc: '30-day streak',
        icon: 'Crown',
        check: (stats) => stats.bestStreak >= 30,
    },
    {
        id: 'protein_king',
        title: 'Protein King',
        desc: 'Hit protein goal 7 days',
        icon: 'Target',
        check: (stats) => stats.proteinGoalDays >= 7,
    },
    {
        id: 'hydro_homie',
        title: 'Hydro Homie',
        desc: 'Hit water goal 5 days',
        icon: 'Droplets',
        check: (stats) => stats.waterGoalDays >= 5,
    },
    {
        id: 'iron_10',
        title: 'Iron Will',
        desc: 'Log 10 workouts',
        icon: 'Dumbbell',
        check: (stats) => stats.totalWorkouts >= 10,
    },
    {
        id: 'level_5',
        title: 'Rising Star',
        desc: 'Reach Level 5',
        icon: 'Star',
        check: (stats) => stats.level >= 5,
    },
    {
        id: 'level_10',
        title: 'Century Club',
        desc: 'Reach Level 10',
        icon: 'Trophy',
        check: (stats) => stats.level >= 10,
    },
    {
        id: 'perfect_day',
        title: 'Perfect Day',
        desc: 'Hit all targets in one day',
        icon: 'Award',
        check: (stats) => stats.perfectDays >= 1,
    },
    {
        id: 'meal_50',
        title: 'Dedicated Logger',
        desc: 'Log 50 meals total',
        icon: 'Shield',
        check: (stats) => stats.totalMeals >= 50,
    },
    {
        id: 'love_fitness',
        title: 'Fitness Lover',
        desc: 'Use Ajwaa for 14 days',
        icon: 'Heart',
        check: (stats) => stats.activeDays >= 14,
    },
];

// Calculate stats from all days
export function calcAchievementStats(days, user, level) {
    let totalMeals = 0;
    let totalWorkouts = 0;
    let activeDays = 0;
    let proteinGoalDays = 0;
    let waterGoalDays = 0;
    let perfectDays = 0;
    let bestStreak = 0;
    let currentStreak = 0;

    const sorted = Object.keys(days).sort();
    for (const key of sorted) {
        const d = days[key];
        const meals = [...d.meals.breakfast, ...d.meals.lunch, ...d.meals.dinner, ...d.meals.snacks];
        const mealCount = meals.length;
        const cals = meals.reduce((s, m) => s + m.cals, 0);
        const protein = meals.reduce((s, m) => s + m.p, 0);
        const workoutCount = (d.workouts || []).length;

        totalMeals += mealCount;
        totalWorkouts += workoutCount;

        if (mealCount > 0 || workoutCount > 0) {
            activeDays++;
            currentStreak++;
            bestStreak = Math.max(bestStreak, currentStreak);
        } else {
            currentStreak = 0;
        }

        if (protein >= user.macros.p) proteinGoalDays++;
        if (d.water >= user.waterGoal) waterGoalDays++;

        // Perfect day: all slots filled, cals within 100, water goal, workout done
        const slotsUsed = [d.meals.breakfast, d.meals.lunch, d.meals.dinner, d.meals.snacks].filter(s => s.length > 0).length;
        if (slotsUsed === 4 && Math.abs(cals - user.calorieTarget) <= 100 && d.water >= user.waterGoal && workoutCount > 0) {
            perfectDays++;
        }
    }

    return { totalMeals, totalWorkouts, activeDays, proteinGoalDays, waterGoalDays, perfectDays, bestStreak, level };
}

// Get unlocked achievements
export function getUnlockedAchievements(stats) {
    return ACHIEVEMENTS.filter(a => a.check(stats)).map(a => a.id);
}
