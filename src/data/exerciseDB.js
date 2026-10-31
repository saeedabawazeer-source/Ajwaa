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

    // ── CHEST (expanded) ─────────────────────────────────────────────
    { id: 'incline_db_fly', name: 'Incline Dumbbell Fly', muscle: 'Chest', equipment: 'Dumbbell', mechanic: 'Isolation', info: 'Bench at 30°, soft elbows, hug the weight up and stretch wide at the bottom.' },
    { id: 'decline_db_press', name: 'Decline Dumbbell Press', muscle: 'Chest', equipment: 'Dumbbell', mechanic: 'Compound', info: 'Decline bench, press dumbbells over the lower chest, keep wrists stacked.' },
    { id: 'close_grip_bench', name: 'Close-Grip Bench Press', muscle: 'Chest', equipment: 'Barbell', mechanic: 'Compound', info: 'Hands inside shoulder width, elbows tucked — chest and triceps together.' },
    { id: 'svend_press', name: 'Svend Press', muscle: 'Chest', equipment: 'Dumbbell', mechanic: 'Isolation', info: 'Squeeze a plate between your palms and press straight out from the chest.' },
    { id: 'db_pullover', name: 'Dumbbell Pullover', muscle: 'Chest', equipment: 'Dumbbell', mechanic: 'Isolation', info: 'Lie across a bench, lower the dumbbell behind your head, ribs down.' },
    { id: 'floor_press', name: 'Dumbbell Floor Press', muscle: 'Chest', equipment: 'Dumbbell', mechanic: 'Compound', info: 'Press from the floor; the floor stops the range so shoulders stay safe.' },
    { id: 'archer_pushup', name: 'Archer Push-Up', muscle: 'Chest', equipment: 'Bodyweight', mechanic: 'Compound', info: 'Shift your weight over one arm and let the other straighten.' },
    { id: 'diamond_pushup', name: 'Diamond Push-Up', muscle: 'Chest', equipment: 'Bodyweight', mechanic: 'Compound', info: 'Hands together under the sternum, elbows tight to the ribs.' },
    { id: 'wide_pushup', name: 'Wide Push-Up', muscle: 'Chest', equipment: 'Bodyweight', mechanic: 'Compound', info: 'Hands wider than the shoulders to bias the outer chest.' },
    { id: 'low_cable_fly', name: 'Low-to-High Cable Fly', muscle: 'Chest', equipment: 'Cable', mechanic: 'Isolation', info: 'Pull from the low pulleys up and in to hit the upper chest.' },
    { id: 'incline_machine_press', name: 'Incline Machine Press', muscle: 'Chest', equipment: 'Machine', mechanic: 'Compound', info: 'Fixed-path upper-chest press — good for pushing close to failure.' },

    // ── BACK (expanded) ──────────────────────────────────────────────
    { id: 'landmine_row', name: 'Landmine Row', muscle: 'Back', equipment: 'Barbell', mechanic: 'Compound', info: 'One end anchored, pull the bar to your hip with a flat back.' },
    { id: 'meadows_row', name: 'Meadows Row', muscle: 'Back', equipment: 'Barbell', mechanic: 'Compound', info: 'Staggered stance, pull the landmine handle up and back, no torso twist.' },
    { id: 'close_grip_pulldown', name: 'Close-Grip Lat Pulldown', muscle: 'Back', equipment: 'Cable', mechanic: 'Compound', info: 'Neutral close grip, drive the elbows down, lean back slightly.' },
    { id: 'inverted_row', name: 'Inverted Row', muscle: 'Back', equipment: 'Bodyweight', mechanic: 'Compound', info: 'Bar at hip height, body rigid, pull your chest to the bar.' },
    { id: 'seal_row', name: 'Seal Row', muscle: 'Back', equipment: 'Barbell', mechanic: 'Compound', info: 'Chest supported on a bench, strict row — zero momentum.' },
    { id: 'db_shrug', name: 'Dumbbell Shrug', muscle: 'Back', equipment: 'Dumbbell', mechanic: 'Isolation', info: 'Shrug straight up, pause at the top, lower slowly.' },
    { id: 'good_morning', name: 'Good Morning', muscle: 'Back', equipment: 'Barbell', mechanic: 'Compound', info: 'Hinge with the bar on your back, stop when the hamstrings pull.' },
    { id: 'back_hyper', name: 'Back Extension', muscle: 'Back', equipment: 'Bodyweight', mechanic: 'Isolation', info: 'Raise the torso to a straight line, squeeze the glutes at the top.' },
    { id: 'pull_up_negative', name: 'Pull-Up Negative', muscle: 'Back', equipment: 'Bodyweight', mechanic: 'Compound', info: 'Jump to the top and lower for 5 seconds — builds your first rep.' },
    { id: 'scap_pull', name: 'Scapular Pull-Up', muscle: 'Back', equipment: 'Bodyweight', mechanic: 'Isolation', info: 'Hang and pull the shoulder blades down without bending the arms.' },

    // ── SHOULDERS (expanded) ─────────────────────────────────────────
    { id: 'arnold_press', name: 'Arnold Press', muscle: 'Shoulders', equipment: 'Dumbbell', mechanic: 'Compound', info: 'Start palms-in, rotate outward as you press overhead.' },
    { id: 'cable_lateral_raise', name: 'Cable Lateral Raise', muscle: 'Shoulders', equipment: 'Cable', mechanic: 'Isolation', info: 'Constant-tension side raise — lead with the elbow, stop at shoulder height.' },
    { id: 'machine_lateral_raise', name: 'Machine Lateral Raise', muscle: 'Shoulders', equipment: 'Machine', mechanic: 'Isolation', info: 'Pads against the arms, raise to shoulder height and control the way down.' },
    { id: 'front_raise', name: 'Dumbbell Front Raise', muscle: 'Shoulders', equipment: 'Dumbbell', mechanic: 'Isolation', info: 'Raise to eye level with a straight arm, no swinging.' },
    { id: 'upright_row', name: 'Cable Upright Row', muscle: 'Shoulders', equipment: 'Cable', mechanic: 'Compound', info: 'Pull to chest height with high elbows — stop if the shoulder pinches.' },
    { id: 'y_raise', name: 'Y-Raise', muscle: 'Shoulders', equipment: 'Dumbbell', mechanic: 'Isolation', info: 'Thumbs up, raise into a Y to hit the lower traps.' },
    { id: 'machine_shoulder_press', name: 'Machine Shoulder Press', muscle: 'Shoulders', equipment: 'Machine', mechanic: 'Compound', info: 'Fixed-path press — a safe way to train close to failure.' },
    { id: 'rear_delt_cable', name: 'Cable Rear Delt Fly', muscle: 'Shoulders', equipment: 'Cable', mechanic: 'Isolation', info: 'Cross-body cable fly with a slight elbow bend, squeeze the rear delt.' },
    { id: 'pike_pushup', name: 'Pike Push-Up', muscle: 'Shoulders', equipment: 'Bodyweight', mechanic: 'Compound', info: 'Hips high, lower the crown of your head toward the floor, press back up.' },

    // ── ARMS (expanded) ──────────────────────────────────────────────
    { id: 'rope_pushdown', name: 'Rope Tricep Pushdown', muscle: 'Arms', equipment: 'Cable', mechanic: 'Isolation', info: 'Split the rope at the bottom, keep the elbows pinned to your sides.' },
    { id: 'oh_db_ext', name: 'Overhead Dumbbell Extension', muscle: 'Arms', equipment: 'Dumbbell', mechanic: 'Isolation', info: 'Both hands on one dumbbell, lower behind the head, elbows narrow.' },
    { id: 'jm_press', name: 'JM Press', muscle: 'Arms', equipment: 'Barbell', mechanic: 'Compound', info: 'Hybrid press/extension — bar to the chin, elbows forward.' },
    { id: 'bench_dip', name: 'Bench Dip', muscle: 'Arms', equipment: 'Bodyweight', mechanic: 'Compound', info: 'Hands behind you on a bench, lower until the elbows hit 90°.' },
    { id: 'concentration_curl', name: 'Concentration Curl', muscle: 'Arms', equipment: 'Dumbbell', mechanic: 'Isolation', info: 'Elbow braced on the inner thigh, curl slowly and squeeze.' },
    { id: 'spider_curl', name: 'Spider Curl', muscle: 'Arms', equipment: 'Dumbbell', mechanic: 'Isolation', info: 'Chest on an incline bench, arms hanging — pure bicep, no swing.' },
    { id: 'reverse_curl', name: 'Reverse Curl', muscle: 'Arms', equipment: 'Barbell', mechanic: 'Isolation', info: 'Palms down curl for the brachialis and forearms.' },
    { id: 'zottman_curl', name: 'Zottman Curl', muscle: 'Arms', equipment: 'Dumbbell', mechanic: 'Isolation', info: 'Curl up palms-up, rotate, lower palms-down slowly.' },
    { id: 'wrist_curl', name: 'Wrist Curl', muscle: 'Arms', equipment: 'Dumbbell', mechanic: 'Isolation', info: 'Forearms on your thighs, curl the wrists up and lower slowly.' },
    { id: 'cable_rope_hammer', name: 'Rope Hammer Curl', muscle: 'Arms', equipment: 'Cable', mechanic: 'Isolation', info: 'Neutral grip on a low pulley, curl without moving the elbows.' },
    { id: 'overhead_cable_ext', name: 'Overhead Cable Extension', muscle: 'Arms', equipment: 'Cable', mechanic: 'Isolation', info: 'Face away from the stack, extend overhead — long head of the tricep.' },

    // ── LEGS (expanded) ──────────────────────────────────────────────
    { id: 'front_squat', name: 'Front Squat', muscle: 'Legs', equipment: 'Barbell', mechanic: 'Compound', info: 'Bar on the front delts, elbows high, torso upright, squat deep.' },
    { id: 'hack_squat', name: 'Hack Squat', muscle: 'Legs', equipment: 'Machine', mechanic: 'Compound', info: 'Back flat on the pad, feet mid-platform, control the descent.' },
    { id: 'goblet_squat', name: 'Goblet Squat', muscle: 'Legs', equipment: 'Dumbbell', mechanic: 'Compound', info: 'Hold one dumbbell at the chest, elbows inside the knees at the bottom.' },
    { id: 'db_split_squat', name: 'Dumbbell Split Squat', muscle: 'Legs', equipment: 'Dumbbell', mechanic: 'Compound', info: 'Long stance, drop straight down, front shin near vertical.' },
    { id: 'walking_lunge', name: 'Walking Lunge', muscle: 'Legs', equipment: 'Dumbbell', mechanic: 'Compound', info: 'Step through, both knees to 90°, drive off the front foot.' },
    { id: 'step_up', name: 'Box Step-Up', muscle: 'Legs', equipment: 'Dumbbell', mechanic: 'Compound', info: 'Step up without pushing off the back foot, control the way down.' },
    { id: 'sumo_deadlift', name: 'Sumo Deadlift', muscle: 'Legs', equipment: 'Barbell', mechanic: 'Compound', info: 'Wide stance, knees out, push the floor apart and stand tall.' },
    { id: 'stiff_leg_dl', name: 'Stiff-Leg Deadlift', muscle: 'Legs', equipment: 'Barbell', mechanic: 'Compound', info: 'Almost straight legs, hinge back until the hamstrings load, then stand.' },
    { id: 'leg_extension', name: 'Leg Extension', muscle: 'Legs', equipment: 'Machine', mechanic: 'Isolation', info: 'Squeeze the quads at the top, lower under control.' },
    { id: 'glute_kickback', name: 'Cable Glute Kickback', muscle: 'Legs', equipment: 'Cable', mechanic: 'Isolation', info: 'Hinge forward, drive the heel back and up, squeeze the glute.' },
    { id: 'nordic_curl', name: 'Nordic Curl', muscle: 'Legs', equipment: 'Bodyweight', mechanic: 'Isolation', info: 'Ankles anchored, lower the torso slowly — the best hamstring builder.' },
    { id: 'sissy_squat', name: 'Sissy Squat', muscle: 'Legs', equipment: 'Bodyweight', mechanic: 'Isolation', info: 'Knees travel forward, lean back, keep hips extended.' },
    { id: 'donkey_calf_raise', name: 'Donkey Calf Raise', muscle: 'Legs', equipment: 'Machine', mechanic: 'Isolation', info: 'Hinge forward, full stretch at the bottom, hard pause at the top.' },
    { id: 'seated_calf_raise', name: 'Seated Calf Raise', muscle: 'Legs', equipment: 'Machine', mechanic: 'Isolation', info: 'Knees bent targets the soleus — slow reps, deep stretch.' },
    { id: 'hip_abduction', name: 'Hip Abduction', muscle: 'Legs', equipment: 'Machine', mechanic: 'Isolation', info: 'Push the knees apart against the pads, pause, control back.' },

    // ── CORE (expanded) ──────────────────────────────────────────────
    { id: 'plank', name: 'Plank', muscle: 'Core', equipment: 'Bodyweight', mechanic: 'Isolation', info: 'Ribs down, glutes tight, squeeze everything — no sagging hips.' },
    { id: 'side_plank', name: 'Side Plank', muscle: 'Core', equipment: 'Bodyweight', mechanic: 'Isolation', info: 'Stack the hips and shoulders, lift the bottom ribs away from the floor.' },
    { id: 'hanging_knee_raise', name: 'Hanging Knee Raise', muscle: 'Core', equipment: 'Bodyweight', mechanic: 'Isolation', info: 'Curl the pelvis up with the knees — no swinging.' },
    { id: 'toes_to_bar', name: 'Toes to Bar', muscle: 'Core', equipment: 'Bodyweight', mechanic: 'Isolation', info: 'Straight legs to the bar, control the descent, use the lats.' },
    { id: 'bicycle_crunch', name: 'Bicycle Crunch', muscle: 'Core', equipment: 'Bodyweight', mechanic: 'Isolation', info: 'Opposite elbow to knee, slow and deliberate, no neck pulling.' },
    { id: 'mountain_climber', name: 'Mountain Climber', muscle: 'Core', equipment: 'Bodyweight', mechanic: 'Compound', info: 'Plank position, drive the knees in fast while the hips stay level.' },
    { id: 'hollow_hold', name: 'Hollow Body Hold', muscle: 'Core', equipment: 'Bodyweight', mechanic: 'Isolation', info: 'Low back pressed down, arms and legs long, breathe shallow.' },
    { id: 'v_up', name: 'V-Up', muscle: 'Core', equipment: 'Bodyweight', mechanic: 'Isolation', info: 'Fold hips and shoulders together, reach for the toes.' },
    { id: 'suitcase_carry', name: 'Suitcase Carry', muscle: 'Core', equipment: 'Dumbbell', mechanic: 'Compound', info: 'One heavy dumbbell, stay perfectly upright, resist the lean.' },

    // ── CARDIO (expanded) ────────────────────────────────────────────
    { id: 'incline_walk', name: 'Incline Walk', muscle: 'Cardio', equipment: 'Machine', mechanic: 'Cardio', info: 'Steep incline, no holding the rails — great low-impact fat burn.' },
    { id: 'sprint_intervals', name: 'Sprint Intervals', muscle: 'Cardio', equipment: 'Machine', mechanic: 'Cardio', info: '20-30s all out, 60-90s easy — repeat 6-10 rounds.' },
    { id: 'elliptical', name: 'Elliptical', muscle: 'Cardio', equipment: 'Machine', mechanic: 'Cardio', info: 'Steady pace, push and pull the handles, keep the heels down.' },
    { id: 'ski_erg', name: 'Ski Erg', muscle: 'Cardio', equipment: 'Machine', mechanic: 'Cardio', info: 'Hinge and pull down hard, let the hips drive the movement.' },
    { id: 'sled_drag', name: 'Sled Drag', muscle: 'Cardio', equipment: 'Machine', mechanic: 'Compound', info: 'Lean into the straps and walk — quads, calves and engine.' },
    { id: 'bear_crawl', name: 'Bear Crawl', muscle: 'Cardio', equipment: 'Bodyweight', mechanic: 'Compound', info: 'Knees hover off the floor, move opposite hand and foot together.' },
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
