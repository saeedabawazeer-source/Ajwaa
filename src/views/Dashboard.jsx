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

function getCurrentSlot() {
    const h = new Date().getHours();
    if (h < 11) return 'breakfast';
    if (h < 16) return 'lunch';
    if (h < 22) return 'dinner';
    return 'snacks';
}

function AjwaAvatar({ mood }) {
    const eyes = mood === 'concern' ? 'M 9 14 Q 11 12 13 14 M 19 14 Q 21 12 23 14' :
        mood === 'excited' ? 'M 9 14 Q 11 12 13 14 M 19 14 Q 21 12 23 14' :
            'M 9 13 A 2 2 0 1 1 13 13 M 19 13 A 2 2 0 1 1 23 13';

    const mouth = mood === 'concern' ? 'M 10 22 Q 16 20 22 22' :
        mood === 'excited' ? 'M 10 20 Q 16 28 22 20' :
            'M 11 21 Q 16 24 21 21';

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
    const remaining = Math.max(0, user.calorieTarget - totals.cals);
    const calPct = Math.min(totals.cals / user.calorieTarget, 1);
    const calCirc = 2 * Math.PI * 34;
    const workoutsLogged = today.workouts?.length || 0;
    const waterPct = Math.min(today.water / user.waterGoal, 1);
    const [tapped, setTapped] = useState(false);

    // Nudge
    const nudge = getDashboardNudge(today, user, totals, streak);
    const currentSlot = getCurrentSlot();

    function tapWater() {
        setTapped(true); onWaterClick();
        setTimeout(() => setTapped(false), 300);
    }

    // Check if any meals logged
    const hasMeals = SLOTS.some(s => today.meals[s]?.length > 0);

    return (
        <div className="dash">
            {/* Ajwa Section (Top Context) */}
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

            {/* Stats: Calories + Water */}
            <div className="d-stats-row">
                {/* Enhanced Calorie Card with Log Button */}
                <div className="d-cal-card">
                    <div className="d-cal-left" onClick={() => onMealSlotClick(currentSlot)}>
                        <div className="d-ring-wrapper">
                            <svg viewBox="0 0 76 76" className="d-ring-svg">
                                <circle cx="38" cy="38" r="34" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
                                <circle cx="38" cy="38" r="34" stroke="var(--c-red)" strokeWidth="6" fill="none"
                                    strokeLinecap="round" strokeDasharray={calCirc} strokeDashoffset={calCirc - calPct * calCirc}
                                    transform="rotate(-90 38 38)" className="d-anim" />
                            </svg>
                            <div className="d-ring-inner">
                                <Plus size={20} className="d-add-icon" />
                            </div>
                        </div>
                    </div>

                    <div className="d-cal-info">
                        <div className="d-cal-lbl">Calories & Macros</div>
                        <div className="d-cal-eaten">{totals.cals} / {user.calorieTarget} kcal</div>
                        <div className="d-cal-macros">
                            <div className="d-macro-pill"><div className="d-dot" style={{ background: '#FFD700' }} />P {totals.p}</div>
                            <div className="d-macro-pill"><div className="d-dot" style={{ background: '#00BFFF' }} />C {totals.c}</div>
                            <div className="d-macro-pill"><div className="d-dot" style={{ background: '#FF4500' }} />F {totals.f}</div>
                        </div>
                    </div>
                </div>

                {/* Water Card */}
                <div className={`d-water-btn ${tapped ? 'pop' : ''}`} onClick={tapWater}>
                    <div className="d-water-track">
                        <div className="d-water-fill" style={{ height: `${waterPct * 100}%` }} />
                    </div>
                    <Droplets size={18} className="d-water-icon" />
                    <div className="d-water-val">{today.water}L</div>
                    <div className="d-water-plus"><Plus size={12} /></div>
                </div>
            </div>

            {/* Main Content: Big Workout Card (Interactive) */}
            <div className="d-workout-big">
                <div className="d-wb-header">
                    <div className="d-wb-title">
                        <span className="d-wb-day">DAY 3</span>
                        <span className="d-wb-name">Chest & Triceps</span>
                    </div>
                    {workoutsLogged > 0 ? (
                        <div className="d-wb-status done">COMPLETE</div>
                    ) : (
                        <div className="d-wb-status">45 MIN</div>
                    )}
                </div>

                <div className="d-wb-list">
                    <div className="d-wb-item">
                        <div className="d-wb-check"></div>
                        <span>Barbell Bench Press</span>
                        <span className="d-wb-meta">3 x 10</span>
                    </div>
                    <div className="d-wb-item">
                        <div className="d-wb-check"></div>
                        <span>Incline Dumbbell Press</span>
                        <span className="d-wb-meta">3 x 12</span>
                    </div>
                    <div className="d-wb-item">
                        <div className="d-wb-check"></div>
                        <span>Tricep Rope Pushdown</span>
                        <span className="d-wb-meta">3 x 15</span>
                    </div>
                    <div className="d-wb-more">+ 2 more exercises</div>
                </div>

                {workoutsLogged === 0 && (
                    <button className="d-wb-btn">
                        START WORKOUT <Dumbbell size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
