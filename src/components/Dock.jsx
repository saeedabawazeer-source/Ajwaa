import './Dock.css';
import { Home, Dumbbell, Users, User, Plus } from 'lucide-react';

export default function Dock({ activeView, onNavigate, onFab }) {
    const left = [
        { id: 'dashboard', icon: <Home size={24} strokeWidth={3.5} /> },
        { id: 'workouts', icon: <Dumbbell size={24} strokeWidth={3.5} /> },
    ];
    const right = [
        { id: 'social', icon: <Users size={24} strokeWidth={3.5} /> },
        { id: 'profile', icon: <User size={24} strokeWidth={3.5} /> },
    ];

    return (
        <nav className="dock">
            {left.map(it => (
                <button key={it.id} className={`nav-item ${activeView === it.id ? 'active' : ''}`} onClick={() => onNavigate(it.id)}>
                    {it.icon}
                </button>
            ))}
            <button className="nav-fab" onClick={onFab}>
                <Plus size={32} strokeWidth={3.5} color="var(--bg)" />
            </button>
            {right.map(it => (
                <button key={it.id} className={`nav-item ${activeView === it.id ? 'active' : ''}`} onClick={() => onNavigate(it.id)}>
                    {it.icon}
                </button>
            ))}
        </nav>
    );
}
