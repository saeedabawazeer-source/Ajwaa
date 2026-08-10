import { getDailyQuests, checkQuests } from '../store/questEngine';
import { useStore } from '../store/useStore';
import KenneyIcon from './KenneyIcon';
import './DailyQuests.css';

export default function DailyQuests() {
    const { state, claimQuestXP } = useStore();
    const dateKey = new Date().toISOString().split('T')[0];
    const today = state.days[dateKey] || { meals: { breakfast: [], lunch: [], dinner: [], snacks: [] }, workouts: [], water: 0 };

    const rawQuests = getDailyQuests(dateKey);
    const evaluatedQuests = checkQuests(rawQuests, today, state.user);
    const claimedList = state.claimedQuests?.[dateKey] || [];

    return (
        <div className="quest-card">
            <div className="quest-header">
                <div className="quest-title-wrap">
                    <KenneyIcon name="coin" size={20} />
                    <span className="quest-title">DAILY BATTLE QUESTS</span>
                </div>
                <div className="quest-count">
                    {claimedList.length} / {evaluatedQuests.length} DONE
                </div>
            </div>

            <div className="quest-list">
                {evaluatedQuests.map(q => {
                    const isDone = q.done;
                    const isClaimed = claimedList.includes(q.id);
                    const pct = Math.min((q.current / q.target) * 100, 100);

                    return (
                        <div key={q.id} className={`quest-item ${isClaimed ? 'claimed' : isDone ? 'ready' : ''}`}>
                            <div className="quest-info">
                                <div className="quest-item-title">
                                    <span>{q.title}</span>
                                    <span className="quest-xp">+{q.xp} XP</span>
                                </div>
                                <div className="quest-desc">{q.desc}</div>
                                <div className="quest-bar-bg">
                                    <div className="quest-bar-fill" style={{ width: `${pct}%` }} />
                                </div>
                            </div>

                            <div className="quest-action">
                                {isClaimed ? (
                                    <span className="quest-done-tag"><KenneyIcon name="check" size={14} /> CLAIMED</span>
                                ) : isDone ? (
                                    <button className="quest-claim-btn" onClick={() => claimQuestXP(q.id, q.xp)}>
                                        <KenneyIcon name="star" size={14} /> CLAIM
                                    </button>
                                ) : (
                                    <span className="quest-prog-tag">{q.current} / {q.target}</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
