import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { generateAjwaResponse, getWelcomeMessage } from '../utils/ajwaChat';
import './AjwaChat.css';

export default function AjwaChat({ open, onClose, totals, user, streak, today, xp }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    // Reset chat + welcome message when opened
    useEffect(() => {
        if (open) {
            const welcome = getWelcomeMessage(user, totals, streak);
            setMessages([{ role: 'ajwa', text: welcome }]);
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [open]);

    // Auto-scroll to bottom
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    function handleSend() {
        const text = input.trim();
        if (!text) return;

        const userMsg = { role: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setTyping(true);

        // Simulate typing delay
        setTimeout(() => {
            const response = generateAjwaResponse(text, { totals, user, streak, today, xp });
            setMessages(prev => [...prev, { role: 'ajwa', text: response }]);
            setTyping(false);
        }, 400 + Math.random() * 600);
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
                        <div className="ajwa-logo"><Sparkles size={16} /></div>
                        <div>
                            <div className="ajwa-title">Ajwa</div>
                            <div className="ajwa-sub">Your fitness AI</div>
                        </div>
                    </div>
                    <button className="ajwa-close" onClick={onClose}><X size={18} /></button>
                </div>

                {/* Messages */}
                <div className="ajwa-messages" ref={scrollRef}>
                    {messages.map((msg, i) => (
                        <div key={i} className={`ajwa-bubble ${msg.role}`}>
                            {msg.role === 'ajwa' && <div className="ajwa-bubble-icon"><Sparkles size={10} /></div>}
                            <div className="ajwa-bubble-text">{msg.text}</div>
                        </div>
                    ))}
                    {typing && (
                        <div className="ajwa-bubble ajwa">
                            <div className="ajwa-bubble-icon"><Sparkles size={10} /></div>
                            <div className="ajwa-typing"><span /><span /><span /></div>
                        </div>
                    )}
                </div>

                {/* Quick chips (only show at start) */}
                {messages.length <= 1 && (
                    <div className="ajwa-chips">
                        {chips.map(c => (
                            <button key={c} className="ajwa-chip" onClick={() => {
                                setInput(c);
                                setTimeout(() => {
                                    setMessages(prev => [...prev, { role: 'user', text: c }]);
                                    setTyping(true);
                                    setTimeout(() => {
                                        const r = generateAjwaResponse(c, { totals, user, streak, today, xp });
                                        setMessages(prev => [...prev, { role: 'ajwa', text: r }]);
                                        setTyping(false);
                                    }, 500);
                                }, 50);
                            }}>{c}</button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <div className="ajwa-input-row">
                    <input
                        ref={inputRef}
                        className="ajwa-input"
                        placeholder="Ask Ajwa anything..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button className="ajwa-send" onClick={handleSend} disabled={!input.trim()}>
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
