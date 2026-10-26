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
    // Max-volume Day 1 from Saeed's plan (see src/data/secretPlan.js).
    // `scheme` is only read by the plan view — startWorkout uses defaultSets.
    {
        id: 'pull_a',
        name: 'Pull A',
        desc: 'Back, Biceps, Rear Delts — 2h max volume',
        note: 'Rest 2-3 min on heavy compounds, 60-90 s on isolation.',
        exercises: [
            { exerciseId: 'lat_pulldown', name: 'Wide-Grip Lat Pulldown', defaultSets: 4, scheme: '4 x 8-10 (2 x 15 warm-up first)' },
            { exerciseId: 'pull_ups', name: 'Pull-Ups', defaultSets: 3, scheme: '3 x to failure' },
            { exerciseId: 'chest_supported_row', name: 'Chest-Supported Row', defaultSets: 4, scheme: '4 x 8-10' },
            { exerciseId: 'barbell_row', name: 'Underhand Barbell Row', defaultSets: 3, scheme: '3 x 8-10' },
            { exerciseId: 'straight_arm_pulldown', name: 'Straight-Arm Pulldown', defaultSets: 4, scheme: '4 x 12-15' },
            { exerciseId: 'face_pull', name: 'Face Pull', defaultSets: 4, scheme: '4 x 15' },
            { exerciseId: 'rear_delt_fly', name: 'Reverse Pec Deck', defaultSets: 3, scheme: '3 x 12-15' },
            { exerciseId: 'incline_curl', name: 'Incline Dumbbell Curl', defaultSets: 4, scheme: '4 x 10-12' },
            { exerciseId: 'hammer_curl', name: 'Hammer Curl (EZ-bar or cable)', defaultSets: 3, scheme: '3 x 10-12' },
        ]
    },
    {
        id: 'core_finisher',
        name: 'Core Finisher',
        desc: 'Weighted abs — 3x a week',
        exercises: [
            { exerciseId: 'cable_crunch', name: 'Cable Crunch', defaultSets: 3, scheme: '3 x 12-15' },
            { exerciseId: 'hanging_leg_raise', name: 'Hanging Leg Raise', defaultSets: 3, scheme: '3 x 10-12' },
        ]
    },
];
