import './ActionSheet.css';
import { getMealSlotLabel } from '../utils/helpers';
import { Coffee, Sun, Moon, Utensils, Accessibility, Droplets } from 'lucide-react'; // Example mapping

export default function ActionSheet({ open, onClose, onLogFood, onLogWorkout, onLogWater }) {
    if (!open) return null;

    // Icon mapping
    const icons = {
        breakfast: <Coffee size={24} />,
        lunch: <Sun size={24} />,
        dinner: <Moon size={24} />,
        snacks: <Utensils size={24} />,
        workout: <Accessibility size={24} />, // or Dumbbell if available
        water: <Droplets size={24} />
    };

    return (
        <div className="sheet-overlay" onClick={onClose}>
            <div className="sheet-card" onClick={e => e.stopPropagation()}>
                <div className="sheet-handle" />
                <div className="sheet-title">QUICK ADD</div>
                <div className="sheet-grid">
                    <button className="sheet-btn" onClick={() => onLogFood('breakfast')}>
                        <span className="sheet-icon">{icons.breakfast}</span>
                        <span className="sheet-label">BREAKFAST</span>
                    </button>
                    <button className="sheet-btn" onClick={() => onLogFood('lunch')}>
                        <span className="sheet-icon">{icons.lunch}</span>
                        <span className="sheet-label">LUNCH</span>
                    </button>
                    <button className="sheet-btn" onClick={() => onLogFood('dinner')}>
                        <span className="sheet-icon">{icons.dinner}</span>
                        <span className="sheet-label">DINNER</span>
                    </button>
                    <button className="sheet-btn" onClick={() => onLogFood('snacks')}>
                        <span className="sheet-icon">{icons.snacks}</span>
                        <span className="sheet-label">SNACKS</span>
                    </button>
                    <button className="sheet-btn btn-action-volt" onClick={onLogWorkout}>
                        <span className="sheet-icon">{icons.workout}</span>
                        <span className="sheet-label">WORKOUT</span>
                    </button>
                    <button className="sheet-btn btn-action-blue" onClick={onLogWater}>
                        <span className="sheet-icon">{icons.water}</span>
                        <span className="sheet-label">WATER</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
