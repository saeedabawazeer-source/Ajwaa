import React from 'react';
import './AjwaMascot.css';
import MonsterFaceSVG from './MonsterFaceSVG';

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

                {/* ─── Arms (DWtD Style: Simple Noodles with Round Caps) ─── */}
                {/* Note: Pivot points must be well inside the body (Body width ~50-150) */}

                {showHands && (
                    <>
                        {/* Left Arm */}
                        {mood === 'beast' ? (
                            /* Flexed Up */
                            <path d="M 60 100 Q 30 100 30 70" stroke="#8D6E63" strokeWidth="6" fill="none" strokeLinecap="round" />
                        ) : mood === 'thinking' ? (
                            /* Hand on chin */
                            <path d="M 60 110 Q 40 140 80 160" stroke="#8D6E63" strokeWidth="6" fill="none" strokeLinecap="round" />
                        ) : (
                            /* Neutral / Down */
                            <path d="M 60 110 Q 50 140 40 160" stroke="#8D6E63" strokeWidth="6" fill="none" strokeLinecap="round" />
                        )}

                        {/* Right Arm */}
                        {mood === 'happy' || mood === 'laugh' || mood === 'wave' ? (
                            /* Waving High */
                            <g className="ajwa-arm wave" style={{ transformOrigin: '140px 110px' }}>
                                <path d="M 140 110 Q 170 110 180 70" stroke="#8D6E63" strokeWidth="6" fill="none" strokeLinecap="round" />
                            </g>
                        ) : mood === 'beast' ? (
                            /* Flexed Up */
                            <path d="M 140 110 Q 170 110 170 70" stroke="#8D6E63" strokeWidth="6" fill="none" strokeLinecap="round" />
                        ) : (
                            /* Neutral / Down */
                            <path d="M 140 110 Q 150 140 160 160" stroke="#8D6E63" strokeWidth="6" fill="none" strokeLinecap="round" />
                        )}
                    </>
                )}

                {showBody && (
                    <>
                        {/* ─── Body Base ─── */}
                        <g>
                            <path
                                d={BODY_PATH}
                                fill="#3E2723" /* Base Brown */
                                stroke="black"
                                strokeWidth="6"
                                className="ajwa-body"
                            />

                            {/* ─── DWtD Style Shadow (Cel Shading) ─── */}
                            {/* Darker brown crescent on bottom-right */}
                            <path
                                d="M 50 180 C 40 140, 40 85, 50 65 L 150 65 L 150 180 Z"
                                clipPath="url(#ajwa-body-clip)"
                                fill="none" // Ensure no fill for helper, actual shadow below
                            />
                            {/* Actual Shadow Path: Offset copy of body, clipped */}
                            <g clipPath="url(#ajwa-body-clip)">
                                <circle cx="130" cy="150" r="70" fill="#261613" opacity="0.4" filter="blur(5px)" />
                            </g>
                        </g>

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
                            {/* Scaled and positioned using SVG coordinates. 
                                 Mascot face center is approx 100, 100.
                                 We position a 100x100 SVG view at x=50, y=65.
                             */}
                            <svg x="50" y="65" width="100" height="100" viewBox="0 0 100 100">
                                <MonsterFaceSVG mood={mood} />
                            </svg>
                        </g>
                    </>
                )}
            </svg>
        </div>
    );
}
