import { useState } from 'react';
import { calcVolume } from '../utils/helpers';
import { WORKOUT_TEMPLATES } from '../data/workoutTemplates';
import { Dumbbell, BarChart2, Play, Clipboard } from 'lucide-react';
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

    function handleStartTemplate(template) {
        onStartWorkout(template.name);
    }

    return (
        <div className="view-section">
            {/* Start New Workout */}
            {/* Start New Workout */}
            <div className="card start-wo-card">
                <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 12, textTransform: 'uppercase' }}>QUICK START</div>
                <div className="start-wo-row">
                    <input className="modal-input" style={{ margin: 0, flex: 1, background: 'white', borderColor: 'black' }} placeholder="Session name..."
                        value={workoutName} onChange={e => setWorkoutName(e.target.value)} />
                    <button className="start-wo-btn" onClick={handleStart}>
                        <Dumbbell size={16} /> START
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="wo-tabs">
                <button className={`wo-tab ${tab === 'sessions' ? 'active' : ''}`} onClick={() => setTab('sessions')}>
                    Today ({workouts.length})
                </button>
                <button className={`wo-tab ${tab === 'templates' ? 'active' : ''}`} onClick={() => setTab('templates')}>
                    Templates
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
                            <div style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>Start a workout above or pick a template</div>
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
                                                    <span className="ex-nums">{ex.sets.length}x{best.reps} @ {best.weight}kg</span>
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

            {tab === 'templates' && (
                <div className="wo-list">
                    {WORKOUT_TEMPLATES.map(t => (
                        <div key={t.id} className="card template-card" onClick={() => handleStartTemplate(t)}>
                            <div className="template-top">
                                <div className="template-icon"><Clipboard size={18} /></div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: 14 }}>{t.name}</div>
                                    <div className="text-label">{t.desc}</div>
                                </div>
                            </div>
                            <div className="template-exercises">
                                {t.exercises.map((ex, i) => (
                                    <span key={i} className="template-ex-chip">{ex.name} · {ex.defaultSets}s</span>
                                ))}
                            </div>
                        </div>
                    ))}
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
