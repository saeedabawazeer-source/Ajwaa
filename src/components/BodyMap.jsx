import './BodyMap.css';

export default function BodyMap({ highlight = null }) {
    // highlight can be: 'push', 'pull', 'legs', 'upper', 'full_body'

    const isPush = highlight === 'push' || highlight === 'upper' || highlight === 'full_body';
    const isPull = highlight === 'pull' || highlight === 'upper' || highlight === 'full_body';
    const isLegs = highlight === 'legs' || highlight === 'full_body';

    return (
        <div className="body-map-container">
            <svg viewBox="0 0 200 400" className="body-map-svg">
                {/* Background Shadow Grid (Neo-brutalist touch) */}
                <rect x="0" y="0" width="200" height="400" fill="transparent" />

                {/* Head */}
                <rect x="80" y="20" width="40" height="40" className="bm-part" rx="4" />
                
                {/* Neck */}
                <rect x="90" y="62" width="20" height="15" className="bm-part" />

                {/* Shoulders (Push/Pull) */}
                <path d="M 50 79 L 150 79 L 150 100 L 50 100 Z" className={`bm-part ${isPush ? 'bm-highlight-push' : ''} ${isPull ? 'bm-highlight-pull' : ''}`} />

                {/* Chest (Push) */}
                <rect x="70" y="102" width="60" height="40" className={`bm-part ${isPush ? 'bm-highlight-push' : ''}`} rx="2" />
                
                {/* Core/Abs (Core - maybe full body) */}
                <rect x="75" y="144" width="50" height="45" className={`bm-part ${highlight === 'full_body' ? 'bm-highlight-core' : ''}`} rx="2" />

                {/* Lats/Back (Pull) - Behind torso visual representation */}
                <path d="M 60 102 L 70 102 L 70 160 L 65 160 Z" className={`bm-part ${isPull ? 'bm-highlight-pull' : ''}`} />
                <path d="M 130 102 L 140 102 L 135 160 L 130 160 Z" className={`bm-part ${isPull ? 'bm-highlight-pull' : ''}`} />

                {/* Upper Arms (Biceps/Triceps) */}
                {/* Left Arm */}
                <rect x="40" y="102" width="25" height="50" className={`bm-part ${isPush ? 'bm-highlight-push' : ''} ${isPull ? 'bm-highlight-pull' : ''}`} rx="4" />
                {/* Right Arm */}
                <rect x="135" y="102" width="25" height="50" className={`bm-part ${isPush ? 'bm-highlight-push' : ''} ${isPull ? 'bm-highlight-pull' : ''}`} rx="4" />

                {/* Forearms */}
                <rect x="35" y="154" width="20" height="45" className="bm-part" rx="4" />
                <rect x="145" y="154" width="20" height="45" className="bm-part" rx="4" />

                {/* Pelvis */}
                <path d="M 70 191 L 130 191 L 120 220 L 80 220 Z" className="bm-part" />

                {/* Thighs (Quads/Hamstrings - Legs) */}
                <rect x="72" y="222" width="25" height="70" className={`bm-part ${isLegs ? 'bm-highlight-legs' : ''}`} rx="4" />
                <rect x="103" y="222" width="25" height="70" className={`bm-part ${isLegs ? 'bm-highlight-legs' : ''}`} rx="4" />

                {/* Calves (Legs) */}
                <rect x="74" y="294" width="20" height="60" className={`bm-part ${isLegs ? 'bm-highlight-legs' : ''}`} rx="3" />
                <rect x="106" y="294" width="20" height="60" className={`bm-part ${isLegs ? 'bm-highlight-legs' : ''}`} rx="3" />

                {/* Feet */}
                <path d="M 65 356 L 94 356 L 94 370 L 60 370 Z" className="bm-part" />
                <path d="M 106 356 L 135 356 L 140 370 L 106 370 Z" className="bm-part" />
            </svg>
        </div>
    );
}
