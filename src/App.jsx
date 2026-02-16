import { useState, useEffect, useRef } from 'react';
import { useStore } from './store/useStore';
import { getLevel } from './store/xpEngine';
import Header from './components/Header';
import Dock from './components/Dock';
import AjwaChat from './components/AjwaChat';
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
import Onboarding from './views/Onboarding';
import './App.css';

export default function App() {
  const store = useStore();
  const { state } = store;
  const [activeView, setActiveView] = useState('dashboard');
  const [chatOpen, setChatOpen] = useState(false);
  const [mealOpen, setMealOpen] = useState(false);
  const [mealSlot, setMealSlot] = useState('snacks');
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [viewDate, setViewDate] = useState(null); // null means today


  // Celebration state
  const [xpPopup, setXpPopup] = useState(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState(null);
  const prevLevelRef = useRef(getLevel(state.xp));
  const prevXPRef = useRef(state.xp);

  // Mascot Reaction State (Moved up to fix Hook Order Violation)
  const [mascotReaction, setMascotReaction] = useState(null);

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

  if (!state.onboardingComplete) {
    return <Onboarding onComplete={store.completeOnboarding} />;
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  }

  function handleLogFood(slot) {
    setMealSlot(slot || 'snacks');
    setMealOpen(true);
  }

  function handleLogWorkout() {
    setWorkoutOpen(true);
  }



  function triggerMascot(mood) {
    setMascotReaction(mood);
    setTimeout(() => setMascotReaction(null), 2500);
  }

  function handleLogWater() {
    store.addWater(0.25);
    showToast('+250ml water');
    triggerMascot('laugh'); // Laugh/Happy for water
  }

  function handleSaveMeal(food, cals, p, c, f) {
    store.addMeal(mealSlot, food, Number(cals), Number(p), Number(c), Number(f));
    showToast(`${food} logged`);
    triggerMascot('amazed'); // Open mouth for food
  }

  function handleSaveWorkout(title, exercises) {
    store.logWorkoutSession(title, exercises);
    setWorkoutOpen(false);
    showToast(`${title} saved`);
    triggerMascot('happy');
  }

  // ... rest of component ...

  const todayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const currentViewDate = viewDate || todayKey();

  // Get data for selected date (or today)
  const currentDayData = state.days[currentViewDate] || {
    meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
    workouts: [],
    water: 0
  };

  // Calculate totals for selected date
  const currentTotals = {
    cals: Object.values(currentDayData.meals).flat().reduce((a, b) => a + b.cals, 0),
    p: Object.values(currentDayData.meals).flat().reduce((a, b) => a + b.p, 0),
    c: Object.values(currentDayData.meals).flat().reduce((a, b) => a + b.c, 0),
    f: Object.values(currentDayData.meals).flat().reduce((a, b) => a + b.f, 0),
  };

  const currentStreak = store.getStreak(); // Global streak doesn't change by viewing past
  const streak = currentStreak;
  const today = store.getToday();
  const totals = store.getTodayTotals();

  function renderView() {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            today={currentDayData}
            totals={currentTotals}
            user={state.user}
            streak={currentStreak}
            xp={state.xp}
            getLast7Days={store.getLast7Days}
            selectedDate={currentViewDate}
            onSelectDate={setViewDate}
            onWaterClick={handleLogWater}
            onMealSlotClick={handleLogFood}
            onRemoveMeal={store.removeMeal}
            onStartWorkout={() => {
              triggerMascot('beast'); // Go Crazy Mode
              setActiveView('workouts'); // Go to Workouts/Split Screen
            }}
          />
        );
      case 'workouts':
        return (
          <Workouts
            today={today} user={state.user}
            onStartWorkout={(title) => {
              store.startWorkout(title || 'Workout Session');
              triggerMascot('happy');
            }}
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
            getLast7Days={store.getLast7Days}
            days={state.days}
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
              triggerMascot('happy');
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
      <Dock activeView={activeView} onNavigate={setActiveView} onFab={() => setChatOpen(true)} reaction={mascotReaction} />
      <AjwaChat open={chatOpen} onClose={() => setChatOpen(false)} totals={totals} user={state.user} streak={streak} today={today} xp={state.xp} />

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
