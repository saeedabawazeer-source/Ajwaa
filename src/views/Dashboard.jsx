import { useState } from 'react';
import CalendarStrip from '../components/CalendarStrip';
import { getXPProgress, calcDayXP } from '../store/xpEngine';
import { Coffee, Sun, Moon, Utensils, Droplets, Dumbbell, Zap, Plus, ChevronRight } from 'lucide-react';
import './Dashboard.css';

const SLOTS = ['breakfast', 'lunch', 'dinner', 'snacks'];
const SLOT_META = {
    breakfast: { icon: Coffee, gradient: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)', accent: '#FF9800' },
    lunch: { icon: Sun, gradient: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', accent: '#4CAF50' },
    dinner: { icon: Moon, gradient: 'linear-gradient(135deg, #E8EAF6, #C5CAE9)', accent: '#5C6BC0' },
    snacks: { icon: Utensils, gradient: 'linear-gradient(135deg, #FCE4EC, #F8BBD0)', accent: '#E91E63' },
};

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

// Animated circular progress
function Ring({ pct, size, stroke, color, children }) {
    const r = (size - stroke * 2) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - Math.min(pct, 1) * circ;
    return (
        <div className="ring-wrap" style={{ width: size, height: size }}>
            <svg viewBox={`0 0 ${size} ${size}`} className="ring-svg">
                <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(0,0,0,0.05)" strokeWidth={stroke} fill="none" />
                <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
                    strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    className="ring-progress" />
            </svg>
            <div className="ring-content">{children}</div>
        </div>
    );
}

export default function Dashboard({ today, totals, user, streak, getLast7Days, onWaterClick, onMealSlotClick, xp }) {
    const days = getLast7Days();
    const xpProgress = getXPProgress(xp || 0);
    const dayXP = calcDayXP(today, user, streak);
    const remaining = Math.max(0, user.calorieTarget - totals.cals);
    const calPct = totals.cals / user.calorieTarget;
    const workoutsLogged = today.workouts?.length || 0;
    const waterPct = today.water / user.waterGoal;
    const [tappedWater, setTappedWater] = useState(false);

    const pcf = [
        { l: 'P', v: totals.p, g: user.macros.p, color: '#FFD700', bg: '#FFFDE7' },
        { l: 'C', v: totals.c, g: user.macros.c, color: '#00BFFF', bg: '#E0F7FA' },
        { l: 'F', v: totals.f, g: user.macros.f, color: '#FF4500', bg: '#FBE9E7' },
    ];

    function handleWaterTap() {
        setTappedWater(true);
        onWaterClick();
        setTimeout(() => setTappedWater(false), 400);
    }

    return (
        <div className="dash">
            {/* ── Top bar ── */}
            <div className="d-topbar">
                <div className="d-greet">{getGreeting()}, {user.name.split(' ')[0]} 👋</div>
                <div className="d-sub">
                    <Zap size={10} fill="var(--c-gold)" color="var(--c-gold)" />
                    Level {xpProgress.level} · +{dayXP.total} XP today
                </div>
            </div>

            <CalendarStrip days={days} />

            {/* ══════ NUTRITION HERO WIDGET ══════ */}
            <div className="d-nutrition-widget">
                <div className="d-nutri-top">
                    <Ring pct={calPct} size={90} stroke={7} color="var(--c-red)">
                        <div className="d-ring-num">{remaining}</div>
                        <div className="d-ring-label">left</div>
                    </Ring>
                    <div className="d-nutri-info">
                        <div className="d-eaten">
                            <span className="d-eaten-big">{totals.cals}</span>
                            <span className="d-eaten-dim"> / {user.calorieTarget}</span>
                        </div>
                        <div className="d-eaten-sub">kcal eaten today</div>
                        {/* PCF inline in nutrition widget */}
                        <div className="d-pcf-row">
                            {pcf.map(m => (
                                <div key={m.l} className="d-pcf-chip" style={{ background: m.bg }}>
                                    <Ring pct={m.v / m.g} size={24} stroke={2.5} color={m.color}>
                                        <span className="d-pcf-letter" style={{ color: m.color }}>{m.l}</span>
                                    </Ring>
                                    <div className="d-pcf-nums">
                                        <span className="d-pcf-val">{m.v}</span>
                                        <span className="d-pcf-goal">/{m.g}g</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════ ACTIVITY WIDGETS ══════ */}
            <div className="d-activity-row">
                {/* Water widget */}
                <div className={`d-water-widget ${tappedWater ? 'bounce' : ''}`} onClick={handleWaterTap}>
                    <div className="d-water-top">
                        <Droplets size={18} color="#3B82F6" />
                        <span className="d-water-title">Water</span>
                        <div className="d-water-add"><Plus size={12} /></div>
                    </div>
                    <div className="d-water-val">{today.water}<span className="d-water-unit">/{user.waterGoal}L</span></div>
                    <div className="d-water-bar-track">
                        <div className="d-water-bar-fill" style={{ width: `${Math.min(waterPct * 100, 100)}%` }} />
                        <div className="d-water-bubbles">
                            {Array.from({ length: Math.floor(today.water / 0.25) }, (_, i) => (
                                <div key={i} className="d-water-dot" style={{ animationDelay: `${i * 0.1}s` }} />
                            )).slice(0, 10)}
                        </div>
                    </div>
                </div>

                {/* Workout widget */}
                <div className="d-workout-widget">
                    <div className="d-work-top">
                        <Dumbbell size={18} color="var(--c-red)" />
                        <span className="d-work-title">Workouts</span>
                    </div>
                    <div className="d-work-val">{workoutsLogged}</div>
                    <div className="d-work-sub">{workoutsLogged === 0 ? 'None yet — go train!' : 'session' + (workoutsLogged > 1 ? 's' : '') + ' today'}</div>
                </div>
            </div>

            {/* ══════ MEAL CARDS ══════ */}
            <div className="d-meals-grid">
                {SLOTS.map(slot => {
                    const meta = SLOT_META[slot];
                    const Icon = meta.icon;
                    const items = today.meals[slot] || [];
                    const slotCals = items.reduce((s, i) => s + i.cals, 0);
                    return (
                        <div key={slot} className="d-meal-card" style={{ background: meta.gradient }} onClick={() => onMealSlotClick(slot)}>
                            <div className="d-meal-head">
                                <div className="d-meal-icon" style={{ background: meta.accent }}><Icon size={12} color="white" /></div>
                                <span className="d-meal-name">{slot}</span>
                            </div>
                            {slotCals > 0
                                ? <>
                                    <div className="d-meal-kcal">{slotCals}</div>
                                    <div className="d-meal-items">{items.length} item{items.length > 1 ? 's' : ''}</div>
                                </>
                                : <div className="d-meal-empty">
                                    <Plus size={16} style={{ opacity: 0.3 }} />
                                </div>
                            }
                            <ChevronRight size={12} className="d-meal-arrow" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
