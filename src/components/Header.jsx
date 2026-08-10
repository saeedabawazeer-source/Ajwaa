import './Header.css';
import KenneyIcon from './KenneyIcon';

export default function Header({ userName, streak }) {
    return (
        <header className="header">
            <div className="user-chip">
                <div className="user-avatar">{userName ? userName.charAt(0).toUpperCase() : 'A'}</div>
                <span>{userName}</span>
            </div>
            <div className="header-right">
                <div className="header-date" style={{ fontWeight: 900, fontSize: 12, marginRight: 12, opacity: 0.8 }}>
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                </div>
                <div className="streak-badge">
                    <KenneyIcon name="star" size={14} /> {streak} STREAK
                </div>
            </div>
        </header>
    );
}
