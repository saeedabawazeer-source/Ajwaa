import { useEffect, useRef, useState } from 'react';
import { Dumbbell, BarChart2, Camera, ShieldCheck, ArrowRight, Zap, Target, Droplets, Trophy, Users, Flame, Timer, TrendingUp, ChevronRight, Star, Award, CheckCircle2 } from 'lucide-react';
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
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(numEnd * eased));
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }, [started, end, duration]);

    return <>{value.toLocaleString()}{suffix}</>;
}

/* ── Scroll-triggered counter ── */
function ScrollCounter({ end, duration = 1500, suffix = '' }) {
    const ref = useRef(null);
    const [value, setValue] = useState(0);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
            { threshold: 0.5 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        if (!started) return;
        const startTime = Date.now();
        function tick() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(end * eased));
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }, [started, end, duration]);

    return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
}

export default function Landing({ onStart }) {
    // Scroll reveal refs
    const [hookRef, hookRevealed] = useReveal(0.2);
    const [gridRef, gridRevealed] = useReveal(0.1);
    const [howRef, howRevealed] = useReveal(0.15);
    const [socialRef, socialRevealed] = useReveal(0.15);
    const [statsRef, statsRevealed] = useReveal(0.2);
    const [ctaRef, ctaRevealed] = useReveal(0.2);
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

                    {/* RIGHT: TIGHT Phone Mockup — no overflow */}
                    <div className="lp-v5-hero-art">
                        <div className="lp-v5-phone">
                            <div className="lp-v5-notch" />
                            
                            <div className="lp-v5-screen">
                                {/* Status bar */}
                                <div className="screen-header">
                                    <strong>9:41</strong>
                                    <div style={{fontSize: 11}}>📶 🔋</div>
                                </div>

                                <div className="screen-scroll">
                                    {/* CALENDAR */}
                                    <div className="mock-calendar">
                                        {['M','T','W','T','F','S','S'].map((d, i) => (
                                            <div key={i} className={`mock-cal-day ${i === 3 ? 'active' : ''}`}>
                                                <div className="sm-bold" style={{fontSize: 11}}>{d}</div>
                                                <div className="cal-dot" style={{background: i <= 3 ? '#E0FF00' : 'rgba(255,255,255,0.15)'}}></div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* MACRO RING — compact */}
                                    <div className="ph-stats-card">
                                        <div className="ph-ring-wrap">
                                            <svg viewBox="0 0 72 72" className="ph-ring-svg">
                                                <circle cx="36" cy="36" r="30" stroke="rgba(255,255,255,0.1)" strokeWidth="7" fill="none" />
                                                <circle cx="36" cy="36" r="30" stroke="#E0FF00" strokeWidth="7" fill="none" strokeDasharray="188" strokeDashoffset="30" strokeLinecap="round" className="ph-ring-fill" />
                                            </svg>
                                            <div className="ph-ring-text">
                                                <span className="ph-ring-val">
                                                    <AnimatedCounter end={1850} delay={2000} duration={1200} />
                                                </span>
                                                <span className="ph-ring-label">KCAL</span>
                                            </div>
                                        </div>
                                        <div className="ph-macros">
                                            <div className="ph-macro-row">
                                                <div className="ph-macro-bar-bg"><div className="ph-macro-bar-fill" style={{width:'80%', background:'#F4F1EA'}} /></div>
                                                <div className="ph-macro-info"><span style={{color:'#F4F1EA'}}>Pro</span><span>145g</span></div>
                                            </div>
                                            <div className="ph-macro-row">
                                                <div className="ph-macro-bar-bg"><div className="ph-macro-bar-fill" style={{width:'40%', background:'#60A5FA'}} /></div>
                                                <div className="ph-macro-info"><span style={{color:'#60A5FA'}}>Carb</span><span>120g</span></div>
                                            </div>
                                            <div className="ph-macro-row">
                                                <div className="ph-macro-bar-bg"><div className="ph-macro-bar-fill" style={{width:'30%', background:'#FB923C'}} /></div>
                                                <div className="ph-macro-info"><span style={{color:'#FB923C'}}>Fat</span><span>55g</span></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* VITALS — compact */}
                                    <div className="ph-vitals-row">
                                        <div className="ph-vital water">
                                            <Droplets size={14} />
                                            <span className="ph-vital-val">2.5 L</span>
                                            <div className="ph-vital-fill" style={{height:'75%'}} />
                                        </div>
                                        <div className="ph-vital steps">
                                            <Flame size={14} />
                                            <span className="ph-vital-val">24 🔥</span>
                                        </div>
                                        <div className="ph-vital weight">
                                            <Target size={14} />
                                            <span className="ph-vital-val">76 kg</span>
                                        </div>
                                    </div>

                                    {/* XP CARD — compact */}
                                    <div className="ph-xp-card">
                                        <div className="ph-xp-top">
                                            <div><span className="ph-xp-lbl">LEVEL</span> <span className="ph-xp-num">14</span></div>
                                            <span className="ph-xp-badge">+50 XP</span>
                                        </div>
                                        <div className="ph-xp-bar-bg"><div className="ph-xp-bar-fill" style={{width:'85%'}} /></div>
                                    </div>

                                    {/* MEALS — compact */}
                                    <div className="ph-meals">
                                        <div className="ph-meal-item">
                                            <div className="ph-meal-ic" style={{background: '#FFF3E0'}}>☕</div>
                                            <div className="ph-meal-info">
                                                <div className="ph-meal-name">Eggs & Toast</div>
                                                <div className="ph-meal-meta">450 kcal • 32g Pro</div>
                                            </div>
                                        </div>
                                        <div className="ph-meal-item">
                                            <div className="ph-meal-ic" style={{background: '#E8F5E9'}}>🥗</div>
                                            <div className="ph-meal-info">
                                                <div className="ph-meal-name">Chicken Salad</div>
                                                <div className="ph-meal-meta">600 kcal • 55g Pro</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* START WORKOUT BUTTON */}
                                    <div className="ph-workout-btn">
                                        <Dumbbell size={16} strokeWidth={3} />
                                        <span>Start Workout</span>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── SECTION 2: ACCOUNTABILITY (BEREAL) ────────────────────────── */}
            <section className="lp-v5-section bg-sand">
                <div className="lp-v5-container lp-v5-split">
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
                                <ShieldCheck size={28} className="txt-red" style={{flexShrink:0}}/>
                                <span><strong>No Fake Check-ins.</strong> Direct camera feed proves you're grinding.</span>
                            </li>
                            <li ref={li2Ref} className={li2Revealed ? 'revealed' : ''}>
                                <ShieldCheck size={28} className="txt-red" style={{flexShrink:0}}/>
                                <span><strong>Massive XP Rewards.</strong> Daily snaps boost your level exponentially.</span>
                            </li>
                        </ul>
                    </div>
                    {/* Clean Camera Viewfinder Card (no gym photo) */}
                    <div className="lp-v5-col flex justify-center">
                        <div className={`lp-v5-hook-card bg-black ${hookRevealed ? 'animate' : ''}`}>
                            <div className="hook-header text-white flex justify-between mb-4 items-center">
                                <span className="sm-bold flex items-center"><Camera size={16} className="mr-2 txt-volt"/> TIME TO BE REAL.</span>
                                <span className="hook-live-dot">● LIVE</span>
                            </div>
                            {/* CSS-only camera viewfinder — no external image */}
                            <div className="hook-viewfinder">
                                <div className="hook-vf-grid" />
                                <div className={`hook-vf-crosshair ${hookRevealed ? 'animate' : ''}`}>
                                    <div className="hook-vf-cross-h" />
                                    <div className="hook-vf-cross-v" />
                                </div>
                                {/* Corner brackets */}
                                <div className="hook-vf-corner tl" />
                                <div className="hook-vf-corner tr" />
                                <div className="hook-vf-corner bl" />
                                <div className="hook-vf-corner br" />
                                {/* Info overlay */}
                                <div className="hook-vf-info">
                                    <div className="hook-vf-rec">● REC</div>
                                    <div className="hook-vf-time">00:04:32</div>
                                </div>
                                <div className={`hook-stamp ${hookRevealed ? 'animate' : ''}`}>
                                    <CheckCircle2 size={12} /> AJWAA VERIFIED
                                </div>
                            </div>
                            <div className="hook-xp-reward">
                                <Zap size={14} /> <span>+50 XP for daily check-in</span>
                            </div>
                            <button className="lp-v5-btn-mega w-full mt-4 flex justify-center" style={{fontSize:15, padding:'16px 24px'}}>
                                <Camera size={18} /> Post Snapshot
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 3: HOW IT WORKS ────────────────────────── */}
            <section className="lp-v5-section bg-white" ref={howRef}>
                <div className="lp-v5-container">
                    <h2 className={`lp-v5-h2 text-center mb-16 lp-reveal ${howRevealed ? 'revealed' : ''}`}>
                        HOW IT WORKS.
                    </h2>
                    <div className="lp-how-steps">
                        {[
                            { num: '01', icon: <Dumbbell size={28} />, title: 'Log Your Lifts', desc: 'Track exercises, sets, reps, and weight with auto rest timers. Takes 5 seconds.' },
                            { num: '02', icon: <BarChart2 size={28} />, title: 'Track Your Macros', desc: 'Scan food, log meals, visualize protein, carbs, fat, and calories in real-time rings.' },
                            { num: '03', icon: <Camera size={28} />, title: 'Snap Your Check-in', desc: 'Take a gym selfie. Prove you showed up. No faking. Camera feed only.' },
                            { num: '04', icon: <Trophy size={28} />, title: 'Level Up & Compete', desc: 'Earn XP from every action. Climb the leaderboard. Unlock prestige badges.' },
                        ].map((step, i) => (
                            <div key={i} className={`lp-how-step ${howRevealed ? 'revealed' : ''}`} style={{transitionDelay: `${i * 0.12}s`}}>
                                <div className="lp-how-num">{step.num}</div>
                                <div className="lp-how-icon">{step.icon}</div>
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SECTION 4: FEATURES GRID ────────────────────────── */}
            <section className="lp-v5-section bg-sand">
                <div className="lp-v5-container" ref={gridRef}>
                    <h2 className={`lp-v5-h2 text-center mb-16 lp-reveal ${gridRevealed ? 'revealed' : ''}`}>
                        PURE FUNCTION. ZERO FLUFF.
                    </h2>
                    <div className="lp-v5-grid-3">
                        <div className={`lp-neo-card bg-white ${gridRevealed ? 'revealed' : ''}`}>
                            <div className="neo-icon-wrap bg-volt"><BarChart2 size={32}/></div>
                            <h3>Macronutrients, Visualized.</h3>
                            <p>Visual UI tracks your protein, carbs, and fat in real-time. The ring never lies.</p>
                        </div>
                        <div className={`lp-neo-card bg-volt ${gridRevealed ? 'revealed' : ''}`}>
                            <div className="neo-icon-wrap bg-white"><Dumbbell size={32}/></div>
                            <h3>Replace Your Spreadsheet.</h3>
                            <p>Log volumes instantly. Auto rest timers stop you scrolling TikTok mid-set.</p>
                        </div>
                        <div className={`lp-neo-card bg-black text-white ${gridRevealed ? 'revealed' : ''}`}>
                            <div className="neo-icon-wrap bg-white txt-black"><Trophy size={32}/></div>
                            <h3>Level Up Your Real Life.</h3>
                            <p>Earn XP from tracking food and lifting weights. Rank up to prestige badges.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 5: SOCIAL PROOF / LEADERBOARD PREVIEW ────────────── */}
            <section className="lp-v5-section bg-white" ref={socialRef}>
                <div className="lp-v5-container lp-v5-split">
                    <div className={`lp-reveal-left ${socialRevealed ? 'revealed' : ''}`}>
                        <div className="lp-v5-badge flex items-center mb-6 w-fit" style={{background: '#E0FF00', color: '#000'}}>
                           <Users size={14} className="mr-2" /> <span>SOCIAL ACCOUNTABILITY</span>
                        </div>
                        <h2 className="lp-v5-h2">COMPETE.<br/>DON'T QUIT.</h2>
                        <p className="lp-v5-sub mt-8" style={{maxWidth: 420, animationDelay: '0s', opacity: 1}}>
                            See your friends' streaks, compare levels, and call them out when they skip leg day. Built-in shame engine.
                        </p>
                    </div>
                    <div className={`lp-reveal-right ${socialRevealed ? 'revealed' : ''}`}>
                        <div className="lp-leaderboard-card">
                            <div className="lp-lb-header">
                                <Trophy size={18} className="txt-volt" />
                                <span>Weekly Leaderboard</span>
                            </div>
                            {[
                                { rank: 1, name: 'Saeed', xp: 2450, streak: 48, medal: '🥇' },
                                { rank: 2, name: 'Ahmed', xp: 2100, streak: 32, medal: '🥈' },
                                { rank: 3, name: 'Khalid', xp: 1800, streak: 24, medal: '🥉' },
                                { rank: 4, name: 'Omar', xp: 1400, streak: 16, medal: '' },
                                { rank: 5, name: 'Youssef', xp: 900, streak: 8, medal: '' },
                            ].map((u, i) => (
                                <div key={i} className="lp-lb-row" style={{animationDelay: `${i * 0.1}s`}}>
                                    <div className="lp-lb-rank">{u.medal || u.rank}</div>
                                    <div className="lp-lb-name">{u.name}</div>
                                    <div className="lp-lb-streak"><Flame size={12}/> {u.streak}</div>
                                    <div className="lp-lb-xp">{u.xp.toLocaleString()} XP</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 6: STATS BAND ────────────────────────────── */}
            <section className="lp-stats-band bg-black" ref={statsRef}>
                <div className="lp-v5-container">
                    <div className={`lp-stats-grid ${statsRevealed ? 'revealed' : ''}`}>
                        <div className="lp-stat-item">
                            <div className="lp-stat-num"><ScrollCounter end={12} duration={1200} suffix="K+" /></div>
                            <div className="lp-stat-label">Meals Tracked</div>
                        </div>
                        <div className="lp-stat-item">
                            <div className="lp-stat-num"><ScrollCounter end={4} duration={1000} suffix="K+" /></div>
                            <div className="lp-stat-label">Workouts Logged</div>
                        </div>
                        <div className="lp-stat-item">
                            <div className="lp-stat-num"><ScrollCounter end={850} duration={1400} suffix="+" /></div>
                            <div className="lp-stat-label">Active Users</div>
                        </div>
                        <div className="lp-stat-item">
                            <div className="lp-stat-num"><ScrollCounter end={98} duration={1200} suffix="%" /></div>
                            <div className="lp-stat-label">Streak Retention</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 7: FINAL CTA ────────────────────────────── */}
            <section className="lp-v5-section bg-volt" ref={ctaRef}>
                <div className={`lp-v5-container text-center lp-reveal-scale ${ctaRevealed ? 'revealed' : ''}`}>
                    <h2 className="lp-v5-h2 mb-8">STOP SCROLLING.<br/>START GRINDING.</h2>
                    <p style={{fontSize: 20, fontWeight: 600, maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.5}}>
                        Your body won't build itself. Join the early access and start earning XP from day one.
                    </p>
                    <button className="lp-v5-btn-mega mb-8" onClick={onStart}>
                        Early Access Login <ArrowRight size={20} />
                    </button>
                    <div className="lp-trust-row">
                        <div className="lp-trust-item"><CheckCircle2 size={16}/> Free Forever</div>
                        <div className="lp-trust-item"><CheckCircle2 size={16}/> No Ads</div>
                        <div className="lp-trust-item"><CheckCircle2 size={16}/> Works Offline</div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────── */}
            <footer className="lp-v5-footer bg-black text-white" ref={footerRef}>
                <div className={`lp-v5-container text-center py-20 lp-reveal ${footerRevealed ? 'revealed' : ''}`}>
                    <h2 className="lp-v5-h2 mb-8" style={{fontSize: 32}}>AJWAA FITNESS</h2>
                    <p className="txt-muted sm-bold">© 2026 AJWAA. BRUTAL EFFICIENCY.</p>
                </div>
            </footer>
        </div>
    );
}
