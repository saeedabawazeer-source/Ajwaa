import './Dock.css';
import KenneyIcon from './KenneyIcon';
import AjwaaMascot from './AjwaaMascot';

export default function Dock({ activeView, onNavigate, onFab, isCoach }) {
    const isSaeedMode = activeView === 'saeed';

    const left = [
        { id: 'dashboard', label: 'HOME', icon: <KenneyIcon name="home" size={22} tint="white" /> },
        { id: 'saeed', label: 'SAEED', icon: <KenneyIcon name="power" size={22} tint="white" /> },
    ];
    
    const right = [
        { id: isCoach ? 'coach' : 'workouts', label: isCoach ? 'COACH' : 'WORKOUT', icon: isCoach ? <KenneyIcon name="star" size={22} tint="white" /> : <KenneyIcon name="fist" size={22} tint="white" /> },
        { id: 'profile', label: 'PROFILE', icon: <KenneyIcon name="gear" size={22} tint="white" /> },
    ];

    return (
        <nav className="dock">
            {left.map(it => (
                <button key={it.id} className={`nav-item ${activeView === it.id ? 'active' : ''}`} onClick={() => onNavigate(it.id)}>
                    {it.icon}
                </button>
            ))}
            
            {/* Middle Button - Mascot hidden if in Saeed personal mode */}
            {isSaeedMode ? (
                <button className="nav-fab" style={{ background: 'var(--c-volt)', color: 'var(--c-black)', border: '2.5px solid var(--c-black)', borderRadius: '50%', width: 48, height: 48, marginTop: -18, display: 'grid', placeItems: 'center', boxShadow: '2.5px 2.5px 0 var(--c-black)', flexShrink: 0, cursor: 'pointer' }} onClick={() => onNavigate('saeed')} title="Saeed Protocol Active">
                    <KenneyIcon name="star" size={22} />
                </button>
            ) : (
                <button className="nav-fab mascot-fab" onClick={onFab} title="Ask Ajwaa AI Coach">
                    <div className="dock-mascot-wrap">
                        <AjwaaMascot action="idle" />
                    </div>
                </button>
            )}

            {right.map(it => (
                <button key={it.id} className={`nav-item ${activeView === it.id ? 'active' : ''}`} onClick={() => onNavigate(it.id)}>
                    {it.icon}
                </button>
            ))}
        </nav>
    );
}
