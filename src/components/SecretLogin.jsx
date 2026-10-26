import { useState } from 'react';
import { Lock, ChevronRight, X } from 'lucide-react';
import { OWNER_PASSCODE, OWNER_PLAN } from '../data/secretPlan';
import './SecretLogin.css';

export default function SecretLogin({ open, onClose, onSuccess }) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [unlocked, setUnlocked] = useState(false);

    if (!open) return null;

    function submit(e) {
        e.preventDefault();
        if (code.trim().toLowerCase() !== OWNER_PASSCODE) {
            setError('Wrong passcode');
            setCode('');
            return;
        }
        setError('');
        setUnlocked(true);
        onSuccess();
    }

    function close() {
        setCode('');
        setError('');
        setUnlocked(false);
        onClose();
    }

    const { targets, profile } = OWNER_PLAN;

    return (
        <div className="sl-overlay" onClick={close}>
            <div className="sl-panel" onClick={e => e.stopPropagation()}>
                <button className="sl-close" onClick={close} aria-label="Close"><X size={16} /></button>

                {!unlocked ? (
                    <>
                        <div className="sl-badge"><Lock size={12} /> OWNER ACCESS</div>
                        <h2 className="sl-title">Secret login</h2>
                        <p className="sl-sub">
                            Skips the landing page and onboarding, and loads the plan built from your Gemini conversation.
                        </p>
                        <form className="sl-form" onSubmit={submit}>
                            <input
                                className="sl-input"
                                type="password"
                                placeholder="Passcode"
                                autoFocus
                                value={code}
                                onChange={e => setCode(e.target.value)}
                            />
                            <button className="sl-btn" type="submit">UNLOCK <ChevronRight size={16} /></button>
                        </form>
                        {error && <div className="sl-error">{error}</div>}
                    </>
                ) : (
                    <>
                        <div className="sl-badge ok">PLAN LOADED</div>
                        <h2 className="sl-title">You're in, {profile.name}</h2>
                        <ul className="sl-summary">
                            <li><span>Calories</span><strong>{targets.calories} kcal</strong></li>
                            <li><span>Protein / Carbs / Fat</span><strong>{targets.macros.p} / {targets.macros.c} / {targets.macros.f} g</strong></li>
                            <li><span>Water</span><strong>{targets.water}L</strong></li>
                            <li><span>Training</span><strong>6-day PPL · Pull A first</strong></li>
                        </ul>
                        <button className="sl-btn" onClick={close}>ENTER AJWAA <ChevronRight size={16} /></button>
                    </>
                )}
            </div>
        </div>
    );
}
