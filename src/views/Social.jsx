import { useState } from 'react';
import KenneyIcon from '../components/KenneyIcon';
import { getFriendsFeed } from '../data/friendsData';
import { useStore } from '../store/useStore';
import './Social.css';

function getCheckInFeed() {
    const feed = getFriendsFeed();
    const checkIns = [];
    const today = new Date();

    feed.forEach((f, i) => {
        if (f.workout) {
            checkIns.push({
                id: `${f.id}-wo`,
                name: f.name,
                avatar: f.avatar,
                type: 'workout',
                title: f.workout.title,
                time: getTimeAgo(i * 2 + 1),
                caption: `Just finished ${f.workout.title}`,
                xp: Math.floor(Math.random() * 80) + 30,
            });
        }

        if (Math.sin(today.getDate() + i * 13) > 0) {
            const meals = ['Chicken & Rice Bowl', 'Protein Shake + Oats', 'Salmon Poke Bowl', 'Greek Yogurt Parfait', 'Turkey Wrap'];
            checkIns.push({
                id: `${f.id}-meal`,
                name: f.name,
                avatar: f.avatar,
                type: 'meal',
                title: meals[i % meals.length],
                time: getTimeAgo(i * 2 + 3),
                caption: 'Clean eating today',
                xp: Math.floor(Math.random() * 30) + 10,
            });
        }
    });

    return checkIns.sort(() => Math.random() - 0.5);
}

function getTimeAgo(hours) {
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1h ago';
    if (hours < 24) return `${hours}h ago`;
    return '1d ago';
}

export default function Social({ onCopyWorkout }) {
    const { state, toggleSocialCheer } = useStore();
    const [tab, setTab] = useState('checkins');
    const feed = getFriendsFeed();
    const checkIns = getCheckInFeed();
    const [expanded, setExpanded] = useState(null);
    const [nudged, setNudged] = useState({});

    function handleCopy(workout) {
        if (onCopyWorkout && workout) {
            onCopyWorkout(workout.title, workout.exercises);
        }
    }

    function handleNudge(friendId) {
        setNudged(prev => ({ ...prev, [friendId]: true }));
        setTimeout(() => setNudged(prev => ({ ...prev, [friendId]: false })), 2000);
    }

    const socialReactions = state.socialReactions || {};

    return (
        <div className="so-page">
            {/* Tabs */}
            <div className="so-tabs">
                <button className={`so-tab ${tab === 'checkins' ? 'active' : ''}`} onClick={() => setTab('checkins')}>
                    <KenneyIcon name="camera" size={14} />
                    <span>Check-Ins</span>
                </button>
                <button className={`so-tab ${tab === 'friends' ? 'active' : ''}`} onClick={() => setTab('friends')}>
                    <KenneyIcon name="social" size={14} />
                    <span>Friends</span>
                </button>
            </div>

            {/* Check-Ins Tab */}
            {tab === 'checkins' && (
                <div className="so-checkin-list">
                    {checkIns.length === 0 ? (
                        <div className="so-empty">
                            <KenneyIcon name="camera" size={40} style={{ opacity: 0.2 }} />
                            <div>No check-ins yet today</div>
                        </div>
                    ) : (
                        checkIns.map(c => {
                            const reaction = socialReactions[c.id] || { cheers: Math.floor(Math.sin(c.id.length * 3) * 4) + 2, userCheered: false };

                            return (
                                <div key={c.id} className="so-checkin-card">
                                    <div className="so-checkin-header">
                                        <div className="so-checkin-avatar" style={{ background: c.avatar }}>{c.name[0]}</div>
                                        <div className="so-checkin-who">
                                            <span className="so-checkin-name">{c.name}</span>
                                            <span className="so-checkin-time">{c.time}</span>
                                        </div>
                                        <div className="so-checkin-type-badge" data-type={c.type}>
                                            {c.type === 'workout' ? <KenneyIcon name="fist" size={11} /> : <KenneyIcon name="food" size={11} />}
                                            {c.type === 'workout' ? 'Workout' : 'Meal'}
                                        </div>
                                    </div>
                                    <div className="so-checkin-photo" data-type={c.type}>
                                        <div className="so-checkin-photo-icon">
                                            {c.type === 'workout' ? <KenneyIcon name="fist" size={28} tint="volt" /> : <KenneyIcon name="food" size={28} />}
                                        </div>
                                        <div className="so-checkin-photo-title">{c.title}</div>
                                    </div>
                                    <div className="so-checkin-footer">
                                        <span className="so-checkin-caption">{c.caption}</span>
                                        <div className="so-checkin-actions-row">
                                            <button 
                                                className={`so-cheer-btn ${reaction.userCheered ? 'cheered' : ''}`}
                                                onClick={() => toggleSocialCheer(c.id)}
                                            >
                                                <KenneyIcon name="power" size={12} tint={reaction.userCheered ? 'white' : 'black'} />
                                                <span>{reaction.cheers}</span>
                                            </button>
                                            <span className="so-checkin-xp">+{c.xp} XP</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Friends Tab */}
            {tab === 'friends' && (
                <div className="so-friends-list">
                    {feed.map(f => (
                        <div key={f.id} className="so-friend-card">
                            <div className="so-friend-row">
                                <div className="so-friend-avatar" style={{ background: f.avatar }}>{f.name[0]}</div>
                                <div className="so-friend-info" onClick={() => f.workout && setExpanded(expanded === f.id ? null : f.id)}>
                                    <div className="so-friend-name">{f.name}</div>
                                    <div className="so-friend-meta">
                                        LVL {f.level} <KenneyIcon name="power" size={10} /> {f.streak}
                                        {f.hitTarget && <span className="so-hit"> <KenneyIcon name="check" size={10} /> Hit target</span>}
                                    </div>
                                </div>
                                <div className="so-friend-actions">
                                    {f.workout && (
                                        <div className="so-wo-badge" onClick={() => setExpanded(expanded === f.id ? null : f.id)}>
                                            <KenneyIcon name="fist" size={11} /> {f.workout.title}
                                            {expanded === f.id ? <KenneyIcon name="arrowUp" size={12} /> : <KenneyIcon name="arrowDown" size={12} />}
                                        </div>
                                    )}
                                    <button 
                                        className={`so-nudge-btn ${nudged[f.id] ? 'sent' : ''}`}
                                        onClick={() => handleNudge(f.id)}
                                        disabled={nudged[f.id]}
                                    >
                                        <KenneyIcon name="arrowRight" size={12} tint="volt" />
                                        {nudged[f.id] ? 'SENT' : 'NUDGE'}
                                    </button>
                                </div>
                            </div>

                            {expanded === f.id && f.workout && (
                                <div className="so-workout-detail">
                                    {f.workout.exercises.map((ex, i) => {
                                        const best = ex.sets.reduce((b, s) => s.weight > b.weight ? s : b, { reps: 0, weight: 0 });
                                        return (
                                            <div key={i} className="so-ex-row">
                                                <span className="so-ex-name">{ex.name}</span>
                                                <span className="so-ex-stats">{ex.sets.length}x{best.reps} @ {best.weight}kg</span>
                                            </div>
                                        );
                                    })}
                                    <button className="so-copy-btn" onClick={() => handleCopy(f.workout)}>
                                        <KenneyIcon name="plus" size={13} /> COPY WORKOUT
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
