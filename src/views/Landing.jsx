import { Target, Trophy, Dumbbell, BarChart2, Camera, ShieldCheck, ArrowRight } from 'lucide-react';
import '../views/Dashboard.css'; // Import actual app CSS for the live widgets
import './Landing.css';

export default function Landing({ onStart }) {
    return (
        <div className="lp-v4">
            
            {/* ── DOT GRID BACKGROUND ──────────────────────────── */}
            <div className="lp-v4-bg-texture" />

            {/* ── TOP NAV ──────────────────────────────────────── */}
            <nav className="lp-v4-nav lp-v4-grid-border">
                <div className="lp-v4-nav-inner">
                    <div className="lp-v4-logo">AJWAA</div>
                    <div className="lp-v4-nav-right">
                        <button className="lp-v4-btn-outline" onClick={onStart}>
                            Try Web App
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── HERO SECTION ─────────────────────────────────── */}
            <header className="lp-v4-hero lp-v4-grid-border">
                <div className="lp-v4-hero-inner">
                    
                    {/* LEFT: Aggressive Typography */}
                    <div className="lp-v4-hero-text">
                        <h1 className="lp-v4-h1">
                            YOU'VE DELETED<br />
                            YOUR DIET APP<br />
                            <span className="txt-red">5 TIMES.</span><br />
                            HERE IS THE CURE.
                        </h1>
                        <p className="lp-v4-sub">
                            The fitness app designed for people who hate tracking. We built an aggressive, gamified neo-brutalist system that turns discipline into dopamine. Stop logging calories like it's 2012.
                        </p>
                        
                        <div className="lp-v4-actions">
                            <button className="lp-v4-btn-solid" onClick={onStart}>
                                Launch Web App <ArrowRight size={20} />
                            </button>
                            <div className="lp-v4-store-buttons">
                                <div className="lp-v4-store coming-soon">
                                    <span>Apple App Store</span>
                                    <strong>Coming Soon</strong>
                                </div>
                                <div className="lp-v4-store coming-soon">
                                    <span>Google Play</span>
                                    <strong>Coming Soon</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Live App inside CSS Phone Frame */}
                    <div className="lp-v4-hero-art">
                        <div className="lp-v4-phone-frame">
                            <div className="lp-v4-notch" />
                            
                            {/* LIVE WIDGETS RENDERING */}
                            <div className="lp-v4-phone-screen">
                                <div className="lp-v4-phone-header">
                                    <div className="lp-v4-time">9:41</div>
                                    <div className="lp-v4-status-icons">📶 🔋</div>
                                </div>
                                
                                <div className="lp-v4-phone-content">
                                    
                                    {/* The Ring Widget */}
                                    <div className="d-stats-card lp-live-widget">
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

                                    {/* The Check In Widget */}
                                    <div className="d-checkin-card lp-live-widget">
                                        <div className="d-checkin-icon" style={{background: 'rgba(255,255,255,0.1)'}}>
                                            <Camera size={24} color="var(--c-volt)" />
                                        </div>
                                        <div className="d-checkin-text" style={{ textAlign: 'left', color: 'white' }}>
                                            <div className="d-checkin-title">Time to be real.</div>
                                            <div className="d-checkin-sub">Snap gym pic for +50 XP</div>
                                        </div>
                                        <div className="d-checkin-arrow" style={{background:'var(--c-volt)', color:'var(--c-black)'}}>GO</div>
                                    </div>

                                    {/* App Fake Button */}
                                    <button className="d-action-hero" style={{ marginTop: 'auto', width: '100%', marginBottom: 0 }}>
                                        <div className="d-ah-content">
                                            <div className="d-ah-icon"><Dumbbell size={20} strokeWidth={3} /></div>
                                            <div className="d-ah-text">
                                                <div className="d-ah-title">Start Workout</div>
                                            </div>
                                        </div>
                                        <div className="d-ah-arrow">GO</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── THE HOOK (BEREAL) ────────────────────────────── */}
            <section className="lp-v4-section lp-v4-grid-border">
                <div className="lp-v4-split">
                    <div className="lp-v4-col text-focused bg-dark">
                        <div className="tagline txt-volt">[ ACCOUNTABILITY PROTOCOL ]</div>
                        <h2 className="lp-v4-h2 txt-white">SNAP IT.<br/>LOG IT.<br/>PROVE IT.</h2>
                        <ul className="lp-v4-checks txt-muted">
                            <li><ShieldCheck size={24} className="txt-green"/> <strong>No Fake Check-ins.</strong> Open the camera instantly from your dashboard to prove you're at the gym.</li>
                            <li><ShieldCheck size={24} className="txt-green"/> <strong>Massive XP Rewards.</strong> Post your snapshot to earn brutal amounts of XP and level up faster.</li>
                        </ul>
                    </div>
                    <div className="lp-v4-col center-content bg-sand">
                         <div className="lp-v4-feature-box">
                              {/* Live Widget Mockup of the Modal */}
                              <div className="camera-modal-mock">
                                  <div className="camera-modal-header">
                                      <Camera size={16}/> TIME TO BE REAL
                                  </div>
                                  <div className="camera-modal-view">
                                      <div className="camera-crosshair"/>
                                      <div className="camera-stamp">AJWAA SECURE CHECK-IN</div>
                                  </div>
                                  <div className="camera-modal-btn">Post Snapshot (+50 XP)</div>
                              </div>
                         </div>
                    </div>
                </div>
            </section>

            {/* ── THE SYSTEM (FEATURES) ────────────────────────── */}
            <section className="lp-v4-section lp-v4-grid-border">
                <div className="lp-v4-header-block bg-sand">
                    <h2 className="lp-v4-h2 text-center" style={{margin: 0}}>THE ARSENAL</h2>
                </div>
                <div className="lp-v4-grid-3">
                    <div className="lp-v4-feature-card">
                        <div className="fc-icon"><BarChart2 size={32}/></div>
                        <h3 className="fc-title">Macronutrients, Visualized.</h3>
                        <p className="fc-desc">Stop guessing your protein intake. The ring doesn't lie. Our brutal dashboard clearly shows what you have left.</p>
                    </div>
                    <div className="lp-v4-feature-card">
                        <div className="fc-icon txt-red"><Dumbbell size={32}/></div>
                        <h3 className="fc-title">Replace The Spreadsheet.</h3>
                        <p className="fc-desc">Log your sets, reps, and weights. We'll time your rest periods automatically so you don't scroll TikTok for 10 minutes.</p>
                    </div>
                    <div className="lp-v4-feature-card">
                        <div className="fc-icon txt-volt"><Trophy size={32} color="var(--c-black)"/></div>
                        <h3 className="fc-title">Level Up Real Life.</h3>
                        <p className="fc-desc">Every grueling rep and tracked meal grants you XP. Build an unbreakable streak and earn badges.</p>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────── */}
            <footer className="lp-v4-footer">
                <h2 className="lp-v4-h1 txt-sand text-center" style={{fontSize: '8vw', margin: '0 0 40px'}}>AJWAA FITNESS</h2>
                <div className="lp-v4-footer-bottom">
                    <button className="lp-v4-btn-solid invert" onClick={onStart}>
                        Try Web App <ArrowRight size={20} />
                    </button>
                    <div className="txt-muted" style={{fontSize: 14, fontWeight: 700}}>© 2026. BRUTAL EFFICIENCY.</div>
                </div>
            </footer>
        </div>
    );
}
