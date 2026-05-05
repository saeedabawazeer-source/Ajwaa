import { useState } from 'react';
import { WORKOUT_TEMPLATES } from '../data/workoutTemplates';
import { Dumbbell, Play, Zap, Check, ChevronRight, Minus } from 'lucide-react';
import BodyMap from '../components/BodyMap';
import { useStore } from '../store/useStore';
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
            {/* Week Strip */}
            <div className="wo-week-strip">
                {days.map((d, i) => {
                    const isSelected = i === selectedDay;
                    const isToday = i === todayIndex;
                    const splitId = schedule[i];
                    const color = splitId ? SPLIT_COLORS[splitId] : null;
                    return (
                        <button key={i}
                            className={`wo-day ${isSelected ? 'sel' : ''} ${isToday ? 'today' : ''}`}
                            onClick={() => { setSelectedDay(i); setShowPicker(false); }}>
                            <span className="wo-day-letter">{d}</span>
                            {color ? <span className="wo-day-dot" style={{ background: color }} /> : <Minus size={10} opacity={0.2} />}
                        </button>
                    );
                })}
            </div>

            {/* Body Map */}
            <BodyMap highlight={activeTemplateId} />

            {/* Assign Split */}
            <button className="wo-assign-btn" onClick={() => setShowPicker(!showPicker)}>
                <span>{fullDays[selectedDay]}: {activeTemplate?.name || 'Rest Day'}</span>
                <span className="wo-assign-edit">TAP TO CHANGE</span>
            </button>

            {/* Split Picker */}
            {showPicker && (
                <div className="wo-split-picker">
                    {SPLIT_OPTIONS.map(s => (
                        <button key={s.label}
                            className={`wo-split-opt ${activeTemplateId === s.id ? 'active' : ''}`}
                            onClick={() => assignSplit(s.id)}>
                            {s.id && <span className="wo-split-dot" style={{ background: SPLIT_COLORS[s.id] }} />}
                            <span>{s.label}</span>
                            {activeTemplateId === s.id && <Check size={12} strokeWidth={4} />}
                        </button>
                    ))}
                </div>
            )}

            {/* Today CTA */}
            {todayTemplate && (
                <button className="wo-today-hero" onClick={() => handleStartTemplate(todayTemplate)}>
                    <div className="wo-hero-left">
                        <div className="wo-hero-icon"><Dumbbell size={22} strokeWidth={3} /></div>
                        <div>
                            <div className="wo-hero-title">TODAY: {todayTemplate.name}</div>
                            <div className="wo-hero-sub">{todayTemplate.exercises.length} exercises</div>
                        </div>
                    </div>
                    <div className="wo-hero-go">GO</div>
                </button>
            )}

            {/* Library */}
            <div className="wo-section-title">
                <Zap size={14} />
                <span>WORKOUT LIBRARY</span>
            </div>

            <div className="wo-templates">
                {WORKOUT_TEMPLATES.map(t => (
                    <button key={t.id} className="wo-tpl-card" onClick={() => handleStartTemplate(t)}>
                        <div className="wo-tpl-dot" style={{ background: SPLIT_COLORS[t.id] || 'var(--c-black)' }} />
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

            {/* Freestyle */}
            <button className="wo-freestyle" onClick={() => onStartWorkout('Freestyle Session')}>
                <Play size={16} fill="currentColor" />
                <span>FREESTYLE SESSION</span>
            </button>
        </div>
    );
}
