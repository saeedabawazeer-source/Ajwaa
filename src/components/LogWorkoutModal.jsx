import { useState } from 'react';
import KenneyIcon from './KenneyIcon';
import './Modal.css';

export default function LogWorkoutModal({ open, onClose, onSave }) {
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState(45);

    if (!open) return null;

    function handleSave() {
        if (!title.trim()) return;
        onSave(title, Number(duration));
        setTitle('');
        setDuration(45);
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <KenneyIcon name="fist" size={24} />
                    <span style={{ fontWeight: 900, fontSize: 16 }}>LOG WORKOUT</span>
                    <button className="modal-close" onClick={onClose}><KenneyIcon name="cross" size={16} /></button>
                </div>
                
                <div style={{ marginBottom: 16 }}>
                    <div className="text-label" style={{ marginBottom: 8 }}>PRESETS</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {['Push Day', 'Pull Day', 'Leg Day', 'Full Body', 'Upper Body', 'Lower Body'].map(p => (
                            <button 
                                key={p} 
                                className="btn" 
                                style={{ 
                                    padding: '4px 10px', 
                                    fontSize: 12, 
                                    background: title === p ? 'var(--c-volt)' : 'var(--c-sand)',
                                    color: 'var(--c-black)',
                                    border: '2px solid var(--c-black)',
                                    borderRadius: 6
                                }}
                                onClick={() => setTitle(p)}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="text-label" style={{ marginBottom: 4 }}>WORKOUT TITLE</div>
                <input 
                    className="modal-input" 
                    placeholder="Workout title (e.g. Push Day)" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    autoFocus
                />
                
                <div style={{ display: 'flex', gap: 12, marginTop: 12, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <div className="text-label" style={{ marginBottom: 4 }}>DURATION (MINS)</div>
                        <input 
                            className="modal-input" 
                            type="number" 
                            value={duration} 
                            onChange={e => setDuration(e.target.value)} 
                        />
                    </div>
                </div>

                <button 
                    className="btn btn-volt" 
                    style={{ width: '100%', marginTop: 24, fontSize: 14 }}
                    onClick={handleSave}
                    disabled={!title.trim()}
                >
                    <KenneyIcon name="plus" size={16} /> ADD TO TODAY
                </button>
            </div>
        </div>
    );
}
