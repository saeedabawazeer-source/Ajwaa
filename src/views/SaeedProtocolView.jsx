import { useState, useEffect, useCallback } from "react";
import { Bell, Copy } from 'lucide-react';

const TODAY_KEY = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const ANYTIME = [
  { id: "pushups", label: "Push-ups", unit: "reps", target: 500, step: 25, color: "#FF4B3E" },
  { id: "rows", label: "Back Rows", unit: "reps", target: 125, step: 10, color: "#FFC93C" },
  { id: "vacuums", label: "Stomach Vacs", unit: "sets", target: 15, step: 1, color: "#C0FF72" },
  { id: "hollow", label: "Hollow Holds", unit: "sets", target: 7, step: 1, color: "#01A0A1" },
];

const GROWTH = [
  { id: "pike", label: "Pike Push-ups", scheme: "4 x 10–12" },
  { id: "split", label: "Bulgarian Split Squats", scheme: "4 x 12" },
  { id: "vups", label: "Weighted V-Ups", scheme: "4 x 15" },
  { id: "curls", label: "Bicep Curls (jugs)", scheme: "4 x 20" },
  { id: "plank", label: "Plank → Down Dog", scheme: "3 x 15" },
];

const BLANK_DAY = () => ({
  bend: false,
  anytime: { pushups: 0, vacuums: 0, hollow: 0, rows: 0, water: 0 },
  growth: { pike: 0, split: 0, vups: 0, curls: 0, plank: 0 },
});

function useDay(dateKey) {
  const [day, setDay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    try {
      const res = localStorage.getItem(`bufflog:${dateKey}`);
      if (!cancelled) setDay(res ? JSON.parse(res) : BLANK_DAY());
    } catch {
      if (!cancelled) setDay(BLANK_DAY());
    }
    if (!cancelled) setLoading(false);
    return () => { cancelled = true; };
  }, [dateKey]);

  const save = useCallback((next) => {
    setDay(next);
    try {
      localStorage.setItem(`bufflog:${dateKey}`, JSON.stringify(next));
    } catch (e) {
      console.error("save failed", e);
    }
  }, [dateKey]);

  return { day, save, loading };
}

function Bar({ pct, color }) {
  return (
    <div style={{ height: 8, background: "#fff", border: "2px solid #111", borderRadius: 4, position: "relative", overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: color, transition: "width 200ms" }} />
    </div>
  );
}

function AnytimeCard({ cfg, value, onChange }) {
  const pct = (value / cfg.target) * 100;
  const done = value >= cfg.target;
  return (
    <div style={{
      border: "2px solid #111",
      borderRadius: 12,
      background: done ? cfg.color : "#fff",
      color: "#111",
      boxShadow: "2px 2px 0 #111",
      padding: "6px 8px",
      display: "flex",
      flexDirection: "column",
      gap: 4,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 11, textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cfg.label}</span>
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 13 }}>{value}<span style={{ fontSize: 9, opacity: 0.6 }}>/{cfg.target}</span></span>
      </div>
      <Bar pct={pct} color="#111" />
      <div style={{ display: "flex", gap: 4 }}>
        <button
          onClick={() => onChange(Math.max(0, value - cfg.step))}
          style={btnStyle("#fff", "#111")}
        >−{cfg.step}</button>
        <button
          onClick={() => onChange(value + cfg.step)}
          style={btnStyle(cfg.color, "#111")}
        >+{cfg.step}</button>
      </div>
    </div>
  );
}

function btnStyle(bg, color) {
  return {
    flex: 1,
    border: "2px solid #111",
    borderRadius: 6,
    background: bg,
    color: color,
    fontFamily: "'Archivo Black', sans-serif",
    fontSize: 10,
    padding: "4px 0",
    cursor: "pointer",
    boxShadow: "1px 1px 0 #111",
    textTransform: "uppercase",
  };
}

function WaterWidget({ value, onChange }) {
  const target = 3.0; // 3 Liters
  const pct = (value / target) * 100;
  return (
    <div style={{
      border: "2px solid #111", borderRadius: 12, background: value >= target ? "#01A0A1" : "#fff",
      boxShadow: "2px 2px 0 #111", padding: "8px 12px", display: "flex", gap: 10, alignItems: "center"
    }}>
      <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 12, textTransform: "uppercase", color: value >= target ? "#F5F0E6" : "#111" }}>WATER</div>
      <div style={{ flex: 1, height: 10, background: "#fff", border: "2px solid #111", borderRadius: 5, overflow: "hidden" }}>
        <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: "#01A0A1", transition: "width 200ms" }} />
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 14, color: value >= target ? "#F5F0E6" : "#111" }}>{Number(value || 0).toFixed(1)}<span style={{ fontSize: 10, opacity: 0.8 }}>/{target.toFixed(1)}L</span></span>
        <button onClick={() => onChange(Number(((value || 0) + 0.5).toFixed(1)))} style={{ background: value >= target ? "#111" : "#01A0A1", color: value >= target ? "#F5F0E6" : "#111", border: "2px solid #111", borderRadius: 6, padding: "4px 8px", fontFamily: "'Archivo Black', sans-serif", fontSize: 10, cursor: "pointer", boxShadow: "1px 1px 0 #111" }}>+0.5</button>
      </div>
    </div>
  );
}

function GrowthRow({ cfg, count, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "2px solid #111",
        borderRadius: 12,
        background: count >= 4 ? "#111" : "#fff",
        color: count >= 4 ? "#F5F0E6" : "#111",
        padding: "6px 10px",
        marginBottom: 6,
        cursor: "pointer",
        fontFamily: "'Archivo Black', sans-serif",
      }}
    >
      <div>
        <div style={{ textTransform: "uppercase", fontSize: 11 }}>{cfg.label}</div>
        <div style={{ fontSize: 9, opacity: 0.7, fontWeight: 400 }}>{cfg.scheme}</div>
      </div>
      <div style={{ display: "flex", gap: 3 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            width: 12, height: 12,
            border: "2px solid " + (count >= 4 ? "#F5F0E6" : "#111"),
            borderRadius: 4,
            background: i < count ? "#C0FF72" : "transparent",
          }} />
        ))}
      </div>
    </div>
  );
}

function WeekCalendar({ selected, onSelect }) {
  const days = [];
  const today = new Date();
  const todayKey = TODAY_KEY();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const dayLabel = ["S", "M", "T", "W", "T", "F", "S"][d.getDay()];
    days.push({ key, label: dayLabel, date: d.getDate(), isToday: key === todayKey });
  }
  
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, padding: "0 2px", marginTop: 2 }}>
      {days.map(d => (
        <div 
          key={d.key}
          onClick={() => onSelect(d.key)}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            cursor: "pointer", opacity: d.key === selected ? 1 : 0.6
          }}
        >
          <div style={{ fontSize: 9, fontFamily: "'Archivo Black', sans-serif" }}>{d.label}</div>
          <div style={{ 
            width: 28, height: 28, borderRadius: "50%", 
            background: d.key === selected ? "#111" : "transparent",
            color: d.key === selected ? "#F5F0E6" : "#111",
            border: d.isToday ? "2px solid #01A0A1" : (d.key === selected ? "2px solid #111" : "2px solid #111"),
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Archivo Black', sans-serif", fontSize: 11,
            boxShadow: d.isToday && d.key === selected ? "0 0 0 2px #01A0A1" : "none"
          }}>
            {d.date}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SaeedProtocolView() {
  const [activeDateKey, setActiveDateKey] = useState(TODAY_KEY());
  const { day, save, loading } = useDay(activeDateKey);
  const [notifPerm, setNotifPerm] = useState(typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default");

  useEffect(() => {
    // Aggressive hourly spam timer if permissions are granted
    let interval;
    if (notifPerm === 'granted') {
      interval = setInterval(() => {
        if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: "SCHEDULE_ACCUMULATION_REMINDER" });
        } else if ("Notification" in window) {
          new Notification("SAEED PROTOCOL ALERT", { body: "DRINK WATER. DROP AND DO PUSHUPS. IS WHAT YOU'RE DOING RIGHT NOW WORTH THE REWARD?", icon: "/vite.svg" });
        }
      }, 60 * 60 * 1000); // 1 hour
    }
    return () => clearInterval(interval);
  }, [notifPerm]);

  const requestNotif = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const p = await Notification.requestPermission();
    setNotifPerm(p);
    if (p === "granted" && "serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "SCHEDULE_ACCUMULATION_REMINDER" });
      new Notification("SAEED PROTOCOL ACTIVE", { body: "Spam notifications ACTIVE. Prepare to grind.", icon: "/vite.svg" });
    }
  };

  if (loading || !day) {
    return <div style={{ fontFamily: "monospace", padding: 40, textAlign: "center" }}>Loading…</div>;
  }

  const setAnytime = (id, val) => save({ ...day, anytime: { ...(day?.anytime || {}), [id]: val } });
  const bumpGrowth = (id) => {
    const cur = day?.growth?.[id] || 0;
    const next = cur >= 4 ? 0 : cur + 1;
    save({ ...day, growth: { ...(day?.growth || {}), [id]: next } });
  };

  const anytimeDoneCount = ANYTIME.filter((c) => (day?.anytime?.[c.id] || 0) >= c.target).length + ((day?.anytime?.water || 0) >= 3.0 ? 1 : 0);
  const growthDoneCount = GROWTH.filter((c) => (day?.growth?.[c.id] || 0) >= 4).length;
  const allDone = anytimeDoneCount === ANYTIME.length + 1 && growthDoneCount === GROWTH.length && day?.bend;

  const exportToObsidian = async () => {
    const md = `### Saeed Protocol — ${activeDateKey}
- **Bend (Yoga)**: ${day?.bend ? "Done ✅" : "Missed ❌"}
- **Water**: ${day?.anytime?.water || 0}/3.0 Liters
- **Push-ups**: ${day?.anytime?.pushups || 0}/500
- **Rows**: ${day?.anytime?.rows || 0}/125
- **Stomach Vacuums**: ${day?.anytime?.vacuums || 0}/15
- **Hollow Holds**: ${day?.anytime?.hollow || 0}/7
- **Growth Session**: ${growthDoneCount === GROWTH.length ? "Completed 🔥" : `${growthDoneCount}/${GROWTH.length} done`}`;
    try {
      await navigator.clipboard.writeText(md);
      alert("Copied to clipboard for Obsidian!");
    } catch {
      alert("Failed to copy");
    }
  };

  return (
    <div style={{
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      background: "#F5F0E6",
      minHeight: "100vh",
      height: "100vh", /* Lock to screen */
      overflow: "hidden", /* No scroll on main container */
      display: "flex",
      flexDirection: "column",
      color: "#111",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap');
        * { box-sizing: border-box; }
        button:active { transform: translate(2px,2px); box-shadow: 0px 0px 0 #111 !important; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#111", color: "#F5F0E6", padding: "16px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 24, letterSpacing: -1, textTransform: "uppercase" }}>
            SAEED PROTOCOL
          </div>
          <div style={{ fontSize: 11, fontWeight: "bold", color: "#01A0A1", marginTop: 2, textTransform: "uppercase" }}>
            {activeDateKey} {allDone && "· ALL DONE 🔥"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button 
            onClick={exportToObsidian}
            style={{ 
              background: '#F5F0E6', color: '#111',
              border: '2px solid #111', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex' 
            }}>
            <Copy size={20} color="#111" />
          </button>
          <button 
            onClick={requestNotif}
            style={{ 
              background: notifPerm === 'granted' ? '#C0FF72' : '#F5F0E6', color: '#111',
              border: '2px solid #111', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex' 
            }}>
            <Bell size={20} color="#111" />
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div style={{ padding: "8px 10px 10px 10px", display: "flex", flexDirection: "column", gap: 8, flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        
        <WeekCalendar selected={activeDateKey} onSelect={setActiveDateKey} />

        {/* Bend / Yoga check */}
        <div
          onClick={() => save({ ...day, bend: !day.bend })}
          style={{
            border: "2px solid #111",
            borderRadius: 12,
            background: day?.bend ? "#01A0A1" : "#fff",
            color: day?.bend ? "#F5F0E6" : "#111",
            boxShadow: "2px 2px 0 #111",
            padding: "8px 12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 13, textTransform: "uppercase" }}>Bend (Yoga)</div>
          </div>
          <div style={{
            width: 20, height: 20, border: "2px solid " + (day?.bend ? "#F5F0E6" : "#111"), borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Archivo Black', sans-serif", fontSize: 12
          }}>{day?.bend ? "✓" : ""}</div>
        </div>

        {/* Anytime List */}
        <div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 11, textTransform: "uppercase", marginBottom: 6, borderBottom: "2px solid #111", paddingBottom: 2 }}>
            Anytime List — {anytimeDoneCount}/{ANYTIME.length + 1}
          </div>
          <WaterWidget value={day?.anytime?.water || 0} onChange={(v) => setAnytime("water", v)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
            {ANYTIME.map((cfg) => (
              <AnytimeCard key={cfg.id} cfg={cfg} value={day?.anytime?.[cfg.id] || 0} onChange={(v) => setAnytime(cfg.id, v)} />
            ))}
          </div>
        </div>

        {/* Growth Session */}
        <div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 11, textTransform: "uppercase", marginBottom: 6, borderBottom: "2px solid #111", paddingBottom: 2 }}>
            Growth Session — Tap to Log
          </div>
          {GROWTH.map((cfg) => (
            <GrowthRow key={cfg.id} cfg={cfg} count={day?.growth?.[cfg.id] || 0} onToggle={() => bumpGrowth(cfg.id)} />
          ))}
        </div>
        
      </div>
    </div>
  );
}
