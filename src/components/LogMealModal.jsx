import { useState, useRef, useEffect } from 'react';
import { getMealSlotLabel } from '../utils/helpers';
import { FOOD_DB } from '../data/foodDB';
import { searchFood } from '../utils/foodAPI';
import { detectFoodFromPhoto, getGeminiKey, setGeminiKey } from '../utils/geminiFood';
import { X, Camera, Image, Search, Loader, KeyRound, AlertCircle } from 'lucide-react';
import './Modal.css';

const SLOTS = ['breakfast', 'lunch', 'dinner', 'snacks'];
const QUICK_PICKS = [
    { name: 'Cheeseburger', cals: 535, p: 28, c: 41, f: 28 },
    { name: 'Margherita Pizza', cals: 800, p: 33, c: 100, f: 30 },
    { name: 'Chicken Caesar Salad', cals: 480, p: 38, c: 18, f: 28 },
    { name: 'French Fries', cals: 365, p: 4, c: 48, f: 17 },
    { name: 'Grilled Chicken Breast', cals: 231, p: 43, c: 0, f: 5 },
    { name: 'White Rice (1 cup)', cals: 205, p: 4, c: 45, f: 0 },
    { name: 'Salmon Fillet', cals: 367, p: 39, c: 0, f: 22 },
    { name: 'Protein Shake', cals: 220, p: 30, c: 15, f: 4 },
    { name: 'Kabsa (Chicken)', cals: 680, p: 38, c: 75, f: 24 },
    { name: 'Shawarma (Chicken)', cals: 450, p: 30, c: 40, f: 18 },
    { name: 'Eggs (2 large)', cals: 180, p: 12, c: 1, f: 14 },
    { name: 'Greek Yogurt', cals: 100, p: 17, c: 6, f: 0 },
];

export default function LogMealModal({ open, onClose, onSave, slot, onSlotChange }) {
    const [mode, setMode] = useState('input');
    const [food, setFood] = useState('');
    const [cals, setCals] = useState('');
    const [p, setP] = useState('');
    const [c, setC] = useState('');
    const [f, setF] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [detecting, setDetecting] = useState(false);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [detectResult, setDetectResult] = useState(null);
    const [detectError, setDetectError] = useState('');
    const [apiKey, setApiKey] = useState(getGeminiKey());
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => { return () => { if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop()); }; }, []);
    if (!open) return null;

    async function startCamera() {
        setMode('camera'); setPhotoUrl(null); setDetectResult(null); setDetectError('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch { setDetectError('Camera blocked — upload a photo instead'); }
    }

    function stopCamera() {
        if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
        setMode('input');
    }

    async function snapAndDetect() {
        const v = videoRef.current;
        if (!v) return;
        const cv = document.createElement('canvas');
        cv.width = v.videoWidth || 640; cv.height = v.videoHeight || 480;
        cv.getContext('2d').drawImage(v, 0, 0, cv.width, cv.height);
        cv.toBlob(async (blob) => {
            if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = reader.result.split(',')[1];
                setPhotoUrl(reader.result);
                setMode('result');
                setDetecting(true);
                const result = await detectFoodFromPhoto(base64);
                setDetecting(false);
                if (result.error) {
                    if (result.error === 'no_key') setMode('key');
                    else setDetectError(result.error === 'rate_limited' ? 'Rate limit — wait a minute' :
                        result.error === 'invalid_key' ? 'Bad key — check settings' : 'Detection failed');
                } else {
                    setDetectResult(result);
                    setFood(result.dish);
                    setCals(result.cals); setP(result.protein); setC(result.carbs); setF(result.fat);
                }
            };
            reader.readAsDataURL(blob);
        }, 'image/jpeg', 0.7);
    }

    function useGallery(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
            const base64 = reader.result.split(',')[1];
            setPhotoUrl(reader.result); setMode('result'); setDetecting(true);
            const result = await detectFoodFromPhoto(base64);
            setDetecting(false);
            if (result.error) {
                if (result.error === 'no_key') setMode('key');
                else setDetectError('Detection failed');
            } else {
                setDetectResult(result);
                setFood(result.dish); setCals(result.cals); setP(result.protein); setC(result.carbs); setF(result.fat);
            }
        };
        reader.readAsDataURL(file);
    }

    async function handleSearch(val) {
        setFood(val);
        if (val.trim().length >= 2) {
            const q = val.toLowerCase().trim();
            const local = [...FOOD_DB, ...QUICK_PICKS].filter(i => i.name.toLowerCase().includes(q)).slice(0, 5);
            setSuggestions(local);
            if (val.length >= 3) {
                const api = await searchFood(val);
                if (api.length) {
                    const norm = api.map(x => ({ name: x.name, cals: x.cals, p: x.protein, c: x.carbs, f: x.fat, fromApi: true }));
                    setSuggestions([...local, ...norm].slice(0, 10));
                }
            }
        } else setSuggestions([]);
    }

    function pickSuggestion(s) {
        setFood(s.name); setCals(s.cals); setP(s.p || 0); setC(s.c || 0); setF(s.f || 0);
        setSuggestions([]);
    }

    function save() {
        if (!food || !cals) return;
        onSave(food, Number(cals), Number(p) || 0, Number(c) || 0, Number(f) || 0);
        setMode('input'); setFood(''); setCals(''); setP(''); setC(''); setF('');
        setPhotoUrl(null); setDetectResult(null); setSuggestions([]);
    }
    function saveKey() { setGeminiKey(apiKey); setMode('input'); }

    return (
        <div className="lm-overlay" onClick={onClose}>
            <div className="lm-modal" onClick={e => e.stopPropagation()}>
                {/* Grab handle */}
                <div className="lm-handle" />
                <div className="lm-header">
                    <span className="lm-title">LOG {getMealSlotLabel(slot).toUpperCase()}</span>
                    <div className="lm-slots">
                        {SLOTS.map(s => (
                            <button key={s} className={`lm-slot ${slot === s ? 'on' : ''}`}
                                onClick={() => onSlotChange(s)}>{s.slice(0, 3).toUpperCase()}</button>
                        ))}
                    </div>
                    <button className="lm-close" onClick={onClose}><X size={16} /></button>
                </div>

                {mode === 'key' && (
                    <div className="lm-key-setup">
                        <KeyRound size={28} className="lm-key-icon" />
                        <div className="lm-key-title">CONNECT AI DETECTION</div>
                        <div className="lm-key-desc">Get a FREE Gemini API key (30 seconds):</div>
                        <ol className="lm-key-steps">
                            <li>Go to <b>aistudio.google.com</b></li>
                            <li>Click "Get API Key" → Create</li>
                            <li>Paste it below</li>
                        </ol>
                        <input className="lm-key-input" type="password" value={apiKey}
                            onChange={e => setApiKey(e.target.value)} placeholder="Paste your Gemini API key..." />
                        <button className="lm-key-save" onClick={saveKey}>CONNECT</button>
                        <button className="lm-key-skip" onClick={() => setMode('input')}>Skip for now</button>
                    </div>
                )}

                {mode === 'camera' && (
                    <div className="lm-camera">
                        <video ref={videoRef} autoPlay playsInline className="lm-video" />
                        <div className="lm-cam-actions">
                            <button className="lm-snap" onClick={snapAndDetect} />
                            <button className="lm-cam-cancel" onClick={stopCamera}>CANCEL</button>
                        </div>
                        {detectError && <div className="lm-error"><AlertCircle size={13} /> {detectError}</div>}
                    </div>
                )}

                {mode === 'result' && (
                    <div className="lm-result">
                        {photoUrl && <img src={photoUrl} alt="captured" className="lm-photo" />}
                        {detecting && (
                            <div className="lm-detecting">
                                <Loader size={20} className="lm-spin" />
                                <span>Analyzing your food...</span>
                            </div>
                        )}
                        {detectResult && (
                            <div className="lm-detected">
                                <div className="lm-detected-name">{detectResult.dish}</div>
                                {detectResult.dishAr && <div className="lm-detected-ar">{detectResult.dishAr}</div>}
                                <div className="lm-detected-cals">{detectResult.cals} kcal</div>
                                <div className="lm-macros">
                                    <div className="lm-macro p">P {detectResult.protein}g</div>
                                    <div className="lm-macro c">C {detectResult.carbs}g</div>
                                    <div className="lm-macro f">F {detectResult.fat}g</div>
                                </div>
                                {detectResult.ingredients?.length > 0 && (
                                    <div className="lm-ing">
                                        {detectResult.ingredients.map((ing, i) => (
                                            <div key={i} className="lm-ing-row">{ing.name} · {ing.grams}g · {ing.calories}kcal</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {detectError && <div className="lm-error"><AlertCircle size={13} /> {detectError}</div>}
                        <div className="lm-result-actions">
                            <button className="lm-confirm" onClick={save} disabled={!detectResult}>
                                {detectResult ? 'LOG THIS' : 'WAIT...'}
                            </button>
                            <button className="lm-retake" onClick={() => startCamera()}>RETAKE</button>
                            <button className="lm-manual" onClick={() => setMode('input')}>TYPE INSTEAD</button>
                        </div>
                    </div>
                )}

                {mode === 'input' && (
                    <>
                        <div className="lm-detect-row">
                            <button className="lm-detect" onClick={startCamera}>
                                <Camera size={18} /> <span>DETECT</span>
                            </button>
                            <label className="lm-upload">
                                <Image size={18} /> <span>UPLOAD</span>
                                <input type="file" accept="image/*" hidden onChange={useGallery} />
                            </label>
                        </div>
                        <div className="lm-search-wrap">
                            <Search size={15} className="lm-search-icon" />
                            <input className="lm-search" placeholder="Search any food..."
                                value={food} onChange={e => handleSearch(e.target.value)} />
                        </div>
                        {suggestions.length > 0 && (
                            <div className="lm-suggestions">
                                {suggestions.map((s, i) => (
                                    <button key={i} className="lm-sug" onClick={() => pickSuggestion(s)}>
                                        <span>{s.name}</span>
                                        <span className="lm-sug-c">{s.cals}kcal</span>
                                    </button>
                                ))}
                            </div>
                        )}
                        {suggestions.length === 0 && (
                            <div className="lm-quick">
                                <div className="lm-quick-title">TAP TO LOG:</div>
                                <div className="lm-quick-grid">
                                    {QUICK_PICKS.map(q => (
                                        <button key={q.name} className="lm-qp" onClick={() => {
                                            setFood(q.name); setCals(q.cals); setP(q.p); setC(q.c); setF(q.f);
                                        }}>
                                            <div className="lm-qp-name">{q.name}</div>
                                            <div className="lm-qp-cals">{q.cals} kcal</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="lm-fields">
                            <input className="lm-cals-in" type="number" placeholder="Calories" value={cals}
                                onChange={e => setCals(e.target.value)} />
                            <div className="lm-macro-inputs">
                                <input type="number" placeholder="P" value={p} onChange={e => setP(e.target.value)} />
                                <input type="number" placeholder="C" value={c} onChange={e => setC(e.target.value)} />
                                <input type="number" placeholder="F" value={f} onChange={e => setF(e.target.value)} />
                            </div>
                        </div>
                        <button className="lm-save" onClick={save} disabled={!food || !cals}>
                            ADD TO {getMealSlotLabel(slot).toUpperCase()}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}