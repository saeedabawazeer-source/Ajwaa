import { getLeaderboard, getCurrentLeagueTier } from '../data/friendsData';
import { getLevel } from '../store/xpEngine';
import KenneyIcon from '../components/KenneyIcon';
import './Social.css';

export default function League({ userName, xp, streak }) {
    const level = getLevel(xp || 0);
    const tier = getCurrentLeagueTier(level);
    // Simulate your weekly XP as roughly level * 60
    const yourWeeklyXP = Math.floor((xp || 0) * 0.15) + 50;
    const board = getLeaderboard(userName, yourWeeklyXP, level, streak);

    // Top 2 promote, bottom 2 demote
    const promoZone = 2;
    const demoteZone = board.length - 2;

    return (
        <div className="league-container">
            {/* League Header */}
            <div className="league-header">
                <div className="league-tier-badge" style={{ borderColor: tier.color }}>
                    <KenneyIcon name="leaderboard" size={22} />
                </div>
                <div>
                    <div className="league-tier-name" style={{ color: tier.color }}>{tier.name} League</div>
                    <div className="text-label">Weekly leaderboard · Top 2 promote</div>
                </div>
            </div>

            {/* Leaderboard */}
            <div className="league-list">
                {board.map((p, i) => {
                    const rank = i + 1;
                    const isPromo = rank <= promoZone;
                    const isDemo = i >= demoteZone;
                    return (
                        <div key={p.id} className={`league-row ${p.isYou ? 'league-you' : ''} ${isPromo ? 'league-promo' : ''} ${isDemo ? 'league-demo' : ''}`}>
                            <div className="league-rank">
                                {rank === 1 ? <KenneyIcon name="star" size={14} tint={p.isYou ? "volt" : "black"} /> : rank}
                            </div>
                            <div className="league-player-avatar" style={{ background: p.avatar }}>{p.name[0]}</div>
                            <div className="league-player-info">
                                <div className="league-player-name">{p.name} {p.isYou && <span className="league-you-tag">YOU</span>}</div>
                                <div className="league-player-meta">LVL {p.level} · <KenneyIcon name="star" size={9} tint={p.isYou ? "volt" : "black"} /> {p.streak}</div>
                            </div>
                            <div className="league-xp">{p.weeklyXP} XP</div>
                            <div className="league-zone-icon">
                                {isPromo && <KenneyIcon name="arrowUp" size={12} tint={p.isYou ? "volt" : "black"} />}
                                {isDemo && <KenneyIcon name="arrowDown" size={12} tint={p.isYou ? "volt" : "black"} />}
                                {!isPromo && !isDemo && <KenneyIcon name="minus" size={12} style={{ opacity: 0.2 }} tint={p.isYou ? "volt" : "black"} />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
