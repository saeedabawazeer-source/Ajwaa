// Exercise database — structured catalog for workout tracking
const EXERCISE_DB = [
    // Chest
    { id: 'bench_press', name: 'Bench Press', muscle: 'Chest', equipment: 'Barbell', type: 'strength' },
    { id: 'incline_db_press', name: 'Incline DB Press', muscle: 'Chest', equipment: 'Dumbbell', type: 'strength' },
    { id: 'cable_flyes', name: 'Cable Flyes', muscle: 'Chest', equipment: 'Cable', type: 'strength' },
    { id: 'dips', name: 'Dips', muscle: 'Chest', equipment: 'Bodyweight', type: 'strength' },
    { id: 'push_ups', name: 'Push Ups', muscle: 'Chest', equipment: 'Bodyweight', type: 'strength' },

    // Back
    { id: 'deadlift', name: 'Deadlift', muscle: 'Back', equipment: 'Barbell', type: 'strength' },
    { id: 'barbell_row', name: 'Barbell Row', muscle: 'Back', equipment: 'Barbell', type: 'strength' },
    { id: 'lat_pulldown', name: 'Lat Pulldown', muscle: 'Back', equipment: 'Cable', type: 'strength' },
    { id: 'pull_ups', name: 'Pull Ups', muscle: 'Back', equipment: 'Bodyweight', type: 'strength' },
    { id: 'seated_row', name: 'Seated Cable Row', muscle: 'Back', equipment: 'Cable', type: 'strength' },

    // Shoulders
    { id: 'ohp', name: 'Overhead Press', muscle: 'Shoulders', equipment: 'Barbell', type: 'strength' },
    { id: 'lateral_raise', name: 'Lateral Raise', muscle: 'Shoulders', equipment: 'Dumbbell', type: 'strength' },
    { id: 'face_pull', name: 'Face Pull', muscle: 'Shoulders', equipment: 'Cable', type: 'strength' },
    { id: 'front_raise', name: 'Front Raise', muscle: 'Shoulders', equipment: 'Dumbbell', type: 'strength' },

    // Legs
    { id: 'squat', name: 'Squat', muscle: 'Legs', equipment: 'Barbell', type: 'strength' },
    { id: 'leg_press', name: 'Leg Press', muscle: 'Legs', equipment: 'Machine', type: 'strength' },
    { id: 'leg_curl', name: 'Leg Curl', muscle: 'Legs', equipment: 'Machine', type: 'strength' },
    { id: 'leg_extension', name: 'Leg Extension', muscle: 'Legs', equipment: 'Machine', type: 'strength' },
    { id: 'lunges', name: 'Lunges', muscle: 'Legs', equipment: 'Dumbbell', type: 'strength' },
    { id: 'calf_raise', name: 'Calf Raise', muscle: 'Legs', equipment: 'Machine', type: 'strength' },
    { id: 'romanian_dl', name: 'Romanian Deadlift', muscle: 'Legs', equipment: 'Barbell', type: 'strength' },

    // Arms
    { id: 'bicep_curl', name: 'Bicep Curl', muscle: 'Arms', equipment: 'Dumbbell', type: 'strength' },
    { id: 'tricep_pushdown', name: 'Tricep Pushdown', muscle: 'Arms', equipment: 'Cable', type: 'strength' },
    { id: 'hammer_curl', name: 'Hammer Curl', muscle: 'Arms', equipment: 'Dumbbell', type: 'strength' },
    { id: 'skull_crusher', name: 'Skull Crusher', muscle: 'Arms', equipment: 'Barbell', type: 'strength' },

    // Core
    { id: 'plank', name: 'Plank', muscle: 'Core', equipment: 'Bodyweight', type: 'strength' },
    { id: 'ab_crunch', name: 'Ab Crunch', muscle: 'Core', equipment: 'Bodyweight', type: 'strength' },
    { id: 'hanging_leg_raise', name: 'Hanging Leg Raise', muscle: 'Core', equipment: 'Bodyweight', type: 'strength' },
    { id: 'cable_crunch', name: 'Cable Crunch', muscle: 'Core', equipment: 'Cable', type: 'strength' },

    // Cardio
    { id: 'treadmill', name: 'Treadmill Run', muscle: 'Cardio', equipment: 'Machine', type: 'cardio' },
    { id: 'jump_rope', name: 'Jump Rope', muscle: 'Cardio', equipment: 'None', type: 'cardio' },
    { id: 'cycling', name: 'Cycling', muscle: 'Cardio', equipment: 'Machine', type: 'cardio' },
    { id: 'rowing', name: 'Rowing', muscle: 'Cardio', equipment: 'Machine', type: 'cardio' },
    { id: 'stair_climber', name: 'Stair Climber', muscle: 'Cardio', equipment: 'Machine', type: 'cardio' },
];

export function getExercises() { return EXERCISE_DB; }

export function getExerciseById(id) { return EXERCISE_DB.find(e => e.id === id); }

export function searchExercises(query) {
    const q = query.toLowerCase();
    return EXERCISE_DB.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.muscle.toLowerCase().includes(q) ||
        e.equipment.toLowerCase().includes(q)
    );
}

export function getExercisesByMuscle(muscle) {
    return EXERCISE_DB.filter(e => e.muscle === muscle);
}

export function getMuscleGroups() {
    return [...new Set(EXERCISE_DB.map(e => e.muscle))];
}

export default EXERCISE_DB;
