import { useState, useCallback } from 'react';
import { calcDayXP, getLevel } from './xpEngine';
import { calcAchievementStats, getUnlockedAchievements } from '../data/achievements';

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

// Helper to generate last 7 days mock data
function generateMockHistory() {
    const history = {};
    const today = new Date();

    // Generate for last 6 days (excluding today)
    for (let i = 1; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

        const isWorkoutDay = i % 2 !== 0; // Alternate days

        history[dateKey] = {
            meals: {
                breakfast: [{ name: 'Oatmeal & Berries', cals: 350, p: 12, c: 60, f: 6 }],
                lunch: [{ name: 'Chicken Salad', cals: 450, p: 40, c: 20, f: 15 }],
                dinner: [{ name: 'Salmon & Rice', cals: 600, p: 35, c: 50, f: 20 }],
                snacks: [{ name: 'Greek Yogurt', cals: 120, p: 15, c: 8, f: 0 }]
            },
            workouts: isWorkoutDay ? [{ name: 'Upper Body', duration: 45 }] : [],
            water: isWorkoutDay ? 3 : 2,
            bodyWeight: 72 + (Math.random() * 0.5 - 0.25)
        };
    }
    return history;
}

// ─── INITIAL STATE ───
const INITIAL_STATE = {
    user: {
        name: 'Saeed',
        goal: 'muscle_gain',
        age: null,
        gender: null,
        weight: 72.5,
        height: 180,
        calorieTarget: 2000,
        waterGoal: 2.5,
        macros: { p: 150, c: 200, f: 70 },
    },
    // Day-indexed history (Today + Mock Past)
    days: {
        ...generateMockHistory(),
        [todayKey()]: {
            meals: {
                breakfast: [], // Start empty today for the 'Log' flow
                lunch: [],
                dinner: [],
                snacks: [],
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
            ],
            water: 1.75,
            bodyWeight: 72.5,
        },
        // Past days for trend data
    },
    streak: { current: 0, best: 0, lastLogDate: '' },
    activeWorkout: null,
    // Gamification
    xp: 0,
    unlockedAchievements: [],
    streakFreezes: 0,
    onboardingComplete: false, // Start with onboarding
    checkIns: [], // Array of { date: 'YYYY-MM-DD', time: 'HH:MM', photoUri: '...' }
    workoutSchedule: { 0: null, 1: 'push', 2: 'pull', 3: 'legs', 4: null, 5: 'upper', 6: 'full_body' },
};




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
    let streak = 0;
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

// Calculate total XP across all days
function calcTotalXP(days, user) {
    let total = 0;
    const sorted = Object.keys(days).sort();
    let streak = 0;
    for (const key of sorted) {
        const d = days[key];
        const allMeals = [...d.meals.breakfast, ...d.meals.lunch, ...d.meals.dinner, ...d.meals.snacks];
        if (allMeals.length > 0 || (d.workouts || []).length > 0) {
            streak++;
        } else {
            streak = 0;
        }
        const dayResult = calcDayXP(d, user, streak);
        total += dayResult.total;
    }
    return total;
}

// ─── Load / Save ───
function loadState() {
    try {
        const saved = localStorage.getItem('ajwaa_v4');
        if (saved) {
            const parsed = JSON.parse(saved);
            // ensure new fields exist
            if (parsed.xp === undefined) parsed.xp = 0;
            if (!parsed.unlockedAchievements) parsed.unlockedAchievements = [];
            if (parsed.streakFreezes === undefined) parsed.streakFreezes = 0;
            if (parsed.onboardingComplete === undefined) parsed.onboardingComplete = true;
            if (!parsed.checkIns) parsed.checkIns = [];
            if (!parsed.workoutSchedule) parsed.workoutSchedule = { 0: null, 1: 'push', 2: 'pull', 3: 'legs', 4: null, 5: 'upper', 6: 'full_body' };
            return parsed;
        }
    } catch { /* localStorage unavailable */ }
    return INITIAL_STATE;
}

// ─── STORE HOOK ───
export function useStore() {
    const [state, setState] = useState(() => {
        const loaded = loadState();
        // Recalculate XP on load
        loaded.xp = calcTotalXP(loaded.days, loaded.user);
        return loaded;
    });

    const save = useCallback((s) => {
        localStorage.setItem('ajwaa_v4', JSON.stringify(s));
    }, []);

    const update = useCallback((fn) => {
        setState(prev => {
            const next = fn(structuredClone(prev));
            // Recalculate XP after every state change
            next.xp = calcTotalXP(next.days, next.user);
            // Check achievements
            const level = getLevel(next.xp);
            const stats = calcAchievementStats(next.days, next.user, level);
            next.unlockedAchievements = getUnlockedAchievements(stats);
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
            if (s.days[key].water > 5) s.days[key].water = 0;
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

    // ─── ONBOARDING ───
    const completeOnboarding = useCallback((userProfile) => {
        update(s => {
            Object.assign(s.user, userProfile);
            s.onboardingComplete = true;
            // Set initial calorie target based on goal/weight if needed, but for now just save
            return s;
        });
    }, [update]);

    // ─── CHECK INS ───
    const logCheckIn = useCallback((photoDataUrl) => {
        update(s => {
            const date = todayKey();
            // Don't log if already checked in today
            if (s.checkIns && s.checkIns.some(c => c.date === date)) return s;
            
            if (!s.checkIns) s.checkIns = [];
            s.checkIns.push({ date, time: timeNow(), photoUri: photoDataUrl });
            
            // Add XP for checking in
            s.xp += 50; 
            return s;
        });
    }, [update]);

    // ─── SCHEDULE ───
    const updateWorkoutSchedule = useCallback((dayIndex, templateId) => {
        update(s => {
            s.workoutSchedule[dayIndex] = templateId;
            return s;
        });
    }, [update]);

    return {
        state, update,
        // Meals
        addMeal, removeMeal,
        // Water
        addWater,
        // Workouts
        startWorkout, addExerciseToActive, updateSet, addSet, removeSet, finishWorkout, cancelWorkout, logWorkoutSession,
        // Body
        logBodyWeight, updateProfile, completeOnboarding, logCheckIn,
        // Schedule
        updateWorkoutSchedule,
        // Derived
        getToday, getTodayTotals, getStreak, getLast7Days, getWeightHistory, getExerciseHistory,
    };
}
