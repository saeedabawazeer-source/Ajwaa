import { useState } from 'react';
import { WORKOUT_TEMPLATES } from '../data/workoutTemplates';
import { Dumbbell, Play, Zap, Check, ChevronRight } from 'lucide-react';
import BodyMap from '../components/BodyMap';
import { useStore } from '../store/useStore';
import './Workouts.css';

const SPLIT_OPTIONS = [
    { id: null, label: 'REST', emoji: '😴' },
    { id: 'push', label: 'PUSH', emoji: '🦁' },
    { id: 'pull', label: 'PULL', emoji: '🦅' },
    { id: 'legs', label: 'LEGS', emoji: '🦖' },
    { id: 'upper', label: 'UPPER', emoji: '⚔️' },
    { id: 'full_body', label: 'FULL', emoji: '🔥' },
];

export default function Workouts({ onStartWorkout }) {
    const store = useStore();
    const { state, updateWorkoutSchedule } = store;
    const schedule = state.workoutSchedule || {};

    const todayIndex = new Date().getDay();
    const [selectedDay, setSelectedDay] = useState(todayIndex);
    const [showPicker, setShowPicker] = useState(false);

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const fullDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const activeTemplateId = schedule[selectedDay] || null;
    const activeTemplate = WORKOUT_TEMPLATES.find(t => t.id === activeTemplateId);
    const todayTemplateId = schedule[todayIndex] || null;
    const todayTemplate = WORKOUT_TEMPLATES.find(t => t.id === todayTemplateId);

    function assignSplit(splitId) {
        updateWorkoutSchedule(selectedDay, splitId);
        setShowPicker(false);
    }

    function handleStartTemplate(template) {
        onStartWorkout(template.name);
    }

    return (
        <div className="wo-page">
            {/* ── Week Strip ── */}
            <div className="wo-week-strip">
                {days.map((d, i) => {
                    const isSelected = i === selectedDay;
                    const isToday = i === todayIndex;
                    const split = SPLIT_OPTIONS.find(s => s.id === schedule[i]);
                    return (
                        <button key={i}
                            className={`wo-day ${isSelected ? 'sel' : ''} ${isToday ? 'today' : ''}`}
                            onClick={() => { setSelectedDay(i); setShowPicker(false); }}>
                            <span className="wo-day-letter">{d}</span>
                            <span className="wo-day-split">{split?.emoji || '—'}</span>
                        </button>
                    );
                })}
            </div>

            {/* ── Body Map ── */}
            <BodyMap highlight={activeTemplateId} />

            {/* ── Assign Split Button ── */}
            <button className="wo-assign-btn" onClick={() => setShowPicker(!showPicker)}>
                <span>{fullDays[selectedDay]}: {activeTemplate?.name || 'Rest Day'}</span>
                <span className="wo-assign-edit">TAP TO CHANGE</span>
            </button>

            {/* ── Split Picker (toggle) ── */}
            {showPicker && (
                <div className="wo-split-picker">
                    {SPLIT_OPTIONS.map(s => (
                        <button key={s.label}
                            className={`wo-split-opt ${activeTemplateId === s.id ? 'active' : ''}`}
                            onClick={() => assignSplit(s.id)}>
                            <span>{s.emoji}</span>
                            <span>{s.label}</span>
                            {activeTemplateId === s.id && <Check size={14} strokeWidth={4} />}
                        </button>
                    ))}
                </div>
            )}

            {/* ── Today's Workout CTA ── */}
            {todayTemplate && (
                <button className="wo-today-hero" onClick={() => handleStartTemplate(todayTemplate)}>
                    <div className="wo-hero-left">
                        <div className="wo-hero-icon"><Dumbbell size={22} strokeWidth={3} /></div>
                        <div>
                            <div className="wo-hero-title">TODAY: {todayTemplate.name}</div>
                            <div className="wo-hero-sub">{todayTemplate.exercises.length} exercises · ~45min</div>
                        </div>
                    </div>
                    <div className="wo-hero-go">GO</div>
                </button>
            )}

            {/* ── Template Library ── */}
            <div className="wo-section-title">
                <Zap size={16} fill="var(--c-volt)" color="var(--c-volt)" />
                <span>WORKOUT LIBRARY</span>
            </div>

            <div className="wo-templates">
                {WORKOUT_TEMPLATES.map(t => (
                    <button key={t.id} className="wo-tpl-card" onClick={() => handleStartTemplate(t)}>
                        <div className="wo-tpl-emoji">
                            {t.name.includes('Push') ? '🦁' : t.name.includes('Pull') ? '🦅' : t.name.includes('Leg') ? '🦖' : t.name.includes('Upper') ? '⚔️' : '🔥'}
                        </div>
                        <div className="wo-tpl-info">
                            <div className="wo-tpl-name">{t.name}</div>
                            <div className="wo-tpl-desc">{t.desc}</div>
                            <div className="wo-tpl-chips">
                                {t.exercises.slice(0, 3).map((ex, i) => (
                                    <span key={i} className="wo-tpl-chip">{ex.name}</span>
                                ))}
                                {t.exercises.length > 3 && <span className="wo-tpl-chip more">+{t.exercises.length - 3}</span>}
                            </div>
                        </div>
                        <ChevronRight size={18} opacity={0.3} />
                    </button>
                ))}
            </div>

            {/* Quick Start Freestyle */}
            <button className="wo-freestyle" onClick={() => onStartWorkout('Freestyle Session')}>
                <Play size={16} fill="currentColor" />
                <span>FREESTYLE SESSION</span>
            </button>
        </div>
    );
}
