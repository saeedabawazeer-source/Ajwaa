import { useState } from 'react';
import { Coffee, Sun, Moon, Utensils, Plus, X, Droplets, Scale } from 'lucide-react';
import './Meals.css';

const SLOTS = [
    { id: 'breakfast', label: 'Breakfast', icon: Coffee },
    { id: 'lunch', label: 'Lunch', icon: Sun },
    { id: 'dinner', label: 'Dinner', icon: Moon },
    { id: 'snacks', label: 'Snacks', icon: Utensils },
];

export default function Meals({ user, today, totals, onAddMeal, onRemoveMeal, onAddWater, onLogWeight, dateLabel }) {
    const [weightInput, setWeightInput] = useState('');
    const target = user.calorieTarget || 0;
    const remaining = Math.max(0, target - totals.cals);

    const macros = [
        { key: 'p', label: 'Protein', got: totals.p, goal: user.macros?.p || 0 },
        { key: 'c', label: 'Carbs', got: totals.c, goal: user.macros?.c || 0 },
        { key: 'f', label: 'Fat', got: totals.f, goal: user.macros?.f || 0 },
    ];

    return (
        <div className="ml-page">
            <div className="ml-head">
                <div>
                    <div className="ml-eyebrow">{dateLabel}</div>
                    <h1 className="ml-title">Meals</h1>
                </div>
                <div className="ml-remaining">
                    <span className="ml-remaining-num">{remaining}</span>
                    <span className="ml-remaining-lbl">kcal left</span>
                </div>
            </div>

            <div className="ml-macros">
                {macros.map(m => {
                    const pct = m.goal ? Math.min(100, Math.round((m.got / m.goal) * 100)) : 0;
                    return (
                        <div className="ml-macro" key={m.key}>
                            <div className="ml-macro-top">
                                <span>{m.label}</span>
                                <strong>{Math.round(m.got)}<i>/{m.goal}g</i></strong>
                            </div>
                            <div className="ml-bar"><div className="ml-bar-fill" style={{ width: `${pct}%` }} /></div>
                        </div>
                    );
                })}
            </div>

            {SLOTS.map(slot => {
                const items = today?.meals?.[slot.id] || [];
                const slotCals = items.reduce((a, m) => a + (Number(m.cals) || 0), 0);
                const Icon = slot.icon;
                return (
                    <section className="ml-slot" key={slot.id}>
                        <div className="ml-slot-head">
                            <div className="ml-slot-name"><Icon size={16} /><span>{slot.label}</span></div>
                            <span className="ml-slot-cals">{slotCals} kcal</span>
                        </div>

                        {items.length > 0 && (
                            <ul className="ml-items">
                                {items.map((m, i) => (
                                    <li className="ml-item" key={`${m.food}-${i}`}>
                                        <div className="ml-item-main">
                                            <span className="ml-item-name">{m.food}</span>
                                            <span className="ml-item-macros">{m.cals} kcal · P{m.p} C{m.c} F{m.f}</span>
                                        </div>
                                        <button className="ml-item-del" onClick={() => onRemoveMeal(slot.id, i)} aria-label={`Remove ${m.food}`}>
                                            <X size={14} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <button className="ml-add" onClick={() => onAddMeal(slot.id)}>
                            <Plus size={16} /> Add food
                        </button>
                    </section>
                );
            })}

            <section className="ml-mini">
                <Droplets size={16} />
                <span className="ml-mini-val">{today?.water ?? 0}L</span>
                <span className="ml-mini-lbl">of {user.waterGoal}L</span>
                <button className="ml-mini-btn ghost" onClick={() => onAddWater(-0.25)}>−</button>
                <button className="ml-mini-btn" onClick={() => onAddWater(0.25)}>+</button>
            </section>

            <section className="ml-mini">
                <Scale size={16} />
                <span className="ml-mini-val">{user.weight}kg</span>
                <input
                    className="ml-weight-input"
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    placeholder="new weight"
                    value={weightInput}
                    onChange={e => setWeightInput(e.target.value)}
                />
                <button
                    className="ml-mini-btn"
                    disabled={!weightInput}
                    onClick={() => { onLogWeight(Number(weightInput)); setWeightInput(''); }}
                >
                    Save
                </button>
            </section>
        </div>
    );
}
