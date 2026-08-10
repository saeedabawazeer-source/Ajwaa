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

    // Timer State
    const [timerRunning, setTimerRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(45);

    // Notification State
    const [notifPermission, setNotifPermission] = useState(
        typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
    );

    useEffect(() => {
        let interval = null;
        if (timerRunning && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && timerRunning) {
            setTimerRunning(false);
            logSaeedAccumulation('vacuumsSets', 1, currentKey);
            setTimeLeft(45);
        }
        return () => clearInterval(interval);
    }, [timerRunning, timeLeft, currentKey, logSaeedAccumulation]);

    function toggleTimer() {
        if (timerRunning) {
            setTimerRunning(false);
            setTimeLeft(45); // reset on pause
        } else {
            setTimerRunning(true);
        }
    }

    async function requestNotifPermission() {
        if (typeof window === 'undefined' || !('Notification' in window)) return;
        try {
            const perm = await Notification.requestPermission();
            setNotifPermission(perm);
            if (perm === 'granted') {
                updateSaeedNotificationSettings({ enabled: true });
            }
        } catch (e) {
            console.error('Notification error', e);
        }
    }

    const gs = log.growthSession || {};

    const accItems = [
        { id: 'pushups', name: 'PUSH-UPS', max: 500, val: log.pushups || 0, color: '#D62828', adds: [25, 30, 40] },
        { id: 'doorframeRows', name: 'ROWS', max: 125, val: log.doorframeRows || 0, color: '#EAB308', adds: [15, 20, 25] },
        { id: 'vacuumsSets', name: 'VACUUMS', max: 15, val: log.vacuumsSets || 0, color: '#E0FF00', adds: [1, 2] },
        { id: 'hollowHoldsSets', name: 'HOLLOWS', max: 8, val: log.hollowHoldsSets || 0, color: '#3B82F6', adds: [1, 2] }
    ];

    const quests = [
        { id: 'bend', name: 'Bend (Yoga)', tag: 'MORN', done: log.bendDone, toggle: () => logSaeedBend(currentKey) },
        { id: 'vacs', name: '5 Vacuums', tag: 'MORN', done: log.morningVacuumsDone, toggle: () => logSaeedMorningVacuums(currentKey) },
        { id: 'pikePushups', name: 'Pike Push-ups', tag: '4x12', done: Boolean(gs.pikePushups), toggle: () => toggleSaeedGrowthExercise('pikePushups', currentKey) },
        { id: 'splitSquats', name: 'Split Squats', tag: '4x12', done: Boolean(gs.splitSquats), toggle: () => toggleSaeedGrowthExercise('splitSquats', currentKey) },
        { id: 'weightedVups', name: 'Weighted V-Ups', tag: '4x15', done: Boolean(gs.weightedVups), toggle: () => toggleSaeedGrowthExercise('weightedVups', currentKey) },
        { id: 'bicepCurls', name: 'Bicep Curls', tag: '4x20', done: Boolean(gs.bicepCurls), toggle: () => toggleSaeedGrowthExercise('bicepCurls', currentKey) },
        { id: 'plankDownwardDog', name: 'Plank -> Dog', tag: '3x15', done: Boolean(gs.plankDownwardDog), toggle: () => toggleSaeedGrowthExercise('plankDownwardDog', currentKey) }
    ];

    return (
        <div className="s2-app">
            {/* Header */}
            <header className="s2-hdr">
                <div className="s2-hdr-left">
                    <h1>SAEED PROTOCOL</h1>
                    <div className="s2-day-btn" onClick={() => setSaeedDayNumber(dayNumber === 30 ? 1 : dayNumber + 1)}>
                        DAY {dayNumber}/30
                    </div>
                </div>
                <button className={`s2-notif ${notifPermission === 'granted' ? 'on' : ''}`} onClick={requestNotifPermission}>
                    <KenneyIcon name="star" size={16} />
                </button>
            </header>

            {/* Big Action Timer */}
            <button className={`s2-timer-btn ${timerRunning ? 'running' : ''}`} onClick={toggleTimer}>
                {timerRunning ? `HOLD: ${timeLeft}S` : 'START 45S VACUUM'}
            </button>

            {/* Accumulation Grid */}
            <div className="s2-acc-grid">
                {accItems.map(item => {
                    const pct = Math.min(100, Math.round((item.val / item.max) * 100));
                    return (
                        <div key={item.id} className="s2-acc-card">
                            <div className="s2-acc-top">
                                <span>{item.name}</span>
                                <span>{item.val}/{item.max}</span>
                            </div>
                            <div className="s2-acc-bar">
                                <div className="s2-acc-fill" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                            </div>
                            <div className="s2-acc-acts">
                                {item.adds.map(v => (
                                    <button key={v} onClick={() => logSaeedAccumulation(item.id, v, currentKey)}>
                                        +{v}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quests */}
            <div className="s2-quests">
                {quests.map(q => (
                    <div key={q.id} className={`s2-quest ${q.done ? 'done' : ''}`} onClick={q.toggle}>
                        <div className="s2-q-check">{q.done ? '✓' : ''}</div>
                        <div className="s2-q-name">{q.name}</div>
                        <div className="s2-q-tag">{q.tag}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
