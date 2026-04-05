import { Zap, Target, Trophy, Dumbbell, BarChart2, Sparkles, ChevronRight, Flame, Star, Users } from 'lucide-react';
import './Landing.css';

const FEATURES = [
    { icon: Target, title: 'Smart Nutrition', desc: 'Track calories & macros with AI-powered food search across millions of foods.' },
    { icon: Dumbbell, title: 'Workout Tracker', desc: 'Log sets, reps, and weight. Pick from 100+ exercises or create your own.' },
    { icon: Trophy, title: 'Gamified Progress', desc: 'Earn XP, level up, unlock achievements. Fitness that feels like a game.' },
    { icon: BarChart2, title: 'Visual Analytics', desc: 'Weekly charts, weight trends, macro breakdowns. See your progress clearly.' },
    { icon: Sparkles, title: 'AI Coach', desc: 'Get personalized meal ideas, workout suggestions, and motivation on demand.' },
    { icon: Users, title: 'Social League', desc: 'Compete with friends on weekly leaderboards. Copy their workouts.' },
];

const STATS = [
    { num: '100+', label: 'Exercises' },
    { num: '12', label: 'Achievements' },
    { num: '∞', label: 'Foods' },
    { num: '24/7', label: 'AI Coach' },
];

export default function Landing({ onStart }) {
    return (
        <div className="landing">
            {/* Nav */}
            <nav className="l-nav">
                <div className="l-logo">
                    <Zap size={20} fill="var(--c-volt)" color="var(--c-volt)" />
                    <span>AJWAA</span>
                </div>
                <button className="l-nav-btn" onClick={onStart}>GET STARTED</button>
            </nav>

            {/* Hero */}
            <section className="l-hero">
                <div className="l-hero-badge">
                    <Flame size={14} /> NEW — Gamified Fitness Tracking
                </div>
                <h1 className="l-hero-title">
                    Your Body.<br />
                    <span className="l-hero-accent">Your Game.</span>
                </h1>
                <p className="l-hero-sub">
                    Track nutrition, crush workouts, earn XP, and level up. 
                    Ajwaa turns your fitness journey into an addictive game.
                </p>
                <button className="l-hero-cta" onClick={onStart}>
                    START FOR FREE <ChevronRight size={18} />
                </button>
                <div className="l-hero-stats">
                    {STATS.map(s => (
                        <div key={s.label} className="l-stat">
                            <div className="l-stat-num">{s.num}</div>
                            <div className="l-stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="l-features">
                <div className="l-section-label">
                    <Star size={14} /> FEATURES
                </div>
                <h2 className="l-section-title">Everything you need.<br />Nothing you don't.</h2>
                <div className="l-features-grid">
                    {FEATURES.map(f => (
                        <div key={f.title} className="l-feature-card">
                            <div className="l-feature-icon">
                                <f.icon size={24} />
                            </div>
                            <div className="l-feature-title">{f.title}</div>
                            <div className="l-feature-desc">{f.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section className="l-how">
                <div className="l-section-label">
                    <Zap size={14} /> HOW IT WORKS
                </div>
                <h2 className="l-section-title">3 steps to a<br />better you.</h2>
                <div className="l-steps">
                    <div className="l-step">
                        <div className="l-step-num">1</div>
                        <div className="l-step-text">
                            <div className="l-step-title">Set Your Goals</div>
                            <div className="l-step-desc">Tell us your stats and goals. We calculate your perfect plan.</div>
                        </div>
                    </div>
                    <div className="l-step">
                        <div className="l-step-num">2</div>
                        <div className="l-step-text">
                            <div className="l-step-title">Track Everything</div>
                            <div className="l-step-desc">Log meals, workouts, water. The AI coach keeps you accountable.</div>
                        </div>
                    </div>
                    <div className="l-step">
                        <div className="l-step-num">3</div>
                        <div className="l-step-text">
                            <div className="l-step-title">Level Up</div>
                            <div className="l-step-desc">Earn XP, unlock badges, climb the leaderboard. Watch yourself transform.</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="l-cta">
                <div className="l-cta-card">
                    <h2 className="l-cta-title">Ready to start<br />your journey?</h2>
                    <p className="l-cta-sub">Free forever. No credit card. No ads.</p>
                    <button className="l-hero-cta" onClick={onStart}>
                        LET'S GO <ChevronRight size={18} />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="l-footer">
                <div className="l-footer-logo">
                    <Zap size={16} fill="var(--c-volt)" color="var(--c-volt)" />
                    <span>AJWAA</span>
                </div>
                <div className="l-footer-text">© 2026 Ajwaa Fitness. Built with 💪</div>
            </footer>
        </div>
    );
}
