import { useState } from 'react';
import { Flame, Droplets, Beef, Wheat, Droplet, Pencil, Zap, Trophy, Star, Crown, Shield, Award, Heart, Sunrise, Target, Dumbbell, Lock } from 'lucide-react';
import { getXPProgress, getLevelTitle } from '../store/xpEngine';
import { ACHIEVEMENTS } from '../data/achievements';
import './Profile.css';

const ICON_MAP = {
    Flame, Droplets, Trophy, Star, Crown, Shield, Award, Heart, Sunrise, Target, Dumbbell, Zap,
};

export default function Profile({ user, today, totals, streak, xp, unlockedAchievements, onUpdate, onLogWeight, getWeightHistory }) {
    const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1);
    const [editing, setEditing] = useState(false);
    const [wt, setWt] = useState('');
    const [editVals, setEditVals] = useState({});
    const xpProgress = getXPProgress(xp || 0);
    const levelTitle = getLevelTitle(xpProgress.level);

    function startEdit() {
        setEditVals({
            calorieTarget: user.calorieTarget,
            waterGoal: user.waterGoal,
            p: user.macros.p, c: user.macros.c, f: user.macros.f,
        });
        setEditing(true);
    }

    function saveEdit() {
        onUpdate({
            calorieTarget: Number(editVals.calorieTarget),
            waterGoal: Number(editVals.waterGoal),
            macros: { p: Number(editVals.p), c: Number(editVals.c), f: Number(editVals.f) },
        });
        setEditing(false);
    }

    function handleLogWeight() {
        if (wt) { onLogWeight(Number(wt)); setWt(''); }
    }

    const unlocked = unlockedAchievements || [];

    return (
        <div className="view-section">
            {/* Header */}
            <div className="card profile-header-card">
                <div className="profile-avatar-lg" />
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900, fontSize: 20 }}>{user.name}</div>
                    <div className="profile-goal-badge">{user.goal.replace('_', ' ').toUpperCase()}</div>
                </div>
                <div className="streak-big"><Flame size={20} fill="currentColor" style={{ color: 'var(--c-red)' }} /> {streak}</div>
            </div>

            {/* Level & XP */}
            <div className="card level-card">
                <div className="level-card-top">
                    <div className="level-badge-circle">
                        <Zap size={20} fill="var(--c-gold)" color="var(--c-gold)" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 900, fontSize: 18 }}>Level {xpProgress.level}</div>
                        <div className="text-label">{levelTitle}</div>
                    </div>
                    <div className="level-xp-num">{xp?.toLocaleString()} XP</div>
                </div>
                <div className="xp-bar-container" style={{ marginTop: 8 }}>
                    <div className="xp-bar-fill" style={{ width: `${xpProgress.percentage}%` }} />
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.4, marginTop: 4 }}>{xpProgress.progress} / {xpProgress.needed} XP to Level {xpProgress.level + 1}</div>
            </div>

            {/* Body Stats */}
            <div className="profile-stats-grid">
                <div className="p-stat card"><div className="p-stat-num">{user.weight}</div><div className="text-label">KG</div></div>
                <div className="p-stat card"><div className="p-stat-num">{user.height}</div><div className="text-label">CM</div></div>
                <div className="p-stat card"><div className="p-stat-num">{bmi}</div><div className="text-label">BMI</div></div>
            </div>

            {/* Achievements */}
            <div className="card" style={{ padding: 12, marginBottom: 8 }}>
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
                    <div className="edit-row">
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Flame size={14} /> Calories</span>
                        <input className="modal-input edit-input" type="number" value={editVals.calorieTarget} onChange={e => setEditVals({ ...editVals, calorieTarget: e.target.value })} />
                    </div>
                    <div className="edit-row">
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Droplets size={14} /> Water (L)</span>
                        <input className="modal-input edit-input" type="number" step="0.5" value={editVals.waterGoal} onChange={e => setEditVals({ ...editVals, waterGoal: e.target.value })} />
                    </div>
                    <div className="edit-row">
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Beef size={14} /> Protein</span>
                        <input className="modal-input edit-input" type="number" value={editVals.p} onChange={e => setEditVals({ ...editVals, p: e.target.value })} />
                    </div>
                    <div className="edit-row">
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Wheat size={14} /> Carbs</span>
                        <input className="modal-input edit-input" type="number" value={editVals.c} onChange={e => setEditVals({ ...editVals, c: e.target.value })} />
                    </div>
                    <div className="edit-row">
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Droplet size={14} /> Fats</span>
                        <input className="modal-input edit-input" type="number" value={editVals.f} onChange={e => setEditVals({ ...editVals, f: e.target.value })} />
                    </div>
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
        </div>
    );
}
