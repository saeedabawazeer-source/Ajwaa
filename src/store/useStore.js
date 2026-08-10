import { useState, useCallback } from 'react';
import { calcDayXP, getLevel } from './xpEngine';
import { calcAchievementStats, getUnlockedAchievements } from '../data/achievements';
import { calculateTDEE } from '../utils/helpers';

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

    for (let i = 1; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

        const isWorkoutDay = i % 2 !== 0;

        history[dateKey] = {
            meals: {
                breakfast: [{ food: 'Oatmeal & Berries', cals: 350, p: 12, c: 60, f: 6, time: '08:30' }],
                lunch: [{ food: 'Chicken Salad', cals: 450, p: 40, c: 20, f: 15, time: '13:00' }],
                dinner: [{ food: 'Salmon & Rice', cals: 600, p: 35, c: 50, f: 20, time: '19:30' }],
                snacks: [{ food: 'Greek Yogurt', cals: 120, p: 15, c: 8, f: 0, time: '16:00' }]
            },
            workouts: isWorkoutDay ? [{
                id: 'w-' + i,
                title: 'Upper Body',
                time: '17:00',
                exercises: [
                    { exerciseId: 'bench_press', name: 'Bench Press', sets: [{ reps: 10, weight: 75 + i }, { reps: 8, weight: 80 + i }] },
                    { exerciseId: 'barbell_row', name: 'Barbell Row', sets: [{ reps: 10, weight: 65 }, { reps: 10, weight: 70 }] }
                ]
            }] : [],
            water: isWorkoutDay ? 3 : 2,
            bodyWeight: Number((72.5 - (6 - i) * 0.1).toFixed(1))
        };
    }
    return history;
}

// ─── INITIAL STATE ───
const INITIAL_STATE = {
    user: {
        name: 'Saeed',
        role: 'coach', // 'client' | 'coach'
        goal: 'muscle_gain',
        age: 25,
        gender: 'male',
        weight: 72.5,
        height: 180,
        activityLevel: 1.375,
        calorieTarget: 2200,
        waterGoal: 2.5,
        macros: { p: 160, c: 230, f: 70 },
    },
    coachStudents: [
        {
            id: 'st-1',
            name: 'Fahad Al-Otaibi',
            avatar: 'F',
            goal: 'Muscle Recomp',
            calsEaten: 1840,
            calTarget: 2400,
            p: 152, pTarget: 180,
            c: 190, cTarget: 240,
            f: 48, fTarget: 65,
            water: 2.5, waterTarget: 3.0,
            lastWorkout: 'Heavy Push Session (PR 105kg)',
            lastLog: '12 mins ago',
            status: 'warning', // 'ok' | 'warning'
            note: 'Needs +28g protein before sleep'
        },
        {
            id: 'st-2',
            name: 'Tariq Mansoor',
            avatar: 'T',
            goal: 'Fat Loss',
            calsEaten: 1650,
            calTarget: 1900,
            p: 145, pTarget: 150,
            c: 140, cTarget: 160,
            f: 42, fTarget: 50,
            water: 3.2, waterTarget: 3.0,
            lastWorkout: 'Legs & Calves (Completed)',
            lastLog: '1 hour ago',
            status: 'ok',
            note: 'Great macro consistency!'
        },
        {
            id: 'st-3',
            name: 'Sara Ahmed',
            avatar: 'S',
            goal: 'Athletic Performance',
            calsEaten: 1420,
            calTarget: 2100,
            p: 98, pTarget: 140,
            c: 175, cTarget: 220,
            f: 38, fTarget: 55,
            water: 1.8, waterTarget: 2.5,
            lastWorkout: 'Rest Day',
            lastLog: '3 hours ago',
            status: 'warning',
            note: 'Under-eating calories & protein'
        }
    ],
    coachAdvice: [
        {
            id: 'adv-1',
            studentId: 'st-1',
            date: todayKey(),
            text: 'Increase post-workout protein by 25g. Bench PR is scaling up fast!',
            newTargetCals: 2450,
            newP: 185, newC: 240, newF: 65
        }
    ],
    claimedQuests: {}, // { 'YYYY-MM-DD': ['quest_id_1'] }
    socialReactions: {}, // { 'item_id': { cheers: 5, userCheered: false } }
    saeedProtocol: {
        dayNumber: 1,
        logs: {
            // [dateKey]: { bendDone, morningVacuumsDone, pushups, vacuumsSets, hollowHoldsSets, doorframeRows, growthSession: { pikePushups, splitSquats, weightedVups, bicepCurls, plankDownwardDog } }
        },
        notificationSettings: {
            enabled: false,
            intervalMinutes: 60,
            lastNotified: null
        }
    }
};

// ─── Helper Functions ───
function calcDayTotals(day) {
    if (!day) return { cals: 0, p: 0, c: 0, f: 0, water: 0, workouts: 0 };
    const allMeals = [
        ...(day.meals?.breakfast || []),
        ...(day.meals?.lunch || []),
        ...(day.meals?.dinner || []),
        ...(day.meals?.snacks || []),
    ];
    return {
        cals: allMeals.reduce((s, m) => s + (m.cals || 0), 0),
        p: allMeals.reduce((s, m) => s + (m.p || 0), 0),
        c: allMeals.reduce((s, m) => s + (m.c || 0), 0),
        f: allMeals.reduce((s, m) => s + (m.f || 0), 0),
        water: day.water || 0,
        workouts: (day.workouts || []).length,
    };
}

function calcStreak(days) {
    let streak = 0;
    const check = new Date();
    for (let i = 0; i < 60; i++) {
        const key = `${check.getFullYear()}-${String(check.getMonth() + 1).padStart(2, '0')}-${String(check.getDate()).padStart(2, '0')}`;
        if (days[key]) {
            const d = days[key];
            const allMeals = [...(d.meals?.breakfast || []), ...(d.meals?.lunch || []), ...(d.meals?.dinner || []), ...(d.meals?.snacks || [])];
            if (allMeals.length > 0 || (d.workouts || []).length > 0) {
                streak++;
            } else break;
        } else break;
        check.setDate(check.getDate() - 1);
    }
    return streak;
}

function calcTotalXP(state) {
    let total = 0;
    const days = state.days || {};
    const sorted = Object.keys(days).sort();
    let streak = 0;
    for (const key of sorted) {
        const d = days[key];
        const allMeals = [...(d.meals?.breakfast || []), ...(d.meals?.lunch || []), ...(d.meals?.dinner || []), ...(d.meals?.snacks || [])];
        if (allMeals.length > 0 || (d.workouts || []).length > 0) {
            streak++;
        } else {
            streak = 0;
        }
        const dayResult = calcDayXP(d, state.user, streak);
        total += dayResult.total;
    }

    // Add CheckIn XP
    total += (state.checkIns || []).length * 50;

    // Add Claimed Quest XP
    const claimed = state.claimedQuests || {};
    Object.values(claimed).forEach(list => {
        total += (list || []).length * 35; // average quest bonus
    });

    return total;
}

// ─── Load / Save ───
function loadState() {
    try {
        const saved = localStorage.getItem('ajwaa_v4');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (!parsed.user) parsed.user = INITIAL_STATE.user;
            if (!parsed.days) parsed.days = INITIAL_STATE.days;
            if (!parsed.coachStudents) parsed.coachStudents = INITIAL_STATE.coachStudents;
            if (!parsed.coachAdvice) parsed.coachAdvice = INITIAL_STATE.coachAdvice;
            if (parsed.xp === undefined) parsed.xp = 0;
            if (!parsed.unlockedAchievements) parsed.unlockedAchievements = [];
            if (parsed.streakFreezes === undefined) parsed.streakFreezes = 0;
            if (parsed.onboardingComplete === undefined) parsed.onboardingComplete = true;
            if (!parsed.checkIns) parsed.checkIns = [];
            if (!parsed.workoutSchedule) parsed.workoutSchedule = { 0: null, 1: 'push', 2: 'pull', 3: 'legs', 4: null, 5: 'upper', 6: 'full_body' };
            if (!parsed.claimedQuests) parsed.claimedQuests = {};
            if (!parsed.socialReactions) parsed.socialReactions = {};
            if (!parsed.saeedProtocol) parsed.saeedProtocol = INITIAL_STATE.saeedProtocol;
            if (!parsed.saeedProtocol.logs) parsed.saeedProtocol.logs = {};
            if (!parsed.saeedProtocol.notificationSettings) parsed.saeedProtocol.notificationSettings = INITIAL_STATE.saeedProtocol.notificationSettings;
            return parsed;
        }
    } catch { /* localStorage unavailable */ }
    return INITIAL_STATE;
}

// ─── STORE HOOK ───
export function useStore() {
    const [state, setState] = useState(() => {
        const loaded = loadState();
        loaded.xp = calcTotalXP(loaded);
        return loaded;
    });

    const save = useCallback((s) => {
        localStorage.setItem('ajwaa_v4', JSON.stringify(s));
    }, []);

    const triggerVibe = useCallback(() => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try { navigator.vibrate(35); } catch { /* unsupported */ }
        }
    }, []);

    const update = useCallback((fn) => {
        setState(prev => {
            const next = fn(structuredClone(prev));
            next.xp = calcTotalXP(next);
            const level = getLevel(next.xp);
            const stats = calcAchievementStats(next.days, next.user, level);
            next.unlockedAchievements = getUnlockedAchievements(stats);
            save(next);
            return next;
        });
    }, [save]);

    const ensureToday = useCallback((s) => {
        const key = todayKey();
        if (!s.days[key]) s.days[key] = emptyDay();
        return key;
    }, []);

    // ─── MEAL ACTIONS ───
    const addMeal = useCallback((slot, food, cals, p, c, f, dateKey) => {
        triggerVibe();
        update(s => {
            const key = dateKey || ensureToday(s);
            if (!s.days[key]) s.days[key] = emptyDay();
            s.days[key].meals[slot].push({ food, cals, p, c, f, time: timeNow() });
            return s;
        });
    }, [update, ensureToday, triggerVibe]);

    const removeMeal = useCallback((slot, index) => {
        triggerVibe();
        update(s => {
            const key = ensureToday(s);
            s.days[key].meals[slot].splice(index, 1);
            return s;
        });
    }, [update, ensureToday, triggerVibe]);

    // ─── WATER ───
    const addWater = useCallback((amount, dateKey) => {
        triggerVibe();
        update(s => {
            const key = dateKey || ensureToday(s);
            if (!s.days[key]) s.days[key] = emptyDay();
            s.days[key].water += amount;
            if (s.days[key].water > 5) s.days[key].water = 0;
            return s;
        });
    }, [update, ensureToday, triggerVibe]);

    // ─── WORKOUT ACTIONS ───
    const startWorkout = useCallback((title) => {
        triggerVibe();
        update(s => {
            s.activeWorkout = { title, exercises: [], startTime: timeNow() };
            return s;
        });
    }, [update, triggerVibe]);

    const addExerciseToActive = useCallback((exerciseId, name) => {
        triggerVibe();
        update(s => {
            if (!s.activeWorkout) return s;
            s.activeWorkout.exercises.push({ exerciseId: exerciseId || name.toLowerCase().replace(/\s/g, '_'), name, sets: [{ reps: 10, weight: 20 }] });
            return s;
        });
    }, [update, triggerVibe]);

    const updateSet = useCallback((exIdx, setIdx, reps, weight) => {
        update(s => {
            if (!s.activeWorkout) return s;
            s.activeWorkout.exercises[exIdx].sets[setIdx] = { reps: Number(reps), weight: Number(weight) };
            return s;
        });
    }, [update]);

    const addSet = useCallback((exIdx) => {
        triggerVibe();
        update(s => {
            if (!s.activeWorkout) return s;
            const lastSet = s.activeWorkout.exercises[exIdx].sets.at(-1) || { reps: 10, weight: 20 };
            s.activeWorkout.exercises[exIdx].sets.push({ ...lastSet });
            return s;
        });
    }, [update, triggerVibe]);

    const removeSet = useCallback((exIdx, setIdx) => {
        triggerVibe();
        update(s => {
            if (!s.activeWorkout) return s;
            s.activeWorkout.exercises[exIdx].sets.splice(setIdx, 1);
            return s;
        });
    }, [update, triggerVibe]);

    const finishWorkout = useCallback(() => {
        triggerVibe();
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
    }, [update, ensureToday, triggerVibe]);

    const cancelWorkout = useCallback(() => {
        triggerVibe();
        update(s => { s.activeWorkout = null; return s; });
    }, [update, triggerVibe]);

    const logWorkoutSession = useCallback((title, exercises) => {
        triggerVibe();
        update(s => {
            const key = ensureToday(s);
            const mapped = exercises.map(ex => ({
                exerciseId: ex.exerciseId || ex.name.toLowerCase().replace(/\s/g, '_'),
                name: ex.name,
                sets: [{ reps: Number(ex.reps || 10), weight: Number(ex.weight || 20) }],
            }));
            s.days[key].workouts.push({ id: 'w-' + Date.now(), title, time: timeNow(), exercises: mapped });
            return s;
        });
    }, [update, ensureToday, triggerVibe]);

    // ─── BODY WEIGHT & PROFILE ───
    const logBodyWeight = useCallback((weight) => {
        triggerVibe();
        update(s => {
            const key = ensureToday(s);
            s.days[key].bodyWeight = Number(weight);
            s.user.weight = Number(weight);
            return s;
        });
    }, [update, ensureToday, triggerVibe]);

    const updateProfile = useCallback((changes) => {
        triggerVibe();
        update(s => {
            Object.assign(s.user, changes);
            return s;
        });
    }, [update, triggerVibe]);

    const recalculateTDEE = useCallback(() => {
        triggerVibe();
        update(s => {
            const result = calculateTDEE(s.user);
            s.user.calorieTarget = result.calorieTarget;
            s.user.macros = result.macros;
            return s;
        });
    }, [update, triggerVibe]);

    // ─── QUESTS ───
    const claimQuestXP = useCallback((questId, xpReward) => {
        triggerVibe();
        update(s => {
            const date = todayKey();
            if (!s.claimedQuests[date]) s.claimedQuests[date] = [];
            if (!s.claimedQuests[date].includes(questId)) {
                s.claimedQuests[date].push(questId);
            }
            return s;
        });
    }, [update, triggerVibe]);

    // ─── SOCIAL REACTIONS ───
    const toggleSocialCheer = useCallback((itemId) => {
        triggerVibe();
        update(s => {
            if (!s.socialReactions[itemId]) {
                s.socialReactions[itemId] = { cheers: 1, userCheered: true };
            } else {
                const current = s.socialReactions[itemId];
                if (current.userCheered) {
                    current.cheers = Math.max(0, current.cheers - 1);
                    current.userCheered = false;
                } else {
                    current.cheers += 1;
                    current.userCheered = true;
                }
            }
            return s;
        });
    }, [update, triggerVibe]);

    // ─── ONBOARDING ───
    const completeOnboarding = useCallback((userProfile) => {
        triggerVibe();
        update(s => {
            Object.assign(s.user, userProfile);
            const calculated = calculateTDEE(s.user);
            s.user.calorieTarget = calculated.calorieTarget;
            s.user.macros = calculated.macros;
            s.onboardingComplete = true;
            return s;
        });
    }, [update, triggerVibe]);

    // ─── CHECK INS ───
    const logCheckIn = useCallback((photoDataUrl) => {
        triggerVibe();
        update(s => {
            const date = todayKey();
            if (s.checkIns && s.checkIns.some(c => c.date === date)) return s;
            if (!s.checkIns) s.checkIns = [];
            s.checkIns.push({ date, time: timeNow(), photoUri: photoDataUrl });
            return s;
        });
    }, [update, triggerVibe]);

    // ─── SCHEDULE ───
    const updateWorkoutSchedule = useCallback((dayIndex, templateId) => {
        triggerVibe();
        update(s => {
            s.workoutSchedule[dayIndex] = templateId;
            return s;
        });
    }, [update, triggerVibe]);

    // ─── DERIVED DATA & PRs ───
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

    const getPersonalRecords = useCallback(() => {
        const prs = {};
        const sorted = Object.keys(state.days).sort();
        sorted.forEach(key => {
            const d = state.days[key];
            (d.workouts || []).forEach(w => {
                (w.exercises || []).forEach(ex => {
                    const exName = ex.name || ex.exerciseId;
                    const maxWeight = Math.max(...(ex.sets || []).map(s => Number(s.weight) || 0), 0);
                    const bestSet = (ex.sets || []).reduce((b, s) => (Number(s.weight) || 0) > (Number(b.weight) || 0) ? s : b, { reps: 0, weight: 0 });

                    if (!prs[exName] || maxWeight > prs[exName].maxWeight) {
                        prs[exName] = {
                            exerciseName: exName,
                            maxWeight,
                            bestReps: bestSet.reps,
                            date: key,
                            estimated1RM: Math.round(maxWeight * (1 + (bestSet.reps / 30))),
                        };
                    }
                });
            });
        });
        return Object.values(prs);
    }, [state.days]);

    // ─── COACH HUB ACTIONS ───
    const toggleCoachRole = useCallback(() => {
        triggerVibe();
        update(s => {
            s.user.role = s.user.role === 'coach' ? 'client' : 'coach';
            return s;
        });
    }, [update, triggerVibe]);

    const sendCoachAdvice = useCallback((studentId, adviceText, newCals, newP, newC, newF) => {
        triggerVibe();
        update(s => {
            if (!s.coachAdvice) s.coachAdvice = [];
            s.coachAdvice.unshift({
                id: 'adv-' + Date.now(),
                studentId,
                date: todayKey(),
                text: adviceText,
                newTargetCals: Number(newCals),
                newP: Number(newP),
                newC: Number(newC),
                newF: Number(newF)
            });
            // Also update local mock student target
            const st = s.coachStudents?.find(x => x.id === studentId);
            if (st) {
                if (newCals) st.calTarget = Number(newCals);
                if (newP) st.pTarget = Number(newP);
                if (newC) st.cTarget = Number(newC);
                if (newF) st.fTarget = Number(newF);
                st.note = adviceText;
                st.status = 'ok';
            }
            return s;
        });
    }, [update, triggerVibe]);

    const applyCoachAdvice = useCallback((adviceId) => {
        triggerVibe();
        update(s => {
            const adv = s.coachAdvice?.find(x => x.id === adviceId);
            if (adv) {
                s.user.calorieTarget = adv.newTargetCals;
                s.user.macros = { p: adv.newP, c: adv.newC, f: adv.newF };
                s.coachAdvice = s.coachAdvice.filter(x => x.id !== adviceId);
            }
            return s;
        });
    }, [update, triggerVibe]);

    // ─── SAEED PROTOCOL ACTIONS ───
    const getSaeedTodayLog = useCallback((dateKey) => {
        const key = dateKey || todayKey();
        const existing = state.saeedProtocol?.logs?.[key];
        return existing || {
            bendDone: false,
            morningVacuumsDone: false,
            pushups: 0,
            vacuumsSets: 0,
            hollowHoldsSets: 0,
            doorframeRows: 0,
            growthSession: {
                pikePushups: false,
                splitSquats: false,
                weightedVups: false,
                bicepCurls: false,
                plankDownwardDog: false
            }
        };
    }, [state.saeedProtocol]);

    const logSaeedBend = useCallback((dateKey) => {
        triggerVibe();
        const key = dateKey || todayKey();
        update(s => {
            if (!s.saeedProtocol) s.saeedProtocol = { dayNumber: 1, logs: {} };
            if (!s.saeedProtocol.logs[key]) {
                s.saeedProtocol.logs[key] = {
                    bendDone: true, morningVacuumsDone: false, pushups: 0, vacuumsSets: 0, hollowHoldsSets: 0, doorframeRows: 0,
                    growthSession: { pikePushups: false, splitSquats: false, weightedVups: false, bicepCurls: false, plankDownwardDog: false }
                };
            } else {
                s.saeedProtocol.logs[key].bendDone = !s.saeedProtocol.logs[key].bendDone;
            }
            return s;
        });
    }, [update, triggerVibe]);

    const logSaeedMorningVacuums = useCallback((dateKey) => {
        triggerVibe();
        const key = dateKey || todayKey();
        update(s => {
            if (!s.saeedProtocol) s.saeedProtocol = { dayNumber: 1, logs: {} };
            if (!s.saeedProtocol.logs[key]) {
                s.saeedProtocol.logs[key] = {
                    bendDone: false, morningVacuumsDone: true, pushups: 0, vacuumsSets: 5, hollowHoldsSets: 0, doorframeRows: 0,
                    growthSession: { pikePushups: false, splitSquats: false, weightedVups: false, bicepCurls: false, plankDownwardDog: false }
                };
            } else {
                s.saeedProtocol.logs[key].morningVacuumsDone = !s.saeedProtocol.logs[key].morningVacuumsDone;
                if (s.saeedProtocol.logs[key].morningVacuumsDone && s.saeedProtocol.logs[key].vacuumsSets < 5) {
                    s.saeedProtocol.logs[key].vacuumsSets = 5;
                }
            }
            return s;
        });
    }, [update, triggerVibe]);

    const logSaeedAccumulation = useCallback((type, delta, dateKey) => {
        triggerVibe();
        const key = dateKey || todayKey();
        update(s => {
            if (!s.saeedProtocol) s.saeedProtocol = { dayNumber: 1, logs: {} };
            if (!s.saeedProtocol.logs[key]) {
                s.saeedProtocol.logs[key] = {
                    bendDone: false, morningVacuumsDone: false, pushups: 0, vacuumsSets: 0, hollowHoldsSets: 0, doorframeRows: 0,
                    growthSession: { pikePushups: false, splitSquats: false, weightedVups: false, bicepCurls: false, plankDownwardDog: false }
                };
            }
            const log = s.saeedProtocol.logs[key];
            if (type === 'pushups') log.pushups = Math.max(0, (log.pushups || 0) + delta);
            if (type === 'vacuumsSets') log.vacuumsSets = Math.max(0, (log.vacuumsSets || 0) + delta);
            if (type === 'hollowHoldsSets') log.hollowHoldsSets = Math.max(0, (log.hollowHoldsSets || 0) + delta);
            if (type === 'doorframeRows') log.doorframeRows = Math.max(0, (log.doorframeRows || 0) + delta);
            return s;
        });
    }, [update, triggerVibe]);

    const toggleSaeedGrowthExercise = useCallback((exKey, dateKey) => {
        triggerVibe();
        const key = dateKey || todayKey();
        update(s => {
            if (!s.saeedProtocol) s.saeedProtocol = { dayNumber: 1, logs: {} };
            if (!s.saeedProtocol.logs[key]) {
                s.saeedProtocol.logs[key] = {
                    bendDone: false, morningVacuumsDone: false, pushups: 0, vacuumsSets: 0, hollowHoldsSets: 0, doorframeRows: 0,
                    growthSession: { pikePushups: false, splitSquats: false, weightedVups: false, bicepCurls: false, plankDownwardDog: false }
                };
            }
            if (!s.saeedProtocol.logs[key].growthSession) {
                s.saeedProtocol.logs[key].growthSession = { pikePushups: false, splitSquats: false, weightedVups: false, bicepCurls: false, plankDownwardDog: false };
            }
            const gs = s.saeedProtocol.logs[key].growthSession;
            gs[exKey] = !gs[exKey];
            return s;
        });
    }, [update, triggerVibe]);

    const setSaeedDayNumber = useCallback((dayNum) => {
        triggerVibe();
        update(s => {
            if (!s.saeedProtocol) s.saeedProtocol = { dayNumber: 1, logs: {} };
            s.saeedProtocol.dayNumber = dayNum;
            return s;
        });
    }, [update, triggerVibe]);

    const updateSaeedNotificationSettings = useCallback((settings) => {
        triggerVibe();
        update(s => {
            if (!s.saeedProtocol) s.saeedProtocol = { dayNumber: 1, logs: {}, notificationSettings: {} };
            s.saeedProtocol.notificationSettings = { ...s.saeedProtocol.notificationSettings, ...settings };
            return s;
        });
    }, [update, triggerVibe]);

    return {
        state, update,
        addMeal, removeMeal,
        addWater,
        startWorkout, addExerciseToActive, updateSet, addSet, removeSet, finishWorkout, cancelWorkout, logWorkoutSession,
        logBodyWeight, updateProfile, recalculateTDEE, completeOnboarding, logCheckIn,
        updateWorkoutSchedule, claimQuestXP, toggleSocialCheer,
        toggleCoachRole, sendCoachAdvice, applyCoachAdvice,
        getSaeedTodayLog, logSaeedBend, logSaeedMorningVacuums, logSaeedAccumulation, toggleSaeedGrowthExercise, setSaeedDayNumber, updateSaeedNotificationSettings,
        getToday, getTodayTotals, getStreak, getLast7Days, getWeightHistory, getPersonalRecords,
    };
}

