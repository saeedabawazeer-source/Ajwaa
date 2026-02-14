import './DailyLogFeed.css';

export default function DailyLogFeed({ logs }) {
    if (!logs || logs.length === 0) {
        return <div className="daily-log-feed"><div className="text-label" style={{ textAlign: 'center', marginTop: 20, opacity: 0.5 }}>No activity yet today</div></div>;
    }

    function getIconBg(type) {
        if (type === 'food') return 'var(--c-red-light)';
        if (type === 'water') return 'var(--c-volt)';
        return 'white';
    }

    function getSubtext(log) {
        if (log.type === 'workout' && log.exercises && log.exercises.length > 0) {
            const first = log.exercises[0];
            const more = log.exercises.length > 1 ? ` +${log.exercises.length - 1} more` : '';
            return `${first.name}: ${first.sets}x${first.reps} @ ${first.weight}kg${more}`;
        }
        return log.value || '';
    }

    return (
        <div className="daily-log-feed">
            {logs.map((log, i) => (
                <div key={i} className="log-item">
                    <div className="log-time">{log.time}</div>
                    <div className="log-icon" style={{ background: getIconBg(log.type) }}>{log.icon}</div>
                    <div style={{ flex: 1 }}>
                        <div className="log-title">{log.title}</div>
                        <div className="text-label" style={{ fontSize: 10 }}>{getSubtext(log)}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
