import { useState } from 'react';
import CalendarStrip from '../components/CalendarStrip';
import { getXPProgress } from '../store/xpEngine';
import CheckInModal from '../components/CheckInModal';
import { useStore } from '../store/useStore';
import DailyQuests from '../components/DailyQuests';
import KenneyIcon from '../components/KenneyIcon';
import './Dashboard.css';

const SLOT_META = [
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' },
    { id: 'snacks', label: 'Snacks' },
];

function getCurrentSlot() {
    const h = new Date().getHours();
    if (h < 11) return 'breakfast';
    if (h < 16) return 'lunch';
    if (h < 22) return 'dinner';
    return 'snacks';
}

export default function Dashboard({ today, totals, user, streak, getLast7Days, onWaterClick, onMealSlotClick, onStartWorkout, xp, selectedDate, onSelectDate }) {
    const days = getLast7Days();
    const calTarget = user.calorieTarget || 2000;
    const calPct = Math.min(totals.cals / calTarget, 1);
    const calCirc = 2 * Math.PI * 34;
    const waterGoal = user.waterGoal || 2.5;
    const waterPct = Math.min(today.water / waterGoal, 1);
    const [tapped, setTapped] = useState(false);
    const [showCheckIn, setShowCheckIn] = useState(false);

    const { state, logCheckIn } = useStore();
    const todayStr = new Date().toISOString().split('T')[0];
    const hasCheckedIn = state.checkIns?.some(c => c.date === todayStr);
    const currentSlot = getCurrentSlot();

    function tapWater() {
        setTapped(true);
        onWaterClick();
        setTimeout(() => setTapped(false), 300);
    }

    const xpProgress = getXPProgress(xp);

    return (
        <div className="dash-single-screen">
            {/* Top Bar: Calendar Strip ONLY */}
            <div className="d-top-bar">
                <CalendarStrip days={days} selectedDate={selectedDate} onSelect={onSelectDate} />
            </div>

            {/* Coach Feedback Banner */}
            {state.coachAdvice && state.coachAdvice.length > 0 && (
                <div className="d-coach-banner" style={{ background: 'var(--c-black)', color: 'var(--c-volt)', border: '2px solid var(--c-black)', borderRadius: 10, padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '2px 2px 0 var(--c-volt)', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <KenneyIcon name="star" size={16} tint="volt" />
                        <div>
                            <div style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase' }}>COACH TACTICAL FEEDBACK</div>
                            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.9 }}>"{state.coachAdvice[0].text}"</div>
                        </div>
                    </div>
                    <button className="btn btn-volt" style={{ fontSize: 9, padding: '4px 8px', borderRadius: 6, flexShrink: 0 }} onClick={() => store.applyCoachAdvice(state.coachAdvice[0].id)}>
                        APPLY
                    </button>
                </div>
            )}

            {/* Main Nutrition Hero Card */}
            <div className="d-hero-card card">
                <div className="d-hero-top">
                    {/* Calorie Ring */}
                    <div className="d-cal-ring-box" onClick={() => onMealSlotClick(currentSlot)}>
                        <div className="d-ring-svg-wrap">
                            <svg viewBox="0 0 76 76" className="d-ring-svg">
                                <circle cx="38" cy="38" r="34" stroke="rgba(0,0,0,0.08)" strokeWidth="7" fill="none" />
                                <circle cx="38" cy="38" r="34" stroke="var(--c-red)" strokeWidth="7" fill="none"
                                    strokeLinecap="round" strokeDasharray={calCirc} strokeDashoffset={calCirc - calPct * calCirc}
                                    transform="rotate(-90 38 38)" className="d-ring-anim" />
                            </svg>
                            <div className="d-ring-center">
                                <span className="d-ring-cals">{totals.cals}</span>
                                <span className="d-ring-target">/{calTarget}</span>
                            </div>
                        </div>
                    </div>

                    {/* Macro Fills */}
                    <div className="d-macros-col">
                        <div className="d-macro-row">
                            <div className="d-mr-hdr"><span>Protein</span><span>{totals.p}g / {user.macros.p}g</span></div>
                            <div className="d-mr-track protein"><div className="d-mr-fill protein" style={{ width: `${Math.min(totals.p / user.macros.p, 1) * 100}%` }} /></div>
                        </div>
                        <div className="d-macro-row">
                            <div className="d-mr-hdr"><span>Carbs</span><span>{totals.c}g / {user.macros.c}g</span></div>
                            <div className="d-mr-track carbs"><div className="d-mr-fill carbs" style={{ width: `${Math.min(totals.c / user.macros.c, 1) * 100}%` }} /></div>
                        </div>
                        <div className="d-macro-row">
                            <div className="d-mr-hdr"><span>Fats</span><span>{totals.f}g / {user.macros.f}g</span></div>
                            <div className="d-mr-track fats"><div className="d-mr-fill fats" style={{ width: `${Math.min(totals.f / user.macros.f, 1) * 100}%` }} /></div>
                        </div>
                    </div>
                </div>

                {/* Single Compact Log Food Button */}
                <button className="btn d-log-food-btn" onClick={() => onMealSlotClick(currentSlot)} style={{ marginTop: 12 }}>
                    <KenneyIcon name="plus" size={16} /> LOG FOOD
                </button>
            </div>

            {/* Vitals Grid: Water + Weight + Daily Check-In */}
            <div className="d-vitals-row">
                <div className={`d-vital-card water ${tapped ? 'pop' : ''}`} onClick={tapWater}>
                    <div className="d-vital-info">
                        <span className="d-vital-val">{today.water}L</span>
                        <span className="d-vital-lbl">WATER</span>
                    </div>
                    <div className="d-vital-add"><KenneyIcon name="plus" size={14} /></div>
                    <div className="d-vital-bg-bar" style={{ width: `${waterPct * 100}%` }} />
                </div>

                <div className="d-vital-card weight">
                    <div className="d-vital-info">
                        <span className="d-vital-val">{user.weight}kg</span>
                        <span className="d-vital-lbl">WEIGHT</span>
                    </div>
                    <div className="d-vital-add"><KenneyIcon name="plus" size={14} /></div>
                </div>

                <div className={`d-vital-card checkin ${hasCheckedIn ? 'done' : ''}`} onClick={() => !hasCheckedIn && setShowCheckIn(true)}>
                    <div className="d-vital-info">
                        <span className="d-vital-val">{hasCheckedIn ? 'DONE' : 'CHECK IN'}</span>
                        <span className="d-vital-lbl">+50 XP</span>
                    </div>
                    <div className="d-vital-add"><KenneyIcon name="star" size={14} tint={hasCheckedIn ? "green" : "black"} /></div>
                </div>
            </div>

            {/* Daily Battle Quests Widget */}
            <DailyQuests />

            {/* Level & XP Progress Card */}
            <div className="d-xp-card-compact">
                <div className="d-xp-info">
                    <KenneyIcon name="star" size={16} tint="volt" />
                    <span className="d-lvl-tag">LVL {xpProgress.level}</span>
                    <div className="d-xp-bar-bg">
                        <div className="d-xp-bar-fill" style={{ width: `${xpProgress.percentage}%` }} />
                    </div>
                    <span className="d-xp-vals">{Math.round(xpProgress.progress)} / {Math.round(xpProgress.needed)} XP</span>
                </div>
            </div>

            {/* Direct Start Session Hero Button with Kenney Fist Icon */}
            <button className="d-action-hero" onClick={() => onStartWorkout()}>
                <div className="d-ah-content">
                    <div className="d-ah-icon">
                        <KenneyIcon name="fist" size={22} tint="volt" />
                    </div>
                    <div className="d-ah-text">
                        <div className="d-ah-title">START WORKOUT SESSION</div>
                    </div>
                </div>
                <div className="d-ah-arrow"><KenneyIcon name="arrowRight" size={16} tint="volt" /></div>
            </button>

            {/* Check In Modal */}
            {showCheckIn && (
                <CheckInModal 
                    onClose={() => setShowCheckIn(false)}
                    onConfirm={(photo) => {
                        logCheckIn(photo);
                        setShowCheckIn(false);
                    }}
                />
            )}
        </div>
    );
}
