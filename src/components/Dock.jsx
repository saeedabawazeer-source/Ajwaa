import './Dock.css';
import { Home, Utensils, Dumbbell, Target, Settings } from 'lucide-react';

// Five destinations, one tap each. The AI coach lives in the header.
const ITEMS = [
    { id: 'dashboard', label: 'Home', icon: <Home size={21} /> },
    { id: 'meals', label: 'Meals', icon: <Utensils size={21} /> },
    { id: 'workouts', label: 'Train', icon: <Dumbbell size={21} /> },
    { id: 'stats', label: 'Stats', icon: <Target size={21} /> },
    { id: 'profile', label: 'Profile', icon: <Settings size={21} /> },
];

export default function Dock({ activeView, onNavigate }) {
    return (
        <nav className="dock">
            {ITEMS.map(({ id, label, icon }) => (
                <button
                    key={id}
                    className={`nav-item ${activeView === id ? 'active' : ''}`}
                    onClick={() => onNavigate(id)}
                    aria-label={label}
                    title={label}
                >
                    {icon}
                    <span className="nav-label">{label}</span>
                </button>
            ))}
        </nav>
    );
}

