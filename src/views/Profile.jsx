import { useState } from 'react';
import { Flame, Droplets, Beef, Wheat, Droplet, Pencil, Zap, Trophy, Star, Crown, Shield, Award, Heart, Sunrise, Target, Dumbbell, Lock, Scale, TrendingUp } from 'lucide-react';
import { getXPProgress, getLevelTitle } from '../store/xpEngine';
import { ACHIEVEMENTS } from '../data/achievements';
import './Profile.css';

const ICON_MAP = { Flame, Droplets, Trophy, Star, Crown, Shield, Award, Heart, Sunrise, Target, Dumbbell, Zap };

export default function Profile({ user, today, totals, streak, xp, unlockedAchievements, onUpdate, onLogWeight, getWeightHistory, getLast7Days, days }) {
    const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1);
    const [tab, setTab] = useState('overview');
    const [wt, setWt] = useState('');
    const [editing, setEditing] = useState(false);
    const [editVals, setEditVals] = useState({});
    const xpProgress = getXPProgress(xp || 0);
    const levelTitle = getLevelTitle(xpProgress.level);
    const unlocked = unlockedAchievements || [];
    const weightHist = getWeightHistory ? getWeightHistory() : [];
    const last7 = getLast7Days ? getLast7Days() : [];
    const maxCals = Math.max(...last7.map(d => d.cals), 1);
    const remaining = Math.max(0, user.calorieTarget - totals.cals);

    function startEdit() {
        setEditVals({ calorieTarget: user.calorieTarget, waterGoal: user.waterGoal, p: user.macros.p, c: user.macros.c, f: user.macros.f });
        setEditing(true);
    }
    function saveEdit() {
        onUpdate({ calorieTarget: Number(editVals.calorieTarget), waterGoal: Number(editVals.waterGoal), macros: { p: Number(editVals.p), c: Number(editVals.c), f: Number(editVals.f) } });
        setEditing(false);
    }
    function handleLogWeight() { if (wt) { onLogWeight(Number(wt)); setWt(''); } }

    return (
        <div className="view-section profile-scroll">
            {/* Header */}
            <div className="card profile-header-card">
                <div className="profile-avatar-lg" />
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900, fontSize: 18 }}>{user.name}</div>
                    <div className="profile-goal-badge">{user.goal.replace('_', ' ').toUpperCase()}</div>
                </div>
                <div className="streak-big"><Flame size={18} fill="currentColor" style={{ color: 'var(--c-red)' }} /> {streak}</div>
            </div>

            {/* Level + Body Stats row */}
            <div className="profile-top-grid">
                <div className="card level-card-sm">
                    <div className="level-badge-circle-sm"><Zap size={16} fill="var(--c-gold)" color="var(--c-gold)" /></div>
                    <div style={{ fontWeight: 900, fontSize: 16 }}>Level {xpProgress.level}</div>
                    <div className="text-label">{levelTitle}</div>
                    <div className="xp-bar-container" style={{ marginTop: 6 }}><div className="xp-bar-fill" style={{ width: `${xpProgress.percentage}%` }} /></div>
                    <div style={{ fontSize: 9, fontWeight: 700, opacity: 0.4, marginTop: 3 }}>{xp?.toLocaleString()} XP</div>
                </div>
                <div className="body-stats-col">
                    <div className="card p-stat"><div className="p-stat-num">{user.weight}</div><div className="text-label">KG</div></div>
                    <div className="card p-stat"><div className="p-stat-num">{user.height}</div><div className="text-label">CM</div></div>
                    <div className="card p-stat"><div className="p-stat-num">{bmi}</div><div className="text-label">BMI</div></div>
                </div>
            </div>

            {/* Tabs: Overview / Stats / Achievements */}
            <div className="p-tabs">
                <button className={`p-tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>Overview</button>
                <button className={`p-tab ${tab === 'stats' ? 'active' : ''}`} onClick={() => setTab('stats')}>Stats</button>
                <button className={`p-tab ${tab === 'achievements' ? 'active' : ''}`} onClick={() => setTab('achievements')}>Badges</button>
            </div>

            {tab === 'overview' && (
                <>
                    {/* Quick Stats */}
                    <div className="stats-quick-row">
                        <div className="quick-stat card"><div className="quick-stat-val red-text">{totals.cals.toLocaleString()}</div><div className="text-label">EATEN</div></div>
                        <div className="quick-stat card"><div className="quick-stat-val">{remaining.toLocaleString()}</div><div className="text-label">LEFT</div></div>
                        <div className="quick-stat card"><div className="quick-stat-val" style={{ color: '#FFD700' }}>{totals.p}g</div><div className="text-label">PROTEIN</div></div>
                    </div>

                    {/* Log Weight */}
                    <div className="card" style={{ padding: 10, marginBottom: 8 }}>
                        <div className="text-label" style={{ marginBottom: 4 }}>LOG TODAY'S WEIGHT</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input className="modal-input" style={{ margin: 0, flex: 1 }} placeholder="72.5 kg" type="number" value={wt} onChange={e => setWt(e.target.value)} />
                            <button className="btn btn-volt" style={{ flexShrink: 0, padding: '8px 14px', fontSize: 12 }} onClick={handleLogWeight}>LOG</button>
                        </div>
                    </div>

                    {/* Goals */}
                    {editing ? (
                        <div className="card" style={{ padding: 12, marginBottom: 8 }}>
                            <div className="text-label" style={{ marginBottom: 8 }}>EDIT GOALS</div>
                            <div className="edit-row"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Flame size={14} /> Calories</span>
                                <input className="modal-input edit-input" type="number" value={editVals.calorieTarget} onChange={e => setEditVals({ ...editVals, calorieTarget: e.target.value })} /></div>
                            <div className="edit-row"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Droplets size={14} /> Water (L)</span>
                                <input className="modal-input edit-input" type="number" step="0.5" value={editVals.waterGoal} onChange={e => setEditVals({ ...editVals, waterGoal: e.target.value })} /></div>
                            <div className="edit-row"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Beef size={14} /> Protein</span>
                                <input className="modal-input edit-input" type="number" value={editVals.p} onChange={e => setEditVals({ ...editVals, p: e.target.value })} /></div>
                            <div className="edit-row"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Wheat size={14} /> Carbs</span>
                                <input className="modal-input edit-input" type="number" value={editVals.c} onChange={e => setEditVals({ ...editVals, c: e.target.value })} /></div>
                            <div className="edit-row"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Droplet size={14} /> Fats</span>
                                <input className="modal-input edit-input" type="number" value={editVals.f} onChange={e => setEditVals({ ...editVals, f: e.target.value })} /></div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                <button className="btn btn-outline" style={{ flex: 1, fontSize: 12, padding: 8 }} onClick={() => setEditing(false)}>CANCEL</button>
                                <button className="btn btn-primary" style={{ flex: 1, fontSize: 12, padding: 8 }} onClick={saveEdit}>SAVE</button>
                            </div>
                        </div>
                    ) : (
                        <div className="card goals-card" onClick={startEdit}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <div className="text-label">DAILY GOALS</div>
                                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--c-red)', display: 'flex', alignItems: 'center', gap: 4 }}>EDIT <Pencil size={12} /></span>
                            </div>
                            <div className="goal-row"><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Flame size={14} /> Calories</span><span style={{ fontWeight: 800 }}>{user.calorieTarget} kcal</span></div>
                            <div className="goal-row"><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Beef size={14} /> Protein</span><span style={{ fontWeight: 800 }}>{user.macros.p}g</span></div>
                            <div className="goal-row"><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Wheat size={14} /> Carbs</span><span style={{ fontWeight: 800 }}>{user.macros.c}g</span></div>
                            <div className="goal-row"><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Droplet size={14} /> Fats</span><span style={{ fontWeight: 800 }}>{user.macros.f}g</span></div>
                            <div className="goal-row"><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Droplets size={14} /> Water</span><span style={{ fontWeight: 800 }}>{user.waterGoal}L</span></div>
                        </div>
                    )}
                </>
            )}

            {tab === 'stats' && (
                <>
                    {/* Weekly Calorie Chart */}
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
                    <div className="card" style={{ padding: 12, marginBottom: 8 }}>
                        <div className="text-label" style={{ marginBottom: 8 }}>MACROS</div>
                        {[
                            { label: 'Protein', val: totals.p, goal: user.macros.p, color: '#FFD700', icon: <Beef size={16} /> },
                            { label: 'Carbs', val: totals.c, goal: user.macros.c, color: '#00BFFF', icon: <Wheat size={16} /> },
                            { label: 'Fats', val: totals.f, goal: user.macros.f, color: '#FF4500', icon: <Droplet size={16} /> },
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

                    {/* Weight Trend */}
                    {weightHist.length > 0 ? (
                        <div className="card" style={{ padding: 12, marginBottom: 8 }}>
                            <div className="text-label" style={{ marginBottom: 8 }}>WEIGHT TREND</div>
                            <div className="weight-chart">
                                {weightHist.slice(-7).map((w, i) => {
                                    const min = Math.min(...weightHist.map(x => x.weight));
                                    const max = Math.max(...weightHist.map(x => x.weight));
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
                            <div className="weight-stats-row" style={{ marginTop: 8 }}>
                                <div className="card quick-stat"><div className="quick-stat-val">{weightHist[0]?.weight}</div><div className="text-label">START</div></div>
                                <div className="card quick-stat"><div className="quick-stat-val">{weightHist.at(-1)?.weight}</div><div className="text-label">CURRENT</div></div>
                                <div className="card quick-stat"><div className="quick-stat-val" style={{ color: weightHist.at(-1)?.weight <= weightHist[0]?.weight ? 'green' : 'var(--c-red)' }}>
                                    {(weightHist.at(-1)?.weight - weightHist[0]?.weight).toFixed(1)}
                                </div><div className="text-label">CHANGE</div></div>
                            </div>
                        </div>
                    ) : (
                        <div className="card" style={{ textAlign: 'center', padding: 20 }}>
                            <div style={{ marginBottom: 8, opacity: 0.3 }}><Scale size={40} /></div>
                            <div className="text-label">NO WEIGHT DATA YET</div>
                            <div style={{ fontSize: 11, opacity: 0.4, marginTop: 4 }}>Log your weight above to see trends</div>
                        </div>
                    )}

                    {/* Meal Breakdown */}
                    <div className="card" style={{ padding: 10, marginBottom: 8 }}>
                        <div className="text-label" style={{ marginBottom: 6 }}>TODAY'S MEALS</div>
                        {['breakfast', 'lunch', 'dinner', 'snacks'].map(slot => {
                            const items = today.meals[slot];
                            return (
                                <div key={slot} style={{ marginBottom: 6 }}>
                                    <div style={{ fontWeight: 800, fontSize: 11, opacity: 0.5, marginBottom: 2 }}>{slot.toUpperCase()}</div>
                                    {items.length === 0 ? (
                                        <div style={{ fontSize: 10, opacity: 0.3, fontWeight: 700 }}>No items</div>
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
                </>
            )}

            {tab === 'achievements' && (
                <div className="card" style={{ padding: 12 }}>
                    <div className="text-label" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Trophy size={12} /> ACHIEVEMENTS ({unlocked.length}/{ACHIEVEMENTS.length})
                    </div>
                    <div className="achievements-grid">
                        {ACHIEVEMENTS.map(a => {
                            const isUnlocked = unlocked.includes(a.id);
                            const IconComp = ICON_MAP[a.icon] || Star;
                            return (
                                <div key={a.id} className={`achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`} title={a.desc}>
                                    <div className="achievement-icon">
                                        {isUnlocked ? <IconComp size={18} /> : <Lock size={14} />}
                                    </div>
                                    <div className="achievement-title">{a.title}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
