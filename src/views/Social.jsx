import { useState } from 'react';
import { getFriendsFeed } from '../data/friendsData';
import { Flame, Dumbbell, CheckCircle, Camera, Utensils, ChevronDown, ChevronUp, Copy, Users, Image } from 'lucide-react';
import './Social.css';

// Generate mock check-in feed (friend photos of workouts/meals)
function getCheckInFeed() {
    const feed = getFriendsFeed();
    const checkIns = [];
    const today = new Date();

    feed.forEach((f, i) => {
        // Workout check-in
        if (f.workout) {
            checkIns.push({
                id: `${f.id}-wo`,
                name: f.name,
                avatar: f.avatar,
                type: 'workout',
                title: f.workout.title,
                time: getTimeAgo(i * 2 + 1),
                caption: `Just finished ${f.workout.title}! 💪`,
                xp: Math.floor(Math.random() * 80) + 30,
            });
        }

        // Meal check-in (50% chance)
        if (Math.sin(today.getDate() + i * 13) > 0) {
            const meals = ['Chicken & Rice Bowl', 'Protein Shake + Oats', 'Salmon Poke Bowl', 'Greek Yogurt Parfait', 'Turkey Wrap'];
            checkIns.push({
                id: `${f.id}-meal`,
                name: f.name,
                avatar: f.avatar,
                type: 'meal',
                title: meals[i % meals.length],
                time: getTimeAgo(i * 2 + 3),
                caption: `Clean eating today 🥗`,
                xp: Math.floor(Math.random() * 30) + 10,
            });
        }
    });

    // Sort by time (just shuffle-ish for variety)
    return checkIns.sort(() => Math.random() - 0.5);
}

function getTimeAgo(hours) {
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1h ago';
    if (hours < 24) return `${hours}h ago`;
    return '1d ago';
}

export default function Social({ userName, xp, streak, onCopyWorkout }) {
    const [tab, setTab] = useState('friends');
    const feed = getFriendsFeed();
    const checkIns = getCheckInFeed();
    const [expanded, setExpanded] = useState(null);

    function handleCopy(workout) {
        if (onCopyWorkout && workout) {
            onCopyWorkout(workout.title, workout.exercises);
        }
    }

    return (
        <div className="so-page">
            {/* Tabs */}
            <div className="so-tabs">
                <button className={`so-tab ${tab === 'friends' ? 'active' : ''}`} onClick={() => setTab('friends')}>
                    <Users size={14} />
                    <span>Friends</span>
                </button>
                <button className={`so-tab ${tab === 'checkins' ? 'active' : ''}`} onClick={() => setTab('checkins')}>
                    <Camera size={14} />
                    <span>Check-Ins</span>
                </button>
            </div>

            {/* ─── Friends Tab ─── */}
            {tab === 'friends' && (
                <div className="so-friends-list">
                    {feed.map(f => (
                        <div key={f.id} className="so-friend-card">
                            <div className="so-friend-row" onClick={() => f.workout && setExpanded(expanded === f.id ? null : f.id)}>
                                <div className="so-friend-avatar" style={{ background: f.avatar }}>{f.name[0]}</div>
                                <div className="so-friend-info">
                                    <div className="so-friend-name">{f.name}</div>
                                    <div className="so-friend-meta">
                                        LVL {f.level} · <Flame size={10} fill="currentColor" style={{ color: 'var(--c-red)' }} /> {f.streak}
                                        {f.hitTarget && <span className="so-hit"> · <CheckCircle size={10} /> Hit target</span>}
                                    </div>
                                </div>
                                <div className="so-friend-badge">
                                    {f.workout ? (
                                        <div className="so-wo-badge">
                                            <Dumbbell size={11} /> {f.workout.title}
                                            {expanded === f.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                        </div>
                                    ) : (
                                        <div className="so-rest-badge">Rest day</div>
                                    )}
                                </div>
                            </div>

                            {expanded === f.id && f.workout && (
                                <div className="so-workout-detail">
                                    {f.workout.exercises.map((ex, i) => {
                                        const best = ex.sets.reduce((b, s) => s.weight > b.weight ? s : b, { reps: 0, weight: 0 });
                                        return (
                                            <div key={i} className="so-ex-row">
                                                <span className="so-ex-name">{ex.name}</span>
                                                <span className="so-ex-stats">{ex.sets.length}×{best.reps} @ {best.weight}kg</span>
                                            </div>
                                        );
                                    })}
                                    <button className="so-copy-btn" onClick={() => handleCopy(f.workout)}>
                                        <Copy size={13} /> COPY WORKOUT
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ─── Check-Ins Tab ─── */}
            {tab === 'checkins' && (
                <div className="so-checkin-list">
                    {checkIns.length === 0 ? (
                        <div className="so-empty">
                            <Image size={40} opacity={0.2} />
                            <div>No check-ins yet today</div>
                        </div>
                    ) : (
                        checkIns.map(c => (
                            <div key={c.id} className="so-checkin-card">
                                <div className="so-checkin-header">
                                    <div className="so-checkin-avatar" style={{ background: c.avatar }}>{c.name[0]}</div>
                                    <div className="so-checkin-who">
                                        <span className="so-checkin-name">{c.name}</span>
                                        <span className="so-checkin-time">{c.time}</span>
                                    </div>
                                    <div className="so-checkin-type-badge" data-type={c.type}>
                                        {c.type === 'workout' ? <Dumbbell size={11} /> : <Utensils size={11} />}
                                        {c.type === 'workout' ? 'Workout' : 'Meal'}
                                    </div>
                                </div>
                                {/* Simulated photo area */}
                                <div className="so-checkin-photo" data-type={c.type}>
                                    <div className="so-checkin-photo-icon">
                                        {c.type === 'workout' ? <Dumbbell size={28} /> : <Utensils size={28} />}
                                    </div>
                                    <div className="so-checkin-photo-title">{c.title}</div>
                                </div>
                                <div className="so-checkin-footer">
                                    <span className="so-checkin-caption">{c.caption}</span>
                                    <span className="so-checkin-xp">+{c.xp} XP</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
