import { useEffect, useRef, useState } from 'react';
import { Dumbbell, BarChart2, Camera, ShieldCheck, ArrowRight, Zap, Target, Droplets, Trophy } from 'lucide-react';
import '../views/Dashboard.css'; 
import './Landing.css';

/* ── Intersection Observer hook for scroll-triggered reveals ── */
function useReveal(threshold = 0.15) {
    const ref = useRef(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setRevealed(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);

    return [ref, revealed];
}

/* ── Animated Counter Component ── */
function AnimatedCounter({ end, duration = 1500, delay = 2400, suffix = '' }) {
    const [value, setValue] = useState(0);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
        if (!started) return;
        const startTime = Date.now();
        const numEnd = typeof end === 'string' ? parseInt(end.replace(/,/g, '')) : end;
        
        function tick() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(numEnd * eased));
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }, [started, end, duration]);

    return <>{value.toLocaleString()}{suffix}</>;
}

export default function Landing({ onStart }) {
    // Scroll reveal refs
    const [hookRef, hookRevealed] = useReveal(0.2);
    const [gridRef, gridRevealed] = useReveal(0.1);
    const [footerRef, footerRevealed] = useReveal(0.2);
    const [li1Ref, li1Revealed] = useReveal(0.3);
    const [li2Ref, li2Revealed] = useReveal(0.3);

    return (
        <div className="lp-v5">
            {/* ── TOP NAV ──────────────────────────────────────── */}
            <nav className="lp-v5-nav">
                <div className="lp-v5-nav-inner">
                    <div className="lp-v5-logo">AJWAA</div>
                    <button className="lp-v5-btn-outline" onClick={onStart}>
                        Early Access Login
                    </button>
                </div>
            </nav>

            {/* ── HERO SECTION ─────────────────────────────────── */}
            <header className="lp-v5-hero">
                <div className="lp-v5-hero-inner">
                    
                    {/* LEFT: Animated Typography */}
                    <div className="lp-v5-hero-text">
                        <div className="lp-v5-badge flex items-center mb-6">
                           <Zap size={14} className="txt-red mr-2" /> <span>KILL YOUR CALORIE SPREADSHEET</span>
                        </div>
                        <h1 className="lp-v5-h1">
                            <span className="lp-v5-h1-line">TRACK YOUR</span>
                            <span className="lp-v5-h1-line">DIET.</span>
                            <span className="lp-v5-h1-line">
                                <span className="lp-v5-highlight">LIKE A GAME.</span>
                            </span>
                        </h1>
                        <p className="lp-v5-sub" style={{maxWidth: 400}}>
                            Stop using boring tracker apps. Earn XP, level up your profile, and build a massive streak of daily gym check-ins.  
                        </p>
                        
                        <div className="lp-v5-actions">
                            <button className="lp-v5-btn-mega" onClick={onStart}>
                                Early Access Login <ArrowRight size={20} />
                            </button>
                            <div className="lp-v5-store-list">
                                <div className="lp-v5-store-btn bg-white">
                                    <span className="store-ic">🍎</span>
                                    <div><div className="xs-text">App Store</div><div className="sm-bold txt-red">Coming Soon</div></div>
                                </div>
                                <div className="lp-v5-store-btn bg-white">
                                    <span className="store-ic">▶️</span>
                                    <div><div className="xs-text">Google Play</div><div className="sm-bold txt-red">Coming Soon</div></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Animated Live Data-rich App Mockup */}
                    <div className="lp-v5-hero-art">
                        <div className="lp-v5-phone">
                            <div className="lp-v5-notch" />
                            
                            <div className="lp-v5-screen">
                                {/* Fake status bar */}
                                <div className="screen-header">
                                    <strong>9:41</strong>
                                    <div>📶 🔋</div>
                                </div>

                                <div className="screen-scroll">
                                    {/* ANIMATED CALENDAR */}
                                    <div className="mock-calendar">
                                        {['M','T','W','T','F','S','S'].map((d, i) => (
                                            <div key={i} className={`mock-cal-day ${i === 3 ? 'active' : ''}`}>
                                                <div className="sm-bold">{d}</div>
                                                <div className="cal-dot" style={{background: i <= 3 ? 'var(--c-volt)' : 'transparent'}}></div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* ANIMATED RING & Vitals */}
                                    <div className="mock-hero-wrapper" style={{ marginTop: 12, marginBottom: 4 }}>
                                        {/* Nudge */}
                                        <div className="d-hero-bubble" style={{ zIndex: 10, marginBottom: 8, transform: 'rotate(-2deg)' }}>
                                            🔥 24 Day Streak! Push harder today.
                                        </div>
                                        
                                        {/* MACRO RING - Animated */}
                                        <div className="d-stats-card lp-live-widget" style={{ transform: 'rotate(1deg)' }}>
                                            <div className="d-sc-left">
                                                <div className="d-sc-ring-wrap">
                                                    <svg viewBox="0 0 84 84" className="d-sc-svg">
                                                        <circle cx="42" cy="42" r="38" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                                                        <circle cx="42" cy="42" r="38" stroke="var(--c-volt)" strokeWidth="8" fill="none" strokeDasharray="238" strokeDashoffset="40" strokeLinecap="round" />
                                                    </svg>
                                                    <div className="d-sc-cal-text">
                                                        <span className="d-sc-val">
                                                            <AnimatedCounter end={1850} delay={2000} duration={1200} />
                                                        </span>
                                                        <span className="d-sc-label" style={{color: 'white'}}>KCAL</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-sc-center">
                                                <div className="d-macro-row">
                                                    <div className="d-macro-bar-wrap"><div className="d-macro-bar" style={{ width: '80%', background: 'var(--c-sand)' }} /></div>
                                                    <div className="d-macro-labels">
                                                        <span style={{ color: 'var(--c-sand)' }}>Pro</span>
                                                        <span className="d-macro-val">145g</span>
                                                    </div>
                                                </div>
                                                <div className="d-macro-row">
                                                    <div className="d-macro-bar-wrap"><div className="d-macro-bar" style={{ width: '40%', background: 'var(--c-blue)' }} /></div>
                                                    <div className="d-macro-labels">
                                                        <span style={{ color: 'var(--c-blue)' }}>Carb</span>
                                                        <span className="d-macro-val">120g</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ANIMATED VITALS */}
                                    <div className="mock-vitals-row">
                                        <div className="d-vital-card water">
                                            <div className="d-vital-icon"><Droplets size={20}/></div>
                                            <div className="d-vital-info">
                                                <span className="d-vital-val">2.5 L</span>
                                                <span className="d-vital-lbl">Water</span>
                                            </div>
                                            <div className="d-vital-bg-bar" style={{ height: `80%` }} />
                                        </div>
                                        <div className="d-vital-card weight">
                                            <div className="d-vital-icon"><Target size={20}/></div>
                                            <div className="d-vital-info">
                                                <span className="d-vital-val">76 kg</span>
                                                <span className="d-vital-lbl">Weight</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Animated Check In Widget */}
                                    <div className="d-checkin-card lp-live-widget" style={{ transform: 'rotate(-1deg)' }}>
                                        <div className="d-checkin-icon" style={{background: 'rgba(255,255,255,0.1)'}}>
                                            <Camera size={24} color="var(--c-sand)" />
                                        </div>
                                        <div className="d-checkin-text" style={{ textAlign: 'left', color: 'white' }}>
                                            <div className="d-checkin-title">Time to be real.</div>
                                            <div className="d-checkin-sub">+50 XP Earned</div>
                                        </div>
                                    </div>

                                    {/* Animated MEALS */}
                                    <div className="mock-meals-list">
                                        <div className="mock-meal-item">
                                            <div className="m-icon" style={{background: '#FFF3E0', color:'#FF9800'}}>☕</div>
                                            <div>
                                                <div className="sm-bold text-white">Eggs & Toast</div>
                                                <div className="xs-text text-gray">450 kcal • 32g Pro</div>
                                            </div>
                                        </div>
                                        <div className="mock-meal-item">
                                            <div className="m-icon" style={{background: '#E8F5E9', color:'#4CAF50'}}>🍲</div>
                                            <div>
                                                <div className="sm-bold text-white">Chicken Salad</div>
                                                <div className="xs-text text-gray">600 kcal • 55g Pro</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ANIMATED XP & START WORKOUT */}
                                    <div className="d-xp-card lp-live-widget">
                                        <div className="d-xp-header">
                                            <div className="d-xp-level">
                                                <span className="d-lvl-label">LEVEL</span>
                                                <span className="d-lvl-num">14</span>
                                            </div>
                                        </div>
                                        <div className="d-xp-bar-bg">
                                            <div className="d-xp-bar-fill" style={{ width: '85%' }} />
                                        </div>
                                    </div>
                                    
                                    <button className="d-action-hero" style={{ marginTop: 'auto', width: '100%' }}>
                                        <div className="d-ah-content">
                                            <div className="d-ah-icon"><Dumbbell size={20} strokeWidth={3} /></div>
                                            <div className="d-ah-text">
                                                <div className="d-ah-title">Start Workout</div>
                                            </div>
                                        </div>
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── THE HOOK (BEREAL) — Scroll Revealed ────────────────────── */}
            <section className="lp-v5-section bg-sand">
                <div className="lp-v5-container lp-v5-split pb-0">
                    <div className="lp-v5-col text-focused">
                        <div
                            ref={hookRef}
                            className={`lp-reveal-left ${hookRevealed ? 'revealed' : ''}`}
                        >
                            <div className="lp-v5-badge flex items-center mb-6 w-fit bg-white">
                               <Camera size={14} className="mr-2" /> <span>ACCOUNTABILITY PROTOCOL</span>
                            </div>
                            <h2 className="lp-v5-h2">SNAP IT.<br/>LOG IT.<br/>PROVE IT.</h2>
                        </div>
                        <ul className="lp-v5-check-list mt-8">
                            <li ref={li1Ref} className={li1Revealed ? 'revealed' : ''}>
                                <ShieldCheck size={28} className="txt-red"/>
                                <span><strong>No Fake Check-ins.</strong> Direct camera feed proves you're grinding.</span>
                            </li>
                            <li ref={li2Ref} className={li2Revealed ? 'revealed' : ''}>
                                <ShieldCheck size={28} className="txt-red"/>
                                <span><strong>Massive XP Rewards.</strong> Daily snaps boost your level exponentially.</span>
                            </li>
                        </ul>
                    </div>
                    {/* Floating Hook Box — Animated */}
                    <div className="lp-v5-col flex justify-center">
                        <div className={`lp-v5-hook-card bg-black ${hookRevealed ? 'animate' : ''}`}>
                            <div className="hook-header text-white flex justify-between mb-4 items-center">
                                <span className="sm-bold flex items-center"><Camera size={16} className="mr-2 txt-volt"/> TIME TO BE REAL.</span>
                            </div>
                            <div className="hook-cam-feed">
                                <div className={`hook-x-hair ${hookRevealed ? 'animate' : ''}`} />
                                <div className={`hook-stamp ${hookRevealed ? 'animate' : ''}`}>AJWAA SECURE SECURE</div>
                            </div>
                            <button className="lp-v5-btn-mega w-full mt-6 flex justify-center">
                                Post Snapshot (+50 XP)
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES GRID — Staggered Scroll Reveal ────────────────── */}
            <section className="lp-v5-section bg-white">
                <div className="lp-v5-container" ref={gridRef}>
                    <h2 className={`lp-v5-h2 text-center mb-16 lp-reveal ${gridRevealed ? 'revealed' : ''}`}>
                        PURE FUNCTION. ZERO FLUFF.
                    </h2>
                    <div className="lp-v5-grid-3">
                        <div className={`lp-neo-card bg-sand ${gridRevealed ? 'revealed' : ''}`}>
                            <div className="neo-icon-wrap bg-white"><BarChart2 size={32}/></div>
                            <h3>Macronutrients, Visualized.</h3>
                            <p>Visual UI tracks your protein, carbs, and fat in real-time. The ring never lies.</p>
                        </div>
                        <div className={`lp-neo-card bg-volt ${gridRevealed ? 'revealed' : ''}`}>
                            <div className="neo-icon-wrap bg-white"><Dumbbell size={32}/></div>
                            <h3>Replace Your Spreadsheet.</h3>
                            <p>Log volumes instantly. Auto rest timers stop you scrolling TikTok.</p>
                        </div>
                        <div className={`lp-neo-card bg-black text-white ${gridRevealed ? 'revealed' : ''}`}>
                            <div className="neo-icon-wrap bg-white txt-black"><Trophy size={32}/></div>
                            <h3>Level Up Your Real Life.</h3>
                            <p>Earn XP from tracking food and lifting weights. Rank up to prestige badges.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER — Animated ───────────────────────────────────────── */}
            <footer className="lp-v5-footer bg-black text-white" ref={footerRef}>
                <div className={`lp-v5-container text-center py-20 lp-reveal ${footerRevealed ? 'revealed' : ''}`}>
                    <h2 className="lp-v5-h2 mb-12">AJWAA FITNESS</h2>
                    <button className="lp-v5-btn-mega bg-sand mb-8" onClick={onStart}>
                        Early Access Login <ArrowRight size={20} />
                    </button>
                    <p className="txt-muted sm-bold">© 2026 AJWAA. BRUTAL EFFICIENCY.</p>
                </div>
            </footer>
        </div>
    );
}
