import { useState, useEffect } from 'react';
import { WORKOUT_TEMPLATES } from '../data/workoutTemplates';
import BodyMap from '../components/BodyMap';
import PersonalRecords from '../components/PersonalRecords';
import { searchExercises, getMuscleGroups } from '../data/exerciseDB';
import { useStore } from '../store/useStore';
import KenneyIcon from '../components/KenneyIcon';
import './Workouts.css';

const SPLIT_COLORS = {
    push: 'var(--c-red)',
    pull: '#3B82F6',
    legs: 'var(--c-volt)',
    upper: '#FF9800',
    full_body: 'var(--c-green)',
};

const SPLIT_OPTIONS = [
    { id: null, label: 'REST' },
    { id: 'push', label: 'PUSH' },
    { id: 'pull', label: 'PULL' },
    { id: 'legs', label: 'LEGS' },
    { id: 'upper', label: 'UPPER' },
    { id: 'full_body', label: 'FULL' },
];

export default function Workouts({ today, user, activeWorkout, onStartWorkout, onAddExercise, onUpdateSet, onAddSet, onRemoveSet, onFinishWorkout, onCancelWorkout }) {
    const store = useStore();
    const { state, updateWorkoutSchedule } = store;
    const schedule = state.workoutSchedule || {};

    const todayIndex = new Date().getDay();
    const [selectedDay, setSelectedDay] = useState(todayIndex);
    const [activeTab, setActiveTab] = useState('today'); // 'today' | 'schedule' | 'records'

    // Active session state
    const [search, setSearch] = useState('');
    const [picking, setPicking] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [completedSets, setCompletedSets] = useState({});

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const fullDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const todayTemplateId = schedule[todayIndex] || null;
    const todayTemplate = WORKOUT_TEMPLATES.find(t => t.id === todayTemplateId);

    const selectedTemplateId = schedule[selectedDay] || null;
    const selectedTemplate = WORKOUT_TEMPLATES.find(t => t.id === selectedTemplateId);

    const searchResults = search ? searchExercises(search) : [];
    const muscles = getMuscleGroups();

    useEffect(() => {
        let interval = null;
        if (timerActive && timerSeconds > 0) {
            interval = setInterval(() => setTimerSeconds(s => s - 1), 1000);
        } else if (timerSeconds === 0 && timerActive) {
            setTimerActive(false);
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                try { navigator.vibrate([100, 50, 100]); } catch { /* unsupported */ }
            }
        }
        return () => clearInterval(interval);
    }, [timerActive, timerSeconds]);

    function startRestTimer(secs) {
        setTimerSeconds(secs);
        setTimerActive(true);
    }

    function toggleSetDone(exIdx, sIdx) {
        const key = `${exIdx}-${sIdx}`;
        const nextState = !completedSets[key];
        setCompletedSets(prev => ({ ...prev, [key]: nextState }));
        if (nextState) {
            startRestTimer(60);
        }
    }

    function assignSplit(splitId) {
        updateWorkoutSchedule(selectedDay, splitId);
    }

    function handlePickExercise(ex) {
        if (onAddExercise) onAddExercise(ex.id, ex.name);
        setPicking(false);
        setSearch('');
    }

    // ─── 1. LIVE WORKOUT SESSION MODE ───
    if (activeWorkout) {
        return (
            <div className="wo-view">
                {/* Active Session Top Card */}
                <div className="card wo-session-top-card">
                    <div>
                        <span className="wo-stc-badge">LIVE SESSION</span>
                        <div className="wo-stc-title">{activeWorkout.title}</div>
                    </div>
                    <div className="wo-stc-actions">
                        <button className="btn btn-volt wo-stc-finish-btn" onClick={onFinishWorkout}>
                            <KenneyIcon name="check" size={14} /> FINISH
                        </button>
                        <button className="wo-stc-cancel-btn" onClick={onCancelWorkout} title="Cancel">
                            <KenneyIcon name="cross" size={14} />
                        </button>
                    </div>
                </div>

                {/* Rest Timer Bar */}
                <div className="wo-timer-banner">
                    <div className="wo-tb-left">
                        <KenneyIcon name="star" size={14} tint="volt" />
                        <span>REST TIMER: <strong>{timerSeconds > 0 ? `${timerSeconds}s` : 'READY'}</strong></span>
                    </div>
                    <div className="wo-tb-presets">
                        <button onClick={() => startRestTimer(30)}>30s</button>
                        <button onClick={() => startRestTimer(60)}>60s</button>
                        <button onClick={() => startRestTimer(90)}>90s</button>
                        {timerActive && (
                            <button className="reset-btn" onClick={() => setTimerActive(false)}><KenneyIcon name="cross" size={10} /></button>
                        )}
                    </div>
                </div>

                {/* Exercises List */}
                <div className="wo-session-exercises-list">
                    {activeWorkout.exercises.length === 0 && !picking && (
                        <div className="card wo-session-empty">
                            <KenneyIcon name="workout" size={36} />
                            <div style={{ fontWeight: 900, marginTop: 8 }}>Session Empty</div>
                            <div className="text-label" style={{ marginTop: 2 }}>Add an exercise to log sets</div>
                            <button className="btn btn-volt" style={{ marginTop: 12, fontSize: 12, padding: '8px 16px' }} onClick={() => setPicking(true)}>
                                + ADD EXERCISE
                            </button>
                        </div>
                    )}

                    {activeWorkout.exercises.map((ex, exIdx) => (
                        <div key={exIdx} className="card wo-ex-card">
                            <div className="wo-ex-card-header">
                                <span style={{ fontWeight: 900, fontSize: 14 }}>{ex.name}</span>
                                <span className="text-label">{ex.sets.length} sets</span>
                            </div>

                            <div className="wo-set-table">
                                <div className="wo-st-head">
                                    <span>SET</span><span>REPS</span><span>KG</span><span>1RM</span><span>DONE</span><span></span>
                                </div>
                                {ex.sets.map((s, sIdx) => {
                                    const reps = Number(s.reps) || 0;
                                    const weight = Number(s.weight) || 0;
                                    const est1RM = reps && weight ? Math.round(weight * (1 + reps / 30)) : 0;
                                    const isDone = !!completedSets[`${exIdx}-${sIdx}`];

                                    return (
                                        <div key={sIdx} className={`wo-st-row ${isDone ? 'done' : ''}`}>
                                            <span className="wo-st-num">{sIdx + 1}</span>
                                            <input className="wo-st-input" type="number" value={s.reps || ''} placeholder="0"
                                                onChange={e => onUpdateSet(exIdx, sIdx, e.target.value, s.weight)} />
                                            <input className="wo-st-input" type="number" value={s.weight || ''} placeholder="0"
                                                onChange={e => onUpdateSet(exIdx, sIdx, s.reps, e.target.value)} />
                                            <span className="wo-st-1rm">{est1RM ? `${est1RM}k` : '-'}</span>
                                            <button className={`wo-st-check ${isDone ? 'checked' : ''}`} onClick={() => toggleSetDone(exIdx, sIdx)}>
                                                {isDone && <KenneyIcon name="check" size={12} />}
                                            </button>
                                            <button className="wo-st-del" onClick={() => onRemoveSet(exIdx, sIdx)}><KenneyIcon name="cross" size={12} /></button>
                                        </div>
                                    );
                                })}
                            </div>
                            <button className="wo-add-set-btn" onClick={() => onAddSet(exIdx)}>+ ADD SET</button>
                        </div>
                    ))}

                    {picking ? (
                        <div className="card wo-picker-card">
                            <input className="modal-input" placeholder="Search exercise (e.g. Bench, Squat)..." value={search} onChange={e => setSearch(e.target.value)} autoFocus />
                            {search ? (
                                <div className="wo-picker-list">
                                    {searchResults.map(ex => (
                                        <button key={ex.id} className="wo-picker-item" onClick={() => handlePickExercise(ex)}>
                                            <span style={{ fontWeight: 800 }}>{ex.name}</span>
                                            <span className="text-label">{ex.muscle}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="wo-muscle-pills">
                                    {muscles.map(m => (
                                        <button key={m} className="wo-mpill" onClick={() => setSearch(m)}>{m}</button>
                                    ))}
                                </div>
                            )}
                            <button className="btn btn-outline" style={{ width: '100%', marginTop: 8, fontSize: 11 }} onClick={() => setPicking(false)}>CANCEL</button>
                        </div>
                    ) : (
                        <button className="btn btn-volt wo-add-ex-btn" onClick={() => setPicking(true)}>
                            <KenneyIcon name="plus" size={16} /> ADD EXERCISE TO SESSION
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ─── 2. MAIN WORKOUTS TAB (Clean & Gamified) ───
    return (
        <div className="wo-view">
            {/* Top Segmented Navigation Tabs */}
            <div className="wo-nav-tabs">
                <button className={`wo-ntab ${activeTab === 'today' ? 'active' : ''}`} onClick={() => setActiveTab('today')}>
                    <KenneyIcon name="fist" size={16} />
                    <span>Today's Session</span>
                </button>
                <button className={`wo-ntab ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
                    <KenneyIcon name="target" size={16} />
                    <span>Split Planner</span>
                </button>
                <button className={`wo-ntab ${activeTab === 'records' ? 'active' : ''}`} onClick={() => setActiveTab('records')}>
                    <KenneyIcon name="trophy" size={16} />
                    <span>PR Records</span>
                </button>
            </div>

            {/* TAB 1: TODAY'S SESSION (Primary Clean View) */}
            {activeTab === 'today' && (
                <div className="wo-tab-content">
                    {/* Primary Hero CTA Card */}
                    <div className="card wo-hero-focus-card">
                        <div className="wo-hfc-header">
                            <span className="wo-hfc-badge">TODAY'S TARGET</span>
                            <div className="wo-hfc-title" style={{ color: SPLIT_COLORS[todayTemplateId] || 'var(--c-black)' }}>
                                {todayTemplate?.name || 'REST & RECOVERY'}
                            </div>
                            <div className="wo-hfc-sub">
                                {todayTemplate ? `${todayTemplate.exercises.length} Exercises Planned` : 'Rest day scheduled'}
                            </div>
                        </div>

                        {/* SINGLE LOUD ACCENT PRIMARY CTA */}
                        <button className="btn btn-volt wo-hfc-primary-btn" onClick={() => onStartWorkout(todayTemplate?.name || 'Workout Session')}>
                            <KenneyIcon name="fist" size={20} />
                            <span>START WORKOUT SESSION</span>
                        </button>
                    </div>

                    {/* Today's Exercise Breakdown List */}
                    {todayTemplate && (
                        <div className="card wo-today-ex-card">
                            <div className="wo-tex-title">PLANNED EXERCISES</div>
                            <div className="wo-tex-list">
                                {todayTemplate.exercises.map((ex, i) => (
                                    <div key={i} className="wo-tex-item">
                                        <div className="wo-tex-num">{i + 1}</div>
                                        <div className="wo-tex-info">
                                            <div className="wo-tex-name">{ex.name}</div>
                                            <div className="wo-tex-detail">3 Sets • Target 8-12 Reps</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Preset Library Switcher */}
                    <div className="card wo-quick-library-card">
                        <div className="wo-ql-title">OTHER PRESET SPLITS</div>
                        <div className="wo-ql-grid">
                            {WORKOUT_TEMPLATES.map(t => (
                                <button key={t.id} className="wo-ql-item" onClick={() => onStartWorkout(t.name)}>
                                    <span className="wo-ql-dot" style={{ background: SPLIT_COLORS[t.id] || 'var(--c-black)' }} />
                                    <span className="wo-ql-name">{t.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: SPLIT PLANNER & BODY MAP */}
            {activeTab === 'schedule' && (
                <div className="wo-tab-content">
                    <div className="card wo-planner-card">
                        <div className="wo-pc-header">
                            <span>WEEKLY SPLIT PLANNER</span>
                            <span className="text-label">Tap day to configure</span>
                        </div>

                        {/* 7-Day Week Strip */}
                        <div className="wo-week-strip">
                            {days.map((d, i) => {
                                const isSelected = i === selectedDay;
                                const isToday = i === todayIndex;
                                const splitId = schedule[i];
                                const color = splitId ? SPLIT_COLORS[splitId] : null;
                                return (
                                    <button key={i}
                                        className={`wo-day ${isSelected ? 'sel' : ''} ${isToday ? 'today' : ''}`}
                                        onClick={() => setSelectedDay(i)}>
                                        <span className="wo-day-letter">{d}</span>
                                        {color ? <span className="wo-day-dot" style={{ background: color }} /> : <KenneyIcon name="minus" size={8} style={{ opacity: 0.3 }} />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Interactive Body Map */}
                        <BodyMap highlight={selectedTemplateId} />

                        {/* 1-Tap Split Selector */}
                        <div className="wo-split-assign-row">
                            <span className="wo-sar-day">{fullDays[selectedDay]}:</span>
                            <div className="wo-sar-chips">
                                {SPLIT_OPTIONS.map(s => (
                                    <button key={s.label}
                                        className={`wo-schip ${selectedTemplateId === s.id ? 'active' : ''}`}
                                        onClick={() => assignSplit(s.id)}>
                                        {s.id && <span className="wo-schip-dot" style={{ background: SPLIT_COLORS[s.id] }} />}
                                        <span>{s.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: PR RECORDS */}
            {activeTab === 'records' && (
                <div className="wo-tab-content">
                    <PersonalRecords />
                </div>
            )}
        </div>
    );
}
