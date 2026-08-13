import { useState } from 'react';
import { Dumbbell, X, Plus } from 'lucide-react';
import './Modal.css';

export default function LogWorkoutModal({ open, onClose, onSave }) {
    const [title, setTitle] = useState('');
    const [exercises, setExercises] = useState([]);
    const [name, setName] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');

    if (!open) return null;

    function addExercise() {
        if (!name || !reps) return;
        setExercises([...exercises, { name, reps: Number(reps), weight: Number(weight) || 0 }]);
        setName(''); setReps(''); setWeight('');
    }

    function handleSave() {
        if (exercises.length === 0) return;
        onSave(title || 'Quick Session', exercises);
        setTitle(''); setExercises([]); setName(''); setReps(''); setWeight('');
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <Dumbbell size={24} />
                    <span style={{ fontWeight: 900, fontSize: 16 }}>QUICK LOG</span>
                    <button className="modal-close" onClick={onClose}><X size={16} /></button>
                </div>

                <div className="text-label" style={{ marginBottom: 4 }}>SESSION NAME</div>
                <input className="modal-input" placeholder="e.g. Pull Day" value={title} onChange={e => setTitle(e.target.value)} />

                <div className="text-label" style={{ margin: '12px 0 4px' }}>EXERCISE</div>
                <input className="modal-input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <input className="modal-input" placeholder="Reps" type="number" value={reps} onChange={e => setReps(e.target.value)} />
                    <input className="modal-input" placeholder="Kg" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
                </div>

                <button className="btn btn-outline" style={{ width: '100%', padding: '10px', marginBottom: 12, marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onClick={addExercise} disabled={!name || !reps}>
                    <Plus size={16} /> ADD EXERCISE
                </button>

                {exercises.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                        {exercises.map((ex, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, marginBottom: 4 }}>
                                <span style={{ fontWeight: 700, fontSize: 13 }}>{ex.name}</span>
                                <span style={{ opacity: 0.6, fontSize: 12, fontWeight: 700 }}>{ex.reps} x {ex.weight}kg</span>
                            </div>
                        ))}
                    </div>
                )}

                <button className="btn btn-volt" onClick={handleSave} disabled={exercises.length === 0}
                    style={{ width: '100%', opacity: exercises.length === 0 ? 0.5 : 1 }}>
                    SAVE SESSION
                </button>
            </div>
        </div>
    );
}
