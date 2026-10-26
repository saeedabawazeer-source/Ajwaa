import { useState } from 'react';
import CalendarStrip from '../components/CalendarStrip';
import { Coffee, Sun, Moon, Utensils, Droplets, Dumbbell, Zap, Plus, Scale, Camera, Flame } from 'lucide-react';
import CheckInModal from '../components/CheckInModal';
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

export default function Dashboard({ today, totals, user, streak, xp, xpProg, hasCheckedIn, getLast7Days, onWaterClick, onMealSlotClick, onStartWorkout, selectedDate, onSelectDate, onOpenStats, onLogCheckIn }) {
    const days = getLast7Days();
    const calPct = Math.min(totals.cals / user.calorieTarget, 1);
    const calCirc = 2 * Math.PI * 38; // Slightly larger ring
    const waterPct = Math.min(today.water / user.waterGoal, 1);
    const [tapped, setTapped] = useState(false);
    const [showCheckIn, setShowCheckIn] = useState(false);

    // Check if already checked in today
    const currentSlot = getCurrentSlot();

    function tapWater() {
        setTapped(true); onWaterClick();
        setTimeout(() => setTapped(false), 300);
    }

    // Calculate XP Progress
    
    return (
        <div className="dash">
            <CalendarStrip days={days} selectedDate={selectedDate} onSelect={onSelectDate} />

            {/* Progress card --- merged level + XP + streak */}
            <div className="d-prog-card" onClick={onOpenStats} style={{ cursor: 'pointer' }}>
                <div className="d-prog-top">
                    <div className="d-prog-level">
                        <span className="d-prog-lbl">LEVEL</span>
                        <span className="d-prog-num">{xpProg.level}</span>
                    </div>
                    <div className="d-prog-streak">
                        <Flame size={14} fill="currentColor" /> {streak} day streak
                    </div>
                </div>
                <div className="d-prog-bar-bg">
                    <div className="d-prog-bar-fill" style={{ width: `${xpProg.percentage}%` }} />
                </div>
                <div className="d-prog-vals">
                    <span>{xp} XP</span>
                    <span>{xpProg.needed} XP to next level</span>
                </div>
            </div>

            {/* Stats Card */}
            <div className="d-hero-wrapper" style={{ position: 'relative', marginTop: 12, marginBottom: 4 }}>
                <div className="d-stats-card" style={{ position: 'relative', zIndex: 5 }}>

                    {/* Left: Interactive Calorie Ring */}
                    <div className="d-sc-left" onClick={() => onMealSlotClick(currentSlot)}>
                        <div className="d-sc-ring-wrap">
                            <svg viewBox="0 0 96 96" className="d-sc-svg">
                                <circle cx="48" cy="48" r="38" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                                <circle cx="48" cy="48" r="38" stroke="var(--c-red)" strokeWidth="8" fill="none"
                                    strokeLinecap="round" strokeDasharray={calCirc} strokeDashoffset={calCirc - calPct * calCirc}
                                    transform="rotate(-90 48 48)" className="d-anim" />
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
                                <span className={totals.p > user.macros.p ? 'over' : ''}>{totals.p} / {user.macros.p}g</span>
                            </div>
                            <div className="d-mr-bar"><div className={'d-mr-fill p' + (totals.p > user.macros.p ? ' over' : '')} style={{ width: `${Math.min(totals.p / user.macros.p, 1) * 100}%` }} /></div>
                        </div>
                        <div className="d-macro-row">
                            <div className="d-mr-labels">
                                <span>Carbs</span>
                                <span className={totals.c > user.macros.c ? 'over' : ''}>{totals.c} / {user.macros.c}g</span>
                            </div>
                            <div className="d-mr-bar"><div className={'d-mr-fill c' + (totals.c > user.macros.c ? ' over' : '')} style={{ width: `${Math.min(totals.c / user.macros.c, 1) * 100}%` }} /></div>
                        </div>
                        <div className="d-macro-row">
                            <div className="d-mr-labels">
                                <span>Fats</span>
                                <span className={totals.f > user.macros.f ? 'over' : ''}>{totals.f} / {user.macros.f}g</span>
                            </div>
                            <div className="d-mr-bar"><div className={'d-mr-fill f' + (totals.f > user.macros.f ? ' over' : '')} style={{ width: `${Math.min(totals.f / user.macros.f, 1) * 100}%` }} /></div>
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

            {/* Daily Check In (BeReal Style) */}
            <div className={`d-checkin-card ${hasCheckedIn ? 'done' : ''}`} onClick={() => !hasCheckedIn && setShowCheckIn(true)}>
                <div className="d-checkin-icon">
                    <Camera size={24} color={hasCheckedIn ? "var(--c-sand)" : "var(--c-volt)"} />
                </div>
                <div className="d-checkin-text">
                    <div className="d-checkin-title">
                        {hasCheckedIn ? 'Checked in for today! 🔥' : 'Time to be real.'}
                    </div>
                    <div className="d-checkin-sub">
                        {hasCheckedIn ? '+50 XP Earned' : 'Snap your daily gym pic for XP'}
                    </div>
                </div>
                {!hasCheckedIn && <div className="d-checkin-arrow">GO</div>}
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

            {/* Check In Modal */}
            {showCheckIn && (
                <CheckInModal 
                    onClose={() => setShowCheckIn(false)}
                    onConfirm={(photo) => {
                        onLogCheckIn(photo);
                        setShowCheckIn(false);
                    }}
                />
            )}
        </div>
    );
}
