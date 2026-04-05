import { Zap, Target, Trophy, Dumbbell, BarChart2, Sparkles, ChevronRight, Flame, Star, Users, Shield, Download, Smartphone, Heart } from 'lucide-react';
import './Landing.css';

const FEATURES = [
    { icon: Target, title: 'Smart Nutrition', desc: 'Track calories & macros with AI-powered food search. Millions of foods at your fingertips.', color: '#FF4444' },
    { icon: Dumbbell, title: 'Workout Tracker', desc: 'Pick from 100+ exercises. Log sets, reps, weight with rest timers built in.', color: '#FFB800' },
    { icon: Trophy, title: 'Gamified XP System', desc: 'Earn XP for every action. Level up from Beginner to Legend. Unlock 12+ achievements.', color: '#E0FF00' },
    { icon: BarChart2, title: 'Visual Analytics', desc: 'Weekly calorie charts, weight trends, macro breakdowns. See your progress at a glance.', color: '#3B82F6' },
    { icon: Sparkles, title: 'AI Fitness Coach', desc: 'Ask Ajwa anything. Get personalized meal ideas, workout suggestions, and motivation.', color: '#A855F7' },
    { icon: Users, title: 'Social Leagues', desc: 'Compete with friends on weekly leaderboards. Copy their workouts. Rise through the ranks.', color: '#22C55E' },
];

const REVIEWS = [
    { name: 'Ahmed K.', text: "Finally an app that makes tracking fun. The XP system is addictive.", rating: 5 },
    { name: 'Sara M.', text: "The AI coach actually gives useful advice. Way better than other diet apps.", rating: 5 },
    { name: 'Omar H.', text: "I've tried MyFitnessPal, Hevy, and FitNotes. Ajwaa is the one I kept using.", rating: 5 },
];

export default function Landing({ onStart }) {
    const base = import.meta.env.BASE_URL || '/';

    return (
        <div className="landing">
            {/* ── NAVIGATION ───────────────────────────────────── */}
            <nav className="l-nav">
                <div className="l-logo">
                    <Zap size={20} fill="var(--c-volt)" color="var(--c-volt)" />
                    <span>AJWAA</span>
                </div>
                <div className="l-nav-links">
                    <a href="#features">Features</a>
                    <a href="#screenshots">Screenshots</a>
                    <a href="#reviews">Reviews</a>
                </div>
                <button className="l-nav-btn" onClick={onStart}>
                    <Download size={14} /> Download
                </button>
            </nav>

            {/* ── HERO ─────────────────────────────────────────── */}
            <section className="l-hero">
                <div className="l-hero-content">
                    <div className="l-hero-text">
                        <div className="l-hero-badge">
                            <Flame size={14} /> GAMIFIED FITNESS
                        </div>
                        <h1 className="l-hero-title">
                            Your Body.<br />
                            <span className="l-hero-accent">Your Game.</span>
                        </h1>
                        <p className="l-hero-sub">
                            Track nutrition, crush workouts, earn XP, and level up.
                            The fitness app that turns discipline into dopamine.
                        </p>
                        <div className="l-hero-buttons">
                            <a href="https://apps.apple.com" className="l-store-btn apple" target="_blank" rel="noopener noreferrer">
                                <div className="l-store-icon">🍎</div>
                                <div>
                                    <div className="l-store-small">Download on the</div>
                                    <div className="l-store-big">App Store</div>
                                </div>
                            </a>
                            <a href="https://play.google.com" className="l-store-btn google" target="_blank" rel="noopener noreferrer">
                                <div className="l-store-icon">▶️</div>
                                <div>
                                    <div className="l-store-small">Get it on</div>
                                    <div className="l-store-big">Google Play</div>
                                </div>
                            </a>
                        </div>
                        <div className="l-hero-trust">
                            <div className="l-trust-stars">{'★'.repeat(5)}</div>
                            <span>4.9 rating · Free forever</span>
                        </div>
                    </div>
                    <div className="l-hero-phone">
                        <img src={`${base}mockups/dashboard.png`} alt="Ajwaa Dashboard" className="l-phone-img" />
                    </div>
                </div>
            </section>

            {/* ── STATS BAR ────────────────────────────────────── */}
            <section className="l-stats-bar">
                {[
                    { num: '100+', label: 'Exercises' },
                    { num: '12', label: 'Achievements' },
                    { num: '∞', label: 'Food Database' },
                    { num: '24/7', label: 'AI Coach' },
                ].map(s => (
                    <div key={s.label} className="l-stat">
                        <div className="l-stat-num">{s.num}</div>
                        <div className="l-stat-label">{s.label}</div>
                    </div>
                ))}
            </section>

            {/* ── FEATURES ─────────────────────────────────────── */}
            <section className="l-features" id="features">
                <div className="l-section-center">
                    <div className="l-section-label"><Star size={14} /> FEATURES</div>
                    <h2 className="l-section-title">Everything you need.<br />Nothing you don't.</h2>
                </div>
                <div className="l-features-grid">
                    {FEATURES.map(f => (
                        <div key={f.title} className="l-feature-card">
                            <div className="l-feature-icon" style={{ background: `${f.color}15`, color: f.color }}>
                                <f.icon size={24} />
                            </div>
                            <div className="l-feature-title">{f.title}</div>
                            <div className="l-feature-desc">{f.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── SCREENSHOTS ──────────────────────────────────── */}
            <section className="l-screenshots" id="screenshots">
                <div className="l-section-center">
                    <div className="l-section-label"><Smartphone size={14} /> APP PREVIEW</div>
                    <h2 className="l-section-title">See it in action.</h2>
                </div>
                <div className="l-screenshots-row">
                    <div className="l-screenshot-item">
                        <img src={`${base}mockups/dashboard.png`} alt="Dashboard" />
                        <div className="l-screenshot-label">Smart Dashboard</div>
                    </div>
                    <div className="l-screenshot-item featured">
                        <img src={`${base}mockups/workout.png`} alt="Workout Tracker" />
                        <div className="l-screenshot-label">Workout Tracker</div>
                    </div>
                    <div className="l-screenshot-item">
                        <img src={`${base}mockups/achievements.png`} alt="Achievements" />
                        <div className="l-screenshot-label">Achievements & XP</div>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ─────────────────────────────────── */}
            <section className="l-how">
                <div className="l-section-center">
                    <div className="l-section-label"><Zap size={14} /> HOW IT WORKS</div>
                    <h2 className="l-section-title">3 steps to a better you.</h2>
                </div>
                <div className="l-steps">
                    {[
                        { num: '01', title: 'Set Your Goals', desc: 'Tell us your stats. Our algorithm calculates your perfect calorie & macro targets.', icon: Target },
                        { num: '02', title: 'Track Everything', desc: 'Log meals from our global food database. Record workouts with built-in timers.', icon: BarChart2 },
                        { num: '03', title: 'Level Up', desc: 'Earn XP, unlock badges, climb leaderboards. Watch yourself transform.', icon: Trophy },
                    ].map(s => (
                        <div key={s.num} className="l-step">
                            <div className="l-step-num">{s.num}</div>
                            <div className="l-step-icon"><s.icon size={20} /></div>
                            <div className="l-step-text">
                                <div className="l-step-title">{s.title}</div>
                                <div className="l-step-desc">{s.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── REVIEWS ──────────────────────────────────────── */}
            <section className="l-reviews" id="reviews">
                <div className="l-section-center">
                    <div className="l-section-label"><Heart size={14} /> REVIEWS</div>
                    <h2 className="l-section-title">Loved by lifters.</h2>
                </div>
                <div className="l-reviews-row">
                    {REVIEWS.map(r => (
                        <div key={r.name} className="l-review-card">
                            <div className="l-review-stars">{'★'.repeat(r.rating)}</div>
                            <div className="l-review-text">"{r.text}"</div>
                            <div className="l-review-author">— {r.name}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FINAL CTA ────────────────────────────────────── */}
            <section className="l-cta">
                <div className="l-cta-card">
                    <div className="l-cta-glow" />
                    <h2 className="l-cta-title">Ready to level up?</h2>
                    <p className="l-cta-sub">Free forever. No credit card. No ads. Just gains.</p>
                    <div className="l-hero-buttons" style={{ justifyContent: 'center' }}>
                        <a href="https://apps.apple.com" className="l-store-btn apple" target="_blank" rel="noopener noreferrer">
                            <div className="l-store-icon">🍎</div>
                            <div>
                                <div className="l-store-small">Download on the</div>
                                <div className="l-store-big">App Store</div>
                            </div>
                        </a>
                        <a href="https://play.google.com" className="l-store-btn google" target="_blank" rel="noopener noreferrer">
                            <div className="l-store-icon">▶️</div>
                            <div>
                                <div className="l-store-small">Get it on</div>
                                <div className="l-store-big">Google Play</div>
                            </div>
                        </a>
                    </div>
                    <button className="l-try-web" onClick={onStart}>
                        Or try the web app <ChevronRight size={14} />
                    </button>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────── */}
            <footer className="l-footer">
                <div className="l-footer-inner">
                    <div className="l-footer-logo">
                        <Zap size={16} fill="var(--c-volt)" color="var(--c-volt)" />
                        <span>AJWAA</span>
                    </div>
                    <div className="l-footer-links">
                        <a href="#features">Features</a>
                        <a href="#screenshots">Screenshots</a>
                        <a href="#reviews">Reviews</a>
                    </div>
                    <div className="l-footer-text">© 2026 Ajwaa Fitness. Built with 💪</div>
                </div>
            </footer>
        </div>
    );
}
