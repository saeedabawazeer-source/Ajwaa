import { useState } from 'react';
import { searchExercises, getMuscleGroups } from '../data/exerciseDB';
import { Dumbbell, X, Plus, Check, Play } from 'lucide-react';
import './ActiveWorkout.css';

export default function ActiveWorkout({ workout, onAddExercise, onUpdateSet, onAddSet, onRemoveSet, onFinish, onCancel }) {
    const [search, setSearch] = useState('');
    const [picking, setPicking] = useState(false);

    const results = search ? searchExercises(search) : [];
    const muscles = getMuscleGroups();

    function pickExercise(ex) {
        onAddExercise(ex.id, ex.name);
        setPicking(false);
        setSearch('');
    }

    return (
        <div className="aw-container">
            {/* Header */}
            <div className="aw-header">
                <button className="aw-cancel" onClick={onCancel}><X size={20} /></button>
                <div className="aw-title">{workout.title}</div>
                <button className="btn btn-volt aw-finish" onClick={onFinish} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Check size={16} /> FINISH
                </button>
            </div>

            {/* Exercise List */}
            <div className="aw-body">
                {workout.exercises.length === 0 && !picking && (
                    <div className="aw-empty">
                        <div style={{ marginBottom: 12, opacity: 0.3 }}><Dumbbell size={64} /></div>
                        <div style={{ fontWeight: 800, marginBottom: 4 }}>No exercises yet</div>
                        <div className="text-label">Add your first exercise below</div>
                    </div>
                )}

                {workout.exercises.map((ex, exIdx) => (
                    <div key={exIdx} className="aw-exercise card">
                        <div className="aw-ex-header">
                            <div style={{ fontWeight: 800, fontSize: 14 }}>{ex.name}</div>
                            <span className="text-label">{ex.sets.length} sets</span>
                        </div>
                        <div className="aw-sets">
                            <div className="aw-set-header-row">
                                <span className="aw-set-label">SET</span>
                                <span className="aw-set-label">REPS</span>
                                <span className="aw-set-label">KG</span>
                                <span className="aw-set-label"></span>
                            </div>
                            {ex.sets.map((s, sIdx) => (
                                <div key={sIdx} className="aw-set-row">
                                    <span className="aw-set-num">{sIdx + 1}</span>
                                    <input className="aw-set-input" type="number" value={s.reps || ''} placeholder="0"
                                        onChange={e => onUpdateSet(exIdx, sIdx, e.target.value, s.weight)} />
                                    <input className="aw-set-input" type="number" value={s.weight || ''} placeholder="0"
                                        onChange={e => onUpdateSet(exIdx, sIdx, s.reps, e.target.value)} />
                                    <button className="aw-set-del" onClick={() => onRemoveSet(exIdx, sIdx)}><X size={14} /></button>
                                </div>
                            ))}
                        </div>
                        <button className="aw-add-set" onClick={() => onAddSet(exIdx)}>+ ADD SET</button>
                    </div>
                ))}

                {/* Exercise Picker */}
                {picking ? (
                    <div className="aw-picker card">
                        <input className="modal-input" placeholder="Search exercises..." value={search}
                            onChange={e => setSearch(e.target.value)} autoFocus />
                        {search ? (
                            <div className="aw-search-results">
                                {results.map(ex => (
                                    <button key={ex.id} className="aw-pick-btn" onClick={() => pickExercise(ex)}>
                                        <span style={{ fontWeight: 700 }}>{ex.name}</span>
                                        <span className="text-label">{ex.muscle} · {ex.equipment}</span>
                                    </button>
                                ))}
                                {results.length === 0 && <div className="text-label" style={{ padding: 12, textAlign: 'center' }}>No results</div>}
                            </div>
                        ) : (
                            <div className="aw-muscle-grid">
                                {muscles.map(m => (
                                    <button key={m} className="aw-muscle-btn" onClick={() => setSearch(m)}>{m}</button>
                                ))}
                            </div>
                        )}
                        <button className="btn btn-outline" onClick={() => { setPicking(false); setSearch(''); }} style={{ width: '100%', marginTop: 8 }}>CANCEL</button>
                    </div>
                ) : (
                    <button className="btn btn-volt aw-add-exercise" onClick={() => setPicking(true)}>
                        <Plus size={16} style={{ marginRight: 4 }} /> ADD EXERCISE
                    </button>
                )}
            </div>
        </div>
    );
}
