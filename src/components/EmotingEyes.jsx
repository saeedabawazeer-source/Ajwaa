import React, { useMemo } from 'react';
import './EmotingEyes.css';

const EYE_STATES = {
    neutral: {
        face: { rotationX: 0, rotationY: 0, rotationZ: 0 },
        left: { lower: { rotation: 0, position: 0 }, upper: { rotation: 0, position: 0 } },
        right: { lower: { rotation: 0, position: 0 }, upper: { rotation: 0, position: 0 } }
    },
    happy: {
        face: { rotationX: 0, rotationY: 0, rotationZ: 0 },
        left: { lower: { rotation: 20, position: 40 }, upper: { rotation: 0, position: 0 } },
        right: { lower: { rotation: -20, position: 40 }, upper: { rotation: 0, position: 0 } }
    },
    sad: {
        face: { rotationX: 0, rotationY: 0, rotationZ: 0 },
        left: { lower: { rotation: 0, position: 0 }, upper: { rotation: -20, position: 40 } },
        right: { lower: { rotation: 0, position: 0 }, upper: { rotation: 20, position: 40 } }
    },
    close: {
        face: { rotationX: -20, rotationY: 0, rotationZ: 0 },
        left: { lower: { rotation: 0, position: 45 }, upper: { rotation: 0, position: 45 } },
        right: { lower: { rotation: 0, position: 45 }, upper: { rotation: 0, position: 45 } }
    },
    angry: {
        face: { rotationX: -10, rotationY: 0, rotationZ: 0 },
        left: { lower: { rotation: 0, position: 0 }, upper: { rotation: 20, position: 40 } },
        right: { lower: { rotation: 0, position: 0 }, upper: { rotation: -20, position: 40 } }
    },
    confused: {
        face: { rotationX: 0, rotationY: 0, rotationZ: 0 },
        left: { lower: { rotation: 0, position: 0 }, upper: { rotation: 0, position: 40 } },
        right: { lower: { rotation: 0, position: 0 }, upper: { rotation: 0, position: 0 } }
    },
    suspicious: {
        face: { rotationX: 0, rotationY: 0, rotationZ: 0 },
        left: { lower: { rotation: -4, position: 20 }, upper: { rotation: 4, position: 20 } },
        right: { lower: { rotation: 4, position: 20 }, upper: { rotation: -4, position: 20 } }
    },
    pain: {
        face: { rotationX: 0, rotationY: 0, rotationZ: 0 },
        left: { lower: { rotation: 10, position: 20 }, upper: { rotation: -10, position: 20 } },
        right: { lower: { rotation: -10, position: 20 }, upper: { rotation: 10, position: 20 } }
    },
    unamused: {
        face: { rotationX: 0, rotationY: 0, rotationZ: 0 },
        left: { lower: { rotation: 0, position: 0 }, upper: { rotation: 0, position: 40 } },
        right: { lower: { rotation: 0, position: 0 }, upper: { rotation: 0, position: 40 } }
    },
    unsure: {
        face: { rotationX: 0, rotationY: 0, rotationZ: 7 },
        left: { lower: { rotation: 10, position: 20 }, upper: { rotation: -10, position: 20 } },
        right: { lower: { rotation: 0, position: 0 }, upper: { rotation: 0, position: 0 } }
    },
    // Keep bespoke ones mapped to closest equivalents or custom
    beast: {
        face: { rotationX: -15, rotationY: 0, rotationZ: 0 },
        left: { lower: { rotation: 0, position: 10 }, upper: { rotation: 25, position: 55 } },
        right: { lower: { rotation: 0, position: 10 }, upper: { rotation: -25, position: 55 } }
    },
    amazed: {
        face: { rotationX: 0, rotationY: 0, rotationZ: 0 },
        left: { lower: { rotation: 0, position: 0 }, upper: { rotation: 0, position: 0 } },
        right: { lower: { rotation: 0, position: 0 }, upper: { rotation: 0, position: 0 } }
    },
    laugh: { // Same as happy
        face: { rotationX: 0, rotationY: 0, rotationZ: 0 },
        left: { lower: { rotation: 20, position: 40 }, upper: { rotation: 0, position: 0 } },
        right: { lower: { rotation: -20, position: 40 }, upper: { rotation: 0, position: 0 } }
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
        '--left-lower-rotation': `${s.left.lower.rotation}deg`,
        '--left-lower-position': `${s.left.lower.position}%`,
        '--left-upper-rotation': `${s.left.upper.rotation}deg`,
        '--left-upper-position': `${s.left.upper.position}%`,
        '--right-lower-rotation': `${s.right.lower.rotation}deg`,
        '--right-lower-position': `${s.right.lower.position}%`,
        '--right-upper-rotation': `${s.right.upper.rotation}deg`,
        '--right-upper-position': `${s.right.upper.position}%`,
        '--face-rotation-x': s.face ? `${s.face.rotationX}deg` : '0deg', // Default 0
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
