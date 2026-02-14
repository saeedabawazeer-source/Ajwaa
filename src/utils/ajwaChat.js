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
    const workouts = today.workouts?.length || 0;
    const firstName = user.name.split(' ')[0];

    switch (intent) {
        case 'greeting': {
            const timeGreet = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
            return pick([
                `${timeGreet}, ${firstName}! Ready to make today count? You've eaten ${totals.cals} kcal so far.`,
                `Hey ${firstName}! Your streak is at ${streak} days. Let's keep it alive today.`,
                `What's up ${firstName}! You're level ${Math.floor(xp / 100) + 1}. How can I help?`,
            ]);
        }

        case 'progress': {
            const status = calPct > 0.9 ? 'almost at your calorie target' :
                calPct > 0.5 ? 'on track' : 'still early';
            return `You're ${status} today.\n\n` +
                `Calories: ${totals.cals} / ${user.calorieTarget} kcal (${Math.round(calPct * 100)}%)\n` +
                `Protein: ${totals.p}g / ${user.macros.p}g\n` +
                `Water: ${today.water}L / ${user.waterGoal}L\n` +
                `Workouts: ${workouts}\n\n` +
                (protPct < 0.5 && hour > 12 ? 'Your protein is looking low — prioritize it in your next meal.' : 'Keep it up!');
        }

        case 'meal_suggestion': {
            const meals = {
                muscle_gain: [
                    'Try grilled chicken breast (165g) with rice and broccoli — ~500 kcal, 45g protein.',
                    'A protein shake with oats and banana — ~400 kcal, 35g protein. Quick and effective.',
                    'Salmon with sweet potato and asparagus — ~550 kcal, 40g protein, great omega-3s.',
                    'Greek yogurt with nuts and honey — ~350 kcal, 25g protein. Perfect as a snack.',
                ],
                cutting: [
                    'Egg white omelette with spinach and tomato — ~200 kcal, 25g protein. Low cal, high protein.',
                    'Tuna salad with lemon dressing — ~250 kcal, 35g protein. Keep it lean.',
                    'Grilled chicken salad with olive oil — ~350 kcal, 40g protein.',
                    'Cottage cheese with berries — ~180 kcal, 20g protein. Light but filling.',
                ],
                maintain: [
                    'Balanced plate: palm of protein, fist of carbs, thumb of fats — ~450 kcal.',
                    'Chicken stir-fry with mixed veggies and rice — ~500 kcal, 35g protein.',
                    'Turkey wrap with avocado and greens — ~400 kcal, 30g protein.',
                ],
            };
            const goalMeals = meals[user.goal] || meals.maintain;
            const suggestion = pick(goalMeals);
            return `Based on your ${user.goal.replace('_', ' ')} goal:\n\n${suggestion}\n\nYou have ${remaining} kcal left today.`;
        }

        case 'workout_suggestion': {
            const suggestions = [
                'Push Day: Bench Press 4×8, Overhead Press 3×10, Incline DB Press 3×12, Lateral Raises 3×15.',
                'Pull Day: Barbell Rows 4×8, Pull-ups 3×max, Lat Pulldown 3×12, Bicep Curls 3×12.',
                'Leg Day: Squats 4×8, Romanian Deadlifts 3×10, Leg Press 3×12, Calf Raises 4×15.',
                'Full Body: Deadlift 3×5, Bench Press 3×8, Rows 3×10, Squats 3×8.',
                'Upper Body: Bench 4×8, Rows 4×8, Overhead Press 3×10, Dips 3×max.',
            ];
            return `Here's one for you:\n\n${pick(suggestions)}\n\nGo to the Workouts tab to start it, or pick from the templates!`;
        }

        case 'macros':
            return `Your macros today:\n\n` +
                `Protein: ${totals.p}g / ${user.macros.p}g (${Math.round(protPct * 100)}%)\n` +
                `Carbs: ${totals.c}g / ${user.macros.c}g (${Math.round(totals.c / user.macros.c * 100)}%)\n` +
                `Fats: ${totals.f}g / ${user.macros.f}g (${Math.round(totals.f / user.macros.f * 100)}%)\n\n` +
                (protPct < 0.5 ? 'Protein needs attention! Try chicken, eggs, or a shake.' : 'Macros looking solid!');

        case 'water':
            return `You've had ${today.water}L out of ${user.waterGoal}L (${Math.round(waterPct * 100)}%).\n\n` +
                (waterPct >= 1 ? 'You hit your water goal! Great hydration.' :
                    waterPct > 0.5 ? `${(user.waterGoal - today.water).toFixed(1)}L more to go. Keep sipping!` :
                        'You need to drink more water! Tap the water card on the dashboard to log cups.');

        case 'calories':
            return `Eaten: ${totals.cals} kcal\nTarget: ${user.calorieTarget} kcal\nRemaining: ${remaining} kcal\n\n` +
                (calPct > 1.1 ? 'You\'re over your target. No stress — just be mindful for the rest of the day.' :
                    calPct > 0.8 ? 'Almost there! One more meal should do it.' :
                        'Still have room — make sure to fuel properly.');

        case 'streak':
            return `Your streak: ${streak} day${streak !== 1 ? 's' : ''}!\n\n` +
                (streak === 0 ? 'No streak yet — log something today to start one!' :
                    streak < 7 ? 'Building momentum. Get to 7 days for that first milestone!' :
                        streak < 30 ? `${streak} days strong! You're building a real habit.` :
                            `${streak} days is LEGENDARY. You're a machine.`);

        case 'xp':
            return `Total XP: ${xp || 0}\nLevel: ${Math.floor((xp || 0) / 100) + 1}\n\n` +
                'You earn XP by logging meals (+10), workouts (+25), hitting targets (+15), and maintaining streaks (+5/day).';

        case 'weight':
            return `Current weight: ${user.weight}kg\nHeight: ${user.height}cm\nBMI: ${(user.weight / ((user.height / 100) ** 2)).toFixed(1)}\n\n` +
                'Track your weight in Profile → Overview → Log Weight to see trends over time.';

        case 'motivation':
            return pick([
                `${firstName}, the only bad workout is the one you didn't do. You've got ${streak} days of proof that you can show up.`,
                'Motivation is temporary. Discipline is permanent. You\'re already here — that\'s half the battle.',
                `Remember why you started. Your ${user.goal.replace('_', ' ')} goal isn't going to achieve itself. But YOU can.`,
                'Even 10 minutes of effort is better than zero. Start small, build momentum.',
                `You're level ${Math.floor((xp || 0) / 100) + 1} now. Future you will thank present you for not quitting.`,
            ]);

        case 'tips':
            return pick([
                'Tip: Eat protein first in every meal. It keeps you fuller longer and supports muscle recovery.',
                'Tip: Drink a glass of water before each meal. You\'ll eat less and stay hydrated.',
                'Tip: Track everything, even on bad days. Data beats feelings.',
                'Tip: Sleep 7-9 hours. It\'s the #1 recovery tool that most people ignore.',
                'Tip: Meal prep on Sundays. It removes decision fatigue for the whole week.',
                'Tip: Progressive overload — add 1-2kg to your lifts every 1-2 weeks.',
            ]);

        case 'log_help':
            return 'To log things:\n\n' +
                '• Meals: Tap any meal slot on the dashboard (breakfast, lunch, dinner, snacks)\n' +
                '• Water: Tap the water card on the dashboard\n' +
                '• Workout: Go to the Workouts tab and hit START\n' +
                '• Weight: Go to Profile → Overview → Log Weight';

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
