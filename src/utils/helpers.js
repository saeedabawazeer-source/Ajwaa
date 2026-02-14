export function getAIMessage(cals, goal, logCount) {
    const remaining = goal - cals;
    if (cals === 0) return "Good morning! Let's kick off your day — log breakfast first 🌅";
    if (remaining <= 0) return "You've hit your target! Great discipline today 🏆";
    if (remaining <= 200) return `Almost there! Only ${remaining} kcal to go. Finish strong! 🔥`;
    if (logCount >= 3) return `${remaining} kcal remaining — keep the momentum going 💪`;
    return `${cals} kcal logged so far. Stay consistent! 📊`;
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

export function getMealSlotEmoji(slot) {
    const map = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snacks: '🍿' };
    return map[slot] || '🍽️';
}

export function getMealSlotLabel(slot) {
    return slot.charAt(0).toUpperCase() + slot.slice(1);
}
