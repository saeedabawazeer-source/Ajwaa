import './HeroCard.css';

export default function HeroCard({ cals, goal, macros, macroGoals }) {
    const pct = Math.min((cals / goal) * 100, 100);
    const remaining = Math.max(0, goal - cals);
    const circumference = 2 * Math.PI * 42;
    const offset = circumference - (pct / 100) * circumference;

    return (
        <div className="card hero-card">
            <div className="hero-ring-section">
                <svg viewBox="0 0 100 100" className="hero-ring-svg">
                    <circle cx="50" cy="50" r="42" stroke="rgba(0,0,0,0.06)" strokeWidth="7" fill="none" />
                    <circle cx="50" cy="50" r="42" stroke="var(--c-red)" strokeWidth="7" fill="none"
                        strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                        transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
                </svg>
                <div className="hero-ring-text">
                    <div className="hero-ring-cals">{remaining}</div>
                    <div className="hero-ring-label">left</div>
                </div>
            </div>
            <div className="hero-right">
                <div className="hero-eaten">
                    <span className="hero-eaten-num">{cals}</span>
                    <span className="hero-eaten-label">/ {goal} kcal</span>
                </div>
                <div className="hero-pcf-row">
                    {[
                        { label: 'P', val: macros.p, goal: macroGoals.p, color: '#FFD700' },
                        { label: 'C', val: macros.c, goal: macroGoals.c, color: '#00BFFF' },
                        { label: 'F', val: macros.f, goal: macroGoals.f, color: '#FF4500' },
                    ].map(m => (
                        <div key={m.label} className="pcf-chip">
                            <span className="pcf-letter" style={{ color: m.color }}>{m.label}</span>
                            <span className="pcf-val">{m.val}</span>
                            <span className="pcf-goal">/{m.goal}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
