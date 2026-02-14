import './Header.css';
import { Flame, Bell } from 'lucide-react';

export default function Header({ userName, streak }) {
    return (
        <header className="header">
            <div className="user-chip">
                {/* Replaced generic avatar div with user initial or icon if preferred, keeps layout clean */}
                <div className="user-avatar" />
                {userName}
            </div>
            <div className="header-right">
                <div className="streak-badge">
                    <Flame size={14} fill="currentColor" /> {streak}
                </div>
                <button className="icon-btn-round">
                    <Bell size={20} />
                </button>
            </div>
        </header>
    );
}
