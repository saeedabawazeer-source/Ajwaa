import { useState } from 'react';
import CalendarStrip from '../components/CalendarStrip';
import { getXPProgress, calcDayXP } from '../store/xpEngine';
import { Coffee, Sun, Moon, Utensils, Droplets, Dumbbell, Zap, Plus } from 'lucide-react';
import './Dashboard.css';

const SLOTS = ['breakfast', 'lunch', 'dinner', 'snacks'];
const SLOT_META = {
    breakfast: { icon: Coffee, color: '#FF9800', bg: '#FFF3E0' },
    lunch: { icon: Sun, color: '#4CAF50', bg: '#E8F5E9' },
    dinner: { icon: Moon, color: '#5C6BC0', bg: '#E8EAF6' },
    snacks: { icon: Utensils, color: '#E91E63', bg: '#FCE4EC' },
};

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Morning';
    if (h < 17) return 'Afternoon';
    return 'Evening';
}

export default function Dashboard({ today, totals, user, streak, getLast7Days, onWaterClick, onMealSlotClick, xp }) {
    const days = getLast7Days();
    const xpProgress = getXPProgress(xp || 0);
    const dayXP = calcDayXP(today, user, streak);
    const remaining = Math.max(0, user.calorieTarget - totals.cals);
    const calPct = Math.min(totals.cals / user.calorieTarget, 1);
    const calCirc = 2 * Math.PI * 34;
    const workoutsLogged = today.workouts?.length || 0;
    const waterPct = Math.min(today.water / user.waterGoal, 1);
    const [tapped, setTapped] = useState(false);

    function tapWater() {
        setTapped(true); onWaterClick();
        setTimeout(() => setTapped(false), 300);
    }

    return (
        <div className="dash">
            {/* Greeting */}
            <div className="d-top">
                <div className="d-greet">{getGreeting()}, {user.name.split(' ')[0]}</div>
                <div className="d-xp"><Zap size={10} fill="var(--c-gold)" color="var(--c-gold)" />L{xpProgress.level} +{dayXP.total}xp</div>
            </div>

            <CalendarStrip days={days} />

            {/* ═══ HERO ROW: Calories (big) + Water (small) ═══ */}
            <div className="d-hero-row">
                {/* Calorie card — dark bg like inspo */}
                <div className="d-cal-card" onClick={() => onMealSlotClick('breakfast')}>
                    <div className="d-cal-ring-area">
                        <svg viewBox="0 0 76 76" className="d-cal-svg">
                            <circle cx="38" cy="38" r="34" stroke="rgba(255,255,255,0.1)" strokeWidth="5" fill="none" />
                            <circle cx="38" cy="38" r="34" stroke="var(--c-red)" strokeWidth="5" fill="none"
                                strokeLinecap="round" strokeDasharray={calCirc} strokeDashoffset={calCirc - calPct * calCirc}
                                transform="rotate(-90 38 38)" className="d-anim" />
                        </svg>
                        <div className="d-cal-inner">
                            <span className="d-cal-num">{remaining}</span>
                            <span className="d-cal-lbl">left</span>
                        </div>
                    </div>
                    <div className="d-cal-info">
                        <div className="d-cal-eaten">{totals.cals}<span className="d-cal-dim">/{user.calorieTarget}</span></div>
                        <div className="d-cal-pcf">
                            {[
                                { l: 'P', v: totals.p, g: user.macros.p, c: '#FFD700' },
                                { l: 'C', v: totals.c, g: user.macros.c, c: '#00BFFF' },
                                { l: 'F', v: totals.f, g: user.macros.f, c: '#FF6B35' },
                            ].map(m => (
                                <div key={m.l} className="d-pcf-pill">
                                    <span className="d-pcf-dot" style={{ background: m.c }} />
                                    <span>{m.l} {m.v}/{m.g}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Water card — blue bg */}
                <div className={`d-water-card ${tapped ? 'pop' : ''}`} onClick={tapWater}>
                    <Droplets size={20} color="white" style={{ opacity: 0.6 }} />
                    <div className="d-water-num">{today.water}</div>
                    <div className="d-water-goal">/{user.waterGoal}L</div>
                    <div className="d-water-bar">
                        <div className="d-water-fill" style={{ height: `${waterPct * 100}%` }} />
                    </div>
                    <div className="d-water-plus"><Plus size={14} /></div>
                </div>
            </div>

            {/* ═══ MEALS 2×2 ═══ */}
            <div className="d-meals">
                {SLOTS.map(slot => {
                    const m = SLOT_META[slot];
                    const Icon = m.icon;
                    const items = today.meals[slot] || [];
                    const slotCals = items.reduce((s, i) => s + i.cals, 0);
                    return (
                        <div key={slot} className="d-meal" style={{ background: m.bg }} onClick={() => onMealSlotClick(slot)}>
                            <div className="d-meal-icon" style={{ background: m.color }}><Icon size={13} color="white" /></div>
                            <div className="d-meal-name">{slot}</div>
                            {slotCals > 0
                                ? <div className="d-meal-kcal">{slotCals}</div>
                                : <div className="d-meal-add"><Plus size={16} /></div>
                            }
                        </div>
                    );
                })}
            </div>

            {/* ═══ WORKOUT BAR — full width, dark ═══ */}
            <div className="d-workout-bar">
                <Dumbbell size={16} color="var(--c-volt)" />
                <span className="d-workout-label">Workouts</span>
                <span className="d-workout-num">{workoutsLogged}</span>
            </div>
        </div>
    );
}
