import { getLeaderboard, getCurrentLeagueTier } from '../data/friendsData';
import { getLevel } from '../store/xpEngine';
import { calcDayXP } from '../store/xpEngine';
import { Trophy, TrendingUp, TrendingDown, Minus, Crown, Flame } from 'lucide-react';
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
                    <Trophy size={22} color={tier.color} />
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
                                {rank === 1 ? <Crown size={14} color="var(--c-gold)" fill="var(--c-gold)" /> : rank}
                            </div>
                            <div className="league-player-avatar" style={{ background: p.avatar }}>{p.name[0]}</div>
                            <div className="league-player-info">
                                <div className="league-player-name">{p.name} {p.isYou && <span className="league-you-tag">YOU</span>}</div>
                                <div className="league-player-meta">LVL {p.level} · <Flame size={9} fill="currentColor" /> {p.streak}</div>
                            </div>
                            <div className="league-xp">{p.weeklyXP} XP</div>
                            <div className="league-zone-icon">
                                {isPromo && <TrendingUp size={12} color="var(--c-green)" />}
                                {isDemo && <TrendingDown size={12} color="var(--c-red)" />}
                                {!isPromo && !isDemo && <Minus size={12} opacity={0.2} />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
