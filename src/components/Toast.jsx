import { useEffect, useState } from 'react';
import KenneyIcon from './KenneyIcon';
import './Toast.css';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const t = setTimeout(() => {
                setVisible(false);
                setTimeout(onClose, 300); // Wait for exit anim
            }, duration);
            return () => clearTimeout(t);
        }
    }, [message, duration, onClose]);

    if (!message) return null;

    return (
        <div className={`toast-container ${visible ? 'show' : 'hide'}`}>
            <div className={`toast-card ${type}`}>
                <div className="toast-icon">
                    {type === 'success' ? <KenneyIcon name="check" size={20} tint="white" /> : <KenneyIcon name="warning" size={20} tint="white" />}
                </div>
                <div className="toast-msg">{message}</div>
                <button className="toast-close" onClick={() => {
                    setVisible(false);
                    setTimeout(onClose, 300);
                }}>
                    <KenneyIcon name="cross" size={14} tint="white" />
                </button>
            </div>
        </div>
    );
}
