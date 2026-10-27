import { useState, useEffect, useRef } from 'react';
import { useStore } from './store/useStore';
import Header from './components/Header';
import Dock from './components/Dock';
import AjwaChat from './components/AjwaChat';
import LogMealModal from './components/LogMealModal';
import LogWorkoutModal from './components/LogWorkoutModal';
import SecretLogin from './components/SecretLogin';
import Dashboard from './views/Dashboard';
import Workouts from './views/Workouts';
import ActiveWorkout from './views/ActiveWorkout';
import Stats from './views/Stats';
import Profile from './views/Profile';
import Social from './views/Social';
import Toast from './components/Toast';
import Confetti from './components/Confetti';
import Onboarding from './views/Onboarding';
import Landing from './views/Landing';
import OwnerPlan from './views/OwnerPlan';
import Meals from './views/Meals';
import CoachView from './views/CoachView';
import SaeedProtocolView from './views/SaeedProtocolView';
import './App.css';

export default function App() {
  const store = useStore();
  const { state } = store;

  // Deep links (deliberately not in the nav): /saeed or #saeed opens the
  // personal protocol view, #owner or /owner opens the secret owner login.
  const wantsSaeedView = typeof window !== 'undefined' && (
    window.location.pathname.includes('/saeed') || window.location.hash === '#saeed'
  );

  const VIEWS = ['dashboard', 'meals', 'workouts', 'stats', 'profile', 'social', 'coach', 'saeed', 'plan'];

  const [activeView, setActiveView] = useState(() => {
    if (typeof window === 'undefined') return 'dashboard';
    if (wantsSaeedView) return 'saeed';
    const saved = localStorage.getItem('ajwaa_last_view');
    // 'saeed' is URL-only, so a stale saved value can't trap a normal user there.
    return VIEWS.includes(saved) && saved !== 'saeed' ? saved : 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('ajwaa_last_view', activeView);
  }, [activeView]);

  const [chatOpen, setChatOpen] = useState(false);
  const [mealOpen, setMealOpen] = useState(false);
  const [mealSlot, setMealSlot] = useState('snacks');
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Celebration state
  const [confettiActive, setConfettiActive] = useState(false);

  const [showLanding, setShowLanding] = useState(() => {
    return typeof window !== 'undefined' && localStorage.getItem('ajwaa_preset_unlocked') !== 'true';
  });

  // ─── SECRET OWNER LOGIN ───
  // Opens by loading the app with #owner (or /owner). 5 quick taps on the AJWAA
  // logo also work whenever the logo has no click handler of its own.
  const [secretOpen, setSecretOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.location.hash === '#owner' || window.location.pathname.includes('/owner');
  });
  const secretTapRef = useRef({ count: 0, last: 0 });

  function handleSecretTap() {
    const now = Date.now();
    secretTapRef.current = now - secretTapRef.current.last < 1200
      ? { count: secretTapRef.current.count + 1, last: now }
      : { count: 1, last: now };
    if (secretTapRef.current.count >= 5) {
      secretTapRef.current = { count: 0, last: 0 };
      setSecretOpen(true);
    }
  }

  function handleOwnerLogin() {
    store.loginAsOwner();
    localStorage.setItem('ajwaa_preset_unlocked', 'true');
    setActiveView('plan');
  }

  function closeSecret() {
    setSecretOpen(false);
    // Owner login drops straight into the app — no landing page, no onboarding.
    if (state.ownerMode) setShowLanding(false);
  }

  if (showLanding) {
    return (
      <>
        <Landing onStart={() => setShowLanding(false)} onSecretTap={handleSecretTap} />
        <SecretLogin open={secretOpen} onClose={closeSecret} onSuccess={handleOwnerLogin} />
      </>
    );
  }

  if (!state.onboardingComplete) {
    return (
      <>
        <Onboarding onComplete={store.completeOnboarding} />
        {/* Hidden owner hot-spot: 5 quick taps in the top-left corner open the
            secret login, so it is reachable on a phone without typing a URL.
            That corner holds only the progress bar, nothing interactive. */}
        <div
          onPointerDown={handleSecretTap}
          aria-hidden="true"
          style={{ position: 'fixed', top: 0, left: 0, width: 132, height: 60, zIndex: 9999, background: 'transparent' }}
        />
        <SecretLogin open={secretOpen} onClose={closeSecret} onSuccess={handleOwnerLogin} />
      </>
    );
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  }

  function handleLogFood(slot) {
    setMealSlot(slot || 'snacks');
    setMealOpen(true);
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

  const currentViewDate = todayKey();

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
    // A running session takes over the whole screen.
    if (state.activeWorkout) {
      return (
        <ActiveWorkout
          workout={state.activeWorkout}
          onAddExercise={store.addExerciseToActive}
          onReplaceExercise={store.replaceExerciseInActive}
          onUpdateSet={store.updateSet}
          onAddSet={store.addSet}
          onRemoveSet={store.removeSet}
          onFinish={() => { store.finishWorkout(); showToast('Workout saved! 💪'); }}
          onCancel={store.cancelWorkout}
          getLastWeight={store.getLastWeight}
          onCelebrate={() => setConfettiActive(true)}
        />
      );
    }

    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            user={state.user}
            today={currentDayData}
            totals={currentTotals}
            streak={currentStreak}
            onAddMeal={handleLogFood}
            onRemoveMeal={store.removeMeal}
            onAddWater={(amount) => store.addWater(amount, currentViewDate)}
            onStartWorkout={(title, exercises) => {
              store.startWorkout(title, exercises);
              setActiveView('workouts');
            }}
            ownerMode={state.ownerMode}
            supplementChecks={state.supplementChecks?.[currentViewDate] || {}}
            onToggleSupplement={(name) => store.toggleSupplement(name, currentViewDate)}
            onOpenPlan={() => setActiveView('plan')}
          />
        );
      case 'meals':
        return (
          <Meals
            user={state.user}
            today={currentDayData}
            totals={currentTotals}
            onAddMeal={handleLogFood}
            onRemoveMeal={store.removeMeal}
            onAddWater={(amount) => store.addWater(amount, currentViewDate)}
            onLogWeight={store.logBodyWeight}
          />
        );
      case 'workouts':
        return (
          <Workouts
            onStartWorkout={(title, exercises) => store.startWorkout(title, exercises)}
            streak={streak}
            today={currentDayData}
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
      case 'plan':
        return (
          <OwnerPlan
            onStartWorkout={(title, exercises) => {
              store.startWorkout(title);
              exercises.forEach(ex => store.addExerciseToActive(ex.exerciseId, ex.name));
              setActiveView('workouts');
            }}
            onOpenProtocol={() => setActiveView('saeed')}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="app">
      {activeView !== 'saeed' && <Header userName={state.user.name} streak={streak} onOpenCoach={() => setChatOpen(true)} />}
      <div className="view-section">
        {renderView()}
      </div>
      {activeView !== 'saeed' && (
        <>
          <Dock activeView={activeView} onNavigate={setActiveView} />
          <AjwaChat open={chatOpen} onClose={() => setChatOpen(false)} totals={totals} user={state.user} streak={streak} today={today} xp={state.xp} state={state} onLogMeal={(a) => {
        store.addMeal(a.slot, a.food, a.cals, a.p, a.c, a.f, currentViewDate);
        showToast(`Logged: ${a.food}`);
      }} />
        </>
      )}

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
      <Confetti active={confettiActive} onDone={() => setConfettiActive(false)} />

      <SecretLogin open={secretOpen} onClose={closeSecret} onSuccess={handleOwnerLogin} />
    </div>
  );
}
