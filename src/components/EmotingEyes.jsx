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
    const s = EYE_STATES[mood] || EYE_STATES.neutral;

    // 2. Pupil Logic
    const pupilStyle = useMemo(() => {
        let x = 0, y = 0;
        if (lookingAt === 'user') { x = 0; y = 0; } // Center
        if (lookingAt === 'up') { y = -6; }
        if (lookingAt === 'down') { y = 6; }
        if (lookingAt === 'left') { x = -6; }
        if (lookingAt === 'right') { x = 6; }
        return { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` };
    }, [lookingAt]);

    // 3. Apply variables to the face container (mimicking the script.js setState)
    const faceStyle = {
        '--left-lower-rotation': `${s.left.lower.r}deg`,
        '--left-lower-position': `${s.left.lower.p}%`,
        '--left-upper-rotation': `${s.left.upper.r}deg`,
        '--left-upper-position': `${s.left.upper.p}%`,
        '--right-lower-rotation': `${s.right.lower.r}deg`,
        '--right-lower-position': `${s.right.lower.p}%`,
        '--right-upper-rotation': `${s.right.upper.r}deg`,
        '--right-upper-position': `${s.right.upper.p}%`,
        '--face-rotation-x': s.face ? `${s.face.rotationX}deg` : '0deg',
        '--face-rotation-y': s.face ? `${s.face.rotationY}deg` : '0deg',
        '--face-rotation-z': s.face ? `${s.face.rotationZ}deg` : '0deg',
    };

    return (
        <div className="face-container">
            <div className="face" style={faceStyle}>
                <div className="eye left">
                    <div className="pupil" style={pupilStyle} />
                    <div className="lower"><div className="lid"></div></div>
                    <div className="upper"><div className="lid"></div></div>
                </div>
                <div className="eye right">
                    <div className="pupil" style={pupilStyle} />
                    <div className="lower"><div className="lid"></div></div>
                    <div className="upper"><div className="lid"></div></div>
                </div>
            </div>
        </div>
    );
}
