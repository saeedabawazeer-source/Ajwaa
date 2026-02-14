import './Dock.css';
import { Home, Dumbbell, BarChart2, User, Plus } from 'lucide-react';

export default function Dock({ activeView, onNavigate, onFab }) {
    const items = [
        { id: 'dashboard', icon: <Home size={24} /> },
        { id: 'workouts', icon: <Dumbbell size={24} /> },
        { id: 'stats', icon: <BarChart2 size={24} /> },
        { id: 'profile', icon: <User size={24} /> }
    ];

    return (
        <nav className="dock">
            {items.slice(0, 2).map(it => (
                <button key={it.id} className={`nav-item ${activeView === it.id ? 'active' : ''}`} onClick={() => onNavigate(it.id)}>
                    {it.icon}
                </button>
            ))}
            <button className="nav-fab" onClick={onFab}>
                <Plus size={32} color="var(--c-black)" strokeWidth={3} />
            </button>
            {items.slice(2).map(it => (
                <button key={it.id} className={`nav-item ${activeView === it.id ? 'active' : ''}`} onClick={() => onNavigate(it.id)}>
                    {it.icon}
                </button>
            ))}
        </nav>
    );
}
