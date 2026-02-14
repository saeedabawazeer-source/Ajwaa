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
                    <circle cx="50" cy="50" r="42" stroke="rgba(0,0,0,0.08)" strokeWidth="8" fill="none" />
                    <circle cx="50" cy="50" r="42" stroke="var(--c-red)" strokeWidth="8" fill="none"
                        strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                        transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
                </svg>
                <div className="hero-ring-text">
                    <div style={{ fontWeight: 900, fontSize: 20, lineHeight: 1 }}>{cals}</div>
                    <div className="text-label" style={{ fontSize: 9 }}>/ {goal}</div>
                </div>
            </div>
            <div className="hero-right">
                <div className="hero-remaining">
                    <span style={{ fontWeight: 900, fontSize: 20 }}>{remaining}</span>
                    <span className="text-label">KCAL LEFT</span>
                </div>
                <div className="hero-macros">
                    {[
                        { label: 'P', val: macros.p, goal: macroGoals.p, color: '#FFD700' },
                        { label: 'C', val: macros.c, goal: macroGoals.c, color: '#00BFFF' },
                        { label: 'F', val: macros.f, goal: macroGoals.f, color: '#FF4500' },
                    ].map(m => (
                        <div key={m.label} className="hero-macro">
                            <div className="hero-macro-label" style={{ color: m.color }}>{m.label}</div>
                            <div className="hero-macro-bar">
                                <div className="hero-macro-fill" style={{ width: `${Math.min((m.val / m.goal) * 100, 100)}%`, background: m.color }} />
                            </div>
                            <div className="hero-macro-val">{m.val}/{m.goal}g</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
