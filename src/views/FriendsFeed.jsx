import { useState } from 'react';
import { getFriendsFeed } from '../data/friendsData';
import { Flame, ChevronDown, ChevronUp, Copy, Dumbbell, CheckCircle } from 'lucide-react';
import './Social.css';

export default function FriendsFeed({ onCopyWorkout }) {
    const feed = getFriendsFeed();
    const [expanded, setExpanded] = useState(null);

    function toggleExpand(id) {
        setExpanded(expanded === id ? null : id);
    }

    function handleCopy(workout) {
        if (onCopyWorkout && workout) {
            onCopyWorkout(workout.title, workout.exercises);
        }
    }

    return (
        <div className="friends-feed">
            {feed.map(f => (
                <div key={f.id} className="card friend-card">
                    <div className="friend-row" onClick={() => f.workout && toggleExpand(f.id)}>
                        <div className="friend-avatar" style={{ background: f.avatar }}>{f.name[0]}</div>
                        <div className="friend-info">
                            <div className="friend-name">{f.name}</div>
                            <div className="friend-meta">
                                LVL {f.level} · <Flame size={10} fill="currentColor" style={{ color: 'var(--c-red)' }} /> {f.streak}
                                {f.hitTarget && <span className="friend-hit"> · <CheckCircle size={10} /> Hit target</span>}
                            </div>
                        </div>
                        <div className="friend-right">
                            {f.workout ? (
                                <div className="friend-workout-badge">
                                    <Dumbbell size={11} /> {f.workout.title}
                                    {expanded === f.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                </div>
                            ) : (
                                <div className="friend-rest-badge">Rest day</div>
                            )}
                        </div>
                    </div>

                    {expanded === f.id && f.workout && (
                        <div className="friend-workout-detail">
                            {f.workout.exercises.map((ex, i) => {
                                const best = ex.sets.reduce((b, s) => s.weight > b.weight ? s : b, { reps: 0, weight: 0 });
                                return (
                                    <div key={i} className="friend-ex-row">
                                        <span className="friend-ex-name">{ex.name}</span>
                                        <span className="friend-ex-stats">{ex.sets.length}×{best.reps} @ {best.weight}kg</span>
                                    </div>
                                );
                            })}
                            <button className="btn btn-volt friend-copy-btn" onClick={() => handleCopy(f.workout)}>
                                <Copy size={13} /> COPY WORKOUT
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
