import { useMemo } from 'react';
import './AjwaMascot.css';

export default function AjwaMascot({ mood = 'neutral', lookingAt = 'center', showHands = true, showBody = true, ...props }) {
    // lookingAt: 'center' | 'input' | 'user'

    const getPupilPos = () => {
        if (lookingAt === 'input') return { cx: 0, cy: 5 }; // Look down
        if (lookingAt === 'left') return { cx: -4, cy: 2 };
        if (lookingAt === 'right') return { cx: 4, cy: 2 };
        if (lookingAt === 'up') return { cx: 0, cy: -4 };
        return { cx: 0, cy: 0 }; // Center
    };

    const pupilOffset = getPupilPos();

    // Updated Body Path: Rounder Top (15, 15 control pts) + Wide (50-150)
    const BODY_PATH = "M50 65 C 50 15, 150 15, 150 65 C 160 85, 160 140, 150 180 L 50 180 C 40 140, 40 85, 50 65 Z";

    return (
        <div className="ajwa-mascot-container">
            <svg viewBox="0 0 200 180" className="ajwa-svg">
                <defs>
                    <clipPath id="ajwa-body-clip">
                        <path d={BODY_PATH} />
                    </clipPath>
                    {/* Headband Clipping to remove side strokes */}
                    <clipPath id="hb-clip">
                        <rect x="0" y="65" width="200" height="15" />
                    </clipPath>
                    {/* Body/Head Groups */}
                    {showBody && (
                        <>
                            <g className="ajwa-body">
                                {/* Main Body Shape (Ajwa Date Brown) */}
                                <path
                                    d="M 50 15 C 50 15, 150 15, 150 15 L 150 120 Q 150 170 100 170 Q 50 170 50 120 Z"
                                    fill="#3E2723" stroke="black" strokeWidth="6"
                                />

                                {/* Headband (Clipped) */}
                                <g clipPath="url(#head-clip-ajwa)">
                                    <path d="M 0 15 H 200 v 35 H 0 Z" fill="#FFC107" />
                                    <line x1="0" y1="15" x2="200" y2="15" stroke="black" strokeWidth="6" />
                                    <line x1="0" y1="50" x2="200" y2="50" stroke="black" strokeWidth="6" />
                                </g>

                                {/* Head Rope (Egal) */}
                                <path d="M 45 15 Q 100 5 155 15" stroke="black" strokeWidth="6" fill="none" strokeLinecap="round" />
                                <path d="M 45 25 Q 100 15 155 25" stroke="black" strokeWidth="6" fill="none" strokeLinecap="round" />

                                {/* ─── Face ─── */}
                                <g className="ajwa-face">
                                    {/* Eyes */}
                                    <g transform="translate(0, 5)">
                                        {mood === 'beast' ? (
                                            /* Beast Mode: Angry Eyes */
                                            <>
                                                <circle cx="75" cy="100" r="16" fill="white" stroke="black" strokeWidth="3" />
                                                <circle cx="125" cy="100" r="16" fill="white" stroke="black" strokeWidth="3" />

                                                {/* Angry Brows */}
                                                <path d="M 60 90 L 90 105" stroke="black" strokeWidth="5" strokeLinecap="round" />
                                                <path d="M 140 90 L 110 105" stroke="black" strokeWidth="5" strokeLinecap="round" />

                                                {/* Pupils (Small & Focused) */}
                                                <circle cx={75 + pupilOffset.cx} cy={100 + pupilOffset.cy} r="4" fill="black" />
                                                <circle cx={125 + pupilOffset.cx} cy={100 + pupilOffset.cy} r="4" fill="black" />
                                            </>
                                        ) : (
                                            <>
                                                <circle cx="75" cy="100" r="16" fill="white" stroke="black" strokeWidth="3" />
                                                <circle cx="125" cy="100" r="16" fill="white" stroke="black" strokeWidth="3" />

                                                {/* Pupils */}
                                                <circle cx={75 + pupilOffset.cx} cy={100 + pupilOffset.cy} r="6" fill="black" className="eye-pupil" style={{ transition: 'all 0.2s' }} />
                                                <circle cx={125 + pupilOffset.cx} cy={100 + pupilOffset.cy} r="6" fill="black" className="eye-pupil" style={{ transition: 'all 0.2s' }} />
                                            </>
                                        )}
                                    </g>

                                    {/* Mouth */}           <g transform="translate(0, 5)">
                                        {mood === 'happy' ? (
                                            <path d="M85 135 Q 100 145 115 135" stroke="black" strokeWidth="5" fill="none" strokeLinecap="round" />
                                        ) : mood === 'laugh' ? (
                                            <path d="M85 135 Q 100 155 115 135 Z" fill="black" stroke="black" strokeWidth="2" />
                                        ) : mood === 'amazed' ? (
                                            <ellipse cx="100" cy="140" rx="8" ry="10" fill="black" stroke="none" />
                                        ) : mood === 'beast' ? (
                                            /* Beast: Roaring Mouth with Teeth */
                                            <g>
                                                <path d="M 85 135 Q 100 155 115 135 Z" fill="black" stroke="black" strokeWidth="2" />
                                                {/* Teeth */}
                                                <path d="M 88 135 L 92 140 L 96 135" fill="white" />
                                                <path d="M 104 135 L 108 140 L 112 135" fill="white" />
                                            </g>
                                        ) : mood === 'thinking' ? (
                                            <path d="M90 140 H 110" stroke="black" strokeWidth="5" fill="none" strokeLinecap="round" />
                                        ) : (
                                            <path d="M90 135 Q 100 140 110 135" stroke="black" strokeWidth="5" fill="none" strokeLinecap="round" />
                                        )}
                                    </g>
                                </g>
                            </g>
                        </>
                    )}

                    {/* ─── Hands ─── */}
                    {showHands && (
                        <>
                            {/* Left Hand */}
                            <g>
                                {mood === 'beast' ? (
                                    /* Power Pose Left */
                                    <path d="M 55 110 Q 30 110 25 80" stroke="#8D6E63" strokeWidth="5" fill="none" strokeLinecap="round" />
                                ) : (
                                    <path d="M 55 110 Q 30 140 40 175" stroke="#8D6E63" strokeWidth="5" fill="none" strokeLinecap="round" />
                                )}
                                <circle cx={mood === 'beast' ? 25 : 40} cy={mood === 'beast' ? 80 : 175} r="7" fill="#8D6E63" stroke="black" strokeWidth="2" />
                            </g>

                            {/* Right Hand */}
                            {mood === 'happy' || mood === 'laugh' ? (
                                <g className="ajwa-arm wave" style={{ transformOrigin: '145px 110px' }}>
                                    <path d="M 145 110 Q 170 110 180 80" stroke="#8D6E63" strokeWidth="5" fill="none" strokeLinecap="round" />
                                    <circle cx="180" cy="80" r="7" fill="#8D6E63" stroke="black" strokeWidth="2" />
                                </g>
                            ) : mood === 'beast' ? (
                                <g>
                                /* Power Pose Right */
                                    <path d="M 145 110 Q 170 110 175 80" stroke="#8D6E63" strokeWidth="5" fill="none" strokeLinecap="round" />
                                    <circle cx="175" cy="80" r="7" fill="#8D6E63" stroke="black" strokeWidth="2" />
                                </g>
                            ) : mood === 'amazed' ? (
                                <g className="ajwa-arm wave" style={{ transformOrigin: '145px 110px' }}>
                                    {/* Both hands up/out for amazed? Just reuse wave for now or mirror left */}
                                    <path d="M 145 110 Q 170 110 180 80" stroke="#8D6E63" strokeWidth="5" fill="none" strokeLinecap="round" />
                                    <circle cx="180" cy="80" r="7" fill="#8D6E63" stroke="black" strokeWidth="2" />
                                </g>
                            ) : mood === 'thinking' ? (
                                <g>
                                    <path d="M 145 120 Q 170 140 160 110" stroke="#8D6E63" strokeWidth="5" fill="none" strokeLinecap="round" />
                                    <circle cx="160" cy="110" r="7" fill="#8D6E63" stroke="black" strokeWidth="2" />
                                </g>
                            ) : (
                                <g>
                                    <path d="M 145 110 Q 170 140 160 175" stroke="#8D6E63" strokeWidth="5" fill="none" strokeLinecap="round" />
                                    <circle cx="160" cy="175" r="7" fill="#8D6E63" stroke="black" strokeWidth="2" />
                                </g>
                            )}
                        </>
                    )}
            </svg>
        </div>
    );
}
