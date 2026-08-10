import React from 'react';
import './MonsterFaceSVG.css';

// ─── Helper for Smooth Opacity Transitions ───
const FeatureGroup = ({ visible, children }) => (
    <g
        style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            pointerEvents: visible ? 'auto' : 'none' // Prevent interaction with hidden layers
        }}
    >
        {children}
    </g>
);

const Glint = ({ cx, cy }) => <circle cx={cx} cy={cy} r="2.5" fill="white" opacity="0.9" />;
const Star = ({ cx, cy }) => (
    <g transform={`translate(${cx}, ${cy}) scale(0.9)`}>
        <path
            className="monster-star"
            style={{ '--cx': cx + 'px', '--cy': cy + 'px' }}
            fill="black"
            d="M 0,-10 L 2,-2 L 10,0 L 2,2 L 0,10 L -2,2 L -10,0 L -2,-2 Z"
        />
        {/* White sparkle glint */}
        <circle cx="2" cy="-3" r="2" fill="white" opacity="0.9" />
    </g>
);
const Heart = ({ cx, cy }) => (
    <path
        transform={`translate(${cx}, ${cy}) scale(0.9)`}
        fill="#FFF" stroke="black" strokeWidth="2"
        d="M 0,5 L -5,0 Q -7,-2 -5,-4 Q -3,-6 0,-2 Q 3,-6 5,-4 Q 7,-2 5,0 Z"
    />
);

// ─── Eye Variants ───
const Eyes = ({ mood }) => {
    return (
        <g>
            {/* 1. Neutral / Default (Black Bead + Glint) */}
            <FeatureGroup visible={mood === 'neutral' || !mood}>
                <g className="monster-eyes-idle">
                    <ellipse cx="30" cy="30" rx="6" ry="10" fill="black" />
                    <Glint cx="32" cy="26" />
                    <ellipse cx="70" cy="30" rx="6" ry="10" fill="black" />
                    <Glint cx="72" cy="26" />
                </g>
            </FeatureGroup>

            {/* 2. Happy / Laugh / Wave (Arcs) */}
            <FeatureGroup visible={['happy', 'laugh', 'wave'].includes(mood)}>
                <g fill="none" stroke="black" strokeWidth="4" strokeLinecap="round">
                    <path d="M 20 35 Q 30 20 40 35" />
                    <path d="M 60 35 Q 70 20 80 35" />
                </g>
            </FeatureGroup>

            {/* 3. Excited / Amazed (Black Stars + White Glint) */}
            <FeatureGroup visible={['excited', 'amazed'].includes(mood)}>
                <g className="monster-eyes-idle">
                    <Star cx="30" cy="30" />
                    <Star cx="70" cy="30" />
                </g>
            </FeatureGroup>

            {/* 4. Mad / Beast (Slanted Black + Glint) */}
            <FeatureGroup visible={['beast', 'mad'].includes(mood)}>
                <path d="M 18 18 L 42 28" stroke="black" strokeWidth="3" strokeLinecap="round" />
                <path d="M 82 18 L 58 28" stroke="black" strokeWidth="3" strokeLinecap="round" />
                <g className="monster-eyes-idle">
                    <ellipse cx="30" cy="32" rx="6" ry="9" fill="black" />
                    <Glint cx="32" cy="28" />
                    <ellipse cx="70" cy="32" rx="6" ry="9" fill="black" />
                    <Glint cx="72" cy="28" />
                </g>
            </FeatureGroup>

            {/* 5. Crying / Sad (Arched Down) */}
            <FeatureGroup visible={['crying', 'sad'].includes(mood)}>
                <path d="M 22 30 Q 30 20 38 30" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
                <path d="M 62 30 Q 70 20 78 30" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
                <path className="monster-tear" d="M 30 35 Q 25 45 30 55" stroke="#4FC3F7" strokeWidth="3" fill="none" />
                <path className="monster-tear-r" d="M 70 35 Q 75 45 70 55" stroke="#4FC3F7" strokeWidth="3" fill="none" />
            </FeatureGroup>

            {/* 6. Shocked (Small Black Beads) */}
            <FeatureGroup visible={mood === 'shocked'}>
                <g className="monster-eyes-idle">
                    <circle cx="30" cy="30" r="5" fill="black" />
                    <Glint cx="31" cy="28" />
                    <circle cx="70" cy="30" r="5" fill="black" />
                    <Glint cx="71" cy="28" />
                </g>
            </FeatureGroup>

            {/* 7. Confused (Uneven Black + Glint) */}
            <FeatureGroup visible={mood === 'confused'}>
                <path d="M 20 18 L 40 22" stroke="black" strokeWidth="2" /> {/* Raised Brow */}
                <g className="monster-eyes-idle">
                    <circle cx="30" cy="30" r="8" fill="black" />
                    <Glint cx="33" cy="26" />
                    <circle cx="70" cy="30" r="5" fill="black" />
                    <Glint cx="72" cy="28" />
                </g>
            </FeatureGroup>

            {/* 8. Love (White Hearts) */}
            <FeatureGroup visible={mood === 'love'}>
                <Heart cx="30" cy="30" />
                <Heart cx="70" cy="30" />
            </FeatureGroup>

            {/* 9. Sleepy (Closed flat) */}
            <FeatureGroup visible={mood === 'sleepy'}>
                <path d="M 20 35 L 40 35" stroke="black" strokeWidth="4" strokeLinecap="round" />
                <path d="M 60 35 L 80 35" stroke="black" strokeWidth="4" strokeLinecap="round" />
                <text x="80" y="20" fontSize="12" fill="black" style={{ animation: 'sparkle-spin 3s infinite' }}>Z</text>
            </FeatureGroup>

            {/* 10. Cool (Sunglasses - Rounded) */}
            <FeatureGroup visible={mood === 'cool'}>
                <ellipse cx="30" cy="30" rx="14" ry="10" fill="black" stroke="#333" strokeWidth="2" />
                <ellipse cx="70" cy="30" rx="14" ry="10" fill="black" stroke="#333" strokeWidth="2" />
                <path d="M 44 28 Q 50 24 56 28" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="16" y1="28" x2="8" y2="26" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                <line x1="84" y1="28" x2="92" y2="26" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                <ellipse cx="25" cy="27" rx="5" ry="2" fill="white" opacity="0.35" />
                <ellipse cx="65" cy="27" rx="5" ry="2" fill="white" opacity="0.35" />
            </FeatureGroup>

            {/* 11. Dead (X Eyes) */}
            <FeatureGroup visible={mood === 'dead'}>
                <path d="M 20 20 L 40 40 M 40 20 L 20 40" stroke="black" strokeWidth="4" strokeLinecap="round" />
                <path d="M 60 20 L 80 40 M 80 20 L 60 40" stroke="black" strokeWidth="4" strokeLinecap="round" />
            </FeatureGroup>

            {/* Thinking (Looking Up/Side Black + Glint) */}
            <FeatureGroup visible={['thinking', 'skeptical'].includes(mood)}>
                <g className="monster-eyes-idle">
                    <ellipse cx="30" cy="25" rx="6" ry="10" fill="black" />
                    <Glint cx="32" cy="21" />
                    <ellipse cx="70" cy="25" rx="6" ry="10" fill="black" />
                    <Glint cx="72" cy="21" />
                </g>
            </FeatureGroup>
        </g>
    );
};

// ─── Mouth Variants ───
const Mouths = ({ mood }) => {
    return (
        <g>
            {/* Neutral Smile */}
            <FeatureGroup visible={mood === 'neutral' || !mood || mood === 'cool'}>
                <path d="M 35 65 Q 50 75 65 65" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
            </FeatureGroup>

            {/* Thinking Line */}
            <FeatureGroup visible={['thinking', 'skeptical'].includes(mood)}>
                <path d="M 40 70 Q 50 75 60 70" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
            </FeatureGroup>

            {/* Happy / Laugh (Bean) */}
            <FeatureGroup visible={['happy', 'laugh', 'wave'].includes(mood)}>
                <g>
                    <defs>
                        <clipPath id="happy-clip">
                            <path d="M 20 60 Q 50 90 80 60 Q 80 50 50 50 Q 20 50 20 60 Z" />
                        </clipPath>
                    </defs>
                    <path d="M 20 60 Q 50 90 80 60 Q 80 50 50 50 Q 20 50 20 60 Z" fill="black" />
                    <g clipPath="url(#happy-clip)">
                        <path d="M 35 85 Q 50 65 65 85" fill="#DC1B50" />
                    </g>
                </g>
            </FeatureGroup>

            {/* Shocked (Open O) - Rounded */}
            <FeatureGroup visible={['shocked', 'dead'].includes(mood)}>
                <circle cx="50" cy="70" r="12" fill="black" />
            </FeatureGroup>

            {/* Confused (Wavy) */}
            <FeatureGroup visible={mood === 'confused'}>
                <path d="M 35 70 Q 45 65 50 70 Q 55 75 65 70" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
            </FeatureGroup>

            {/* Sleepy (Small O) */}
            <FeatureGroup visible={mood === 'sleepy'}>
                <circle cx="50" cy="70" r="5" fill="black" />
            </FeatureGroup>

            {/* Beast / Mad (Frown) */}
            <FeatureGroup visible={['beast', 'mad'].includes(mood)}>
                <path d="M 30 75 Q 50 60 70 75" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
                <path d="M 35 75 L 35 80" stroke="white" strokeWidth="3" />
                <path d="M 65 75 L 65 80" stroke="white" strokeWidth="3" />
            </FeatureGroup>

            {/* Amazed (O) */}
            <FeatureGroup visible={mood === 'amazed'}>
                <circle cx="50" cy="70" r="10" fill="black" />
            </FeatureGroup>

            {/* Crying (Wobbly Open) */}
            <FeatureGroup visible={['crying', 'sad'].includes(mood)}>
                <ellipse cx="50" cy="75" rx="15" ry="10" fill="black" />
            </FeatureGroup>
        </g>
    );
};

export default function MonsterFaceSVG({ mood = 'neutral' }) {
    const isAnimating = mood && mood !== 'neutral';

    return (
        <g className={`monster-face-svg ${isAnimating ? 'animating' : ''}`}>
            <Eyes mood={mood} />
            <Mouths mood={mood} />
        </g>
    );
}
