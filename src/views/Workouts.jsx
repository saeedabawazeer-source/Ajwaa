import { WORKOUT_TEMPLATES } from '../data/workoutTemplates';
import { Play, Zap, Dumbbell, Clock, Trophy, Target, Flame, Star } from 'lucide-react';
import './Workouts.css';

export default function Workouts({ onStartWorkout, streak = 0, xp = 0, xpProg }) {
    const today = new Date().getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const recommended = WORKOUT_TEMPLATES[today % WORKOUT_TEMPLATES.length];

    return (
        <div className="wk-page">
            {/* Gamification strip */}
            <div className="wk-gamify">
                <div className="wk-gm-left">
                    <div className="wk-gm-lvl">
                        <span className="wk-gm-lvl-tag">LVL</span>
                        <span className="wk-gm-lvl-num">{xpProg?.level ?? 0}</span>
                    </div>
                    <div className="wk-gm-xp">
                        <div className="wk-gm-bar"><div className="wk-gm-fill" style={{ width: `${xpProg?.percentage ?? 0}%` }} /></div>
                        <div className="wk-gm-xp-text"><Zap size={10} fill="currentColor" /> {xp} XP · {xpProg?.needed ?? 100} to next</div>
                    </div>
                </div>
                <div className="wk-gm-streak"><Flame size={14} fill="currentColor" /> {streak}</div>
            </div>

            {/* Daily quest */}
            <div className="wk-quest">
                <div className="wk-quest-icon"><Trophy size={16} /></div>
                <div className="wk-quest-text">
                    <div className="wk-quest-title">DAILY QUEST</div>
                    <div className="wk-quest-sub">Complete {recommended.name}</div>
                </div>
                <div className="wk-quest-xp">+100 XP</div>
            </div>

            {/* Featured hero */}
            <div className="wk-hero">
                <div className="wk-hero-top">
                    <span className="wk-day">{dayNames[today].toUpperCase()}</span>
                    <span className="wk-hero-xp"><Star size={12} fill="currentColor" /> +100 XP</span>
                </div>
                <div className="wk-hero-name">{recommended.name}</div>
                <div className="wk-hero-desc">{recommended.desc}</div>
                <div className="wk-hero-meta">
                    <span><Dumbbell size={13} /> {recommended.exercises.length} moves</span>
                    <span><Clock size={13} /> ~45 min</span>
                    <span><Target size={13} /> {recommended.difficulty || 'Medium'}</span>
                </div>
                <button className="wk-start" onClick={() => onStartWorkout(recommended.name, recommended.exercises)}>
                    <Play size={16} fill="currentColor" /> START CHALLENGE
                </button>
            </div>

            {/* All challenges */}
            <div className="wk-label">ALL CHALLENGES</div>
            <div className="wk-grid">
                {WORKOUT_TEMPLATES.map((t, i) => (
                    <button key={t.id} className={`wk-card ${t.id === recommended.id ? 'rec' : ''}`}
                        onClick={() => onStartWorkout(t.name, t.exercises)}>
                        <div className="wk-card-num">{String(i + 1).padStart(2, '0')}</div>
                        <div className="wk-card-name">{t.name}</div>
                        <div className="wk-card-meta">{t.exercises.length} moves</div>
                        <div className="wk-card-go"><Play size={14} fill="currentColor" /></div>
                    </button>
                ))}
            </div>
        </div>
    );
}