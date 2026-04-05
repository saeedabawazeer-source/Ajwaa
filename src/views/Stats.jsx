import { useState } from 'react';
import { Scale, TrendingUp, Utensils, Beef, Wheat, Droplet } from 'lucide-react';
import './Stats.css';

export default function Stats({ user, today, totals, getLast7Days, getWeightHistory }) {
    const [tab, setTab] = useState('overview');
    const last7 = getLast7Days();
    const maxCals = Math.max(...last7.map(d => d.cals), 1);
    const remaining = Math.max(0, user.calorieTarget - totals.cals);
    const pct = Math.min((totals.cals / user.calorieTarget) * 100, 100);
    const weightHist = getWeightHistory();

    return (
        <div className="view-section">
            {/* Tabs */}
            <div className="stats-tabs">
                <button className={`stats-tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>Overview</button>
                <button className={`stats-tab ${tab === 'weight' ? 'active' : ''}`} onClick={() => setTab('weight')}>Weight</button>
                <button className={`stats-tab ${tab === 'meals' ? 'active' : ''}`} onClick={() => setTab('meals')}>Meals</button>
            </div>

            {tab === 'overview' && (
                <>
                    {/* Quick Stats */}
                    <div className="stats-quick-row">
                        <div className="quick-stat">
                            <div className="quick-stat-val red-text">{totals.cals.toLocaleString()}</div>
                            <div className="text-label">EATEN</div>
                        </div>
                        <div className="quick-stat">
                            <div className="quick-stat-val">{remaining.toLocaleString()}</div>
                            <div className="text-label">LEFT</div>
                        </div>
                        <div className="quick-stat">
                            <div className="quick-stat-val" style={{ color: '#FFD700' }}>{totals.p}g</div>
                            <div className="text-label">PROTEIN</div>
                        </div>
                    </div>

                    {/* Calorie Bar */}
                    <div className="card stats-cal-card">
                        <div className="stats-cal-header">
                            <span className="text-label">TODAY</span>
                            <span style={{ fontWeight: 800, fontSize: 13 }}>{Math.round(pct)}%</span>
                        </div>
                        <div className="cal-bar-track"><div className="cal-bar-fill" style={{ width: `${pct}%` }} /></div>
                    </div>

                    {/* Weekly Chart */}
                    <div className="card stats-week-card">
                        <div className="text-label" style={{ marginBottom: 8 }}>WEEKLY CALORIES</div>
                        <div className="weekly-chart">
                            {last7.map((d, i) => (
                                <div key={i} className="weekly-bar-col">
                                    <div className="weekly-bar" style={{
                                        height: `${Math.max((d.cals / maxCals) * 100, 5)}%`,
                                        background: d.isToday ? 'var(--c-red)' : 'var(--c-red-light)',
                                    }} />
                                    <span className="weekly-bar-label">{d.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Macros */}
                    <div className="card" style={{ padding: 12 }}>
                        <div className="text-label" style={{ marginBottom: 8 }}>MACROS</div>
                        {[
                            { label: 'Protein', val: totals.p, goal: user.macros.p, color: '#FFD700', icon: <Beef size={18} /> },
                            { label: 'Carbs', val: totals.c, goal: user.macros.c, color: '#00BFFF', icon: <Wheat size={18} /> },
                            { label: 'Fats', val: totals.f, goal: user.macros.f, color: '#FF4500', icon: <Droplet size={18} /> },
                        ].map(m => (
                            <div key={m.label} className="macro-row">
                                <span style={{ color: m.color }}>{m.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <div className="macro-row-top">
                                        <span style={{ fontWeight: 700, fontSize: 12 }}>{m.label}</span>
                                        <span style={{ fontWeight: 800, fontSize: 12, color: m.color }}>{m.val}g / {m.goal}g</span>
                                    </div>
                                    <div className="macro-bar-track"><div className="macro-bar-fill" style={{ width: `${Math.min((m.val / m.goal) * 100, 100)}%`, background: m.color }} /></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {tab === 'weight' && (
                <div className="weight-tab">
                    {weightHist.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: 24 }}>
                            <div style={{ marginBottom: 8, opacity: 0.3 }}><Scale size={48} /></div>
                            <div className="text-label" style={{ marginTop: 8 }}>NO WEIGHT DATA YET</div>
                        </div>
                    ) : (
                        <>
                            <div className="card" style={{ padding: 14 }}>
                                <div className="text-label" style={{ marginBottom: 8 }}>WEIGHT TREND</div>
                                <div className="weight-chart">
                                    {weightHist.slice(-7).map((w, i) => {
                                        const min = Math.min(...weightHist.map(w => w.weight));
                                        const max = Math.max(...weightHist.map(w => w.weight));
                                        const range = max - min || 1;
                                        const pct = ((w.weight - min) / range) * 80 + 10;
                                        return (
                                            <div key={i} className="weight-dot-col">
                                                <div className="weight-dot" style={{ bottom: `${pct}%` }}>{w.weight}</div>
                                                <span className="weekly-bar-label">{w.date.split('-')[2]}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="weight-stats-row">
                                <div className="card quick-stat"><div className="quick-stat-val">{weightHist[0]?.weight}</div><div className="text-label">START</div></div>
                                <div className="card quick-stat"><div className="quick-stat-val">{weightHist.at(-1)?.weight}</div><div className="text-label">CURRENT</div></div>
                                <div className="card quick-stat"><div className="quick-stat-val" style={{ color: weightHist.at(-1)?.weight <= weightHist[0]?.weight ? 'green' : 'var(--c-red)' }}>
                                    {(weightHist.at(-1)?.weight - weightHist[0]?.weight).toFixed(1)}
                                </div><div className="text-label">CHANGE</div></div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {tab === 'meals' && (
                <div className="meals-tab">
                    {['breakfast', 'lunch', 'dinner', 'snacks'].map(slot => {
                        const items = today.meals[slot];
                        return (
                            <div key={slot} className="card" style={{ padding: 10, marginBottom: 6 }}>
                                <div className="text-label" style={{ marginBottom: 4 }}>{slot.toUpperCase()}</div>
                                {items.length === 0 ? (
                                    <div style={{ fontSize: 11, opacity: 0.4, fontWeight: 700 }}>No items</div>
                                ) : items.map((m, i) => (
                                    <div key={i} className="meal-log-row">
                                        <span style={{ flex: 1, fontWeight: 700, fontSize: 12 }}>{m.food}</span>
                                        <span style={{ fontWeight: 800, fontSize: 11, opacity: 0.6 }}>{m.cals}kcal</span>
                                        <span style={{ fontWeight: 700, fontSize: 10, opacity: 0.4, marginLeft: 6 }}>P{m.p} C{m.c} F{m.f}</span>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
