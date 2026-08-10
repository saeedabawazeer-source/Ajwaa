import { useState, useEffect, useRef } from 'react';
import { useStore } from './store/useStore';
import { getLevel } from './store/xpEngine';
import Header from './components/Header';
import Dock from './components/Dock';
import AjwaChat from './components/AjwaChat';
import LogMealModal from './components/LogMealModal';
import LogWorkoutModal from './components/LogWorkoutModal';
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
import Landing from './views/Landing';
import CoachView from './views/CoachView';
import SaeedProtocolView from './views/SaeedProtocolView';
import './App.css';

export default function App() {
  const store = useStore();
  const { state } = store;

  const isSaeedRoute = typeof window !== 'undefined' && (
    window.location.pathname.includes('/saeed') || 
    window.location.hash === '#saeed'
  );

  const [activeView, setActiveView] = useState(isSaeedRoute ? 'saeed' : 'dashboard');
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

  useEffect(() => {
    const currentLevel = getLevel(state.xp);
    if (currentLevel > prevLevelRef.current && prevLevelRef.current >= 0) {
      setTimeout(() => {
        setLevelUpLevel(currentLevel);
        setConfettiActive(true);
      }, 0);
    }
    const xpGain = state.xp - prevXPRef.current;
    if (xpGain > 0 && prevXPRef.current >= 0) {
      setTimeout(() => setXpPopup(xpGain), 0);
    }
    prevLevelRef.current = currentLevel;
    prevXPRef.current = state.xp;
  }, [state.xp]);

  // Landing page state (bypassed if PIN 555 was entered or on /saeed route)
  const [showLanding, setShowLanding] = useState(() => {
    if (isSaeedRoute) return false;
    return localStorage.getItem('ajwaa_preset_unlocked') !== 'true';
  });

  if (showLanding) {
    return <Landing onStart={() => setShowLanding(false)} />;
  }

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

  function handleLogWater() {
    store.addWater(0.25, currentViewDate);
    showToast('+250ml water');
  }

  function handleSaveMeal(food, cals, p, c, f) {
    store.addMeal(mealSlot, food, cals, p, c, f, currentViewDate);
    setMealOpen(false);
    showToast('Meal Logged!');
  }

  function handleSaveWorkout(title, exercises) {
    store.logWorkoutSession(title, exercises);
    setWorkoutOpen(false);
    showToast(`${title} saved`);
  }

  const todayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const currentViewDate = viewDate || todayKey();

  const currentDayData = state.days[currentViewDate] || {
    meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
    workouts: [],
    water: 0
  };

  const currentTotals = {
    cals: Object.values(currentDayData.meals).flat().reduce((a, b) => a + b.cals, 0),
    p: Object.values(currentDayData.meals).flat().reduce((a, b) => a + b.p, 0),
    c: Object.values(currentDayData.meals).flat().reduce((a, b) => a + b.c, 0),
    f: Object.values(currentDayData.meals).flat().reduce((a, b) => a + b.f, 0),
  };

  const currentStreak = store.getStreak();
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
            onStartWorkout={(title) => {
              store.startWorkout(title || 'Chest & Triceps');
              setActiveView('workouts');
            }}
          />
        );
      case 'workouts':
        return (
          <Workouts
            today={today}
            user={state.user}
            activeWorkout={state.activeWorkout}
            onStartWorkout={(title) => {
              store.startWorkout(title || 'Workout Session');
            }}
            onAddExercise={store.addExerciseToActive}
            onUpdateSet={store.updateSet}
            onAddSet={store.addSet}
            onRemoveSet={store.removeSet}
            onFinishWorkout={() => {
              store.finishWorkout();
              showToast('Workout saved! 💪');
            }}
            onCancelWorkout={store.cancelWorkout}
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
              setActiveView('workouts');
              showToast(`Copied: ${title}`);
            }}
          />
        );
      case 'coach':
        return <CoachView />;
      case 'saeed':
        return <SaeedProtocolView />;
      default:
        return null;
    }
  }

  return (
    <div className="app">
      <Header userName={state.user.name} streak={streak} />
      <div className="view-section">
        {renderView()}
      </div>
      <Dock activeView={activeView} onNavigate={setActiveView} onFab={() => setChatOpen(true)} isCoach={state.user.role === 'coach'} />
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
