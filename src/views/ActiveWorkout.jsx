import { useState, useRef } from 'react';
import { searchExercises, getMuscleGroups } from '../data/exerciseDB';
import ExerciseIllustration from '../components/ExerciseIllustration';
import { Dumbbell, X, Plus, Check, TrendingUp, ChevronLeft, ChevronRight, RotateCcw, Trophy, Zap, Search } from 'lucide-react';
import { getXPProgress } from '../store/xpEngine';
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
  streak = 0,
  xp = 0,
  onCelebrate,
}) {
  const [activeEx, setActiveEx] = useState(0);
  const [activeSet, setActiveSet] = useState(0);
  const [picking, setPicking] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [search, setSearch] = useState('');
  const [completed, setCompleted] = useState(false);
  const [cheer, setCheer] = useState(false);
  const inputRef = useRef(null);

  const xpProg = getXPProgress(xp);
  const totalEx = workout.exercises.length;

  const ex = workout.exercises[activeEx] || null;
  const exIndex = activeEx;
  const lastWt = ex ? (getLastWeight?.(ex.exerciseId) || null) : null;
  const results = search ? searchExercises(search) : [];
  const muscles = getMuscleGroups();

  const totalSets = ex ? ex.sets.length : 0;
  const safeSetIndex = ex ? Math.min(activeSet, ex.sets.length - 1) : 0;
  const currentSet = ex ? ex.sets[safeSetIndex] : null;
  const setsDone = ex ? ex.sets.filter(s => s.reps && Number(s.reps) > 0).length : 0;
  const allSetsDone = totalSets > 0 && setsDone === totalSets;
  const allExercisesDone = totalEx > 0 && workout.exercises.every(e => e.sets.length > 0 && e.sets.every(s => s.reps && Number(s.reps) > 0));

  function updateCurrent(field, value) {
    if (!ex) return;
    const val = value === '' ? '' : Number(value);
    if (field === 'reps') onUpdateSet(exIndex, activeSet, val, currentSet?.weight || '');
    else onUpdateSet(exIndex, activeSet, currentSet?.reps || '', val);
  }

  function addSetHere() { onAddSet(exIndex); setActiveSet(ex.sets.length); }
  function removeSetHere() { if (ex.sets.length <= 1) return; onRemoveSet(exIndex, activeSet); setActiveSet(Math.max(0, activeSet - 1)); }
  function nextExercise() { if (activeEx < totalEx - 1) { setActiveEx(activeEx + 1); setActiveSet(0); setCheer(true); setTimeout(() => setCheer(false), 700); } else { setCompleted(true); } }
  function prevExercise() { if (activeEx > 0) { setActiveEx(activeEx - 1); setActiveSet(0); } }

  function pickExercise(e) {
    if (swapping) { onReplaceExercise(exIndex, e.id, e.name); setSwapping(false); }
    else { onAddExercise(e.id, e.name); setActiveEx(totalEx); setActiveSet(0); }
    setPicking(false); setSearch('');
  }
  function logAndAdvance() {
    setCheer(true);
    setTimeout(() => setCheer(false), 400);
    if (!ex || !currentSet) return;
    // If reps empty, just flash. Otherwise advance to next set/exercise.
    if (!currentSet.reps || Number(currentSet.reps) <= 0) return;
    if (activeSet < totalSets - 1) {
      setActiveSet(activeSet + 1);
    } else if (activeEx < totalEx - 1) {
      setActiveEx(activeEx + 1);
      setActiveSet(0);
    } else {
      setCompleted(true);
    }
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
      <div className="aw-done-title">WORKOUT CRUSHED!</div>
      <div className="aw-done-sub">+{Math.min(40 + totalEx * 15, 200)} XP earned</div>
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

      <div className="aw-game-bar">
        <div className="aw-level-badge">
          <span className="aw-lvl-tag">LVL</span>
          <span className="aw-lvl-num">{xpProg.level}</span>
        </div>
        <div className="aw-xp-mini">
          <div className="aw-xp-track"><div className="aw-xp-fill" style={{ width: `${Math.min(xpProg.percentage, 100)}%` }} /></div>
          <span className="aw-xp-tag"><Zap size={10} fill="currentColor" /> {xp} XP</span>
        </div>
        <div className="aw-streak-mini">
          <span className="aw-fire">🔥</span>
          <span>{streak}</span>
        </div>
      </div>

      <div className="aw-progress-chips">
        {workout.exercises.map((e, i) => (
          <button
            key={e.exerciseId + i}
            className={`aw-chip ${i === activeEx ? 'on' : ''} ${e.sets.every(s => s.reps && Number(s.reps) > 0) ? 'done' : ''}`}
            onClick={() => { setActiveEx(i); setActiveSet(0); }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {ex && (
        <div className={`aw-stage ${cheer ? 'cheer' : ''}`}>
          <div className="aw-ex-top">
            <button className="aw-swap-btn" onClick={startSwap}>
              <RotateCcw size={12} /> SWAP
            </button>
          </div>

          <div className="aw-frame">
            <div className="aw-frame-inner">
              <ExerciseIllustration exerciseId={ex.exerciseId} size={260} />
            </div>
            <div className="aw-frame-badge"><Dumbbell size={12} /></div>
          </div>

          <div className="aw-ex-info">
            <div className="aw-ex-name">{ex.name}</div>
            {lastWt && <div className="aw-last"><TrendingUp size={12} /> LAST {lastWt} KG</div>}
          </div>

          <div className="aw-set-stage">
            <div className="aw-set-tabs">
              {ex.sets.map((s, i) => (
                <button
                  key={i}
                  className={`aw-set-tab ${i === activeSet ? 'on' : ''} ${s.reps && Number(s.reps) > 0 ? 'done' : ''}`}
                  onClick={() => setActiveSet(i)}
                >
                  SET {i + 1}
                </button>
              ))}
              <button className="aw-set-tab add" onClick={addSetHere}><Plus size={14} /></button>
            </div>

            {currentSet && (
              <div className="aw-set-card">
                <div className="aw-set-labels">
                  <span>REPS</span>
                  <span>KG</span>
                </div>
                <div className="aw-set-inputs">
                  <input
                    ref={inputRef}
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={currentSet.reps || ''}
                    onChange={e => updateCurrent('reps', e.target.value)}
                    className="aw-big-input"
                  />
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder={lastWt ? String(lastWt) : '0'}
                    value={currentSet.weight || ''}
                    onChange={e => updateCurrent('weight', e.target.value)}
                    className="aw-big-input"
                  />
                </div>
                <div className="aw-set-actions">
                  <button className="aw-set-act del" onClick={removeSetHere} disabled={ex.sets.length <= 1}>
                    <X size={14} /> REMOVE
                  </button>
                  <button className="aw-set-act log" onClick={logAndAdvance}>
                    <Check size={14} /> LOG
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="aw-bottom-nav">
        <button className="aw-nav-main" onClick={prevExercise} disabled={activeEx === 0}>
          <ChevronLeft size={20} /> PREV
        </button>
        <button className="aw-add-ex-label" onClick={() => setPicking(true)}>
          + ADD
        </button>
        <button className="aw-nav-main next" onClick={nextExercise} disabled={!allSetsDone}>
          {activeEx === totalEx - 1 ? 'FINISH' : 'NEXT'} <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}


