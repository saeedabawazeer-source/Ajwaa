import React from 'react';
import './AjwaMascot.css';

export default function AjwaMascot({ mood = 'neutral', lookingAt = 'center', showHands = true, showBody = true }) {
    // lookingAt: 'center' | 'input' | 'user'

    const getPupilPos = () => {
        if (lookingAt === 'input') return { cx: 0, cy: 5 }; // Look down
        if (lookingAt === 'left') return { cx: -4, cy: 2 };
        if (lookingAt === 'right') return { cx: 4, cy: 2 };
        if (lookingAt === 'up') return { cx: 0, cy: -4 };
        return { cx: 0, cy: 0 }; // Center
    };

    const pupilOffset = getPupilPos();

    return (
        <div className="ajwa-mascot-container">
            <svg viewBox="0 0 200 180" className="ajwa-svg">
                {showBody && (
                    <>
                        {/* ─── Body (Lighter Brown) ─── */}
                        <path
                            d="M50 65 C 50 15, 150 15, 150 65 C 160 90, 160 140, 150 180 L 50 180 C 40 140, 40 90, 50 65 Z"
                            fill="#3E2723"
                            stroke="black"
                            strokeWidth="6"
                            className="ajwa-body"
                        />

                        {/* ─── Sweatband (Lowered slightly to sit on forehead) ─── */}
                        <rect x="45" y="45" width="110" height="15" rx="4" fill="#E0FF00" stroke="black" strokeWidth="4" />

                        {/* ─── Face ─── */}
                        <g className="ajwa-face">
                            {/* Eyes */}
                            <g transform="translate(0, 5)">
                                <circle cx="75" cy="100" r="16" fill="white" stroke="black" strokeWidth="3" />
                                <circle cx="125" cy="100" r="16" fill="white" stroke="black" strokeWidth="3" />

                                {/* Pupils */}
                                <circle cx={75 + pupilOffset.cx} cy={100 + pupilOffset.cy} r="6" fill="black" className="eye-pupil" style={{ transition: 'all 0.2s' }} />
                                <circle cx={125 + pupilOffset.cx} cy={100 + pupilOffset.cy} r="6" fill="black" className="eye-pupil" style={{ transition: 'all 0.2s' }} />
                            </g>

                            {/* Mouth */}
                            <g transform="translate(0, 5)">
                                {mood === 'happy' ? (
                                    <path d="M85 135 Q 100 145 115 135" stroke="black" strokeWidth="5" fill="none" strokeLinecap="round" />
                                ) : mood === 'thinking' ? (
                                    <path d="M90 140 H 110" stroke="black" strokeWidth="5" fill="none" strokeLinecap="round" />
                                ) : (
                                    <path d="M90 135 Q 100 140 110 135" stroke="black" strokeWidth="5" fill="none" strokeLinecap="round" />
                                )}
                            </g>
                        </g>
                    </>
                )}

                {/* ─── Hands ─── */}
                {showHands && (
                    <>
                        {/* Left Hand */}
                        <g>
                            <path d="M 50 140 Q 30 160 40 175" stroke="#8D6E63" strokeWidth="5" fill="none" strokeLinecap="round" />
                            <circle cx="40" cy="175" r="7" fill="#8D6E63" stroke="black" strokeWidth="2" />
                        </g>

                        {/* Right Hand */}
                        {mood === 'happy' ? (
                            <g className="ajwa-arm wave" style={{ transformOrigin: '150px 140px' }}>
                                <path d="M 150 140 Q 170 120 180 90" stroke="#8D6E63" strokeWidth="5" fill="none" strokeLinecap="round" />
                                <circle cx="180" cy="90" r="7" fill="#8D6E63" stroke="black" strokeWidth="2" />
                            </g>
                        ) : mood === 'thinking' ? (
                            <g>
                                <path d="M 150 150 Q 170 140 160 110" stroke="#8D6E63" strokeWidth="5" fill="none" strokeLinecap="round" />
                                <circle cx="160" cy="110" r="7" fill="#8D6E63" stroke="black" strokeWidth="2" />
                            </g>
                        ) : (
                            <g>
                                <path d="M 150 140 Q 170 160 160 175" stroke="#8D6E63" strokeWidth="5" fill="none" strokeLinecap="round" />
                                <circle cx="160" cy="175" r="7" fill="#8D6E63" stroke="black" strokeWidth="2" />
                            </g>
                        )}
                    </>
                )}
            </svg>
        </div>
    );
}
