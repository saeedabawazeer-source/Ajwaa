import React from 'react';
import './AjwaMascot.css';
import MonsterFace from './MonsterFace';

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
        <div className="ajwa-mascot-container" {...props}>
            <svg viewBox="0 0 200 180" className="ajwa-svg">
                <defs>
                    <clipPath id="ajwa-body-clip">
                        <path d={BODY_PATH} />
                    </clipPath>
                    {/* Headband Clipping to remove side strokes */}
                    <clipPath id="hb-clip">
                        <rect x="0" y="65" width="200" height="15" />
                    </clipPath>
                </defs>

                {showBody && (
                    <>
                        {/* ─── Body Base ─── */}
                        <path
                            d={BODY_PATH}
                            fill="#3E2723"
                            stroke="black"
                            strokeWidth="6"
                            className="ajwa-body"
                        />

                        {/* ─── Sweatband (Clipped to Body) ─── */}
                        {/* 1. Yellow Fill (No Stroke, clipped to body shape) */}
                        <rect
                            x="20" y="65" width="160" height="15"
                            fill="#E0FF00"
                            clipPath="url(#ajwa-body-clip)"
                        />

                        {/* 2. Top/Bottom Borders Only (Black lines) */}
                        {/* Top Line */}
                        <path d="M50 65 L150 65" stroke="black" strokeWidth="4" fill="none" />
                        {/* Bottom Line (Slightly wider due to bulge, let's stick to straight for style or use clip to draw border?) 
                           Actually, simplified: just draw the rect with stroke, but clip it?
                           No, stroke is centered. 
                           Let's draw a line approx width.
                           At y=65 width is 100.
                           At y=80 width is approx 110 based on curve?
                           Let's just use the rect fill for now + Top Line. Bottom line might look distinct.
                           User said "Blends end to edge".
                           Let's try drawing a line M45 80 L155 80 clipped?
                        */}
                        <line x1="0" y1="80" x2="200" y2="80" stroke="black" strokeWidth="4" clipPath="url(#ajwa-body-clip)" />



                        {/* ─── Face (New Monster Style) ─── */}
                        <g className="ajwa-face">
                            {/* Scaled down to fit: 
                                 Original CSS is ~100px wide. Mascot face area is ~80px.
                                 Scale 0.5 makes it 50px wide, perfect centering.
                             */}
                            <foreignObject x="50" y="65" width="100" height="100">
                                <div style={{ width: '100%', height: '100%' }}>
                                    <MonsterFace mood={mood} />
                                </div>
                            </foreignObject>
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
