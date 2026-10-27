import { useState } from 'react';
import { searchExercises, getMuscleGroups } from '../data/exerciseDB';
import ExerciseIllustration from '../components/ExerciseIllustration';
import { Dumbbell, X, Plus, Check, TrendingUp, ChevronLeft, ChevronRight, RotateCcw, Trophy, Zap, Search } from 'lucide-react';
import './ActiveWorkout.css';

export default function ActiveWorkout({
  workout,
  onAddExercise,
  onReplaceExercise,
  onUpdateSet,
  onAddSet,
  onRemoveSet,
  onFinish,
  onCancel,
  getLastWeight,
  onCelebrate,
}) {
  const [activeEx, setActiveEx] = useState(0);
  const [picking, setPicking] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [search, setSearch] = useState('');
  const [completed, setCompleted] = useState(false);
  const [cheer, setCheer] = useState(false);

  const totalEx = workout.exercises.length;

  const ex = workout.exercises[activeEx] || null;
  const exIndex = activeEx;
  const lastWt = ex ? (getLastWeight?.(ex.exerciseId) || null) : null;
  const results = search ? searchExercises(search) : [];
  const muscles = getMuscleGroups();

  const totalSets = ex ? ex.sets.length : 0;
  const setsDone = ex ? ex.sets.filter(s => s.reps && Number(s.reps) > 0).length : 0;
  const allSetsDone = totalSets > 0 && setsDone === totalSets;
  const allExercisesDone = totalEx > 0 && workout.exercises.every(e => e.sets.length > 0 && e.sets.every(s => s.reps && Number(s.reps) > 0));

  function addSetHere() { onAddSet(exIndex); }
  function nextExercise() { if (activeEx < totalEx - 1) { setActiveEx(activeEx + 1); setCheer(true); setTimeout(() => setCheer(false), 700); } else { setCompleted(true); } }
  function prevExercise() { if (activeEx > 0) { setActiveEx(activeEx - 1); } }

  function pickExercise(e) {
    if (swapping) { onReplaceExercise(exIndex, e.id, e.name); setSwapping(false); }
    else { onAddExercise(e.id, e.name); setActiveEx(totalEx); }
    setPicking(false); setSearch('');
  }
  function startSwap() { setSwapping(true); setPicking(true); setSearch(''); }
  function finishWorkout() { if (allExercisesDone) onFinish(); }

  if (picking) return (
    <div className="aw-page aw-picker-page">
      <div className="aw-header">
        <button className="aw-cancel" onClick={() => { setPicking(false); setSwapping(false); setSearch(''); }}><X size={20} /></button>
        <div className="aw-title">{swapping ? 'SWAP EXERCISE' : 'ADD EXERCISE'}</div>
        <div style={{ width: 40 }} />
      </div>
      <div className="aw-search-bar">
        <Search size={16} />
        <input className="aw-picker-in" placeholder="Search movements..." value={search} onChange={e => setSearch(e.target.value)} autoFocus />
      </div>
      {search ? (
        <div className="aw-results">
          {results.length === 0 && <div className="aw-no-results">No moves found</div>}
          {results.map(e => (
            <button key={e.id} className="aw-res" onClick={() => pickExercise(e)}>
              <span className="aw-res-name">{e.name}</span>
              <span className="aw-res-m">{e.muscle}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="aw-muscles">
          {muscles.map(m => (<button key={m} className="aw-muscle" onClick={() => setSearch(m)}>{m}</button>))}
        </div>
      )}
    </div>
  );

  if (completed) return (
    <div className="aw-page aw-done-page">
      <div className="aw-done-stars">✦ ✦ ✦</div>
      <Trophy size={80} strokeWidth={1.5} color="var(--c-gold)" />
      <div className="aw-done-title">SESSION COMPLETE</div>
      <div className="aw-done-stats">
        <span><Trophy size={16} /> {totalEx} exercises</span>
        <span><Zap size={16} fill="currentColor" /> {workout.exercises.reduce((acc, e) => acc + e.sets.length, 0)} sets</span>
      </div>
      <button className="aw-done-btn" onClick={() => { onCelebrate?.(); onFinish(); }}>
        <Check size={18} /> COLLECT REWARD
      </button>
      <button className="aw-done-back" onClick={() => setCompleted(false)}>
        <RotateCcw size={14} /> Go back
      </button>
    </div>
  );

  if (totalEx === 0) return (
    <div className="aw-page aw-empty-page">
      <div className="aw-empty-icon">✦</div>
      <div className="aw-empty-t">No exercises yet</div>
      <div className="aw-empty-s">Add your first move to start the challenge.</div>
      <button className="aw-add-ex" onClick={() => setPicking(true)}>
        <Plus size={16} /> ADD EXERCISE
      </button>
    </div>
  );

  return (
    <div className="aw-page">
      <div className="aw-header">
        <button className="aw-cancel" onClick={onCancel}>END</button>
        <div className="aw-title">{workout.title}</div>
        <button className="aw-finish" onClick={finishWorkout} disabled={!allExercisesDone}>
          <Check size={15} /> DONE
        </button>
      </div>

      {/* Exercise picker — bubbles with the movement name and set progress */}
      <div className="aw-chips">
        {workout.exercises.map((e, i) => {
          const doneSets = e.sets.filter(s => s.reps && Number(s.reps) > 0).length;
          const isDone = e.sets.length > 0 && doneSets === e.sets.length;
          return (
            <button
              key={e.exerciseId + i}
              className={`aw-chip ${i === activeEx ? 'on' : ''} ${isDone ? 'done' : ''}`}
              onClick={() => setActiveEx(i)}
            >
              <span className="aw-chip-name">{e.name}</span>
              <span className="aw-chip-sets">{doneSets}/{e.sets.length}</span>
            </button>
          );
        })}
      </div>

      {/* Prev / Add / Next live on top so the bottom stays free */}
      <div className="aw-top-nav">
        <button className="aw-nav-btn" onClick={prevExercise} disabled={activeEx === 0}>
          <ChevronLeft size={18} /> Prev
        </button>
        <button className="aw-nav-btn add" onClick={() => setPicking(true)}>
          <Plus size={16} /> Exercise
        </button>
        <button className="aw-nav-btn next" onClick={nextExercise} disabled={!allSetsDone}>
          {activeEx === totalEx - 1 ? 'Finish' : 'Next'} <ChevronRight size={18} />
        </button>
      </div>

      {ex && (
        <div className={`aw-stage ${cheer ? 'cheer' : ''}`}>
          <div className="aw-ex-top">
            <button className="aw-swap-btn" onClick={startSwap}>
              <RotateCcw size={12} /> SWAP
            </button>
          </div>

          <div className="aw-work">
            <div className="aw-frame">
              <div className="aw-frame-inner">
                <ExerciseIllustration exerciseId={ex.exerciseId} size={200} />
              </div>
              <div className="aw-frame-badge"><Dumbbell size={12} /></div>
            </div>

            <div className="aw-work-col">
              <div className="aw-ex-info">
                <div className="aw-ex-name">{ex.name}</div>
                {lastWt && <div className="aw-last"><TrendingUp size={12} /> LAST {lastWt} KG</div>}
              </div>

          {/* Every set visible and editable at once */}
          <div className="aw-sets">
            <div className="aw-set-head">
              <span>SET</span>
              <span>REPS</span>
              <span>KG</span>
              <span />
            </div>
            {ex.sets.map((s, i) => (
              <div className="aw-set-row" key={i}>
                <span className="aw-set-no">{i + 1}</span>
                <input
                  className="aw-set-in"
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={s.reps ?? ''}
                  onChange={e => onUpdateSet(exIndex, i, e.target.value === '' ? '' : Number(e.target.value), s.weight ?? '')}
                />
                <input
                  className="aw-set-in"
                  type="number"
                  inputMode="decimal"
                  placeholder={lastWt ? String(lastWt) : '0'}
                  value={s.weight ?? ''}
                  onChange={e => onUpdateSet(exIndex, i, s.reps ?? '', e.target.value === '' ? '' : Number(e.target.value))}
                />
                <button
                  className="aw-set-x"
                  onClick={() => onRemoveSet(exIndex, i)}
                  disabled={ex.sets.length <= 1}
                  aria-label={`Remove set ${i + 1}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button className="aw-set-add" onClick={addSetHere}>
              <Plus size={15} /> Add set
            </button>
          </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


