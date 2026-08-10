import './CalendarStrip.css';
import KenneyIcon from './KenneyIcon';

export default function CalendarStrip({ days, selectedDate, onSelect }) {
    return (
        <div className="calendar-strip">
            {days.map((d, i) => {
                const isSelected = selectedDate === d.key;
                const hasData = d.cals > 0 || d.water > 0 || d.workouts > 0;
                
                return (
                    <div 
                        key={i} 
                        className={`cal-day ${isSelected ? 'cal-selected' : ''} ${d.isToday ? 'cal-today' : ''} ${hasData ? 'cal-data' : ''}`} 
                        onClick={() => onSelect(d.key)}
                    >
                        <span className="cal-label">{d.day}</span>
                        <div className="cal-indicator">
                            <span className="cal-num">{d.fullDate}</span>
                            {isSelected && (
                                <svg className="cal-ring" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="16" fill="var(--c-volt)" stroke="var(--c-black)" strokeWidth="2.5" />
                                </svg>
                            )}
                            {!isSelected && hasData && (
                                <svg className="cal-ring" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2.5" />
                                    <circle cx="18" cy="18" r="16" fill="none" stroke="var(--c-red)" strokeWidth="2.5" 
                                        strokeDasharray="100.5" 
                                        strokeDashoffset={100.5 - ((d.activity || 0) / 100) * 100.5} 
                                        strokeLinecap="round" />
                                </svg>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
