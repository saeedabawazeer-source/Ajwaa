import './ActionSheet.css';
import KenneyIcon from './KenneyIcon';

export default function ActionSheet({ open, onClose, onLogFood, onLogWorkout, onLogWater }) {
    if (!open) return null;

    // Icon mapping
    const icons = {
        breakfast: <KenneyIcon name="food" size={24} />,
        lunch: <KenneyIcon name="food" size={24} />,
        dinner: <KenneyIcon name="food" size={24} />,
        snacks: <KenneyIcon name="food" size={24} />,
        workout: <KenneyIcon name="workout" size={24} />,
        water: <KenneyIcon name="plus" size={24} />
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
