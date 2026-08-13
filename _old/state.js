/**
 * Ajwaa "Brain" — State Management & Logic
 * Handles Data, Persistence, and Smart Calculations
 */

const AppState = {
    user: {
        name: "Saeed",
        goal: "muscle_gain",
        weight: 72.5,
        height: 180,
        dailyCalorieGoal: 2000,
        dailyWaterGoal: 2.5,
        macros: { p: 150, c: 200, f: 70 } // Daily goals in grams
    },

    today: {
        date: new Date().toDateString(),
        caloriesConsumed: 0,
        waterIntake: 0,
        workoutsCompleted: 0,
        macrosConsumed: { p: 0, c: 0, f: 0 },
        log: []
    },

    history: [
        { date: "Sun", activity: 40, calories: 2100 },
        { date: "Mon", activity: 60, calories: 1950 },
        { date: "Tue", activity: 30, calories: 1800 },
        { date: "Wed", activity: 80, calories: 2200 },
        { date: "Thu", activity: 50, calories: 2000 },
        { date: "Fri", activity: 20, calories: 2400 },
        { date: "Sat", activity: 10, calories: 1500 }
    ],

    workoutLibrary: [
        { id: 1, title: "Full Body Strength", type: "strength", duration: 45, intensity: "High", calories: 320 },
        { id: 2, title: "HIIT Burner", type: "cardio", duration: 20, intensity: "High", calories: 250 },
        { id: 3, title: "Morning Yoga", type: "mobility", duration: 15, intensity: "Low", calories: 80 },
        { id: 4, title: "Upper Body Power", type: "strength", duration: 30, intensity: "Medium", calories: 200 },
        { id: 5, title: "Leg Day Crush", type: "strength", duration: 50, intensity: "High", calories: 400 },
        { id: 6, title: "5k Run", type: "cardio", duration: 30, intensity: "Medium", calories: 300 }
    ]
};

const AjwaaBrain = {
    saveState() {
        localStorage.setItem('ajwaa_state', JSON.stringify(AppState));
    },

    loadState() {
        const saved = localStorage.getItem('ajwaa_state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                Object.assign(AppState, parsed);
            } catch (e) { /* corrupted, ignore */ }
        }
        // Ensure arrays/objects exist
        if (!AppState.today.log) AppState.today.log = [];
        if (!AppState.today.macrosConsumed) AppState.today.macrosConsumed = { p: 0, c: 0, f: 0 };
        if (!AppState.user.macros) AppState.user.macros = { p: 150, c: 200, f: 70 };
    },

    getLast7Days() {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const last7 = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dayName = days[d.getDay()];
            const historyItem = AppState.history.find(h => h.date === dayName);
            last7.push({
                day: dayName[0],
                fullDate: d.getDate(),
                activity: historyItem ? historyItem.activity : Math.floor(Math.random() * 60),
                isToday: i === 0
            });
        }
        return last7;
    },

    getCalorieProgress() {
        return Math.min((AppState.today.caloriesConsumed / AppState.user.dailyCalorieGoal) * 100, 100);
    },

    getRemainingCalories() {
        return Math.max(0, AppState.user.dailyCalorieGoal - AppState.today.caloriesConsumed);
    },

    getWaterProgress() {
        return (AppState.today.waterIntake / AppState.user.dailyWaterGoal) * 100;
    },

    getRecommendedWorkouts() {
        const goal = AppState.user.goal;
        return [...AppState.workoutLibrary].sort((a, b) => {
            if (goal === 'muscle_gain' && a.type === 'strength') return -1;
            if (goal === 'weight_loss' && a.type === 'cardio') return -1;
            return 0;
        });
    },

    calculateStreak() { return 12; },

    logWater(amount) {
        AppState.today.waterIntake += amount;
        if (AppState.today.waterIntake > 5) AppState.today.waterIntake = 0;
        this.addLog({ type: 'water', title: 'Hydration', value: `+${amount * 1000} ml`, icon: '💧' });
        this.saveState();
        return AppState.today.waterIntake;
    },

    logWorkout(id) {
        const workout = AppState.workoutLibrary.find(w => w.id === id);
        if (workout) {
            AppState.today.workoutsCompleted++;
            this.addLog({ type: 'workout', title: workout.title, value: `${workout.calories} kcal burned`, icon: '🔥' });
            this.saveState();
        }
    },

    addLog(entry) {
        if (!AppState.today.log) AppState.today.log = [];
        const now = new Date();
        const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

        // Auto-calculate macros for food entries
        if (entry.type === 'food') {
            const cals = parseInt(entry.value) || 0;
            if (cals > 0) {
                const p = Math.round((cals * 0.30) / 4);
                const c = Math.round((cals * 0.45) / 4);
                const f = Math.round((cals * 0.25) / 9);
                AppState.today.macrosConsumed.p += p;
                AppState.today.macrosConsumed.c += c;
                AppState.today.macrosConsumed.f += f;
            }
        }

        AppState.today.log.unshift({ ...entry, time });
    }
};

window.AjwaaBrain = AjwaaBrain;
window.AppState = AppState;
