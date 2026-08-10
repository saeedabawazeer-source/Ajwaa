import KenneyIcon from '../components/KenneyIcon';
import AjwaaMascot from '../components/AjwaaMascot';
import './Landing.css';

export default function Landing({ onStart }) {
    return (
        <div className="lp-clean-wrapper">
            {/* Top Bar */}
            <nav className="lp-clean-nav">
                <div className="lp-brand-logo">AJWAA</div>
                <div className="lp-brand-tag">FITNESS REVOLUTION</div>
            </nav>

            {/* Hero Main Content */}
            <main className="lp-clean-hero">
                <div className="lp-hero-badge">
                    <KenneyIcon name="power" size={14} tint="white" />
                    <span>NEXT-GEN GAMIFIED FITNESS</span>
                </div>

                <h1 className="lp-hero-h1">
                    TRANSFORM YOUR BODY.<br />
                    <span className="lp-highlight">EARN XP DAILY.</span>
                </h1>

                <p className="lp-hero-subtitle">
                    The ultra-fast, single-screen fitness app with AI coaching, interactive muscle mapping, daily battle quests, and real accountability.
                </p>

                {/* Mascot Feature Spotlight */}
                <div className="lp-mascot-spotlight" onClick={onStart}>
                    <div className="lp-mascot-box">
                        <AjwaaMascot action="run" />
                    </div>
                    <div className="lp-mascot-text">
                        <div className="lp-mt-title">MEET YOUR AJWAA AI COACH</div>
                        <div className="lp-mt-sub">Daily quests, macro tracking, & instant feedback</div>
                    </div>
                </div>

                {/* Key Pillars */}
                <div className="lp-pillars-grid">
                    <div className="lp-pillar-item">
                        <KenneyIcon name="target" size={18} />
                        <div>
                            <div className="lp-pi-title">BODY MAP</div>
                            <div className="lp-pi-sub">Targeted splits</div>
                        </div>
                    </div>
                    <div className="lp-pillar-item">
                        <KenneyIcon name="star" size={18} />
                        <div>
                            <div className="lp-pi-title">DAILY QUESTS</div>
                            <div className="lp-pi-sub">Earn level XP</div>
                        </div>
                    </div>
                    <div className="lp-pillar-item">
                        <KenneyIcon name="check" size={18} />
                        <div>
                            <div className="lp-pi-title">TDEE ENGINE</div>
                            <div className="lp-pi-sub">Exact macros</div>
                        </div>
                    </div>
                </div>

                {/* Main Action Button */}
                <button className="lp-btn-primary" onClick={onStart}>
                    <span>LAUNCH AJWAA APP</span>
                    <KenneyIcon name="arrowRight" size={20} />
                </button>

                <div className="lp-trust-line">
                    <span><KenneyIcon name="check" size={12} tint="white" /> 100% FREE</span>
                    <span><KenneyIcon name="check" size={12} tint="white" /> NO ADS</span>
                    <span><KenneyIcon name="check" size={12} tint="white" /> SINGLE SCREEN</span>
                </div>
            </main>
        </div>
    );
}
