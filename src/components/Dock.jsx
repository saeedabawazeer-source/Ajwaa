import { useState, useEffect } from 'react';
import './Dock.css';
import { Home, Dumbbell, Users, User, Sparkles } from 'lucide-react';
import AjwaMascot from './AjwaMascot';

export default function Dock({ activeView, onNavigate, onFab, reaction }) {
    const [mascotState, setMascotState] = useState({ mood: 'neutral', lookingAt: 'center' });

    useEffect(() => {
        const interval = setInterval(() => {
            // IDLE CYCLE: Show ALL moods for verification
            const moods = [
                'neutral', 'happy', 'excited', 'love', 'cool', 'thinking',
                'shocked', 'beast', 'confused', 'sleepy', 'amazed', 'mad', 'dead'
            ];
            const looks = ['center', 'center', 'left', 'right', 'up'];

            setMascotState({
                mood: moods[Math.floor(Math.random() * moods.length)],
                lookingAt: looks[Math.floor(Math.random() * looks.length)]
            });
        }, 2500); // Change expression every 2.5s (Faster for visibility)

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
