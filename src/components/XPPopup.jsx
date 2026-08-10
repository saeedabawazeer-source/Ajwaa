import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import './XPPopup.css';

export default function XPPopup({ xp, onDone }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (xp) {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#E0FF00', '#D62828', '#FFFFFF', '#1A1A1A']
            });
        }
        const t = setTimeout(() => { setVisible(false); onDone && onDone(); }, 1500);
        return () => clearTimeout(t);
    }, [xp, onDone]);

    if (!visible || !xp) return null;

    return (
        <div className="xp-popup">
            +{xp} XP
        </div>
    );
}
