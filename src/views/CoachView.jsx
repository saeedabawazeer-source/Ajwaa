import { useState } from 'react';
import KenneyIcon from '../components/KenneyIcon';
import { useStore } from '../store/useStore';
import './CoachView.css';

export default function CoachView() {
    const store = useStore();
    const { state, sendCoachAdvice, toggleCoachRole } = store;
    const students = state.coachStudents || [];
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Form inputs for advising a student
    const [adviceText, setAdviceText] = useState('');
    const [newCals, setNewCals] = useState('');
    const [newP, setNewP] = useState('');
    const [newC, setNewC] = useState('');
    const [newF, setNewF] = useState('');
    const [successMsg, setSuccessMsg] = useState(null);

    function openAdviceModal(st) {
        setSelectedStudent(st);
        setAdviceText(st.note || '');
        setNewCals(st.calTarget || '');
        setNewP(st.pTarget || '');
        setNewC(st.cTarget || '');
        setNewF(st.fTarget || '');
    }

    function handleSend() {
        if (!selectedStudent || !adviceText) return;
        sendCoachAdvice(selectedStudent.id, adviceText, newCals, newP, newC, newF);
        setSuccessMsg(`Tactical advice sent to ${selectedStudent.name}!`);
        setTimeout(() => setSuccessMsg(null), 3000);
        setSelectedStudent(null);
    }

    return (
        <div className="coach-single-screen">
            {/* Header */}
            <div className="coach-hdr-card card">
                <div className="coach-badge-wrap">
                    <div className="coach-badge-icon">
                        <KenneyIcon name="star" size={18} tint="volt" />
                    </div>
                    <div>
                        <div className="coach-title">FITNESS COACH HUB</div>
                        <div className="coach-sub">TACTICAL STUDENT MACRO AUDIT</div>
                    </div>
                </div>

                <div className="coach-stats-pill">
                    <span className="csp-num">{students.length}</span>
                    <span className="csp-lbl">STUDENTS</span>
                </div>
            </div>

            {/* Success Toast */}
            {successMsg && (
                <div className="coach-toast">
                    <KenneyIcon name="check" size={16} /> {successMsg}
                </div>
            )}

            {/* Students Feed Roster */}
            <div className="students-feed-list">
                {students.map(st => {
                    const calPct = Math.min((st.calsEaten / st.calTarget) * 100, 100);
                    const pPct = Math.min((st.p / st.pTarget) * 100, 100);
                    const cPct = Math.min((st.c / st.cTarget) * 100, 100);
                    const fPct = Math.min((st.f / st.fTarget) * 100, 100);

                    return (
                        <div key={st.id} className={`student-card card ${st.status}`}>
                            <div className="st-card-top">
                                <div className="st-avatar">{st.avatar}</div>
                                <div className="st-info">
                                    <div className="st-name">{st.name}</div>
                                    <div className="st-goal">{st.goal} · Active {st.lastLog}</div>
                                </div>
                                <span className={`st-status-pill ${st.status}`}>
                                    {st.status === 'warning' ? '⚠️ MACRO LAG' : '✓ ON TARGET'}
                                </span>
                            </div>

                            {/* Macro Split Tracking Bars */}
                            <div className="st-macros-grid">
                                <div className="st-mcard">
                                    <div className="st-mhdr">
                                        <span>CALORIES</span>
                                        <span>{st.calsEaten} / {st.calTarget}</span>
                                    </div>
                                    <div className="st-mtrack"><div className="st-mfill" style={{ width: `${calPct}%`, background: 'var(--c-red)' }} /></div>
                                </div>

                                <div className="st-macros-row-3">
                                    <div className="st-mr-box">
                                        <div className="st-mr-lbl">P: {st.p}g / {st.pTarget}g</div>
                                        <div className="st-mtrack"><div className="st-mfill" style={{ width: `${pPct}%`, background: 'var(--c-gold)' }} /></div>
                                    </div>
                                    <div className="st-mr-box">
                                        <div className="st-mr-lbl">C: {st.c}g / {st.cTarget}g</div>
                                        <div className="st-mtrack"><div class="st-mfill" style={{ width: `${cPct}%`, background: '#3B82F6' }} /></div>
                                    </div>
                                    <div className="st-mr-box">
                                        <div className="st-mr-lbl">F: {st.f}g / {st.fTarget}g</div>
                                        <div className="st-mtrack"><div className="st-mfill" style={{ width: `${fPct}%`, background: '#EAB308' }} /></div>
                                    </div>
                                </div>
                            </div>

                            {/* Workout & Water Activity */}
                            <div className="st-activity-row">
                                <div className="st-act-item">
                                    <KenneyIcon name="fist" size={14} /> <span>{st.lastWorkout}</span>
                                </div>
                                <div className="st-act-item">
                                    <KenneyIcon name="plus" size={14} /> <span>{st.water}L / {st.waterTarget}L</span>
                                </div>
                            </div>

                            {/* Coach Note & Direct Action Button */}
                            {st.note && (
                                <div className="st-coach-note">
                                    <strong>Coach Note:</strong> "{st.note}"
                                </div>
                            )}

                            <button className="st-advise-btn btn" onClick={() => openAdviceModal(st)}>
                                <KenneyIcon name="star" size={14} /> AUDIT &amp; ADJUST MACROS
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* ADVISE & ADJUST MODAL DRAWER */}
            {selectedStudent && (
                <div className="coach-modal-overlay" onClick={() => setSelectedStudent(null)}>
                    <div className="coach-modal-card" onClick={e => e.stopPropagation()}>
                        <div className="cm-header">
                            <div className="cm-title">
                                <KenneyIcon name="star" size={18} />
                                <span>ADVISE {selectedStudent.name.toUpperCase()}</span>
                            </div>
                            <button className="cm-close" onClick={() => setSelectedStudent(null)}>×</button>
                        </div>

                        <div className="cm-body">
                            <div className="cm-group">
                                <label>TACTICAL COACH RECOMMENDATION</label>
                                <textarea
                                    className="cm-textarea"
                                    value={adviceText}
                                    onChange={e => setAdviceText(e.target.value)}
                                    placeholder="Provide actionable feedback (e.g. Increase protein post-workout...)"
                                />
                            </div>

                            <div className="cm-group">
                                <label>ADJUST TARGET CALORIES &amp; MACROS</label>
                                <div className="cm-inputs-grid">
                                    <div>
                                        <span className="cm-lbl">CALORIES</span>
                                        <input type="number" className="cm-input" value={newCals} onChange={e => setNewCals(e.target.value)} />
                                    </div>
                                    <div>
                                        <span className="cm-lbl">PROTEIN (G)</span>
                                        <input type="number" className="cm-input" value={newP} onChange={e => setNewP(e.target.value)} />
                                    </div>
                                    <div>
                                        <span className="cm-lbl">CARBS (G)</span>
                                        <input type="number" className="cm-input" value={newC} onChange={e => setNewC(e.target.value)} />
                                    </div>
                                    <div>
                                        <span className="cm-lbl">FATS (G)</span>
                                        <input type="number" className="cm-input" value={newF} onChange={e => setNewF(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <button className="cm-submit-btn btn" onClick={handleSave}>
                                DISPATCH TACTICAL FEEDBACK →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
