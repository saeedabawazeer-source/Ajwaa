import React from 'react';
import './MonsterFaceSVG.css';

export default function MonsterFaceSVG({ mood = 'neutral' }) {
    const isAnimating = mood && mood !== 'neutral';

    // SVG Coordinate System: Viewed in 100x100 space provided by parent

    // ─── Eye Shapes based on Mood ───
    const renderEyes = () => {
        // Common glint
        const Glint = ({ cx, cy }) => <circle cx={cx} cy={cy} r="3.5" fill="white" />;

        switch (mood) {
            case 'happy':
            case 'laugh':
            case 'wave':
                // Happy Eyes: Curved Arcs (^)
                return (
                    <g fill="none" stroke="black" strokeWidth="4" strokeLinecap="round">
                        <path d="M 25 35 Q 30 25 35 35" />
                        <path d="M 65 35 Q 70 25 75 35" />
                    </g>
                );
            case 'beast':
                // Angry Eyes: Slanted Inwards
                return (
                    <g>
                        <ellipse cx="30" cy="32" rx="6" ry="9" fill="black" transform="rotate(20 30 32)" />
                        <ellipse cx="70" cy="32" rx="6" ry="9" fill="black" transform="rotate(-20 70 32)" />
                    </g>
                );
            case 'amazed':
                // Wide Eyes: Circles
                return (
                    <g>
                        <circle cx="30" cy="30" r="8" fill="black" />
                        <Glint cx="32" cy="28" />
                        <circle cx="70" cy="30" r="8" fill="black" />
                        <Glint cx="72" cy="28" />
                    </g>
                );
            case 'thinking':
                // Looking Up/Side
                return (
                    <g>
                        <ellipse cx="30" cy="25" rx="6" ry="10" fill="black" />
                        <Glint cx="32" cy="22" />
                        <ellipse cx="70" cy="25" rx="6" ry="10" fill="black" />
                        <Glint cx="72" cy="22" />
                    </g>
                );
            default: // Neutral
                // Standard Vertical Ovals
                return (
                    <g>
                        <ellipse className="monster-eye-l" cx="30" cy="30" rx="6" ry="10" fill="black" />
                        <Glint cx="32" cy="27" />
                        <ellipse className="monster-eye-r" cx="70" cy="30" rx="6" ry="10" fill="black" />
                        <Glint cx="72" cy="27" />
                    </g>
                );
        }
    };

    return (
        <g className={`monster-face-svg ${isAnimating ? 'animating' : ''}`}>
            {/* ─── Defs for Clipping Tongue ─── */}
            <defs>
                <clipPath id="dwtd-mouth-clip">
                    <rect x="20" y="55" width="60" height="35" rx="15" ry="15" />
                </clipPath>
            </defs>

            {/* ─── Eyes ─── */}
            {renderEyes()}

            {/* ─── Mouth Group ─── */}
            <g>
                {/* Mouth Shape (Black Background) */}
                <rect
                    className="monster-mouth-bg"
                    x="20" y="55" width="60" height="35" rx="15" ry="15"
                    fill="black"
                />

                {/* Tooth Removed per user request */}

                {/* Tongue (Clipped inside mouth) */}
                <g clipPath="url(#dwtd-mouth-clip)">
                    {/* Flip: Drawn from bottom up as a mound? 
                         Old: M 35 80 A 15 15 0 0 0 65 80 (Arc Down?)
                         New: M 35 90 Q 50 70 65 90 (Mound from bottom edge)
                     */}
                    <path
                        className="monster-tongue"
                        d="M 30 90 Q 50 65 70 90"
                        fill="#DC1B50"
                    />
                </g>
            </g>

            {/* 3. Mouth Border (Removed for DWtD Style - Clean Look)
                <rect
                    className="monster-mouth-border"
                    x="20" y="55" width="60" height="40" rx="20" ry="20"
                />
                */}
        </g>
    );
}
