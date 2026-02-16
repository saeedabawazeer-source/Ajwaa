import React from 'react';
import './MonsterFaceSVG.css';

export default function MonsterFaceSVG({ mood = 'neutral' }) {
    const isAnimating = mood && mood !== 'neutral';

    // SVG Coordinate System: Viewed in 100x100 space provided by parent

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

    // ─── Eye Variants ───
    const Eyes = () => {
        const Glint = ({ cx, cy }) => <circle cx={cx} cy={cy} r="3.5" fill="white" />;
        const Star = ({ cx, cy }) => (
            <path
                className="monster-star"
                style={{ '--cx': cx + 'px', '--cy': cy + 'px' }}
                transform={`translate(${cx}, ${cy}) scale(0.8)`}
                fill="#FFF" stroke="black" strokeWidth="2"
                d="M 0,-10 L 2,-2 L 10,0 L 2,2 L 0,10 L -2,2 L -10,0 L -2,-2 Z"
            />
        );
        const Heart = ({ cx, cy }) => (
            <path
                transform={`translate(${cx}, ${cy}) scale(0.8)`}
                fill="#FFF" stroke="black" strokeWidth="2"
                d="M 0,5 L -5,0 Q -7,-2 -5,-4 Q -3,-6 0,-2 Q 3,-6 5,-4 Q 7,-2 5,0 Z"
            />
        );

        return (
            <g>
                {/* 1. Neutral / Default (Sclera + Pupil) */}
                <FeatureGroup visible={mood === 'neutral' || !mood}>
                    {/* Left Eye */}
                    <ellipse cx="30" cy="30" rx="6" ry="10" fill="white" stroke="black" strokeWidth="2" />
                    <circle className="monster-eyes-idle" cx="30" cy="30" r="3.5" fill="black" />
                    {/* Right Eye */}
                    <ellipse cx="70" cy="30" rx="6" ry="10" fill="white" stroke="black" strokeWidth="2" />
                    <circle className="monster-eyes-idle" cx="70" cy="30" r="3.5" fill="black" />
                </FeatureGroup>

                {/* 2. Happy / Laugh / Wave (Arcs) */}
                <FeatureGroup visible={['happy', 'laugh', 'wave'].includes(mood)}>
                    <g fill="none" stroke="black" strokeWidth="4" strokeLinecap="round">
                        <path d="M 25 35 Q 30 25 35 35" />
                        <path d="M 65 35 Q 70 25 75 35" />
                    </g>
                </FeatureGroup>

                {/* 3. Excited / Amazed (White Stars) */}
                <FeatureGroup visible={['excited', 'amazed'].includes(mood)}>
                    <g className="monster-eyes-idle">
                        <Star cx="30" cy="30" />
                        <Star cx="70" cy="30" />
                    </g>
                </FeatureGroup>

                {/* 4. Mad / Beast (Slanted Sclera + Pupil) */}
                <FeatureGroup visible={['beast', 'mad'].includes(mood)}>
                    <path d="M 20 20 L 40 28" stroke="black" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 80 20 L 60 28" stroke="black" strokeWidth="3" strokeLinecap="round" />
                    {/* Eyes */}
                    <ellipse cx="30" cy="32" rx="6" ry="9" fill="white" stroke="black" strokeWidth="1" />
                    <circle className="monster-eyes-idle" cx="30" cy="32" r="3" fill="black" />
                    <ellipse cx="70" cy="32" rx="6" ry="9" fill="white" stroke="black" strokeWidth="1" />
                    <circle className="monster-eyes-idle" cx="70" cy="32" r="3" fill="black" />
                </FeatureGroup>

                {/* 5. Crying / Sad (Arched Down) */}
                <FeatureGroup visible={['crying', 'sad'].includes(mood)}>
                    <path d="M 22 30 Q 30 20 38 30" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 62 30 Q 70 20 78 30" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
                    <path className="monster-tear" d="M 30 35 Q 25 45 30 55" stroke="#4FC3F7" strokeWidth="3" fill="none" />
                    <path className="monster-tear-r" d="M 70 35 Q 75 45 70 55" stroke="#4FC3F7" strokeWidth="3" fill="none" />
                </FeatureGroup>

                {/* 6. Shocked (White Circles + Small Pupils) */}
                <FeatureGroup visible={mood === 'shocked'}>
                    <circle cx="30" cy="30" r="6" fill="white" stroke="black" strokeWidth="2" />
                    <circle className="monster-eyes-idle" cx="30" cy="30" r="2" fill="black" />
                    <circle cx="70" cy="30" r="6" fill="white" stroke="black" strokeWidth="2" />
                    <circle className="monster-eyes-idle" cx="70" cy="30" r="2" fill="black" />
                </FeatureGroup>

                {/* 7. Confused (Uneven Sclera + Pupil) */}
                <FeatureGroup visible={mood === 'confused'}>
                    <path d="M 20 18 L 40 22" stroke="black" strokeWidth="2" /> {/* Raised Brow */}
                    <circle cx="30" cy="30" r="8" fill="white" stroke="black" strokeWidth="2" />
                    <circle className="monster-eyes-idle" cx="30" cy="30" r="3" fill="black" />
                    <circle cx="70" cy="30" r="5" fill="white" stroke="black" strokeWidth="2" />
                    <circle className="monster-eyes-idle" cx="70" cy="30" r="2" fill="black" />
                </FeatureGroup>

                {/* 8. Love (White Hearts) */}
                <FeatureGroup visible={mood === 'love'}>
                    <Heart cx="30" cy="30" />
                    <Heart cx="70" cy="30" />
                </FeatureGroup>

                {/* 9. Sleepy (Closed flat) */}
                <FeatureGroup visible={mood === 'sleepy'}>
                    <path d="M 25 35 L 35 35" stroke="black" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 65 35 L 75 35" stroke="black" strokeWidth="4" strokeLinecap="round" />
                    <text x="80" y="20" fontSize="12" fill="black" style={{ animation: 'sparkle-spin 3s infinite' }}>Z</text>
                </FeatureGroup>

                {/* 10. Cool (Sunglasses + White Reflection) */}
                <FeatureGroup visible={mood === 'cool'}>
                    <path d="M 15 25 H 45 Q 45 40 30 40 Q 15 40 15 25 Z" fill="black" />
                    <path d="M 55 25 H 85 Q 85 40 70 40 Q 55 40 55 25 Z" fill="black" />
                    <line x1="45" y1="28" x2="55" y2="28" stroke="black" strokeWidth="3" />
                    {/* Reflections */}
                    <path d="M 20 28 L 35 28" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                    <path d="M 60 28 L 75 28" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                </FeatureGroup>

                {/* 11. Dead (X Eyes) */}
                <FeatureGroup visible={mood === 'dead'}>
                    <path d="M 25 25 L 35 35 M 35 25 L 25 35" stroke="black" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 65 25 L 75 35 M 75 25 L 65 35" stroke="black" strokeWidth="4" strokeLinecap="round" />
                </FeatureGroup>

                {/* Thinking (Looking Up/Side Sclera + Pupil) */}
                <FeatureGroup visible={['thinking', 'skeptical'].includes(mood)}>
                    <ellipse cx="30" cy="25" rx="6" ry="10" fill="white" stroke="black" strokeWidth="2" />
                    <circle className="monster-eyes-idle" cx="30" cy="25" r="3.5" fill="black" />
                    <ellipse cx="70" cy="25" rx="6" ry="10" fill="white" stroke="black" strokeWidth="2" />
                    <circle className="monster-eyes-idle" cx="70" cy="25" r="3.5" fill="black" />
                </FeatureGroup>
            </g>
        );
    }

    // ─── Mouth Variants ───
    const Mouths = () => {
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

                {/* Shocked (Open O/Bean) - Blue Blob */}
                <FeatureGroup visible={['shocked', 'dead'].includes(mood)}>
                    <path d="M 35 60 Q 65 60 65 80 Q 50 90 35 80 Q 35 70 35 60 Z" fill="black" />
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
    }

    return (
        <g className={`monster-face-svg ${isAnimating ? 'animating' : ''}`}>
            {/* ─── Eyes ─── */}
            <Eyes />

            {/* ─── Mouth Group ─── */}
            <Mouths />

            {/* 3. Mouth Border (Removed for DWtD Style - Clean Look)
                <rect
                    className="monster-mouth-border"
                    x="20" y="55" width="60" height="40" rx="20" ry="20"
                />
                */}
        </g>
    );
}
