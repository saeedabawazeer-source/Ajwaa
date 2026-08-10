import { useState, useEffect, useCallback } from "react";
import { Bell, Copy } from 'lucide-react'; // For the notification bell and export

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
    <div style={{ height: 10, background: "#fff", border: "2px solid #111", borderRadius: 6, position: "relative", overflow: "hidden" }}>
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
      borderRadius: 16,
      background: done ? cfg.color : "#fff",
      boxShadow: "3px 3px 0 #111",
      padding: "8px 10px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 11, textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cfg.label}</span>
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 14 }}>{value}<span style={{ fontSize: 9, opacity: 0.6 }}>/{cfg.target}</span></span>
      </div>
      <Bar pct={pct} color="#111" />
      <div style={{ display: "flex", gap: 4 }}>
        <button
          onClick={() => onChange(Math.max(0, value - cfg.step))}
          style={btnStyle("#fff")}
        >−{cfg.step}</button>
        <button
          onClick={() => onChange(value + cfg.step)}
          style={btnStyle(cfg.color)}
        >+{cfg.step}</button>
      </div>
    </div>
  );
}

function btnStyle(bg) {
  return {
    flex: 1,
    border: "2px solid #111",
    borderRadius: 8,
    background: bg,
    fontFamily: "'Archivo Black', sans-serif",
    fontSize: 10,
    padding: "6px 0",
    cursor: "pointer",
    boxShadow: "2px 2px 0 #111",
    textTransform: "uppercase",
  };
}

function WaterWidget({ value, onChange }) {
  const target = 12;
  const pct = (value / target) * 100;
  return (
    <div style={{
      border: "2px solid #111", borderRadius: 16, background: value >= target ? "#3B82F6" : "#fff",
      boxShadow: "3px 3px 0 #111", padding: "8px 12px", display: "flex", gap: 12, alignItems: "center"
    }}>
      <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 13, textTransform: "uppercase" }}>WATER</div>
      <div style={{ flex: 1, height: 12, background: "#fff", border: "2px solid #111", borderRadius: 6, overflow: "hidden" }}>
        <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: "#3B82F6", transition: "width 200ms" }} />
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 14 }}>{value}<span style={{ fontSize: 10, opacity: 0.6 }}>/{target}</span></span>
        <button onClick={() => onChange(value + 1)} style={{ background: "#3B82F6", border: "2px solid #111", borderRadius: 8, padding: "4px 10px", fontFamily: "'Archivo Black', sans-serif", cursor: "pointer", boxShadow: "2px 2px 0 #111" }}>+1</button>
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
        borderRadius: 16,
        background: count >= 4 ? "#111" : "#fff",
        color: count >= 4 ? "#F5F0E6" : "#111",
        padding: "6px 10px",
        marginBottom: 6,
        cursor: "pointer",
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: 11,
      }}
    >
      <div>
        <div style={{ textTransform: "uppercase" }}>{cfg.label}</div>
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

export default function SaeedProtocolView() {
  const dateKey = TODAY_KEY();
  const { day, save, loading } = useDay(dateKey);
  const [notifPerm, setNotifPerm] = useState(typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default");

  const requestNotif = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const p = await Notification.requestPermission();
    setNotifPerm(p);
    if (p === "granted" && "serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "SCHEDULE_ACCUMULATION_REMINDER", intervalMinutes: 60 });
      new Notification("Buff Protocol Active", { body: "Reminders active. Time to grind.", icon: "/vite.svg" });
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

  const anytimeDoneCount = ANYTIME.filter((c) => (day?.anytime?.[c.id] || 0) >= c.target).length + ((day?.anytime?.water || 0) >= 12 ? 1 : 0);
  const growthDoneCount = GROWTH.filter((c) => (day?.growth?.[c.id] || 0) >= 4).length;
  const allDone = anytimeDoneCount === ANYTIME.length + 1 && growthDoneCount === GROWTH.length && day?.bend;

  const exportToObsidian = async () => {
    const md = `### Buff Protocol — ${dateKey}
- **Bend (Yoga)**: ${day?.bend ? "Done ✅" : "Missed ❌"}
- **Water**: ${day?.anytime?.water || 0}/12 cups
- **Push-ups**: ${day?.anytime?.pushups || 0}/500
- **Rows**: ${day?.anytime?.rows || 0}/125
- **Stomach Vacuums**: ${day?.anytime?.vacuums || 0}/15
- **Hollow Holds**: ${day?.anytime?.hollow || 0}/7
- **Growth Session**: ${growthDoneCount === GROWTH.length ? "Completed 🔥" : \`\${growthDoneCount}/\${GROWTH.length} done\`}`;
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
        button:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 #111 !important; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#111", color: "#F5F0E6", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 18, letterSpacing: -0.5, textTransform: "uppercase" }}>
            Buff Protocol
          </div>
          <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{dateKey} {allDone && "· ALL DONE 🔥"}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button 
            onClick={exportToObsidian}
            style={{ 
              background: '#F5F0E6', 
              border: '2px solid #111', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex' 
            }}>
            <Copy size={18} color="#111" />
          </button>
          <button 
            onClick={requestNotif}
            style={{ 
              background: notifPerm === 'granted' ? '#C0FF72' : '#F5F0E6', 
              border: '2px solid #111', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex' 
            }}>
            <Bell size={18} color="#111" />
          </button>
        </div>
      </div>

      {/* Main Content Pane (Scrollable if absolutely needed on tiny phones, but mostly fits) */}
      <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 10, flex: 1, overflowY: "auto", overflowX: "hidden" }}>

        {/* Bend / Yoga check */}
        <div
          onClick={() => save({ ...day, bend: !day.bend })}
          style={{
            border: "2px solid #111",
            borderRadius: 16,
            background: day?.bend ? "#01A0A1" : "#fff",
            color: day?.bend ? "#F5F0E6" : "#111",
            boxShadow: "3px 3px 0 #111",
            padding: "10px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 14, textTransform: "uppercase" }}>Bend (Yoga)</div>
          </div>
          <div style={{
            width: 24, height: 24, border: "2px solid " + (day?.bend ? "#F5F0E6" : "#111"), borderRadius: 8,
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
