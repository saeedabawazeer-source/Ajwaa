import CalendarStrip from '../components/CalendarStrip';
import HeroCard from '../components/HeroCard';
import { getSmartCoachMessage } from '../utils/aiCoach';
import { getXPProgress, getLevelTitle, calcDayXP } from '../store/xpEngine';
import { Coffee, Sun, Moon, Utensils, Droplets, Dumbbell, Sparkles, Zap, Flame, ArrowRight } from 'lucide-react';
import './Dashboard.css';

const SLOTS = ['breakfast', 'lunch', 'dinner', 'snacks'];

function SlotIcon({ slot }) {
    if (slot === 'breakfast') return <Coffee size={16} />;
    if (slot === 'lunch') return <Sun size={16} />;
    if (slot === 'dinner') return <Moon size={16} />;
    return <Utensils size={16} />;
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

function getNextAction(totals, today, user) {
    const meals = Object.values(today.meals).flat();
    if (meals.length === 0) return { label: 'Log your first meal', icon: <Coffee size={13} /> };
    if (!today.workouts?.length) return { label: 'Start a workout', icon: <Dumbbell size={13} /> };
    if (today.water < user.waterGoal * 0.5) return { label: 'Drink more water', icon: <Droplets size={13} /> };
    if (totals.p < user.macros.p * 0.5) return { label: 'Hit your protein goal', icon: <Sparkles size={13} /> };
    return { label: 'Looking great today!', icon: <Sparkles size={13} /> };
}

export default function Dashboard({ today, totals, user, streak, getLast7Days, onWaterClick, onMealSlotClick, onRemoveMeal, xp }) {
    const days = getLast7Days();
    const aiMsg = getSmartCoachMessage(totals, user, streak, today);
    const xpProgress = getXPProgress(xp || 0);
    const levelTitle = getLevelTitle(xpProgress.level);
    const dayXP = calcDayXP(today, user, streak);
    const nextAction = getNextAction(totals, today, user);

    // Calculate completion percentage for daily ring
    const mealsLogged = Object.values(today.meals).flat().length;
    const workoutsLogged = today.workouts?.length || 0;
    const waterPct = Math.min(today.water / user.waterGoal, 1);
    const calPct = Math.min(totals.cals / user.calorieTarget, 1);
    const completionPct = Math.round(((mealsLogged > 0 ? 0.3 : 0) + (workoutsLogged > 0 ? 0.3 : 0) + (waterPct * 0.2) + (calPct > 0.5 ? 0.2 : 0)) * 100);

    return (
        <div className="dash-layout">
            {/* Greeting + Streak */}
            <div className="dash-greeting-row">
                <div>
                    <div className="dash-greeting">{getGreeting()}, {user.name.split(' ')[0]}</div>
                    <div className="dash-subtitle">
                        <Zap size={11} fill="var(--c-gold)" color="var(--c-gold)" />
                        LVL {xpProgress.level} {levelTitle} · +{dayXP.total} XP today
                    </div>
                </div>
                <div className="dash-streak-pill">
                    <Flame size={14} fill="var(--c-red)" color="var(--c-red)" /> {streak}
                </div>
            </div>

            {/* XP Progress */}
            <div className="xp-bar-container"><div className="xp-bar-fill" style={{ width: `${xpProgress.percentage}%` }} /></div>

            <CalendarStrip days={days} />

            {/* AI Coach + Next Action */}
            <div className="dash-action-row">
                <div className="ai-banner">
                    <Sparkles size={11} /> <span>{aiMsg}</span>
                </div>
                <div className="next-action-pill">
                    {nextAction.icon} {nextAction.label} <ArrowRight size={10} />
                </div>
            </div>

            {/* Hero Card */}
            <HeroCard cals={totals.cals} goal={user.calorieTarget} macros={{ p: totals.p, c: totals.c, f: totals.f }} macroGoals={user.macros} />

            {/* Stats strip */}
            <div className="stat-grid">
                <div className="card mini-stat">
                    <div className="stat-row-top">
                        <div className="stat-icon"><Dumbbell size={12} /></div>
                        <div className="text-label">WORKOUTS</div>
                    </div>
                    <div className="stat-num">{workoutsLogged}</div>
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

            {/* Meal Slots — 2x2 */}
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
                                {slotCals > 0
                                    ? <>
                                        <div className="meal-cell-cals">{slotCals}</div>
                                        <div className="meal-cell-sub">{items.length} item{items.length > 1 ? 's' : ''}</div>
                                    </>
                                    : <div className="meal-cell-empty">+ add</div>
                                }
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
