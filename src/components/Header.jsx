import './Header.css';
import { Flame, Sparkles } from 'lucide-react';

export default function Header({ userName, streak, onOpenCoach }) {
    return (
        <header className="header">
            <div className="header-left">
                <div className="header-name">{userName}</div>
            </div>
            <div className="header-right">
                <div className="streak-badge">
                    <Flame size={14} fill="currentColor" /> {streak}
                </div>
                <button
                    className="icon-btn-round"
                    onClick={onOpenCoach}
                    aria-label="Ask Ajwaa, your AI coach"
                    title="Ask Ajwaa"
                >
                    <Sparkles size={19} />
                </button>
            </div>
        </header>
    );
}
