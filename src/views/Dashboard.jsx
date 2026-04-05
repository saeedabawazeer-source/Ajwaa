import { useState } from 'react';
import CalendarStrip from '../components/CalendarStrip';
import { getXPProgress } from '../store/xpEngine';
import { getDashboardNudge } from '../utils/ajwaChat';
import { Coffee, Sun, Moon, Utensils, Droplets, Dumbbell, Zap, Plus, Scale } from 'lucide-react';
import './Dashboard.css';

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

export default function Dashboard({ today, totals, user, streak, getLast7Days, onWaterClick, onMealSlotClick, onStartWorkout, xp, selectedDate, onSelectDate }) {
    const days = getLast7Days();
    const calPct = Math.min(totals.cals / user.calorieTarget, 1);
    const calCirc = 2 * Math.PI * 38; // Slightly larger ring
    const waterPct = Math.min(today.water / user.waterGoal, 1);
    const [tapped, setTapped] = useState(false);

    // Nudge
    const nudge = getDashboardNudge(today, user, totals, streak);
    const currentSlot = getCurrentSlot();

    function tapWater() {
        setTapped(true); onWaterClick();
        setTimeout(() => setTapped(false), 300);
    }

    // Calculate XP Progress
    const xpProgress = getXPProgress(xp);

    return (
        <div className="dash">
            <CalendarStrip days={days} selectedDate={selectedDate} onSelect={onSelectDate} />

            {/* Nudge + Stats Card */}
            <div className="d-hero-wrapper" style={{ position: 'relative', marginTop: 12, marginBottom: 4 }}>
                {/* Nudge Bubble */}
                <div className="d-hero-bubble" style={{ zIndex: 10, marginBottom: 8 }}>
                    {nudge.text}
                </div>

                {/* Big Stats Card */}
                <div className="d-stats-card" style={{ position: 'relative', zIndex: 5 }}>

                    {/* Left: Interactive Calorie Ring */}
                    <div className="d-sc-left" onClick={() => onMealSlotClick(currentSlot)}>
                        <div className="d-sc-ring-wrap">
                            <svg viewBox="0 0 84 84" className="d-sc-svg">
                                <circle cx="42" cy="42" r="38" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                                <circle cx="42" cy="42" r="38" stroke="var(--c-red)" strokeWidth="8" fill="none"
                                    strokeLinecap="round" strokeDasharray={calCirc} strokeDashoffset={calCirc - calPct * calCirc}
                                    transform="rotate(-90 42 42)" className="d-anim" />
                            </svg>
                            <div className="d-sc-ring-inner">
                                {/* Plus removed - redundant with right button */}
                            </div>
                        </div>
                        <div className="d-sc-cal-text">
                            <span className="d-sc-val">{totals.cals}</span>
                            <span className="d-sc-label">KCAL</span>
                        </div>
                    </div>

                    {/* Center: Macro Progress Bars */}
                    <div className="d-sc-center">
                        <div className="d-macro-row">
                            <div className="d-mr-labels">
                                <span>Protein</span>
                                <span>{totals.p} / {user.macros.p}g</span>
                            </div>
                            <div className="d-mr-bar"><div className="d-mr-fill p" style={{ width: `${Math.min(totals.p / user.macros.p, 1) * 100}%` }} /></div>
                        </div>
                        <div className="d-macro-row">
                            <div className="d-mr-labels">
                                <span>Carbs</span>
                                <span>{totals.c} / {user.macros.c}g</span>
                            </div>
                            <div className="d-mr-bar"><div className="d-mr-fill c" style={{ width: `${Math.min(totals.c / user.macros.c, 1) * 100}%` }} /></div>
                        </div>
                        <div className="d-macro-row">
                            <div className="d-mr-labels">
                                <span>Fats</span>
                                <span>{totals.f} / {user.macros.f}g</span>
                            </div>
                            <div className="d-mr-bar"><div className="d-mr-fill f" style={{ width: `${Math.min(totals.f / user.macros.f, 1) * 100}%` }} /></div>
                        </div>
                    </div>

                    {/* Right: Log Meal Action */}
                    <div className="d-sc-right" onClick={() => onMealSlotClick(currentSlot)}>
                        <div className="d-sc-log-icon">
                            <Plus size={20} strokeWidth={3} />
                        </div>
                        <span className="d-sc-log-lbl">Log Meal</span>
                    </div>
                </div>
            </div>

            {/* Vitals Row: Water + Steps (New Fuller Widget) */}
            <div className="d-vitals-row">
                <div className={`d-vital-card water ${tapped ? 'pop' : ''}`} onClick={tapWater}>
                    <div className="d-vital-icon">
                        <Droplets size={20} fill="currentColor" />
                    </div>
                    <div className="d-vital-info">
                        <span className="d-vital-val">{today.water}L</span>
                        <span className="d-vital-lbl">Water</span>
                    </div>
                    <div className="d-vital-add">+</div>
                    <div className="d-vital-bg-bar" style={{ height: `${waterPct * 100}%` }} />
                </div>

                <div className="d-vital-card weight">
                    <div className="d-vital-icon">
                        <Scale size={20} fill="currentColor" />
                    </div>
                    <div className="d-vital-info">
                        <span className="d-vital-val">{user.weight} kg</span>
                        <span className="d-vital-lbl">Weight</span>
                    </div>
                    <div className="d-vital-add">+</div>
                </div>
            </div>

            {/* Level & XP Progress (Gamification Focus) */}
            <div className="d-xp-card">
                <div className="d-xp-header">
                    <div className="d-xp-level">
                        <span className="d-lvl-label">LEVEL</span>
                        <span className="d-lvl-num">{xpProgress.level}</span>
                    </div>
                    <div className="d-xp-reward">
                        <Zap size={14} fill="currentColor" />
                        <span>Next: Gold Badge</span>
                    </div>
                </div>
                <div className="d-xp-bar-bg">
                    <div className="d-xp-bar-fill" style={{ width: `${xpProgress.progress}%` }} />
                </div>
                <div className="d-xp-vals">
                    <span>{Math.round(xpProgress.currentLevelXP)} XP</span>
                    <span>{Math.round(xpProgress.nextLevelXP)} XP</span>
                </div>
            </div>

            {/* Full Width Action Hero: Start Workout */}
            <button className="d-action-hero" onClick={onStartWorkout}>
                <div className="d-ah-content">
                    <div className="d-ah-icon">
                        <Dumbbell size={24} strokeWidth={3} />
                    </div>
                    <div className="d-ah-text">
                        <div className="d-ah-title">Start Workout</div>
                        <div className="d-ah-sub">Chest & Triceps • 45m</div>
                    </div>
                </div>
                <div className="d-ah-arrow">GO</div>
            </button>
        </div>
    );
}
