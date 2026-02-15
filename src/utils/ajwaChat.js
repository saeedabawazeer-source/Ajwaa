// Ajwa AI Chat Engine — context-aware conversational coach

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Detect user intent from message
function detectIntent(msg) {
    const m = msg.toLowerCase().trim();
    if (/^(hi|hey|hello|yo|sup|salam|hala|marhaba)/.test(m)) return 'greeting';
    if (/how.*(am i|doing|progress|going|day)/.test(m)) return 'progress';
    if (/what.*(eat|meal|food|should i eat|cook|make)/.test(m)) return 'meal_suggestion';
    if (/suggest.*(workout|exercise|training|routine)/.test(m) || /what.*(workout|train|exercise)/.test(m)) return 'workout_suggestion';
    if (/(protein|carb|fat|macro)/.test(m)) return 'macros';
    if (/(water|hydrat|drink)/.test(m)) return 'water';
    if (/(calori|kcal|how much.*(eaten|left|remain))/.test(m)) return 'calories';
    if (/(streak|consist|days in a row)/.test(m)) return 'streak';
    if (/(level|xp|rank|points)/.test(m)) return 'xp';
    if (/(weight|bmi|body|heavy|kg|lean)/.test(m)) return 'weight';
    if (/(motiv|inspir|tired|lazy|don.t want|cant|can.t)/.test(m)) return 'motivation';
    if (/(tip|advice|help|how to|guide)/.test(m)) return 'tips';
    if (/(log|add|track)/.test(m)) return 'log_help';
    return 'general';
}

export function generateAjwaResponse(message, { totals, user, streak, today, xp }) {
    const intent = detectIntent(message);
    const hour = new Date().getHours();
    const calPct = totals.cals / user.calorieTarget;
    const remaining = Math.max(0, user.calorieTarget - totals.cals);
    const protPct = totals.p / user.macros.p;
    const waterPct = today.water / user.waterGoal;

    switch (intent) {
        case 'greeting':
            return pick([
                `Hey ${user.name.split(' ')[0]}! Ready to crush today?`,
                `Salam! Let's make today count.`,
                `Hi there! I'm ready to help you hit those goals.`,
                `Yo! What's the plan for today?`,
            ]);
        case 'progress':
            if (calPct > 1.1) return `You're a bit over on calories (${totals.cals}), but that's okay! focus on protein tomorrow.`;
            if (calPct > 0.8) return `You're crushing it! ${Math.round(calPct * 100)}% of calories eaten. Finish strong!`;
            if (calPct < 0.3 && hour > 14) return `Slow day? You've only eaten ${totals.cals} kcal. Fuel up!`;
            return `You're at ${totals.cals} kcal. ${remaining} left to go. Keep it up!`;
        case 'meal_suggestion':
            if (hour < 11) return pick([
                "How about Oatmeal with protein powder and berries?",
                "Eggs and toast is a classic winner.",
                "Greek yogurt bowl with nuts and honey!"
            ]);
            if (hour < 16) return pick([
                "Chicken breast with rice and broccoli? Classic bodybuilder fuel.",
                "Maybe a tuna salad wrap?",
                "Leftovers? If not, maybe a turkey sandwich."
            ]);
            return pick([
                "Salmon and asparagus would be great.",
                "Lean beef stir-fry?",
                "Casein protein shake or cottage cheese before bed."
            ]);
        case 'workout_suggestion':
            return pick([
                "Push day? Bench press, overhead press, and triceps.",
                "Pull day! Deadlifts, rows, and curls.",
                "Leg day... don't skip it! Squats and lunges.",
                "Maybe just a 30min run to clear your head?"
            ]);
        case 'macros':
            if (protPct < 0.5 && hour > 15) return `Protein is low (${totals.p}g). Try to get a shake or some chicken in!`;
            if (protPct >= 1) return `Protein goals hit! (${totals.p}g) Great job optimizing for muscle.`;
            return `You're at ${totals.p}g Protein, ${totals.c}g Carbs, ${totals.f}g Fat.`;
        case 'water':
            if (waterPct < 0.5) return `Hydrate! You're only at ${today.water}L. aim for ${user.waterGoal}L.`;
            return `Water intake is looking good: ${today.water}L. Keep sipping!`;
        case 'calories':
            return `You have ${remaining} calories left today (eaten ${totals.cals}).`;
        case 'streak':
            if (streak > 3) return `You're on fire! ${streak} day streak. Don't break the chain! 🔥`;
            return `Current streak: ${streak} days. Consistency is key!`;
        case 'xp':
            return `Level ${xp.level || 1} • ${xp.current || 0} XP. Keep logging to level up!`;
        case 'weight':
            return `Tracking weight helps see trends. Log it in your profile!`;
        case 'motivation':
            return pick([
                "Discipline beats motivation. Just show up.",
                "You don't have to be great to start, but you have to start to be great.",
                "One bad meal doesn't ruin progress. One good meal doesn't make it. Consistency!",
                "Do it for the 'after' photo."
            ]);
        case 'tips':
            return pick([
                "Drink water before meals to feel fuller.",
                "Sleep is when muscles grow. Get 8 hours!",
                "Prioritize protein in every meal.",
                "Walk more. It adds up fast."
            ]);
        case 'log_help':
            return "Tap the '+' icons on the dashboard to log meals, or use the chat to tell me what you ate!";

        default:
            return pick([
                `I'm Ajwa, your personal fitness AI! Ask me about your progress, macros, meal ideas, workout suggestions, or just say hi.`,
                `Try asking me:\n• "How am I doing today?"\n• "Suggest a meal"\n• "What workout should I do?"\n• "How are my macros?"`,
                `I can help with nutrition tips, workout ideas, progress check-ins, and motivation. What do you need?`,
            ]);
    }
}

// Welcome message on chat open
export function getWelcomeMessage(user, totals, streak) {
    const hour = new Date().getHours();
    const timeGreet = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    const firstName = user.name.split(' ')[0];
    return `Good ${timeGreet}, ${firstName}! I'm Ajwa, your personal fitness coach. You've logged ${totals.cals} kcal today. How can I help?`;
}

// Proactive dashboard nudge
export function getDashboardNudge(today, user, totals, streak) {
    const hour = new Date().getHours();
    const firstName = user.name.split(' ')[0];
    const logCount = today.meals.breakfast.length + today.meals.lunch.length + today.meals.dinner.length + today.meals.snacks.length;

    // Morning check
    if (hour >= 6 && hour < 11 && today.meals.breakfast.length === 0) {
        return { text: `Don't forget breakfast, ${firstName}!`, mood: 'concern' };
    }

    // Mid-day check
    if (hour >= 12 && hour < 15 && today.meals.lunch.length === 0) {
        return { text: `Fuel up for the afternoon! Log lunch?`, mood: 'neutral' };
    }

    // Evening check
    if (hour >= 18 && hour < 22 && today.meals.dinner.length === 0) {
        return { text: `Time for dinner? What's on the menu?`, mood: 'happy' };
    }

    // Hydration check
    if (hour > 14 && (today.water / user.waterGoal) < 0.4) {
        return { text: `You look thirsty! Drink some water 💧`, mood: 'concern' };
    }

    // Workout check
    if (hour > 17 && (!today.workouts || today.workouts.length === 0)) {
        return { text: `Still time to crush a workout today! 💪`, mood: 'excited' };
    }

    // Default success
    if (logCount > 2) {
        return { text: `Crushing it today! Keep it up 🔥`, mood: 'excited' };
    }

    // Default fallback
    return { text: `Waiting for your next move...`, mood: 'neutral' };
}
