// ─────────────────────────────────────────────────────────────────────
// AJWAA EXERCISE LIBRARY
// A comprehensive open exercise catalog compiled from public/open-source
// exercise databases (movement names & coaching cues are factual data).
// Fields: id, name, muscle, equipment, mechanic, info
// ─────────────────────────────────────────────────────────────────────
const EXERCISE_DB = [
    // ── CHEST ────────────────────────────────────────────────────────
    { id: 'bench_press', name: 'Barbell Bench Press', muscle: 'Chest', equipment: 'Barbell', mechanic: 'Compound', info: 'Pin shoulder blades, lower bar to mid-chest, press to lockout.' },
    { id: 'incline_bench', name: 'Incline Barbell Press', muscle: 'Chest', equipment: 'Barbell', mechanic: 'Compound', info: 'Set bench 30-45°, press to target the upper chest.' },
    { id: 'decline_bench', name: 'Decline Bench Press', muscle: 'Chest', equipment: 'Barbell', mechanic: 'Compound', info: 'Press on a decline to bias the lower chest.' },
    { id: 'db_bench', name: 'Dumbbell Bench Press', muscle: 'Chest', equipment: 'Dumbbell', mechanic: 'Compound', info: 'Press dumbbells with a deep, controlled stretch at the bottom.' },
    { id: 'incline_db_press', name: 'Incline Dumbbell Press', muscle: 'Chest', equipment: 'Dumbbell', mechanic: 'Compound', info: 'Upper-chest press with dumbbells for a fuller range of motion.' },
    { id: 'db_fly', name: 'Dumbbell Fly', muscle: 'Chest', equipment: 'Dumbbell', mechanic: 'Isolation', info: 'Open arms in a wide arc, feel the stretch, squeeze back together.' },
    { id: 'cable_flyes', name: 'Cable Crossover', muscle: 'Chest', equipment: 'Cable', mechanic: 'Isolation', info: 'Bring handles together in front of the chest with constant tension.' },
    { id: 'pec_deck', name: 'Pec Deck Machine', muscle: 'Chest', equipment: 'Machine', mechanic: 'Isolation', info: 'Machine fly to isolate the chest through a fixed path.' },
    { id: 'push_ups', name: 'Push-Up', muscle: 'Chest', equipment: 'Bodyweight', mechanic: 'Compound', info: 'Keep a rigid plank line, chest to deck, full lockout at top.' },
    { id: 'incline_pushup', name: 'Incline Push-Up', muscle: 'Chest', equipment: 'Bodyweight', mechanic: 'Compound', info: 'Hands elevated — easier push-up to build pressing volume.' },
    { id: 'decline_pushup', name: 'Decline Push-Up', muscle: 'Chest', equipment: 'Bodyweight', mechanic: 'Compound', info: 'Feet elevated to shift load to the upper chest.' },
    { id: 'dips', name: 'Chest Dip', muscle: 'Chest', equipment: 'Bodyweight', mechanic: 'Compound', info: 'Lean forward on parallel bars, lower deep, press back up.' },
    { id: 'machine_chest_press', name: 'Machine Chest Press', muscle: 'Chest', equipment: 'Machine', mechanic: 'Compound', info: 'Seated press on a fixed path — great for safe failure.' },
    { id: 'landmine_press', name: 'Landmine Press', muscle: 'Chest', equipment: 'Barbell', mechanic: 'Compound', info: 'Press a barbell anchored in a landmine at an angle.' },

    // ── BACK ─────────────────────────────────────────────────────────
    { id: 'deadlift', name: 'Conventional Deadlift', muscle: 'Back', equipment: 'Barbell', mechanic: 'Compound', info: 'Hinge at the hips, flat back, drive the floor away.' },
    { id: 'barbell_row', name: 'Barbell Row', muscle: 'Back', equipment: 'Barbell', mechanic: 'Compound', info: 'Hinge to ~45°, pull the bar to your lower ribs.' },
    { id: 'pull_ups', name: 'Pull-Up', muscle: 'Back', equipment: 'Bodyweight', mechanic: 'Compound', info: 'Pull chin over the bar from a dead hang, control the descent.' },
    { id: 'chin_ups', name: 'Chin-Up', muscle: 'Back', equipment: 'Bodyweight', mechanic: 'Compound', info: 'Underhand pull-up — hits lats and biceps hard.' },
    { id: 'lat_pulldown', name: 'Lat Pulldown', muscle: 'Back', equipment: 'Cable', mechanic: 'Compound', info: 'Pull the bar to your collarbone, drive elbows down and back.' },
    { id: 'seated_row', name: 'Seated Cable Row', muscle: 'Back', equipment: 'Cable', mechanic: 'Compound', info: 'Row to your torso, squeeze the shoulder blades together.' },
    { id: 'db_row', name: 'One-Arm Dumbbell Row', muscle: 'Back', equipment: 'Dumbbell', mechanic: 'Compound', info: 'Brace on a bench, row the dumbbell to your hip.' },
    { id: 'tbar_row', name: 'T-Bar Row', muscle: 'Back', equipment: 'Barbell', mechanic: 'Compound', info: 'Heavy hinge row using a landmine/T-bar setup.' },
    { id: 'chest_supported_row', name: 'Chest-Supported Row', muscle: 'Back', equipment: 'Dumbbell', mechanic: 'Isolation', info: 'Row on an incline bench to remove lower-back strain.' },
    { id: 'straight_arm_pulldown', name: 'Straight-Arm Pulldown', muscle: 'Back', equipment: 'Cable', mechanic: 'Isolation', info: 'Keep arms straight, sweep the bar to your thighs to isolate lats.' },
    { id: 'face_pull', name: 'Face Pull', muscle: 'Back', equipment: 'Cable', mechanic: 'Isolation', info: 'Pull rope to your face, external rotate — bulletproofs shoulders.' },
    { id: 'back_extension', name: 'Back Extension', muscle: 'Back', equipment: 'Bodyweight', mechanic: 'Isolation', info: 'Hinge on a Roman chair, raise torso to strengthen the lower back.' },
    { id: 'rack_pull', name: 'Rack Pull', muscle: 'Back', equipment: 'Barbell', mechanic: 'Compound', info: 'Deadlift from pins above the knee to overload the upper pull.' },

    // ── SHOULDERS ────────────────────────────────────────────────────
    { id: 'ohp', name: 'Overhead Press', muscle: 'Shoulders', equipment: 'Barbell', mechanic: 'Compound', info: 'Strict press from the collarbone to lockout overhead.' },
    { id: 'db_shoulder_press', name: 'Dumbbell Shoulder Press', muscle: 'Shoulders', equipment: 'Dumbbell', mechanic: 'Compound', info: 'Press dumbbells overhead with a stable core.' },
    { id: 'arnold_press', name: 'Arnold Press', muscle: 'Shoulders', equipment: 'Dumbbell', mechanic: 'Compound', info: 'Rotate palms forward as you press — hits all three delts.' },
    { id: 'push_press', name: 'Push Press', muscle: 'Shoulders', equipment: 'Barbell', mechanic: 'Compound', info: 'Use a leg drive to overload the overhead lockout.' },
    { id: 'lateral_raise', name: 'Dumbbell Lateral Raise', muscle: 'Shoulders', equipment: 'Dumbbell', mechanic: 'Isolation', info: 'Raise arms to shoulder height, lead with the elbows.' },
    { id: 'cable_lateral', name: 'Cable Lateral Raise', muscle: 'Shoulders', equipment: 'Cable', mechanic: 'Isolation', info: 'Constant-tension lateral raise for the side delt.' },
    { id: 'front_raise', name: 'Front Raise', muscle: 'Shoulders', equipment: 'Dumbbell', mechanic: 'Isolation', info: 'Raise a plate or dumbbell to eye level for the front delt.' },
    { id: 'rear_delt_fly', name: 'Reverse Pec Deck', muscle: 'Shoulders', equipment: 'Machine', mechanic: 'Isolation', info: 'Machine fly in reverse to isolate the rear delt.' },
    { id: 'db_rear_fly', name: 'Bent-Over Rear Delt Fly', muscle: 'Shoulders', equipment: 'Dumbbell', mechanic: 'Isolation', info: 'Hinge and fly dumbbells out to hit the rear delts.' },
    { id: 'upright_row', name: 'Upright Row', muscle: 'Shoulders', equipment: 'Barbell', mechanic: 'Compound', info: 'Pull the bar up your torso with a wide grip for side delts.' },
    { id: 'shrug', name: 'Barbell Shrug', muscle: 'Shoulders', equipment: 'Barbell', mechanic: 'Isolation', info: 'Elevate shoulders straight up toward the ears, pause, lower.' },
    { id: 'handstand_pushup', name: 'Wall Handstand Push-Up', muscle: 'Shoulders', equipment: 'Bodyweight', mechanic: 'Compound', info: 'Press your bodyweight vertically from a handstand against a wall.' },

    // ── LEGS ─────────────────────────────────────────────────────────
    { id: 'squat', name: 'Barbell Back Squat', muscle: 'Legs', equipment: 'Barbell', mechanic: 'Compound', info: 'Brace, sit between your hips, drive up through mid-foot.' },
    { id: 'front_squat', name: 'Front Squat', muscle: 'Legs', equipment: 'Barbell', mechanic: 'Compound', info: 'Bar racked on front delts — upright torso, quad bias.' },
    { id: 'leg_press', name: 'Leg Press', muscle: 'Legs', equipment: 'Machine', mechanic: 'Compound', info: 'Press the sled with controlled depth, no knee lockout slam.' },
    { id: 'hack_squat', name: 'Hack Squat', muscle: 'Legs', equipment: 'Machine', mechanic: 'Compound', info: 'Machine squat for deep, supported quad work.' },
    { id: 'romanian_dl', name: 'Romanian Deadlift', muscle: 'Legs', equipment: 'Barbell', mechanic: 'Compound', info: 'Hinge with soft knees, feel the hamstring stretch, stand tall.' },
    { id: 'walking_lunges', name: 'Walking Lunge', muscle: 'Legs', equipment: 'Dumbbell', mechanic: 'Compound', info: 'Step forward, drop the back knee, drive through the front heel.' },
    { id: 'bulgarian_split', name: 'Bulgarian Split Squat', muscle: 'Legs', equipment: 'Dumbbell', mechanic: 'Compound', info: 'Rear foot elevated, drop straight down, brutal single-leg builder.' },
    { id: 'leg_extension', name: 'Leg Extension', muscle: 'Legs', equipment: 'Machine', mechanic: 'Isolation', info: 'Extend to full lockout, squeeze the quad at the top.' },
    { id: 'leg_curl', name: 'Lying Leg Curl', muscle: 'Legs', equipment: 'Machine', mechanic: 'Isolation', info: 'Curl heels to glutes to isolate the hamstrings.' },
    { id: 'seated_leg_curl', name: 'Seated Leg Curl', muscle: 'Legs', equipment: 'Machine', mechanic: 'Isolation', info: 'Seated hamstring curl with a deep stretch.' },
    { id: 'calf_raise', name: 'Standing Calf Raise', muscle: 'Legs', equipment: 'Machine', mechanic: 'Isolation', info: 'Full stretch at the bottom, hard pause at the top.' },
    { id: 'seated_calf', name: 'Seated Calf Raise', muscle: 'Legs', equipment: 'Machine', mechanic: 'Isolation', info: 'Targets the soleus with the knee bent.' },
    { id: 'hip_thrust', name: 'Barbell Hip Thrust', muscle: 'Legs', equipment: 'Barbell', mechanic: 'Compound', info: 'Shoulders on a bench, drive hips up, squeeze the glutes.' },
    { id: 'goblet_squat', name: 'Goblet Squat', muscle: 'Legs', equipment: 'Dumbbell', mechanic: 'Compound', info: 'Hold a dumbbell at chest height and squat deep.' },
    { id: 'step_up', name: 'Box Step-Up', muscle: 'Legs', equipment: 'Dumbbell', mechanic: 'Compound', info: 'Drive up onto a box with one leg, control the descent.' },
    { id: 'leg_press_calf', name: 'Leg Press Calf Raise', muscle: 'Legs', equipment: 'Machine', mechanic: 'Isolation', info: 'Press through the balls of your feet on the sled edge.' },

    // ── ARMS ─────────────────────────────────────────────────────────
    { id: 'bicep_curl', name: 'Dumbbell Bicep Curl', muscle: 'Arms', equipment: 'Dumbbell', mechanic: 'Isolation', info: 'Curl with elbows pinned, no swinging, full squeeze at top.' },
    { id: 'barbell_curl', name: 'Barbell Curl', muscle: 'Arms', equipment: 'Barbell', mechanic: 'Isolation', info: 'Strict barbell curl for overall bicep mass.' },
    { id: 'hammer_curl', name: 'Hammer Curl', muscle: 'Arms', equipment: 'Dumbbell', mechanic: 'Isolation', info: 'Neutral-grip curl for brachialis and forearm thickness.' },
    { id: 'preacher_curl', name: 'Preacher Curl', muscle: 'Arms', equipment: 'Barbell', mechanic: 'Isolation', info: 'Arms braced on a pad to remove all momentum.' },
    { id: 'incline_curl', name: 'Incline Dumbbell Curl', muscle: 'Arms', equipment: 'Dumbbell', mechanic: 'Isolation', info: 'Curl on an incline for a long bicep stretch.' },
    { id: 'cable_curl', name: 'Cable Curl', muscle: 'Arms', equipment: 'Cable', mechanic: 'Isolation', info: 'Constant-tension curl using a low pulley.' },
    { id: 'tricep_pushdown', name: 'Tricep Pushdown', muscle: 'Arms', equipment: 'Cable', mechanic: 'Isolation', info: 'Pin elbows, press the rope/bar to full lockout.' },
    { id: 'skull_crusher', name: 'Skull Crusher', muscle: 'Arms', equipment: 'Barbell', mechanic: 'Isolation', info: 'Lower the bar to your forehead, extend back up.' },
    { id: 'oh_tricep_ext', name: 'Overhead Tricep Extension', muscle: 'Arms', equipment: 'Cable', mechanic: 'Isolation', info: 'Extend overhead for the long head of the tricep.' },
    { id: 'db_kickback', name: 'Dumbbell Kickback', muscle: 'Arms', equipment: 'Dumbbell', mechanic: 'Isolation', info: 'Hinge and extend the arm back to hit the tricep peak.' },
    { id: 'close_grip_bench', name: 'Close-Grip Bench Press', muscle: 'Arms', equipment: 'Barbell', mechanic: 'Compound', info: 'Narrow press to overload the triceps.' },
    { id: 'diamond_pushup', name: 'Diamond Push-Up', muscle: 'Arms', equipment: 'Bodyweight', mechanic: 'Compound', info: 'Hands form a diamond — bodyweight tricep finisher.' },
    { id: 'wrist_curl', name: 'Wrist Curl', muscle: 'Arms', equipment: 'Dumbbell', mechanic: 'Isolation', info: 'Curl the wrist to build the forearm flexors.' },

    // ── CORE ─────────────────────────────────────────────────────────
    { id: 'plank', name: 'Plank', muscle: 'Core', equipment: 'Bodyweight', mechanic: 'Isolation', info: 'Rigid straight line from head to heels, brace hard.' },
    { id: 'side_plank', name: 'Side Plank', muscle: 'Core', equipment: 'Bodyweight', mechanic: 'Isolation', info: 'Hold a straight line on one forearm to hit the obliques.' },
    { id: 'ab_crunch', name: 'Crunch', muscle: 'Core', equipment: 'Bodyweight', mechanic: 'Isolation', info: 'Curl the ribs toward the pelvis, no neck pulling.' },
    { id: 'cable_crunch', name: 'Cable Crunch', muscle: 'Core', equipment: 'Cable', mechanic: 'Isolation', info: 'Kneel and crunch the rope down with your abs, not hips.' },
    { id: 'hanging_leg_raise', name: 'Hanging Leg Raise', muscle: 'Core', equipment: 'Bodyweight', mechanic: 'Isolation', info: 'From a hang, raise legs to the bar without swinging.' },
    { id: 'lying_leg_raise', name: 'Lying Leg Raise', muscle: 'Core', equipment: 'Bodyweight', mechanic: 'Isolation', info: 'Raise straight legs while pressing your low back down.' },
    { id: 'russian_twist', name: 'Russian Twist', muscle: 'Core', equipment: 'Bodyweight', mechanic: 'Isolation', info: 'Lean back and rotate the torso side to side.' },
    { id: 'ab_wheel', name: 'Ab Wheel Rollout', muscle: 'Core', equipment: 'Bodyweight', mechanic: 'Isolation', info: 'Roll out with a braced core, don’t let the hips sag.' },
    { id: 'pallof_press', name: 'Pallof Press', muscle: 'Core', equipment: 'Cable', mechanic: 'Isolation', info: 'Press a cable straight out to resist rotation.' },
    { id: 'woodchopper', name: 'Cable Woodchopper', muscle: 'Core', equipment: 'Cable', mechanic: 'Isolation', info: 'Chop diagonally across the body for rotational power.' },
    { id: 'dead_bug', name: 'Dead Bug', muscle: 'Core', equipment: 'Bodyweight', mechanic: 'Isolation', info: 'Opposite arm/leg reach while keeping the spine neutral.' },
    { id: 'bird_dog', name: 'Bird Dog', muscle: 'Core', equipment: 'Bodyweight', mechanic: 'Isolation', info: 'Reach opposite arm and leg from all fours, stay stable.' },

    // ── CARDIO / FULL BODY ───────────────────────────────────────────
    { id: 'treadmill', name: 'Treadmill Run', muscle: 'Cardio', equipment: 'Machine', mechanic: 'Cardio', info: 'Steady-state or interval running for conditioning.' },
    { id: 'rowing', name: 'Rowing Machine', muscle: 'Cardio', equipment: 'Machine', mechanic: 'Cardio', info: 'Full-body pull — legs, hips, then arms in sequence.' },
    { id: 'cycling', name: 'Stationary Bike', muscle: 'Cardio', equipment: 'Machine', mechanic: 'Cardio', info: 'Low-impact cardio, great for recovery and engine building.' },
    { id: 'stair_climber', name: 'Stair Climber', muscle: 'Cardio', equipment: 'Machine', mechanic: 'Cardio', info: 'Climb at a steady pace, don’t lean on the rails.' },
    { id: 'jump_rope', name: 'Jump Rope', muscle: 'Cardio', equipment: 'Bodyweight', mechanic: 'Cardio', info: 'Quick, light hops — elite footwork and conditioning.' },
    { id: 'burpees', name: 'Burpee', muscle: 'Cardio', equipment: 'Bodyweight', mechanic: 'Compound', info: 'Drop to a push-up, jump up — full-body conditioning.' },
    { id: 'kb_swing', name: 'Kettlebell Swing', muscle: 'Cardio', equipment: 'Kettlebell', mechanic: 'Compound', info: 'Hinge and snap the hips to float the bell to chest height.' },
    { id: 'sled_push', name: 'Sled Push', muscle: 'Cardio', equipment: 'Machine', mechanic: 'Compound', info: 'Drive the sled down the turf for brutal conditioning.' },
    { id: 'battle_ropes', name: 'Battle Ropes', muscle: 'Cardio', equipment: 'Bodyweight', mechanic: 'Compound', info: 'Alternate waves with a braced core and fast hands.' },
    { id: 'box_jump', name: 'Box Jump', muscle: 'Cardio', equipment: 'Bodyweight', mechanic: 'Compound', info: 'Explode onto a box, land soft, step down.' },
    { id: 'assault_bike', name: 'Assault Bike', muscle: 'Cardio', equipment: 'Machine', mechanic: 'Cardio', info: 'Push-pull intervals on the fan bike for max effort.' },
    { id: 'farmer_carry', name: 'Farmer Carry', muscle: 'Cardio', equipment: 'Dumbbell', mechanic: 'Compound', info: 'Walk with heavy weights at your sides — grip, core, posture.' },
];

export function getExercises() { return EXERCISE_DB; }

export function getExerciseById(id) { return EXERCISE_DB.find(e => e.id === id); }

export function searchExercises(query) {
    const q = (query || '').toLowerCase();
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

export function getEquipmentTypes() {
    return [...new Set(EXERCISE_DB.map(e => e.equipment))];
}

export function countExercises() { return EXERCISE_DB.length; }

export default EXERCISE_DB;
