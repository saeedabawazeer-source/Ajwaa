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

function MiniRing({ val, goal, color, size = 36, stroke = 3.5 }) {
    const r = (size - stroke * 2) / 2;
    const circ = 2 * Math.PI * r;
    const pct = Math.min(val / goal, 1);
    const offset = circ - pct * circ;
    return (
        <svg width={size} height={size} className="mini-ring-svg">
            <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(0,0,0,0.06)" strokeWidth={stroke} fill="none" />
            <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
                strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
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
    const calCirc = 2 * Math.PI * 40;
    const calOffset = calCirc - calPct * calCirc;

    return (
        <div className="dash">
            {/* Greeting */}
            <div className="d-greet-row">
                <div className="d-greet">{getGreeting()}, {user.name.split(' ')[0]}</div>
                <div className="d-xp"><Zap size={10} fill="var(--c-gold)" color="var(--c-gold)" /> LVL {xpProgress.level} · +{dayXP.total}xp</div>
            </div>

            <CalendarStrip days={days} />

            {/* ── Hero: big calorie ring ── */}
            <div className="card d-hero">
                <div className="d-ring-wrap">
                    <svg viewBox="0 0 100 100" className="d-ring-svg">
                        <circle cx="50" cy="50" r="40" stroke="rgba(0,0,0,0.05)" strokeWidth="7" fill="none" />
                        <circle cx="50" cy="50" r="40" stroke="var(--c-red)" strokeWidth="7" fill="none"
                            strokeLinecap="round" strokeDasharray={calCirc} strokeDashoffset={calOffset}
                            transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
                    </svg>
                    <div className="d-ring-inner">
                        <div className="d-ring-num">{remaining}</div>
                        <div className="d-ring-lbl">left</div>
                    </div>
                </div>
                <div className="d-hero-right">
                    <div className="d-eaten">{totals.cals} <span className="d-eaten-dim">/ {user.calorieTarget} kcal</span></div>
                    {/* Mini stat pills */}
                    <div className="d-pills">
                        <div className="d-pill" onClick={onWaterClick}>
                            <Droplets size={12} color="var(--c-blue)" /> {today.water}/{user.waterGoal}L
                            <Plus size={10} className="d-pill-plus" />
                        </div>
                        <div className="d-pill">
                            <Dumbbell size={12} color="var(--c-red)" /> {workoutsLogged} workout{workoutsLogged !== 1 ? 's' : ''}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── PCF macro cards with mini rings ── */}
            <div className="d-pcf-row">
                {[
                    { label: 'Protein', short: 'P', val: totals.p, goal: user.macros.p, color: '#FFD700', unit: 'g' },
                    { label: 'Carbs', short: 'C', val: totals.c, goal: user.macros.c, color: '#00BFFF', unit: 'g' },
                    { label: 'Fats', short: 'F', val: totals.f, goal: user.macros.f, color: '#FF4500', unit: 'g' },
                ].map(m => (
                    <div key={m.short} className="card d-pcf-card">
                        <div className="d-pcf-ring-wrap">
                            <MiniRing val={m.val} goal={m.goal} color={m.color} size={34} stroke={3} />
                            <div className="d-pcf-ring-letter" style={{ color: m.color }}>{m.short}</div>
                        </div>
                        <div className="d-pcf-info">
                            <div className="d-pcf-val">{m.val}<span className="d-pcf-dim">/{m.goal}{m.unit}</span></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Meal slots: compact single row ── */}
            <div className="d-meals-row">
                {SLOTS.map(slot => {
                    const Icon = SLOT_ICONS[slot];
                    const items = today.meals[slot] || [];
                    const slotCals = items.reduce((s, i) => s + i.cals, 0);
                    return (
                        <div key={slot} className="card d-meal-slot" onClick={() => onMealSlotClick(slot)}>
                            <Icon size={14} className="d-meal-ic" />
                            <div className="d-meal-name">{slot}</div>
                            {slotCals > 0
                                ? <div className="d-meal-cal">{slotCals}</div>
                                : <div className="d-meal-add">+</div>
                            }
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
