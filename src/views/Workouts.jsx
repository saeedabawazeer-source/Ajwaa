import { useState } from 'react';
import { WORKOUT_TEMPLATES } from '../data/workoutTemplates';
import { Dumbbell, BarChart2, Play, Clipboard, CalendarDays, Zap, Check } from 'lucide-react';
import BodyMap from '../components/BodyMap';
import { useStore } from '../store/useStore';
import './Workouts.css';

export default function Workouts({ onStartWorkout }) {
    const store = useStore();
    const { state, updateWorkoutSchedule } = store;
    const workoutSchedule = state.workoutSchedule || { 0: null, 1: 'push', 2: 'pull', 3: 'legs', 4: null, 5: 'upper', 6: 'full_body' };

    const todayIndex = new Date().getDay();
    const [selectedDay, setSelectedDay] = useState(todayIndex);
    const [tab, setTab] = useState('sessions');
    const [workoutName, setWorkoutName] = useState('');

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const scheduledTemplateId = workoutSchedule[selectedDay];

    function handleStart() {
        const name = workoutName.trim() || 'Freestyle Session';
        onStartWorkout(name);
        setWorkoutName('');
    }

    function handleStartTemplate(template) {
        onStartWorkout(template.name);
    }

    function handleToggleSchedule(templateId) {
        if (scheduledTemplateId === templateId) {
            updateWorkoutSchedule(selectedDay, null); // Unassign
        } else {
            updateWorkoutSchedule(selectedDay, templateId); // Assign
        }
    }

    return (
        <div className="view-section" style={{ paddingBottom: 100 }}>
            {/* Schedule Selector */}
            <div className="card schedule-card">
                <div className="schedule-header">
                    <CalendarDays size={18} />
                    <span>WEEKLY SPLIT</span>
                </div>
                <div className="schedule-days-row">
                    {days.map((d, i) => {
                        const isSelected = i === selectedDay;
                        const isToday = i === todayIndex;
                        const hasWorkout = !!workoutSchedule[i];
                        return (
                            <div key={i} className={`schedule-day-btn ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                                onClick={() => setSelectedDay(i)}>
                                <div className="sd-label">{d}</div>
                                {hasWorkout && <div className="sd-dot" />}
                            </div>
                        );
                    })}
                </div>
                <div className="schedule-status text-label" style={{ marginTop: 12, textAlign: 'center' }}>
                    {fullDays[selectedDay]}: {scheduledTemplateId ? WORKOUT_TEMPLATES.find(t => t.id === scheduledTemplateId)?.name || 'Custom' : 'Rest Day'}
                </div>
            </div>

            {/* Body Map Visualizer */}
            <BodyMap highlight={scheduledTemplateId} />

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
            <div className="text-h2" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}>
                <span>BATTLE BLUEPRINTS</span>
                <Zap size={20} fill="var(--c-gold)" color="var(--c-gold)" />
            </div>
            <div className="text-label" style={{ marginBottom: 12 }}>Assign templates to your split or start now.</div>

            <div className="wo-list">
                {WORKOUT_TEMPLATES.map(t => {
                    const isAssigned = scheduledTemplateId === t.id;
                    return (
                        <div key={t.id} className={`card template-card ${isAssigned ? 'assigned' : ''}`}>
                            <div className="template-icon">
                                {t.name.includes('Push') ? '🦁' : t.name.includes('Pull') ? '🦅' : t.name.includes('Legs') ? '🦖' : '⚔️'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 900, fontSize: 16 }}>{t.name}</div>
                                <div className="text-label" style={{ opacity: 0.6 }}>{t.desc}</div>
                                <div className="template-exercises" style={{ marginTop: 6 }}>
                                    {t.exercises.slice(0, 3).map((ex, i) => (
                                        <span key={i} className="template-ex-chip">{ex.name}</span>
                                    ))}
                                    {t.exercises.length > 3 && <span className="template-ex-chip">+{t.exercises.length - 3}</span>}
                                </div>
                            </div>
                            <div className="template-actions">
                                <button 
                                    className={`btn-assign ${isAssigned ? 'active' : ''}`} 
                                    onClick={() => handleToggleSchedule(t.id)}
                                >
                                    {isAssigned ? <Check size={14} strokeWidth={4} /> : '+'}
                                </button>
                                <button className="btn-start-small" onClick={() => handleStartTemplate(t)}>
                                    START
                                </button>
                            </div>
                        </div>
                    );
                })}
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
