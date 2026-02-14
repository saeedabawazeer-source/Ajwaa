import CalendarStrip from '../components/CalendarStrip';
import HeroCard from '../components/HeroCard';
import { getXPProgress, getLevelTitle, calcDayXP } from '../store/xpEngine';
import { Coffee, Sun, Moon, Utensils, Droplets, Dumbbell, Zap } from 'lucide-react';
import './Dashboard.css';

const SLOTS = ['breakfast', 'lunch', 'dinner', 'snacks'];

function SlotIcon({ slot }) {
    if (slot === 'breakfast') return <Coffee size={15} />;
    if (slot === 'lunch') return <Sun size={15} />;
    if (slot === 'dinner') return <Moon size={15} />;
    return <Utensils size={15} />;
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

export default function Dashboard({ today, totals, user, streak, getLast7Days, onWaterClick, onMealSlotClick, onRemoveMeal, xp }) {
    const days = getLast7Days();
    const xpProgress = getXPProgress(xp || 0);
    const levelTitle = getLevelTitle(xpProgress.level);
    const dayXP = calcDayXP(today, user, streak);
    const workoutsLogged = today.workouts?.length || 0;
    const remaining = Math.max(0, user.calorieTarget - totals.cals);

    return (
        <div className="dash-layout">
            {/* Greeting */}
            <div className="dash-greeting-row">
                <div className="dash-greeting">{getGreeting()}, {user.name.split(' ')[0]}</div>
                <div className="dash-xp-pill">
                    <Zap size={11} fill="var(--c-gold)" color="var(--c-gold)" />
                    LVL {xpProgress.level} · +{dayXP.total} XP
                </div>
            </div>

            <CalendarStrip days={days} />

            {/* Hero: calorie ring + macros */}
            <HeroCard cals={totals.cals} goal={user.calorieTarget} macros={{ p: totals.p, c: totals.c, f: totals.f }} macroGoals={user.macros} />

            {/* Quick stats — 3 columns */}
            <div className="stat-grid-3">
                <div className="card mini-stat">
                    <div className="stat-row-top">
                        <div className="stat-icon"><Dumbbell size={11} /></div>
                        <div className="text-label">WORKOUTS</div>
                    </div>
                    <div className="stat-num">{workoutsLogged}</div>
                </div>
                <div className="card mini-stat water-card" onClick={onWaterClick}>
                    <div className="stat-row-top">
                        <div className="stat-icon water-icon"><Droplets size={11} /></div>
                        <div className="text-label">WATER</div>
                    </div>
                    <div className="stat-num">{today.water}L</div>
                    <div className="water-fill-container">
                        <div className="water-fill-bar" style={{ width: `${Math.min((today.water / user.waterGoal) * 100, 100)}%` }} />
                    </div>
                </div>
                <div className="card mini-stat">
                    <div className="stat-row-top">
                        <div className="stat-icon remaining-icon"><span style={{ fontSize: 10, fontWeight: 900 }}>kcal</span></div>
                        <div className="text-label">LEFT</div>
                    </div>
                    <div className="stat-num">{remaining}</div>
                </div>
            </div>

            {/* Meals — 2×2 fills remaining space */}
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
                            <div className="meal-cell-bottom">
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
