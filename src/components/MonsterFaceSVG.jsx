import React from 'react';
import './MonsterFaceSVG.css';

export default function MonsterFaceSVG({ mood = 'neutral' }) {
    const isAnimating = mood && mood !== 'neutral';

    // SVG Coordinate System: Viewed in 100x100 space provided by parent
    // Eyes: ~10x20
    // Mouth: Max 60x40 centered at 50,75

    return (
        <g className={`monster-face-svg ${isAnimating ? 'animating' : ''}`}>
            {/* ─── Eyes (Vertical Ovals + White Glint) ─── */}
            <g>
                <ellipse className="monster-eye-l" cx="30" cy="30" rx="6" ry="10" fill="black" />
                <circle cx="32" cy="27" r="3.5" fill="white" /> {/* Larger Glint */}

                <ellipse className="monster-eye-r" cx="70" cy="30" rx="6" ry="10" fill="black" />
                <circle cx="72" cy="27" r="3.5" fill="white" /> {/* Larger Glint */}
            </g>

            {/* ─── Mouth Group ─── */}
            <g>
                {/* Mouth Shape (Black/Dark, no border) */}
                <rect
                    className="monster-mouth-bg"
                    x="20" y="55" width="60" height="35" rx="15" ry="15"
                    fill="black"
                />

                {/* Tooth Removed per user request */}

                {/* Tongue (Simple Half Circle) */}
                <path
                    className="monster-tongue"
                    d="M 35 80 A 15 15 0 0 0 65 80"
                    fill="#DC1B50"
                />
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
