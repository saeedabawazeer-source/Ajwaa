import { Play, Dumbbell, Clock, ChevronRight } from 'lucide-react';
import { WORKOUT_TEMPLATES } from '../data/workoutTemplates';
import './Workouts.css';

export default function Workouts({ onStartWorkout, streak = 0, today = {} }) {
    const recommended = WORKOUT_TEMPLATES[new Date().getDay() % WORKOUT_TEMPLATES.length];
    const logged = today?.workouts || [];
    const dateLabel = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });

    return (
        <div className="wk-page">
            <div className="wk-head">
                <div>
                    <div className="wk-eyebrow">{dateLabel}</div>
                    <h1 className="wk-title">Train</h1>
                </div>
                {streak > 0 && <div className="wk-streak">{streak}d streak</div>}
            </div>

            <section className="wk-today">
                <div className="wk-today-label">Today&apos;s session</div>
                <div className="wk-today-name">{recommended.name}</div>
                <div className="wk-today-desc">{recommended.desc}</div>
                <div className="wk-today-meta">
                    <span><Dumbbell size={14} /> {recommended.exercises.length} exercises</span>
                    <span><Clock size={14} /> ~{Math.max(20, recommended.exercises.length * 6)} min</span>
                </div>
                <button className="wk-start" onClick={() => onStartWorkout(recommended.name, recommended.exercises)}>
                    <Play size={17} fill="currentColor" /> Start session
                </button>
            </section>

            {logged.length > 0 && (
                <section className="wk-logged">
                    <div className="wk-section-label">Logged today</div>
                    {logged.map(w => (
                        <div className="wk-logged-row" key={w.id}>
                            <span className="wk-logged-name">{w.title}</span>
                            <span className="wk-logged-meta">{w.time} · {(w.exercises || []).length} moves</span>
                        </div>
                    ))}
                </section>
            )}

            <div className="wk-section-label">All sessions</div>
            <div className="wk-list">
                {WORKOUT_TEMPLATES.map(t => (
                    <button key={t.id} className="wk-row" onClick={() => onStartWorkout(t.name, t.exercises)}>
                        <div className="wk-row-main">
                            <div className="wk-row-name">{t.name}</div>
                            <div className="wk-row-desc">{t.desc}</div>
                        </div>
                        <span className="wk-row-count">{t.exercises.length}</span>
                        <ChevronRight size={18} />
                    </button>
                ))}
            </div>
        </div>
    );
}
