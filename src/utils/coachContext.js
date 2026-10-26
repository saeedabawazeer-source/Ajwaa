// ─── COACH CONTEXT ───
// Turns the store's logged data into the compact snapshot the coach reads
// before every reply. Read-only: nothing here writes back to the store.

const SLOTS = ['breakfast', 'lunch', 'dinner', 'snacks'];

function keyOf(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function daySummary(day) {
    const meals = SLOTS.flatMap(slot => day?.meals?.[slot] || []);
    return {
        cals: meals.reduce((a, m) => a + (Number(m.cals) || 0), 0),
        p: meals.reduce((a, m) => a + (Number(m.p) || 0), 0),
        c: meals.reduce((a, m) => a + (Number(m.c) || 0), 0),
        f: meals.reduce((a, m) => a + (Number(m.f) || 0), 0),
        water: Number(day?.water) || 0,
        weight: day?.bodyWeight ?? null,
        meals: meals.map(m => `${m.time || '--:--'} ${m.food} — ${m.cals}kcal P${m.p}/C${m.c}/F${m.f}`),
        workouts: (day?.workouts || []).map(w => ({
            title: w.title,
            time: w.time,
            sets: (w.exercises || []).map(e =>
                `${e.name}: ${(e.sets || []).map(s => `${s.reps}x${s.weight}kg`).join(', ')}`
            ),
        })),
    };
}

/**
 * @param {object} state full store state (from App, not a second useStore())
 * @param {{totals?: object, streak?: number, xp?: number}} derived values App already computed
 */
export function buildCoachSnapshot(state, derived = {}) {
    const user = state.user || {};
    const days = state.days || {};

    const today = new Date();
    const todayKey = keyOf(today);
    const todaySummary = daySummary(days[todayKey]);

    // Last 7 days, oldest first, today excluded (it is reported in full below).
    const history = [];
    for (let i = 6; i >= 1; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = keyOf(d);
        const day = days[key];
        if (!day) continue;
        const s = daySummary(day);
        history.push({
            date: key,
            cals: s.cals,
            protein: s.p,
            carbs: s.c,
            fat: s.f,
            water: s.water,
            weight: s.weight,
            workouts: s.workouts.map(w => w.title),
        });
    }

    const weightHistory = Object.keys(days)
        .sort()
        .map(key => ({ date: key, weight: days[key]?.bodyWeight }))
        .filter(entry => typeof entry.weight === 'number')
        .slice(-10);

    return {
        now: `${today.toDateString()} ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`,
        profile: {
            name: user.name,
            role: user.role,
            goal: user.goal,
            age: user.age,
            gender: user.gender,
            heightCm: user.height,
            weightKg: user.weight,
            activityLevel: user.activityLevel,
        },
        targets: {
            calories: user.calorieTarget,
            protein: user.macros?.p,
            carbs: user.macros?.c,
            fat: user.macros?.f,
            water: user.waterGoal,
        },
        today: { ...todaySummary, ...(derived.totals ? { loggedTotals: derived.totals } : {}) },
        last7Days: history,
        weightHistory,
        training: {
            streak: derived.streak ?? 0,
            xp: derived.xp ?? state.xp ?? 0,
            schedule: state.workoutSchedule || {},
            activeWorkout: state.activeWorkout
                ? { title: state.activeWorkout.title, started: state.activeWorkout.startTime }
                : null,
        },
        checkIns: (state.checkIns || []).slice(-5).map(c => c.date),
    };
}

/** Compact text block — cheaper in tokens than JSON and easier for the model to read. */
export function formatSnapshot(snapshot) {
    const lines = [];
    const { profile, targets, today, training } = snapshot;

    lines.push(`TIME: ${snapshot.now}`);
    lines.push(`PROFILE: ${profile.name || 'unknown'}, ${profile.age || '?'}y ${profile.gender || ''}, ${profile.heightCm || '?'}cm, ${profile.weightKg || '?'}kg, goal=${profile.goal || 'unset'}, activity=${profile.activityLevel || '?'}`);
    lines.push(`TARGETS: ${targets.calories || '?'} kcal, ${targets.protein || '?'}P / ${targets.carbs || '?'}C / ${targets.fat || '?'}F g, ${targets.water || '?'}L water`);
    lines.push(`TODAY: ${today.cals} kcal, ${today.p}P / ${today.c}P / ${today.f}F, water ${today.water}L, weight ${today.weight ?? 'not logged'}`);
    lines.push(`TODAY MEALS: ${today.meals.length ? today.meals.join(' | ') : 'nothing logged yet'}`);
    lines.push(`TODAY WORKOUTS: ${today.workouts.length ? today.workouts.map(w => `${w.title} (${w.sets.join('; ')})`).join(' | ') : 'none logged'}`);
    lines.push(`STREAK: ${training.streak} days | XP ${training.xp} | check-ins: ${snapshot.checkIns.join(', ') || 'none'}`);
    if (training.activeWorkout) lines.push(`LIVE SESSION: ${training.activeWorkout.title} started ${training.activeWorkout.started}`);

    if (snapshot.last7Days.length) {
        lines.push('LAST 7 DAYS:');
        snapshot.last7Days.forEach(d => {
            lines.push(`  ${d.date}: ${d.cals}kcal ${d.protein}P ${d.carbs}C ${d.fat}F, water ${d.water}L, weight ${d.weight ?? '-'}, workouts: ${d.workouts.join(', ') || 'rest'}`);
        });
    } else {
        lines.push('LAST 7 DAYS: no history logged');
    }

    if (snapshot.weightHistory.length) {
        lines.push(`WEIGHT TREND: ${snapshot.weightHistory.map(w => `${w.date}=${w.weight}kg`).join(' ')}`);
    }

    return lines.join('\n');
}
