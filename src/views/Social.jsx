import { useState } from 'react';
import FriendsFeed from './FriendsFeed';
import League from './League';
import './Social.css';

export default function Social({ userName, xp, streak, onCopyWorkout }) {
    const [tab, setTab] = useState('friends');

    return (
        <div className="view-section">
            <div className="social-tabs">
                <button className={`so-tab ${tab === 'friends' ? 'active' : ''}`} onClick={() => setTab('friends')}>
                    Friends
                </button>
                <button className={`so-tab ${tab === 'league' ? 'active' : ''}`} onClick={() => setTab('league')}>
                    League
                </button>
            </div>

            {tab === 'friends' && <FriendsFeed onCopyWorkout={onCopyWorkout} />}
            {tab === 'league' && <League userName={userName} xp={xp} streak={streak} />}
        </div>
    );
}
