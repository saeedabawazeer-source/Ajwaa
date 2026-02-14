import { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
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
import Toast from './components/Toast';
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
    showToast('+250ml 💧');
  }

  function handleSaveMeal(food, cals, p, c, f) {
    store.addMeal(mealSlot, food, Number(cals), Number(p), Number(c), Number(f));
    showToast(`${food} logged ✅`);
  }

  function handleSaveWorkout(title, exercises) {
    store.logWorkoutSession(title, exercises);
    setWorkoutOpen(false);
    showToast(`${title} saved 🏋️`);
  }

  if (state.activeWorkout) {
    return (
      <ActiveWorkout
        workout={state.activeWorkout}
        onAddExercise={store.addExerciseToActive}
        onUpdateSet={store.updateSet}
        onAddSet={store.addSet}
        onRemoveSet={store.removeSet}
        onFinish={() => { store.finishWorkout(); showToast('Workout saved! 💪'); }}
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
            streak={streak}
            getLast7Days={store.getLast7Days}
            onWaterClick={() => { store.addWater(0.25); showToast('+250ml 💧'); }}
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
            streak={streak}
            onUpdate={store.updateProfile}
            onLogWeight={store.logBodyWeight}
            getWeightHistory={store.getWeightHistory}
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
    </div>
  );
}
