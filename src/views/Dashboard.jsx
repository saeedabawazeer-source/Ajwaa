import CalendarStrip from '../components/CalendarStrip';
import HeroCard from '../components/HeroCard';
import { getXPProgress, calcDayXP } from '../store/xpEngine';
import { Coffee, Sun, Moon, Utensils, Droplets, Dumbbell, Zap, Plus } from 'lucide-react';
import './Dashboard.css';

const SLOTS = ['breakfast', 'lunch', 'dinner', 'snacks'];
const SLOT_ICONS = { breakfast: Coffee, lunch: Sun, dinner: Moon, snacks: Utensils };

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
        <div className="dash">
            {/* ── Row 1: Greeting ── */}
            <div className="d-greet-row">
                <div className="d-greet">{getGreeting()}, {user.name.split(' ')[0]}</div>
                <div className="d-xp">
                    <Zap size={10} fill="var(--c-gold)" color="var(--c-gold)" />
                    LVL {xpProgress.level} · +{dayXP.total}xp
                </div>
            </div>

            {/* ── Row 2: Calendar ── */}
            <CalendarStrip days={days} />

            {/* ── Row 3: Hero ring + eaten/pcf ── */}
            <HeroCard cals={totals.cals} goal={user.calorieTarget} macros={{ p: totals.p, c: totals.c, f: totals.f }} macroGoals={user.macros} />

            {/* ── Row 4: Two interactive stat cards ── */}
            <div className="d-stats">
                <div className="card d-stat-card" onClick={onWaterClick}>
                    <Droplets size={18} className="d-stat-ic water-c" />
                    <div className="d-stat-right">
                        <div className="d-stat-val">{today.water}<span className="d-stat-dim">/{user.waterGoal}L</span></div>
                        <div className="d-stat-bar-track"><div className="d-stat-bar water-bar" style={{ width: `${Math.min((today.water / user.waterGoal) * 100, 100)}%` }} /></div>
                    </div>
                    <div className="d-stat-plus"><Plus size={14} /></div>
                </div>
                <div className="card d-stat-card">
                    <Dumbbell size={18} className="d-stat-ic work-c" />
                    <div className="d-stat-right">
                        <div className="d-stat-val">{workoutsLogged}<span className="d-stat-dim"> today</span></div>
                        <div className="d-stat-label">WORKOUTS</div>
                    </div>
                </div>
            </div>

            {/* ── Row 5: Meal grid fills rest ── */}
            <div className="d-meals">
                {SLOTS.map(slot => {
                    const Icon = SLOT_ICONS[slot];
                    const items = today.meals[slot] || [];
                    const slotCals = items.reduce((s, i) => s + i.cals, 0);
                    return (
                        <div key={slot} className="card d-meal" onClick={() => onMealSlotClick(slot)}>
                            <div className="d-meal-head">
                                <Icon size={13} />
                                <span>{slot}</span>
                            </div>
                            {slotCals > 0
                                ? <div className="d-meal-val">{slotCals}<span className="d-meal-unit">kcal</span></div>
                                : <div className="d-meal-add">+</div>
                            }
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
