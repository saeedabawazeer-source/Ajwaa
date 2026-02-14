import CalendarStrip from '../components/CalendarStrip';
import HeroCard from '../components/HeroCard';
import { getAIMessage, getMealSlotEmoji } from '../utils/helpers';
import { Plus, Coffee, Sun, Moon, Utensils, Droplets } from 'lucide-react'; // Icons
import './Dashboard.css';

const SLOTS = ['breakfast', 'lunch', 'dinner', 'snacks'];

// Helper for slot icons
function SlotIcon({ slot }) {
    if (slot === 'breakfast') return <Coffee size={20} />;
    if (slot === 'lunch') return <Sun size={20} />;
    if (slot === 'dinner') return <Moon size={20} />;
    return <Utensils size={20} />;
}

export default function Dashboard({ today, totals, user, streak, getLast7Days, onWaterClick, onMealSlotClick, onRemoveMeal }) {
    const days = getLast7Days();
    const calsLeft = Math.max(0, user.calorieTarget - totals.cals);
    const aiMsg = getAIMessage(totals.cals, user.calorieTarget, (today.meals.breakfast || []).length);

    return (
        <div className="view-section">
            <CalendarStrip days={days} />

            <div className="ai-insight">
                <div style={{ fontWeight: 800, fontSize: 11, opacity: 0.6, marginBottom: 4 }}>
                    <Sparkles size={12} style={{ display: 'inline', marginRight: 4 }} />
                    AI COACH
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.4 }}>{aiMsg}</div>
            </div>

            <HeroCard cals={totals.cals} goal={user.calorieTarget} macros={{ p: totals.p, c: totals.c, f: totals.f }} macroGoals={user.macros} />

            <div className="stat-grid">
                <div className="card mini-stat">
                    <div className="stat-row-top">
                        <div className="stat-icon"><Dumbbell size={14} /></div>
                        <div className="text-label">WORKOUTS</div>
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 900 }}>{today.workouts ? today.workouts.length : 0}</div>
                </div>
                <div className="card mini-stat water-card" onClick={onWaterClick}>
                    <div className="stat-row-top">
                        <div className="stat-icon"><Droplets size={14} /></div>
                        <div className="text-label">WATER</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <div style={{ fontSize: 24, fontWeight: 900 }}>{today.water}L</div>
                        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.5 }}>/ {user.waterGoal}L</div>
                    </div>
                    <div className="water-fill-container">
                        <div className="water-fill-bar" style={{ width: `${Math.min((today.water / user.waterGoal) * 100, 100)}%` }} />
                    </div>
                </div>
            </div>

            <div className="meal-slots">
                {SLOTS.map(slot => {
                    const items = today.meals[slot] || [];
                    const slotCals = items.reduce((sum, i) => sum + i.cals, 0);
                    return (
                        <div key={slot} className="card meal-slot" onClick={() => onMealSlotClick(slot)}>
                            <div className="meal-slot-left">
                                <div className="meal-slot-icon-box"><SlotIcon slot={slot} /></div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: 14, textTransform: 'capitalize' }}>{slot}</div>
                                    <div className="text-label" style={{ fontSize: 10 }}>
                                        {items.length === 0 ? 'TAP TO ADD' : `${items.length} ITEMS`}
                                    </div>
                                </div>
                            </div>
                            <div className="meal-slot-right">
                                {slotCals > 0 && <div style={{ fontWeight: 800, fontSize: 14 }}>{slotCals}</div>}
                                <div className="meal-slot-add"><Plus size={16} /></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
