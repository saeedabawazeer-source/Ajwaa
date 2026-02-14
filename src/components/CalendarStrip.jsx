import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import './CalendarStrip.css';

export default function CalendarStrip({ days }) {
    return (
        <div className="calendar-strip">
            {days.map((d, i) => (
                <div key={i} className={`cal-day ${d.isToday ? 'cal-today' : ''}`}>
                    <span className="cal-label">{d.day}</span>
                    <span className="cal-num">{d.fullDate}</span>
                    {d.isToday && <div className="cal-dot" />}
                </div>
            ))}
        </div>
    );
}
