import { useState } from 'react';
import { calcVolume } from '../utils/helpers';
import { WORKOUT_TEMPLATES } from '../data/workoutTemplates';
import { Dumbbell, BarChart2, Play, Clipboard } from 'lucide-react';
import './Workouts.css';

export default function Workouts({ today, user, onStartWorkout, onLogWorkout, getExerciseHistory }) {
    const [tab, setTab] = useState('sessions');
    const [workoutName, setWorkoutName] = useState('');

    const workouts = today.workouts || [];
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const todayIndex = new Date().getDay();

    function handleStart() {
        const name = workoutName.trim() || 'Freestyle Session';
        onStartWorkout(name);
        setWorkoutName('');
    }

    return (
        <div className="view-section" style={{ paddingBottom: 100 }}>
            {/* Weekly Streak / Schedule Visual */}
            <div className="card" style={{ padding: 12, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="text-label">WEEKLY CONSISTENCY</div>
                <div style={{ display: 'flex', gap: 6 }}>
                    {days.map((d, i) => (
                        <div key={i} style={{
                            width: 24, height: 24, borderRadius: 6, display: 'grid', placeItems: 'center',
                            fontSize: 10, fontWeight: 800,
                            background: i === todayIndex ? 'var(--c-black)' : 'var(--c-sand)',
                            color: i === todayIndex ? 'var(--c-volt)' : 'var(--c-black)',
                            border: '1px solid var(--c-black)'
                        }}>
                            {d}
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Start Hero */}
            <div className="card start-wo-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontWeight: 900, fontSize: 18, textTransform: 'uppercase' }}>QUICK START</div>
                    <Dumbbell size={20} />
                </div>
                <div className="start-wo-row">
                    <input className="modal-input" style={{ margin: 0, flex: 1, background: 'white', borderColor: 'black' }}
                        placeholder="Session Name..."
                        value={workoutName} onChange={e => setWorkoutName(e.target.value)} />
                    <button className="start-wo-btn" onClick={handleStart}>GO</button>
                </div>
            </div>

            {/* Gamified Templates List */}
            <div className="text-h2" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>CHOOSE YOUR BATTLE</span>
                <Clipboard size={20} strokeWidth={3} />
            </div>

            <div className="wo-list">
                {WORKOUT_TEMPLATES.map(t => (
                    <div key={t.id} className="card template-card" onClick={() => handleStartTemplate(t)}>
                        <div className="template-icon">
                            {t.name.includes('Push') ? '🦁' : t.name.includes('Pull') ? '🦅' : t.name.includes('Legs') ? '🦖' : '⚔️'}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 800, fontSize: 16 }}>{t.name}</div>
                            <div className="text-label" style={{ opacity: 0.6 }}>{t.desc}</div>
                            <div className="template-exercises" style={{ marginTop: 6 }}>
                                {t.exercises.slice(0, 3).map((ex, i) => (
                                    <span key={i} className="template-ex-chip">{ex.name}</span>
                                ))}
                                {t.exercises.length > 3 && <span className="template-ex-chip">+{t.exercises.length - 3}</span>}
                            </div>
                        </div>
                        <div style={{ background: 'var(--c-black)', color: 'white', padding: '4px 8px', borderRadius: 6, fontWeight: 900, fontSize: 12 }}>
                            START
                        </div>
                    </div>
                ))}
            </div>

            {/* History Link */}
            <div style={{ marginTop: 24, textAlign: 'center' }}>
                <button className="btn-outline" onClick={() => setTab(tab === 'history' ? 'sessions' : 'history')}>
                    {tab === 'history' ? 'Hide History' : 'View Workout History'}
                </button>
            </div>

            {tab === 'history' && (
                <div className="wo-list" style={{ marginTop: 16 }}>
                    <div className="card" style={{ textAlign: 'center', padding: 20 }}>
                        <div style={{ marginBottom: 8, opacity: 0.3 }}><BarChart2 size={48} /></div>
                        <div style={{ fontWeight: 800, fontSize: 14 }}>Nothing here yet!</div>
                        <div className="text-label" style={{ marginTop: 4 }}>Complete a workout to fill your history</div>
                    </div>
                </div>
            )}
        </div>
    );
}
