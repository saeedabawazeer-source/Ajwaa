import { useStore } from '../store/useStore';
import KenneyIcon from './KenneyIcon';
import './PersonalRecords.css';

export default function PersonalRecords() {
    const { getPersonalRecords } = useStore();
    const prs = getPersonalRecords();

    return (
        <div className="card pr-card">
            <div className="pr-header">
                <div className="pr-title-wrap">
                    <KenneyIcon name="trophy" size={22} />
                    <span className="pr-title">STRENGTH RECORDS & PRs</span>
                </div>
                <div className="pr-count">{prs.length} TRACKED</div>
            </div>

            {prs.length === 0 ? (
                <div className="pr-empty">
                    <KenneyIcon name="medal" size={36} style={{ opacity: 0.4 }} />
                    <div style={{ marginTop: 8 }}>No strength records logged yet. Finish a workout session to set your first 1RM record!</div>
                </div>
            ) : (
                <div className="pr-list">
                    {prs.map(pr => (
                        <div key={pr.exerciseName} className="pr-item">
                            <div className="pr-item-left">
                                <div className="pr-ex-name">{pr.exerciseName}</div>
                                <div className="pr-ex-date">Set on {pr.date}</div>
                            </div>
                            <div className="pr-item-right">
                                <div className="pr-weight-badge">
                                    <span>{pr.maxWeight} kg</span>
                                    <span className="pr-reps">x {pr.bestReps}</span>
                                </div>
                                <div className="pr-est-1rm">
                                    Est. 1RM: <strong>{pr.estimated1RM} kg</strong>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
