import { Zap, Target, Trophy, Dumbbell, BarChart2, Camera, Flame, Star, ChevronRight, Smartphone, ShieldCheck, Gamepad2, ArrowRight } from 'lucide-react';
import './Landing.css';

export default function Landing({ onStart }) {
    const base = import.meta.env.BASE_URL || '/';

    return (
        <div className="lp-v2">
            {/* ── NAVIGATION ───────────────────────────────────── */}
            <nav className="lp-nav">
                <div className="lp-logo">
                    <Zap size={20} fill="var(--c-volt)" color="var(--c-black)" />
                    <span>AJWAA</span>
                </div>
                <div className="lp-nav-links">
                    <a href="#benefits">The System</a>
                    <a href="#checkin">Daily Checks</a>
                    <a href="#reviews">Wall of Frame</a>
                </div>
                <button className="lp-btn-primary lp-nav-cta" onClick={onStart}>
                    Try the Web App
                </button>
            </nav>

            {/* ── HERO = 60/30/10 BRUTALIST ────────────────────── */}
            <section className="lp-hero">
                <div className="lp-split">
                    <div className="lp-hero-text">
                        <div className="lp-hero-badge">
                            <Gamepad2 size={16} /> GAMIFIED FITNESS HAS ARRIVED
                        </div>
                        <h1 className="lp-hero-title">
                            The Only Diet App<br />
                            <span className="lp-highlight">You'll Actually Play.</span>
                        </h1>
                        <p className="lp-hero-sub">
                            Stop logging calories like it's 2012. Track your nutrition, snap your daily gym check-in, earn XP, and level up from Beginner to Legend. 
                        </p>
                        
                        <div className="lp-hero-actions">
                            <button className="lp-btn-mega" onClick={onStart}>
                                Start Playing Now <ArrowRight size={20} />
                            </button>
                            <div className="lp-trust-block">
                                <span className="lp-stars">★★★★★</span>
                                <div><strong>4.9/5 Rating</strong> • 100% Free Web App</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="lp-hero-art">
                        <img src={`${base}mockups/dashboard.png`} alt="Dashboard Mockup" className="lp-phone-mock" />
                        
                        {/* Floating elements to show gaming aspect */}
                        <div className="lp-float-card xp-float">
                            <div className="lp-fc-icon"><Trophy size={16} color="#000" /></div>
                            <div className="lp-fc-text">
                                <div className="fc-bold">+50 XP</div>
                                <div className="fc-sub">Goal Reached</div>
                            </div>
                        </div>
                        
                        <div className="lp-float-card bereal-float">
                            <div className="lp-fc-icon"><Camera size={16} color="#000" /></div>
                            <div className="lp-fc-text">
                                <div className="fc-bold">Gym Check-in</div>
                                <div className="fc-sub">24 Day Streak 🔥</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SOCIAL PROOF STRIP ───────────────────────────── */}
            <div className="lp-proof-strip">
                <div className="lp-proof-item">🔥 5,000+ WORKOUTS LOGGED</div>
                <div className="lp-proof-item">•</div>
                <div className="lp-proof-item">🏆 12,000+ BADGES EARNED</div>
                <div className="lp-proof-item">•</div>
                <div className="lp-proof-item">📸 24/7 ACCOUNTABILITY</div>
                <div className="lp-proof-item">•</div>
                <div className="lp-proof-item">🔥 5,000+ WORKOUTS LOGGED</div>
            </div>

            {/* ── BENEFITS GRID ────────────────────────────────── */}
            <section className="lp-section" id="benefits">
                <div className="lp-container">
                    <h2 className="lp-section-title">Built for results.<br/>Designed for dopamine.</h2>
                    
                    <div className="lp-grid-3">
                        <div className="lp-bcard bg-black">
                            <div className="lp-bicon txt-volt"><Target size={32} /></div>
                            <h3>Smart Macros</h3>
                            <p>Automated macro splits. Interactive calorie tracking ring. Millions of foods.</p>
                        </div>
                        <div className="lp-bcard bg-white">
                            <div className="lp-bicon txt-red"><Dumbbell size={32} /></div>
                            <h3>Workout Tracker</h3>
                            <p>Replace your spreadsheet. Track sets, reps, and PRs with built-in rest timers.</p>
                        </div>
                        <div className="lp-bcard bg-sand">
                            <div className="lp-bicon txt-black"><Trophy size={32} /></div>
                            <h3>XP & Levels</h3>
                            <p>Every healthy choice grants you XP. Level up your profile to flex on your friends.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── THE HOOK: GYM CHECK-IN ───────────────────────── */}
            <section className="lp-feature-split" id="checkin">
                <div className="lp-container lp-split align-center">
                    <div className="lp-feat-img-box">
                        <img src={`${base}mockups/workout.png`} alt="Workout Checkin Mockup" className="lp-phone-mock offset" />
                    </div>
                    <div className="lp-feat-text">
                        <div className="lp-label"><Camera size={16}/> ACCOUNTABILITY</div>
                        <h2 className="lp-section-title">The "BeReal" of Fitness.</h2>
                        <ul className="lp-checklist">
                            <li><ShieldCheck size={20} className="txt-volt" /> <strong>Tap to open the camera</strong> right from your dashboard.</li>
                            <li><ShieldCheck size={20} className="txt-volt" /> <strong>Snap a post-workout selfie</strong> or a photo of the gym floor.</li>
                            <li><ShieldCheck size={20} className="txt-volt" /> <strong>Build an unbreakable streak</strong> and earn massive XP boosts.</li>
                        </ul>
                        <button className="lp-btn-outline mt-24" onClick={onStart}>
                            Start Your Streak <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </section>

            {/* ── REVIEWS ──────────────────────────────────────── */}
            <section className="lp-section bg-black text-white" id="reviews">
                <div className="lp-container">
                    <div className="lp-label txt-volt"><Star size={16} /> WALL OF GAINS</div>
                    <h2 className="lp-section-title txt-white">Don't just take our word for it.</h2>
                    
                    <div className="lp-grid-3">
                        {[
                            { name: "Ahmed K.", text: "The daily photo check-in actually gets me out of bed. I refuse to lose my 40-day streak.", role: "Level 14 Warrior" },
                            { name: "Sara M.", text: "Finally an app that makes calorie tracking feel like a game instead of a chore.", role: "Level 8 Beginner" },
                            { name: "Omar H.", text: "The brutalist design is gorgeous. It looks like a premium streetwear brand, not a medical app.", role: "Level 22 Legend" }
                        ].map(r => (
                            <div key={r.name} className="lp-review-card">
                                <div className="lp-review-stars">★★★★★</div>
                                <p>"{r.text}"</p>
                                <div className="lp-reviewer">
                                    <div className="lp-r-name">{r.name}</div>
                                    <div className="lp-r-role">{r.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FINAL CTA ────────────────────────────────────── */}
            <section className="lp-cta-mega">
                <div className="lp-container text-center">
                    <h2 className="lp-mega-title">Stop Thinking.<br/>Start Playing.</h2>
                    <p className="lp-mega-sub">Join the thousands of users leveling up their real-life stats.</p>
                    
                    <div className="lp-store-flex">
                        <button className="lp-btn-mega" onClick={onStart}>
                            Launch the Web App <ArrowRight size={20} />
                        </button>
                        
                        <div className="lp-store-badges">
                            <a href="https://apps.apple.com" className="lp-store-badge apple">
                                <div className="badge-icon">🍏</div>
                                <div>
                                    <div className="badge-s">Download on the</div>
                                    <div className="badge-b">App Store</div>
                                </div>
                            </a>
                            <a href="https://play.google.com" className="lp-store-badge google">
                                <div className="badge-icon">▶️</div>
                                <div>
                                    <div className="badge-s">GET IT ON</div>
                                    <div className="badge-b">Google Play</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────── */}
            <footer className="lp-footer">
                <div className="lp-container lp-split align-center" style={{ gap: '20px' }}>
                    <div className="lp-logo">
                        <Zap size={20} fill="var(--c-volt)" color="var(--c-volt)" />
                        <span>AJWAA</span>
                    </div>
                    <div className="lp-f-text">© 2026 Ajwaa Fitness. All gains reserved.</div>
                </div>
            </footer>
        </div>
    );
}
