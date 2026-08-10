import { useState } from 'react';
import { getMealSlotLabel } from '../utils/helpers';
import { FOOD_DB } from '../data/foodDB';
import KenneyIcon from './KenneyIcon';
import './Modal.css';

const SLOTS = ['breakfast', 'lunch', 'dinner', 'snacks'];

export default function LogMealModal({ open, onClose, onSave, slot, onSlotChange }) {
    const [food, setFood] = useState('');
    const [cals, setCals] = useState('');
    const [p, setP] = useState('');
    const [c, setC] = useState('');
    const [f, setF] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pickingSlot, setPickingSlot] = useState(false);

    if (!open) return null;

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    async function searchExternal(query) {
        if (query.length < 3) return;
        setLoading(true);
        try {
            const localMatches = FOOD_DB.filter(item =>
                item.name.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5);

            const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=10`);
            const data = await res.json();

            const apiMatches = (data.products || []).map(p => ({
                name: p.product_name || 'Unknown',
                cals: Math.round((p.nutriments?.['energy-kcal_100g'] || 0) * (p.product_quantity ? (parseFloat(p.product_quantity) / 100) : 1)),
                p: Math.round(p.nutriments?.proteins_100g || 0),
                c: Math.round(p.nutriments?.carbohydrates_100g || 0),
                f: Math.round(p.nutriments?.fat_100g || 0),
                fromApi: true,
                brand: p.brands ? p.brands.split(',')[0] : ''
            })).filter(i => i.name !== 'Unknown' && i.cals > 0);

            setSuggestions([...localMatches, ...apiMatches].slice(0, 15));
        } catch (e) {
            console.error("API Search failed", e);
        } finally {
            setLoading(false);
        }
    }

    const debouncedSearch = debounce((val) => searchExternal(val), 500);

    function handleFoodChange(e) {
        const val = e.target.value;
        setFood(val);
        if (val.length > 1) {
            debouncedSearch(val);
        } else {
            setSuggestions([]);
        }
    }

    function selectFood(item) {
        setFood(item.name);
        setCals(item.cals);
        setP(item.p);
        setC(item.c);
        setF(item.f);
        setSuggestions([]);
    }

    function handleSave() {
        if (!food || !cals) return;
        onSave(food, Number(cals), Number(p) || 0, Number(c) || 0, Number(f) || 0);
        setFood(''); setCals(''); setP(''); setC(''); setF(''); setSuggestions([]);
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <KenneyIcon name="food" size={24} />
                    <span style={{ fontWeight: 900, fontSize: 16, flex: 1 }}>LOG FOOD</span>
                    <button className="modal-close" onClick={onClose}><KenneyIcon name="cross" size={14} /></button>
                </div>

                <div className="slot-picker">
                    {SLOTS.map(s => (
                        <button key={s} className={`slot-btn ${slot === s ? 'active' : ''}`} onClick={() => onSlotChange(s)}>
                            {getMealSlotLabel(s)}
                        </button>
                    ))}
                </div>

                <div style={{ position: 'relative' }}>
                    <input
                        className="modal-input"
                        placeholder="Search food database..."
                        value={food}
                        onChange={handleFoodChange}
                        autoFocus
                    />
                    {suggestions.length > 0 && (
                        <div className="suggestions-list">
                            {suggestions.map((s, i) => (
                                <div key={i} className="suggestion-item" onClick={() => selectFood(s)}>
                                    <div>
                                        <div style={{ lineHeight: 1.2 }}>{s.name}</div>
                                        {s.brand && <div className="text-label" style={{ fontSize: 10, color: 'var(--c-volt)' }}>{s.brand}</div>}
                                    </div>
                                    <div className="text-label" style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>
                                        {s.cals}kcal {s.fromApi ? '(100g)' : ''}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {loading && <div className="suggestions-list" style={{ padding: 10, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Searching...</div>}
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                    <div style={{ flex: 1 }}>
                        <div className="text-label" style={{ fontSize: 10, color: 'var(--c-red)', marginBottom: 4 }}>CALORIES</div>
                        <input className="modal-input" placeholder="0" type="number" value={cals} onChange={e => setCals(e.target.value)} style={{ textAlign: 'center', fontSize: 24, padding: 8 }} />
                    </div>
                    
                    <div style={{ flex: 2, background: 'var(--c-black)', padding: '10px 12px', borderRadius: 12, border: '2px solid var(--c-black)', boxShadow: '4px 4px 0 rgba(0,0,0,0.1)' }}>
                        <div className="text-label" style={{ fontSize: 10, color: 'var(--c-volt)', marginBottom: 8, textAlign: 'center' }}>MACRO REPORT (g)</div>
                        <div className="macro-inputs" style={{ gap: 4 }}>
                            <div className="macro-input-group">
                                <label className="macro-label" style={{ color: 'var(--c-paper)' }}>P</label>
                                <input className="modal-input macro-field" placeholder="0" type="number" value={p} onChange={e => setP(e.target.value)} style={{ padding: '6px', fontSize: 16, background: '#333', color: 'white', border: 'none', borderRadius: 6, boxShadow: 'none' }} />
                            </div>
                            <div className="macro-input-group">
                                <label className="macro-label" style={{ color: 'var(--c-paper)' }}>C</label>
                                <input className="modal-input macro-field" placeholder="0" type="number" value={c} onChange={e => setC(e.target.value)} style={{ padding: '6px', fontSize: 16, background: '#333', color: 'white', border: 'none', borderRadius: 6, boxShadow: 'none' }} />
                            </div>
                            <div className="macro-input-group">
                                <label className="macro-label" style={{ color: 'var(--c-paper)' }}>F</label>
                                <input className="modal-input macro-field" placeholder="0" type="number" value={f} onChange={e => setF(e.target.value)} style={{ padding: '6px', fontSize: 16, background: '#333', color: 'white', border: 'none', borderRadius: 6, boxShadow: 'none' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <button className="btn btn-primary" onClick={handleSave} disabled={!food || !cals}
                    style={{ width: '100%', marginTop: 14, opacity: (!food || !cals) ? 0.4 : 1, padding: 12, fontSize: 14 }}>
                    ADD TO {getMealSlotLabel(slot).toUpperCase()}
                </button>
            </div>
        </div>
    );
}
