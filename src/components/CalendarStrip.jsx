import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import './CalendarStrip.css';

export default function CalendarStrip({ days, selectedDate, onSelect }) {
    return (
        <div className="calendar-strip">
            {days.map((d, i) => {
                // Mock activity visualization
                // If activity > 0, show filled style. If 0 and past, show dot.
                const hasData = d.activity > 0;
                const isFuture = !d.isToday && new Date(d.key) > new Date();
                const isSelected = d.key === selectedDate;

                return (
                    <div key={i}
                        className={`cal-day ${d.isToday ? 'cal-today' : ''} ${isSelected ? 'cal-selected' : ''} ${isFuture ? 'cal-future' : ''} ${hasData ? 'cal-data' : ''}`}
                        onClick={() => !isFuture && onSelect && onSelect(d.key)}
                    >
                        <span className="cal-label">{d.day}</span>
                        <div className="cal-indicator">
                            <span className="cal-num">{d.fullDate}</span>
                            {/* Ring/Dot overlay */}
                            {hasData && (
                                <svg className="cal-ring" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="16" fill="none" strokeWidth="3" stroke="#E5E7EB" />
                                    <circle cx="18" cy="18" r="16" fill="none" strokeWidth="3" stroke={d.activity > 90 ? 'var(--c-volt)' : 'var(--c-blue)'}
                                        strokeDasharray="100" strokeDashoffset={100 - d.activity} strokeLinecap="round" transform="rotate(-90 18 18)" />
                                </svg>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
