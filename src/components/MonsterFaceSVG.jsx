import React from 'react';
import './MonsterFaceSVG.css';

export default function MonsterFaceSVG({ mood = 'neutral' }) {
    const isAnimating = mood && mood !== 'neutral';

    // SVG Coordinate System: Viewed in 100x100 space provided by parent

    // ─── Eye Shapes based on Mood ───
    const renderEyes = () => {
        // Common glint
        const Glint = ({ cx, cy }) => <circle cx={cx} cy={cy} r="3.5" fill="white" />;

        // Star for Excited
        const Star = ({ cx, cy }) => (
            <path
                transform={`translate(${cx}, ${cy}) scale(0.8)`}
                fill="#FFD700" /* Gold Sparkle */
                d="M 0,-10 L 2,-2 L 10,0 L 2,2 L 0,10 L -2,2 L -10,0 L -2,-2 Z"
            />
        );

        switch (mood) {
            case 'excited':
                // Sparkle Eyes
                return (
                    <g>
                        <Star cx="30" cy="30" />
                        <Star cx="70" cy="30" />
                    </g>
                );
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
            case 'mad':
                // Angry Eyes: Slanted Inwards
                return (
                    <g>
                        {/* Brows? */}
                        <path d="M 20 20 L 40 28" stroke="black" strokeWidth="3" strokeLinecap="round" />
                        <path d="M 80 20 L 60 28" stroke="black" strokeWidth="3" strokeLinecap="round" />
                        {/* Eyes */}
                        <ellipse cx="30" cy="32" rx="6" ry="9" fill="black" />
                        <ellipse cx="70" cy="32" rx="6" ry="9" fill="black" />
                    </g>
                );
            case 'crying':
            case 'sad':
                // Sad Eyes (Arched Down) + Tears
                return (
                    <g>
                        <path d="M 22 30 Q 30 20 38 30" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
                        <path d="M 62 30 Q 70 20 78 30" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
                        {/* Tears */}
                        <path className="monster-tear" d="M 30 35 Q 25 45 30 55" stroke="#4FC3F7" strokeWidth="3" fill="none" />
                        <path className="monster-tear-r" d="M 70 35 Q 75 45 70 55" stroke="#4FC3F7" strokeWidth="3" fill="none" />
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

    // ─── Mouth Shapes based on Mood ───
    const renderMouth = () => {
        // Shared Tongue (Clipped)
        const Tongue = () => (
            <path d="M 30 90 Q 50 65 70 90" fill="#DC1B50" />
        );

        switch (mood) {
            case 'excited':
            case 'happy':
            case 'laugh':
            case 'wave':
                // Big Bean Smile (D Shape)
                return (
                    <g>
                        <defs>
                            <clipPath id="happy-clip">
                                <path d="M 20 60 Q 50 90 80 60 Q 80 50 50 50 Q 20 50 20 60 Z" />
                            </clipPath>
                        </defs>
                        {/* Mouth Bg */}
                        <path
                            d="M 20 60 Q 50 90 80 60 Q 80 50 50 50 Q 20 50 20 60 Z"
                            fill="black"
                        />
                        {/* Tongue inside */}
                        <g clipPath="url(#happy-clip)">
                            <path d="M 35 85 Q 50 65 65 85" fill="#DC1B50" />
                        </g>
                    </g>
                );
            case 'beast':
            case 'mad':
                // Frown / Gritted
                return (
                    <g>
                        <path d="M 30 75 Q 50 60 70 75" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
                        {/* Teeth protruding? */}
                        <path d="M 35 75 L 35 80" stroke="white" strokeWidth="3" />
                        <path d="M 65 75 L 65 80" stroke="white" strokeWidth="3" />
                    </g>
                );
            case 'crying':
                // Wobbly Open
                return (
                    <ellipse cx="50" cy="75" rx="15" ry="10" fill="black" />
                );
            case 'amazed':
                // Small 'O'
                return (
                    <circle cx="50" cy="70" r="10" fill="black" />
                );
            case 'thinking':
                // Small flat line or circle
                return (
                    <path d="M 40 70 Q 50 75 60 70" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
                );
            default: // Neutral
                // Simple Smile Line
                return (
                    <path d="M 35 65 Q 50 75 65 65" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
                );
        }
    };

    return (
        <g className={`monster-face-svg ${isAnimating ? 'animating' : ''}`}>
            {/* ─── Eyes ─── */}
            {renderEyes()}

            {/* ─── Mouth Group ─── */}
            {renderMouth()}

            {/* 3. Mouth Border (Removed for DWtD Style - Clean Look)
                <rect
                    className="monster-mouth-border"
                    x="20" y="55" width="60" height="40" rx="20" ry="20"
                />
                */}
        </g>
    );
}
