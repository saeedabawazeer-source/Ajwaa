import React, { useMemo } from 'react';
import './EmotingEyes.css';

const EYE_STATES = {
    neutral: {
        left: { lower: { r: 0, p: 0 }, upper: { r: 0, p: 0 } },
        right: { lower: { r: 0, p: 0 }, upper: { r: 0, p: 0 } }
    },
    happy: {
        left: { lower: { r: 20, p: 40 }, upper: { r: 0, p: 0 } },
        right: { lower: { r: -20, p: 40 }, upper: { r: 0, p: 0 } }
    },
    sad: {
        left: { lower: { r: 0, p: 0 }, upper: { r: -20, p: 35 } },
        right: { lower: { r: 0, p: 0 }, upper: { r: 20, p: 35 } }
    },
    angry: { // Beast mode base?
        left: { lower: { r: 0, p: 0 }, upper: { r: 20, p: 45 } },
        right: { lower: { r: 0, p: 0 }, upper: { r: -20, p: 45 } }
    },
    beast: { // More intense angry
        left: { lower: { r: 0, p: 10 }, upper: { r: 25, p: 55 } },
        right: { lower: { r: 0, p: 10 }, upper: { r: -25, p: 55 } }
    },
    confused: {
        left: { lower: { r: 0, p: 0 }, upper: { r: 0, p: 40 } },
        right: { lower: { r: 0, p: 0 }, upper: { r: 0, p: 0 } }
    },
    suspicious: { // Thinking
        left: { lower: { r: -4, p: 20 }, upper: { r: 4, p: 20 } },
        right: { lower: { r: 4, p: 20 }, upper: { r: -4, p: 20 } }
    },
    pain: {
        left: { lower: { r: 10, p: 20 }, upper: { r: -10, p: 20 } },
        right: { lower: { r: -10, p: 20 }, upper: { r: 10, p: 20 } }
    },
    tired: { // Unamused
        left: { lower: { r: 0, p: 0 }, upper: { r: 0, p: 40 } },
        right: { lower: { r: 0, p: 0 }, upper: { r: 0, p: 40 } }
    },
    amazed: { // Wide open
        left: { lower: { r: 0, p: 0 }, upper: { r: 0, p: 0 } },
        right: { lower: { r: 0, p: 0 }, upper: { r: 0, p: 0 } }
    },
    laugh: { // Happy squint
        left: { lower: { r: 20, p: 45 }, upper: { r: 0, p: 0 } },
        right: { lower: { r: -20, p: 45 }, upper: { r: 0, p: 0 } }
    }
};

export default function EmotingEyes({ mood = 'neutral', lookingAt = 'center' }) {
    // 1. Get State
    const state = EYE_STATES[mood] || EYE_STATES.neutral;

    // 2. Pupil Logic
    const pupilStyle = useMemo(() => {
        let x = 0, y = 0;
        if (lookingAt === 'user') { x = 0; y = 0; } // Center
        if (lookingAt === 'up') { y = -6; }
        if (lookingAt === 'down') { y = 6; }
        if (lookingAt === 'left') { x = -6; }
        if (lookingAt === 'right') { x = 6; }
        // Random fidget could go here if managed by parent
        return { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` };
    }, [lookingAt]);

    // 3. Helper to generate styles for an eye
    const getEyeStyle = (side) => {
        const s = state[side];
        return {
            '--lower-rot': `${s.lower.r}deg`,
            '--lower-pos': `${s.lower.p}%`,
            '--upper-rot': `${s.upper.r}deg`,
            '--upper-pos': `${s.upper.p}%`,
        };
    };

    return (
        <div className="ee-eye-container">
            {/* Left Eye */}
            <div className="ee-eye" style={getEyeStyle('left')}>
                <div className="ee-pupil" style={pupilStyle} />
                <div className="ee-lid-wrapper lower" style={{ transform: 'rotate(var(--lower-rot))', '--pos': 'var(--lower-pos)' }}>
                    <div className="ee-lid" />
                </div>
                <div className="ee-lid-wrapper upper" style={{ transform: 'rotate(var(--upper-rot))', '--pos': 'var(--upper-pos)' }}>
                    <div className="ee-lid" />
                </div>
            </div>

            {/* Right Eye */}
            <div className="ee-eye" style={getEyeStyle('right')}>
                <div className="ee-pupil" style={pupilStyle} />
                <div className="ee-lid-wrapper lower" style={{ transform: 'rotate(var(--lower-rot))', '--pos': 'var(--lower-pos)' }}>
                    <div className="ee-lid" />
                </div>
                <div className="ee-lid-wrapper upper" style={{ transform: 'rotate(var(--upper-rot))', '--pos': 'var(--upper-pos)' }}>
                    <div className="ee-lid" />
                </div>
            </div>
        </div>
    );
}
