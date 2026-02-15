import { useState, useEffect } from 'react';
import CalendarStrip from '../components/CalendarStrip';
import { getXPProgress, calcDayXP } from '../store/xpEngine';
import { getDashboardNudge } from '../utils/ajwaChat';
import { Coffee, Sun, Moon, Utensils, Droplets, Dumbbell, Zap, Plus, Flame, ChevronRight } from 'lucide-react';
import './Dashboard.css';

const SLOTS = ['breakfast', 'lunch', 'dinner', 'snacks'];
const SLOT_META = {
    breakfast: { icon: Coffee, color: '#FF9800', bg: '#FFF3E0', label: 'Breakfast' },
    lunch: { icon: Sun, color: '#4CAF50', bg: '#E8F5E9', label: 'Lunch' },
    dinner: { icon: Moon, color: '#5C6BC0', bg: '#E8EAF6', label: 'Dinner' },
    snacks: { icon: Utensils, color: '#E91E63', bg: '#FCE4EC', label: 'Snacks' },
};

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
}

function AjwaAvatar({ mood }) {
    // Simple SVG avatar that changes expression based on mood
    const eyes = mood === 'concern' ? 'M 9 14 Q 11 12 13 14 M 19 14 Q 21 12 23 14' : // Sad eyes
        mood === 'excited' ? 'M 9 14 Q 11 12 13 14 M 19 14 Q 21 12 23 14' : // Happy eyes (same for now)
            'M 9 13 A 2 2 0 1 1 13 13 M 19 13 A 2 2 0 1 1 23 13'; // Normal eyes

    const mouth = mood === 'concern' ? 'M 10 22 Q 16 20 22 22' : // Wavy/sad mouth
        mood === 'excited' ? 'M 10 20 Q 16 28 22 20' : // Open happy mouth
            'M 11 21 Q 16 24 21 21'; // Small smile

    return (
        <svg viewBox="0 0 32 32" className="d-ajwa-svg">
            <circle cx="16" cy="16" r="15" fill="#1A1A1A" />
            <path d={eyes} stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d={mouth} stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
    );
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

    // Get nudge from Ajwa based on current state
    const nudge = getDashboardNudge(today, user, totals, streak);

    function tapWater() {
        setTapped(true); onWaterClick();
        setTimeout(() => setTapped(false), 300);
    }

    return (
        <div className="dash">
            {/* Top Bar: Greeting + Streak */}
            <div className="d-top">
                <div className="d-greet-box">
                    <div className="d-greet">{getGreeting()},</div>
                    <div className="d-name">{user.name.split(' ')[0]}</div>
                </div>
                <div className={`d-streak ${streak > 6 ? 'fire' : ''}`}>
                    <Flame size={18} fill={streak > 0 ? "currentColor" : "none"} />
                    <span>{streak}</span>
                </div>
            </div>

            {/* Ajwa Contextual Nudge */}
            <div className="d-ajwa-section">
                <div className="d-ajwa-avatar">
                    <AjwaAvatar mood={nudge.mood} />
                </div>
                <div className="d-ajwa-bubble">
                    {nudge.text}
                    <div className="d-bubble-arrow" />
                </div>
            </div>

            <CalendarStrip days={days} />

            {/* Stats Row: Calories + Water */}
            <div className="d-stats-row">
                <div className="d-cal-card" onClick={() => onMealSlotClick('breakfast')}>
                    <div className="d-ring-wrapper">
                        <svg viewBox="0 0 76 76" className="d-ring-svg">
                            <circle cx="38" cy="38" r="34" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
                            <circle cx="38" cy="38" r="34" stroke="var(--c-red)" strokeWidth="6" fill="none"
                                strokeLinecap="round" strokeDasharray={calCirc} strokeDashoffset={calCirc - calPct * calCirc}
                                transform="rotate(-90 38 38)" className="d-anim" />
                        </svg>
                        <div className="d-ring-inner">
                            <span className="d-ring-num">{remaining}</span>
                        </div>
                    </div>
                    <div className="d-cal-info">
                        <div className="d-cal-lbl">Calories Left</div>
                        <div className="d-cal-eaten">{totals.cals} / {user.calorieTarget}</div>
                        <div className="d-cal-macros">
                            <div className="d-macro-pill"><div className="d-dot" style={{ background: '#FFD700' }} />P {totals.p}</div>
                            <div className="d-macro-pill"><div className="d-dot" style={{ background: '#00BFFF' }} />C {totals.c}</div>
                            <div className="d-macro-pill"><div className="d-dot" style={{ background: '#FF4500' }} />F {totals.f}</div>
                        </div>
                    </div>
                </div>

                <div className={`d-water-btn ${tapped ? 'pop' : ''}`} onClick={tapWater}>
                    <div className="d-water-track">
                        <div className="d-water-fill" style={{ height: `${waterPct * 100}%` }} />
                    </div>
                    <Droplets size={18} className="d-water-icon" />
                    <div className="d-water-val">{today.water}L</div>
                    <div className="d-water-plus"><Plus size={12} /></div>
                </div>
            </div>

            {/* Timeline View for Meals */}
            <div className="d-timeline">
                {SLOTS.map(slot => {
                    const m = SLOT_META[slot];
                    const Icon = m.icon;
                    const items = today.meals[slot] || [];
                    const slotCals = items.reduce((s, i) => s + i.cals, 0);
                    const filled = items.length > 0;

                    return (
                        <div key={slot} className={`d-time-row ${filled ? 'filled' : ''}`} onClick={() => onMealSlotClick(slot)}>
                            <div className="d-time-icon" style={{ background: filled ? m.color : 'var(--c-sand)' }}>
                                <Icon size={14} color={filled ? 'white' : 'var(--c-black)'} style={{ opacity: filled ? 1 : 0.4 }} />
                            </div>
                            <div className="d-time-info">
                                <span className="d-time-name">{m.label}</span>
                                {filled && <span className="d-time-cal">{slotCals} kcal</span>}
                            </div>
                            {filled ? <ChevronRight size={16} opacity={0.3} /> : <div className="d-time-add"><Plus size={16} /></div>}
                        </div>
                    );
                })}
            </div>

            {/* Smart Workout Bar */}
            <div className="d-workout-smart" style={{ opacity: workoutsLogged > 0 ? 0.6 : 1 }}>
                <Dumbbell size={18} color="var(--c-volt)" />
                <div className="d-work-text">
                    {workoutsLogged > 0
                        ? <span>Workout complete! Great job.</span>
                        : <span>Day 3: <strong>Chest & Triceps</strong></span>
                    }
                </div>
                {workoutsLogged === 0 && <div className="d-work-go">GO</div>}
            </div>
        </div>
    );
}
