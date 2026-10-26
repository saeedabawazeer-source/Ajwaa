import { useState, useMemo } from 'react';
import { Search, Dumbbell, ChevronDown, Zap, Database } from 'lucide-react';
import { getExercises, getMuscleGroups } from '../data/exerciseDB';
import './ExerciseLibrary.css';

const MUSCLE_COLORS = {
    'Chest': 'var(--c-red)',
    'Back': '#3B82F6',
    'Shoulders': 'var(--c-gold)',
    'Legs': 'var(--c-volt)',
    'Arms': '#A855F7',
    'Core': '#22C55E',
    'Cardio': '#F97316',
};

export default function ExerciseLibrary({ onAddExercise }) {
    const [query, setQuery] = useState('');
    const [muscle, setMuscle] = useState('All');
    const [open, setOpen] = useState(null);

    const all = getExercises();
    const muscles = ['All', ...getMuscleGroups()];

    const list = useMemo(() => {
        const q = query.trim().toLowerCase();
        return all.filter(e => {
            const okMuscle = muscle === 'All' || e.muscle === muscle;
            const okQuery = !q ||
                e.name.toLowerCase().includes(q) ||
                e.equipment.toLowerCase().includes(q) ||
                e.mechanic.toLowerCase().includes(q);
            return okMuscle && okQuery;
        });
    }, [query, muscle, all]);

    return (
        <div className="exl-page">
            {/* Header */}
            <div className="exl-header card">
                <div className="exl-head-left">
                    <div className="exl-head-icon"><Dumbbell size={22} strokeWidth={2.5} /></div>
                    <div>
                        <div className="exl-title">EXERCISE LIBRARY</div>
                        <div className="exl-sub">OPEN MOVEMENT DATABASE</div>
                    </div>
                </div>
                <div className="exl-count-pill">
                    <Database size={12} />
                    {all.length}
                </div>
            </div>

            {/* Search */}
            <div className="exl-search">
                <Search size={16} className="exl-search-icon" />
                <input
                    className="exl-search-input"
                    placeholder="Search movement, equipment..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
            </div>

            {/* Muscle filter chips */}
            <div className="exl-chips">
                {muscles.map(m => (
                    <button
                        key={m}
                        className={`exl-chip ${muscle === m ? 'active' : ''}`}
                        onClick={() => setMuscle(m)}
                        style={muscle === m && m !== 'All' ? { background: MUSCLE_COLORS[m], color: '#111', borderColor: '#111' } : {}}
                    >
                        {m.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Results meta */}
            <div className="exl-meta">
                <Zap size={12} /> {list.length} MOVEMENT{list.length === 1 ? '' : 'S'}
            </div>

            {/* Exercise list */}
            <div className="exl-list">
                {list.length === 0 ? (
                    <div className="exl-empty">
                        <Dumbbell size={36} opacity={0.15} />
                        <div>No movements found</div>
                        <div className="exl-empty-sub">Try a different search or filter</div>
                    </div>
                ) : list.map(ex => {
                    const isOpen = open === ex.id;
                    return (
                        <div key={ex.id} className={`exl-card card ${isOpen ? 'open' : ''}`}>
                            <button className="exl-card-head" onClick={() => setOpen(isOpen ? null : ex.id)}>
                                <span className="exl-muscle-bar" style={{ background: MUSCLE_COLORS[ex.muscle] || 'var(--c-black)' }} />
                                <div className="exl-card-info">
                                    <div className="exl-name">{ex.name}</div>
                                    <div className="exl-tags">
                                        <span className="exl-tag">{ex.muscle}</span>
                                        <span className="exl-tag ghost">{ex.equipment}</span>
                                        <span className="exl-tag ghost">{ex.mechanic}</span>
                                    </div>
                                </div>
                                <ChevronDown size={16} className={`exl-chev ${isOpen ? 'rot' : ''}`} />
                            </button>

                            {isOpen && (
                                <div className="exl-card-body">
                                    <div className="exl-info">{ex.info}</div>
                                    {onAddExercise && (
                                        <button className="exl-add-btn" onClick={() => onAddExercise(ex.id, ex.name)}>
                                            <Dumbbell size={14} /> ADD TO WORKOUT
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}