import { useEffect } from 'react';
import KenneyIcon from './KenneyIcon';
import './Modal.css';

export default function LevelUpModal({ open, level, onClose }) {
    useEffect(() => {
        if (open) {
            // Trigger haptic feedback if available
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                try { navigator.vibrate([200, 100, 200, 100, 400]); } catch { /* unsupported */ }
            }
        }
    }, [open]);

    if (!open) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card level-up-card" onClick={e => e.stopPropagation()}>
                <div className="lu-icon">
                    <KenneyIcon name="trophy" size={64} tint="white" />
                </div>
                <div className="lu-title">LEVEL UP!</div>
                <div className="lu-subtitle">You reached Level {level}</div>
                <p className="lu-desc">Your dedication is paying off. Keep pushing!</p>
                <button className="btn btn-primary" onClick={onClose} style={{ width: '100%', marginTop: 24, fontSize: 16 }}>
                    KEEP CRUSHING IT
                </button>
            </div>
        </div>
    );
}
