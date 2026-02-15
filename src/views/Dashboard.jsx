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

export default function Dashboard({ today, totals, user, streak, getLast7Days, onWaterClick, onMealSlotClick, xp, selectedDate, onSelectDate }) {
    const days = getLast7Days();
    const remaining = Math.max(0, user.calorieTarget - totals.cals);
    const calPct = Math.min(totals.cals / user.calorieTarget, 1);
    const calCirc = 2 * Math.PI * 38; // Slightly larger ring
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

    // Calculate XP Progress
    const xpProgress = getXPProgress(xp);

    return (
        <div className="dash">
            <CalendarStrip days={days} selectedDate={selectedDate} onSelect={onSelectDate} />

            {/* Ajwa Section (Context) */}
            <div className="d-ajwa-section">
                <div className="d-ajwa-avatar">
                    <AjwaAvatar mood={nudge.mood} />
                </div>
                <div className="d-ajwa-bubble">
                    {nudge.text}
                    <div className="d-bubble-arrow" />
                </div>
            </div>

            {/* Big Stats Card (Calories + Macros) */}
            <div className="d-stats-card">
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
                            <Plus size={24} className="d-add-icon-big" />
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

                <div className="d-vital-card sleep">
                    <div className="d-vital-icon">
                        <Moon size={20} fill="currentColor" />
                    </div>
                    <div className="d-vital-info">
                        <span className="d-vital-val">7h 30m</span>
                        <span className="d-vital-lbl">Sleep</span>
                    </div>
                    <div className="d-vital-add">+</div>
                </div>
            </div>

            {/* Full Width Action Hero: Start Workout */}
            <button className="d-action-hero" onClick={() => { /* TO DO */ }}>
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
        </div>
    );
}
