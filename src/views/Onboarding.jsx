import { useState, useEffect } from 'react';
import { ChevronRight, Target, Dumbbell, Zap, Trophy, Crown, Check, Ruler, Weight, Calendar } from 'lucide-react';
import { calculatePlan } from '../utils/helpers';
import AjwaMascot from '../components/AjwaMascot';
import './Onboarding.css';

const STEPS = [
    { id: 'intro', progress: 10 },
    { id: 'name', progress: 20 },
    { id: 'gender', progress: 30 },
    { id: 'stats', progress: 40 },
    { id: 'goal', progress: 60 },
    { id: 'activity', progress: 75 },
    { id: 'plan', progress: 90 },
    { id: 'commit', progress: 100 },
];

export default function Onboarding({ onComplete }) {
    const [stepIndex, setStepIndex] = useState(0);
    const [mascotMood, setMascotMood] = useState('happy');
    const [isTalking, setIsTalking] = useState(false);
    const [lookingAt, setLookingAt] = useState('center');

    const [data, setData] = useState({
        name: '',
        gender: '',
        age: '',
        height: '',
        weight: '',
        goal: '',
        activity: '',
        commit: false
    });



    const step = STEPS[stepIndex];

    useEffect(() => {
        // Simulate talking when step changes
        setIsTalking(true);
        setMascotMood('neutral');
        setLookingAt('center');

        const timer = setTimeout(() => {
            setIsTalking(false);
            // Set mood based on step
            if (step.id === 'intro') setMascotMood('happy');
            else if (step.id === 'plan') setMascotMood('pump'); // Excited about plan
            else if (step.id === 'commit') setMascotMood('Thinking');
            else setMascotMood('neutral');
        }, 1500); // Talk for 1.5s

        return () => clearTimeout(timer);
    }, [stepIndex, step.id]);

    function next() {
        if (stepIndex < STEPS.length - 1) {
            setStepIndex(stepIndex + 1);
        } else {
            // Finalize
            const plan = calculatePlan(
                data.gender,
                Number(data.age),
                Number(data.weight),
                Number(data.height),
                data.activity,
                data.goal
            );

            const profile = {
                name: data.name,
                gender: data.gender,
                age: Number(data.age),
                height: Number(data.height),
                weight: Number(data.weight),
                goal: data.goal,
                calorieTarget: plan.cals,
                macros: plan.macros,
                waterGoal: plan.water
            };
            onComplete(profile);
        }
    }

    const isStepValid = () => {
        if (step.id === 'intro') return true;
        if (step.id === 'name') return data.name.trim().length > 0;
        if (step.id === 'gender') return data.gender !== '';
        if (step.id === 'stats') return data.age && data.height && data.weight;
        if (step.id === 'goal') return data.goal !== '';
        if (step.id === 'activity') return data.activity !== '';
        if (step.id === 'plan') return true; // Review step
        if (step.id === 'commit') return data.commit === true;
        return false;
    };

    return (
        <div className="onboarding-screen">
            <div className="ob-progress">
                <div className="ob-bar" style={{ width: `${step.progress}%` }} />
            </div>

            <div className="ob-content">
                {/* Ajwa Interactive Mascot */}
                <div className="mascot-header">
                    <AjwaMascot mood={mascotMood} lookingAt={lookingAt} />
                </div>

                {/* 1. INTRO */}
                {step.id === 'intro' && (
                    <>
                        <div className="ob-chat-bubble">
                            Hi! I'm <strong>Ajwaa</strong>. Not just an app, but your new AI fitness partner. Ready to get shredded?
                        </div>
                        <div className="ob-input-area">
                            <button className="ob-btn" onClick={next}>LET'S DO IT</button>
                        </div>
                    </>
                )}

                {/* 2. NAME */}
                {step.id === 'name' && (
                    <>
                        <div className="ob-chat-bubble">
                            First things first. What should I call you, champion?
                        </div>
                        <div className="ob-input-area">
                            <input className="ob-input" placeholder="Your Name" autoFocus
                                value={data.name} onChange={e => setData({ ...data, name: e.target.value })}
                                onKeyDown={e => e.key === 'Enter' && isStepValid() && next()}
                            />
                            <button className="ob-btn" onClick={next} disabled={!isStepValid()}>CONTINUE</button>
                        </div>
                    </>
                )}

                {/* 3. GENDER */}
                {step.id === 'gender' && (
                    <>
                        <div className="ob-chat-bubble">
                            Nice to meet you, {data.name}. To build your plan, I need to know your biology.
                        </div>
                        <div className="ob-grid ob-input-area">
                            <Card
                                icon="👨" label="Male" sub=""
                                selected={data.gender === 'male'} onClick={() => setData({ ...data, gender: 'male' })}
                            />
                            <Card
                                icon="👩" label="Female" sub=""
                                selected={data.gender === 'female'} onClick={() => setData({ ...data, gender: 'female' })}
                            />
                            <button className="ob-btn" onClick={next} disabled={!isStepValid()}>NEXT</button>
                        </div>
                    </>
                )}

                {/* 4. STATS */}
                {step.id === 'stats' && (
                    <>
                        <div className="ob-chat-bubble">
                            Let's crunch the numbers. I need your current stats to calculate your BMR.
                        </div>
                        <div className="ob-input-area">
                            <div className="ob-input-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                                <div>
                                    <div className="text-label" style={{ marginBottom: 4, textAlign: 'center' }}>AGE</div>
                                    <input className="ob-input" placeholder="25" type="number" style={{ textAlign: 'center' }}
                                        value={data.age}
                                        onChange={e => setData({ ...data, age: e.target.value })}
                                        onFocus={() => setLookingAt('input')}
                                        onBlur={() => setLookingAt('center')}
                                    />
                                </div>
                                <div>
                                    <div className="text-label" style={{ marginBottom: 4, textAlign: 'center' }}>HEIGHT (CM)</div>
                                    <input className="ob-input" placeholder="180" type="number" style={{ textAlign: 'center' }}
                                        value={data.height}
                                        onChange={e => setData({ ...data, height: e.target.value })}
                                        onFocus={() => setLookingAt('input')}
                                        onBlur={() => setLookingAt('center')}
                                    />
                                </div>
                                <div>
                                    <div className="text-label" style={{ marginBottom: 4, textAlign: 'center' }}>WEIGHT (KG)</div>
                                    <input className="ob-input" placeholder="75" type="number" style={{ textAlign: 'center' }}
                                        value={data.weight}
                                        onChange={e => setData({ ...data, weight: e.target.value })}
                                        onFocus={() => setLookingAt('input')}
                                        onBlur={() => setLookingAt('center')}
                                    />
                                </div>
                            </div>
                            <button className="ob-btn" onClick={next} disabled={!isStepValid()}>CONTINUE</button>
                        </div>
                    </>
                )}

                {/* 5. GOAL */}
                {step.id === 'goal' && (
                    <>
                        <div className="ob-chat-bubble">
                            Got it. Now, what's the mission?
                        </div>
                        <div className="ob-grid ob-input-area">
                            <Card
                                icon={<Target />} label="Lose Body Fat" sub="Deficit (-500 cal)"
                                selected={data.goal === 'fat_loss'} onClick={() => setData({ ...data, goal: 'fat_loss' })}
                            />
                            <Card
                                icon={<Dumbbell />} label="Build Muscle" sub="Surplus (+300 cal)"
                                selected={data.goal === 'muscle_gain'} onClick={() => setData({ ...data, goal: 'muscle_gain' })}
                            />
                            <Card
                                icon={<Zap />} label="Get Fit" sub="Maintenance"
                                selected={data.goal === 'fitness'} onClick={() => setData({ ...data, goal: 'fitness' })}
                            />
                            <button className="ob-btn" onClick={next} disabled={!isStepValid()}>NEXT</button>
                        </div>
                    </>
                )}

                {/* 6. ACTIVITY */}
                {step.id === 'activity' && (
                    <>
                        <div className="ob-chat-bubble">
                            How active are you in your daily life (excluding workouts)?
                        </div>
                        <div className="ob-grid ob-input-area">
                            <Card
                                icon="🛋️" label="Sedentary" sub="Desk job, little movement"
                                selected={data.activity === 'sedentary'} onClick={() => setData({ ...data, activity: 'sedentary' })}
                            />
                            <Card
                                icon="🚶" label="Lightly Active" sub="Walking, occasional activity"
                                selected={data.activity === 'light'} onClick={() => setData({ ...data, activity: 'light' })}
                            />
                            <Card
                                icon="🏃" label="Active" sub="Active job or daily movement"
                                selected={data.activity === 'active'} onClick={() => setData({ ...data, activity: 'active' })}
                            />
                            <Card
                                icon="🔥" label="Athlete" sub="Physical job or heavy training"
                                selected={data.activity === 'athlete'} onClick={() => setData({ ...data, activity: 'athlete' })}
                            />
                            <button className="ob-btn" onClick={next} disabled={!isStepValid()}>CALCULATE PLAN</button>
                        </div>
                    </>
                )}

                {/* 7. PLAN REVEAL */}
                {step.id === 'plan' && (
                    <>
                        <div className="ob-chat-bubble">
                            Based on your stats, here is your daily target:
                        </div>
                        <div className="ob-input-area">
                            {(() => {
                                const plan = calculatePlan(data.gender, Number(data.age), Number(data.weight), Number(data.height), data.activity, data.goal);
                                return (
                                    <div className="card" style={{ padding: 20, textAlign: 'center', border: '2px solid black', background: 'white', marginBottom: 20 }}>
                                        <div style={{ fontSize: 14, fontWeight: 800, opacity: 0.5 }}>DAILY CALORIES</div>
                                        <div style={{ fontSize: 42, fontWeight: 900, color: 'var(--c-green)' }}>{plan.cals}</div>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 10 }}>
                                            <div className="chip">Protein: {plan.macros.p}g</div>
                                            <div className="chip">Carbs: {plan.macros.c}g</div>
                                            <div className="chip">Fats: {plan.macros.f}g</div>
                                        </div>
                                    </div>
                                );
                            })()}
                            <button className="ob-btn" onClick={next}>LOOKS GOOD</button>
                        </div>
                    </>
                )}

                {/* 8. COMMIT */}
                {step.id === 'commit' && (
                    <>
                        <div className="ob-chat-bubble">
                            Final question. Can you commit to showing up for yourself at least 3 times a week?
                        </div>
                        <div className="ob-input-area">
                            <div className={`ob-card ${data.commit ? 'selected' : ''}`} onClick={() => setData({ ...data, commit: true })}>
                                <div className="ob-card-icon" style={{ background: data.commit ? '#22C55E' : '#e5e5e5', color: 'white' }}>
                                    <Check size={24} strokeWidth={4} />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: 800 }}>I COMMIT</div>
                                    <div style={{ fontSize: 12, opacity: 0.6 }}>I will do the work.</div>
                                </div>
                            </div>
                            <button className="ob-btn" onClick={next} disabled={!isStepValid()}>START AJWAA</button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}

function Card({ icon, label, sub, selected, onClick }) {
    return (
        <div className={`ob-card ${selected ? 'selected' : ''}`} onClick={onClick}>
            <div className="ob-card-icon">{icon}</div>
            <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{label}</div>
                {sub && <div style={{ fontSize: 12, opacity: 0.6 }}>{sub}</div>}
            </div>
            {selected && <div style={{ color: 'var(--c-green)' }}><Check size={20} strokeWidth={3} /></div>}
        </div>
    );
}
