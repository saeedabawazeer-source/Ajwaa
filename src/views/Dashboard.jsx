import CalendarStrip from '../components/CalendarStrip';
import HeroCard from '../components/HeroCard';
import { getSmartCoachMessage } from '../utils/aiCoach';
import { getDailyQuests, checkQuests } from '../store/questEngine';
import { getXPProgress, getLevelTitle, calcDayXP } from '../store/xpEngine';
import { Plus, Coffee, Sun, Moon, Utensils, Droplets, Dumbbell, Sparkles, Zap, Target } from 'lucide-react';
import './Dashboard.css';


const SLOTS = ['breakfast', 'lunch', 'dinner', 'snacks'];

function SlotIcon({ slot }) {
    if (slot === 'breakfast') return <Coffee size={20} />;
    if (slot === 'lunch') return <Sun size={20} />;
    if (slot === 'dinner') return <Moon size={20} />;
    return <Utensils size={20} />;
}

function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function Dashboard({ today, totals, user, streak, getLast7Days, onWaterClick, onMealSlotClick, onRemoveMeal, xp }) {
    const days = getLast7Days();
    const calsLeft = Math.max(0, user.calorieTarget - totals.cals);
    const aiMsg = getSmartCoachMessage(totals, user, streak, today);

    // XP progress
    const xpProgress = getXPProgress(xp || 0);
    const levelTitle = getLevelTitle(xpProgress.level);

    // Today's XP
    const dayXP = calcDayXP(today, user, streak);

    // Daily Quests
    const rawQuests = getDailyQuests(todayKey());
    const quests = checkQuests(rawQuests, today, user);

    return (
        <div className="view-section">
            <CalendarStrip days={days} />

            {/* XP Level Bar */}
            <div className="xp-level-strip">
                <div className="xp-level-left">
                    <Zap size={14} fill="var(--c-gold)" color="var(--c-gold)" />
                    <span className="xp-level-label">LVL {xpProgress.level}</span>
                    <span className="xp-level-title">{levelTitle}</span>
                </div>
                <div className="xp-level-right">
                    <span className="xp-today-earned">+{dayXP.total} XP today</span>
                </div>
            </div>
            <div className="xp-bar-container" style={{ marginBottom: 6 }}>
                <div className="xp-bar-fill" style={{ width: `${xpProgress.percentage}%` }} />
            </div>

            {/* AI Coach */}
            <div className="ai-insight">
                <div style={{ fontWeight: 800, fontSize: 11, opacity: 0.6, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Sparkles size={12} /> AI COACH
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.4 }}>{aiMsg}</div>
            </div>

            {/* Daily Quests */}
            <div className="quests-section">
                <div className="text-label" style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Target size={12} /> DAILY QUESTS
                </div>
                <div className="quests-grid">
                    {quests.map((q, i) => (
                        <div key={i} className={`quest-card ${q.done ? 'quest-done' : ''}`}>
                            <div className="quest-header">
                                <span className="quest-title">{q.title}</span>
                                <span className="quest-xp">+{q.xp} XP</span>
                            </div>
                            <div className="quest-desc">{q.desc}</div>
                            <div className="quest-bar">
                                <div className="quest-bar-fill" style={{ width: `${(q.current / q.target) * 100}%` }} />
                            </div>
                            <div className="quest-progress">{q.current}/{q.target}</div>
                        </div>
                    ))}
                </div>
            </div>

            <HeroCard cals={totals.cals} goal={user.calorieTarget} macros={{ p: totals.p, c: totals.c, f: totals.f }} macroGoals={user.macros} />

            <div className="stat-grid">
                <div className="card mini-stat">
                    <div className="stat-row-top">
                        <div className="stat-icon"><Dumbbell size={14} /></div>
                        <div className="text-label">WORKOUTS</div>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 900 }}>{today.workouts ? today.workouts.length : 0}</div>
                </div>
                <div className="card mini-stat water-card" onClick={onWaterClick}>
                    <div className="stat-row-top">
                        <div className="stat-icon"><Droplets size={14} /></div>
                        <div className="text-label">WATER</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <div style={{ fontSize: 20, fontWeight: 900 }}>{today.water}L</div>
                        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.5 }}>/ {user.waterGoal}L</div>
                    </div>
                    <div className="water-fill-container">
                        <div className="water-fill-bar" style={{ width: `${Math.min((today.water / user.waterGoal) * 100, 100)}%` }} />
                    </div>
                </div>
            </div>

            <div className="meal-slots">
                {SLOTS.map(slot => {
                    const items = today.meals[slot] || [];
                    const slotCals = items.reduce((sum, i) => sum + i.cals, 0);
                    return (
                        <div key={slot} className="card meal-slot" onClick={() => onMealSlotClick(slot)}>
                            <div className="meal-slot-left">
                                <div className="meal-slot-icon-box"><SlotIcon slot={slot} /></div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: 14, textTransform: 'capitalize' }}>{slot}</div>
                                    <div className="text-label" style={{ fontSize: 10 }}>
                                        {items.length === 0 ? 'TAP TO ADD' : `${items.length} ITEMS`}
                                    </div>
                                </div>
                            </div>
                            <div className="meal-slot-right">
                                {slotCals > 0 && <div style={{ fontWeight: 800, fontSize: 14 }}>{slotCals}</div>}
                                <div className="meal-slot-add"><Plus size={16} /></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
