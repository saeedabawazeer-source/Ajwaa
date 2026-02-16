import React from 'react';
import './MonsterFaceSVG.css';

export default function MonsterFaceSVG({ mood = 'neutral' }) {
    const isAnimating = mood !== 'neutral';

    // SVG Coordinate System: Viewed in 100x100 space provided by parent
    // Eyes: ~10x20
    // Mouth: Max 60x40 centered at 50,75

    return (
        <g className={`monster-face-svg ${isAnimating ? 'animating' : ''}`}>
            {/* ─── Defs for Clipping ─── */}
            <defs>
                <clipPath id="monster-mouth-clip">
                    {/* This rect tracks the mouth shape animation to clip teeth/tongue */}
                    <rect
                        className="monster-mouth-clip-rect"
                        x="20" y="55" width="60" height="40" rx="20" ry="20"
                    />
                </clipPath>
            </defs>

            {/* ─── Eyes ─── */}
            <rect x="25" y="25" width="12" height="20" rx="6" fill="black" />
            <rect x="63" y="25" width="12" height="20" rx="6" fill="black" />

            {/* ─── Mouth Group ─── */}
            <g>
                {/* 1. Mouth Background (Red) */}
                <rect
                    className="monster-mouth-bg"
                    x="20" y="55" width="60" height="40" rx="20" ry="20"
                    fill="#810332"
                />

                {/* 2. Tongue & Teeth (Clipped by Mouth Shape) */}
                <g clipPath="url(#monster-mouth-clip)">
                    {/* Background darkening? */}
                    <rect x="25" y="55" width="50" height="20" rx="10" fill="#400018" opacity="0.5" />

                    {/* Tongue */}
                    <circle
                        className="monster-tongue"
                        cx="50" cy="50" r="20"
                        fill="#DC1B50"
                    />

                    {/* Top Teeth */}
                    <rect
                        className="monster-top-teeth"
                        x="25" y="15" width="50" height="15" rx="4"
                        fill="white"
                    />

                    {/* Bottom Teeth */}
                    <rect
                        className="monster-bottom-teeth"
                        x="35" y="45" width="30" height="15" rx="4"
                        fill="white"
                    />
                </g>

                {/* 3. Mouth Border (Yellow) - Drawn on top */}
                <rect
                    className="monster-mouth-border"
                    x="20" y="55" width="60" height="40" rx="20" ry="20"
                    fill="none" stroke="#ff8818" strokeWidth="4"
                />
            </g>
        </g>
    );
}
