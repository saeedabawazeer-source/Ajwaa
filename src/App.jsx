import { useState, useEffect, useRef } from 'react';
import { useStore } from './store/useStore';
import { getLevel } from './store/xpEngine';
import Header from './components/Header';
import Dock from './components/Dock';
import ActionSheet from './components/ActionSheet';
import LogMealModal from './components/LogMealModal';
import LogWorkoutModal from './components/LogWorkoutModal';
import ActiveWorkout from './views/ActiveWorkout';
import Dashboard from './views/Dashboard';
import Workouts from './views/Workouts';
import Stats from './views/Stats';
import Profile from './views/Profile';
import Social from './views/Social';
import Toast from './components/Toast';
import XPPopup from './components/XPPopup';
import Confetti from './components/Confetti';
import LevelUpModal from './components/LevelUpModal';
import './App.css';

export default function App() {
  const store = useStore();
  const { state } = store;
  const [activeView, setActiveView] = useState('dashboard');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mealOpen, setMealOpen] = useState(false);
  const [mealSlot, setMealSlot] = useState('snacks');
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Celebration state
  const [xpPopup, setXpPopup] = useState(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState(null);
  const prevLevelRef = useRef(getLevel(state.xp));
  const prevXPRef = useRef(state.xp);

  // Check for level up
  useEffect(() => {
    const currentLevel = getLevel(state.xp);
    if (currentLevel > prevLevelRef.current && prevLevelRef.current >= 0) {
      setLevelUpLevel(currentLevel);
      setConfettiActive(true);
    }
    // Show XP gain popup
    const xpGain = state.xp - prevXPRef.current;
    if (xpGain > 0 && prevXPRef.current > 0) {
      setXpPopup(xpGain);
    }
    prevLevelRef.current = currentLevel;
    prevXPRef.current = state.xp;
  }, [state.xp]);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  }

  function handleLogFood(slot) {
    setSheetOpen(false);
    setMealSlot(slot || 'snacks');
    setMealOpen(true);
  }

  function handleLogWorkout() {
    setSheetOpen(false);
    setWorkoutOpen(true);
  }

  function handleLogWater() {
    store.addWater(0.25);
    setSheetOpen(false);
    showToast('+250ml water');
  }

  function handleSaveMeal(food, cals, p, c, f) {
    store.addMeal(mealSlot, food, Number(cals), Number(p), Number(c), Number(f));
    showToast(`${food} logged`);
  }

  function handleSaveWorkout(title, exercises) {
    store.logWorkoutSession(title, exercises);
    setWorkoutOpen(false);
    showToast(`${title} saved`);
  }

  if (state.activeWorkout) {
    return (
      <ActiveWorkout
        workout={state.activeWorkout}
        onAddExercise={store.addExerciseToActive}
        onUpdateSet={store.updateSet}
        onAddSet={store.addSet}
        onRemoveSet={store.removeSet}
        onFinish={() => { store.finishWorkout(); showToast('Workout complete!'); }}
        onCancel={store.cancelWorkout}
      />
    );
  }

  const today = store.getToday();
  const totals = store.getTodayTotals();
  const streak = store.getStreak();

  function renderView() {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            today={today} totals={totals} user={state.user}
            streak={streak} xp={state.xp}
            getLast7Days={store.getLast7Days}
            onWaterClick={() => { store.addWater(0.25); showToast('+250ml water'); }}
            onMealSlotClick={handleLogFood}
            onRemoveMeal={store.removeMeal}
          />
        );
      case 'workouts':
        return (
          <Workouts
            today={today} user={state.user}
            onStartWorkout={(title) => store.startWorkout(title || 'Workout Session')}
            onLogWorkout={() => setWorkoutOpen(true)}
            getExerciseHistory={store.getExerciseHistory}
          />
        );
      case 'stats':
        return (
          <Stats
            days={state.days} user={state.user} today={today} totals={totals}
            getLast7Days={store.getLast7Days}
            getWeightHistory={store.getWeightHistory}
          />
        );
      case 'profile':
        return (
          <Profile
            user={state.user} today={today} totals={totals}
            streak={streak} xp={state.xp}
            unlockedAchievements={state.unlockedAchievements}
            onUpdate={store.updateProfile}
            onLogWeight={store.logBodyWeight}
            getWeightHistory={store.getWeightHistory}
          />
        );
      case 'social':
        return (
          <Social
            userName={state.user.name} xp={state.xp} streak={streak}
            onCopyWorkout={(title, exercises) => {
              store.startWorkout(title);
              exercises.forEach(ex => {
                store.addExerciseToActive(ex.name);
              });
              showToast(`Copied: ${title}`);
            }}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="app">
      <Header userName={state.user.name} streak={streak} />
      {renderView()}
      <Dock activeView={activeView} onNavigate={setActiveView} onFab={() => setSheetOpen(true)} />
      <ActionSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onLogFood={handleLogFood} onLogWorkout={handleLogWorkout} onLogWater={handleLogWater} />

      <LogMealModal
        open={mealOpen}
        onClose={() => setMealOpen(false)}
        onSave={handleSaveMeal}
        slot={mealSlot}
        onSlotChange={setMealSlot}
      />

      <LogWorkoutModal open={workoutOpen} onClose={() => setWorkoutOpen(false)} onSave={handleSaveWorkout} />
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Celebrations */}
      {xpPopup && <XPPopup xp={xpPopup} onDone={() => setXpPopup(null)} />}
      <Confetti active={confettiActive} onDone={() => setConfettiActive(false)} />
      {levelUpLevel !== null && <LevelUpModal level={levelUpLevel} xp={state.xp} onClose={() => setLevelUpLevel(null)} />}
    </div>
  );
}
