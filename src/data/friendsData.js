// Simulated friends data — replace with real API calls later

const FRIEND_NAMES = [
    { id: 'ahmad', name: 'Ahmad', avatar: '#D62828', goal: 'muscle_gain', level: 8 },
    { id: 'omar', name: 'Omar', avatar: '#3B82F6', goal: 'cutting', level: 12 },
    { id: 'khalid', name: 'Khalid', avatar: '#22C55E', goal: 'maintain', level: 5 },
    { id: 'faisal', name: 'Faisal', avatar: '#FFB800', goal: 'muscle_gain', level: 15 },
    { id: 'tariq', name: 'Tariq', avatar: '#8B5CF6', goal: 'cutting', level: 3 },
];

const WORKOUT_POOL = [
    {
        title: 'Push Day', time: '09:15', exercises: [
            { exerciseId: 'bench_press', name: 'Bench Press', sets: [{ reps: 10, weight: 80 }, { reps: 8, weight: 85 }, { reps: 6, weight: 90 }] },
            { exerciseId: 'overhead_press', name: 'Overhead Press', sets: [{ reps: 10, weight: 50 }, { reps: 8, weight: 55 }] },
            { exerciseId: 'incline_db_press', name: 'Incline DB Press', sets: [{ reps: 12, weight: 28 }, { reps: 10, weight: 30 }] },
            { exerciseId: 'lateral_raises', name: 'Lateral Raises', sets: [{ reps: 15, weight: 10 }, { reps: 15, weight: 10 }] },
        ]
    },
    {
        title: 'Pull Day', time: '07:30', exercises: [
            { exerciseId: 'barbell_row', name: 'Barbell Row', sets: [{ reps: 10, weight: 70 }, { reps: 8, weight: 75 }, { reps: 8, weight: 75 }] },
            { exerciseId: 'pull_ups', name: 'Pull Ups', sets: [{ reps: 8, weight: 0 }, { reps: 6, weight: 0 }] },
            { exerciseId: 'lat_pulldown', name: 'Lat Pulldown', sets: [{ reps: 12, weight: 55 }, { reps: 10, weight: 60 }] },
            { exerciseId: 'bicep_curls', name: 'Bicep Curls', sets: [{ reps: 12, weight: 14 }, { reps: 12, weight: 14 }] },
        ]
    },
    {
        title: 'Leg Day', time: '06:00', exercises: [
            { exerciseId: 'squat', name: 'Squat', sets: [{ reps: 8, weight: 100 }, { reps: 8, weight: 100 }, { reps: 6, weight: 110 }] },
            { exerciseId: 'romanian_deadlift', name: 'Romanian Deadlift', sets: [{ reps: 10, weight: 80 }, { reps: 10, weight: 80 }] },
            { exerciseId: 'leg_press', name: 'Leg Press', sets: [{ reps: 12, weight: 150 }, { reps: 10, weight: 160 }] },
            { exerciseId: 'calf_raises', name: 'Calf Raises', sets: [{ reps: 15, weight: 60 }, { reps: 15, weight: 60 }] },
        ]
    },
    {
        title: 'Upper Body', time: '16:30', exercises: [
            { exerciseId: 'bench_press', name: 'Bench Press', sets: [{ reps: 8, weight: 90 }, { reps: 6, weight: 95 }] },
            { exerciseId: 'barbell_row', name: 'Barbell Row', sets: [{ reps: 10, weight: 65 }, { reps: 8, weight: 70 }] },
            { exerciseId: 'dips', name: 'Dips', sets: [{ reps: 12, weight: 0 }, { reps: 10, weight: 0 }] },
        ]
    },
    {
        title: 'Full Body HIIT', time: '05:45', exercises: [
            { exerciseId: 'squat', name: 'Squat', sets: [{ reps: 15, weight: 60 }] },
            { exerciseId: 'bench_press', name: 'Bench Press', sets: [{ reps: 15, weight: 50 }] },
            { exerciseId: 'barbell_row', name: 'Barbell Row', sets: [{ reps: 15, weight: 40 }] },
        ]
    },
];

// Deterministic seed based on date so friends do the same workout each day
function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export function getFriendsFeed() {
    const today = new Date();
    const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    return FRIEND_NAMES.map((friend, i) => {
        const seed = daySeed + i * 7;
        const didWorkout = seededRandom(seed) > 0.25; // 75% chance they worked out
        const workoutIdx = Math.floor(seededRandom(seed + 1) * WORKOUT_POOL.length);
        const streak = Math.floor(seededRandom(seed + 2) * 30) + 1;
        const weeklyXP = Math.floor(seededRandom(seed + 3) * 400) + 100;
        const hitTarget = seededRandom(seed + 4) > 0.4;

        return {
            ...friend,
            streak,
            weeklyXP,
            hitTarget,
            workout: didWorkout ? {
                ...WORKOUT_POOL[workoutIdx],
                // Randomize weights slightly per friend
                exercises: WORKOUT_POOL[workoutIdx].exercises.map(ex => ({
                    ...ex,
                    sets: ex.sets.map(s => ({
                        ...s,
                        weight: Math.round(s.weight * (0.7 + seededRandom(seed + s.weight) * 0.6)),
                    }))
                }))
            } : null,
        };
    });
}

// Leaderboard: your profile + friends ranked by weekly XP
export function getLeaderboard(yourName, yourWeeklyXP, yourLevel, yourStreak) {
    const feed = getFriendsFeed();
    const all = [
        { id: 'you', name: yourName, avatar: '#E0FF00', level: yourLevel, weeklyXP: yourWeeklyXP, streak: yourStreak, isYou: true },
        ...feed.map(f => ({ ...f, isYou: false })),
    ];
    return all.sort((a, b) => b.weeklyXP - a.weeklyXP);
}

export const LEAGUE_TIERS = [
    { name: 'Bronze', color: '#CD7F32', minRank: 0 },
    { name: 'Silver', color: '#C0C0C0', minRank: 0 },
    { name: 'Gold', color: '#FFD700', minRank: 0 },
    { name: 'Diamond', color: '#3B82F6', minRank: 0 },
    { name: 'Champion', color: '#8B5CF6', minRank: 0 },
];

export function getCurrentLeagueTier(level) {
    if (level >= 20) return LEAGUE_TIERS[4];
    if (level >= 15) return LEAGUE_TIERS[3];
    if (level >= 10) return LEAGUE_TIERS[2];
    if (level >= 5) return LEAGUE_TIERS[1];
    return LEAGUE_TIERS[0];
}
