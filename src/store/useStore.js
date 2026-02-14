import { useState, useCallback } from 'react';

// Helpers
function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function timeNow() {
    const n = new Date();
    return `${n.getHours()}:${String(n.getMinutes()).padStart(2, '0')}`;
}

function emptyDay() {
    return {
        meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
        workouts: [],
        water: 0,
        bodyWeight: null,
    };
}

// ─── INITIAL STATE ───
const INITIAL_STATE = {
    user: {
        name: 'Saeed',
        goal: 'muscle_gain',
        weight: 72.5,
        height: 180,
        calorieTarget: 2000,
        waterGoal: 2.5,
        macros: { p: 150, c: 200, f: 70 },
    },
    // Day-indexed history
    days: {
        [todayKey()]: {
            meals: {
                breakfast: [
                    { food: 'Oatmeal & Eggs', cals: 450, p: 28, c: 52, f: 14, time: '07:00' },
                    { food: 'Black Coffee', cals: 5, p: 0, c: 1, f: 0, time: '06:45' },
                ],
                lunch: [
                    { food: 'Grilled Chicken & Rice', cals: 520, p: 42, c: 55, f: 10, time: '13:20' },
                ],
                dinner: [],
                snacks: [
                    { food: 'Protein Shake + Banana', cals: 380, p: 32, c: 40, f: 8, time: '10:15' },
                ],
            },
            workouts: [
                {
                    id: 'w1', title: 'Chest Day', time: '11:45',
                    exercises: [
                        { exerciseId: 'bench_press', name: 'Bench Press', sets: [{ reps: 10, weight: 80 }, { reps: 10, weight: 80 }, { reps: 8, weight: 85 }, { reps: 6, weight: 90 }] },
                        { exerciseId: 'incline_db_press', name: 'Incline DB Press', sets: [{ reps: 12, weight: 30 }, { reps: 12, weight: 30 }, { reps: 10, weight: 32 }] },
                        { exerciseId: 'cable_flyes', name: 'Cable Flyes', sets: [{ reps: 15, weight: 15 }, { reps: 15, weight: 15 }, { reps: 12, weight: 17 }] },
                        { exerciseId: 'dips', name: 'Dips', sets: [{ reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 10, weight: 0 }] },
                    ]
                },
                {
                    id: 'w2', title: 'Morning Cardio', time: '07:30',
                    exercises: [
                        { exerciseId: 'treadmill', name: 'Treadmill Run', sets: [{ reps: 1, weight: 0, duration: 30 }] },
                        { exerciseId: 'jump_rope', name: 'Jump Rope', sets: [{ reps: 100, weight: 0 }, { reps: 100, weight: 0 }, { reps: 100, weight: 0 }] },
                    ]
                }
            ],
            water: 1.75,
            bodyWeight: 72.5,
        },
        // Past days for trend data
        ...generatePastDays(),
    },
    streak: { current: 0, best: 0, lastLogDate: '' },
    activeWorkout: null, // For full-screen workout mode
};

function generatePastDays() {
    const days = {};
    const base = new Date();
    for (let i = 1; i <= 7; i++) {
        const d = new Date(base);
        d.setDate(d.getDate() - i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const logged = i <= 5; // 5-day streak
        if (logged) {
            days[key] = {
                meals: {
                    breakfast: [{ food: 'Eggs & Toast', cals: 350, p: 22, c: 30, f: 12, time: '07:30' }],
                    lunch: [{ food: 'Rice & Chicken', cals: 500, p: 40, c: 50, f: 10, time: '13:00' }],
                    dinner: [{ food: 'Steak & Salad', cals: 600, p: 45, c: 15, f: 25, time: '19:30' }],
                    snacks: [{ food: 'Protein Bar', cals: 200, p: 20, c: 22, f: 8, time: '16:00' }],
                },
                workouts: [{
                    id: `w-past-${i}`, title: 'Workout', time: '10:00', exercises: [
                        { exerciseId: 'bench_press', name: 'Bench Press', sets: [{ reps: 10, weight: 75 + i }, { reps: 10, weight: 75 + i }, { reps: 8, weight: 80 + i }] },
                        { exerciseId: 'squat', name: 'Squat', sets: [{ reps: 8, weight: 90 + i * 2 }, { reps: 8, weight: 90 + i * 2 }] },
                    ]
                }],
                water: 2.0 + (i % 3) * 0.25,
                bodyWeight: 72.5 - (i * 0.1),
            };
        }
    }
    return days;
}

// ─── Calculate derived values ───
function calcDayTotals(day) {
    if (!day) return { cals: 0, p: 0, c: 0, f: 0, water: 0, workouts: 0 };
    const allMeals = [
        ...day.meals.breakfast, ...day.meals.lunch,
        ...day.meals.dinner, ...day.meals.snacks,
    ];
    return {
        cals: allMeals.reduce((s, m) => s + m.cals, 0),
        p: allMeals.reduce((s, m) => s + m.p, 0),
        c: allMeals.reduce((s, m) => s + m.c, 0),
        f: allMeals.reduce((s, m) => s + m.f, 0),
        water: day.water,
        workouts: day.workouts.length,
    };
}

function calcStreak(days) {
    const sorted = Object.keys(days).sort().reverse();
    let streak = 0;
    const today = todayKey();
    const check = new Date();
    for (let i = 0; i < 60; i++) {
        const key = `${check.getFullYear()}-${String(check.getMonth() + 1).padStart(2, '0')}-${String(check.getDate()).padStart(2, '0')}`;
        if (days[key]) {
            const d = days[key];
            const allMeals = [...d.meals.breakfast, ...d.meals.lunch, ...d.meals.dinner, ...d.meals.snacks];
            if (allMeals.length > 0 || d.workouts.length > 0) {
                streak++;
            } else break;
        } else break;
        check.setDate(check.getDate() - 1);
    }
    return streak;
}

// ─── Load / Save ───
function loadState() {
    localStorage.removeItem('ajwaa_v3');
    return INITIAL_STATE;
}

// ─── STORE HOOK ───
export function useStore() {
    const [state, setState] = useState(loadState);

    const save = useCallback((s) => {
        localStorage.setItem('ajwaa_v3', JSON.stringify(s));
    }, []);

    const update = useCallback((fn) => {
        setState(prev => {
            const next = fn(structuredClone(prev));
            save(next);
            return next;
        });
    }, [save]);

    // Ensure today exists
    const ensureToday = useCallback((s) => {
        const key = todayKey();
        if (!s.days[key]) s.days[key] = emptyDay();
        return key;
    }, []);

    // ─── MEAL ACTIONS ───
    const addMeal = useCallback((slot, food, cals, p, c, f) => {
        update(s => {
            const key = ensureToday(s);
            s.days[key].meals[slot].push({ food, cals, p, c, f, time: timeNow() });
            return s;
        });
    }, [update, ensureToday]);

    const removeMeal = useCallback((slot, index) => {
        update(s => {
            const key = ensureToday(s);
            s.days[key].meals[slot].splice(index, 1);
            return s;
        });
    }, [update, ensureToday]);

    // ─── WATER ───
    const addWater = useCallback((amount) => {
        update(s => {
            const key = ensureToday(s);
            s.days[key].water += amount;
            if (s.days[key].water > 5) s.days[key].water = 0; // reset on overflow
            return s;
        });
    }, [update, ensureToday]);

    // ─── WORKOUT ACTIONS ───
    const startWorkout = useCallback((title) => {
        update(s => {
            s.activeWorkout = { title, exercises: [], startTime: timeNow() };
            return s;
        });
    }, [update]);

    const addExerciseToActive = useCallback((exerciseId, name) => {
        update(s => {
            if (!s.activeWorkout) return s;
            s.activeWorkout.exercises.push({ exerciseId, name, sets: [{ reps: 0, weight: 0 }] });
            return s;
        });
    }, [update]);

    const updateSet = useCallback((exIdx, setIdx, reps, weight) => {
        update(s => {
            if (!s.activeWorkout) return s;
            s.activeWorkout.exercises[exIdx].sets[setIdx] = { reps: Number(reps), weight: Number(weight) };
            return s;
        });
    }, [update]);

    const addSet = useCallback((exIdx) => {
        update(s => {
            if (!s.activeWorkout) return s;
            const lastSet = s.activeWorkout.exercises[exIdx].sets.at(-1) || { reps: 0, weight: 0 };
            s.activeWorkout.exercises[exIdx].sets.push({ ...lastSet });
            return s;
        });
    }, [update]);

    const removeSet = useCallback((exIdx, setIdx) => {
        update(s => {
            if (!s.activeWorkout) return s;
            s.activeWorkout.exercises[exIdx].sets.splice(setIdx, 1);
            return s;
        });
    }, [update]);

    const finishWorkout = useCallback(() => {
        update(s => {
            if (!s.activeWorkout) return s;
            const key = ensureToday(s);
            s.days[key].workouts.push({
                id: 'w-' + Date.now(),
                title: s.activeWorkout.title,
                time: s.activeWorkout.startTime,
                exercises: s.activeWorkout.exercises,
            });
            s.activeWorkout = null;
            return s;
        });
    }, [update, ensureToday]);

    const cancelWorkout = useCallback(() => {
        update(s => { s.activeWorkout = null; return s; });
    }, [update]);

    // Quick log workout (from modal, backward compat)
    const logWorkoutSession = useCallback((title, exercises) => {
        update(s => {
            const key = ensureToday(s);
            const mapped = exercises.map(ex => ({
                exerciseId: ex.exerciseId || ex.name.toLowerCase().replace(/\s/g, '_'),
                name: ex.name,
                sets: [{ reps: Number(ex.reps), weight: Number(ex.weight) }],
            }));
            s.days[key].workouts.push({ id: 'w-' + Date.now(), title, time: timeNow(), exercises: mapped });
            return s;
        });
    }, [update, ensureToday]);

    // ─── BODY WEIGHT ───
    const logBodyWeight = useCallback((weight) => {
        update(s => {
            const key = ensureToday(s);
            s.days[key].bodyWeight = Number(weight);
            s.user.weight = Number(weight);
            return s;
        });
    }, [update, ensureToday]);

    // ─── UPDATE PROFILE ───
    const updateProfile = useCallback((changes) => {
        update(s => {
            Object.assign(s.user, changes);
            return s;
        });
    }, [update]);

    // ─── DERIVED DATA ───
    const getToday = useCallback(() => {
        const key = todayKey();
        return state.days[key] || emptyDay();
    }, [state.days]);

    const getTodayTotals = useCallback(() => {
        return calcDayTotals(getToday());
    }, [getToday]);

    const getStreak = useCallback(() => {
        return calcStreak(state.days);
    }, [state.days]);

    const getLast7Days = useCallback(() => {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const result = [];
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const day = state.days[key];
            const totals = calcDayTotals(day);
            result.push({
                day: dayNames[d.getDay()][0],
                fullDate: d.getDate(),
                key,
                cals: totals.cals,
                workouts: totals.workouts,
                water: totals.water,
                isToday: i === 0,
                activity: totals.cals > 0 || totals.workouts > 0 ? Math.min(100, Math.round((totals.cals / (state.user?.calorieTarget || 2000)) * 100)) : 0,
            });
        }
        return result;
    }, [state.days, state.user]);

    const getWeightHistory = useCallback(() => {
        const entries = [];
        const sorted = Object.keys(state.days).sort();
        sorted.forEach(key => {
            const d = state.days[key];
            if (d.bodyWeight) entries.push({ date: key, weight: d.bodyWeight });
        });
        return entries;
    }, [state.days]);

    const getExerciseHistory = useCallback((exerciseId) => {
        const entries = [];
        const sorted = Object.keys(state.days).sort();
        sorted.forEach(key => {
            const d = state.days[key];
            d.workouts.forEach(w => {
                w.exercises.forEach(ex => {
                    if (ex.exerciseId === exerciseId) {
                        const bestSet = ex.sets.reduce((best, s) => s.weight > best.weight ? s : best, { reps: 0, weight: 0 });
                        entries.push({ date: key, bestWeight: bestSet.weight, bestReps: bestSet.reps, totalSets: ex.sets.length });
                    }
                });
            });
        });
        return entries;
    }, [state.days]);

    return {
        state, update,
        // Meals
        addMeal, removeMeal,
        // Water
        addWater,
        // Workouts
        startWorkout, addExerciseToActive, updateSet, addSet, removeSet, finishWorkout, cancelWorkout, logWorkoutSession,
        // Body
        logBodyWeight, updateProfile,
        // Derived
        getToday, getTodayTotals, getStreak, getLast7Days, getWeightHistory, getExerciseHistory,
    };
}
