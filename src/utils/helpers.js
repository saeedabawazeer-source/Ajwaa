export function getAIMessage(cals, goal, logCount) {
    const remaining = goal - cals;
    if (cals === 0) return "Good morning! Let's kick off your day — log breakfast first.";
    if (remaining <= 0) return "You've hit your target! Great discipline today.";
    if (remaining <= 200) return `Almost there! Only ${remaining} kcal to go. Finish strong!`;
    if (logCount >= 3) return `${remaining} kcal remaining — keep the momentum going.`;
    return `${cals} kcal logged so far. Stay consistent!`;
}

export function formatTime(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function calcVolume(sets) {
    return sets.reduce((total, s) => total + (s.reps * s.weight), 0);
}

export function getMealSlotLabel(slot) {
    return slot.charAt(0).toUpperCase() + slot.slice(1);
}

export function calculatePlan(gender, age, weight, height, activity, goal) {
    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'male') bmr += 5;
    else bmr -= 161;

    let multiplier = 1.2;
    if (activity === 'light') multiplier = 1.375;
    if (activity === 'active') multiplier = 1.55;
    if (activity === 'athlete') multiplier = 1.725;

    let tdee = Math.round(bmr * multiplier);
    let targetCals = tdee;

    if (goal === 'fat_loss') targetCals -= 500;
    else if (goal === 'muscle_gain') targetCals += 300;

    // Macros
    // Protein: 2g per kg (High protein for both goals usually good)
    let p = Math.round(weight * 2);
    // Fats: 0.8g per kg
    let f = Math.round(weight * 0.9);
    // Carbs: Remainder
    let c = Math.round((targetCals - (p * 4 + f * 9)) / 4);

    if (c < 50) c = 50; // Minimum safety

    return {
        cals: targetCals,
        macros: { p, c, f },
        water: 3 // Default 3L roughly
    };
}
