import { useState } from 'react';
import './Profile.css';

export default function Profile({ user, today, totals, streak, onUpdate, onLogWeight, getWeightHistory }) {
    const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1);
    const [editing, setEditing] = useState(false);
    const [wt, setWt] = useState('');
    const [editVals, setEditVals] = useState({});
    const weightHist = getWeightHistory();

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

    return (
        <div className="view-section">
            {/* Header */}
            <div className="card profile-header-card">
                <div className="profile-avatar-lg" />
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900, fontSize: 20 }}>{user.name}</div>
                    <div className="profile-goal-badge">{user.goal.replace('_', ' ').toUpperCase()}</div>
                </div>
                <div className="streak-big">🔥{streak}</div>
            </div>

            {/* Body Stats */}
            <div className="profile-stats-grid">
                <div className="p-stat card"><div className="p-stat-num">{user.weight}</div><div className="text-label">KG</div></div>
                <div className="p-stat card"><div className="p-stat-num">{user.height}</div><div className="text-label">CM</div></div>
                <div className="p-stat card"><div className="p-stat-num">{bmi}</div><div className="text-label">BMI</div></div>
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
                        <span>🔥 Calories</span>
                        <input className="modal-input edit-input" type="number" value={editVals.calorieTarget} onChange={e => setEditVals({ ...editVals, calorieTarget: e.target.value })} />
                    </div>
                    <div className="edit-row">
                        <span>💧 Water (L)</span>
                        <input className="modal-input edit-input" type="number" step="0.5" value={editVals.waterGoal} onChange={e => setEditVals({ ...editVals, waterGoal: e.target.value })} />
                    </div>
                    <div className="edit-row">
                        <span>🥩 Protein</span>
                        <input className="modal-input edit-input" type="number" value={editVals.p} onChange={e => setEditVals({ ...editVals, p: e.target.value })} />
                    </div>
                    <div className="edit-row">
                        <span>🍚 Carbs</span>
                        <input className="modal-input edit-input" type="number" value={editVals.c} onChange={e => setEditVals({ ...editVals, c: e.target.value })} />
                    </div>
                    <div className="edit-row">
                        <span>🥑 Fats</span>
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
                        <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--c-red)' }}>EDIT ✏️</span>
                    </div>
                    <div className="goal-row"><span>🔥 Calories</span><span style={{ fontWeight: 800 }}>{user.calorieTarget} kcal</span></div>
                    <div className="goal-row"><span>🥩 Protein</span><span style={{ fontWeight: 800 }}>{user.macros.p}g</span></div>
                    <div className="goal-row"><span>🍚 Carbs</span><span style={{ fontWeight: 800 }}>{user.macros.c}g</span></div>
                    <div className="goal-row"><span>🥑 Fats</span><span style={{ fontWeight: 800 }}>{user.macros.f}g</span></div>
                    <div className="goal-row"><span>💧 Water</span><span style={{ fontWeight: 800 }}>{user.waterGoal}L</span></div>
                </div>
            )}
        </div>
    );
}
