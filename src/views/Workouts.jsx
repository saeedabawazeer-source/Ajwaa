import { useState } from 'react';
import { calcVolume } from '../utils/helpers';
import { Dumbbell, BarChart2, Play } from 'lucide-react';
import './Workouts.css';

export default function Workouts({ today, user, onStartWorkout, onLogWorkout, getExerciseHistory }) {
    const [tab, setTab] = useState('sessions');
    const [workoutName, setWorkoutName] = useState('');

    const workouts = today.workouts || [];

    function handleStart() {
        const name = workoutName.trim() || 'Workout Session';
        onStartWorkout(name);
        setWorkoutName('');
    }

    return (
        <div className="view-section">
            {/* Start New Workout */}
            <div className="card start-wo-card">
                <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 8 }}>START WORKOUT</div>
                <div className="start-wo-row">
                    <input className="modal-input" style={{ margin: 0, flex: 1 }} placeholder="Session name..."
                        value={workoutName} onChange={e => setWorkoutName(e.target.value)} />
                    <button className="btn btn-primary" style={{ flexShrink: 0, padding: '10px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
                        onClick={handleStart}>
                        <Play size={16} fill="currentColor" /> START
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="wo-tabs">
                <button className={`wo-tab ${tab === 'sessions' ? 'active' : ''}`} onClick={() => setTab('sessions')}>
                    Today ({workouts.length})
                </button>
                <button className={`wo-tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>
                    History
                </button>
            </div>

            {tab === 'sessions' && (
                <div className="wo-list">
                    {workouts.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: 20 }}>
                            <div style={{ marginBottom: 8, opacity: 0.3 }}><Dumbbell size={48} /></div>
                            <div className="text-label">NO SESSIONS TODAY</div>
                            <div style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>Start a workout above or log one quickly</div>
                        </div>
                    ) : (
                        workouts.map((w, i) => {
                            const totalVol = w.exercises.reduce((v, ex) => v + calcVolume(ex.sets), 0);
                            return (
                                <div key={i} className="card session-card">
                                    <div className="session-top">
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: 15 }}>{w.title}</div>
                                            <div className="text-label">{w.time} · {w.exercises.length} exercises · {totalVol.toLocaleString()}kg vol</div>
                                        </div>
                                    </div>
                                    <div className="session-ex-grid">
                                        {w.exercises.map((ex, j) => {
                                            const best = ex.sets.reduce((b, s) => s.weight > b.weight ? s : b, { reps: 0, weight: 0 });
                                            return (
                                                <div key={j} className="session-ex-chip">
                                                    <span style={{ fontWeight: 700 }}>{ex.name}</span>
                                                    <span className="ex-nums">{ex.sets.length}×{best.reps} @ {best.weight}kg</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {tab === 'history' && (
                <div className="wo-list">
                    <div className="card" style={{ textAlign: 'center', padding: 20 }}>
                        <div style={{ marginBottom: 8, opacity: 0.3 }}><BarChart2 size={48} /></div>
                        <div style={{ fontWeight: 800, fontSize: 14 }}>Exercise Progression</div>
                        <div className="text-label" style={{ marginTop: 4 }}>Track your lifts over time in the Stats tab</div>
                    </div>
                </div>
            )}
        </div>
    );
}
