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
    const [timerTarget, setTimerTarget] = useState(45); // 30s or 45s or 60s
    const [timeLeft, setTimeLeft] = useState(45);
    const [timerType, setTimerType] = useState('vacuums'); // 'vacuums' | 'hollow'

    // Notification Permission State
    const [notifPermission, setNotifPermission] = useState(
        typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
    );

    useEffect(() => {
        let interval = null;
        if (timerRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
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
            alert('Web Notifications are not supported in this browser environment.');
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
                    body: 'Accumulation reminders enabled! Keep your core tight throughout the day.',
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
    const growthCompletedCount = Object.values(gs).filter(Boolean).length;

    return (
        <div className="saeed-protocol-container">
            {/* Header & Protocol Day Selector */}
            <div className="saeed-hdr-card card">
                <div className="saeed-hdr-top">
                    <div className="saeed-badge-group">
                        <div className="saeed-role-badge">SAEED PERSONAL PROTOCOL</div>
                        <div className="saeed-title">30-DAY BUFF &amp; ANYTIME ACCUMULATION</div>
                    </div>
                    <button 
                        className={`saeed-notif-btn btn ${notifPermission === 'granted' ? 'active' : ''}`}
                        onClick={requestNotifPermission}
                    >
                        <KenneyIcon name="star" size={14} />
                        {notifPermission === 'granted' ? 'IOS NOTIFICATIONS ACTIVE' : 'ENABLE IOS REMINDERS'}
                    </button>
                </div>

                {/* Day selector 1 to 30 */}
                <div className="saeed-day-picker">
                    <span className="saeed-picker-label">CURRENT DAY:</span>
                    <div className="saeed-days-scroll">
                        {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
                            <button
                                key={d}
                                className={`saeed-day-btn ${dayNumber === d ? 'active' : ''}`}
                                onClick={() => setSaeedDayNumber(d)}
                            >
                                DAY {d}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Pane - Single Scroll Container */}
            <div className="saeed-content-pane">
                
                {/* MORNING PROTOCOL (EMPTY STOMACH) */}
                <div className="saeed-sec-card card">
                    <div className="saeed-sec-hdr">
                        <div className="saeed-sec-title">
                            <KenneyIcon name="power" size={16} />
                            <span>1. MORNING PROTOCOL (EMPTY STOMACH)</span>
                        </div>
                        <span className="saeed-tag-pill">DAILY MANDATORY</span>
                    </div>

                    <div className="saeed-morning-grid">
                        {/* Bend Check-in (Yoga) */}
                        <div className={`saeed-check-box ${log.bendDone ? 'done' : ''}`} onClick={() => logSaeedBend(currentKey)}>
                            <div className="scb-top">
                                <span className="scb-lbl">BEND (YOGA)</span>
                                <span className="scb-status">{log.bendDone ? '✓ COMPLETED' : 'PENDING'}</span>
                            </div>
                            <div className="scb-desc">Daily morning yoga flow for mobility and core warmth.</div>
                            <button className="scb-btn btn">{log.bendDone ? 'CHECKED IN' : 'MARK BEND COMPLETE'}</button>
                        </div>

                        {/* 5 Vacuums Check-in */}
                        <div className={`saeed-check-box ${log.morningVacuumsDone ? 'done' : ''}`} onClick={() => logSaeedMorningVacuums(currentKey)}>
                            <div className="scb-top">
                                <span className="scb-lbl">5 STANDING VACUUMS</span>
                                <span className="scb-status">{log.morningVacuumsDone ? '✓ 5/5 SETS DONE' : 'PENDING'}</span>
                            </div>
                            <div className="scb-desc">5x 30-60s holds on empty stomach before breakfast.</div>
                            <button className="scb-btn btn">{log.morningVacuumsDone ? 'VACUUMS LOGGED' : 'MARK 5 VACUUMS DONE'}</button>
                        </div>
                    </div>
                </div>

                {/* VACUUM HOLD TIMER & FORM GUIDE */}
                <div className="saeed-sec-card card vacuum-module">
                    <div className="saeed-sec-hdr">
                        <div className="saeed-sec-title">
                            <KenneyIcon name="target" size={16} />
                            <span>STANDING STOMACH VACUUM TIMER</span>
                        </div>
                        <span className="saeed-tag-pill volt">TRANSVERSUS ABDOMINIS</span>
                    </div>

                    <div className="vacuum-guide-text">
                        <strong>Technique:</strong> Stand tall. Exhale ALL air out of your lungs. Pull your belly button in as far as it can go, toward your spine and slightly upward under your ribs.
                    </div>

                    <div className="timer-display-box">
                        <div className="tdb-time">{timeLeft}s</div>
                        <div className="tdb-label">TARGET HOLD ({timerTarget}S)</div>
                        
                        <div className="timer-controls">
                            <button className="btn btn-volt" onClick={toggleTimer}>
                                {timerRunning ? 'PAUSE HOLD' : 'START HOLD TIMER'}
                            </button>
                            <button className="btn btn-outline" onClick={resetTimer}>RESET</button>
                            
                            <div className="timer-presets">
                                <button className={`tp-btn ${timerTarget === 30 ? 'active' : ''}`} onClick={() => { setTimerTarget(30); setTimeLeft(30); setTimerRunning(false); }}>30S</button>
                                <button className={`tp-btn ${timerTarget === 45 ? 'active' : ''}`} onClick={() => { setTimerTarget(45); setTimeLeft(45); setTimerRunning(false); }}>45S</button>
                                <button className={`tp-btn ${timerTarget === 60 ? 'active' : ''}`} onClick={() => { setTimerTarget(60); setTimeLeft(60); setTimerRunning(false); }}>60S</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. UPDATED "ANYTIME" ACCUMULATION PROTOCOL */}
                <div className="saeed-sec-card card">
                    <div className="saeed-sec-hdr">
                        <div className="saeed-sec-title">
                            <KenneyIcon name="fist" size={16} />
                            <span>2. FULL DAY "ANYTIME" ACCUMULATION</span>
                        </div>
                        <span className="saeed-tag-pill">SHORT BURSTS ALL DAY</span>
                    </div>

                    <div className="accumulation-grid">
                        
                        {/* PUSH-UPS (500 TOTAL) */}
                        <div className="acc-card">
                            <div className="acc-hdr">
                                <div>
                                    <div className="acc-name">PUSH-UPS</div>
                                    <div className="acc-target-lbl">Target: 500 Total (Sets of 25–40)</div>
                                </div>
                                <div className="acc-val-big">{log.pushups || 0} / 500</div>
                            </div>
                            <div className="acc-track">
                                <div className="acc-fill" style={{ width: `${pushupPct}%`, background: 'var(--c-red)' }} />
                            </div>
                            <div className="acc-btn-row">
                                <button className="btn acc-add-btn" onClick={() => logSaeedAccumulation('pushups', 25, currentKey)}>+25</button>
                                <button className="btn acc-add-btn" onClick={() => logSaeedAccumulation('pushups', 30, currentKey)}>+30</button>
                                <button className="btn acc-add-btn" onClick={() => logSaeedAccumulation('pushups', 40, currentKey)}>+40</button>
                                <button className="btn acc-add-btn" onClick={() => logSaeedAccumulation('pushups', 50, currentKey)}>+50</button>
                                <button className="btn acc-sub-btn" onClick={() => logSaeedAccumulation('pushups', -25, currentKey)}>-25</button>
                            </div>
                        </div>

                        {/* STOMACH VACUUMS (10-20 SETS) */}
                        <div className="acc-card">
                            <div className="acc-hdr">
                                <div>
                                    <div className="acc-name">STOMACH VACUUMS</div>
                                    <div className="acc-target-lbl">Target: 10–20 Sets (30–60s holds)</div>
                                </div>
                                <div className="acc-val-big">{log.vacuumsSets || 0} / 15 SETS</div>
                            </div>
                            <div className="acc-track">
                                <div className="acc-fill" style={{ width: `${vacuumPct}%`, background: 'var(--c-volt)' }} />
                            </div>
                            <div className="acc-btn-row">
                                <button className="btn acc-add-btn" onClick={() => startTimer('vacuums', 45)}>TIMER 45S</button>
                                <button className="btn acc-add-btn" onClick={() => logSaeedAccumulation('vacuumsSets', 1, currentKey)}>+1 SET</button>
                                <button className="btn acc-add-btn" onClick={() => logSaeedAccumulation('vacuumsSets', 2, currentKey)}>+2 SETS</button>
                                <button className="btn acc-sub-btn" onClick={() => logSaeedAccumulation('vacuumsSets', -1, currentKey)}>-1</button>
                            </div>
                        </div>

                        {/* HOLLOW BODY HOLDS (5-10 SETS) */}
                        <div className="acc-card">
                            <div className="acc-hdr">
                                <div>
                                    <div className="acc-name">HOLLOW BODY HOLDS</div>
                                    <div className="acc-target-lbl">Target: 5–10 Sets (30–60s holds)</div>
                                </div>
                                <div className="acc-val-big">{log.hollowHoldsSets || 0} / 8 SETS</div>
                            </div>
                            <div className="acc-track">
                                <div className="acc-fill" style={{ width: `${hollowPct}%`, background: '#3B82F6' }} />
                            </div>
                            <div className="acc-btn-row">
                                <button className="btn acc-add-btn" onClick={() => startTimer('hollow', 45)}>TIMER 45S</button>
                                <button className="btn acc-add-btn" onClick={() => logSaeedAccumulation('hollowHoldsSets', 1, currentKey)}>+1 SET</button>
                                <button className="btn acc-add-btn" onClick={() => logSaeedAccumulation('hollowHoldsSets', 2, currentKey)}>+2 SETS</button>
                                <button className="btn acc-sub-btn" onClick={() => logSaeedAccumulation('hollowHoldsSets', -1, currentKey)}>-1</button>
                            </div>
                        </div>

                        {/* DOORFRAME ROWS (100-150 TOTAL) */}
                        <div className="acc-card">
                            <div className="acc-hdr">
                                <div>
                                    <div className="acc-name">DOORFRAME ROWS</div>
                                    <div className="acc-target-lbl">Target: 100–150 Total (Pulling Motion)</div>
                                </div>
                                <div className="acc-val-big">{log.doorframeRows || 0} / 125</div>
                            </div>
                            <div className="acc-track">
                                <div className="acc-fill" style={{ width: `${rowsPct}%`, background: '#EAB308' }} />
                            </div>
                            <div className="acc-btn-row">
                                <button className="btn acc-add-btn" onClick={() => logSaeedAccumulation('doorframeRows', 15, currentKey)}>+15</button>
                                <button className="btn acc-add-btn" onClick={() => logSaeedAccumulation('doorframeRows', 25, currentKey)}>+25</button>
                                <button className="btn acc-add-btn" onClick={() => logSaeedAccumulation('doorframeRows', 30, currentKey)}>+30</button>
                                <button className="btn acc-sub-btn" onClick={() => logSaeedAccumulation('doorframeRows', -15, currentKey)}>-15</button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 3. GROWTH SESSION (POST-YOGA / AFTERNOON) */}
                <div className="saeed-sec-card card">
                    <div className="saeed-sec-hdr">
                        <div className="saeed-sec-title">
                            <KenneyIcon name="trophy" size={16} />
                            <span>3. GROWTH SESSION (POST-YOGA OR AFTERNOON)</span>
                        </div>
                        <span className="saeed-tag-pill">{growthCompletedCount}/5 COMPLETED</span>
                    </div>

                    <div className="growth-checklist">
                        {[
                            { key: 'pikePushups', title: 'Pike Push-ups', target: '4 x 10–12', desc: 'Shoulder & Upper Chest Mass' },
                            { key: 'splitSquats', title: 'Bulgarian Split Squats', target: '4 x 12', desc: 'Leg & Glute Mass' },
                            { key: 'weightedVups', title: 'Weighted V-Ups', target: '4 x 15', desc: 'Direct Abdominal Crunch' },
                            { key: 'bicepCurls', title: 'Bicep Curls (Water Jugs)', target: '4 x 20', desc: 'Slower Tempo Control' },
                            { key: 'plankDownwardDog', title: 'Plank to Downward Dog', target: '3 x 15', desc: 'Shoulder & Core Stability' }
                        ].map(ex => {
                            const isDone = Boolean(gs[ex.key]);
                            return (
                                <div key={ex.key} className={`growth-row ${isDone ? 'done' : ''}`} onClick={() => toggleSaeedGrowthExercise(ex.key, currentKey)}>
                                    <div className="gr-check-square">{isDone ? '✓' : ''}</div>
                                    <div className="gr-info">
                                        <div className="gr-title">{ex.title}</div>
                                        <div className="gr-sub">{ex.desc}</div>
                                    </div>
                                    <div className="gr-target">{ex.target}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 4. CRITICAL TIPS FOR 30-DAY SUCCESS & SAFETY WARNING */}
                <div className="saeed-sec-card card tips-card">
                    <div className="saeed-sec-hdr">
                        <div className="saeed-sec-title">
                            <KenneyIcon name="star" size={16} />
                            <span>4. CRITICAL TIPS FOR 30-DAY SUCCESS</span>
                        </div>
                    </div>

                    <div className="tips-list">
                        <div className="tip-box">
                            <strong>Mind-Muscle Connection:</strong> Squeeze the target muscle intentionally. For abs, visualize your ribs pulling down toward your pelvis.
                        </div>
                        <div className="tip-box">
                            <strong>Skin Tightening Protocol:</strong> Keep protein high (salmon, eggs, feta, lean meats) to support skin elasticity. Stay aggressive with water intake.
                        </div>
                        <div className="tip-box">
                            <strong>500 Push-up Rule:</strong> If shoulders feel inflamed, switch push-up hand width to take pressure off front delts.
                        </div>
                        <div className="tip-box">
                            <strong>Consistency Makeup:</strong> If you miss an hour, do a double set the next hour you remember. Total daily volume is what changes your physique.
                        </div>
                    </div>

                    {/* Safety Alert Box */}
                    <div className="saeed-warning-box">
                        <div className="sw-hdr">
                            <KenneyIcon name="cross" size={16} />
                            <span>SAFETY WARNING</span>
                        </div>
                        <p>
                            If you feel sharp pain in your lower back during Hollow Holds or V-ups, stop immediately. Your core is fatigued; take a 5-minute break and focus on breathing before continuing.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
