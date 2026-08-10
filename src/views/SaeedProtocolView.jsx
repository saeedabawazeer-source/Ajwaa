import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import KenneyIcon from '../components/KenneyIcon';
import './SaeedProtocolView.css';

export default function SaeedProtocolView() {
    const store = useStore();
    const { state, getSaeedTodayLog, logSaeedBend, logSaeedMorningVacuums, logSaeedAccumulation, toggleSaeedGrowthExercise, setSaeedDayNumber, updateSaeedNotificationSettings } = store;
    
    const todayKey = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const currentKey = todayKey();
    const log = getSaeedTodayLog(currentKey);
    const dayNumber = state.saeedProtocol?.dayNumber || 1;
    const notifSettings = state.saeedProtocol?.notificationSettings || {};

    // Vacuum / Hold Timer State
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerTarget, setTimerTarget] = useState(45);
    const [timeLeft, setTimeLeft] = useState(45);
    const [timerType, setTimerType] = useState('vacuums');

    // Notification Permission State
    const [notifPermission, setNotifPermission] = useState(
        typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
    );

    useEffect(() => {
        let interval = null;
        if (timerRunning && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && timerRunning) {
            setTimerRunning(false);
            if (timerType === 'vacuums') {
                logSaeedAccumulation('vacuumsSets', 1, currentKey);
            } else if (timerType === 'hollow') {
                logSaeedAccumulation('hollowHoldsSets', 1, currentKey);
            }
            setTimeLeft(timerTarget);
        }
        return () => clearInterval(interval);
    }, [timerRunning, timeLeft, timerType, timerTarget, currentKey, logSaeedAccumulation]);

    function startTimer(type, seconds) {
        setTimerType(type);
        setTimerTarget(seconds);
        setTimeLeft(seconds);
        setTimerRunning(true);
    }

    function toggleTimer() {
        setTimerRunning(prev => !prev);
    }

    function resetTimer() {
        setTimerRunning(false);
        setTimeLeft(timerTarget);
    }

    async function requestNotifPermission() {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            alert('Notifications not supported in this browser.');
            return;
        }
        try {
            const perm = await Notification.requestPermission();
            setNotifPermission(perm);
            if (perm === 'granted') {
                updateSaeedNotificationSettings({ enabled: true });
                if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({
                        type: 'SCHEDULE_ACCUMULATION_REMINDER',
                        intervalMinutes: 60
                    });
                }
                new Notification('Saeed Protocol Activated', {
                    body: 'Accumulation reminders active! Squeeze and hold tight.',
                    icon: '/vite.svg'
                });
            }
        } catch (e) {
            console.error('Notification error', e);
        }
    }

    // Calculations
    const pushupPct = Math.min(100, Math.round(((log.pushups || 0) / 500) * 100));
    const vacuumPct = Math.min(100, Math.round(((log.vacuumsSets || 0) / 15) * 100));
    const hollowPct = Math.min(100, Math.round(((log.hollowHoldsSets || 0) / 8) * 100));
    const rowsPct = Math.min(100, Math.round(((log.doorframeRows || 0) / 125) * 100));

    const gs = log.growthSession || {};
    const growthCount = Object.values(gs).filter(Boolean).length;

    return (
        <div className="saeed-clean-app">
            {/* Header */}
            <header className="saeed-hdr card">
                <div className="saeed-hdr-row">
                    <div>
                        <h1 className="saeed-title">SAEED PROTOCOL</h1>
                        <p className="saeed-subtitle">30-Day Buff &amp; Anytime Accumulation</p>
                    </div>
                    <button 
                        className={`saeed-notif-chip ${notifPermission === 'granted' ? 'active' : ''}`}
                        onClick={requestNotifPermission}
                    >
                        <KenneyIcon name="star" size={14} />
                        <span>{notifPermission === 'granted' ? 'REMINDERS ACTIVE' : 'ENABLE REMINDERS'}</span>
                    </button>
                </div>

                {/* Day selector */}
                <div className="saeed-day-strip">
                    <span className="sds-label">DAY {dayNumber}/30</span>
                    <div className="sds-pills">
                        {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
                            <button
                                key={d}
                                className={`sds-pill ${dayNumber === d ? 'active' : ''}`}
                                onClick={() => setSaeedDayNumber(d)}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Scrollable Content Body */}
            <div className="saeed-body-pane">

                {/* 1. Morning Empty Stomach Protocol */}
                <section className="saeed-card card">
                    <div className="card-hdr">
                        <h2>1. MORNING (EMPTY STOMACH)</h2>
                        <span className="pill-tag">MANDATORY</span>
                    </div>

                    <div className="morning-tiles">
                        {/* Bend Yoga Check */}
                        <div className={`tile-check ${log.bendDone ? 'complete' : ''}`} onClick={() => logSaeedBend(currentKey)}>
                            <div className="tc-hdr">
                                <span className="tc-title">BEND (YOGA)</span>
                                <span className="tc-badge">{log.bendDone ? 'DONE' : 'PENDING'}</span>
                            </div>
                            <p className="tc-sub">Morning mobility flow on empty stomach.</p>
                            <button className="tc-action-btn">{log.bendDone ? '✓ BEND COMPLETED' : 'MARK BEND DONE'}</button>
                        </div>

                        {/* 5 Standing Vacuums */}
                        <div className={`tile-check ${log.morningVacuumsDone ? 'complete' : ''}`} onClick={() => logSaeedMorningVacuums(currentKey)}>
                            <div className="tc-hdr">
                                <span className="tc-title">5 VACUUMS</span>
                                <span className="tc-badge">{log.morningVacuumsDone ? 'DONE' : 'PENDING'}</span>
                            </div>
                            <p className="tc-sub">5x 30-60s holds before breakfast.</p>
                            <button className="tc-action-btn">{log.morningVacuumsDone ? '✓ 5 VACUUMS DONE' : 'MARK 5 VACUUMS DONE'}</button>
                        </div>
                    </div>
                </section>

                {/* Vacuum Hold Timer */}
                <section className="saeed-card card timer-card">
                    <div className="card-hdr">
                        <h2>STOMACH VACUUM TIMER</h2>
                        <span className="pill-tag volt">TRANSVERSUS ABDOMINIS</span>
                    </div>

                    <div className="timer-guide">
                        <strong>Form:</strong> Stand tall. Exhale ALL air out of your lungs. Pull belly button in as far as possible toward spine &amp; under ribs.
                    </div>

                    <div className="timer-display">
                        <div className="timer-seconds">{timeLeft}s</div>
                        <p className="timer-target-lbl">TARGET HOLD ({timerTarget}S)</p>

                        <div className="timer-actions">
                            <button className="btn-main-volt" onClick={toggleTimer}>
                                {timerRunning ? 'PAUSE HOLD' : 'START HOLD TIMER'}
                            </button>
                            <button className="btn-sec-outline" onClick={resetTimer}>RESET</button>
                        </div>

                        <div className="timer-preset-row">
                            {[30, 45, 60].map(sec => (
                                <button 
                                    key={sec} 
                                    className={`preset-btn ${timerTarget === sec ? 'active' : ''}`}
                                    onClick={() => { setTimerTarget(sec); setTimeLeft(sec); setTimerRunning(false); }}
                                >
                                    {sec}S
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 2. Full Day Accumulation */}
                <section className="saeed-card card">
                    <div className="card-hdr">
                        <h2>2. ANYTIME ACCUMULATION</h2>
                        <span className="pill-tag">ALL DAY BURSTS</span>
                    </div>

                    <div className="acc-rows">
                        {/* Push-ups */}
                        <div className="acc-item">
                            <div className="acc-item-hdr">
                                <div>
                                    <div className="acc-item-title">PUSH-UPS</div>
                                    <div className="acc-item-sub">Target: 500 total (sets of 25–40)</div>
                                </div>
                                <div className="acc-score">{log.pushups || 0} / 500</div>
                            </div>
                            <div className="acc-bar">
                                <div className="acc-fill" style={{ width: `${pushupPct}%`, background: 'var(--c-red)' }} />
                            </div>
                            <div className="acc-btns">
                                <button className="btn-log" onClick={() => logSaeedAccumulation('pushups', 25, currentKey)}>+25</button>
                                <button className="btn-log" onClick={() => logSaeedAccumulation('pushups', 30, currentKey)}>+30</button>
                                <button className="btn-log" onClick={() => logSaeedAccumulation('pushups', 40, currentKey)}>+40</button>
                                <button className="btn-log" onClick={() => logSaeedAccumulation('pushups', 50, currentKey)}>+50</button>
                                <button className="btn-log-sub" onClick={() => logSaeedAccumulation('pushups', -25, currentKey)}>-25</button>
                            </div>
                        </div>

                        {/* Stomach Vacuums */}
                        <div className="acc-item">
                            <div className="acc-item-hdr">
                                <div>
                                    <div className="acc-item-title">STOMACH VACUUMS</div>
                                    <div className="acc-item-sub">Target: 10–20 sets (30–60s holds)</div>
                                </div>
                                <div className="acc-score">{log.vacuumsSets || 0} / 15 SETS</div>
                            </div>
                            <div className="acc-bar">
                                <div className="acc-fill" style={{ width: `${vacuumPct}%`, background: 'var(--c-volt)' }} />
                            </div>
                            <div className="acc-btns">
                                <button className="btn-log" onClick={() => startTimer('vacuums', 45)}>45S TIMER</button>
                                <button className="btn-log" onClick={() => logSaeedAccumulation('vacuumsSets', 1, currentKey)}>+1 SET</button>
                                <button className="btn-log" onClick={() => logSaeedAccumulation('vacuumsSets', 2, currentKey)}>+2 SETS</button>
                                <button className="btn-log-sub" onClick={() => logSaeedAccumulation('vacuumsSets', -1, currentKey)}>-1</button>
                            </div>
                        </div>

                        {/* Hollow Body Holds */}
                        <div className="acc-item">
                            <div className="acc-item-hdr">
                                <div>
                                    <div className="acc-item-title">HOLLOW BODY HOLDS</div>
                                    <div className="acc-item-sub">Target: 5–10 sets (30–60s holds)</div>
                                </div>
                                <div className="acc-score">{log.hollowHoldsSets || 0} / 8 SETS</div>
                            </div>
                            <div className="acc-bar">
                                <div className="acc-fill" style={{ width: `${hollowPct}%`, background: '#3B82F6' }} />
                            </div>
                            <div className="acc-btns">
                                <button className="btn-log" onClick={() => startTimer('hollow', 45)}>45S TIMER</button>
                                <button className="btn-log" onClick={() => logSaeedAccumulation('hollowHoldsSets', 1, currentKey)}>+1 SET</button>
                                <button className="btn-log" onClick={() => logSaeedAccumulation('hollowHoldsSets', 2, currentKey)}>+2 SETS</button>
                                <button className="btn-log-sub" onClick={() => logSaeedAccumulation('hollowHoldsSets', -1, currentKey)}>-1</button>
                            </div>
                        </div>

                        {/* Doorframe Rows */}
                        <div className="acc-item">
                            <div className="acc-item-hdr">
                                <div>
                                    <div className="acc-item-title">DOORFRAME ROWS</div>
                                    <div className="acc-item-sub">Target: 100–150 total (pulling motion)</div>
                                </div>
                                <div className="acc-score">{log.doorframeRows || 0} / 125</div>
                            </div>
                            <div className="acc-bar">
                                <div className="acc-fill" style={{ width: `${rowsPct}%`, background: '#EAB308' }} />
                            </div>
                            <div className="acc-btns">
                                <button className="btn-log" onClick={() => logSaeedAccumulation('doorframeRows', 15, currentKey)}>+15</button>
                                <button className="btn-log" onClick={() => logSaeedAccumulation('doorframeRows', 25, currentKey)}>+25</button>
                                <button className="btn-log" onClick={() => logSaeedAccumulation('doorframeRows', 30, currentKey)}>+30</button>
                                <button className="btn-log-sub" onClick={() => logSaeedAccumulation('doorframeRows', -15, currentKey)}>-15</button>
                            </div>
                        </div>

                    </div>
                </section>

                {/* 3. Growth Session */}
                <section className="saeed-card card">
                    <div className="card-hdr">
                        <h2>3. GROWTH SESSION</h2>
                        <span className="pill-tag">{growthCount}/5 COMPLETED</span>
                    </div>

                    <div className="growth-list">
                        {[
                            { key: 'pikePushups', name: 'Pike Push-ups', target: '4 x 10–12', desc: 'Shoulder & Upper Chest Mass' },
                            { key: 'splitSquats', name: 'Bulgarian Split Squats', target: '4 x 12', desc: 'Leg & Glute Mass' },
                            { key: 'weightedVups', name: 'Weighted V-Ups', target: '4 x 15', desc: 'Direct Ab Crunch' },
                            { key: 'bicepCurls', name: 'Bicep Curls (Water Jugs)', target: '4 x 20', desc: 'Slow Tempo Control' },
                            { key: 'plankDownwardDog', name: 'Plank to Downward Dog', target: '3 x 15', desc: 'Core & Shoulder Stability' }
                        ].map(item => {
                            const done = Boolean(gs[item.key]);
                            return (
                                <div key={item.key} className={`growth-box ${done ? 'done' : ''}`} onClick={() => toggleSaeedGrowthExercise(item.key, currentKey)}>
                                    <div className="gb-check">{done ? '✓' : ''}</div>
                                    <div className="gb-info">
                                        <div className="gb-name">{item.name}</div>
                                        <div className="gb-sub">{item.desc}</div>
                                    </div>
                                    <div className="gb-target">{item.target}</div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 4. Tips & Lower Back Pain Warning */}
                <section className="saeed-card card tips-section">
                    <div className="card-hdr">
                        <h2>4. PROTOCOL RULES &amp; SAFETY</h2>
                    </div>

                    <div className="rules-grid">
                        <div className="rule-item">
                            <strong>Mind-Muscle Connection:</strong> Squeeze target muscle intentionally. For abs, pull ribs down toward pelvis.
                        </div>
                        <div className="rule-item">
                            <strong>Skin Tightening:</strong> High protein (salmon, eggs, feta, lean meats) + aggressive water intake.
                        </div>
                        <div className="rule-item">
                            <strong>500 Push-up Rule:</strong> Vary hand width if front delts feel inflamed.
                        </div>
                        <div className="rule-item">
                            <strong>Volume Rule:</strong> Miss an hour? Double the next hour. Total daily volume is what changes physique.
                        </div>
                    </div>

                    <div className="safety-alert">
                        <div className="sa-hdr">
                            <KenneyIcon name="cross" size={16} />
                            <span>SAFETY WARNING</span>
                        </div>
                        <p>
                            If you feel sharp lower back pain during Hollow Holds or V-ups, stop immediately. Rest 5 minutes and focus on deep breathing before continuing.
                        </p>
                    </div>
                </section>

            </div>
        </div>
    );
}
