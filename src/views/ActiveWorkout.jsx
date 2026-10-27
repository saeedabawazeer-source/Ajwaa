import { useState } from 'react';
import { searchExercises, getMuscleGroups } from '../data/exerciseDB';
import ExerciseIllustration from '../components/ExerciseIllustration';
import { Dumbbell, X, Plus, TrendingUp, RotateCcw, Search } from 'lucide-react';
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

  const totalEx = workout.exercises.length;

  const ex = workout.exercises[activeEx] || null;
  const exIndex = activeEx;
  const lastWt = ex ? (getLastWeight?.(ex.exerciseId) || null) : null;
  const results = search ? searchExercises(search) : [];
  const muscles = getMuscleGroups();

  const allExercisesDone = totalEx > 0 && workout.exercises.every(e => e.sets.length > 0 && e.sets.every(s => s.reps && Number(s.reps) > 0));

  function addSetHere() { onAddSet(exIndex); }

  function pickExercise(e) {
    if (swapping) { onReplaceExercise(exIndex, e.id, e.name); setSwapping(false); }
    else { onAddExercise(e.id, e.name); setActiveEx(totalEx); }
    setPicking(false); setSearch('');
  }
  function startSwap() { setSwapping(true); setPicking(true); setSearch(''); }
  function finishWorkout() { if (allExercisesDone) { onCelebrate?.(); onFinish(); } }

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
        <div style={{ width: 46 }} />
      </div>

      {/* One bar: a section per exercise, Done at the end */}
      <div className="aw-sections">
        {workout.exercises.map((e, i) => {
          const doneSets = e.sets.filter(s => s.reps && Number(s.reps) > 0).length;
          const fill = e.sets.length ? Math.round((doneSets / e.sets.length) * 100) : 0;
          return (
            <button
              key={e.exerciseId + i}
              className={`aw-section ${i === activeEx ? 'on' : ''}`}
              onClick={() => setActiveEx(i)}
              title={e.name}
              aria-label={e.name}
            >
              <span className="aw-section-fill" style={{ width: `${fill}%` }} />
            </button>
          );
        })}
        <button className="aw-done-pill" onClick={finishWorkout} disabled={!allExercisesDone}>
          Done
        </button>
      </div>

      {ex && (
        <div className="aw-stage">
          <div className="aw-ex-top">
            <div className="aw-ex-info">
              <div className="aw-ex-name">{ex.name}</div>
              {lastWt && <div className="aw-last"><TrendingUp size={12} /> LAST {lastWt} KG</div>}
            </div>
            <div className="aw-ex-actions">
              <button className="aw-mini-btn" onClick={startSwap}><RotateCcw size={12} /> Swap</button>
              <button className="aw-mini-btn" onClick={() => setPicking(true)}><Plus size={12} /> Add</button>
            </div>
          </div>

          <div className="aw-frame">
            <div className="aw-frame-inner">
              <ExerciseIllustration exerciseId={ex.exerciseId} size={340} />
            </div>
            <div className="aw-frame-badge"><Dumbbell size={12} /></div>
          </div>

          {/* Sets under the animation, 2x2 tiles */}
          <div className="aw-sets-2x2">
            {ex.sets.map((s, i) => (
              <div className="aw-set-tile" key={i}>
                <div className="aw-set-tile-head">
                  <span>Set {i + 1}</span>
                  <button
                    className="aw-set-tile-x"
                    onClick={() => onRemoveSet(exIndex, i)}
                    disabled={ex.sets.length <= 1}
                    aria-label={`Remove set ${i + 1}`}
                  >
                    <X size={12} />
                  </button>
                </div>
                <div className="aw-set-tile-inputs">
                  <input
                    className="aw-set-in"
                    type="number"
                    inputMode="numeric"
                    placeholder="reps"
                    value={s.reps ?? ''}
                    onChange={e => onUpdateSet(exIndex, i, e.target.value === '' ? '' : Number(e.target.value), s.weight ?? '')}
                  />
                  <input
                    className="aw-set-in"
                    type="number"
                    inputMode="decimal"
                    placeholder={lastWt ? String(lastWt) : 'kg'}
                    value={s.weight ?? ''}
                    onChange={e => onUpdateSet(exIndex, i, s.reps ?? '', e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
              </div>
            ))}
            <button className="aw-set-add-tile" onClick={addSetHere}>
              <Plus size={15} /> Add set
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


