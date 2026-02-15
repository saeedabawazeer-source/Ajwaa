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
            <button className="nav-mascot" onClick={onFab} style={{
                background: 'none', border: 'none', padding: 0, marginTop: -40,
                width: 70, height: 60, display: 'flex', justifyContent: 'center', alignItems: 'center',
                filter: 'drop-shadow(0px 4px 0px rgba(0,0,0,0.2))', cursor: 'pointer', zIndex: 10
            }}>
                <AjwaMascot mood="happy" showHands={false} />
            </button>
            {right.map(it => (
                <button key={it.id} className={`nav-item ${activeView === it.id ? 'active' : ''}`} onClick={() => onNavigate(it.id)}>
                    {it.icon}
                </button>
            ))}
        </nav>
    );
}
