import CalendarStrip from '../components/CalendarStrip';
import HeroCard from '../components/HeroCard';
import { getSmartCoachMessage } from '../utils/aiCoach';
import { getXPProgress, getLevelTitle, calcDayXP } from '../store/xpEngine';
import { Plus, Coffee, Sun, Moon, Utensils, Droplets, Dumbbell, Sparkles, Zap } from 'lucide-react';
import './Dashboard.css';

const SLOTS = ['breakfast', 'lunch', 'dinner', 'snacks'];

function SlotIcon({ slot }) {
    if (slot === 'breakfast') return <Coffee size={16} />;
    if (slot === 'lunch') return <Sun size={16} />;
    if (slot === 'dinner') return <Moon size={16} />;
    return <Utensils size={16} />;
}

export default function Dashboard({ today, totals, user, streak, getLast7Days, onWaterClick, onMealSlotClick, onRemoveMeal, xp }) {
    const days = getLast7Days();
    const aiMsg = getSmartCoachMessage(totals, user, streak, today);
    const xpProgress = getXPProgress(xp || 0);
    const levelTitle = getLevelTitle(xpProgress.level);
    const dayXP = calcDayXP(today, user, streak);

    return (
        <div className="view-section">
            <CalendarStrip days={days} />

            {/* XP Strip — single line */}
            <div className="xp-level-strip">
                <div className="xp-level-left">
                    <Zap size={12} fill="var(--c-gold)" color="var(--c-gold)" />
                    <span className="xp-level-label">LVL {xpProgress.level}</span>
                    <span className="xp-level-title">{levelTitle}</span>
                </div>
                <span className="xp-today-earned">+{dayXP.total} XP</span>
            </div>
            <div className="xp-bar-container"><div className="xp-bar-fill" style={{ width: `${xpProgress.percentage}%` }} /></div>

            {/* AI Coach — single line */}
            <div className="ai-banner">
                <Sparkles size={11} /> <span>{aiMsg}</span>
            </div>

            <HeroCard cals={totals.cals} goal={user.calorieTarget} macros={{ p: totals.p, c: totals.c, f: totals.f }} macroGoals={user.macros} />

            {/* Stats row */}
            <div className="stat-grid">
                <div className="card mini-stat">
                    <div className="stat-row-top">
                        <div className="stat-icon"><Dumbbell size={12} /></div>
                        <div className="text-label">WORKOUTS</div>
                    </div>
                    <div className="stat-num">{today.workouts ? today.workouts.length : 0}</div>
                </div>
                <div className="card mini-stat water-card" onClick={onWaterClick}>
                    <div className="stat-row-top">
                        <div className="stat-icon"><Droplets size={12} /></div>
                        <div className="text-label">WATER</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                        <div className="stat-num">{today.water}L</div>
                        <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.4 }}>/ {user.waterGoal}L</div>
                    </div>
                    <div className="water-fill-container">
                        <div className="water-fill-bar" style={{ width: `${Math.min((today.water / user.waterGoal) * 100, 100)}%` }} />
                    </div>
                </div>
            </div>

            {/* Meal Slots — 2x2 grid */}
            <div className="meal-grid">
                {SLOTS.map(slot => {
                    const items = today.meals[slot] || [];
                    const slotCals = items.reduce((sum, i) => sum + i.cals, 0);
                    return (
                        <div key={slot} className="card meal-cell" onClick={() => onMealSlotClick(slot)}>
                            <div className="meal-cell-top">
                                <SlotIcon slot={slot} />
                                <span className="meal-cell-name">{slot}</span>
                            </div>
                            <div className="meal-cell-info">
                                {slotCals > 0 ? <span className="meal-cell-cals">{slotCals}</span> : <span className="meal-cell-empty">+</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
