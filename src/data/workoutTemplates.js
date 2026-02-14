// ─── WORKOUT TEMPLATES ───

export const WORKOUT_TEMPLATES = [
    {
        id: 'push',
        name: 'Push Day',
        desc: 'Chest, Shoulders, Triceps',
        exercises: [
            { exerciseId: 'bench_press', name: 'Bench Press', defaultSets: 4 },
            { exerciseId: 'overhead_press', name: 'Overhead Press', defaultSets: 3 },
            { exerciseId: 'incline_db_press', name: 'Incline DB Press', defaultSets: 3 },
            { exerciseId: 'lateral_raises', name: 'Lateral Raises', defaultSets: 3 },
            { exerciseId: 'tricep_pushdown', name: 'Tricep Pushdown', defaultSets: 3 },
        ]
    },
    {
        id: 'pull',
        name: 'Pull Day',
        desc: 'Back, Biceps',
        exercises: [
            { exerciseId: 'barbell_row', name: 'Barbell Row', defaultSets: 4 },
            { exerciseId: 'pull_ups', name: 'Pull Ups', defaultSets: 3 },
            { exerciseId: 'lat_pulldown', name: 'Lat Pulldown', defaultSets: 3 },
            { exerciseId: 'cable_row', name: 'Cable Row', defaultSets: 3 },
            { exerciseId: 'bicep_curls', name: 'Bicep Curls', defaultSets: 3 },
        ]
    },
    {
        id: 'legs',
        name: 'Leg Day',
        desc: 'Quads, Hamstrings, Glutes',
        exercises: [
            { exerciseId: 'squat', name: 'Squat', defaultSets: 4 },
            { exerciseId: 'romanian_deadlift', name: 'Romanian Deadlift', defaultSets: 3 },
            { exerciseId: 'leg_press', name: 'Leg Press', defaultSets: 3 },
            { exerciseId: 'leg_curl', name: 'Leg Curl', defaultSets: 3 },
            { exerciseId: 'calf_raises', name: 'Calf Raises', defaultSets: 4 },
        ]
    },
    {
        id: 'upper',
        name: 'Upper Body',
        desc: 'Full upper body compound',
        exercises: [
            { exerciseId: 'bench_press', name: 'Bench Press', defaultSets: 4 },
            { exerciseId: 'barbell_row', name: 'Barbell Row', defaultSets: 4 },
            { exerciseId: 'overhead_press', name: 'Overhead Press', defaultSets: 3 },
            { exerciseId: 'pull_ups', name: 'Pull Ups', defaultSets: 3 },
            { exerciseId: 'dips', name: 'Dips', defaultSets: 3 },
        ]
    },
    {
        id: 'full_body',
        name: 'Full Body',
        desc: 'Hit everything in one session',
        exercises: [
            { exerciseId: 'squat', name: 'Squat', defaultSets: 3 },
            { exerciseId: 'bench_press', name: 'Bench Press', defaultSets: 3 },
            { exerciseId: 'barbell_row', name: 'Barbell Row', defaultSets: 3 },
            { exerciseId: 'overhead_press', name: 'Overhead Press', defaultSets: 3 },
            { exerciseId: 'romanian_deadlift', name: 'Romanian Deadlift', defaultSets: 3 },
        ]
    },
];
