import { WORKOUT_TEMPLATES } from '../data/workoutTemplates';
import { OWNER_PLAN } from '../data/secretPlan';
import './OwnerPlan.css';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function OwnerPlan({ onStartWorkout }) {
    const { targets, week, timeline, supplements, rules, profile } = OWNER_PLAN;
    const routine = WORKOUT_TEMPLATES.find(t => t.id === 'pull_a');
    const core = WORKOUT_TEMPLATES.find(t => t.id === 'core_finisher');
    const nameOf = id => WORKOUT_TEMPLATES.find(t => t.id === id)?.name || 'REST';

    return (
        <div className="op-page">
            <div className="op-head">
                <span className="op-badge">OWNER PLAN</span>
                <div className="op-title">2-Month Lean Recomp</div>
                <div className="op-sub">
                    {profile.weight}kg · {profile.height}cm · {targets.calories} kcal · {targets.water}L water
                </div>
            </div>

            <div className="op-targets">
                <div className="op-target"><span>CALORIES</span><strong>{targets.calories}</strong></div>
                <div className="op-target"><span>PROTEIN</span><strong>{targets.macros.p}g</strong></div>
                <div className="op-target"><span>CARBS</span><strong>{targets.macros.c}g</strong></div>
                <div className="op-target"><span>FAT</span><strong>{targets.macros.f}g</strong></div>
            </div>

            <div className="op-label">DAILY TIMELINE</div>
            <div className="op-timeline">
                {timeline.map(slot => (
                    <div className="op-slot" key={slot.time}>
                        <div className="op-slot-time">{slot.time}</div>
                        <div className="op-slot-body">
                            <div className="op-slot-title">{slot.title}</div>
                            <div className="op-slot-detail">{slot.detail}</div>
                            {slot.supps.length > 0 && (
                                <div className="op-chips">
                                    {slot.supps.map(s => <span className="op-chip" key={s}>{s}</span>)}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="op-label">SUPPLEMENTS</div>
            <div className="op-card">
                {supplements.map(s => (
                    <div className="op-supp" key={s.name}>
                        <div className="op-supp-name">{s.name}<span>{s.dose}</span></div>
                        <div className="op-supp-time">{s.timing}</div>
                    </div>
                ))}
            </div>

            <div className="op-label">WEEK</div>
            <div className="op-card op-week">
                {DAY_NAMES.map((day, i) => (
                    <div className={`op-day ${week[i] ? '' : 'rest'}`} key={day}>
                        <span>{day.slice(0, 3).toUpperCase()}</span>
                        <strong>{nameOf(week[i])}</strong>
                    </div>
                ))}
            </div>

            {routine && (
                <>
                    <div className="op-label">DAY 1 · {routine.name.toUpperCase()}</div>
                    <div className="op-card">
                        <div className="op-routine-desc">{routine.desc}<br />{routine.note}</div>
                        {routine.exercises.map(ex => (
                            <div className="op-ex" key={ex.exerciseId}>
                                <span>{ex.name}</span>
                                <strong>{ex.scheme}</strong>
                            </div>
                        ))}
                        <button className="op-start" onClick={() => onStartWorkout(routine.name, routine.exercises)}>
                            START PULL A
                        </button>
                    </div>
                </>
            )}

            {core && (
                <>
                    <div className="op-label">CORE · 3X A WEEK</div>
                    <div className="op-card">
                        {core.exercises.map(ex => (
                            <div className="op-ex" key={ex.exerciseId}>
                                <span>{ex.name}</span>
                                <strong>{ex.scheme}</strong>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <div className="op-label">RULES</div>
            <ul className="op-rules">
                {rules.map(r => <li key={r}>{r}</li>)}
            </ul>
        </div>
    );
}
