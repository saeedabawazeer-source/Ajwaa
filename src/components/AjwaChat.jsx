import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, ImagePlus } from 'lucide-react';
import { getWelcomeMessage } from '../utils/ajwaChat';
import { askCoach } from '../utils/coachBrain';
import { isConfigured, providerLabel } from '../utils/aiProvider';
import './AjwaChat.css';

export default function AjwaChat({ open, onClose, totals, user, streak, today, xp, state, onCoachAction }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const [image, setImage] = useState(null);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const fileRef = useRef(null);

    // Reset chat + welcome message when opened
    useEffect(() => {
        if (open) {
            const welcome = getWelcomeMessage(user, totals, streak);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setMessages([{ role: 'ajwa', text: welcome }]);
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    // Auto-scroll to bottom
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    // The coach reads the data App already has; useStore() is a plain hook, so
    // a second call inside this component would return a different state.
    const context = { totals, user, streak, today, xp };

    function actionNote(a) {
        if (!a) return null;
        if (a.type === 'log_meal') return `Logged: ${a.food}`;
        if (a.type === 'swap_exercise') return `Swapped ${a.from} → ${a.to}`;
        if (a.type === 'set_split') return 'Split updated';
        return null;
    }

    async function reply(text, history, img) {
        const res = await askCoach({
            message: text,
            history,
            state,
            derived: context,
            ownerMode: Boolean(state?.ownerMode),
            image: img || null,
        });
        setMessages(prev => [...prev, {
            role: 'ajwa',
            text: res.text,
            note: res.note,
            action: res.action ? actionNote(res.action) : null,
        }]);
        setTyping(false);
        // The coach can act: log food, swap an exercise, change the split.
        if (res.action && onCoachAction) onCoachAction(res.action);
    }

    function handleSend() {
        const text = input.trim();
        if (!text && !image) return;

        setMessages(prev => [...prev, { role: 'user', text, image }]);
        setInput('');
        setImage(null);
        setTyping(true);
        reply(text, messages, image);
    }

    function pickFile(e) {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImage(String(reader.result));
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    // Quick action chips
    const chips = ['How am I doing?', 'Suggest a meal', 'Suggest a workout', 'My macros', 'Motivate me'];

    if (!open) return null;

    return (
        <div className="ajwa-overlay" onClick={onClose}>
            <div className="ajwa-panel" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="ajwa-header">
                    <div className="ajwa-header-left">
                        <div className="ajwa-logo" style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--c-volt)', display: 'grid', placeItems: 'center' }}>
                            <Sparkles size={20} color="var(--c-black)" />
                        </div>
                        <div>
                            <div className="ajwa-title">Ajwa</div>
                            <div className="ajwa-sub">
                                {isConfigured() ? `AI coach · ${providerLabel()}` : 'Your fitness AI'}
                            </div>
                        </div>
                    </div>
                    <button className="ajwa-close" onClick={onClose}><X size={18} /></button>
                </div>

                {/* Messages */}
                <div className="ajwa-messages" ref={scrollRef}>
                    {messages.map((msg, i) => (
                        <div key={i} className={`ajwa-bubble ${msg.role}`}>
                            {msg.role === 'ajwa' && (
                                <div className="ajwa-bubble-icon" style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--c-volt)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                                    <Bot size={14} color="var(--c-black)" />
                                </div>
                            )}
                            <div className="ajwa-bubble-text">
                                {msg.image && <img className="ajwa-img" src={msg.image} alt="attachment" />}
                                {msg.text}
                                {(msg.note || msg.action) && (
                                    <div className="ajwa-note">{msg.note || msg.action}</div>
                                )}
                            </div>
                        </div>
                    ))}
                    {typing && (
                        <div className="ajwa-bubble ajwa">
                            <div className="ajwa-bubble-icon" style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--c-volt)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                                <Bot size={14} color="var(--c-black)" />
                            </div>
                            <div className="ajwa-typing"><span /><span /><span /></div>
                        </div>
                    )}
                </div>

                {/* Quick chips (only show at start) */}
                {messages.length <= 1 && (
                    <div className="ajwa-chips">
                        {chips.map(c => (
                            <button key={c} className="ajwa-chip" onClick={() => {
                                setMessages(prev => [...prev, { role: 'user', text: c }]);
                                setInput('');
                                setTyping(true);
                                reply(c, messages);
                            }}>{c}</button>
                        ))}
                    </div>
                )}

                {/* Photo preview */}
                {image && (
                    <div className="ajwa-attach">
                        <img src={image} alt="attachment preview" />
                        <button onClick={() => setImage(null)} aria-label="Remove photo"><X size={13} /></button>
                    </div>
                )}

                {/* Input */}
                <div className="ajwa-input-row">
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={pickFile}
                    />
                    <button
                        className="ajwa-attach-btn"
                        onClick={() => fileRef.current?.click()}
                        aria-label="Send a photo"
                        title="Send a photo"
                    >
                        <ImagePlus size={19} />
                    </button>
                    <input
                        ref={inputRef}
                        className="ajwa-input"
                        placeholder="Ask Ajwa anything..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button className="ajwa-send" onClick={handleSend} disabled={!input.trim() && !image}>
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
