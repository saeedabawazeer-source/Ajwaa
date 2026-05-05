import './BodyMap.css';

const MUSCLE_GROUPS = {
    push: { label: 'PUSH DAY', muscles: 'Chest · Shoulders · Triceps', color: 'var(--c-red)' },
    pull: { label: 'PULL DAY', muscles: 'Back · Biceps · Rear Delts', color: '#3B82F6' },
    legs: { label: 'LEG DAY', muscles: 'Quads · Hamstrings · Glutes · Calves', color: 'var(--c-volt)' },
    upper: { label: 'UPPER BODY', muscles: 'Chest · Back · Shoulders · Arms', color: '#FF9800' },
    full_body: { label: 'FULL BODY', muscles: 'All Major Muscle Groups', color: 'var(--c-green)' },
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
                <div className={`bm-label-item ${isPush ? 'lit push' : ''}`}>
                    <span className="bm-label-line" />
                    <span className="bm-label-text">Chest</span>
                </div>
                <div className={`bm-label-item ${isPull ? 'lit pull' : ''}`}>
                    <span className="bm-label-line" />
                    <span className="bm-label-text">Back</span>
                </div>
                <div className={`bm-label-item ${isLegs ? 'lit legs' : ''}`}>
                    <span className="bm-label-line" />
                    <span className="bm-label-text">Quads</span>
                </div>
            </div>

            {/* SVG Body — smooth anatomical silhouette */}
            <div className="bm-body">
                <svg viewBox="0 0 200 440" className="bm-svg">
                    {/* Head */}
                    <ellipse cx="100" cy="36" rx="22" ry="26" className="bm-bone" />
                    {/* Neck */}
                    <path d="M 90 60 Q 90 72 88 76 L 112 76 Q 110 72 110 60" className="bm-bone" />

                    {/* Shoulders / Traps */}
                    <path d="M 88 76 Q 60 78 46 90 L 46 102 Q 62 92 88 90 Z"
                        className={`bm-muscle ${isPush || isPull ? 'push' : ''}`} />
                    <path d="M 112 76 Q 140 78 154 90 L 154 102 Q 138 92 112 90 Z"
                        className={`bm-muscle ${isPush || isPull ? 'push' : ''}`} />

                    {/* Chest */}
                    <path d="M 72 90 Q 68 96 68 110 Q 72 118 86 120 L 100 122 L 114 120 Q 128 118 132 110 Q 132 96 128 90 Z"
                        className={`bm-muscle ${isPush ? 'push' : ''}`} />

                    {/* Lats / Back */}
                    <path d="M 66 110 Q 62 120 62 140 Q 64 150 70 155 L 70 118 Z"
                        className={`bm-muscle ${isPull ? 'pull' : ''}`} />
                    <path d="M 134 110 Q 138 120 138 140 Q 136 150 130 155 L 130 118 Z"
                        className={`bm-muscle ${isPull ? 'pull' : ''}`} />

                    {/* Core / Abs */}
                    <path d="M 78 122 L 122 122 Q 124 150 122 175 L 78 175 Q 76 150 78 122 Z"
                        className={`bm-muscle ${isCore ? 'core' : ''}`} rx="4" />

                    {/* Left Upper Arm */}
                    <path d="M 46 102 Q 38 108 32 130 Q 28 148 30 158 Q 36 162 44 158 Q 48 140 50 120 Z"
                        className={`bm-muscle ${isPush || isPull ? 'push' : ''}`} />
                    {/* Left Forearm */}
                    <path d="M 30 160 Q 26 180 22 200 Q 20 212 22 218 Q 28 220 34 216 Q 36 196 38 176 Z"
                        className="bm-bone" />
                    {/* Left Hand */}
                    <ellipse cx="24" cy="226" rx="8" ry="12" className="bm-bone" />

                    {/* Right Upper Arm */}
                    <path d="M 154 102 Q 162 108 168 130 Q 172 148 170 158 Q 164 162 156 158 Q 152 140 150 120 Z"
                        className={`bm-muscle ${isPush || isPull ? 'push' : ''}`} />
                    {/* Right Forearm */}
                    <path d="M 170 160 Q 174 180 178 200 Q 180 212 178 218 Q 172 220 166 216 Q 164 196 162 176 Z"
                        className="bm-bone" />
                    {/* Right Hand */}
                    <ellipse cx="176" cy="226" rx="8" ry="12" className="bm-bone" />

                    {/* Pelvis / Hips */}
                    <path d="M 76 176 L 124 176 Q 128 192 124 206 L 76 206 Q 72 192 76 176 Z"
                        className="bm-bone" />

                    {/* Left Thigh */}
                    <path d="M 76 208 Q 70 230 68 260 Q 66 280 68 296 Q 76 300 82 296 Q 84 270 86 240 Q 88 220 90 208 Z"
                        className={`bm-muscle ${isLegs ? 'legs' : ''}`} />
                    {/* Right Thigh */}
                    <path d="M 124 208 Q 130 230 132 260 Q 134 280 132 296 Q 124 300 118 296 Q 116 270 114 240 Q 112 220 110 208 Z"
                        className={`bm-muscle ${isLegs ? 'legs' : ''}`} />

                    {/* Left Calf */}
                    <path d="M 68 300 Q 64 320 62 350 Q 62 370 64 380 Q 72 384 78 380 Q 80 360 80 340 Q 80 316 82 300 Z"
                        className={`bm-muscle ${isLegs ? 'legs' : ''}`} />
                    {/* Right Calf */}
                    <path d="M 132 300 Q 136 320 138 350 Q 138 370 136 380 Q 128 384 122 380 Q 120 360 120 340 Q 120 316 118 300 Z"
                        className={`bm-muscle ${isLegs ? 'legs' : ''}`} />

                    {/* Feet */}
                    <path d="M 56 382 Q 54 394 56 400 L 80 400 Q 82 394 80 382 Z" className="bm-bone" />
                    <path d="M 120 382 Q 118 394 120 400 L 144 400 Q 146 394 144 382 Z" className="bm-bone" />
                </svg>
            </div>

            {/* Right labels */}
            <div className="bm-labels bm-labels-right">
                <div className={`bm-label-item ${isPush ? 'lit push' : ''}`}>
                    <span className="bm-label-text">Shoulders</span>
                    <span className="bm-label-line" />
                </div>
                <div className={`bm-label-item ${isPush || isPull ? 'lit push' : ''}`}>
                    <span className="bm-label-text">Arms</span>
                    <span className="bm-label-line" />
                </div>
                <div className={`bm-label-item ${isLegs ? 'lit legs' : ''}`}>
                    <span className="bm-label-text">Calves</span>
                    <span className="bm-label-line" />
                </div>
            </div>

            {/* Bottom info strip */}
            {info && (
                <div className="bm-info-badge">
                    <div className="bm-info-dot" style={{ background: info.color }} />
                    <div>
                        <div className="bm-info-label">{info.label}</div>
                        <div className="bm-info-muscles">{info.muscles}</div>
                    </div>
                </div>
            )}
            {!info && (
                <div className="bm-info-badge rest-badge">
                    <div className="bm-info-dot" style={{ background: 'rgba(255,255,255,0.2)' }} />
                    <div>
                        <div className="bm-info-label">REST DAY</div>
                        <div className="bm-info-muscles">Recovery is growth</div>
                    </div>
                </div>
            )}
        </div>
    );
}
