import CalendarStrip from '../components/CalendarStrip';
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

function MiniRing({ val, goal, color, size = 32 }) {
    const r = (size - 6) / 2;
    const circ = 2 * Math.PI * r;
    const pct = Math.min(val / goal, 1);
    return (
        <svg width={size} height={size}>
            <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(0,0,0,0.05)" strokeWidth="3" fill="none" />
            <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="3" fill="none"
                strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - pct * circ}
                transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: 'stroke-dashoffset 0.6s' }} />
        </svg>
    );
}

export default function Dashboard({ today, totals, user, streak, getLast7Days, onWaterClick, onMealSlotClick, xp }) {
    const days = getLast7Days();
    const xpProgress = getXPProgress(xp || 0);
    const dayXP = calcDayXP(today, user, streak);
    const workoutsLogged = today.workouts?.length || 0;
    const remaining = Math.max(0, user.calorieTarget - totals.cals);
    const calPct = Math.min(totals.cals / user.calorieTarget, 1);
    const calCirc = 2 * Math.PI * 38;

    const pcf = [
        { l: 'P', v: totals.p, g: user.macros.p, c: '#FFD700' },
        { l: 'C', v: totals.c, g: user.macros.c, c: '#00BFFF' },
        { l: 'F', v: totals.f, g: user.macros.f, c: '#FF4500' },
    ];

    return (
        <div className="dash">
            {/* Greeting */}
            <div className="d-top">
                <div className="d-greet">{getGreeting()}, {user.name.split(' ')[0]}</div>
                <div className="d-xp"><Zap size={10} fill="var(--c-gold)" color="var(--c-gold)" /> LVL {xpProgress.level} · +{dayXP.total}xp</div>
            </div>

            <CalendarStrip days={days} />

            {/* ═══ Nutrition card: ring + kcal + PCF all together ═══ */}
            <div className="card d-nutrition">
                <div className="d-ring-box">
                    <svg viewBox="0 0 96 96" className="d-ring-svg">
                        <circle cx="48" cy="48" r="38" stroke="rgba(0,0,0,0.05)" strokeWidth="6" fill="none" />
                        <circle cx="48" cy="48" r="38" stroke="var(--c-red)" strokeWidth="6" fill="none"
                            strokeLinecap="round" strokeDasharray={calCirc} strokeDashoffset={calCirc - calPct * calCirc}
                            transform="rotate(-90 48 48)" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
                    </svg>
                    <div className="d-ring-center">
                        <div className="d-ring-num">{remaining}</div>
                        <div className="d-ring-sub">left</div>
                    </div>
                </div>
                <div className="d-nutri-right">
                    <div className="d-eaten-row">
                        <span className="d-eaten-num">{totals.cals}</span>
                        <span className="d-eaten-of">/ {user.calorieTarget} kcal eaten</span>
                    </div>
                    <div className="d-pcf-strip">
                        {pcf.map(m => (
                            <div key={m.l} className="d-pcf-item">
                                <div className="d-pcf-ring-box">
                                    <MiniRing val={m.v} goal={m.g} color={m.c} size={30} />
                                    <span className="d-pcf-letter" style={{ color: m.c }}>{m.l}</span>
                                </div>
                                <span className="d-pcf-num">{m.v}<span className="d-pcf-g">/{m.g}</span></span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══ Water + Workouts ═══ */}
            <div className="d-stats-row">
                <div className="card d-stat" onClick={onWaterClick}>
                    <div className="d-stat-left">
                        <Droplets size={16} color="var(--c-blue)" />
                        <div>
                            <div className="d-stat-v">{today.water}<span className="d-stat-d">/{user.waterGoal}L</span></div>
                            <div className="d-stat-bar"><div className="d-stat-fill" style={{ width: `${Math.min(today.water / user.waterGoal * 100, 100)}%`, background: 'var(--c-blue)' }} /></div>
                        </div>
                    </div>
                    <div className="d-stat-add"><Plus size={12} /></div>
                </div>
                <div className="card d-stat">
                    <Dumbbell size={16} color="var(--c-red)" />
                    <div>
                        <div className="d-stat-v">{workoutsLogged}</div>
                        <div className="d-stat-lbl">WORKOUTS</div>
                    </div>
                </div>
            </div>

            {/* ═══ Meals ═══ */}
            <div className="d-meals">
                {SLOTS.map(slot => {
                    const Icon = SLOT_ICONS[slot];
                    const items = today.meals[slot] || [];
                    const slotCals = items.reduce((s, i) => s + i.cals, 0);
                    return (
                        <div key={slot} className="card d-meal" onClick={() => onMealSlotClick(slot)}>
                            <Icon size={14} style={{ opacity: 0.4 }} />
                            <div className="d-meal-name">{slot}</div>
                            {slotCals > 0
                                ? <div className="d-meal-cal">{slotCals}</div>
                                : <div className="d-meal-plus">+</div>
                            }
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
