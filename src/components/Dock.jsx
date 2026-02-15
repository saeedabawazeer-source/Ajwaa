import './Dock.css';
import { Home, Dumbbell, Users, User, Sparkles } from 'lucide-react';
import AjwaMascot from './AjwaMascot';

export default function Dock({ activeView, onNavigate, onFab }) {
    const left = [
        { id: 'dashboard', icon: <Home size={22} strokeWidth={2.5} /> },
        { id: 'workouts', icon: <Dumbbell size={22} strokeWidth={2.5} /> },
    ];
    const right = [
        { id: 'social', icon: <Users size={22} strokeWidth={2.5} /> },
        { id: 'profile', icon: <User size={22} strokeWidth={2.5} /> },
    ];

    return (
        <nav className="dock">
            {left.map(it => (
                <button key={it.id} className={`nav-item ${activeView === it.id ? 'active' : ''}`} onClick={() => onNavigate(it.id)}>
                    {it.icon}
                </button>
            ))}
            <button className="nav-fab" onClick={onFab}>
                <div style={{ width: 35, height: 30, display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                    <AjwaMascot mood="happy" showHands={false} />
                </div>
            </button>
            {right.map(it => (
                <button key={it.id} className={`nav-item ${activeView === it.id ? 'active' : ''}`} onClick={() => onNavigate(it.id)}>
                    {it.icon}
                </button>
            ))}
        </nav>
    );
}
