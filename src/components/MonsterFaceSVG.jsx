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
                transition: 'opacity 0.3s ease-in-out',
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
                style={{ '--cx': cx + 'px', '--cy': cy + 'px' }} // Pass center vars to CSS
                transform={`translate(${cx}, ${cy}) scale(0.8)`} fill="#FFD700"
                d="M 0,-10 L 2,-2 L 10,0 L 2,2 L 0,10 L -2,2 L -10,0 L -2,-2 Z"
            />
        );

        return (
            <g>
                {/* Neutral / Default (With Idle Animation) */}
                <FeatureGroup visible={mood === 'neutral' || !mood}>
                    <g className="monster-eyes-idle">
                        <ellipse className="monster-eye-l" cx="30" cy="30" rx="6" ry="10" fill="black" />
                        <Glint cx="32" cy="27" />
                        <ellipse className="monster-eye-r" cx="70" cy="30" rx="6" ry="10" fill="black" />
                        <Glint cx="72" cy="27" />
                    </g>
                </FeatureGroup>

                {/* Happy / Laugh (Arcs) */}
                <FeatureGroup visible={['happy', 'laugh', 'wave'].includes(mood)}>
                    <g fill="none" stroke="black" strokeWidth="4" strokeLinecap="round">
                        <path d="M 25 35 Q 30 25 35 35" />
                        <path d="M 65 35 Q 70 25 75 35" />
                    </g>
                </FeatureGroup>

                {/* Excited / Amazed (Stars) */}
                {/* User requested "Sparkles when amazed", so merging logic */}
                <FeatureGroup visible={['excited', 'amazed'].includes(mood)}>
                    <Star cx="30" cy="30" />
                    <Star cx="70" cy="30" />
                </FeatureGroup>

                {/* Mad / Beast (Slanted) */}
                <FeatureGroup visible={['beast', 'mad'].includes(mood)}>
                    <path d="M 20 20 L 40 28" stroke="black" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 80 20 L 60 28" stroke="black" strokeWidth="3" strokeLinecap="round" />
                    <ellipse cx="30" cy="32" rx="6" ry="9" fill="black" />
                    <ellipse cx="70" cy="32" rx="6" ry="9" fill="black" />
                </FeatureGroup>

                {/* Crying / Sad (Arched Down) */}
                <FeatureGroup visible={['crying', 'sad'].includes(mood)}>
                    <path d="M 22 30 Q 30 20 38 30" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 62 30 Q 70 20 78 30" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
                    {/* Tears */}
                    <path className="monster-tear" d="M 30 35 Q 25 45 30 55" stroke="#4FC3F7" strokeWidth="3" fill="none" />
                    <path className="monster-tear-r" d="M 70 35 Q 75 45 70 55" stroke="#4FC3F7" strokeWidth="3" fill="none" />
                </FeatureGroup>

                {/* Thinking (Looking Up/Side) */}
                <FeatureGroup visible={mood === 'thinking'}>
                    <ellipse cx="30" cy="25" rx="6" ry="10" fill="black" />
                    <Glint cx="32" cy="22" />
                    <ellipse cx="70" cy="25" rx="6" ry="10" fill="black" />
                    <Glint cx="72" cy="22" />
                </FeatureGroup>
            </g>
        );
    }

    // ─── Mouth Variants ───
    const Mouths = () => {
        return (
            <g>
                {/* Neutral Smile */}
                <FeatureGroup visible={mood === 'neutral' || !mood}>
                    <path d="M 35 65 Q 50 75 65 65" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
                </FeatureGroup>

                {/* Thinking Line */}
                <FeatureGroup visible={mood === 'thinking'}>
                    <path d="M 40 70 Q 50 75 60 70" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
                </FeatureGroup>

                {/* Happy / Laugh (Bean) */}
                <FeatureGroup visible={['happy', 'laugh', 'wave', 'excited'].includes(mood)}>
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
