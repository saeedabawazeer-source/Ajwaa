import React, { useState, useEffect } from 'react';
import './AjwaaMascot.css';

export default function AjwaaMascot({ action = 'idle', height = '120px' }) {
    const [isTalking, setIsTalking] = useState(false);

    // Simulate talking animation to make him feel alive and motivating
    useEffect(() => {
        if (action === 'punch') return; // Too focused to talk while punching!

        const talkInterval = setInterval(() => {
            // Randomly open mouth to simulate chatting
            if (Math.random() > 0.4) {
                setIsTalking(true);
                setTimeout(() => setIsTalking(false), 150 + Math.random() * 200);
            }
        }, 500);

        return () => clearInterval(talkInterval);
    }, [action]);

    return (
        <div className={`ajwaa-mascot ${action}`} style={{ height, width: height }}>
            {/* Dark Brown Date Body (using Kenney Squircle mask) */}
            <div className="ajwaa-body"></div>
            
            {/* Fitness Headband */}
            <div className="ajwaa-headband">
                <div className="headband-knot"></div>
            </div>

            {/* Eyes (using Kenney Eye mask) */}
            <div className="ajwaa-eyes">
                <div className="ajwaa-eye left"></div>
                <div className="ajwaa-eye right"></div>
            </div>

            {/* Mouth (using Kenney Mouth masks) */}
            <div className={`ajwaa-mouth ${isTalking ? 'talking' : ''} ${action === 'punch' ? 'angry' : ''}`}></div>
        </div>
    );
}
