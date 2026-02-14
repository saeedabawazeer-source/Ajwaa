import { getXPProgress, getLevelTitle } from '../store/xpEngine';
import { Trophy } from 'lucide-react';
import './LevelUpModal.css';

export default function LevelUpModal({ level, xp, onClose }) {
    if (level === null || level === undefined) return null;
    const progress = getXPProgress(xp);
    const title = getLevelTitle(level);

    return (
        <div className="levelup-overlay" onClick={onClose}>
            <div className="levelup-card" onClick={e => e.stopPropagation()}>
                <div className="levelup-badge">
                    <Trophy size={48} color="#FFB800" />
                </div>
                <div className="levelup-title">LEVEL UP!</div>
                <div className="levelup-level">Level {level}</div>
                <div className="levelup-rank">{title}</div>
                <div className="levelup-xp-bar">
                    <div className="levelup-xp-fill" style={{ width: `${progress.percentage}%` }} />
                </div>
                <div className="levelup-xp-text">{progress.progress} / {progress.needed} XP to next level</div>
                <button className="btn btn-volt levelup-btn" onClick={onClose}>LET'S GO!</button>
            </div>
        </div>
    );
}
