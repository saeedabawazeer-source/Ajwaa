import { Zap, Target, Trophy, Dumbbell, BarChart2, Camera, Star, ArrowRight, ShieldCheck, Flame, Scale } from 'lucide-react';
import '../views/Dashboard.css'; // Import dashboard styles to render actual app widgets
import './Landing.css';

export default function Landing({ onStart }) {

    return (
        <div className="lp-v3">
            {/* ── NAVIGATION ───────────────────────────────────── */}
            <nav className="lp-v3-nav">
                <div className="lp-v3-logo">
                    <Zap size={24} fill="var(--c-volt)" color="var(--c-black)" />
                    <span>AJWAA</span>
                </div>
                <div className="lp-v3-nav-links">
                    <a href="#system">The System</a>
                    <a href="#bereal">Accountability</a>
                </div>
                <button className="lp-v3-btn-start" onClick={onStart}>
                    Try Web App
                </button>
            </nav>

            {/* ── HERO = EXTREMELY CLEAN ───────────────────────── */}
            <header className="lp-v3-hero">
                <div className="lp-v3-hero-content">
                    <div className="lp-v3-badge">
                        <Flame size={14} className="txt-red" fill="var(--c-red)" /> 
                        Stop Tracking. Start Playing.
                    </div>
                    <h1 className="lp-v3-title">
                        Your Fitness Journey.<br/>
                        <span className="lp-v3-highlight">Gamified.</span>
                    </h1>
                    <p className="lp-v3-sub">
                        We stripped out the bloated charts and replaced them with XP, levels, and daily check-ins. Meet the only neo-brutalist fitness app that turns discipline into dopamine.
                    </p>
                    
                    <div className="lp-v3-actions">
                        <button className="lp-v3-mega-btn" onClick={onStart}>
                            Launch Web App <ArrowRight size={20} />
                        </button>
                        <div className="lp-v3-store-group">
                            <div className="lp-v3-store-btn disabled">
                                <div className="badge-icon">🍎</div>
                                <div>
                                    <div className="badge-s">App Store</div>
                                    <div className="badge-b">Coming Soon</div>
                                </div>
                            </div>
                            <div className="lp-v3-store-btn disabled">
                                <div className="badge-icon">▶️</div>
                                <div>
                                    <div className="badge-s">Google Play</div>
                                    <div className="badge-b">Coming Soon</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── LIVE APP WIDGETS ───────────────────────────── */}
                <div className="lp-v3-hero-widgets">
                    
                    {/* Widget 1: Macro Ring (stolen exact DOM from Dashboard) */}
                    <div className="d-stats-card lp-widget w-ring">
                        <div className="d-sc-left">
                            <div className="d-sc-ring-wrap">
                                <svg viewBox="0 0 84 84" className="d-sc-svg">
                                    <circle cx="42" cy="42" r="38" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                                    <circle cx="42" cy="42" r="38" stroke="var(--c-red)" strokeWidth="8" fill="none" strokeDasharray="238" strokeDashoffset="50" strokeLinecap="round" />
                                </svg>
                                <div className="d-sc-cal-text">
                                    <span className="d-sc-val">1,450</span>
                                    <span className="d-sc-label" style={{color: 'white'}}>KCAL</span>
                                </div>
                            </div>
                        </div>
                        <div className="d-sc-center">
                            <div className="d-macro-row">
                                <div className="d-macro-bar-wrap"><div className="d-macro-bar" style={{ width: '70%', background: 'var(--c-sand)' }} /></div>
                                <div className="d-macro-labels">
                                    <span style={{ color: 'var(--c-sand)' }}>Pro</span>
                                    <span className="d-macro-val">120g</span>
                                </div>
                            </div>
                            <div className="d-macro-row">
                                <div className="d-macro-bar-wrap"><div className="d-macro-bar" style={{ width: '40%', background: 'var(--c-blue)' }} /></div>
                                <div className="d-macro-labels">
                                    <span style={{ color: 'var(--c-blue)' }}>Carb</span>
                                    <span className="d-macro-val">150g</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Widget 2: Check-in Card */}
                    <div className="d-checkin-card lp-widget w-checkin">
                        <div className="d-checkin-icon">
                            <Camera size={24} color="var(--c-volt)" />
                        </div>
                        <div className="d-checkin-text" style={{ textAlign: 'left' }}>
                            <div className="d-checkin-title">Time to be real.</div>
                            <div className="d-checkin-sub">Snap your daily gym pic for XP</div>
                        </div>
                        <div className="d-checkin-arrow">GO</div>
                    </div>

                    {/* Widget 3: Game Level Card */}
                    <div className="d-xp-card lp-widget w-xp">
                        <div className="d-xp-header">
                            <div className="d-xp-level">
                                <span className="d-lvl-label">LEVEL</span>
                                <span className="d-lvl-num">14</span>
                            </div>
                            <div className="d-xp-reward">
                                <Zap size={14} fill="currentColor" />
                                <span>Next: Iron Badge</span>
                            </div>
                        </div>
                        <div className="d-xp-bar-bg">
                            <div className="d-xp-bar-fill" style={{ width: '65%' }} />
                        </div>
                        <div className="d-xp-vals" style={{ color: 'white'}}>
                            <span>1,450 XP</span>
                            <span>2,200 XP</span>
                        </div>
                    </div>

                </div>
            </header>

            {/* ── CORE FEATURES GRID ───────────────────────────── */}
            <section className="lp-v3-section bg-black" id="system">
                <div className="lp-v3-container">
                    <div className="lp-v3-grid-top">
                        <h2 className="lp-v3-h2 txt-white">Everything you need.<br/>None of the bloat.</h2>
                        <p className="lp-v3-p txt-muted">Ajwaa is stripped down to the raw essentials of fitness tracking, wrapped in a brutally simple, gamified interface.</p>
                    </div>

                    <div className="lp-v3-features-grid">
                        <div className="lp-v3-f-card">
                            <Target size={32} color="var(--c-volt)" />
                            <h3>Nutrition & Macros</h3>
                            <p>Instantly log meals from our database. Visual rings tell you exactly how many calories, proteins, carbs, and fats you have left for the day.</p>
                        </div>
                        <div className="lp-v3-f-card">
                            <Dumbbell size={32} color="var(--c-red)" />
                            <h3>Savage Workouts</h3>
                            <p>Build routines or launch an empty workout. Track sets, reps, weight, and crush your PRs. The integrated rest timer automatically keeps you disciplined.</p>
                        </div>
                        <div className="lp-v3-f-card">
                            <Trophy size={32} color="var(--c-sand)" />
                            <h3>Level Up System</h3>
                            <p>You earn XP for hitting your calorie targets, finishing grueling workouts, and drinking water. Unlock 12+ badges as you march toward Level 100.</p>
                        </div>
                        <div className="lp-v3-f-card">
                            <BarChart2 size={32} color="var(--c-blue)" />
                            <h3>Visual Analytics</h3>
                            <p>Watch your bodyweight trend down and your lift volumes skyrocket through clean, beautiful historic data charts.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── ACCOUNTABILITY (BEREAL FEATURE) ──────────────── */}
            <section className="lp-v3-section split-feature" id="bereal">
                <div className="lp-v3-container lp-v3-split align-center">
                    <div className="lp-v3-split-text">
                        <div className="lp-v3-badge dark">
                            <Camera size={14} /> THE 'BEREAL' OF FITNESS
                        </div>
                        <h2 className="lp-v3-h2">Snap it. Log it. Prove it.</h2>
                        <p className="lp-v3-p" style={{ marginBottom: 32 }}>
                            Motivation fades, but streaks don't. Our unique daily check-in requires you to upload a live photo from the gym or your meal to prove you're grinding. 
                        </p>
                        <div className="lp-v3-check-list">
                            <div className="lp-v3-check-item">
                                <ShieldCheck size={20} className="txt-green" />
                                <span><strong>Daily Check-in Modal:</strong> Opens right to your camera. No uploading old fake photos.</span>
                            </div>
                            <div className="lp-v3-check-item">
                                <ShieldCheck size={20} className="txt-green" />
                                <span><strong>Massive XP Reward:</strong> Earn huge bumps in XP to level up instantly.</span>
                            </div>
                            <div className="lp-v3-check-item">
                                <ShieldCheck size={20} className="txt-green" />
                                <span><strong>Unbreakable Streaks:</strong> Watch the flame icon grow as you check-in consecutive days.</span>
                            </div>
                        </div>
                    </div>
                    <div className="lp-v3-split-art">
                         {/* Live Widget Mockup of the Modal */}
                         <div className="lp-v3-fake-modal">
                            <div className="checkin-header" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between'}}>
                                <div className="checkin-title"><Camera size={16} color="var(--c-volt)"/> Time to be real.</div>
                            </div>
                            <div className="fake-camera-feed">
                                <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop" alt="Gym Selfie" />
                                <div className="checkin-stamp">
                                    <div>17:45</div>
                                    <div style={{ fontSize: 10, opacity: 0.8 }}>AJWAA GYM CHECK-IN</div>
                                </div>
                            </div>
                            <div className="checkin-controls" style={{ padding: '24px 20px', display: 'flex', justifyContent: 'center'}}>
                                <button className="checkin-btn-primary" style={{ width: '100%'}}>
                                    Post Check-in (+50 XP)
                                </button>
                            </div>
                         </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────── */}
            <footer className="lp-v3-footer">
                <div className="lp-v3-container footer-flex">
                    <div className="lp-v3-logo">
                        <Zap size={24} fill="var(--c-volt)" color="var(--c-sand)" />
                        <span className="txt-white">AJWAA</span>
                    </div>
                    <div className="lp-v3-footer-r">
                        <p>Brutal. Gamified. Effective.</p>
                        <p className="txt-muted">© 2026 Ajwaa Fitness.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
