import CalendarStrip from '../components/CalendarStrip';
import HeroCard from '../components/HeroCard';
import { getXPProgress, calcDayXP } from '../store/xpEngine';
import { Coffee, Sun, Moon, Utensils, Droplets, Dumbbell, Zap, Beef } from 'lucide-react';
import './Dashboard.css';

const SLOTS = ['breakfast', 'lunch', 'dinner', 'snacks'];

function SlotIcon({ slot }) {
    if (slot === 'breakfast') return <Coffee size={14} />;
    if (slot === 'lunch') return <Sun size={14} />;
    if (slot === 'dinner') return <Moon size={14} />;
    return <Utensils size={14} />;
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

export default function Dashboard({ today, totals, user, streak, getLast7Days, onWaterClick, onMealSlotClick, xp }) {
    const days = getLast7Days();
    const xpProgress = getXPProgress(xp || 0);
    const dayXP = calcDayXP(today, user, streak);
    const workoutsLogged = today.workouts?.length || 0;

    return (
        <div className="dash-layout">
            {/* Greeting */}
            <div className="dash-greeting-row">
                <div className="dash-greeting">{getGreeting()}, {user.name.split(' ')[0]}</div>
                <div className="dash-xp-pill">
                    <Zap size={10} fill="var(--c-gold)" color="var(--c-gold)" />
                    LVL {xpProgress.level} · +{dayXP.total} XP
                </div>
            </div>

            <CalendarStrip days={days} />

            {/* Hero: calorie ring + eaten + PCF */}
            <HeroCard cals={totals.cals} goal={user.calorieTarget} macros={{ p: totals.p, c: totals.c, f: totals.f }} macroGoals={user.macros} />

            {/* Quick stats — 3 columns: workout, water, protein */}
            <div className="stat-grid-3">
                <div className="card mini-stat">
                    <div className="stat-row-top">
                        <div className="stat-icon"><Dumbbell size={10} /></div>
                        <span className="text-label">WORKOUTS</span>
                    </div>
                    <div className="stat-num">{workoutsLogged}</div>
                </div>
                <div className="card mini-stat water-card" onClick={onWaterClick}>
                    <div className="stat-row-top">
                        <div className="stat-icon water-icon"><Droplets size={10} /></div>
                        <span className="text-label">WATER</span>
                    </div>
                    <div className="stat-num">{today.water}<span className="stat-unit">/{user.waterGoal}L</span></div>
                    <div className="water-fill-container">
                        <div className="water-fill-bar" style={{ width: `${Math.min((today.water / user.waterGoal) * 100, 100)}%` }} />
                    </div>
                </div>
                <div className="card mini-stat">
                    <div className="stat-row-top">
                        <div className="stat-icon prot-icon"><Beef size={10} /></div>
                        <span className="text-label">PROTEIN</span>
                    </div>
                    <div className="stat-num">{totals.p}<span className="stat-unit">/{user.macros.p}g</span></div>
                </div>
            </div>

            {/* Meals — 2×2, constrained height */}
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
                            {slotCals > 0
                                ? <div className="meal-cell-cals">{slotCals}<span className="meal-cell-sub"> kcal</span></div>
                                : <div className="meal-cell-empty">+ add</div>
                            }
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
