// Ajwaa App Controller — All Logic

function init() {
    if (typeof AjwaaBrain !== 'undefined') {
        AjwaaBrain.loadState();
        renderAll();
    }
    setupNavigation();
    setupActions();
    setupActionSheet();
    setupLogModals();
    setupWorkoutBuilder();
    setupOverlayLogic();
}

// ─── RENDERERS ───

function renderAll() {
    renderDashboard();
    renderCalendar();
    renderWorkouts();
}

function renderDashboard() {
    const percent = AjwaaBrain.getCalorieProgress();
    const remaining = AjwaaBrain.getRemainingCalories();

    // Ring
    const offset = 251 - (251 * percent / 100);
    const ringVal = document.querySelector('.ring-val');
    if (ringVal) ringVal.style.strokeDashoffset = offset;

    // Calorie Text
    const calText = document.querySelector('.text-hero.red-text');
    if (calText) calText.textContent = AppState.today.caloriesConsumed.toLocaleString();

    // Macros
    const m = AppState.today.macrosConsumed;
    const g = AppState.user.macros;
    updateMacro('p', m.p, g.p);
    updateMacro('c', m.c, g.c);
    updateMacro('f', m.f, g.f);

    // Goal text
    const goalText = document.getElementById('macro-goal-text');
    if (goalText) goalText.textContent = `${remaining} kcal remaining`;

    // Water
    const waterEl = document.getElementById('water-amount');
    const waterBar = document.getElementById('water-bar');
    if (waterEl) {
        waterEl.textContent = AppState.today.waterIntake.toFixed(1).replace('.0', '');
        const wp = Math.min((AppState.today.waterIntake / AppState.user.dailyWaterGoal) * 100, 100);
        if (waterBar) waterBar.style.width = `${wp}%`;
    }

    // Workout count
    const wc = document.getElementById('workout-count');
    if (wc) wc.textContent = AppState.today.workoutsCompleted;

    // Log entry count
    const lc = document.getElementById('log-count');
    if (lc) lc.textContent = `${(AppState.today.log || []).length} ENTRIES`;

    // AI Coach dynamic message
    updateAICoach();

    renderDailyLog();
}

function updateMacro(key, val, goal) {
    const bar = document.getElementById(`macro-${key}`);
    const text = document.getElementById(`val-${key}`);
    if (bar && text) {
        bar.style.width = `${Math.min((val / goal) * 100, 100)}%`;
        text.textContent = `${val}g`;
    }
}

function updateAICoach() {
    const el = document.getElementById('ai-message');
    if (!el) return;
    const cals = AppState.today.caloriesConsumed;
    const goal = AppState.user.dailyCalorieGoal;
    const rem = goal - cals;
    const logs = (AppState.today.log || []).length;

    if (logs === 0) {
        el.textContent = '"Start your day right, Saeed. Log your first meal! 💪"';
    } else if (rem > 500) {
        el.textContent = `"Keep going! ${rem} kcal left. You're building something great."`;
    } else if (rem > 0) {
        el.textContent = `"Almost there! Only ${rem} kcal to go. Finish strong! 🔥"`;
    } else {
        el.textContent = '"Goal reached! You crushed it today. Recovery matters too. 🏆"';
    }
}

function renderDailyLog() {
    const feed = document.getElementById('daily-log-feed');
    if (!feed) return;
    feed.innerHTML = '';
    const logs = AppState.today.log || [];

    if (logs.length === 0) {
        feed.innerHTML = '<div class="text-label" style="text-align:center;margin-top:20px;opacity:0.5;">No activity yet today</div>';
        return;
    }

    logs.forEach(function (log) {
        const item = document.createElement('div');
        item.className = 'log-item';

        var subtext = log.value || '';
        if (log.type === 'workout' && log.exercises && log.exercises.length > 0) {
            var first = log.exercises[0];
            var more = log.exercises.length > 1 ? ' +' + (log.exercises.length - 1) + ' more' : '';
            subtext = first.name + ': ' + first.sets + 'x' + first.reps + ' @ ' + first.weight + 'kg' + more;
        }

        item.innerHTML = '<div class="log-time">' + log.time + '</div>' +
            '<div class="action-icon" style="width:32px;height:32px;font-size:16px;background:' + getIconBg(log.type) + ';border-width:2px;">' + log.icon + '</div>' +
            '<div style="flex:1;">' +
            '<div style="font-weight:700;font-size:14px;">' + log.title + '</div>' +
            '<div class="text-label" style="font-size:10px;">' + subtext + '</div>' +
            '</div>';
        feed.appendChild(item);
    });
}

function getIconBg(type) {
    if (type === 'food') return 'var(--c-red-light)';
    if (type === 'water') return 'var(--c-volt)';
    return 'white';
}

function renderCalendar() {
    var container = document.getElementById('calendar-strip');
    if (!container) return;
    container.innerHTML = '';

    var days = AjwaaBrain.getLast7Days();
    days.forEach(function (day) {
        var el = document.createElement('div');
        el.className = 'day-circle' + (day.isToday ? ' today' : '');

        var percent = Math.min(day.activity, 100);
        if (!day.isToday && percent > 0) {
            el.style.background = 'conic-gradient(var(--c-black) ' + percent + '%, transparent 0)';
            var inner = document.createElement('div');
            inner.style.cssText = 'background:var(--c-paper);border-radius:50%;width:30px;height:30px;display:flex;flex-direction:column;align-items:center;justify-content:center;';
            inner.innerHTML = '<span style="font-size:9px;">' + day.day + '</span><span style="font-size:9px;">' + day.fullDate + '</span>';
            el.appendChild(inner);
        } else {
            el.innerHTML = '<span>' + day.day + '</span><span>' + day.fullDate + '</span>';
        }

        el.addEventListener('click', function () {
            document.querySelectorAll('.day-circle').forEach(function (c) { c.classList.remove('selected'); });
            el.classList.add('selected');
        });

        container.appendChild(el);
    });
}

function renderWorkouts() {
    var list = document.querySelector('.workout-list');
    if (!list) return;
    list.innerHTML = '';

    AjwaaBrain.getRecommendedWorkouts().forEach(function (w) {
        var item = document.createElement('div');
        item.className = 'card workout-card';
        var ic = w.type === 'strength' ? 'var(--c-red)' : '#222';
        item.innerHTML = '<div class="workout-icon" style="background:' + ic + ';"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5zM16 8L2 22M17.5 15H9"/></svg></div>' +
            '<div style="flex:1;"><div style="font-weight:800;font-size:15px;">' + w.title + '</div><div class="text-label">' + w.duration + ' MIN · ' + w.intensity + '</div></div>' +
            '<button class="workout-play"><svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4" fill="none"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>';
        item.querySelector('.workout-play').onclick = function (e) { e.stopPropagation(); AjwaaBrain.startWorkout(w.id); };
        list.appendChild(item);
    });
}

// ─── INTERACTIONS ───

function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(function (item) {
        item.addEventListener('click', function () {
            var target = item.dataset.target;
            if (!target) return;
            document.querySelectorAll('.nav-item').forEach(function (n) { n.classList.remove('active'); });
            item.classList.add('active');
            document.querySelectorAll('.view-section').forEach(function (sec) {
                sec.classList.remove('active');
                if (sec.id === 'view-' + target) sec.classList.add('active');
            });
        });
    });
}

function setupActions() {
    var wc = document.getElementById('water-card');
    if (wc) wc.addEventListener('click', function () { AjwaaBrain.logWater(0.25); renderDashboard(); });
}

function setupActionSheet() {
    window.closeActionSheet = function () {
        document.getElementById('action-sheet').classList.remove('visible');
        document.getElementById('action-sheet-overlay').classList.add('hidden');
    };
    window.openActionSheet = function () {
        document.getElementById('action-sheet').classList.add('visible');
        document.getElementById('action-sheet-overlay').classList.remove('hidden');
    };
    window.quickAdd = function (type) {
        if (type === 'water') { AjwaaBrain.logWater(0.25); }
        renderDashboard();
        window.closeActionSheet();
    };
    var fab = document.querySelector('.nav-fab');
    if (fab) fab.addEventListener('click', window.openActionSheet);
}

function setupLogModals() {
    var foodModal = document.getElementById('modal-log-food');
    window.openLogFood = function () { window.closeActionSheet(); foodModal.classList.remove('hidden'); };
    window.closeLogFood = function () { foodModal.classList.add('hidden'); };
    window.saveLogFood = function () {
        var name = document.getElementById('input-food-name').value;
        var cals = parseInt(document.getElementById('input-food-cals').value) || 0;
        if (name && cals > 0) {
            AppState.today.caloriesConsumed += cals;
            AjwaaBrain.addLog({ type: 'food', title: name, value: '' + cals + ' kcal', icon: '🍎' });
            AjwaaBrain.saveState();
            renderDashboard();
            window.closeLogFood();
            document.getElementById('input-food-name').value = '';
            document.getElementById('input-food-cals').value = '';
        }
    };
}

// ─── WORKOUT BUILDER ───

function setupWorkoutBuilder() {
    var modal = document.getElementById('modal-log-workout');
    var list = document.getElementById('exercise-list');
    var currentSession = [];

    window.openLogWorkout = function () {
        window.closeActionSheet();
        modal.classList.remove('hidden');
        currentSession = [];
        list.innerHTML = '';
        document.getElementById('input-workout-name').value = '';
    };

    window.closeLogWorkout = function () { modal.classList.add('hidden'); };

    window.addExerciseToBuilder = function () {
        var name = document.getElementById('ex-name').value;
        var sets = document.getElementById('ex-sets').value;
        var reps = document.getElementById('ex-reps').value;
        var weight = document.getElementById('ex-weight').value;
        if (name && sets && reps) {
            currentSession.push({ name: name, sets: sets, reps: reps, weight: weight || '0' });
            document.getElementById('ex-name').value = '';
            document.getElementById('ex-sets').value = '';
            document.getElementById('ex-reps').value = '';
            document.getElementById('ex-weight').value = '';
            // Render
            var row = document.createElement('div');
            row.className = 'exercise-row';
            row.innerHTML = '<div style="font-weight:700;font-size:13px;">' + name + '</div><div class="ex-detail">' + sets + ' x ' + reps + ' @ ' + weight + 'kg</div>';
            list.appendChild(row);
        }
    };

    window.saveLogWorkout = function () {
        var title = document.getElementById('input-workout-name').value || 'Workout Session';
        if (currentSession.length === 0) return;
        AppState.today.workoutsCompleted++;
        AjwaaBrain.addLog({
            type: 'workout', title: title, exercises: currentSession,
            value: currentSession.length + ' exercises', icon: '🏋️'
        });
        AjwaaBrain.saveState();
        renderDashboard();
        window.closeLogWorkout();
    };
}

// ─── WORKOUT TIMER OVERLAY ───

function setupOverlayLogic() {
    var overlay = document.getElementById('active-workout-overlay');
    var timerDisplay = document.getElementById('active-timer');
    var timerRing = document.getElementById('timer-ring-val');
    var titleEl = document.getElementById('active-title');
    var typeEl = document.getElementById('active-type');
    var currentWorkoutId = null;
    var timerInterval = null;

    AjwaaBrain.startWorkout = function (id) {
        var workout = AppState.workoutLibrary.find(function (w) { return w.id === id; });
        if (!workout) return;
        currentWorkoutId = id;
        titleEl.textContent = workout.title;
        typeEl.textContent = workout.intensity.toUpperCase();
        overlay.classList.remove('hidden');
        var seconds = workout.duration * 60;
        var totalSeconds = seconds;
        if (timerInterval) clearInterval(timerInterval);
        timerDisplay.textContent = fmt(seconds);
        timerInterval = setInterval(function () {
            seconds--;
            timerDisplay.textContent = fmt(seconds);
            var off = 283 - (283 * (seconds / totalSeconds));
            if (timerRing) timerRing.style.strokeDashoffset = off;
            if (seconds <= 0) { clearInterval(timerInterval); }
        }, 1000);
    };

    function fmt(s) {
        var m = Math.floor(s / 60).toString().padStart(2, '0');
        var sec = (s % 60).toString().padStart(2, '0');
        return m + ':' + sec;
    }

    document.getElementById('cancel-workout-btn').addEventListener('click', function () {
        clearInterval(timerInterval); overlay.classList.add('hidden');
    });
    document.getElementById('complete-workout-btn').addEventListener('click', function () {
        clearInterval(timerInterval);
        if (currentWorkoutId) { AjwaaBrain.logWorkout(currentWorkoutId); renderDashboard(); overlay.classList.add('hidden'); }
    });
}

document.addEventListener('DOMContentLoaded', init);
