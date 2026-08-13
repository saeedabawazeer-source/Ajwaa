import { useEffect, useState } from 'react';
import './XPPopup.css';

export default function XPPopup({ xp, onDone }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => { setVisible(false); onDone && onDone(); }, 1500);
        return () => clearTimeout(t);
    }, []);

    if (!visible || !xp) return null;

    return (
        <div className="xp-popup">
            +{xp} XP
        </div>
    );
}
