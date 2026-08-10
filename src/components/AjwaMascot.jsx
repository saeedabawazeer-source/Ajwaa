import React from 'react';
import './AjwaMascot.css';
import MonsterFaceSVG from './MonsterFaceSVG';

const BODY_COLOR = '#A8D86E';
const BODY_DARK  = '#7DB346'; // shadow/underside
const BODY_SHINE = '#D4F09C'; // top highlight

// Rounder, chubbier blob shape — wider at the belly
const BODY_PATH = 'M 50 60 C 45 20, 155 20, 150 60 C 162 88, 162 148, 148 178 L 52 178 C 38 148, 38 88, 50 60 Z';

// Left arm pivot ≈ (55, 105) | Right arm pivot ≈ (145, 105)
const ARM_L_OFFSET = { x: 55, y: 105 };
const ARM_R_OFFSET = { x: 145, y: 105 };

function getArmAngles(mood) {
    switch (mood) {
        case 'happy':
        case 'wave':      return { l: 25, r: -150 };
        case 'excited':   return { l: 120, r: -120 };
        case 'love':      return { l: 30, r: -30 };
        case 'beast':
        case 'mad':       return { l: 130, r: -130 };
        case 'thinking':  return { l: 110, r: -35 };
        case 'confused':  return { l: 115, r: -30 };
        case 'cool':      return { l: 15, r: -40 };
        case 'shocked':   return { l: 145, r: -145 };
        case 'dead':      return { l: 10, r: -10 };
        case 'sleepy':    return { l: 5, r: -5 };
        default:          return { l: 20, r: -20 };
    }
}

export default function AjwaMascot({ mood = 'neutral', lookingAt = 'center', showHands = true, showBody = true, ...props }) {
    const angles = getArmAngles(mood);

    return (
        <div
            className={`ajwa-mascot-container ajwa-mood-${mood}`}
            {...props}
        >
            <svg viewBox="0 0 200 200" className="ajwa-svg">
                <defs>
                    <clipPath id={`body-clip-${mood}`}>
                        <path d={BODY_PATH} />
                    </clipPath>

                    {/* Radial gradient for body depth */}
                    <radialGradient id="body-grad" cx="38%" cy="28%" r="62%">
                        <stop offset="0%"   stopColor={BODY_SHINE} />
                        <stop offset="55%"  stopColor={BODY_COLOR} />
                        <stop offset="100%" stopColor={BODY_DARK} />
                    </radialGradient>

                    {/* Arm shape reusable */}
                    <path id="arm-l-shape"
                        d="M 0 0 C -8 18, -12 38, -8 60"
                        stroke={BODY_COLOR} strokeWidth="9"
                        strokeLinecap="round" fill="none"
                    />
                    <path id="arm-r-shape"
                        d="M 0 0 C 8 18, 12 38, 8 60"
                        stroke={BODY_COLOR} strokeWidth="9"
                        strokeLinecap="round" fill="none"
                    />
                </defs>

                {/* ─── Arms (rendered BEHIND body) ─────────────────── */}
                {showHands && (
                    <>
                        {/* LEFT ARM */}
                        <g
                            className="ajwa-arm-l"
                            style={{
                                transformOrigin: `${ARM_L_OFFSET.x}px ${ARM_L_OFFSET.y}px`,
                                transform: `rotate(${angles.l}deg)`,
                                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            }}
                        >
                            <g transform={`translate(${ARM_L_OFFSET.x}, ${ARM_L_OFFSET.y})`}>
                                <use href="#arm-l-shape" />
                                {/* Fist/hand blob */}
                                <circle cx="-7" cy="62" r="7"
                                    fill={BODY_COLOR}
                                    stroke="black" strokeWidth="3"
                                />
                            </g>
                        </g>

                        {/* RIGHT ARM */}
                        <g
                            className="ajwa-arm-r"
                            style={{
                                transformOrigin: `${ARM_R_OFFSET.x}px ${ARM_R_OFFSET.y}px`,
                                transform: `rotate(${angles.r}deg)`,
                                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            }}
                        >
                            <g transform={`translate(${ARM_R_OFFSET.x}, ${ARM_R_OFFSET.y})`}>
                                <use href="#arm-r-shape" />
                                {/* Fist/hand blob */}
                                <circle cx="7" cy="62" r="7"
                                    fill={BODY_COLOR}
                                    stroke="black" strokeWidth="3"
                                />
                            </g>
                        </g>
                    </>
                )}

                {/* ─── Body ────────────────────────────────────────── */}
                {showBody && (
                    <>
                        {/* Body with gradient fill */}
                        <path
                            d={BODY_PATH}
                            fill="url(#body-grad)"
                            stroke="black"
                            strokeWidth="5"
                            strokeLinejoin="round"
                            className="ajwa-body"
                        />

                        {/* ── Sweatband ─────────────────────────────── */}
                        <rect
                            x="0" y="60" width="200" height="18"
                            fill="#FFE600"
                            clipPath={`url(#body-clip-${mood})`}
                        />
                        {/* Band borders */}
                        <line x1="48" y1="60" x2="152" y2="60"
                            stroke="black" strokeWidth="3.5" />
                        <line x1="0" y1="78" x2="200" y2="78"
                            stroke="black" strokeWidth="3"
                            clipPath={`url(#body-clip-${mood})`} />

                        {/* ── Gloss highlight (top-left shine) ──────── */}
                        <ellipse
                            className="ajwa-body-highlight"
                            cx="85" cy="40" rx="28" ry="16"
                            fill="white" opacity="0.18"
                            clipPath={`url(#body-clip-${mood})`}
                        />

                        {/* ── Face ──────────────────────────────────── */}
                        <g className="ajwa-face">
                            <svg x="50" y="62" width="100" height="105" viewBox="0 0 100 105">
                                <MonsterFaceSVG mood={mood} />
                            </svg>
                        </g>

                        {/* ── Mood VFX ──────────────────────────────── */}
                        {mood === 'love' && (
                            <g style={{ pointerEvents: 'none' }}>
                                <text className="ajwa-heart-float-1"
                                    x="155" y="50" fontSize="14" fill="#FF6B9D">♥</text>
                                <text className="ajwa-heart-float-2"
                                    x="165" y="70" fontSize="10" fill="#FF4D88">♥</text>
                                <text className="ajwa-heart-float-3"
                                    x="148" y="68" fontSize="11" fill="#FF6B9D">♥</text>
                            </g>
                        )}

                        {mood === 'sleepy' && (
                            <g style={{ pointerEvents: 'none' }}>
                                <text className="sleepy-z"   x="152" y="48" fontSize="14" fontWeight="bold" fill="#888">Z</text>
                                <text className="sleepy-z-2" x="162" y="34" fontSize="11" fontWeight="bold" fill="#aaa">Z</text>
                                <text className="sleepy-z-3" x="170" y="22" fontSize="9"  fontWeight="bold" fill="#ccc">Z</text>
                            </g>
                        )}

                        {mood === 'excited' && (
                            <g style={{ pointerEvents: 'none' }}>
                                <text x="38" y="22" fontSize="13" fill="#FFD700" className="ajwa-heart-float-1">✦</text>
                                <text x="152" y="30" fontSize="10" fill="#FFD700" className="ajwa-heart-float-2">✦</text>
                                <text x="155" y="55" fontSize="8"  fill="#FFE000" className="ajwa-heart-float-3">✦</text>
                            </g>
                        )}

                        {(mood === 'beast' || mood === 'mad') && (
                            <g style={{ pointerEvents: 'none' }}>
                                {/* Anger veins */}
                                <path d="M 162 38 L 168 30 L 175 36" stroke="#FF3333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                                <path d="M 28 42 L 22 36 L 28 32"   stroke="#FF3333" strokeWidth="2" fill="none" strokeLinecap="round" />
                            </g>
                        )}
                    </>
                )}
            </svg>
        </div>
    );
}
