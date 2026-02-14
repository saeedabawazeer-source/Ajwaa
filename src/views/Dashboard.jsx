import { useState } from 'react';
import CalendarStrip from '../components/CalendarStrip';
import { getXPProgress, calcDayXP } from '../store/xpEngine';
import { Coffee, Sun, Moon, Utensils, Droplets, Dumbbell, Zap, Plus, ChevronRight } from 'lucide-react';
import './Dashboard.css';

const SLOTS = ['breakfast', 'lunch', 'dinner', 'snacks'];
const SLOT_META = {
    breakfast: { icon: Coffee, color: '#FF9800' },
    lunch: { icon: Sun, color: '#4CAF50' },
    dinner: { icon: Moon, color: '#5C6BC0' },
    snacks: { icon: Utensils, color: '#E91E63' },
};

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
    const remaining = Math.max(0, user.calorieTarget - totals.cals);
    const calPct = Math.min(totals.cals / user.calorieTarget, 1);
    const calCirc = 2 * Math.PI * 36;
    const workoutsLogged = today.workouts?.length || 0;
    const waterPct = Math.min(today.water / user.waterGoal, 1);
    const [tapped, setTapped] = useState(false);

    const pcf = [
        { l: 'Protein', v: totals.p, g: user.macros.p, color: '#FFD700' },
        { l: 'Carbs', v: totals.c, g: user.macros.c, color: '#00BFFF' },
        { l: 'Fats', v: totals.f, g: user.macros.f, color: '#FF4500' },
    ];

    function tapWater() {
        setTapped(true); onWaterClick();
        setTimeout(() => setTapped(false), 300);
    }

    return (
        <div className="dash">
            {/* Greeting */}
            <div className="d-top">
                <div className="d-greet">{getGreeting()}, {user.name.split(' ')[0]}</div>
                <div className="d-xp"><Zap size={10} fill="var(--c-gold)" color="var(--c-gold)" /> Lvl {xpProgress.level} · +{dayXP.total}xp</div>
            </div>

            <CalendarStrip days={days} />

            {/* ═══ CALORIE CARD ═══ */}
            <div className="card d-cal-card">
                <div className="d-ring-box">
                    <svg viewBox="0 0 80 80" className="d-ring-svg">
                        <circle cx="40" cy="40" r="36" stroke="rgba(0,0,0,0.06)" strokeWidth="6" fill="none" />
                        <circle cx="40" cy="40" r="36" stroke="var(--c-red)" strokeWidth="6" fill="none"
                            strokeLinecap="round" strokeDasharray={calCirc} strokeDashoffset={calCirc - calPct * calCirc}
                            transform="rotate(-90 40 40)" className="d-ring-anim" />
                    </svg>
                    <div className="d-ring-text">
                        <span className="d-ring-num">{remaining}</span>
                        <span className="d-ring-lbl">left</span>
                    </div>
                </div>
                <div className="d-cal-right">
                    <div className="d-eaten">{totals.cals}<span className="d-dim"> / {user.calorieTarget} kcal</span></div>
                    <div className="d-pcf-bars">
                        {pcf.map(m => (
                            <div key={m.l} className="d-bar-row">
                                <span className="d-bar-label" style={{ color: m.color }}>{m.l[0]}</span>
                                <div className="d-bar-track">
                                    <div className="d-bar-fill" style={{ width: `${Math.min(m.v / m.g * 100, 100)}%`, background: m.color }} />
                                </div>
                                <span className="d-bar-val">{m.v}<span className="d-dim">/{m.g}</span></span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══ WATER + WORKOUTS ═══ */}
            <div className="d-stats">
                <div className={`card d-stat-card ${tapped ? 'pop' : ''}`} onClick={tapWater}>
                    <div className="d-stat-top">
                        <Droplets size={15} color="var(--c-blue)" />
                        <span className="d-stat-title">Water</span>
                        <div className="d-add-btn"><Plus size={11} /></div>
                    </div>
                    <div className="d-stat-num" style={{ color: 'var(--c-blue)' }}>{today.water}<span className="d-dim">/{user.waterGoal}L</span></div>
                    <div className="d-bar-track thick">
                        <div className="d-bar-fill" style={{ width: `${waterPct * 100}%`, background: 'var(--c-blue)' }} />
                    </div>
                </div>
                <div className="card d-stat-card">
                    <div className="d-stat-top">
                        <Dumbbell size={15} color="var(--c-red)" />
                        <span className="d-stat-title">Workouts</span>
                    </div>
                    <div className="d-stat-num" style={{ color: 'var(--c-red)' }}>{workoutsLogged}</div>
                    <div className="d-stat-sub">{workoutsLogged === 0 ? 'none yet' : workoutsLogged === 1 ? '1 session' : `${workoutsLogged} sessions`}</div>
                </div>
            </div>

            {/* ═══ MEALS 2×2 — fills remaining ═══ */}
            <div className="d-meals">
                {SLOTS.map(slot => {
                    const { icon: Icon, color } = SLOT_META[slot];
                    const items = today.meals[slot] || [];
                    const slotCals = items.reduce((s, i) => s + i.cals, 0);
                    return (
                        <div key={slot} className="card d-meal" onClick={() => onMealSlotClick(slot)}>
                            <div className="d-meal-head">
                                <div className="d-meal-dot" style={{ background: color }} />
                                <Icon size={13} style={{ opacity: 0.5 }} />
                                <span className="d-meal-name">{slot}</span>
                            </div>
                            {slotCals > 0
                                ? <div className="d-meal-val">{slotCals}<span className="d-dim"> kcal</span></div>
                                : <div className="d-meal-empty"><Plus size={14} strokeWidth={2.5} /></div>
                            }
                            <ChevronRight size={11} className="d-meal-arrow" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
