import './Dock.css';
import KenneyIcon from './KenneyIcon';
import { Sparkles } from 'lucide-react';

// Bottom navigation: HOME / TRAIN / STATS / PROFILE for everyone, plus PLAN in
// owner mode. The centre button opens the AI coach (it used to be the mascot).
export default function Dock({ activeView, onNavigate, onFab, ownerMode = false }) {

    const left = [
        { id: 'dashboard', label: 'HOME', icon: <KenneyIcon name="home" size={22} tint="white" /> },
        { id: 'workouts', label: 'TRAIN', icon: <KenneyIcon name="fist" size={22} tint="white" /> },
        // Owner-only: the plan loaded by the secret login.
        ...(ownerMode ? [{ id: 'plan', label: 'PLAN', icon: <KenneyIcon name="star" size={22} tint="white" /> }] : []),
    ];

    const right = [
        { id: 'stats', label: 'STATS', icon: <KenneyIcon name="target" size={22} tint="white" /> },
        { id: 'profile', label: 'PROFILE', icon: <KenneyIcon name="gear" size={22} tint="white" /> },
    ];

    return (
        <nav className="dock">
            {left.map(it => (
                <button key={it.id} className={`nav-item ${activeView === it.id ? 'active' : ''}`} onClick={() => onNavigate(it.id)}>
                    {it.icon}
                </button>
            ))}
            
            {/* Centre button — the AI coach (replaced the mascot sprite) */}
            <button className="nav-fab" onClick={onFab} title="Ask Ajwaa — your AI coach" aria-label="Ask Ajwaa">
                <Sparkles size={24} color="var(--c-black)" />
            </button>

            {right.map(it => (
                <button key={it.id} className={`nav-item ${activeView === it.id ? 'active' : ''}`} onClick={() => onNavigate(it.id)}>
                    {it.icon}
                </button>
            ))}
        </nav>
    );
}
