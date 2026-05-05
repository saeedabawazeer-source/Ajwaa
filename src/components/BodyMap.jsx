import './BodyMap.css';

// Muscle group metadata for labels
const MUSCLE_GROUPS = {
    push: { label: 'PUSH', muscles: 'Chest · Shoulders · Triceps', emoji: '🦁', color: 'var(--c-red)' },
    pull: { label: 'PULL', muscles: 'Back · Biceps · Rear Delts', emoji: '🦅', color: '#3B82F6' },
    legs: { label: 'LEGS', muscles: 'Quads · Hamstrings · Glutes · Calves', emoji: '🦖', color: 'var(--c-volt)' },
    upper: { label: 'UPPER', muscles: 'Chest · Back · Shoulders · Arms', emoji: '⚔️', color: '#FF9800' },
    full_body: { label: 'FULL BODY', muscles: 'All Major Muscle Groups', emoji: '🔥', color: 'var(--c-green)' },
};

export default function BodyMap({ highlight = null }) {
    const isPush = highlight === 'push' || highlight === 'upper' || highlight === 'full_body';
    const isPull = highlight === 'pull' || highlight === 'upper' || highlight === 'full_body';
    const isLegs = highlight === 'legs' || highlight === 'full_body';
    const isCore = highlight === 'full_body';
    const info = highlight ? MUSCLE_GROUPS[highlight] : null;

    return (
        <div className={`bm-wrapper ${highlight ? 'active' : 'rest'}`}>
            {/* Left labels */}
            <div className="bm-labels bm-labels-left">
                <div className={`bm-label-item ${isPush ? 'lit' : ''}`}>
                    <span className="bm-label-line" />
                    <span className="bm-label-text">Chest</span>
                </div>
                <div className={`bm-label-item ${isPull ? 'lit' : ''}`}>
                    <span className="bm-label-line" />
                    <span className="bm-label-text">Back</span>
                </div>
                <div className={`bm-label-item ${isLegs ? 'lit' : ''}`}>
                    <span className="bm-label-line" />
                    <span className="bm-label-text">Quads</span>
                </div>
            </div>

            {/* SVG Body */}
            <div className="bm-body">
                <svg viewBox="0 0 120 280" className="bm-svg">
                    {/* Head */}
                    <ellipse cx="60" cy="22" rx="14" ry="16" className="bm-bone" />
                    {/* Neck */}
                    <rect x="53" y="38" width="14" height="10" className="bm-bone" rx="2" />

                    {/* Trapezius / Shoulders */}
                    <path d="M 30 50 Q 35 46 53 48 L 67 48 Q 85 46 90 50 L 90 60 L 30 60 Z"
                        className={`bm-muscle ${isPush || isPull ? 'push' : ''}`} />

                    {/* Chest */}
                    <path d="M 38 60 L 82 60 Q 84 72 78 78 L 42 78 Q 36 72 38 60 Z"
                        className={`bm-muscle ${isPush ? 'push' : ''}`} />

                    {/* Back (lats - side strips) */}
                    <rect x="32" y="60" width="8" height="40" rx="3"
                        className={`bm-muscle ${isPull ? 'pull' : ''}`} />
                    <rect x="80" y="60" width="8" height="40" rx="3"
                        className={`bm-muscle ${isPull ? 'pull' : ''}`} />

                    {/* Core */}
                    <rect x="42" y="80" width="36" height="32" rx="3"
                        className={`bm-muscle ${isCore ? 'core' : ''}`} />

                    {/* Left Arm (upper) */}
                    <rect x="16" y="55" width="16" height="36" rx="6"
                        className={`bm-muscle ${isPush || isPull ? 'push' : ''}`} />
                    {/* Left Forearm */}
                    <rect x="12" y="93" width="14" height="32" rx="5" className="bm-bone" />

                    {/* Right Arm (upper) */}
                    <rect x="88" y="55" width="16" height="36" rx="6"
                        className={`bm-muscle ${isPush || isPull ? 'push' : ''}`} />
                    {/* Right Forearm */}
                    <rect x="94" y="93" width="14" height="32" rx="5" className="bm-bone" />

                    {/* Pelvis */}
                    <path d="M 40 114 L 80 114 L 74 130 L 46 130 Z" className="bm-bone" />

                    {/* Left Thigh */}
                    <rect x="42" y="132" width="16" height="52" rx="6"
                        className={`bm-muscle ${isLegs ? 'legs' : ''}`} />
                    {/* Right Thigh */}
                    <rect x="62" y="132" width="16" height="52" rx="6"
                        className={`bm-muscle ${isLegs ? 'legs' : ''}`} />

                    {/* Left Calf */}
                    <rect x="43" y="188" width="13" height="44" rx="5"
                        className={`bm-muscle ${isLegs ? 'legs' : ''}`} />
                    {/* Right Calf */}
                    <rect x="64" y="188" width="13" height="44" rx="5"
                        className={`bm-muscle ${isLegs ? 'legs' : ''}`} />

                    {/* Feet */}
                    <ellipse cx="49" cy="238" rx="9" ry="5" className="bm-bone" />
                    <ellipse cx="71" cy="238" rx="9" ry="5" className="bm-bone" />
                </svg>
            </div>

            {/* Right labels */}
            <div className="bm-labels bm-labels-right">
                <div className={`bm-label-item ${isPush ? 'lit' : ''}`}>
                    <span className="bm-label-text">Shoulders</span>
                    <span className="bm-label-line" />
                </div>
                <div className={`bm-label-item ${isPush || isPull ? 'lit' : ''}`}>
                    <span className="bm-label-text">Arms</span>
                    <span className="bm-label-line" />
                </div>
                <div className={`bm-label-item ${isLegs ? 'lit' : ''}`}>
                    <span className="bm-label-text">Calves</span>
                    <span className="bm-label-line" />
                </div>
            </div>

            {/* Bottom label badge */}
            {info && (
                <div className="bm-info-badge">
                    <span className="bm-info-emoji">{info.emoji}</span>
                    <div>
                        <div className="bm-info-label">{info.label}</div>
                        <div className="bm-info-muscles">{info.muscles}</div>
                    </div>
                </div>
            )}
            {!info && (
                <div className="bm-info-badge rest-badge">
                    <span className="bm-info-emoji">😴</span>
                    <div>
                        <div className="bm-info-label">REST DAY</div>
                        <div className="bm-info-muscles">Recovery is growth</div>
                    </div>
                </div>
            )}
        </div>
    );
}
