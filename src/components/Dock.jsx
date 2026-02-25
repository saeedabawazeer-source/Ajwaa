import { useState, useEffect } from 'react';
import './Dock.css';
import { Home, Dumbbell, Users, User, Sparkles } from 'lucide-react';
import AjwaMascot from './AjwaMascot';

// Ordered moods for smooth sequential cycling
const MOOD_SEQUENCE = [
    'neutral', 'happy', 'thinking', 'cool', 'love', 'excited',
    'amazed', 'shocked', 'confused', 'sleepy', 'beast', 'dead'
];

export default function Dock({ activeView, onNavigate, onFab, reaction }) {
    const [mascotState, setMascotState] = useState({ mood: 'neutral', lookingAt: 'center' });
    const [moodIndex, setMoodIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMoodIndex(prev => {
                const next = (prev + 1) % MOOD_SEQUENCE.length;
                setMascotState({
                    mood: MOOD_SEQUENCE[next],
                    lookingAt: ['center', 'left', 'right', 'up'][Math.floor(Math.random() * 4)]
                });
                return next;
            });
        }, 4000); // Smooth 4s transitions

        return () => clearInterval(interval);
    }, []);

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
            <button className="nav-fab" onClick={onFab} style={{ overflow: 'hidden', padding: 0 }}>
                <div style={{ width: '100%', height: '100%', transform: 'scale(1.8) translateY(-6px)' }}>
                    <AjwaMascot
                        mood={reaction || mascotState.mood}
                        lookingAt={reaction ? 'user' : mascotState.lookingAt}
                        showHands={false}
                    />
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
