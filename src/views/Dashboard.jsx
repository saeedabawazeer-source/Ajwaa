import { Coffee, Sun, Moon, Utensils, Plus, X, Droplets, Play, Flame } from 'lucide-react';
import { WORKOUT_TEMPLATES } from '../data/workoutTemplates';
import { OWNER_PLAN } from '../data/secretPlan';
import './Dashboard.css';

const SLOTS = [
    { id: 'breakfast', label: 'Breakfast', icon: <Coffee size={15} /> },
    { id: 'lunch', label: 'Lunch', icon: <Sun size={15} /> },
    { id: 'dinner', label: 'Dinner', icon: <Moon size={15} /> },
    { id: 'snacks', label: 'Snacks', icon: <Utensils size={15} /> },
];

function todayLabel() {
    return new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });
}

export default function Dashboard({
    user, today, totals, streak, dateLabel,
    onAddMeal, onRemoveMeal, onAddWater, onStartWorkout,
    ownerMode, supplementChecks, onToggleSupplement, onOpenPlan,
}) {
    const recommended = WORKOUT_TEMPLATES[new Date().getDay() % WORKOUT_TEMPLATES.length];
    const target = user.calorieTarget || 0;
    const eaten = Math.round(totals.cals);
    const remaining = Math.max(0, target - eaten);
    const pct = target ? Math.min(100, Math.round((eaten / target) * 100)) : 0;
    const waterPct = user.waterGoal ? Math.min(100, Math.round(((today?.water ?? 0) / user.waterGoal) * 100)) : 0;

    const macros = [
        { label: 'Protein', got: totals.p, goal: user.macros?.p || 0 },
        { label: 'Carbs', got: totals.c, goal: user.macros?.c || 0 },
        { label: 'Fat', got: totals.f, goal: user.macros?.f || 0 },
    ];

    return (
        <div className="db-page">
            <div className="db-head">
                <div>
                    <div className="db-eyebrow">{dateLabel || todayLabel()}</div>
                    <h1 className="db-title">Today</h1>
                </div>
                <div className="db-head-right">
                    {ownerMode && onOpenPlan && (
                        <button className="db-plan-chip" onClick={onOpenPlan}>My plan</button>
                    )}
                    {streak > 0 && (
                        <div className="db-streak"><Flame size={13} fill="currentColor" /> {streak}d</div>
                    )}
                </div>
            </div>

            {/* Calories + macros */}
            <section className="db-card">
                <div className="db-cal-row">
                    <div className="db-cal-num">
                        <strong>{remaining}</strong>
                        <span>kcal left</span>
                    </div>
                    <div className="db-cal-side">
                        <span>{eaten} eaten</span>
                        <span>{target} target</span>
                    </div>
                </div>
                <div className="db-bar"><div className="db-bar-fill" style={{ width: `${pct}%` }} /></div>
                <div className="db-macros">
                    {macros.map(m => {
                        const mpct = m.goal ? Math.min(100, Math.round((m.got / m.goal) * 100)) : 0;
                        return (
                            <div className="db-macro" key={m.label}>
                                <div className="db-macro-top">
                                    <span>{m.label}</span>
                                    <strong>{Math.round(m.got)}<i>/{m.goal}</i></strong>
                                </div>
                                <div className="db-bar sm"><div className="db-bar-fill" style={{ width: `${mpct}%` }} /></div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Meals on the left, vertical water widget on the right */}
            <div className="db-mid">
                <section className="db-card">
                    <div className="db-card-head">
                        <h2>Meals</h2>
                        <span className="db-card-meta">{eaten} kcal</span>
                    </div>
                    <ul className="db-slots">
                        {SLOTS.map(slot => {
                            const items = today?.meals?.[slot.id] || [];
                            const slotCals = items.reduce((a, m) => a + (Number(m.cals) || 0), 0);
                            return (
                                <li className="db-slot" key={slot.id}>
                                    <div className="db-slot-main">
                                        <div className="db-slot-name">{slot.icon} {slot.label}</div>
                                        <div className="db-slot-items">
                                            {items.length === 0 ? 'nothing yet' : items.map(m => m.food).join(', ')}
                                        </div>
                                    </div>
                                    <span className="db-slot-cals">{slotCals > 0 ? slotCals : ''}</span>
                                    <button className="db-slot-add" onClick={() => onAddMeal(slot.id)} aria-label={`Add to ${slot.label}`}>
                                        <Plus size={15} />
                                    </button>
                                    {items.length > 0 && (
                                        <button className="db-slot-del" onClick={() => onRemoveMeal(slot.id, items.length - 1)} aria-label={`Undo last ${slot.label} item`}>
                                            <X size={13} />
                                        </button>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </section>

                <div className="db-water-v">
                    <button className="db-water-v-btn" onClick={() => onAddWater(0.25)} aria-label="Add 250ml water">+</button>
                    <div className="db-water-v-track">
                        <div className="db-water-v-fill" style={{ height: `${waterPct}%` }} />
                    </div>
                    <div className="db-water-v-val"><Droplets size={13} /> {today?.water ?? 0}L</div>
                    <button className="db-water-v-btn ghost" onClick={() => onAddWater(-0.25)} aria-label="Remove 250ml water">−</button>
                </div>
            </div>

            {/* Supplements — owner checklist */}
            {ownerMode && (
                <section className="db-card">
                    <div className="db-card-head">
                        <h2>Supplements</h2>
                        <span className="db-card-meta">
                            {OWNER_PLAN.supplements.filter(s => supplementChecks?.[s.name]).length}/{OWNER_PLAN.supplements.length} taken
                        </span>
                    </div>
                    <ul className="db-sup-grid">
                        {OWNER_PLAN.supplements.map(s => {
                            const done = Boolean(supplementChecks?.[s.name]);
                            return (
                                <li key={s.name}>
                                    <button className={`db-sup-chip ${done ? 'done' : ''}`} onClick={() => onToggleSupplement(s.name)}>
                                        <span className="db-sup-chip-name">{s.name}</span>
                                        <span className="db-sup-chip-dose">{s.dose}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            )}

            {/* Training */}
            <section className="db-card">
                <div className="db-card-head">
                    <h2>Training</h2>
                    <span className="db-card-meta">{recommended.exercises.length} moves</span>
                </div>
                <div className="db-train-name">{recommended.name}</div>
                <div className="db-train-desc">{recommended.desc}</div>
                <button className="db-start" onClick={() => onStartWorkout(recommended.name, recommended.exercises)}>
                    <Play size={15} fill="currentColor" /> Start session
                </button>
            </section>
        </div>
    );
}


