import './Header.css';
import { Flame, Bell } from 'lucide-react';

export default function Header({ userName, streak }) {
    return (
        <header className="header">
            <div className="header-left">
                <div className="header-meta">
                    <div className="header-name">{userName}</div>
                </div>
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