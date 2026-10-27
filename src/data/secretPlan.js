// ─── OWNER PLAN (payload for the secret login) ───
// Derived from Saeed's Gemini conversation:
// https://share.gemini.google/wmrQQp5N9Jwi  (shared chat id 1d4b6f7c934b)
// 2-month aggressive lean recomp: 10-15% deficit, 2.0-2.2 g/kg protein,
// 3.5L water, a 10:00-11:15 gym window, 6-day PPL starting on Pull A.

export const OWNER_PASSCODE = 'ajwaa85';

// Mifflin-St Jeor, 85 kg / 180 cm / 25 y male x 1.375 (light activity)
const TDEE = 2550;
const DEFICIT = 0.13; // conversation: 300-500 kcal (10-15%) below maintenance

const CALORIES = Math.round((TDEE * (1 - DEFICIT)) / 50) * 50; // 2200
const PROTEIN = 190; // 2.2 g/kg — conversation's 170-190 g band
const FAT = 70; // 0.8 g/kg
const CARBS = Math.round((CALORIES - (PROTEIN * 4 + FAT * 9)) / 4); // 200

export const OWNER_PLAN = {
    profile: {
        name: 'Saeed',
        role: 'coach',
        goal: 'fat_loss', // lean recomp — eating in a deficit
        gender: 'male',
        age: 25,
        weight: 85,
        height: 180,
        activityLevel: 1.375,
    },

    targets: {
        calories: CALORIES,
        macros: { p: PROTEIN, c: CARBS, f: FAT },
        water: 3.5, // liters, conversation's "3.0-3.5L, plus on heavy days"
    },

    // Keys are Date.getDay() (0 = Sunday). The conversation's Day 1 is
    // Tuesday = Pull A, so the PPL rotation runs Pull -> Legs -> Push
    // with Sunday as the rest day.
    week: { 0: null, 1: 'push', 2: 'pull_a', 3: 'legs', 4: 'push', 5: 'pull', 6: 'legs' },

    // The exact daily layout from the conversation (3 PM lunch, 6:30 PM snack, 9 PM dinner).
    timeline: [
        {
            time: '8:00 AM',
            title: 'Wake up — pre-workout fuel',
            detail: '1 whole egg + 150g egg whites on 1 slice whole-grain toast, or oats with a scoop of whey. Water: 500ml straight away.',
            supps: ['Omega-3', 'Vitamin C', 'Collagen peptides'],
        },
        {
            time: '9:15 AM',
            title: 'Focus boost',
            detail: 'Black coffee / americano 30-45 min before lifting, with a small glass of water.',
            supps: ['Coffee (caffeine)'],
        },
        {
            time: '9:45 AM',
            title: 'Head to the gym',
            detail: 'Bring the water bottle and sip on the way.',
            supps: [],
        },
        {
            time: '10:00 - 11:15 AM',
            title: 'The workout',
            detail: '5-10 min dynamic warm-up (incline walk, arm circles, band pull-aparts, dead hangs), then the main session. Sip 500-750ml throughout. Two-hour block on max-volume days.',
            supps: [],
        },
        {
            time: '3:00 PM',
            title: 'Lunch — post-workout recovery',
            detail: '200g grilled chicken breast, lean steak or white fish + 1.5 cups rice + greens or salad with olive oil and lemon.',
            supps: ['Creatine 5g'],
        },
        {
            time: '6:30 PM',
            title: 'Protein snack',
            detail: '200g plain low-fat Greek yogurt with berries, OR 1 scoop whey isolate in water, OR 150g cottage cheese with cucumber. Water: 500ml-1L.',
            supps: [],
        },
        {
            time: '9:00 PM',
            title: 'Dinner — lean down',
            detail: 'Salmon, white fish or lean meat + a massive portion of non-starchy veg (zucchini, broccoli, spinach, asparagus), minimal oil. Finish the day\'s water.',
            supps: [],
        },
    ],

    supplements: [
        { name: 'Creatine', dose: '5g', timing: 'Daily, post-workout with lunch (3:00 PM). Consistency matters more than the exact minute.' },
        { name: 'Coffee (caffeine)', dose: '1 cup', timing: '9:15 AM — 30-45 min pre-workout for peak blood levels. Hydrate alongside it.' },
        { name: 'Collagen peptides', dose: '1 serving', timing: '30-60 min before training (~9:15 AM) together with vitamin C, so it is in the blood when tendons load.' },
        { name: 'Vitamin C', dose: '1 serving', timing: 'With the collagen pre-workout, or with a meal. Cofactor for collagen synthesis.' },
        { name: 'Omega-3', dose: '1 serving', timing: 'With a fat-containing meal — breakfast. Helps absorption, avoids reflux mid-session.' },
        { name: 'Zinc', dose: '15mg', timing: 'With dinner, away from the coffee. Supports recovery and testosterone; do not take it on an empty stomach.' },
    ],

    rules: [
        'Lift heavy with strict form: compounds (squat, bench, row, OHP, pull-up) plus high-tension isolation work.',
        'Progressive overload every week — add a rep or a little weight. No overload, no shape change.',
        'Hit core 3x a week with weighted cable crunches or hanging leg raises to build thick abs under the skin.',
        'Rest 2-3 min on heavy compounds, 60-90 s on isolation movements.',
        'Water: ~1.0L before the workout, 0.5-0.75L during, ~1.5L across the afternoon and evening.',
        'Loose skin: collagen + vitamin C pre-workout, 3.5L water daily, and no crash dieting — the 10-15% deficit is what lets skin retract.',
    ],
};
